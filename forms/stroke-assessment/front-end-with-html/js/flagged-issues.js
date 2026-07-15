import { calculateNIHSS } from './nihss-grader.js';
import { hoursFromOnset } from './types.js';

// Flagged-issue detection for acute stroke. Independent of the raw NIHSS
// total (which the grader computes), this module raises clinician-facing
// flags for safety-critical or clinically significant findings: sudden
// onset, severe NIHSS, depressed level of consciousness, severe aphasia,
// bilateral motor deficits, time-to-thrombolysis window, atrial
// fibrillation, anticoagulant use, prior stroke, hypertension, diabetes,
// antiplatelet use, and documented allergies (anaphylaxis flagged urgent).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').AdditionalFlag} AdditionalFlag
 */

/**
 * @param {AssessmentData} data
 * @returns {AdditionalFlag[]}
 */
function detectAdditionalFlags(data) {
  
  /** @type {AdditionalFlag[]} */
  const flags = [];

  const { nihssScore } = calculateNIHSS(data);

  // ─── Acute onset ─────────────────────────────────────────
  if (data.symptomOnset.symptomProgression === 'sudden') {
    flags.push({
      id: 'FLAG-ONSET-001',
      category: 'Acute Onset',
      message: 'Sudden symptom onset - consistent with acute stroke presentation. Activate stroke pathway.',
      priority: 'urgent'
    });
  }

  // ─── Severe NIHSS >15 ────────────────────────────────────
  if (nihssScore > 15) {
    flags.push({
      id: 'FLAG-SEVERE-001',
      category: 'Severe Stroke',
      message: `NIHSS score ${nihssScore} indicates moderate to severe or severe stroke - consider urgent intervention (thrombolysis / thrombectomy as eligible).`,
      priority: 'urgent'
    });
  }

  // ─── LOC impairment ──────────────────────────────────────
  if (data.levelOfConsciousness.loc !== null && data.levelOfConsciousness.loc >= 2) {
    flags.push({
      id: 'FLAG-LOC-001',
      category: 'LOC Impairment',
      message: 'Significant level of consciousness impairment - patient requires close monitoring and airway assessment.',
      priority: 'high'
    });
  }

  // ─── Severe aphasia ──────────────────────────────────────
  if (data.languageDysarthria.bestLanguage !== null && data.languageDysarthria.bestLanguage >= 2) {
    flags.push({
      id: 'FLAG-LANGUAGE-001',
      category: 'Language Deficit',
      message: 'Severe aphasia detected - communication support and speech therapy referral recommended.',
      priority: 'high'
    });
  }

  // ─── Bilateral motor deficits ────────────────────────────
  const leftMotor = Math.max(
    data.facialPalsy.leftArm ?? 0,
    data.facialPalsy.leftLeg ?? 0
  );
  const rightMotor = Math.max(
    data.facialPalsy.rightArm ?? 0,
    data.facialPalsy.rightLeg ?? 0
  );
  if (leftMotor >= 2 && rightMotor >= 2) {
    flags.push({
      id: 'FLAG-BILATERAL-001',
      category: 'Bilateral Motor Deficit',
      message: 'Bilateral motor deficits detected - consider basilar artery occlusion or brainstem involvement.',
      priority: 'urgent'
    });
  }

  // ─── Within thrombolysis window ──────────────────────────
  const hoursElapsed = hoursFromOnset(data.symptomOnset.onsetTime);
  if (hoursElapsed !== null && hoursElapsed <= 4.5) {
    flags.push({
      id: 'FLAG-THROMBOLYSIS-001',
      category: 'Thrombolysis Window',
      message: `Symptom onset ${hoursElapsed.toFixed(1)} hours ago - within thrombolysis window (4.5 hours). Evaluate for IV tPA eligibility.`,
      priority: 'urgent'
    });
  }

  // ─── Atrial fibrillation ─────────────────────────────────
  if (data.riskFactors.atrialFibrillation === 'yes') {
    flags.push({
      id: 'FLAG-AFIB-001',
      category: 'Atrial Fibrillation',
      message: 'Known atrial fibrillation - consider cardioembolic stroke aetiology and anticoagulation status.',
      priority: 'high'
    });
  }

  // ─── Anticoagulant use ───────────────────────────────────
  if (data.currentMedications.anticoagulants === 'yes') {
    flags.push({
      id: 'FLAG-ANTICOAG-001',
      category: 'Anticoagulant Use',
      message: `Patient on anticoagulants: ${data.currentMedications.anticoagulantDetails || 'details not specified'} - check INR/anti-Xa levels before thrombolysis.`,
      priority: 'high'
    });
  }

  // ─── Previous stroke ─────────────────────────────────────
  if (data.riskFactors.previousStroke === 'yes') {
    flags.push({
      id: 'FLAG-PREV-STROKE-001',
      category: 'Previous Stroke',
      message: 'History of previous stroke or TIA - compare with prior deficits and imaging.',
      priority: 'medium'
    });
  }

  // ─── Hypertension ────────────────────────────────────────
  if (data.riskFactors.hypertension === 'yes') {
    flags.push({
      id: 'FLAG-HTN-001',
      category: 'Hypertension',
      message: 'Known hypertension - monitor blood pressure closely, target per stroke protocol.',
      priority: 'medium'
    });
  }

  // ─── Diabetes ────────────────────────────────────────────
  if (data.riskFactors.diabetes === 'yes') {
    flags.push({
      id: 'FLAG-DIABETES-001',
      category: 'Diabetes',
      message: 'Known diabetes - check blood glucose, maintain normoglycaemia.',
      priority: 'medium'
    });
  }

  // ─── Hyperlipidemia ──────────────────────────────────────
  if (data.riskFactors.hyperlipidemia === 'yes') {
    flags.push({
      id: 'FLAG-LIPIDS-001',
      category: 'Hyperlipidemia',
      message: 'Hyperlipidemia present - review lipid profile and statin therapy for secondary prevention.',
      priority: 'low'
    });
  }

  // ─── Smoking ─────────────────────────────────────────────
  if (data.riskFactors.smoking === 'yes') {
    flags.push({
      id: 'FLAG-SMOKE-001',
      category: 'Smoking',
      message: 'Current smoker - smoking cessation counselling for secondary prevention.',
      priority: 'medium'
    });
  }

  // ─── Antiplatelet use ────────────────────────────────────
  if (data.currentMedications.antiplatelets === 'yes') {
    flags.push({
      id: 'FLAG-ANTIPLATELET-001',
      category: 'Antiplatelet Use',
      message: `Patient on antiplatelets: ${data.currentMedications.antiplateletDetails || 'details not specified'} - note for treatment decisions.`,
      priority: 'medium'
    });
  }

  // ─── Drug allergies ──────────────────────────────────────
  for (let i = 0; i < data.currentMedications.allergies.length; i++) {
    const allergy = data.currentMedications.allergies[i];
    if (allergy && allergy.severity === 'anaphylaxis') {
      flags.push({
        id: `FLAG-ALLERGY-ANAPH-${i}`,
        category: 'Allergy',
        message: `ANAPHYLAXIS history: ${allergy.allergen || '(allergen not specified)'}.`,
        priority: 'urgent'
      });
    }
  }

  if (data.currentMedications.allergies.length > 0) {
    flags.push({
      id: 'FLAG-ALLERGY-001',
      category: 'Allergy',
      message: `${data.currentMedications.allergies.length} allergy/allergies documented.`,
      priority: 'medium'
    });
  }

  // Sort: urgent > high > medium > low
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectAdditionalFlags };
