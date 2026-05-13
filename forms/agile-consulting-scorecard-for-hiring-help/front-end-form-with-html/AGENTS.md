# Agile Consulting Scorecard for Hiring Help — front-end form with HTML

Static HTML mirror of the SvelteKit scorecard wizard. Renders the same
six-step single-page wizard with native form elements, no JavaScript
framework required, and progressive enhancement for the score band
preview.

## Status

Scaffold only. The HTML page, native form controls, and the inline
score preview script still need to be authored.

## Stack

- Plain HTML5 + native form elements
- Vanilla JavaScript for the live total / band preview on step 6
- Tailwind CSS via CDN (or the precompiled stylesheet from the SvelteKit
  build, copied into `assets/`)
- No build step required

## Conventions

- Single-page wizard; all six steps rendered as `<fieldset>` elements
  inside one `<form>`, navigated client-side with `hidden` attributes.
- The 16 yes/no items use `<input type="radio">` triplets (yes / no /
  unanswered) so that `null` is representable.
- Per-item evidence uses `<textarea>` with a 2-row default.
- The score preview on step 6 is a JavaScript port of
  `gradeScorecard()` from
  `../front-end-form-with-svelte/src/lib/engine/score-grader.ts`.
