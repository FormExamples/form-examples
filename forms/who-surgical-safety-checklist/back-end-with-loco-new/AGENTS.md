# WHO Surgical Safety Checklist — Full Stack (new) agent instructions

Agent instructions for the in-progress redesign of the full-stack Rust
implementation. See [`./index.md`](./index.md) for context and
[`../../../AGENTS/back-end-with-loco.md`](../../../AGENTS/back-end-with-loco.md)
for the project-wide conventions.

## Purpose

This crate is a clean re-scaffold target. Do not edit alongside the
sibling
[`../back-end-with-loco/`](../back-end-with-loco/)
crate; only one of the two will survive merge.

## Scaffold

The same setup script applies — run it from inside this directory once
a Loco app has been bootstrapped here:

```sh
../back-end-with-loco-setup
```

The script lives at
`forms/who-surgical-safety-checklist/back-end-with-loco-setup`
and scaffolds four resources (`patient`, `clinician`,
`who_surgical_safety_checklist`, `team_member`) in FK-safe order.

## UI rule

IMPORTANT: the WHO Surgical Safety Checklist must be one continuous
single-page wizard. The three phases (Sign In, Time Out, Sign Out) are
sections of one page driven by HTMX patches; no multi-page navigation.
