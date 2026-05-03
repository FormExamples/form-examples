// Revised Cardiac Risk Index (Lee Index) — 6 criteria, each worth 1 point.
//
// RCRI-001  High-risk surgery (auto from surgery grade major or complex)
// RCRI-002  History of ischaemic heart disease (clinician-confirmed)
// RCRI-003  History of congestive heart failure (clinician-confirmed)
// RCRI-004  History of cerebrovascular disease — stroke or TIA
// RCRI-005  Insulin-dependent diabetes (auto from medication flag)
// RCRI-006  Pre-op serum creatinine >177 µmol/L (>2 mg/dL)
//
// Score risk mapping: 0 = low, 1 = medium, 2 = high, >=3 = critical.
// MACE risk per published Lee Index: 0=0.4%, 1=1.0%, 2=2.4%, >=3=5.4%.

(function () {
'use strict';
window.AnesthesiologyAssessment = window.AnesthesiologyAssessment || {};

function rcriRiskFromScore(score) {
  if (score >= 3) return 'critical';
  if (score === 2) return 'high';
  if (score === 1) return 'medium';
  return 'low';
}

function rcriMacePercent(score) {
  if (score >= 3) return 5.4;
  if (score === 2) return 2.4;
  if (score === 1) return 1.0;
  return 0.4;
}

function evaluateRcri(d) {
  const grade = d.plannedSurgery.surgeryGrade;
  const ip = d.investigationsAndPlan;
  const meds = d.medications;
  const firedRules = [];
  let score = 0;

  if (grade === 'major' || grade === 'complex') {
    score++;
    firedRules.push({
      id: 'RCRI-001',
      category: 'Cardiac',
      description: `High-risk surgery (${grade}).`,
      riskLevel: 'medium'
    });
  }
  if (ip.rcriIschaemicHeartDisease === 'yes') {
    score++;
    firedRules.push({
      id: 'RCRI-002',
      category: 'Cardiac',
      description: 'History of ischaemic heart disease.',
      riskLevel: 'medium'
    });
  }
  if (ip.rcriCongestiveHeartFailure === 'yes') {
    score++;
    firedRules.push({
      id: 'RCRI-003',
      category: 'Cardiac',
      description: 'History of congestive heart failure.',
      riskLevel: 'medium'
    });
  }
  if (ip.rcriCerebrovascularDisease === 'yes') {
    score++;
    firedRules.push({
      id: 'RCRI-004',
      category: 'Cardiac',
      description: 'History of cerebrovascular disease (stroke / TIA).',
      riskLevel: 'medium'
    });
  }
  if (meds.onInsulin === 'yes') {
    score++;
    firedRules.push({
      id: 'RCRI-005',
      category: 'Cardiac',
      description: 'Insulin-dependent diabetes.',
      riskLevel: 'medium'
    });
  }
  if (ip.rcriHighCreatinine === 'yes') {
    score++;
    firedRules.push({
      id: 'RCRI-006',
      category: 'Cardiac',
      description: 'Serum creatinine >177 µmol/L (>2 mg/dL).',
      riskLevel: 'medium'
    });
  }

  return {
    score,
    macePercent: rcriMacePercent(score),
    riskLevel: rcriRiskFromScore(score),
    firedRules
  };
}

Object.assign(window.AnesthesiologyAssessment, {
  rcriRiskFromScore,
  rcriMacePercent,
  evaluateRcri
});
})();
