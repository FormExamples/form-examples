// Pure prenatal risk grader.
//
// Mirrors `src/lib/engine/risk-grader.ts` from the SvelteKit reference. Loaded
// as a classic <script>; attaches `calculateRisk` to `window.PrenatalAssessment`.
(function () {
'use strict';
window.PrenatalAssessment = window.PrenatalAssessment || {};

const NS = window.PrenatalAssessment;

function fire(id, firedRules) {
  const rule = NS.riskRules.find((r) => r.id === id);
  if (!rule) return 0;
  firedRules.push({
    id: rule.id,
    category: rule.category,
    description: rule.description,
    weight: rule.weight
  });
  return rule.weight;
}

/**
 * Calculate the cumulative pregnancy risk score from patient assessment data.
 * Returns the total score, risk level, and fired rules for each risk factor
 * that applies.
 */
function calculateRisk(data) {
  const firedRules = [];
  let riskScore = 0;

  // Obstetric history
  if (data.obstetricHistory.previousComplications.preeclampsia === 'yes') {
    riskScore += fire('RISK-OB-001', firedRules);
  }
  if (data.obstetricHistory.previousComplications.gestationalDiabetes === 'yes') {
    riskScore += fire('RISK-OB-002', firedRules);
  }
  if (data.obstetricHistory.previousComplications.pretermBirth === 'yes') {
    riskScore += fire('RISK-OB-003', firedRules);
  }
  if (data.obstetricHistory.previousComplications.cesareanSection === 'yes') {
    riskScore += fire('RISK-OB-004', firedRules);
  }

  // Medical history
  if (data.medicalHistory.hypertension === 'yes') riskScore += fire('RISK-MED-001', firedRules);
  if (data.medicalHistory.diabetes === 'yes') riskScore += fire('RISK-MED-002', firedRules);
  if (data.medicalHistory.autoimmune === 'yes') riskScore += fire('RISK-MED-003', firedRules);
  if (data.medicalHistory.thyroid === 'yes') riskScore += fire('RISK-MED-004', firedRules);

  // Pregnancy details
  if (data.pregnancyDetails.multipleGestation === 'yes') {
    riskScore += fire('RISK-PREG-001', firedRules);
  }
  if (
    data.pregnancyDetails.placentaLocation === 'previa' ||
    data.pregnancyDetails.placentaLocation === 'low-lying'
  ) {
    riskScore += fire('RISK-PREG-002', firedRules);
  }
  if (
    data.pregnancyDetails.conceptionMethod === 'ivf' ||
    data.pregnancyDetails.conceptionMethod === 'icsi'
  ) {
    riskScore += fire('RISK-PREG-003', firedRules);
  }

  // Vital signs
  const sys = data.vitalSigns.bloodPressureSystolic;
  const dia = data.vitalSigns.bloodPressureDiastolic;
  if ((sys !== null && sys >= 140) || (dia !== null && dia >= 90)) {
    riskScore += fire('RISK-VITAL-001', firedRules);
  }
  if (data.vitalSigns.bmi !== null && data.vitalSigns.bmi >= 30) {
    riskScore += fire('RISK-VITAL-002', firedRules);
  }
  const fhr = data.vitalSigns.fetalHeartRate;
  if (fhr !== null && (fhr < 110 || fhr > 160)) {
    riskScore += fire('RISK-VITAL-003', firedRules);
  }

  // Laboratory
  if (data.laboratoryResults.rhFactor === 'negative') {
    riskScore += fire('RISK-LAB-001', firedRules);
  }
  if (data.laboratoryResults.hemoglobin !== null && data.laboratoryResults.hemoglobin < 11) {
    riskScore += fire('RISK-LAB-002', firedRules);
  }
  if (data.laboratoryResults.glucose !== null && data.laboratoryResults.glucose > 7.8) {
    riskScore += fire('RISK-LAB-003', firedRules);
  }
  if (data.laboratoryResults.gbs === 'yes') {
    riskScore += fire('RISK-LAB-004', firedRules);
  }

  // Lifestyle
  if (data.lifestyleNutrition.smoking === 'yes') riskScore += fire('RISK-LIFE-001', firedRules);
  if (data.lifestyleNutrition.alcohol === 'yes') riskScore += fire('RISK-LIFE-002', firedRules);
  if (data.lifestyleNutrition.drugs === 'yes') riskScore += fire('RISK-LIFE-003', firedRules);
  if (data.lifestyleNutrition.folicAcid === 'no') riskScore += fire('RISK-LIFE-004', firedRules);

  // Mental health
  const eds = data.mentalHealthScreening.edinburghScore;
  if (eds !== null && eds >= 13) riskScore += fire('RISK-MH-001', firedRules);
  if (data.mentalHealthScreening.anxietyLevel === 'severe') {
    riskScore += fire('RISK-MH-002', firedRules);
  }
  if (data.mentalHealthScreening.domesticViolenceScreen === 'yes') {
    riskScore += fire('RISK-MH-003', firedRules);
  }

  // Current symptoms
  if (data.currentSymptoms.bleeding === 'yes') riskScore += fire('RISK-SX-001', firedRules);
  if (data.currentSymptoms.reducedFetalMovement === 'yes') {
    riskScore += fire('RISK-SX-002', firedRules);
  }
  if (data.currentSymptoms.visionChanges === 'yes') riskScore += fire('RISK-SX-003', firedRules);
  if (data.currentSymptoms.headache === 'yes') riskScore += fire('RISK-SX-004', firedRules);

  const riskLevel = NS.riskCategory(riskScore);
  return { riskScore, riskLevel, firedRules };
}

Object.assign(window.PrenatalAssessment, { calculateRisk });
})();
