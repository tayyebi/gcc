# Deployment Guide

This guide explains how to deploy the Global Commerce Council website to Cloudflare Pages.

## ⚠️ Important: Required Secrets Configuration

**Before the automated deployment can work**, you must configure GitHub Secrets:

1. Go to repository **Settings > Secrets and variables > Actions**
2. Add these required secrets:
   - **`CLOUDFLARE_API_TOKEN`**: Your Cloudflare API token (see instructions below)
   - **`CLOUDFLARE_ACCOUNT_ID`**: Your Cloudflare account ID (see instructions below)

Without these secrets, the GitHub Actions workflow will skip the deployment step and show a notice.

## Prerequisites

1. GitHub account with access to the repository
2. Cloudflare account
3. Hugo Extended v0.121.1 or later installed locally

## Cloudflare Pages Setup

### 1. Create a Cloudflare Pages Project

1. Log in to your Cloudflare dashboard
2. Go to Pages section
3. Click "Create a project"
4. Connect your GitHub account
5. Select the `tayyebi/gcc` repository

### 2. Configure Build Settings

**Framework preset**: Hugo
**Build command**: `hugo --minify`
**Build output directory**: `public`
**Root directory**: `/` (default)

### 3. Environment Variables

Set the following environment variable in Cloudflare Pages:
- `HUGO_VERSION`: `0.121.1`

### 4. Build Configuration

The build settings are configured in the repository's `.github/workflows/deploy.yml` file.

## GitHub Secrets Configuration

For automated deployment via GitHub Actions, configure these secrets in your repository:

1. Go to repository Settings > Secrets and variables > Actions
2. Add the following secrets:
   - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
   - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID

### Getting Cloudflare API Token

1. Go to Cloudflare Dashboard > My Profile > API Tokens
2. Click "Create Token"
3. Use "Edit Cloudflare Workers" template or create custom token with:
   - Permissions: `Cloudflare Pages:Edit`
   - Account Resources: Include your account
4. Copy the token and add to GitHub secrets

### Getting Cloudflare Account ID

1. Go to Cloudflare Dashboard
2. Select any domain
3. Find Account ID in the right sidebar

## Manual Deployment

To deploy manually:

```bash
# Build the site
hugo --minify

# The public/ directory contains the built site
# Upload to any static hosting service
```

## Local Development

```bash
# Start development server
hugo server -D

# Build for production
hugo --minify

# Check for broken links
hugo --renderToMemory --verbose
```

## Custom Domain Configuration

### On Cloudflare Pages

1. Go to your Pages project
2. Click "Custom domains"
3. Add `globalcommercecouncil.com` and `www.globalcommercecouncil.com`
4. Follow DNS configuration instructions

### DNS Settings

Add these DNS records in Cloudflare:
- `CNAME` record for `globalcommercecouncil.com` pointing to your Pages URL
- `CNAME` record for `www` pointing to your Pages URL

## SSL/TLS Configuration

Cloudflare Pages automatically provides SSL certificates. Ensure:
- SSL/TLS mode is set to "Full" or "Full (strict)"
- Always Use HTTPS is enabled
- Automatic HTTPS Rewrites is enabled

## Performance Optimization

### Already Configured
- Minified HTML, CSS, JS
- CDN delivery via Cloudflare
- Image optimization
- Caching headers

### Additional Optimizations
- Enable Cloudflare's Auto Minify
- Enable Cloudflare's Rocket Loader
- Configure Browser Cache TTL
- Enable HTTP/2 and HTTP/3

## Monitoring

### Analytics
- Cloudflare Web Analytics (privacy-friendly)
- Google Analytics (if configured)
- Search Console for SEO monitoring

### Uptime Monitoring
- Use Cloudflare's built-in monitoring
- Configure external uptime monitors
- Set up status page

## Troubleshooting

### Build Failures
- Check Hugo version matches requirements
- Verify all content files have valid frontmatter
- Check for syntax errors in templates

### 404 Errors
- Verify URLs match content structure
- Check for case sensitivity issues
- Ensure proper permalink configuration

### Form Submissions
- Netlify forms work only on Netlify
- For Cloudflare Pages, use Cloudflare Workers or external form service
- Update contact form to use appropriate service

## Rollback

If needed to rollback:
1. Go to Cloudflare Pages project
2. View deployment history
3. Click "Rollback to this deployment" on previous version

## Support

For deployment issues:
- Check Cloudflare Pages documentation
- Review GitHub Actions logs
- Contact support at support@globalcommercecouncil.com
