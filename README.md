<a href="https://gohugo.io/"><img src="https://raw.githubusercontent.com/gohugoio/gohugoioTheme/master/static/images/hugo-logo-wide.svg?sanitize=true" alt="Hugo" width="565"></a>

# Global Commerce Council

Product catalogue, trade knowledge base, HS code directory, country guides and
trade tools for the Global Commerce Council, written in six languages
(`en_us`, `ru_ru`, `ar_iq`, `hy_am`, `fa_ir`, `ar_ae`).

The repository is both the documentation and the site that publishes it:

- the Markdown under `content/` is the documentation, and is served directly —
  see [Serving the documentation](#serving-the-documentation);
- `layouts/`, `static/`, `i18n/` and `hugo.toml` build the styled website that
  GitHub Pages deploys — see [Building the site](#building-the-site).

## Serving the documentation

`compose.yaml` runs [serve-md](https://github.com/tayyebi/serve-md) against this
directory. There is nothing to build: the published image is pulled, the
repository root is mounted read-only at `/docs`, and the Markdown is served as
a website that AI agents can read through MCP.

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

Because the mount is read-only, the server never writes to the working tree, and
`--fresh` re-scans every second so edits appear without a restart. Point an
agent at it with:

```jsonc
// claude_desktop_config.json
{
  "mcpServers": {
    "gcc-docs": { "type": "http", "url": "http://localhost:8019/mcp" }
  }
}
```

`llms.txt` is hand-written rather than generated, so it is the curated index an
agent reads first; the generated `llms-full.txt` still concatenates the whole
tree.

### Writing documents that both servers render

Three rules keep a document readable by serve-md, by Hugo and on GitHub:

1. **YAML front matter is metadata, not prose.** serve-md strips a leading
   `---` block before rendering, so `title:` and `description:` never leak onto
   the page. Keep using it for Hugo.
2. **Links are relative to the file that holds them.** The mirror has no idea
   what the site's root URL is, so `/contact/` is a 404 there. Write
   `../contact.md` from a page in `products/`, or `contact.md` from a page at
   the top of a language directory.
3. **Mermaid labels are plain text.** No `<br/>`, no HTML tags and no HTML
   entities inside them — the server-side renderer escapes whatever it reads, so
   `Crude Oil<br/>Brent` would be printed literally. Subgraphs, `style` and
   `%%{init}%%` lines are ignored rather than fatal: the flowchart still draws,
   just flat and uncoloured. A fence the renderer cannot parse at all is left as
   an ordinary code block.

## Building the site

```sh
hugo server   # local preview
hugo --minify # production build into ./public
```

`.github/workflows/deploy.yml` builds and deploys `./public` to GitHub Pages on
every push to `main`. Hugo reads its content from `content/<language>/`, one
directory per language as configured in `hugo.toml`.

Note that Hugo never renders `.Content` for list pages — `layouts/_default/list.html`
builds those from the page collection — so the body of an `_index.md` is
mirror-only text. Single pages (`layouts/page/single.html`) do render it.

### Supply chain diagrams

The supply chain pages carry their diagrams as Mermaid code blocks in the
Markdown itself (`content/<language>/supply-chain/index.md`), so there is no
separate image to regenerate: edit the fence and both the Hugo site and the
serve-md mirror pick it up.

## About the SSG

Hugo is a [static site generator](https://gohugo.io/) written in
[Go](https://go.dev/), optimized for speed and
designed for flexibility. With its advanced templating system and fast asset
pipelines, Hugo renders a complete site in seconds, often less.

## License

MIT — see [LICENSE](LICENSE).
