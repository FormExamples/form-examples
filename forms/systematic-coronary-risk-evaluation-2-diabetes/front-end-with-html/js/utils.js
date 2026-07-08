// SCORE2-Diabetes - Pure utility helpers used by rules, grader, and UI.
(function () {
'use strict';

const NS = (window.SystematicCoronaryRiskEvaluation2Diabetes =
  window.SystematicCoronaryRiskEvaluation2Diabetes || {});

/**
 * Calculate BMI from height (cm) and weight (kg). Returns null if either
 * input is missing or non-positive. Result rounded to 1 decimal place.
 */
function calculateBmi(heightCm, weightKg) {
  if (heightCm == null || weightKg == null || heightCm <= 0) return null;
  const hM = heightCm / 100;
  return Math.round((weightKg / (hM * hM)) * 10) / 10;
}

/** Calculate age from a YYYY-MM-DD date-of-birth string. */
function calculateAge(dob) {
  if (!dob) return null;
  const parts = String(dob).split('-');
  if (parts.length !== 3) return null;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
  const now = new Date();
  let age = now.getFullYear() - year;
  const nowMonth = now.getMonth() + 1;
  const nowDay = now.getDate();
  if (nowMonth < month || (nowMonth === month && nowDay < day)) age--;
  return age;
}

/** Patient has established CVD if any qualifying flag is set to "yes". */
function hasEstablishedCvd(data) {
  const cv = data.cardiovascularHistory;
  return (
    cv.previousMi === 'yes' ||
    cv.previousStroke === 'yes' ||
    cv.previousTia === 'yes' ||
    cv.peripheralArterialDisease === 'yes' ||
    cv.heartFailure === 'yes'
  );
}

/**
 * Convert HbA1c percent (DCCT) to mmol/mol if the user entered the value
 * in percent units. Returns null when no value is entered.
 */
function hba1cMmolMol(data) {
  const val = data.diabetesHistory.hba1cValue;
  if (val == null) return null;
  if (data.diabetesHistory.hba1cUnit === 'percent') {
    // IFCC formula: mmol/mol = (% - 2.15) * 10.929
    return Math.round((val - 2.15) * 10.929 * 10) / 10;
  }
  return val;
}

/** Determine CKD stage from eGFR. */
function ckdStageFromEgfr(egfr) {
  if (egfr == null) return '';
  if (egfr >= 90) return 'G1';
  if (egfr >= 60) return 'G2';
  if (egfr >= 45) return 'G3a';
  if (egfr >= 30) return 'G3b';
  if (egfr >= 15) return 'G4';
  return 'G5';
}

/**
 * Heuristic: an assessment is treated as "draft" while none of the core
 * identifying / scoring fields are populated. Used by the grader to avoid
 * showing a meaningless category on a fresh form.
 */
function isLikelyDraft(data) {
  return (
    data.patientDemographics.fullName.trim() === '' &&
    data.patientDemographics.dateOfBirth === '' &&
    data.diabetesHistory.hba1cValue == null &&
    data.bloodPressure.systolicBp == null
  );
}

/** Human-readable label for a risk category. */
function riskCategoryLabel(category) {
  switch (category) {
    case 'veryHigh': return 'Very High Risk';
    case 'high': return 'High Risk';
    case 'moderate': return 'Moderate Risk';
    case 'low': return 'Low Risk';
    case 'draft': return 'Draft';
    default: return 'Unknown';
  }
}

/** CSS class suffix for a risk category badge. */
function riskCategoryClass(category) {
  switch (category) {
    case 'veryHigh': return 'risk-very-high';
    case 'high': return 'risk-high';
    case 'moderate': return 'risk-moderate';
    case 'low': return 'risk-low';
    case 'draft': return 'risk-draft';
    default: return 'risk-unknown';
  }
}

NS.calculateBmi = calculateBmi;
NS.calculateAge = calculateAge;
NS.hasEstablishedCvd = hasEstablishedCvd;
NS.hba1cMmolMol = hba1cMmolMol;
NS.ckdStageFromEgfr = ckdStageFromEgfr;
NS.isLikelyDraft = isLikelyDraft;
NS.riskCategoryLabel = riskCategoryLabel;
NS.riskCategoryClass = riskCategoryClass;
})();
