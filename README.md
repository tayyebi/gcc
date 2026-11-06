<a href="https://github.com/tayyebi/serve-md"><img src="https://raw.githubusercontent.com/tayyebi/serve-md/main/docs/logo.svg" alt="serve-md" width="565"></a>

# Global Commerce Council

Product catalogue, trade knowledge base, HS code directory, country guides and
trade tools for the Global Commerce Council, written in six languages.

This repository **is** the website. There is no build step, no package manager,
no framework and no generated output: [serve-md](https://github.com/tayyebi/serve-md)
reads the Markdown in place and serves it, both to browsers and to AI agents.
What a reader sees here is exactly what is in Git.

## Serving the site

`compose.yaml` runs serve-md against this directory. There is nothing to build:
the published image is pulled, the repository root is mounted read-only at
`/docs`, and the Markdown is served as a website.

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
agent reads first; the generated `llms-full.txt` still concatenates the whole
tree.

Clients that ask get what suits them — `curl` and `wget` receive 80-column plain
text, `Accept: text/markdown` returns the source unchanged, and a browser gets
semantic HTML5 with no CSS and no JavaScript.

## Layout

One directory is one page. serve-md resolves a directory to its `index.md`, so
`/en_us/products` serves `en_us/products/index.md`.

```
index.md                  the landing page
llms.txt                  the index AI agents read first
README.md                 this file
compose.yaml              the container definition
en_us/  ru_ru/  ar_iq/  hy_am/  fa_ir/  ar_ae/
  index.md                the language home
  about.md  contact.md  hscode.md  privacy.md  terms.md
  products/  categories/  knowledge-base/  country-guides/
  tools/  supply-chain/  suppliers/  search/
```

Every directory carries an `index.md`. Without one, serve-md would fall back to
a file listing for that directory instead of a page.

## Writing documents

Three rules keep a document readable by the server, by an agent, and by anyone
reading the source on GitHub:

1. **Start the body with a `#` heading.** serve-md reads a document's title from
   its first heading, and that title is what appears in `llms.txt`, in the
   `list_docs` tool and in the `Doc-Title` response header. A leading `---`
   front matter block is stripped before rendering, so it is safe to keep for
   metadata, but it is not what names the page.
2. **Link with paths relative to the file that holds them.** The server has no
   idea what the site's root URL is, so `/contact/` is a 404 here. Link a
   section by its bare directory name — `products`, `../categories/ceramics` —
   because that is the one canonical URL serve-md gives it; `products/index.md`
   redirects there with a `301`.
3. **Mermaid labels are plain text.** No `<br/>`, no HTML tags and no HTML
   entities inside them: the renderer escapes whatever it reads, so
   `Crude Oil<br/>Brent` would be printed literally. Subgraphs, `style` and
   `%%{init}%%` lines are ignored rather than fatal — the flowchart still draws,
   just flat and uncoloured. A fence the renderer cannot parse at all is left as
   an ordinary code block.

## License

MIT — see [LICENSE](LICENSE).
