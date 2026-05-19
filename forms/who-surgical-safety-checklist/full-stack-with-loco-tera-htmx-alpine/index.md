# WHO Surgical Safety Checklist — Full Stack with Rust Axum Loco Tera

Server-rendered Rust web app for the WHO Surgical Safety Checklist
(WHO/IER/PSP/2008.05, *Safe Surgery Saves Lives*). The application
implements a single-page three-phase wizard (Sign In, Time Out, Sign
Out), captures the operating-team roster, and produces a signed,
timestamped record of each surgical case.

## Stack

- Rust + axum + Loco
- Tera server-side templates
- HTMX 2.0.8 + Alpine.js 3.14.8 on the client
- SeaORM + PostgreSQL
- Tailwind CSS (server-side assets)

## Tables

Scaffolded from `sql-migrations/` in dependency order:

1. `patient` — patient receiving the procedure
2. `clinician` — operating-team members with sign-off capability
3. `who_surgical_safety_checklist` — one row per surgical case, all
   three phases inline
4. `team_member` — operating-team roster captured during Time Out

See [AGENTS.md](AGENTS.md) for the planned project structure, and the
parent
[AGENTS/full-stack-with-loco-tera-htmx-alpine.md](../../../AGENTS/full-stack-with-loco-tera-htmx-alpine.md)
for the canonical full-stack stack.
