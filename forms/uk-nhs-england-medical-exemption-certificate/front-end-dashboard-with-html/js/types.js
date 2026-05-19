(function (root) {
  const F = root.Fp92aDashboard || (root.Fp92aDashboard = {});

  F.CONDITION_LABELS = {
    "permanent-fistula": "Permanent fistula",
    "hypoadrenalism": "Hypoadrenalism",
    "diabetes-insipidus-or-hypopituitarism": "Diabetes insipidus / hypopituitarism",
    "diabetes-mellitus-not-diet-only": "Diabetes mellitus",
    "hypoparathyroidism": "Hypoparathyroidism",
    "myasthenia-gravis": "Myasthenia gravis",
    "myxoedema": "Myxoedema",
    "epilepsy-on-anticonvulsant": "Epilepsy",
    "continuing-physical-disability": "Continuing physical disability",
    "cancer-or-effects": "Cancer-related",
  };

  F.OUTCOME_LABELS = {
    "eligible": "Eligible",
    "ineligible": "Ineligible",
    "requires-clarification": "Requires clarification",
  };

  F.STATUS_LABELS = {
    "draft": "Draft",
    "ready-to-post": "Ready to post",
    "posted": "Posted",
    "issued": "Issued",
    "rejected": "Rejected",
    "expired": "Expired",
    "cancelled": "Cancelled",
  };
})(window);
