# Plan: WHO Surgical Safety Checklist — Full Stack

## Current status

Not started. Stubs only. The setup script
`../full-stack-with-loco-tera-htmx-alpine-setup` is generated and ready
to run.

## Implementation plan

1. Bootstrap the Loco app:

   ```sh
   createuser  --host=localhost --port=5432 --username=postgres --login --createdb loco || :
   createdb    --host=localhost --port=5432 --username=postgres --owner=loco who_surgical_safety_checklist_development || :
   createdb    --host=localhost --port=5432 --username=postgres --owner=loco who_surgical_safety_checklist_test || :
   createdb    --host=localhost --port=5432 --username=postgres --owner=loco who_surgical_safety_checklist_production || :
   loco new --name who-surgical-safety-checklist --db postgres --bg async --assets serverside
   ```

2. Run the generated setup script to scaffold the four resources
   (`patient`, `clinician`, `who_surgical_safety_checklist`,
   `team_member`) in FK-safe order.
3. Replace the per-table CRUD pages with the single-page three-phase
   wizard:
   - `cases/new` and `cases/:id` render one Tera template with all
     three phase sections.
   - HTMX patches each phase block on save without leaving the page.
   - Alpine.js drives in-place show/hide of conditional fields (e.g.
     allergy detail when `sign_in_known_allergy = yes`).
4. Add a coordinator-signature flow: a phase is "complete" when its
   `*_coordinator_id` and `*_completed_at` are set; subsequent phases
   become editable only after the prior phase is complete.
5. Build the `team_member` sub-form inline within the Time Out phase
   (add / remove rows via HTMX, no page reload).
6. Implement the report view rendering the signed timestamped record
   suitable for printing or PDF export.
7. Add the `/dashboard` listing view (date, site, status, surgeon,
   anaesthetist, lead nurse, lifecycle status badge).
8. Cargo tests covering:
   - lifecycle status transitions (`not-started` →
     `sign-in-complete` → `time-out-complete` →
     `sign-out-complete` → `completed`);
   - the `is_paediatric` + `weight_as_kg` → 7 ml/kg blood-loss
     threshold check;
   - `sign_in_known_allergy = yes` ⇒ `sign_in_known_allergy_detail`
     non-empty.

See [AGENTS.md](AGENTS.md) for layout details.
