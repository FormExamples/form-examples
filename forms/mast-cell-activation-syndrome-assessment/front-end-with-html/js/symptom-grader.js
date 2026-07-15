import { mcasCategory } from './types.js';

// MCAS Symptom Score grader. Pure functions: take an `AssessmentData`
// object and return the total symptom score (0-40, capped), the category,
// the number of organ systems affected, and the list of fired rules.
//
// Mirrors the SvelteKit `symptom-grader.ts` engine. The score is the sum of
// individual symptom severities (each 0-3) across the 5 organ systems
// (5 systems x 4 symptoms = 20 symptoms x max 3 = theoretical 60), capped
// at 40 for clinical relevance.
//
// MCAS Symptom Score categories:
//   0-10  -> Minimal
//   11-20 -> Mild
//   21-30 -> Moderate
//   31-40 -> Severe

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FiredRule} FiredRule
 * @typedef {import('./types.js').SymptomDetail} SymptomDetail
 */

// Wrapped in an IIFE; published via window.MastCellActivationSyndromeAssessment.

/**
 * Score one organ system. Pushes a FiredRule for each symptom with severity
 * > 0 and returns the cumulative system score.
 *
 * @param {string} domainId
 * @param {string} domainName
 * @param {Array<[string, SymptomDetail]>} symptoms
 * @param {FiredRule[]} firedRules
 * @returns {number}
 */
function scoreOrganSystem(domainId, domainName, symptoms, firedRules) {
  let domainScore = 0;
  for (const [name, symptom] of symptoms) {
    const severity = symptom.severity;
    if (severity !== null && severity !== undefined && severity > 0) {
      firedRules.push({
        id: `${domainId}-${name.replace(/\s+/g, '-').toUpperCase()}`,
        domain: domainName,
        description: `${name}: severity ${severity}/3, frequency ${symptom.frequency || 'not specified'}`,
        score: severity
      });
      domainScore += severity;
    }
  }
  return domainScore;
}

/**
 * Pure function: calculates the MCAS Symptom Score from patient data.
 * @param {AssessmentData} data
 * @returns {{ symptomScore: number, mcasCategoryLabel: string,
 *             organSystemsAffected: number, firedRules: FiredRule[] }}
 */
function calculateMCASScore(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  let totalScore = 0;
  let systemsAffected = 0;

  // ─── Dermatological ─────────────────────────────────
  const dermSymptoms = [
    ['Flushing',   data.dermatologicalSymptoms.flushing],
    ['Urticaria',  data.dermatologicalSymptoms.urticaria],
    ['Angioedema', data.dermatologicalSymptoms.angioedema],
    ['Pruritus',   data.dermatologicalSymptoms.pruritus]
  ];
  const dermScore = scoreOrganSystem('MCAS-DERM', 'Dermatological', dermSymptoms, firedRules);
  totalScore += dermScore;
  if (dermScore > 0) systemsAffected++;

  // ─── Gastrointestinal ───────────────────────────────
  const giSymptoms = [
    ['Abdominal Pain', data.gastrointestinalSymptoms.abdominalPain],
    ['Nausea',         data.gastrointestinalSymptoms.nausea],
    ['Diarrhea',       data.gastrointestinalSymptoms.diarrhea],
    ['Bloating',       data.gastrointestinalSymptoms.bloating]
  ];
  const giScore = scoreOrganSystem('MCAS-GI', 'Gastrointestinal', giSymptoms, firedRules);
  totalScore += giScore;
  if (giScore > 0) systemsAffected++;

  // ─── Cardiovascular ─────────────────────────────────
  const cvSymptoms = [
    ['Tachycardia', data.cardiovascularSymptoms.tachycardia],
    ['Hypotension', data.cardiovascularSymptoms.hypotension],
    ['Presyncope',  data.cardiovascularSymptoms.presyncope],
    ['Syncope',     data.cardiovascularSymptoms.syncope]
  ];
  const cvScore = scoreOrganSystem('MCAS-CV', 'Cardiovascular', cvSymptoms, firedRules);
  totalScore += cvScore;
  if (cvScore > 0) systemsAffected++;

  // ─── Respiratory ────────────────────────────────────
  const respSymptoms = [
    ['Wheezing',          data.respiratorySymptoms.wheezing],
    ['Dyspnea',           data.respiratorySymptoms.dyspnea],
    ['Nasal Congestion',  data.respiratorySymptoms.nasalCongestion],
    ['Throat Tightening', data.respiratorySymptoms.throatTightening]
  ];
  const respScore = scoreOrganSystem('MCAS-RESP', 'Respiratory', respSymptoms, firedRules);
  totalScore += respScore;
  if (respScore > 0) systemsAffected++;

  // ─── Neurological ───────────────────────────────────
  const neuroSymptoms = [
    ['Headache',  data.neurologicalSymptoms.headache],
    ['Brain Fog', data.neurologicalSymptoms.brainFog],
    ['Dizziness', data.neurologicalSymptoms.dizziness],
    ['Fatigue',   data.neurologicalSymptoms.fatigue]
  ];
  const neuroScore = scoreOrganSystem('MCAS-NEURO', 'Neurological', neuroSymptoms, firedRules);
  totalScore += neuroScore;
  if (neuroScore > 0) systemsAffected++;

  // Cap score at 40 for clinical relevance.
  const symptomScore = Math.min(totalScore, 40);
  const mcasCategoryLabel = mcasCategory(symptomScore);

  return {
    symptomScore,
    mcasCategoryLabel,
    organSystemsAffected: systemsAffected,
    firedRules
  };
}

export { calculateMCASScore, scoreOrganSystem };
