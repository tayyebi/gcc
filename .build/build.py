#!/usr/bin/env python3
"""Generate the themed static site from the Markdown in .source/.

The repository is served by serve-md, which renders Markdown into a minimal,
deliberately unstyled shell. A stylesheet cannot be attached to a Markdown page:
serve-md escapes raw HTML and has no theming hook. Hand-written ``.html`` files,
however, are served verbatim, and so are static assets -- which is what this
script produces.

    .source/<lang>/**/*.md   ->   <lang>/**/index.html
    .source/index.md         ->   index.html

Every page becomes a directory holding an ``index.html``, so every public URL is
pretty -- ``/en_us/products/bitumen-60-70``, never an extension -- and no
directory is ever left without an index for serve-md to fall back to a listing.
Relative links in the Markdown cannot simply be carried over, because the page
moves a level deeper than its source; they are recomputed from the real output
paths instead (see ``output_for``).

Run it after editing anything under .source/ and commit the result. There is no
build step at deploy time -- the server does ``git pull`` then
``docker-compose up``, so the generated HTML is part of the repository.

Requires:  pip install markdown pyyaml
"""

from __future__ import annotations

import json
import os
import re
import sys
from pathlib import Path

import markdown
import yaml

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / ".source"
I18N = Path(__file__).resolve().parent / "i18n.json"

# --------------------------------------------------------------------------
# Site configuration (previously hugo.toml)
# --------------------------------------------------------------------------

SITE = {
    "name": "Global Commerce Council",
    "tagline": "Connecting Global Markets Through Innovation",
    "description": (
        "Global Commerce Council - Connecting businesses worldwide through "
        "commerce in Ceramics, Gypsum, Petroleum, and more."
    ),
    "domain": "globalcommercecouncil.com",
    "email": "info@globalcommercecouncil.com",
    "email_support": "support@globalcommercecouncil.com",
    "logo": "/static/images/logo.svg",
    "og_image": "/static/images/og-image.jpg",
    "twitter": "@globalcommerce",
    "linkedin": "globalcommercecouncil",
    "version": "1.0.0",
    "theme_color": "#215E61",
}

# Language order, display name, BCP-47 code, and whether the script is RTL.
LANGS = [
    ("en_us", "English", "en-US", False),
    ("ru_ru", "Русский", "ru-RU", False),
    ("ar_iq", "العربية (العراق)", "ar-IQ", True),
    ("hy_am", "Հայերեն", "hy-AM", False),
    ("fa_ir", "فارسی", "fa-IR", True),
    ("ar_ae", "العربية (الإمارات)", "ar-AE", True),
]
RTL = {lang for lang, _, _, rtl in LANGS if rtl}
LANG_NAME = {lang: name for lang, name, _, _ in LANGS}
LANG_CODE = {lang: code for lang, _, code, _ in LANGS}
# The two Arabic editions use the Arabic site title.
AR_SITE_TITLE = "مجلس التجارة العالمي"

# Main navigation: (i18n key suffix, path relative to the language root,
# is it a directory with an index, does it own a mega-menu of categories).
NAV = [
    ("products", "products", True, True),
    ("knowledge_base", "knowledge-base", True, False),
    ("tools", "tools", True, False),
    ("country_guides", "country-guides", True, False),
    ("supply_chain", "supply-chain", True, False),
    ("about", "about", False, False),
    ("suppliers", "suppliers", True, False),
    ("contact", "contact", False, False),
]

# The four product categories, shown in the products mega-menu and the footer.
CATEGORIES = ["ceramics", "gypsum", "petroleum", "other"]

BOOTSTRAP_CSS = (
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
)
BOOTSTRAP_ICONS = (
    "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/"
    "bootstrap-icons.min.css"
)
GOOGLE_FONTS = (
    "https://fonts.googleapis.com/css2?"
    "family=Inter:wght@300;400;500;600&family=Outfit:wght@400;500;600;700;800"
    "&display=swap"
)
MERMAID_JS = "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"

# Bootstrap's table classes, which Hugo used to inject with a render hook.
TABLE_CLASSES = "table table-striped table-hover table-bordered align-middle"


# --------------------------------------------------------------------------
# Markdown -> HTML
# --------------------------------------------------------------------------

MD = markdown.Markdown(
    # No "smarty": it silently rewrites straight quotes, dashes and ellipses,
    # which would alter product specifications in all six languages.
    extensions=["tables", "fenced_code", "sane_lists"],
    output_format="html5",
)


def markdown_to_html(body: str) -> str:
    """Render a Markdown body to HTML, then apply the Bootstrap table classes
    Hugo's render-table.html used to add."""
    MD.reset()
    html = MD.convert(body)
    html = style_tables(html)
    return html


def style_tables(html: str) -> str:
    """Wrap every table in .table-responsive and give it the Bootstrap classes,
    mirroring layouts/_default/_markup/render-table.html."""

    def repl(m: re.Match) -> str:
        table = m.group(0)
        table = re.sub(r"<table>", f'<table class="{TABLE_CLASSES}">', table, count=1)
        return f'<div class="table-responsive my-4">\n{table}\n</div>'

    return re.sub(r"<table>.*?</table>", repl, html, flags=re.S)


MERMAID_RE = re.compile(
    r"<pre><code class=\"language-mermaid\">(.*?)</code></pre>", re.S
)


def protect_mermaid(html: str) -> tuple[str, bool]:
    """Turn a fenced mermaid block into <pre class="mermaid">, the element
    mermaid.js initialises on. Returns the HTML and whether it has any."""
    found = False

    def repl(m: re.Match) -> str:
        nonlocal found
        found = True
        import html as _html

        return '<pre class="mermaid">%s</pre>' % _html.unescape(m.group(1))

    return MERMAID_RE.sub(repl, html), found


# --------------------------------------------------------------------------
# Link rewriting
# --------------------------------------------------------------------------

def source_to_output(src_file: Path) -> Path:
    """Where a source document is written: its path with .md dropped and
    ``index.html`` appended, so every page is a directory with an index.

    ``.source/index.md``               -> ``index.html``
    ``.source/en_us/index.md``         -> ``en_us/index.html``
    ``.source/en_us/products/index.md``-> ``en_us/products/index.html``
    ``.source/en_us/products/x.md``    -> ``en_us/products/x/index.html``
    """
    stem = str(src_file.relative_to(SRC).with_suffix(""))
    # An index.md names its own directory, so it contributes no path segment.
    if stem.endswith("/index"):
        stem = stem[: -len("/index")]
    elif stem == "index":
        stem = ""
    if stem == "":
        return ROOT / "index.html"
    return ROOT / stem / "index.html"


def output_for(target: str, src_dir: Path, out_dir: Path) -> str:
    """Map a link found in the source to the URL of the page it names.

    The generator writes every page next to its source with a ``.html``
    extension, so a link to ``../contact.md`` becomes ``../contact.html`` and a
    link to a section by directory name -- ``../products``, which names
    ``products/index.md`` -- becomes ``../products.html``. Anything that is not
    a generated page (an external URL, an anchor, a real file such as
    ``llms.txt``) is returned untouched.
    """
    if target.startswith(("http://", "https://", "mailto:", "#", "/")):
        return target
    path, sep, frag = target.partition("#")
    query = ""
    if "?" in path:
        path, _, query = path.partition("?")
        query = "?" + query

    if path.endswith(".md"):
        candidates = [src_dir / path]
    else:
        stripped = path.rstrip("/")
        # '', '.', '..', '../..' all name a directory rather than a document.
        if stripped in ("", ".", "..") or stripped.endswith(("/.", "/..")):
            candidates = [(src_dir / path) / "index.md"]
        else:
            # A bare name may be a document (contact.md) or a section
            # (products/index.md); try both before giving up.
            candidates = [src_dir / f"{stripped}.md",
                          src_dir / stripped / "index.md"]

    for src_file in candidates:
        try:
            src_file = src_file.resolve()
        except OSError:
            continue
        if src_file.is_file():
            return os.path.relpath(source_to_output(src_file), out_dir) + sep + frag + query

    # Not a generated page. It may still be a real file at the repository root
    # (llms.txt, README.md, compose.yaml). The source tree mirrors the served
    # tree, so resolve the link there and re-relativise it from this page's
    # output directory, which sits one level deeper than the source did.
    intended = os.path.normpath(
        os.path.join(str(src_dir.relative_to(SRC)), path)
    )
    if (ROOT / intended).is_file():
        return os.path.relpath(ROOT / intended, out_dir) + sep + frag + query
    return target


# Applied to rendered HTML, where Markdown links are already anchors.
ANCHOR_RE = re.compile(r'(<a\b[^>]*\bhref=")([^"]*)(")')


def rewrite_links(html: str, src_dir: Path, out_dir: Path) -> str:
    return ANCHOR_RE.sub(
        lambda m: m.group(1) + output_for(m.group(2), src_dir, out_dir) + m.group(3),
        html,
    )


# --------------------------------------------------------------------------
# Front matter
# --------------------------------------------------------------------------

def split_doc(text: str) -> tuple[dict, str]:
    """Split YAML front matter from the body. The delimiter is '---', which is
    also what serve-md strips."""
    m = re.match(r"^---\s*\n(.*?)\n---\s*\n?(.*)$", text, re.S)
    if not m:
        return {}, text
    try:
        meta = yaml.safe_load(m.group(1)) or {}
    except yaml.YAMLError:
        meta = {}
    return meta, m.group(2)


def first_h1(body: str) -> str | None:
    m = re.match(r"\s*#\s+(.+?)\s*$", body, re.M)
    return m.group(1).strip() if m else None


def strip_first_h1(body: str) -> str:
    """Remove the leading '# Title' so the template can emit the styled one,
    exactly as Hugo did -- the body never carried its own H1."""
    return re.sub(r"\s*#\s+(.+?)\s*\n", "", body, count=1).lstrip("\n")


# --------------------------------------------------------------------------
# Page shell
# --------------------------------------------------------------------------

def esc(s: str) -> str:
    return (
        s.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def chrome(t: dict, key: str, default: str = "") -> str:
    return t.get(key, default)


def build_page(
    lang: str,
    rel: str,            # path relative to the language root, no extension
    base: str,           # relative URL from this page to its language root
    home: str,           # relative URL to the language home page
    title: str,
    description: str,
    date: str | None,
    body_html: str,
    has_mermaid: bool,
    t: dict,
    lang_hrefs: dict[str, str],
) -> str:
    rtl = lang in RTL
    site_title = AR_SITE_TITLE if lang in ("ar_iq", "ar_ae") else SITE["name"]
    full_title = f"{title} | {site_title}"
    up = base
    # Absolute asset URLs: the stylesheet must resolve from any depth.
    css = "/static/css/custom.css"
    favicon = "/static/favicon.svg"
    logo = "/static/images/logo.svg"

    html_dir = f' dir="rtl"' if rtl else ""
    body_cls = ' class="rtl"' if rtl else ""

    # ---- language switcher -------------------------------------------------
    lang_items = []
    for code, name, _, _ in LANGS:
        active = " is-active" if code == lang else ""
        # The entry for the language you are reading goes to that language's
        # home page rather than to "./", which on a page like
        # products/bitumen-60-70.html would name a directory with no index.
        href = home if code == lang else lang_hrefs[code]
        lang_items.append(
            f'<li role="none"><a class="dropdown-entry{active}" role="menuitem" '
            f'href="{esc(href)}">{esc(name)}</a></li>'
        )
    lang_menu = "\n            ".join(lang_items)

    # ---- main navigation ---------------------------------------------------
    nav_items = []
    for key, path, is_dir, has_mega in NAV:
        href = f"{up}{path}/"
        active = " is-active" if path == rel or rel.startswith(path + "/") else ""
        label = chrome(t, f"nav_{key}", path.replace("-", " ").title())
        if has_mega:
            cols = []
            for cat in CATEGORIES:
                cat_label = chrome(t, f"mega_{cat}", cat.title())
                icon = {
                    "ceramics": "bi-bricks",
                    "gypsum": "bi-building",
                    "petroleum": "bi-droplet",
                    "other": "bi-grid",
                }[cat]
                desc = {
                    "ceramics": "Tiles, porcelain, sanitary ware",
                    "gypsum": "Boards, plaster, compounds",
                    "petroleum": "Crude oil, diesel, bitumen",
                    "other": "Chemicals, rubber, metals",
                }[cat]
                cols.append(
                    f'''<div class="mega-col">
                    <a class="mega-link" href="{up}categories/{cat}/" role="menuitem">
                      <span class="mega-icon"><i class="bi {icon}" aria-hidden="true"></i></span>
                      <span class="mega-text">
                        <span class="mega-title">{esc(cat_label)}</span>
                        <span class="mega-desc">{esc(desc)}</span>
                      </span>
                    </a>
                  </div>'''
                )
            mega = f'''
            <div class="mega-menu" role="menu" aria-labelledby="megaProductsBtn">
              <div class="container">
                <div class="mega-grid">
                  {chr(10).join("                  " + c for c in cols)}
                </div>
                <div class="mega-footer">
                  <a class="mega-all-link" href="{href}" role="menuitem">
                    {esc(label)} <i class="bi bi-arrow-right" aria-hidden="true"></i>
                  </a>
                </div>
              </div>
            </div>'''
            nav_items.append(
                f'''<li class="nav-item has-mega" role="none">
            <a class="nav-link{active}" href="{href}" role="menuitem" aria-haspopup="true" aria-expanded="false" id="megaProductsBtn">
              {esc(label)}
              <i class="bi bi-chevron-down nav-chevron" aria-hidden="true"></i>
            </a>{mega}
          </li>'''
            )
        elif key == "contact":
            nav_items.append(
                f'''<li class="nav-item nav-item-cta" role="none">
            <a class="nav-link nav-cta{active}" href="{href}" role="menuitem">{esc(label)}</a>
          </li>'''
            )
        else:
            nav_items.append(
                f'''<li class="nav-item" role="none">
            <a class="nav-link{active}" href="{href}" role="menuitem">{esc(label)}</a>
          </li>'''
            )
    nav_html = "\n          ".join(nav_items)

    # ---- mobile navigation -------------------------------------------------
    mobile_items = []
    for key, path, is_dir, has_mega in NAV:
        href = f"{up}{path}/"
        active = " is-active" if path == rel or rel.startswith(path + "/") else ""
        label = chrome(t, f"nav_{key}", path.replace("-", " ").title())
        if has_mega:
            subs = "\n              ".join(
                f'<li role="none"><a class="mobile-sub-link" '
                f'href="{up}categories/{c}/" role="menuitem">'
                f"{esc(chrome(t, 'mega_' + c, c.title()))}</a></li>"
                for c in CATEGORIES
            )
            mobile_items.append(
                f'''<li class="mobile-nav-item" role="none">
            <a class="mobile-nav-link{active}" href="{href}" role="menuitem">
              {esc(label)}
              <i class="bi bi-plus mobile-expand-icon" aria-hidden="true"></i>
            </a>
            <ul class="mobile-sub-list" role="menu">
              {subs}
            </ul>
          </li>'''
            )
        else:
            mobile_items.append(
                f'''<li class="mobile-nav-item" role="none">
            <a class="mobile-nav-link{active}" href="{href}" role="menuitem">{esc(label)}</a>
          </li>'''
            )
    mobile_nav = "\n          ".join(mobile_items)

    # ---- mobile language list ---------------------------------------------
    mobile_langs = "\n              ".join(
        f'<a class="mobile-lang-link{" is-active" if c == lang else ""}" '
        f'href="{esc(home if c == lang else lang_hrefs[c])}">{esc(n)}</a>'
        for c, n, _, _ in LANGS
    )

    # ---- footer ------------------------------------------------------------
    footer_links = "\n            ".join(
        f'<li><a href="{up}{p}/">{esc(chrome(t, f"nav_{k}", k.replace("_", " ").title()))}</a></li>'
        for k, p, d, _ in NAV
    )
    footer_cats = "\n            ".join(
        f'<li><a href="{up}categories/{c}/">'
        f"{esc(chrome(t, 'mega_' + c, c.title()))}</a></li>"
        for c in CATEGORIES
    )

    date_html = (
        f'\n      <p class="text-muted">\n'
        f'        <time datetime="{esc(date)}">{esc(date)}</time>\n'
        f"      </p>"
        if date
        else ""
    )

    mermaid_js = ""
    if has_mermaid:
        mermaid_js = f'''
  <script src="{MERMAID_JS}" defer></script>
  <script defer>
    document.addEventListener('DOMContentLoaded', function () {{
      if (window.mermaid) {{
        mermaid.initialize({{ startOnLoad: false, theme: 'default', securityLevel: 'loose' }});
        mermaid.run({{ querySelector: '.mermaid' }});
      }}
    }});
  </script>'''

    return f'''<!DOCTYPE html>
<html lang="{LANG_CODE[lang]}"{html_dir}>
<head>
  <meta charset="utf-8">
  <title>{esc(full_title)}</title>
  <meta name="description" content="{esc(description)}">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="color-scheme" content="light dark">
  <meta name="theme-color" content="{SITE['theme_color']}">
  <script>
    (function () {{
      var theme = localStorage.getItem('theme');
      var html = document.documentElement;
      if (theme === 'dark') {{
        html.setAttribute('data-theme', 'dark');
        html.setAttribute('data-bs-theme', 'dark');
      }} else if (theme === 'light') {{
        html.removeAttribute('data-theme');
        html.removeAttribute('data-bs-theme');
      }} else {{
        html.removeAttribute('data-theme');
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {{
          html.setAttribute('data-bs-theme', 'dark');
        }} else {{
          html.removeAttribute('data-bs-theme');
        }}
      }}
    }})();
  </script>
  <meta property="og:title" content="{esc(full_title)}">
  <meta property="og:description" content="{esc(description)}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="{esc(SITE['name'])}">
  <meta property="og:image" content="{SITE['og_image']}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{esc(full_title)}">
  <meta name="twitter:description" content="{esc(description)}">
  <meta name="twitter:image" content="{SITE['og_image']}">
  <link rel="icon" type="image/svg+xml" href="{favicon}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="{GOOGLE_FONTS}" rel="stylesheet">
  <link href="{BOOTSTRAP_CSS}" rel="stylesheet" crossorigin="anonymous">
  <link rel="stylesheet" href="{BOOTSTRAP_ICONS}">
  <link rel="stylesheet" href="{css}">
  <link rel="stylesheet" href="/static/css/site.css">{mermaid_js}
</head>
<body{body_cls}>
  <a class="visually-hidden-focusable p-3 position-absolute top-0 start-0 bg-primary text-white" href="#main-content" style="z-index: 2000;">{esc(chrome(t, 'skip_to_content', 'Skip to content'))}</a>

  <header class="site-header" id="siteHeader"{html_dir}>
    <div class="utility-bar">
      <div class="container d-flex align-items-center justify-content-between">
        <a href="mailto:{SITE['email']}" class="utility-email" title="{esc(chrome(t, 'send_email', 'Send email'))}">
          <i class="bi bi-envelope-fill" aria-hidden="true"></i>
          <span>{SITE['email']}</span>
        </a>
        <div class="utility-actions">
          <button class="utility-btn" id="themeToggle" type="button" aria-label="Toggle dark mode" title="Toggle theme">
            <i class="bi bi-moon-fill" aria-hidden="true"></i>
          </button>
          <div class="utility-dropdown" id="langDropdown">
            <button class="utility-btn" id="langToggle" type="button" aria-label="Change language" title="Language" aria-expanded="false" aria-haspopup="true">
              <i class="bi bi-globe" aria-hidden="true"></i>
              <span class="lang-label">{esc(LANG_NAME[lang])}</span>
              <i class="bi bi-chevron-down lang-chevron" aria-hidden="true"></i>
            </button>
            <ul class="dropdown-panel" role="menu">
            {lang_menu}
            </ul>
          </div>
        </div>
      </div>
    </div>

    <nav class="main-nav" aria-label="Main navigation">
      <div class="container nav-inner">
        <a class="nav-logo" href="{up}" title="{esc(SITE['name'])}">
          <img src="{logo}" alt="{esc(SITE['name'])}" width="36" height="36" loading="eager">
          <span class="nav-logo-text">{esc(SITE['name'])}</span>
        </a>

        <ul class="nav-links" role="menubar">
          {nav_html}
        </ul>

        <button class="nav-hamburger" id="menuToggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobileOverlay">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
      </div>
    </nav>

    <div class="mobile-overlay" id="mobileOverlay" aria-hidden="true" role="dialog" aria-label="Navigation menu">
      <div class="mobile-overlay-header">
        <a class="nav-logo" href="{up}" title="{esc(SITE['name'])}">
          <img src="{logo}" alt="{esc(SITE['name'])}" width="32" height="32" loading="eager">
          <span class="nav-logo-text">{esc(SITE['name'])}</span>
        </a>
        <button class="mobile-close" id="menuClose" type="button" aria-label="Close menu">
          <i class="bi bi-x-lg" aria-hidden="true"></i>
        </button>
      </div>

      <div class="mobile-overlay-body">
        <ul class="mobile-nav-list" role="menubar">
          {mobile_nav}
        </ul>
      </div>

      <div class="mobile-overlay-footer">
        <div class="mobile-footer-actions">
          <div class="mobile-theme-toggle" role="group" aria-label="Theme toggle">
            <button class="mobile-theme-btn" data-theme-value="light" type="button" aria-label="Light mode">
              <i class="bi bi-sun-fill" aria-hidden="true"></i>
            </button>
            <button class="mobile-theme-btn" data-theme-value="dark" type="button" aria-label="Dark mode">
              <i class="bi bi-moon-fill" aria-hidden="true"></i>
            </button>
            <button class="mobile-theme-btn" data-theme-value="auto" type="button" aria-label="Auto theme">
              <i class="bi bi-display" aria-hidden="true"></i>
            </button>
          </div>
          <div class="mobile-lang-list">
              {mobile_langs}
          </div>
        </div>
      </div>
    </div>
  </header>

  <main id="main-content">
    <div class="container my-5">
      <article>
        <header class="mb-4">
          <h1 class="display-4 fw-bold">{esc(title)}</h1>{date_html}
        </header>
        <div class="content">
          {body_html}
        </div>
      </article>
    </div>
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-top">
        <div class="footer-brand">
          <a class="footer-logo" href="{up}" title="{esc(SITE['name'])}">
            <img src="{logo}" alt="{esc(SITE['name'])}" width="28" height="28">
            <span>{esc(SITE['name'])}</span>
          </a>
          <p class="footer-tagline">{esc(SITE['tagline'])}</p>
          <div class="footer-social">
            <a href="https://twitter.com/{SITE['twitter'].lstrip('@')}" class="footer-social-link" aria-label="Twitter" target="_blank" rel="noopener">
              <i class="bi bi-twitter-x" aria-hidden="true"></i>
            </a>
            <a href="https://linkedin.com/company/{SITE['linkedin']}" class="footer-social-link" aria-label="LinkedIn" target="_blank" rel="noopener">
              <i class="bi bi-linkedin" aria-hidden="true"></i>
            </a>
          </div>
        </div>

        <div class="footer-newsletter">
          <h4 class="footer-heading">{esc(chrome(t, 'footer_intelligence', 'Market Intelligence Updates'))}</h4>
          <p class="footer-newsletter-desc">{esc(chrome(t, 'footer_subscribe_text', ''))}</p>
          <form class="footer-form" onsubmit="event.preventDefault();">
            <label for="footer-subscribe-email" class="visually-hidden">{esc(chrome(t, 'footer_email_placeholder', 'your@business.email'))}</label>
            <input type="email" id="footer-subscribe-email" class="footer-input" placeholder="{esc(chrome(t, 'footer_email_placeholder', 'your@business.email'))}" required>
            <button class="footer-btn" type="submit">
              <i class="bi bi-arrow-right" aria-hidden="true"></i>
            </button>
          </form>
        </div>
      </div>

      <div class="footer-links">
        <div class="footer-col">
          <h5 class="footer-heading">{esc(chrome(t, 'footer_quick_links', 'Quick Links'))}</h5>
          <ul class="footer-list">
            {footer_links}
          </ul>
        </div>

        <div class="footer-col">
          <h5 class="footer-heading">{esc(chrome(t, 'footer_categories', 'Categories'))}</h5>
          <ul class="footer-list">
            {footer_cats}
          </ul>
        </div>

        <div class="footer-col">
          <h5 class="footer-heading">{esc(chrome(t, 'footer_contact_us', 'Contact Us'))}</h5>
          <ul class="footer-list footer-contact">
            <li>
              <i class="bi bi-envelope" aria-hidden="true"></i>
              <a href="mailto:{SITE['email']}">{SITE['email']}</a>
            </li>
            <li>
              <i class="bi bi-envelope" aria-hidden="true"></i>
              <a href="mailto:{SITE['email_support']}">{SITE['email_support']}</a>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="footer-copy">&copy; {esc(SITE['name'])}. {esc(chrome(t, 'footer_all_rights', 'All rights reserved.'))}</p>
        <div class="footer-legal">
          <a href="{up}privacy/">{esc(chrome(t, 'footer_privacy', 'Privacy Policy'))}</a>
          <a href="{up}terms/">{esc(chrome(t, 'footer_terms', 'Terms of Service'))}</a>
          <span class="footer-version">v{SITE['version']}</span>
        </div>
      </div>
    </div>
  </footer>

  <script src="/static/js/main.js" defer></script>
</body>
</html>
'''


# --------------------------------------------------------------------------
# Build
# --------------------------------------------------------------------------

def collect() -> list[tuple[str, Path, str]]:
    """Every source document as (language, absolute path, path relative to the
    language root without its .md extension).

    An ``index.md`` names its directory, so ``en_us/supply-chain/index.md``
    becomes the relative path ``supply-chain`` and is emitted as
    ``en_us/supply-chain/index.html`` -- one index, not two.
    """
    docs = []
    for lang, *_ in LANGS:
        base = SRC / lang
        if not base.is_dir():
            continue
        for path in sorted(base.rglob("*.md")):
            rel = path.relative_to(base).with_suffix("").as_posix()
            # "index.md" names its own directory: a language-root index.md is
            # the language home page, a nested one names that directory.
            if rel == "index":
                rel = ""
            elif rel.endswith("/index"):
                rel = rel[: -len("/index")]
            docs.append((lang, path, rel))
    return docs


def source_for(lang: str, rel: str) -> Path | None:
    """The source file a relative path came from, or None if that language has
    no such page (used by the language switcher)."""
    for candidate in (SRC / lang / f"{rel}.md", SRC / lang / rel / "index.md"):
        if candidate.exists():
            return candidate
    return None


def language_hrefs(lang: str, rel: str, is_root: bool) -> dict[str, str]:
    """Where the language switcher should point for each language: the same
    page if it exists, otherwise that language's home page."""
    hrefs = {}
    for code, *_ in LANGS:
        if code == lang:
            hrefs[code] = "./"
            continue
        if is_root:
            hrefs[code] = f"/{code}/"
            continue
        if rel and source_for(code, rel) is not None:
            hrefs[code] = f"/{code}/{rel}"
        else:
            hrefs[code] = f"/{code}/"
    return hrefs


def build() -> int:
    i18n = json.loads(I18N.read_text(encoding="utf-8"))
    docs = collect()
    written = 0

    for lang, path, rel in docs:
        t = i18n.get(lang, {})
        meta, body = split_doc(path.read_text(encoding="utf-8"))

        # The body carries its own H1 (added when Hugo was dropped so serve-md
        # could name the document). The template emits the styled one instead,
        # so take the body's wording when it is the better title and drop it.
        body_h1 = first_h1(body)
        title = body_h1 or str(meta.get("title") or rel.rsplit("/", 1)[-1])
        body = strip_first_h1(body)

        description = str(meta.get("description") or SITE["description"])
        date = meta.get("date")
        date = str(date) if date else None

        html = markdown_to_html(body)
        html, has_mermaid = protect_mermaid(html)
        out_file = ROOT / lang / rel / "index.html"
        html = rewrite_links(html, path.parent, out_file.parent)

        # Steps back from this page's directory to the language root. The
        # output path is <lang>/<rel>/index.html, so its segment count minus
        # the language segment and the filename is the depth.
        base = "../" * (len(out_file.relative_to(ROOT).parts) - 2)
        hrefs = language_hrefs(lang, rel, is_root=False)

        page = build_page(
            lang=lang,
            rel=rel,
            base=base,
            home=base or "./",
            title=title,
            description=description,
            date=date,
            body_html=html,
            has_mermaid=has_mermaid,
            t=t,
            lang_hrefs=hrefs,
        )

        out_file.parent.mkdir(parents=True, exist_ok=True)
        out_file.write_text(page, encoding="utf-8")
        written += 1

    # The site root landing page.
    root_src = SRC / "index.md"
    if root_src.exists():
        meta, body = split_doc(root_src.read_text(encoding="utf-8"))
        body_h1 = first_h1(body)
        title = body_h1 or str(meta.get("title") or SITE["name"])
        body = strip_first_h1(body)
        html = markdown_to_html(body)
        html, has_mermaid = protect_mermaid(html)
        html = rewrite_links(html, root_src.parent, ROOT)
        t = i18n.get("en_us", {})
        hrefs = {code: f"/{code}/" for code, *_ in LANGS}
        page = build_page(
            lang="en_us",
            rel="",
            base="en_us/",
            home="./",
            title=title,
            description=str(meta.get("description") or SITE["description"]),
            date=None,
            body_html=html,
            has_mermaid=has_mermaid,
            t=t,
            lang_hrefs=hrefs,
        )
        (ROOT / "index.html").write_text(page, encoding="utf-8")
        written += 1

    print(f"generated {written} pages from {len(docs)} source documents")
    return 0


if __name__ == "__main__":
    sys.exit(build())
