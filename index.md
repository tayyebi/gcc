---
title: "Global Commerce Council"
description: "Documentation index for the Global Commerce Council, served from the repository root."
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
| English | `en_us` | [English home](en_us) |
| Русский | `ru_ru` | [Домашняя страница](ru_ru) |
| العربية (العراق) | `ar_iq` | [الصفحة الرئيسية](ar_iq) |
| Հայերեն | `hy_am` | [Գլխավոր էջ](hy_am) |
| فارسی | `fa_ir` | [صفحه اصلی](fa_ir) |
| العربية (الإمارات) | `ar_ae` | [الصفحة الرئيسية](ar_ae) |

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

- New here? Read [About us](en_us/about.md).
- Buying? Start at [Products](en_us/products) or
  [Categories](en_us/categories).
- Shipping across a border? [HS code directory](en_us/hscode.md) and
  [Country guides](en_us/country-guides).
- Working out landed cost? [Tools](en_us/tools).
- Curious how it all fits together? [Supply chain](en_us/supply-chain).

## How this site is served

`compose.yaml` runs [serve-md](https://github.com/tayyebi/serve-md) against this
directory. There is nothing to build and nothing to install:

```sh
docker compose up -d          # then browse http://localhost:8019/
```

The repository root is mounted read-only at `/docs`, so the server never writes
to the working tree, and `--fresh` re-scans every second so edits to these
files appear without a restart. Four plugins are enabled:

| Plugin | What it does here |
|---|---|
| `x-headers` | Response headers naming each document's title, word count and headings |
| `math` | Renders `$…$` and `$$…$$` as MathML, server-side |
| `mermaid` | Draws mermaid flowcharts as inline SVG, server-side |
| `webmcp` | Publishes this same tree to AI agents at `/mcp`, `/llms.txt` and `/llms-full.txt` |

Point an agent at it with:

```jsonc
// claude_desktop_config.json
{
  "mcpServers": {
    "gcc-docs": { "type": "http", "url": "http://localhost:8019/mcp" }
  }
}
```

## How the tree is laid out

```
index.md                  this page
llms.txt                  the index AI agents read first
README.md                 the repository readme
en_us/  ru_ru/  ar_iq/  hy_am/  fa_ir/  ar_ae/
  index.md                the language home
  about.md  contact.md  hscode.md  privacy.md  terms.md
  products/  categories/  knowledge-base/  country-guides/
  tools/  supply-chain/  suppliers/  search/
```

One directory is one page. serve-md resolves a directory to its `index.md`, so
`/en_us/products` serves `en_us/products/index.md` and
`/en_us/products/bitumen-60-70.md` serves that file. A directory without an
`index.md` would fall back to a file listing, which is why every directory here
has one.

## Writing documents for this site

Three rules keep a document readable by the server, by an agent, and by anyone
reading the source on GitHub:

1. **Start the body with a `#` heading.** serve-md reads a document's title from
   its first heading, and that title is what appears in `llms.txt`, in the
   `list_docs` tool and in the `Doc-Title` response header. A leading `---`
   front matter block is stripped before rendering, so it is safe to keep for
   metadata but it is not what names the page.
2. **Link with paths relative to the file that holds them.** The server has no
   idea what the site's root URL is, so `/contact/` is a 404 here. A section is
   linked by its bare directory name — `products`, `../categories/ceramics` —
   because that is the one canonical URL serve-md gives it; `products/index.md`
   redirects there with a `301`.
3. **Mermaid labels are plain text.** No `<br/>`, no HTML tags and no HTML
   entities inside them — the renderer escapes whatever it reads, so
   `Crude Oil<br/>Brent` would be printed literally. Subgraphs, `style` and
   `%%{init}%%` lines are ignored rather than fatal: the flowchart still draws,
   just flat and uncoloured. A fence the renderer cannot parse at all is left as
   an ordinary code block.
