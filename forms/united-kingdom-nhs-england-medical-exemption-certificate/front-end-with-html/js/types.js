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

  /**
   * Build a fresh, fully-blank application in the shape form-app.js's
   * buildApplicationData() produces and evaluateFp92a() consumes. Text /
   * enum fields default to '' except the wizard's own `applicationKind:
   * 'new'`; `conditions` is the list of declared EligibleConditionCodes.
   * `evaluateFp92a(emptyApplication())` is the 'ineligible' baseline (no
   * condition declared, signature and NHS number missing).
   */
  export function emptyApplication() {
    return {
      practitionerName: "", practitionerRole: "", registrationBody: "",
      registrationNumber: "", practiceName: "", practiceCode: "",
      practiceAddress: "", practicePostcode: "", practicePhone: "",
      completedDate: "",
      patientTitle: "", patientSurname: "", patientForenames: "",
      patientBirthDate: "", patientSex: "", patientNhsNumber: "",
      patientAddress: "", patientPostcode: "", patientPhone: "", patientEmail: "",
      applicationKind: "new", previousCertificateNumber: "", previousCertificateExpiry: "",
      fullTimeEducation: "",
      pregnancyStatus: "",
      conditions: [],
      diagnosisDate: "", snomedCode: "", icd10Code: "", treatmentDetail: "",
      diabetesTreatmentMode: "", cancerSite: "", cancerTreatmentPhase: "",
      fistulaSite: "", applianceType: "", cannotLeaveHomeUnaided: "",
      disabilityPermanent: "", carerDetail: "",
      practitionerDeclaration: "", signaturePresent: "", signedDate: "",
    };
  }

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
