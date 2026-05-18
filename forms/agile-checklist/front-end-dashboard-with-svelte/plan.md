# Agile Checklist — SvelteKit Dashboard Plan

## Goal

A SvelteKit review dashboard listing recent submissions with sortable
columns, dropdown filters, and a sample-data fallback for standalone
development.

## Build order

1. Scaffold SvelteKit 2 + TypeScript + Tailwind 4 project.
2. Sample data in `src/lib/data/sample.ts` (5–10 representative rows).
3. Backend API client with sample-data fallback.
4. Sortable table with columns: date, respondent, team, role,
   maturity, overall %, teams %, stakeholders %, practices %.
5. Dropdown filters for maturity level and role.
6. Drill-down link to a per-submission detail view.

## Status

Pending — not yet scaffolded.
