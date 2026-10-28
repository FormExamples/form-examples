# Tasks: Medical Fit Note

## Scaffolding
- [x] Run `bin/create-form medical-fit-note`.

## Documentation
- [x] `index.md`
- [x] `spec/index.md`
- [x] `AGENTS.md`
- [x] `plan.md`
- [x] `tasks.md` (this file)

## Schema
- [x] `sql/02_create_table_employee.sql`
- [x] `sql/03_create_table_clinician.sql`
- [x] `sql/04_create_table_medical_fit_note.sql`
- [x] `sql/05_create_table_medical_fit_note_grade.sql`
- [x] `sql/06_create_table_medical_fit_note_grade_rule.sql`
- [x] `sql/07_create_table_medical_fit_note_grade_flag.sql`

## Remaining
- [x] Approval engine and tests
- [x] HTML front-end
- [x] SvelteKit front-end
- [x] Loco back-end
- [x] Personas

## Wiring
- [x] HTML front-end API client (`js/api.js`): configurable base, client-side dashboard join, wizard submit
- [x] SvelteKit API client (`src/lib/api/`): `VITE_API_BASE`, dashboard join, wizard submit, Vitest coverage
- [x] Permissive CORS in `back-end-with-loco/config/development.yaml`
- [x] Offline sample-data fallback kept on both dashboards; submit errors keep report and draft
- [x] Svelte sample rows fixed to cover all 13 personas
