# Global Commerce Council

Product catalogue, trade knowledge base, HS code directory, country guides and
trade tools for the Global Commerce Council, written in six languages.

This repository **is** the website. There is no build step at deploy time, no
package manager and no framework: [serve-md](https://github.com/tayyebi/serve-md)
serves the files in place, both to browsers and to AI agents, and the server
does `git pull` then `docker compose up` and nothing else.

## How the site is put together

serve-md renders Markdown into a deliberately minimal shell — a `<title>`, a
viewport, one `img` rule and `<main>`. It has no theming hook: it escapes raw
HTML in Markdown, so a stylesheet cannot be attached to a Markdown page, and its
own templates are compiled into the binary.

Hand-written `.html` files, however, are served **verbatim**, and so are static
assets. That is the one door, and it is what this repository uses:

```
.source/     Markdown source of truth        (hidden from serve-md)
.build/      build.py, the generator          (hidden from serve-md)
static/      the theme: CSS, JS, images       (served as static assets)
<lang>/…     the generated HTML               (what serve-md serves)
```

`.build/build.py` reads every document under `.source/`, renders it with
[Python-Markdown](https://python-markdown.github.io/), wraps it in the themed
page shell, and writes `<path>/index.html`. The output is **committed**, which
is why the server needs no build step — the HTML it serves is already in Git.

```sh
pip install markdown pyyaml      # once
python3 .build/build.py          # after editing anything in .source/
```

Edit Markdown, run the script, commit both. Never hand-edit the generated HTML:
the next run overwrites it.

## Serving the site

`compose.yaml` runs serve-md against this directory. The published image is
pulled, the repository root is mounted read-only at `/docs`, and the generated
HTML plus the theme are served as a website.

```sh
docker compose up -d
```

Then browse <http://localhost:8019/>. Four plugins are enabled:

| Plugin | Effect |
|---|---|
| `x-headers` | Response headers naming each document's title, word count and heading count |
| `math` | `$…$` and `$$…$$` render as MathML, server-side |
| `mermaid` | Mermaid flowcharts render as inline SVG, server-side |
| `webmcp` | `/mcp`, `/llms.txt` and `/llms-full.txt` publish the same tree to AI agents |

Because the mount is read-only the server never writes to the working tree, and
`--fresh` re-scans every second so edits appear without a restart. Point an agent
at it with:

```jsonc
// claude_desktop_config.json
{
  "mcpServers": {
    "gcc-docs": { "type": "http", "url": "http://localhost:8019/mcp" }
  }
}
```

`llms.txt` is hand-written rather than generated, so it is the curated index an
agent reads first.

Clients that ask get what suits them — `curl` and `wget` receive 80-column plain
text, `Accept: text/markdown` converts a page back to Markdown, and a browser
gets the themed site.

## The theme

Restored from the previous Hugo build and kept as close to the original as
serve-md allows: Bootstrap 5 and Bootstrap Icons from a CDN, the Inter and Outfit
webfaces, a dark/light toggle persisted in `localStorage`, a products mega-menu,
a full-screen mobile menu, and a language switcher that lands on the same page in
each language where one exists.

| File | |
|---|---|
| `static/css/design-tokens.css` | colours, spacing, radii, shadows, z-index scale |
| `static/css/custom.css` | the theme itself |
| `static/css/animations.css` | the animation system |
| `static/css/site.css` | extras the generator needs: mermaid container, code blocks |
| `static/js/main.js` | theme toggle, mega-menu, mobile menu, language dropdown |
| `static/images/`, `static/favicon.svg` | logo, hero, OG image, favicon |

Mermaid diagrams are drawn client-side from
`https://cdn.jsdelivr.net/npm/mermaid@10`, exactly as the Hugo build did. This is
the one place serve-md's own mermaid plugin does not apply, because it only
transforms Markdown and these pages are HTML; the diagram source is still in the
document for anyone reading without JavaScript.

## Layout

One directory is one page. Every page is a directory holding an `index.html`, so
every public URL is pretty — `/en_us/products/bitumen-60-70`, never an extension
— and no directory is ever left without an index for serve-md to fall back to a
file listing.

```
index.html                 the landing page (generated)
llms.txt                   the index AI agents read first
README.md                  this file
compose.yaml               the container definition
static/                    the theme
.source/                   the Markdown source of truth
  index.md                 the landing page's source
  en_us/  ru_ru/  ar_iq/  hy_am/  fa_ir/  ar_ae/
    index.md               the language home
    about.md  contact.md  hscode.md  privacy.md  terms.md
    products/  categories/  knowledge-base/  country-guides/
    tools/  supply-chain/  suppliers/  search/
.build/
  build.py                 the generator
  i18n.json                navigation and footer strings, all six languages
en_us/  ru_ru/  …          the generated site
  about/index.html  contact/index.html  products/index.html  …
  products/bitumen-60-70/index.html  …
```

`ar_iq`, `ar_ae` and `fa_ir` are rendered right-to-left.

## Writing documents

Three rules keep a document readable in the source, in the generated page, and by
an agent:

1. **Start the body with a `#` heading.** The generator takes that heading as the
   page title, emits it as the styled `<h1>`, and uses it in `<title>`. A leading
   `---` front matter block is metadata only — the server strips it, and the
   generator reads `description` and `date` from it.
2. **Link with paths relative to the file that holds them**, exactly as if the
   page were still a Markdown file. `../contact.md`, `../products` and
   `../../index.md` are all fine: the generator resolves each one against the
   real output paths and rewrites it. Links to real root-level files such as
   `llms.txt` work the same way.
3. **Mermaid labels are plain text.** No `<br/>`, no HTML tags and no HTML
   entities inside them. A fenced `mermaid` block becomes `<pre class="mermaid">`
   for the client-side renderer, and the source is left untouched inside it.
