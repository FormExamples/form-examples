# ICVP — Static HTML data-entry wizard

A self-contained static HTML/CSS/vanilla-JS implementation of the WHO model
**International Certificate of Vaccination or Prophylaxis** wizard. No build
step. Open `index.html` directly in a browser and step through the eight
single-page-wizard panels in order.

## Files

- `index.html` — single page; eight `<fieldset>` panels, hidden by default
  except the active one; previous/next controls at the bottom.
- `styles.css` — minimal modern CSS; mobile-first layout; print stylesheet
  for the final certificate preview.
- `script.js` — wizard state, per-step validation, the embedded validation
  engine, the summary preview rendering, and the "Print certificate" button.

## 8 steps

| # | Step | Section of the certificate |
| --- | --- | --- |
| 1 | Centre & clinician | issuing centre and supervising clinician identity |
| 2 | Vaccinee identity | Section A of the WHO model |
| 3 | Vaccinee signature & consent | Section A — handwritten signature |
| 4 | Travel context | optional planning context |
| 5 | Vaccination entry — disease & vaccine | Section B (repeats) |
| 6 | Vaccination entry — administration | Section B — date / clinician signature |
| 7 | Vaccination entry — validity & stamp | Section B — validity dates and stamp |
| 8 | Summary, medical waiver & sign-off | preview, fired warnings, print button |

## Validation engine (embedded in `script.js`)

Implements the same rule catalogue as the SvelteKit and Rust versions:
VAL001..VAL012. The validation rules are listed in the form-level
[`../index.md`](../index.md).

## Running

```sh
open index.html        # macOS
xdg-open index.html    # Linux
```
