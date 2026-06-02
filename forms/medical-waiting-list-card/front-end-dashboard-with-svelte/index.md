# Medical Waiting List Card — SvelteKit dashboard

Review dashboard for booking-office staff and RTT validators. SvelteKit
2.x + SVAR DataGrid (`@svar-ui/svelte-grid`) with the Willow theme.

See the form-level [`../AGENTS.md`](../AGENTS.md) for the data model and
[`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md) for
shared monorepo conventions.

## Columns

- Patient name (and NHS number).
- Specialty / sub-specialty.
- Procedure description.
- Clinical priority (P1a / P1b / P2 / P3 / P4 / P5 / P6).
- RTT clock-start date.
- Weeks waited.
- Waiting Time Status (within-target / approaching-breach / breached /
  long-wait).
- Next appointment date and site.
- Fired flags (badge column).

## Filters

Dropdown filters on specialty, clinical priority, and Waiting Time Status.
A free-text filter searches patient name and NHS number.

## Backend client

The dashboard reads from the Rust full-stack backend (see
[`../back-end-with-loco/`](../back-end-with-loco/))
with a sample-data fallback for standalone development.
