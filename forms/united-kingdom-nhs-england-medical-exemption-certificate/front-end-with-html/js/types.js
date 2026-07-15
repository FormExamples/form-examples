/**
 * FP92A Application — public types attached to window.Fp92aForm.
 *
 * JSDoc typedefs only; the runtime stores plain objects.
 */

  

  /**
   * @typedef {(
   *   "permanent-fistula" |
   *   "hypoadrenalism" |
   *   "diabetes-insipidus-or-hypopituitarism" |
   *   "diabetes-mellitus-not-diet-only" |
   *   "hypoparathyroidism" |
   *   "myasthenia-gravis" |
   *   "myxoedema" |
   *   "epilepsy-on-anticonvulsant" |
   *   "continuing-physical-disability" |
   *   "cancer-or-effects"
   * )} EligibleConditionCode
   */

  export const ELIGIBLE_CONDITION_CODES = [
    "permanent-fistula",
    "hypoadrenalism",
    "diabetes-insipidus-or-hypopituitarism",
    "diabetes-mellitus-not-diet-only",
    "hypoparathyroidism",
    "myasthenia-gravis",
    "myxoedema",
    "epilepsy-on-anticonvulsant",
    "continuing-physical-disability",
    "cancer-or-effects",
  ];

  export const ELIGIBLE_CONDITION_LABELS = {
    "permanent-fistula": "Permanent fistula",
    "hypoadrenalism": "Hypoadrenalism (e.g. Addison's)",
    "diabetes-insipidus-or-hypopituitarism": "Diabetes insipidus / hypopituitarism",
    "diabetes-mellitus-not-diet-only": "Diabetes mellitus (not diet-only)",
    "hypoparathyroidism": "Hypoparathyroidism",
    "myasthenia-gravis": "Myasthenia gravis",
    "myxoedema": "Myxoedema",
    "epilepsy-on-anticonvulsant": "Epilepsy on anticonvulsant",
    "continuing-physical-disability": "Continuing physical disability",
    "cancer-or-effects": "Cancer or effects of cancer",
  };

  export const TOTAL_STEPS = 10;

  export const STEP_TITLES = [
    "Practitioner identification",
    "Patient identification",
    "Existing exemption check",
    "Age-based exclusion check",
    "Pregnancy / maternity check",
    "Qualifying condition selection",
    "Qualifying condition detail",
    "Disability / appliance attestation",
    "Practitioner declaration",
    "Summary & eligibility result",
  ];
