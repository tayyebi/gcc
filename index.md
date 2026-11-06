---
title: "Global Commerce Council"
description: "Documentation index for the Global Commerce Council repository, served from the repository root."
---

# Global Commerce Council

Connecting global markets through innovation. This repository holds the
council's product catalogue, knowledge base and trade tools, written in six
languages and served directly from the files you are reading now.

Everything below is plain Markdown. A link takes you to the rendered page; ask
for the same URL with `Accept: text/markdown` and you get the source back.

## Documentation by language

| Language | Code | Home |
|---|---|---|
| English | `en_us` | [English home](content/en_us/_index.md) |
| Русский | `ru_ru` | [Домашняя страница](content/ru_ru/_index.md) |
| العربية (العراق) | `ar_iq` | [الصفحة الرئيسية](content/ar_iq/_index.md) |
| Հայերեն | `hy_am` | [Գլխավոր էջ](content/hy_am/_index.md) |
| فارسی | `fa_ir` | [صفحه اصلی](content/fa_ir/_index.md) |
| العربية (الإمارات) | `ar_ae` | [الصفحة الرئيسية](content/ar_ae/_index.md) |

Each language carries the same set of sections:

- **Products** — the full catalogue, grouped by category
- **Categories** — Ceramics, Gypsum, Petroleum & petrochemicals, other industries
- **Knowledge base** — trade, logistics, compliance and market guides
- **HS code directory** — how goods are classified for customs
- **Country guides** — import and export requirements market by market
- **Tools** — duty and freight calculators
- **Supply chain** — raw materials through to end markets
- **Suppliers** — the verified supplier network
- **About, contact, terms and privacy**

## Where to start

- New here? Read [About us](content/en_us/about.md).
- Buying? Start at [Products](content/en_us/products/_index.md) or
  [Categories](content/en_us/categories/_index.md).
- Shipping across a border? [HS code directory](content/en_us/hscode.md) and
  [Country guides](content/en_us/country-guides/_index.md).
- Working out landed cost? [Tools](content/en_us/tools/_index.md).
- Curious how it all fits together? [Supply chain](content/en_us/supply-chain/index.md).

## How this site is served

`compose.yaml` runs [serve-md](https://github.com/tayyebi/serve-md) against this
directory:

```sh
docker compose up -d          # then browse http://localhost:8019/
```

The repository root is mounted read-only at `/docs`, so the server never writes
to the working tree and `--fresh` picks up edits to these files without a
restart. Four plugins are enabled:

| Plugin | What it does here |
|---|---|
| `x-headers` | Response headers naming each document's title, word count and headings |
| `math` | Renders `$…$` and `$$…$$` as MathML, server-side |
| `mermaid` | Draws mermaid flowcharts as inline SVG, server-side |
| `webmcp` | Publishes this same tree to AI agents at `/mcp`, `/llms.txt` and `/llms-full.txt` |

Three conventions keep the tree renderable by a plain Markdown server as well as
by the Hugo build in `.github/workflows/deploy.yml`:

1. **YAML front matter is metadata, not prose.** serve-md strips a leading
   `---` block before rendering, so `title:` and `description:` never appear on
   the page.
2. **Links are relative to the file that holds them.** `/contact/` would be a
   404 here — the server has no idea what the site's root URL is. Write
   `../contact.md` and it resolves for both servers and for anyone reading the
   source on GitHub.
3. **Mermaid labels are plain text.** No `<br/>`, no HTML tags and no HTML
   entities inside them — the server-side renderer escapes whatever it reads,
   so `Crude Oil<br/>Brent` would be printed literally. Subgraphs, `style` and
   `%%{init}%%` lines are ignored rather than fatal: the flowchart still draws,
   just flat and uncoloured. Anything the renderer cannot parse at all is left
   as an ordinary code block.

Hugo's own source directories (`layouts/`, `static/`, `i18n/`, `archetypes/`)
sit in the mounted tree too. They are part of the build, not of the
documentation, and nothing here links to them. To serve documents only, change
the volume in `compose.yaml` to `./content:/docs:ro`.
