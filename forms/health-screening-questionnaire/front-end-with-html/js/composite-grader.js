// calculateHealthScreening() — the single public entry point. Ports
// front-end-with-svelte/src/lib/engine/grader.ts line for line.
//
// Composes the PAR-Q+ screen, the AUDIT-C alcohol screen, the symptom review,
// and family/medical history into a composite risk band by max-grade: the
// worst finding wins. Safety flags are computed independently and are never
// suppressed by an assessor override. See ../../spec/index.md §3 for the full
// rule table and ../../doc/parq-plus-and-auditc.md for the rule IDs.

import { computeAuditCBand, computeAuditCScore, evaluateAuditC } from './audit-c-rules.js';
import { detectFlags } from './flagged-issues.js';
import { computeParqPlusClearance, evaluateParqPlus } from './parq-rules.js';

function num(v) {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function round1(n) {
  return Math.round(n * 10) / 10;
}

function rule(ruleId, instrument, component, score, band, category, description) {
  return { ruleId, instrument, component, score, band, category, description };
}

/**
 * Age in whole years at the assessment date, or null when either date is
 * unknown.
 */
function ageInYears(birthDate, assessmentDate) {
  if (!birthDate) return null;
  const born = new Date(birthDate);
  const at = assessmentDate ? new Date(assessmentDate) : null;
  if (Number.isNaN(born.getTime()) || !at || Number.isNaN(at.getTime())) return null;
  let age = at.getFullYear() - born.getFullYear();
  const m = at.getMonth() - born.getMonth();
  if (m < 0 || (m === 0 && at.getDate() < born.getDate())) age -= 1;
  return age;
}

/** Body mass index from height and weight, or null when either is missing. */
function computeBodyMassIndex(data) {
  const heightCm = num(data.vitals.heightAsCm);
  const weightKg = num(data.vitals.weightAsKg);
  if (heightCm === null || weightKg === null || heightCm <= 0) return null;
  const heightM = heightCm / 100;
  return round1(weightKg / (heightM * heightM));
}

const RISK_BAND_RANK = { low: 0, moderate: 1, high: 2, 'refer-urgently': 3 };

function worst(a, b) {
  if (!a) return b;
  if (!b) return a;
  return RISK_BAND_RANK[a] >= RISK_BAND_RANK[b] ? a : b;
}

/** Composite risk band by max-grade across every domain. See spec/index.md §3.3. */
function computeRiskBand(data, parqPlusClearance, auditCBand) {
  const s = data.symptoms;
  const fired = [];
  let band = 'low';

  if (s.symptomUnexplainedChestPain === 'yes' || s.symptomDizzySpellsOrFainting === 'yes') {
    band = worst(band, 'refer-urgently');
    fired.push(
      rule(
        'R-COMPOSITE-URGENT',
        'composite',
        'symptom review',
        null,
        'refer-urgently',
        'refer-urgently',
        'Unexplained chest pain or fainting/loss-of-consciousness reported — same-day medical attention needed.'
      )
    );
  }

  const otherRedFlags = [
    s.symptomPersistentCoughOver3Weeks,
    s.symptomUnexplainedWeightLoss,
    s.symptomJointPainRestrictingMovement,
    s.symptomShortnessOfBreathOnExertion,
    s.symptomPalpitations
  ];
  if (otherRedFlags.some((v) => v === 'yes')) {
    band = worst(band, 'high');
    fired.push(
      rule('R-COMPOSITE-HIGH-SYMPTOM', 'composite', 'symptom review', null, 'high', 'high',
        'A red-flag symptom from the step 7 review is present.')
    );
  }

  if (auditCBand === 'higher-risk') {
    band = worst(band, 'high');
    fired.push(rule('R-COMPOSITE-HIGH-AUDITC', 'composite', 'AUDIT-C', null, 'high', 'high', 'AUDIT-C is higher-risk.'));
  }

  const conditions = [
    data.medicalHistory.conditionDiabetes,
    data.medicalHistory.conditionHypertension,
    data.medicalHistory.conditionAsthma,
    data.medicalHistory.conditionCopd,
    data.medicalHistory.conditionHeartDisease,
    data.medicalHistory.conditionKidneyDisease,
    data.medicalHistory.conditionThyroid
  ];
  const conditionCount = conditions.filter((v) => v === 'yes').length;

  if (data.familyHistory.familyHistoryPrematureCardiacEvent === 'yes' && conditionCount > 0) {
    band = worst(band, 'high');
    fired.push(
      rule('R-COMPOSITE-HIGH-FAMILY', 'composite', 'family history', null, 'high', 'high',
        'Family history of a premature cardiac event combined with a current chronic condition.')
    );
  }

  if (parqPlusClearance === 'further-assessment-required') {
    band = worst(band, 'moderate');
    fired.push(
      rule('R-COMPOSITE-MODERATE-PARQ', 'composite', 'PAR-Q+', null, 'moderate', 'moderate',
        'PAR-Q+ requires further assessment.')
    );
  }

  if (auditCBand === 'increasing-risk') {
    band = worst(band, 'moderate');
    fired.push(
      rule('R-COMPOSITE-MODERATE-AUDITC', 'composite', 'AUDIT-C', null, 'moderate', 'moderate',
        'AUDIT-C is increasing-risk.')
    );
  }

  if (conditionCount === 1 && !otherRedFlags.some((v) => v === 'yes')) {
    band = worst(band, 'moderate');
    fired.push(
      rule('R-COMPOSITE-MODERATE-CONDITION', 'composite', 'medical history', conditionCount, 'moderate', 'moderate',
        'A single chronic condition is present without a red-flag symptom.')
    );
  }

  if (fired.length === 0) {
    fired.push(rule('R-COMPOSITE-LOW', 'composite', 'overall', null, 'low', 'low', 'No risk-raising finding identified.'));
  }

  return { band, rules: fired };
}

const RECOMMENDATION_BY_BAND = {
  low: 'clear-to-proceed',
  moderate: 'routine-review',
  high: 'gp-review-required',
  'refer-urgently': 'refer-urgently'
};

/** The single public entry point: grade a health screening questionnaire. */
function calculateHealthScreening(data) {
  const age = ageInYears(data.patient.birthDate, data.context.assessmentDate);
  const isPaediatric = age !== null && age < 16;

  const parqPlusClearance = computeParqPlusClearance(data);
  const auditCScore = computeAuditCScore(data);
  const auditCBand = computeAuditCBand(data);
  const bodyMassIndex = computeBodyMassIndex(data);

  const { band: computedBand, rules: compositeRules } = computeRiskBand(data, parqPlusClearance, auditCBand);
  const computedRiskBand = isPaediatric ? '' : computedBand;
  const computedRecommendation = isPaediatric ? 'paediatric-pathway' : RECOMMENDATION_BY_BAND[computedBand];

  const overrideRiskBand = data.summary.overrideRiskBand;
  const finalRiskBand = overrideRiskBand || computedRiskBand;
  const finalRecommendation =
    finalRiskBand && finalRiskBand !== computedRiskBand
      ? RECOMMENDATION_BY_BAND[finalRiskBand] ?? computedRecommendation
      : computedRecommendation;

  const firedRules = [...evaluateParqPlus(data), ...evaluateAuditC(data), ...compositeRules];

  const flags = detectFlags(data, { parqPlusClearance, auditCScore, auditCBand, age });

  return {
    parqPlusClearance,
    bodyMassIndex,
    auditCScore,
    auditCBand,
    computedRiskBand,
    finalRiskBand,
    computedRecommendation,
    finalRecommendation,
    overrideReason: data.summary.overrideReason,
    isPaediatric,
    firedRules,
    flags
  };
}

export { calculateHealthScreening, computeBodyMassIndex, ageInYears };
