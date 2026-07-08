/**
 * FP92A — advisory flags (distinct from rules that determine the outcome).
 *
 * Flags raise practitioner attention but do not by themselves change the
 * computed eligibility. Each flag has an id, category, priority, and a
 * `fires(data, ruleHits)` predicate.
 */

(function (root) {
  const Fp92aForm = root.Fp92aForm || (root.Fp92aForm = {});

  Fp92aForm.FLAGS = [
    {
      id: "fp92a.flag.missing-signature",
      category: "completeness",
      priority: "high",
      description: "Practitioner signature is required before the FP92A can be posted.",
      fires: (d) => d.signaturePresent !== "yes",
    },
    {
      id: "fp92a.flag.missing-nhs-number",
      category: "completeness",
      priority: "high",
      description: "An NHS number is needed for NHSBSA to match the application.",
      fires: (d) => !d.patientNhsNumber || d.patientNhsNumber.replace(/\D/g, "").length !== 10,
    },
    {
      id: "fp92a.flag.pregnancy-redirect",
      category: "pregnancy",
      priority: "medium",
      description: "Direct the applicant to FW8 (maternity exemption).",
      fires: (d) =>
        d.pregnancyStatus === "pregnant" ||
        d.pregnancyStatus === "post-partum-within-12-months",
    },
    {
      id: "fp92a.flag.age-exemption",
      category: "age-exemption",
      priority: "medium",
      description: "Patient is automatically entitled on age grounds; FP92A is not required.",
      fires: (d, hits) => hits.includes("fp92a.rule.redirect.age-exemption"),
    },
    {
      id: "fp92a.flag.diet-only-diabetes",
      category: "education",
      priority: "low",
      description: "Diet-only diabetes is not eligible for FP92A; advise lifestyle support.",
      fires: (d) =>
        d.conditions.includes("diabetes-mellitus-not-diet-only") &&
        d.diabetesTreatmentMode === "diet-only",
    },
    {
      id: "fp92a.flag.active-certificate-exists",
      category: "workflow",
      priority: "low",
      description: "An active certificate is already on file — mark as renewal.",
      fires: (d, hits) => hits.includes("fp92a.rule.renewal.active-certificate"),
    },
  ];
})(window);
