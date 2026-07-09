# Agile Checklist — Implementation Plan

## Goal

Deliver a 5-step single-page wizard that audits 57 concrete agile
behaviours across Teams, Stakeholders, and Practices, computes a
composite maturity level and per-section bands, and generates a report
with a coaching action plan.

## Status

| Component | Status |
| --- | --- |
| `index.md`, `AGENTS.md`, `plan.md`, `tasks.md` | Done |
| `seed.md` (57 items) | Done (provided) |
| `sql/` | Done |
| `xml/` | Done |
| `fhir/r5/` | Done |
| `front-end-with-svelte/` | Done — `pnpm test` 21/21, `pnpm run check` clean, browser smoke-tested |
| `front-end-with-svelte/` | Done — `pnpm test` 15/15, `pnpm run check` clean, browser smoke-tested |
| `front-end-with-html/` | Done — static, dependency-free, mirrors Svelte engine output exactly, browser smoke-tested |
| `front-end-with-html/` | Done — static, dependency-free, mirrors Svelte dashboard output exactly, browser smoke-tested |
| `back-end-with-loco/` | Done — axum + Loco JSON API, Rust port of engine + dashboard + sister-form comparison, SQLite persistence, JSON `/api/checklists` with CORS, server-rendered `/dashboard`, `/submission/:id`, `/comparison` (CSV or DB-backed behaviour source), `cargo test` 27/27, browser smoke-tested (Postgres+SeaORM deferred) |

## Engine design

- One row per submission in `agile_checklist`. Each of the 57 items is
  a column with values `'yes'`, `'no'`, `'not-applicable'`, or `''`
  (unanswered). The schema groups items by section prefix
  (`t01…t25`, `s01…s14`, `p01…p18`) so a SQL query can compute the
  per-section percentage without joins.
- `calculateMaturity` computes the per-section percentage of `yes`
  answers (over `yes + no` answers, excluding `not-applicable`),
  followed by an unweighted mean across the three sections.
- Each section that lands in the `low` band fires its own coaching
  rule. Cross-cutting flags (finished-work risk, experimentation
  blocked, learning stalled, psychological-safety risk) are derived
  from specific item triplets.
- All operational flags are surfaced independently of the composite
  maturity level.

## Why three sections rather than twelve principles

The companion form `agile-principles-assessment` already covers the
twelve Agile Manifesto principles on a 1–5 Likert scale. This form
audits **behaviours** (concrete observable practices) rather than
**principles** (statements of intent), and groups them by audience —
the people doing the work (Teams), the people sponsoring the work
(Stakeholders), and the operating practices (Practices) that bind
them. The two forms are complementary: principles tell you what an
organisation *aspires to*; the checklist tells you what an
organisation *does*.

## Open questions

- Whether to support **multi-respondent aggregation** (mean of means)
  in the dashboard. Out of scope for v1; the dashboard lists
  individual submissions but aggregation can be added later.
- Whether to weight sections (e.g. give Stakeholders less weight than
  Teams). Out of scope for v1; unweighted mean keeps the scoring
  transparent.
- Whether `not-applicable` should affect the maturity band (currently
  excluded from the denominator only).

## References

See `index.md` for the full reference list.
