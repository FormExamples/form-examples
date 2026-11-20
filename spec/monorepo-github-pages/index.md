# Monorepo GitHub pages

Goal: publish Monorope GitHub pages by using the monorepo git subtree to export a sibling read-only repo.

This project is a monorepo: `~/git/<organization>/<repo>`

This project contains a GitHub pages subproject: `~/git/<organization>/<repo>/<repo>.github.io`

The GitHub pages subproject uses:

- [GitHub Pages](https://pages.github.com/)
- [SvelteKit](https://svelte.dev/docs/kit/)
- [Lily Design System](https://github.com/LilyDesignSystem/lily-design-system)

## Publish

To publish the GitHub pages subproject, use git subtree to derive a sibling top-level read-only export project: `~/git/<organization>/<repo>.github.io`

## Maintenance

Always maintain the GitHub pages subproject: `~/git/<organization>/<repo>/<repo>.github.io`

To maintain the sibling top-level read-only export project, always use git subtree; never work directly in: `~/git/<organization>/<repo>.github.io`

## Forms on the site

Every form's own Svelte front-end is served on the site under its slug, with
all its routes, for example
`https://formexamples.github.io/pre-operative-assessment-by-clinician/` for
`forms/pre-operative-assessment-by-clinician/front-end-with-svelte/`.

- **Built from the form, not copied into the site.** The form's source stays
  the only source. Its `vite.config.ts` switches to `@sveltejs/adapter-static`
  when `VITE_FORM_EXAMPLES_SITE=1`: its assets go under `/_app/<slug>/`, so no
  two forms' assets collide. Its `src/routes/<slug>/+layout.ts` prerenders every
  page the crawler reaches, with the site's trailing slash, and the app writes
  a `/<slug>/200.html` shell for the rest. Without the variable the form builds
  and runs exactly as before.
- **Assembled by the site's deploy.** `formexamples.github.io/scripts/build-forms.mjs`
  runs after the site's own build. It builds each form that opts in and copies
  its `/<slug>/` pages and `/_app/<slug>/` assets into the site's `build/`. The
  deploy workflow sparse-checks-out the monorepo's
  `forms/*/front-end-with-svelte/`, without the vendored theme CSS, because
  every form loads the site's one copy at `/themes/`. Publishing stays a
  `git subtree` push of `formexamples.github.io/`. When that push has nothing
  new, `bin/make-github-pages` starts the deploy workflow itself, so a change
  to a form alone still reaches the site.
- **Pages that are not prerendered.** A record page, `/<slug>/.../[id]/`, has no
  file. GitHub Pages serves the site's `404.html`, which forwards any path under
  a form to that form's `200.html?__spa=<path>`. A script in the form's
  `app.html` puts the path back before the router starts, so the app renders
  that page. Any other missing path shows "Page not found".
- **No back end.** The site is static, so each form runs in the browser alone.
  Drafts and records stay in the visitor's `localStorage`, under the form's own
  keys (see [`spec/form-namespacing/`](../form-namespacing/)), the dashboards show
  the form's sample data, and the PDF report is built in the browser with
  pdfmake rather than by a server endpoint.
