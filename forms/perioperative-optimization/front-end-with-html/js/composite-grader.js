// Composite grader for Perioperative Optimization.
//
// Evaluates the eight domains, gates each against the time remaining before
// surgery, and combines them by max-grade into a surgical readiness band. The
// public entry point is `calculateOptimization(data)`.
//
// Pure and deterministic: both dates come from the recorded data, so the
// function never touches the clock.

import {
  DOMAIN_EVALUATORS,
  DOMAIN_ORDER,
  computeAuditCScore,
  computeBmi,
  computeFriedPhenotypeScore,
  computeMustScore,
  computeWeightLossPercent,
  mustRisk,
  num
} from './domain-rules.js';
import { detectFlags } from './flagged-issues.js';
import { gateDomain, recommendedEarliestSurgeryDate, weeksBetween } from './gating.js';

const READINESS_ORDER = [
  'ready',
  'optimization-in-progress',
  'optimization-required',
  'defer-surgery'
];

/** Map a domain status onto the readiness band it implies. */
const STATUS_TO_READINESS = {
  'optimized': 'ready',
  'not-applicable': 'ready',
  'in-progress': 'optimization-in-progress',
  'action-required': 'optimization-required',
  'insufficient-time': 'defer-surgery'
};

/** Return whichever of two readiness bands is worse. */
function worse(a, b) {
  return READINESS_ORDER.indexOf(b) > READINESS_ORDER.indexOf(a) ? b : a;
}

/**
 * Public entry point. Pure and deterministic.
 *
 * @param {object} data - the assessment data model from emptyAssessment()
 * @returns {object} the grading result
 */
function calculateOptimization(data) {
  const weeksToSurgery = weeksBetween(
    data.assessment.assessmentDate,
    data.procedure.plannedSurgeryDate
  );
  const gatingApplied = weeksToSurgery !== null;

  // --- Evaluate and gate each domain ---------------------------------------
  const domains = DOMAIN_ORDER.map((domain) => {
    const evaluation = DOMAIN_EVALUATORS[domain](data);
    const gated = gateDomain(evaluation, weeksToSurgery);
    return {
      domain,
      status: gated.status,
      triggered: evaluation.triggered,
      leadTimeWeeks: evaluation.leadTimeWeeks,
      weeksShortfall: gated.weeksShortfall,
      interventionStarted: evaluation.started,
      ruleId: evaluation.ruleId,
      finding: evaluation.finding,
      intervention: evaluation.intervention
    };
  });

  // --- Composite readiness (max-grade) --------------------------------------
  let computedReadiness = 'ready';
  for (const d of domains) {
    computedReadiness = worse(computedReadiness, STATUS_TO_READINESS[d.status] ?? 'ready');
  }

  // Two findings force a deferral regardless of the time available, because
  // they are unsafe to operate on rather than merely unoptimized.
  const hb = num(data.anaemia.haemoglobinGPerL);
  const hba1c = num(data.glycaemic.hba1cMmolPerMol);
  if (hb !== null && hb < 80) computedReadiness = 'defer-surgery';
  if (hba1c !== null && hba1c >= 69) computedReadiness = 'defer-surgery';

  // --- Clinician override -----------------------------------------------------
  // Changes the band only. Safety flags below are computed independently.
  const override = data.signoff.overrideReadiness;
  const finalReadiness = READINESS_ORDER.includes(override) ? override : computedReadiness;
  const overrideReason = finalReadiness !== computedReadiness ? data.signoff.overrideReason : '';

  // --- Derived instrument scores ------------------------------------------------
  const mustScore = computeMustScore(data);
  const auditCScore = computeAuditCScore(data);

  const flags = detectFlags(data, {
    domains,
    mustScore,
    auditCScore,
    weeksToSurgery
  });
  const fried = computeFriedPhenotypeScore(data);

  const counts = {
    optimized: domains.filter((d) => d.status === 'optimized' || d.status === 'not-applicable').length,
    inProgress: domains.filter((d) => d.status === 'in-progress').length,
    actionRequired: domains.filter((d) => d.status === 'action-required').length,
    insufficientTime: domains.filter((d) => d.status === 'insufficient-time').length
  };

  return {
    weeksToSurgery,
    gatingApplied,
    domains,
    counts,
    bmi: computeBmi(data),
    weightLossPercent: computeWeightLossPercent(data),
    mustScore,
    mustRisk: mustRisk(mustScore),
    auditCScore,
    stopBangScore: num(data.cardioresp.stopBangScore),
    dukeActivityStatusIndex: num(data.fitness.dukeActivityStatusIndex),
    clinicalFrailtyScale: num(data.frailty.clinicalFrailtyScale),
    friedPhenotypeScore: fried.score,
    friedFrailtyCategory: fried.category,
    computedReadiness,
    finalReadiness,
    overrideReason,
    gateDecision: data.signoff.gateDecision,
    recommendedEarliestSurgeryDate:
      recommendedEarliestSurgeryDate(domains, data.procedure.plannedSurgeryDate),
    flags
  };
}

export { calculateOptimization, worse, READINESS_ORDER, STATUS_TO_READINESS };
