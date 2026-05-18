# front-end-form-with-html — Plan

A static, no-build, single-page ADR wizard. The goal is the lowest-friction
implementation: open the file in a browser and start typing.

## Approach

- Plain DOM manipulation in one `js/app.js` file.
- Hand-written CSS in `css/style.css`. No frameworks.
- 16 sections rendered as cards, all visible at once.
- Markdown report rendered into a region on the same page; offered as
  clipboard copy or `.md` download.

## Constraints

- Works from `file://` — no ES modules, no server.
- No external runtime dependencies.
- Accessibility: skip-link, ARIA progress meter, semantic headings.
