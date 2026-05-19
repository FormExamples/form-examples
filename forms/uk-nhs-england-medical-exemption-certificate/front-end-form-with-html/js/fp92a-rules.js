/**
 * FP92A — eligibility rule set.
 *
 * Each rule has an id, a category, a severity, and a `fires(data)` predicate
 * that consumes the form data and returns true when the rule should fire.
 */

(function (root) {
  const Fp92aForm = root.Fp92aForm || (root.Fp92aForm = {});

  /** Calculate age in whole years from an ISO yyyy-mm-dd birth date. */
  function ageYears(birthDateIso) {
    if (!birthDateIso) return null;
    const dob = new Date(birthDateIso);
    if (Number.isNaN(dob.valueOf())) return null;
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age;
  }
  Fp92aForm.ageYears = ageYears;

  Fp92aForm.RULES = [
    {
      id: "fp92a.rule.condition.permanent-fistula",
      category: "eligible-condition",
      severity: "info",
      description: "Permanent fistula declared.",
      fires: (d) => d.conditions.includes("permanent-fistula"),
    },
    {
      id: "fp92a.rule.condition.hypoadrenalism",
      category: "eligible-condition",
      severity: "info",
      description: "Hypoadrenalism declared.",
      fires: (d) => d.conditions.includes("hypoadrenalism"),
    },
    {
      id: "fp92a.rule.condition.diabetes-insipidus-or-hypopituitarism",
      category: "eligible-condition",
      severity: "info",
      description: "Diabetes insipidus / hypopituitarism declared.",
      fires: (d) => d.conditions.includes("diabetes-insipidus-or-hypopituitarism"),
    },
    {
      id: "fp92a.rule.condition.diabetes-mellitus",
      category: "eligible-condition",
      severity: "info",
      description: "Diabetes mellitus (not diet-only) declared.",
      fires: (d) =>
        d.conditions.includes("diabetes-mellitus-not-diet-only") &&
        d.diabetesTreatmentMode !== "diet-only",
    },
    {
      id: "fp92a.rule.condition.hypoparathyroidism",
      category: "eligible-condition",
      severity: "info",
      description: "Hypoparathyroidism declared.",
      fires: (d) => d.conditions.includes("hypoparathyroidism"),
    },
    {
      id: "fp92a.rule.condition.myasthenia-gravis",
      category: "eligible-condition",
      severity: "info",
      description: "Myasthenia gravis declared.",
      fires: (d) => d.conditions.includes("myasthenia-gravis"),
    },
    {
      id: "fp92a.rule.condition.myxoedema",
      category: "eligible-condition",
      severity: "info",
      description: "Myxoedema (hypothyroidism on thyroid hormone replacement) declared.",
      fires: (d) => d.conditions.includes("myxoedema"),
    },
    {
      id: "fp92a.rule.condition.epilepsy-on-anticonvulsant",
      category: "eligible-condition",
      severity: "info",
      description: "Epilepsy on continuous anticonvulsant therapy declared.",
      fires: (d) => d.conditions.includes("epilepsy-on-anticonvulsant"),
    },
    {
      id: "fp92a.rule.condition.continuing-physical-disability",
      category: "eligible-condition",
      severity: "info",
      description: "Continuing physical disability declared and home-care attested.",
      fires: (d) =>
        d.conditions.includes("continuing-physical-disability") &&
        d.cannotLeaveHomeUnaided === "yes" &&
        d.disabilityPermanent === "yes",
    },
    {
      id: "fp92a.rule.condition.cancer-or-effects",
      category: "eligible-condition",
      severity: "info",
      description: "Cancer-related qualifying condition declared.",
      fires: (d) => d.conditions.includes("cancer-or-effects"),
    },

    // Disqualifying / redirect rules
    {
      id: "fp92a.rule.disqualifying.diet-only-diabetes",
      category: "disqualifying",
      severity: "high",
      description: "Diabetes treated by diet alone — not eligible for FP92A.",
      fires: (d) =>
        d.conditions.includes("diabetes-mellitus-not-diet-only") &&
        d.diabetesTreatmentMode === "diet-only",
    },
    {
      id: "fp92a.rule.disqualifying.temporary-disability",
      category: "disqualifying",
      severity: "high",
      description: "Disability marked as non-permanent — temporary disability is not eligible.",
      fires: (d) =>
        d.conditions.includes("continuing-physical-disability") &&
        d.disabilityPermanent === "no",
    },
    {
      id: "fp92a.rule.redirect.fw8-pregnancy",
      category: "redirect",
      severity: "medium",
      description: "Pregnant or recently post-partum — redirect to FW8 maternity exemption.",
      fires: (d) =>
        d.pregnancyStatus === "pregnant" ||
        d.pregnancyStatus === "post-partum-within-12-months",
    },
    {
      id: "fp92a.rule.redirect.age-exemption",
      category: "redirect",
      severity: "medium",
      description: "Patient is automatically entitled on age grounds — FP92A not required.",
      fires: (d) => {
        const age = ageYears(d.patientBirthDate);
        if (age == null) return false;
        if (age >= 60) return true;
        if (age < 16) return true;
        if (age >= 16 && age <= 18 && d.fullTimeEducation === "yes") return true;
        return false;
      },
    },
    {
      id: "fp92a.rule.completeness.missing-signature",
      category: "completeness",
      severity: "high",
      description: "Practitioner signature missing — application incomplete.",
      fires: (d) => d.signaturePresent !== "yes",
    },
    {
      id: "fp92a.rule.completeness.missing-nhs-number",
      category: "completeness",
      severity: "medium",
      description: "NHS number missing — NHSBSA cannot match the application.",
      fires: (d) => !d.patientNhsNumber || d.patientNhsNumber.replace(/\D/g, "").length !== 10,
    },
    {
      id: "fp92a.rule.renewal.active-certificate",
      category: "renewal",
      severity: "low",
      description: "An active certificate is already on file — this should be marked as a renewal.",
      fires: (d) =>
        d.previousCertificateExpiry &&
        new Date(d.previousCertificateExpiry) > new Date() &&
        d.applicationKind !== "renewal",
    },
    {
      id: "fp92a.rule.clarification.cancer-histology",
      category: "completeness",
      severity: "medium",
      description: "Cancer declared but histology not confirmed — clarification required.",
      fires: (d) =>
        d.conditions.includes("cancer-or-effects") &&
        d.cancerTreatmentPhase === "" ,
    },
  ];
})(window);
