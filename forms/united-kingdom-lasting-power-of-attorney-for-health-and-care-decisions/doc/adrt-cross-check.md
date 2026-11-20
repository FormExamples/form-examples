# ADRT Cross-form Check

How the LPA Health and Welfare form interacts with the sibling
**Advance Decision to Refuse Treatment (ADRT)** form
(`forms/advance-decision-to-refuse-treatment/`).

## The legal interplay

Both an LPA and an ADRT can authorize or refuse treatment decisions for a
donor / patient who has lost capacity. The Mental Capacity Act 2005 sets
out which takes precedence:

- **ADRT made AFTER an LPA was registered** — the ADRT overrides the LPA
  only if the LPA *did not* expressly authorize the attorney to give or
  refuse consent to the relevant treatment (MCA 2005 s.25(7)).
- **LPA made AFTER an ADRT** — the LPA overrides the ADRT only if the
  LPA *expressly* gives the attorney authority to consent to or refuse
  the same treatment, and the donor reaffirms the intent at signing.
- **Life-sustaining treatment** — an attorney can give or refuse
  consent to life-sustaining treatment only if the donor explicitly
  selected Option A under MCA s.11(7)(c). Otherwise a valid ADRT
  refusing that treatment prevails.

## Engine cross-check

When both an LPA row and an ADRT row exist for the same donor (matched
by `donor.united_kingdom_nhs_number` or by manual link), the validity
engine performs these cross-checks:

| Check | Severity | Effect |
| --- | --- | --- |
| ADRT refuses life-sustaining treatment AND lpa_lst_choice.lst_choice = 'option-a' AND any instruction permits LST | high | rule `R-MCA-INSTR-ADRT` fires; flag `adrt-conflict` is raised |
| ADRT refuses a specific treatment AND any instruction authorizes the same treatment | high | rule `R-MCA-INSTR-ADRT` fires |
| LPA exists with no ADRT | informational | flag `adrt-recommended` (optional; not in the canonical catalogue) |
| ADRT exists with no LPA | informational | (raised by the ADRT form, not by this one) |

## Implementation notes

- The cross-check requires reading from both `lpa_*` and the ADRT form's
  tables (`advance_decision_to_refuse_treatment_*` namespace). The
  back-end exposes a `GET /donor/{nhs}/cross-check` endpoint.
- The check runs server-side only — the front-end engine implementations
  cannot reach the ADRT data and therefore cannot fire
  `R-MCA-INSTR-ADRT` from `contradicts_adrt = 'yes'` alone. The
  front-end relies on the user setting `contradicts_adrt = 'yes'`
  manually when known.
- When the ADRT is invalid, withdrawn, or superseded
  (`advance_decision_to_refuse_treatment.status` = `withdrawn` or
  `superseded`), it is treated as absent for cross-check purposes.

## User-facing flow

On Step 8 (Instructions), if the donor's NHS number matches an ADRT row,
the wizard surfaces a banner listing the ADRT's refused treatments and
asks the donor (or solicitor) to confirm that each instruction is
consistent.

## Future: bidirectional anchoring

The cleanest path is for both forms to write to a shared
`donor_advance_planning_index` table keyed by NHS number, so the engine
on either side can spot the other's row without a database probe. That
is tracked under "future enhancements" in `plan.md`.
