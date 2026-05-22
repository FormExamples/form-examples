# UK LPA for Health and Care Decisions — static HTML wizard

A self-contained static-file implementation of the 14-step LP1H wizard.
Single HTML page, no build step, no server: open `index.html` in a
browser and step through the form. Alpine.js drives the reactive store;
the validity engine ships as a single ES module.

## Stack

- HTML 5 + CSS 3 (Tailwind via CDN)
- Alpine.js 3.14.8 (CDN)
- Vanilla ES modules for the validity engine
- Native HTML form elements; no framework dependency
- `pdfmake` from CDN for the OPG-ready PDF export

## Running

Open `index.html` in any modern browser. No install, no build, no
network calls beyond CDN assets.

## Why a static build

- Solicitors and Age UK volunteers often work on laptops with restricted
  install rights — a single-file HTML wizard is deployable from a
  shared drive or a USB stick.
- Independent Mental Capacity Advocates need an offline-capable workflow
  that runs in low-connectivity care-home settings.
- The static build serves as the lowest-friction reference implementation
  against which the SvelteKit and Loco implementations are validated.
