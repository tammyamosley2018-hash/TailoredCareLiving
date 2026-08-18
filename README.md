# Tailored Care Living — Version 1

Production-ready static website designed for GitHub Pages. Housing applications are delivered through a configurable secure external form endpoint.

## Local preview

Run `npm run dev`, then open `http://localhost:4173`. No package installation or build step is required.

## GitHub Pages deployment

1. Push these files to the client’s GitHub repository.
2. In repository **Settings → Pages**, select **Deploy from a branch**, then choose the site branch and `/ (root)`.
3. Create a private form with a static-site form provider such as Formspree, Basin, or Formspark.
4. Paste the provider’s HTTPS submission URL into `applicationEndpoint` in `assets/js/config.js`.
5. Configure the provider to email the client and disable unnecessary submission retention where supported.

Do not place an email API key in this repository. GitHub Pages is public and cannot safely keep server-side secrets. The form provider handles server-side validation, spam protection, and email delivery; the site adds client-side validation, progressive disclosure, and a honeypot.

## Editable content

Main public copy lives in `index.html`; visual tokens live at the beginning of `assets/css/styles.css`; application questions live in `apply.html`; delivery and future contact configuration lives in `assets/js/config.js`. Outstanding client inputs are in `docs/client-content-needed.md`.
