import { evaluateRules } from './risk-rules.js';
import { calculateBMI, calculateTcHdlRatio, emptyAssessment, isLikelyDraft, smokingPoints } from './types.js';

// 10-year CVD risk estimator + heart-age calculator + grading orchestration.
// Mirrors `src/lib/engine/risk-calculator.ts` and `risk-grader.ts` from the
// SvelteKit reference. Pure functions — no side effects.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

/**
 * Estimate the 10-year cardiovascular risk percentage from assessment data.
 * Uses a simplified QRISK3-shaped points model with an exponential mapping;
 * result is clamped to [0.1, 95].
 *
 * @param {AssessmentData} data
 * @returns {number}
 */
function estimateTenYearRisk(data) {
  let points = 0;

  // Age contribution
  if (data.demographicsEthnicity.age != null) {
    const age = data.demographicsEthnicity.age;
    if (data.demographicsEthnicity.sex === 'male') {
      points += Math.max(age - 25, 0) * 0.8;
    } else {
      points += Math.max(age - 25, 0) * 0.6;
    }
  }

  // Smoking
  points += smokingPoints(data.smokingAlcohol.smokingStatus);

  // Systolic BP
  if (data.bloodPressure.systolicBP != null) {
    points += Math.max((data.bloodPressure.systolicBP - 100) * 0.15, 0);
    if (data.bloodPressure.systolicBPSD != null && data.bloodPressure.systolicBPSD > 10) {
      points += 5;
    }
  }

  // Cholesterol ratio
  const tcHdl = data.cholesterol.totalHDLRatio
    ?? calculateTcHdlRatio(data.cholesterol.totalCholesterol, data.cholesterol.hdlCholesterol);
  if (tcHdl != null) {
    points += Math.max((tcHdl - 3) * 3, 0);
  }

  // Diabetes
  if (data.medicalConditions.hasDiabetes === 'type1') {
    points += 20;
  } else if (data.medicalConditions.hasDiabetes === 'type2') {
    points += 15;
  }

  // Cardiac/renal/inflammatory comorbidities
  if (data.medicalConditions.hasAtrialFibrillation === 'yes') points += 10;
  if (data.medicalConditions.hasChronicKidneyDisease === 'yes') points += 10;
  if (data.medicalConditions.hasRheumatoidArthritis === 'yes') points += 5;

  // Family CVD under 60
  if (data.familyHistory.familyCVDUnder60 === 'yes') points += 10;

  // Townsend deprivation
  if (
    data.demographicsEthnicity.townsendDeprivation != null &&
    data.demographicsEthnicity.townsendDeprivation > 0
  ) {
    points += data.demographicsEthnicity.townsendDeprivation * 1.5;
  }

  // BMI
  const bmi = data.bodyMeasurements.bmi
    ?? calculateBMI(data.bodyMeasurements.heightCm, data.bodyMeasurements.weightKg);
  if (bmi != null && bmi > 25) {
    points += (bmi - 25) * 0.5;
  }

  // Medications and other modifiers
  if (data.bloodPressure.onBPTreatment === 'yes') points += 3;
  if (data.medicalConditions.onAtypicalAntipsychotic === 'yes') points += 3;
  if (data.medicalConditions.onCorticosteroids === 'yes') points += 5;
  if (data.medicalConditions.hasMigraine === 'yes') points += 3;
  if (data.medicalConditions.hasSevereMentalIllness === 'yes') points += 3;

  // Erectile dysfunction (males only)
  if (
    data.demographicsEthnicity.sex === 'male' &&
    data.medicalConditions.hasErectileDysfunction === 'yes'
  ) {
    points += 5;
  }

  const risk = 0.8 * Math.exp(0.1 * points);
  const rounded = Math.round(risk * 10) / 10;
  return Math.min(Math.max(rounded, 0.1), 95);
}

/**
 * Find the age at which an "average" patient (non-smoker, BP 120, TC/HDL 4.0)
 * matches the calculated 10-year risk for the actual patient. Returns null if
 * age or sex is missing.
 *
 * @param {AssessmentData} data
 * @param {number} actualRisk
 * @returns {number | null}
 */
function calculateHeartAge(data, actualRisk) {
  if (data.demographicsEthnicity.age == null) return null;
  const sex = data.demographicsEthnicity.sex;
  if (!sex) return null;

  for (let testAge = 25; testAge <= 100; testAge++) {
    const baseline = emptyAssessment();
    baseline.demographicsEthnicity.age = testAge;
    baseline.demographicsEthnicity.sex = sex;
    baseline.bloodPressure.systolicBP = 120;
    baseline.cholesterol.totalHDLRatio = 4;
    baseline.smokingAlcohol.smokingStatus = 'nonSmoker';

    const baselineRisk = estimateTenYearRisk(baseline);
    if (baselineRisk >= actualRisk) {
      return Math.min(testAge, 100);
    }
  }
  return 100;
}

/**
 * Top-level orchestration: classify the patient into a risk category and
 * return all fired rules. Returns a 'draft' result if neither age nor sex is
 * filled in.
 *
 * @param {AssessmentData} data
 * @returns {{ riskCategory: string, tenYearRiskPercent: number, heartAge: number | null, firedRules: FiredRule[] }}
 */
function calculateRisk(data) {
  if (isLikelyDraft(data)) {
    return { riskCategory: 'draft', tenYearRiskPercent: 0, heartAge: null, firedRules: [] };
  }

  const tenYearRiskPercent = estimateTenYearRisk(data);
  const heartAge = calculateHeartAge(data, tenYearRiskPercent);
  const firedRules = evaluateRules(data, tenYearRiskPercent, heartAge);

  let riskCategory;
  if (tenYearRiskPercent >= 20) {
    riskCategory = 'high';
  } else if (tenYearRiskPercent >= 10) {
    riskCategory = 'moderate';
  } else {
    riskCategory = 'low';
  }

  return { riskCategory, tenYearRiskPercent, heartAge, firedRules };
}

export { estimateTenYearRisk, calculateHeartAge, calculateRisk };
