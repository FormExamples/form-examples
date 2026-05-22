# Eye Prescription — SvelteKit Dashboard

Review dashboard for the eye-prescription form, built with SvelteKit +
SVAR DataGrid (`@svar-ui/svelte-grid`) with the Willow theme. Used by a
practice manager or supervising optometrist to review all prescriptions
issued by the practice.

See the form-wide [`../AGENTS.md`](../AGENTS.md) for the design.

> **Status:** scaffolded; full implementation is deferred.

## Target structure

```
src/
  routes/
    +layout.svelte
    +page.svelte                      # main dashboard
    [id]/+page.svelte                 # single-prescription detail
  lib/
    api.ts                            # back-end client with sample-data fallback
    sample-data.ts                    # static sample prescriptions
    columns.ts                        # DataGrid column definitions
    types.ts                          # re-export from the front-end-form
    components/
      DashboardGrid.svelte
      FilterBar.svelte
      ComplexityBadge.svelte
      FlagBadge.svelte
```

## Columns

| Column | Source | Notes |
| --- | --- | --- |
| Issue date | `eye_prescription.issue_date` | Default sort: descending |
| Patient name | `patient.name` | |
| Prescriber | `prescriber.name` + GOC | |
| Right eye SPH | `eye_prescription_eye.sphere_diopters` (right) | |
| Right eye CYL × Axis | `eye_prescription_eye.cylinder_diopters` × `axis_degrees` (right) | |
| Left eye SPH | `eye_prescription_eye.sphere_diopters` (left) | |
| Left eye CYL × Axis | `eye_prescription_eye.cylinder_diopters` × `axis_degrees` (left) | |
| ADD | `eye_prescription_eye.addition_diopters` | Empty if none |
| Complexity | `eye_prescription_grade.final_complexity` | Coloured badge |
| Flags | count of `eye_prescription_grade_flag` rows | Coloured badge |
| Expiry | `eye_prescription.expiry_date` | Highlighted red if past |
| Status | `eye_prescription.status` | |

## Filters

- Complexity (simple / moderate / complex)
- Lens type (single vision / bifocal / varifocal / etc.)
- Has flags (yes / no)
- Expired (yes / no)
- Prescriber

## Verify

```sh
pnpm install
pnpm run check
pnpm run dev   # then open http://localhost:5173
```
