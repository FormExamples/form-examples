// Composite perioperative-risk grader.
//
// Runs the four sub-graders (ASA, Mallampati airway, RCRI, STOP-BANG) and
// promotes the worst sub-risk to the overall risk level. Also collects
// every fired rule for the report's audit trail.

(function () {
'use strict';
window.AnesthesiologyAssessment = window.AnesthesiologyAssessment || {};
const {
  evaluateAsa,
  evaluateAirway,
  evaluateRcri,
  evaluateStopbang,
  worstRisk
} = window.AnesthesiologyAssessment;

function gradeAssessment(d) {
  const asa = evaluateAsa(d);
  const airway = evaluateAirway(d);
  const rcri = evaluateRcri(d);
  const stopbang = evaluateStopbang(d);

  let overallRisk = 'low';
  overallRisk = worstRisk(overallRisk, asa.riskLevel);
  overallRisk = worstRisk(overallRisk, airway.riskLevel);
  overallRisk = worstRisk(overallRisk, rcri.riskLevel);
  overallRisk = worstRisk(overallRisk, stopbang.riskLevel);

  const firedRules = [
    ...asa.firedRules,
    ...airway.firedRules,
    ...rcri.firedRules,
    ...stopbang.firedRules
  ];

  return {
    asa,
    airway,
    rcri,
    stopbang,
    overallRisk,
    firedRules
  };
}

window.AnesthesiologyAssessment.gradeAssessment = gradeAssessment;
})();
