/**
 * FP92A Application — public types attached to window.Fp92aForm.
 *
 * JSDoc typedefs only; the runtime stores plain objects.
 */

(function (root) {
  const Fp92aForm = root.Fp92aForm || (root.Fp92aForm = {});

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

  Fp92aForm.ELIGIBLE_CONDITION_CODES = [
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

  Fp92aForm.ELIGIBLE_CONDITION_LABELS = {
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

  Fp92aForm.TOTAL_STEPS = 10;

  Fp92aForm.STEP_TITLES = [
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
})(window);
