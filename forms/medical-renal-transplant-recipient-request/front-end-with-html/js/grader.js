import { detectFlags } from './flags.js';
import { requiredSamples, scoreAppropriateness, scoreCompleteness, scoreIdentitySafety, scoreTriage } from './rules.js';
import { selectedTests } from './types.js';

// Four-axis grader for the Medical Renal Transplant Recipient Request.
// Pure and deterministic. The output shape and rule / flag ids are identical
// across every front-end and the back-end.

function deriveRecommendation(appropriatenessBand, identitySafetyBand, completenessPercent) {
  if (identitySafetyBand === 'reject-risk') return 'reject';
  if (appropriatenessBand === 'usually-not-appropriate') return 'query-referrer';
  if (completenessPercent < 50) return 'query-referrer';
  if (identitySafetyBand === 'caution') return 'query-referrer';
  return 'accept';
}

const RECOMMENDATION_LABELS = {
  'accept': 'Accept and process',
  'query-referrer': 'Query the referrer',
  'reject': 'Reject'
};

function calculateGrade(data) {
  const appr = scoreAppropriateness(data);
  const identity = scoreIdentitySafety(data);
  const completeness = scoreCompleteness(data);
  const triage = scoreTriage(data);
  const samples = requiredSamples(data);

  const firedRules = [
    ...appr.firedRules,
    ...identity.firedRules,
    ...completeness.missing,
    ...triage.firedRules
  ];
  const recommendation = deriveRecommendation(appr.band, identity.band, completeness.percent);
  const flags = detectFlags(data, { identitySafetyBand: identity.band });

  return {
    appropriatenessScore: appr.score,
    appropriatenessBand: appr.band,
    identitySafetyBand: identity.band,
    completenessPercent: completeness.percent,
    triageTier: triage.tier,
    targetTimeframe: triage.targetTimeframe,
    requiredSamplesSummary: samples.summary,
    selectedTests: selectedTests(data).map((t) => t.code),
    recommendation,
    recommendationLabel: RECOMMENDATION_LABELS[recommendation] || recommendation,
    firedRules,
    flags
  };
}

export { calculateGrade, deriveRecommendation, RECOMMENDATION_LABELS };
