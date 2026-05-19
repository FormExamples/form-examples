# Medical Information Form for Air Travel — static HTML wizard

Single-page static HTML implementation of the **Medical Information Form for
Air Travel (MEDIF)**: a 14-step single-page wizard that captures passenger
identification, trip details, the attending physician's clinical evaluation,
and requested in-flight medical accommodations, then computes a
fitness-to-fly band plus a set of safety flags suitable for submission to an
airline medical desk.

No build step, no framework, no server. Alpine.js 3.x is loaded from a CDN
for lightweight conditional sub-question toggles.

## Running

Open `index.html` directly from the file system:

```sh
open index.html
```

Or serve from any static web server from this directory:

```sh
python3 -m http.server 8080
```

Then visit <http://localhost:8080>.

## Files

- `index.html` — single-page wizard shell containing all 14 sections
- `css/style.css` — mobile-first stylesheet (no framework dependencies)
- `js/app.js` — progress tracking, fitness-band engine, safety-flag
  detection, and report rendering

## Output

On Submit the page reveals an in-line report region with:

- The computed **fitness band** (`fit`, `fit-with-conditions`,
  `requires-review`, `unfit-to-fly`).
- The list of **fired rules** that contributed to the band.
- The list of **safety flags** grouped by priority (high / medium / low).
- A downloadable JSON snapshot of the assessment for offline archival.
