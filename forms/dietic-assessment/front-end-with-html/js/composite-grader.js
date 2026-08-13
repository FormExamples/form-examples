// Composite grader for the Dietetic Assessment.
//
// Composes the MUST rules in must-rules.js, the GLIM / SARC-F / SCOFF /
// refeeding rules in glim-rules.js, and the safety flags in
// flagged-issues.js into a single pure, deterministic grading result. The
// public entry point is `calculateNutritionRisk(data)`. The output shape and
// the rule / flag IDs are identical across every front-end and the back-end.
//
// Algorithm: max-grade. The worst band across every instrument sets the
// composite risk, so a single critical finding cannot be averaged away.

import { detectFlags } from './flagged-issues.js';
import { scoreGlim, scoreRefeedingRisk, scoreSarcf, scoreScoff, ageInYears } from './glim-rules.js';
import { num, rule, scoreMust } from './must-rules.js';

const RISK_ORDER = ['low', 'moderate', 'high', 'critical'];

/** Return whichever of two composite bands is worse. */
function worse(a, b) {
  return RISK_ORDER.indexOf(b) > RISK_ORDER.indexOf(a) ? b : a;
}

/** Map a MUST risk category onto its composite contribution. */
function mustContribution(mustRisk) {
  if (mustRisk === 'high') return 'high';
  if (mustRisk === 'medium') return 'moderate';
  return 'low';
}

/**
 * Derive the overall recommendation from the composite risk, following the
 * BAPEN MUST management pathway with an urgent tier for critical findings.
 */
function deriveRecommendation(compositeRisk) {
  switch (compositeRisk) {
    case 'critical': return 'urgent-referral';
    case 'high': return 'dietetic-treatment-plan';
    case 'moderate': return 'observe-and-rescreen';
    default: return 'routine-care';
  }
}

/**
 * Public entry point. Pure and deterministic: no I/O, no clock. The caller
 * supplies the assessment date via `data.dietitian.assessmentDate`, so age is
 * computed from recorded data rather than from `Date.now()`.
 *
 * @param {object} data - the assessment data model from emptyAssessment()
 * @returns {{
 *   mustBmiScore:number, mustWeightLossScore:number, mustAcuteDiseaseScore:number,
 *   mustScore:number, mustRisk:string, mustIsEstimated:boolean,
 *   bmi:number|null, weightLossPercent:number|null,
 *   glimPhenotypicCriteria:string[], glimEtiologicCriteria:string[], glimDiagnosis:string,
 *   nrs2002Score:number|null, sarcfScore:number|null, scoffScore:number|null,
 *   refeedingRisk:string,
 *   energyRequirementKcal:number|null, proteinRequirementG:number|null,
 *   computedCompositeRisk:string, finalCompositeRisk:string, overrideReason:string,
 *   recommendation:string, firedRules:object[], flags:object[]
 * }}
 */
function calculateNutritionRisk(data) {
  const firedRules = [];

  const age = ageInYears(data.patient.birthDate, data.dietitian.assessmentDate);

  // --- MUST (primary instrument) ------------------------------------------
  const must = scoreMust(data);
  firedRules.push(...must.firedRules);

  // --- GLIM ---------------------------------------------------------------
  const glim = scoreGlim(data, must, age);
  firedRules.push(...glim.firedRules);

  // --- Secondary instruments ----------------------------------------------
  const sarcf = scoreSarcf(data);
  firedRules.push(...sarcf.firedRules);

  const scoff = scoreScoff(data);
  firedRules.push(...scoff.firedRules);

  const refeeding = scoreRefeedingRisk(data, must);
  firedRules.push(...refeeding.firedRules);

  const nrs2002Score = num(data.screening.nrs2002Score);
  if (nrs2002Score !== null && nrs2002Score >= 3) {
    firedRules.push(rule('R-NRS2002-AT-RISK', 'nrs-2002', 'total', nrs2002Score, 'high', 'screening',
      `NRS-2002 score ${nrs2002Score} is at or above the at-risk threshold of 3.`));
  }

  // --- Composite risk (max-grade) ------------------------------------------
  let computedCompositeRisk = mustContribution(must.risk);

  if (glim.diagnosis === 'severe') computedCompositeRisk = worse(computedCompositeRisk, 'critical');
  else if (glim.diagnosis === 'moderate') computedCompositeRisk = worse(computedCompositeRisk, 'high');

  if (refeeding.risk !== 'none') computedCompositeRisk = worse(computedCompositeRisk, 'critical');

  if (nrs2002Score !== null && nrs2002Score >= 3) {
    computedCompositeRisk = worse(computedCompositeRisk, 'high');
  }
  if (sarcf.atRisk) computedCompositeRisk = worse(computedCompositeRisk, 'moderate');

  const intake = num(data.dietaryRecall.proportionOfUsualIntakePercent);
  if (intake !== null && intake < 50) {
    computedCompositeRisk = worse(computedCompositeRisk, 'high');
    firedRules.push(rule('R-COMPOSITE-INTAKE', 'composite', 'intake', null, 'high', 'dietary intake',
      `Oral intake is ${intake}% of usual, below half of the estimated requirement.`));
  }
  if (must.bmi !== null && must.bmi < 16) {
    computedCompositeRisk = worse(computedCompositeRisk, 'critical');
    firedRules.push(rule('R-COMPOSITE-BMI-16', 'composite', 'bmi', null, 'critical', 'anthropometry',
      `Body mass index ${must.bmi} kg/m² is below 16.`));
  }
  if (must.weightLossPercent !== null
      && must.weightLossPercent > 15
      && data.anthropometry.weightLossIsIntentional !== 'yes') {
    computedCompositeRisk = worse(computedCompositeRisk, 'critical');
    firedRules.push(rule('R-COMPOSITE-WL-15', 'composite', 'weight-loss', null, 'critical', 'weight history',
      `Unintentional weight loss of ${must.weightLossPercent}% exceeds 15%.`));
  }
  const unsafeSwallow = data.gastrointestinal.dysphagiaScreenOutcome === 'fail'
    || (data.gastrointestinal.dysphagia === 'yes'
        && data.gastrointestinal.speechAndLanguageTherapy !== 'yes');
  if (unsafeSwallow) {
    computedCompositeRisk = worse(computedCompositeRisk, 'critical');
    firedRules.push(rule('R-COMPOSITE-SWALLOW', 'composite', 'swallow', null, 'critical', 'gastrointestinal',
      'An unsafe or unassessed swallow carries an aspiration risk.'));
  }

  // --- Dietitian override ---------------------------------------------------
  // The override changes the risk category only. Safety flags are computed
  // independently below and are always reported.
  const override = data.plan.overrideCompositeRisk;
  const finalCompositeRisk = RISK_ORDER.includes(override) ? override : computedCompositeRisk;
  const overrideReason = finalCompositeRisk !== computedCompositeRisk
    ? data.plan.overrideReason
    : '';

  const flags = detectFlags(data, {
    must,
    glim,
    sarcf,
    scoff,
    refeedingRisk: refeeding.risk,
    age
  });

  return {
    mustBmiScore: must.bmiScore,
    mustWeightLossScore: must.weightLossScore,
    mustAcuteDiseaseScore: must.acuteDiseaseScore,
    mustScore: must.total,
    mustRisk: must.risk,
    mustIsEstimated: must.estimated,
    bmi: must.bmi,
    adjustedWeightKg: must.adjustedWeightKg,
    weightLossPercent: must.weightLossPercent,
    glimPhenotypicCriteria: glim.phenotypic,
    glimEtiologicCriteria: glim.etiologic,
    glimDiagnosis: glim.diagnosis,
    nrs2002Score,
    sarcfScore: sarcf.score,
    scoffScore: scoff.score,
    refeedingRisk: refeeding.risk,
    energyRequirementKcal: num(data.screening.energyRequirementKcal),
    proteinRequirementG: num(data.screening.proteinRequirementG),
    computedCompositeRisk,
    finalCompositeRisk,
    overrideReason,
    recommendation: deriveRecommendation(finalCompositeRisk),
    firedRules,
    flags
  };
}

export { calculateNutritionRisk, deriveRecommendation, worse, mustContribution, RISK_ORDER };
