# Epilepsy Annual Review — SvelteKit front-end

A consolidated SvelteKit front-end for the UK primary-care **annual epilepsy
review** (NICE NG217): a single continuous single-page wizard plus a clinician
dashboard, both driven by one shared, pure classification engine.

This is a **documentation and decision-support** instrument, not a numeric
score. The engine:

- classifies **seizure control** — `seizure-free` / `controlled` /
  `uncontrolled`;
- grades **review completeness** — `complete` / `partial` / `incomplete` over
  the required documentation domains; and
- independently raises **safety flags** (specialist review, valproate / PPP,
  status epilepticus, DVLA driving, mental health, SUDEP, adherence, side
  effects, folic acid, incomplete / overdue).

## Wizard sections (11 steps)

1. **Review context** — reviewer, role, date, care setting, review type, months
   since last review.
2. **Patient and epilepsy profile** — identifier, demographics, epilepsy type,
   onset, learning disability.
3. **Seizure type and frequency** — types, frequency, last seizure, seizure-free
   duration, trend (drives control).
4. **Anti-seizure medication** — current ASM(s), adherence, side effects, drug
   level.
5. **Triggers** — reported seizure triggers.
6. **SUDEP risk discussion** — discussed and documented.
7. **Injuries and status epilepticus** — status epilepticus and seizure-related
   injury since the last review.
8. **Safety** — DVLA driving eligibility and status, bathing advice.
9. **Women of childbearing potential** — valproate, PPP, folic acid,
   contraception (required only when applicable).
10. **Mental health** — mood, anxiety, depression, suicidality.
11. **Summary and care plan** — specialist review, next review due, care plan,
    clinician note.

## Routes

- `/` — welcome page.
- `/epilepsy-reviews` — clinician dashboard (SVAR DataGrid, `ssr = false`).
- `/epilepsy-reviews/[id]` — the wizard (`new` or a sample id).
- `/epilepsy-reviews/[id]/report` — the graded report (print + PDF download).
- `/epilepsy-reviews/[id]/report/pdf` — server-side `pdfmake` endpoint.

## Develop

```sh
pnpm install
pnpm run dev      # dev server
pnpm run check    # svelte-check
pnpm run build    # production build
pnpm exec vitest run   # engine unit tests
```

Clinical grounding: NICE NG217; MHRA valproate pregnancy-prevention programme;
DVLA *Assessing fitness to drive*; SUDEP risk discussion. Decision-support only —
not a diagnosis, and not a prescribing instrument.
