---
title: "Search"
description: "How to search this documentation"
---

# Search

There is no search box. serve-md serves semantic HTML with no CSS and no
JavaScript, so a search field would have nothing behind it.

Search happens through the agent surface instead. `--plugin webmcp` publishes
this same tree as an MCP server at `/mcp`, and its `search_docs` tool runs
ripgrep over every document here, returning each match with its file, line
number and the heading it sits under. `list_docs` returns the whole catalogue
and `get_outline` returns one document's heading tree.

To search by hand, start from the index:

- [Repository index](../../index.md)
- [Agent index](../../llms.txt)
- [Products](../products)
- [Product categories](../categories)
- [Knowledge base](../knowledge-base)
- [HS code directory](../hscode.md)
- [Country & market guides](../country-guides)
- [Contact](../contact.md)
