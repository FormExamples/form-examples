# Plan: static HTML clinician wizard

## Build order

1. [ ] Author `index.html` shell with Tailwind + Alpine CDN tags.
2. [ ] Port `lib/engine/*.ts` to `js/engine/*.js`.
3. [ ] Author the Alpine root component in `js/app.js`.
4. [ ] Inline 12 step sections with `x-show` toggling.
5. [ ] Wire the statement-of-fitness preview and PDF download.

## Future enhancements

- Save to LocalStorage for offline drafts.
- Bilingual UI.
- Accessibility audit.
