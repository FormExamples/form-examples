// Utility helpers for the Substance Abuse Assessment form: BMI, AUDIT
// scoring, DAST scoring, risk-category derivation, and label/colour
// helpers. Mirrors `src/lib/engine/utils.ts` from the SvelteKit reference.
(function () {
'use strict';
const NS = window.SubstanceAbuseAssessment;

/** Calculate BMI from weight (kg) and height (cm). Returns null if invalid. */
function calculateBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) return null;
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

/** Get BMI category label. */
function bmiCategory(bmi) {
  if (bmi === null || bmi === undefined) return '';
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  if (bmi < 35) return 'Obese Class I';
  if (bmi < 40) return 'Obese Class II';
  return 'Obese Class III (Morbid)';
}

/** Calculate AUDIT total score (0-40) from individual question scores. */
function calculateAuditScore(q) {
  return (
    (q.auditQ1Frequency || 0) +
    (q.auditQ2TypicalQuantity || 0) +
    (q.auditQ3BingeFrequency || 0) +
    (q.auditQ4ImpairedControl || 0) +
    (q.auditQ5FailedExpectations || 0) +
    (q.auditQ6MorningDrinking || 0) +
    (q.auditQ7Guilt || 0) +
    (q.auditQ8Blackout || 0) +
    (q.auditQ9Injury || 0) +
    (q.auditQ10Concern || 0)
  );
}

/** Derive AUDIT risk category from total score. */
function auditRiskCategory(score) {
  if (score <= 7) return 'low-risk';
  if (score <= 15) return 'hazardous';
  if (score <= 19) return 'harmful';
  return 'dependence-likely';
}

/** AUDIT risk category label. */
function auditRiskLabel(category) {
  switch (category) {
    case 'low-risk': return 'Low Risk (0-7)';
    case 'hazardous': return 'Hazardous (8-15)';
    case 'harmful': return 'Harmful (16-19)';
    case 'dependence-likely': return 'Dependence Likely (20-40)';
    default: return 'Not scored';
  }
}

/** Calculate DAST-10 total score from yes/no answers. Q3 is inversely scored. */
function calculateDastScore(q) {
  let score = 0;
  if (q.dastQ1NonMedicalUse === 'yes') score++;
  if (q.dastQ2PolyDrug === 'yes') score++;
  if (q.dastQ3AbleToStop === 'no') score++; // inversely scored
  if (q.dastQ4Blackouts === 'yes') score++;
  if (q.dastQ5Guilt === 'yes') score++;
  if (q.dastQ6Complaints === 'yes') score++;
  if (q.dastQ7Neglect === 'yes') score++;
  if (q.dastQ8IllegalActivities === 'yes') score++;
  if (q.dastQ9Withdrawal === 'yes') score++;
  if (q.dastQ10MedicalProblems === 'yes') score++;
  return score;
}

/** Derive DAST-10 risk category from total score. */
function dastRiskCategory(score) {
  if (score === 0) return 'no-problems';
  if (score <= 2) return 'low';
  if (score <= 5) return 'moderate';
  if (score <= 8) return 'substantial';
  return 'severe';
}

/** DAST risk category label. */
function dastRiskLabel(category) {
  switch (category) {
    case 'no-problems': return 'No Problems (0)';
    case 'low': return 'Low Level (1-2)';
    case 'moderate': return 'Moderate Level (3-5)';
    case 'substantial': return 'Substantial Level (6-8)';
    case 'severe': return 'Severe Level (9-10)';
    default: return 'Not scored';
  }
}

/** Overall risk level label. */
function riskLevelLabel(risk) {
  switch (risk) {
    case 'low': return 'Low Risk';
    case 'moderate': return 'Moderate Risk';
    case 'high': return 'High Risk';
    case 'critical': return 'Critical Risk';
    default: return 'Not scored';
  }
}

/** Map overall risk level to a CSS class for the report badge. */
function riskLevelClass(risk) {
  switch (risk) {
    case 'low': return 'risk-low';
    case 'moderate': return 'risk-moderate';
    case 'high': return 'risk-high';
    case 'critical': return 'risk-critical';
    default: return '';
  }
}

/** Substance grade label. */
function substanceGradeLabel(grade) {
  switch (grade) {
    case 1: return 'Grade I — Minimal';
    case 2: return 'Grade II — Mild';
    case 3: return 'Grade III — Moderate';
    case 4: return 'Grade IV — Severe';
    default: return 'Grade ' + grade;
  }
}

Object.assign(NS, {
  calculateBMI,
  bmiCategory,
  calculateAuditScore,
  auditRiskCategory,
  auditRiskLabel,
  calculateDastScore,
  dastRiskCategory,
  dastRiskLabel,
  riskLevelLabel,
  riskLevelClass,
  substanceGradeLabel
});
})();
