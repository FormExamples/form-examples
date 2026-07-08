// ASA Physical Status Classification rules.
//
// The clinician selects ASA I-VI directly. The risk mapping promotes the
// class to a four-band perioperative risk level used by the composite
// grader.
//
// ASA-001 — class I-II = low; III = medium; IV = high; V-VI = critical.

(function () {
'use strict';
window.AnesthesiologyAssessment = window.AnesthesiologyAssessment || {};

/** Friendly long label for an ASA class. */
function asaClassLabel(klass) {
  switch (klass) {
    case 'i': return 'ASA I — Healthy';
    case 'ii': return 'ASA II — Mild systemic disease';
    case 'iii': return 'ASA III — Severe systemic disease';
    case 'iv': return 'ASA IV — Severe disease, constant threat to life';
    case 'v': return 'ASA V — Moribund, not expected to survive without surgery';
    case 'vi': return 'ASA VI — Brain-dead, organ donor';
    default: return '';
  }
}

/** Risk level for a given ASA class. Returns 'low' for empty class. */
function asaRiskFromClass(klass) {
  switch (klass) {
    case 'i':
    case 'ii':
      return 'low';
    case 'iii':
      return 'medium';
    case 'iv':
      return 'high';
    case 'v':
    case 'vi':
      return 'critical';
    default:
      return 'low';
  }
}

/**
 * Evaluate ASA scoring for the given assessment.
 * Returns the selected class, an "E" suffix flag for emergency cases, the
 * resulting risk level, and the audit-trail rule entry.
 */
function evaluateAsa(d) {
  const klass = d.investigationsAndPlan.asaClass;
  const emergency = d.investigationsAndPlan.emergencyCase === 'yes';
  const risk = asaRiskFromClass(klass);
  const firedRules = [];
  if (klass) {
    firedRules.push({
      id: 'ASA-001',
      category: 'ASA Physical Status',
      description: `${asaClassLabel(klass)}${emergency ? ' (Emergency)' : ''}`,
      riskLevel: risk
    });
  }
  return { class: klass, emergency, riskLevel: risk, firedRules };
}

Object.assign(window.AnesthesiologyAssessment, {
  asaClassLabel,
  asaRiskFromClass,
  evaluateAsa
});
})();
