import { detectFlags } from './flags.js';
import { requiredSamples, scoreAppropriateness, scoreCompleteness, scoreIdentitySafety, scoreTriage } from './rules.js';

// Four-axis grader for the Medical Haematopoietic Stem Cell Transplant Patients/Donors HLA Typing Request.
// Pure and deterministic. The output shape and rule / flag ids are identical
// across every front-end and the back-end.

function deriveRecommendation(appropriatenessBand, identitySafetyBand, completenessPercent, hasClinicalDetails = true) {
  if (identitySafetyBand === 'reject-risk') return 'reject';
  if (!hasClinicalDetails) return 'query-referrer';
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
  const recommendation = deriveRecommendation(appr.band, identity.band, completeness.percent, String(data.request.clinicalDetails || '').trim() !== '');
  const flags = detectFlags(data, { identitySafetyBand: identity.band });

  return {
    appropriatenessScore: appr.score,
    appropriatenessBand: appr.band,
    identitySafetyBand: identity.band,
    completenessPercent: completeness.percent,
    triageTier: triage.tier,
    targetTimeframe: triage.targetTimeframe,
    requiredSamplesSummary: samples.summary,
    subjectRole: data.request.subjectRole,
    recommendation,
    recommendationLabel: RECOMMENDATION_LABELS[recommendation] || recommendation,
    firedRules,
    flags
  };
}

export { calculateGrade, deriveRecommendation, RECOMMENDATION_LABELS };
