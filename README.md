<a href="https://gohugo.io/"><img src="https://raw.githubusercontent.com/gohugoio/gohugoioTheme/master/static/images/hugo-logo-wide.svg?sanitize=true" alt="Hugo" width="565"></a>

## About the SSG

Hugo is a [static site generator] written in [Go], optimized for speed and designed for flexibility. With its advanced templating system and fast asset pipelines, Hugo renders a complete site in seconds, often less.

## ⚠️ Important: Required Secrets Configuration

**Before the automated deployment can work**, you must configure GitHub Secrets:

1. Go to repository **Settings > Secrets and variables > Actions**
2. Add these required secrets:
   - **`CLOUDFLARE_API_TOKEN`**: Your Cloudflare API token (see instructions below)
   - **`CLOUDFLARE_ACCOUNT_ID`**: Your Cloudflare account ID (see instructions below)

Without these secrets, the GitHub Actions workflow will skip the deployment step and show a notice.

## Development

### Generating Supply Chain Diagrams

To regenerate the supply chain SVG diagrams after modifying the PlantUML files in `assets/diagrams/`:

```bash
plantuml -tsvg -o static/images/diagrams assets/diagrams/main.puml
```