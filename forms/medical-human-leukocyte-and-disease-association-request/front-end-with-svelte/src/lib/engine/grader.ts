import type {
  AppropriatenessBand,
  FiredRule,
  GradingResult,
  IdentitySafetyBand,
  HlaAssociationRequest,
  Recommendation
} from './types';
import { detectFlags } from './flags';
import {
  requiredSamples,
  scoreAppropriateness,
  scoreCompleteness,
  scoreIdentitySafety,
  scoreTriage
} from './rules';
import { selectedTests } from './tests';

// Four-axis grader for the Medical Human Leukocyte and Disease Association Request.
// Pure and deterministic. The output shape and rule / flag ids are identical
// across every front-end and the back-end.

/** Derive the overall vetting recommendation; the least alarming wins only when nothing escalates. */
export function deriveRecommendation(
  appropriatenessBand: AppropriatenessBand,
  identitySafetyBand: IdentitySafetyBand,
  completenessPercent: number,
  hasClinicalDetails = true
): Recommendation {
  if (identitySafetyBand === 'reject-risk') return 'reject';
  if (!hasClinicalDetails) return 'query-referrer';
  if (appropriatenessBand === 'usually-not-appropriate') return 'query-referrer';
  if (completenessPercent < 50) return 'query-referrer';
  if (identitySafetyBand === 'caution') return 'query-referrer';
  return 'accept';
}

export const RECOMMENDATION_LABELS: Record<Recommendation, string> = {
  accept: 'Accept and process',
  'query-referrer': 'Query the referrer',
  reject: 'Reject'
};

/** Public entry point. Pure and deterministic apart from the report timestamp. */
export function calculateGrade(data: HlaAssociationRequest): GradingResult {
  const appr = scoreAppropriateness(data);
  const identity = scoreIdentitySafety(data);
  const completeness = scoreCompleteness(data);
  const triage = scoreTriage(data);
  const samples = requiredSamples(data);

  const firedRules: FiredRule[] = [
    ...appr.firedRules,
    ...identity.firedRules,
    ...completeness.missing,
    ...triage.firedRules
  ];
  const recommendation = deriveRecommendation(
    appr.band,
    identity.band,
    completeness.percent,
    data.clinical.clinicalDetails.trim() !== ''
  );
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
    flags,
    timestamp: new Date().toISOString()
  };
}
