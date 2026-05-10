import type { AgileAssessment, GradingResult, Maturity } from './types.js';
import { applyMaturityRules } from './maturity-rules.js';
import { detectAdditionalFlags } from './flagged-issues.js';

const MIN_ANSWERED_FOR_REPORT = 6;
const DEFAULT_WEIGHT = 1.0;
const WEIGHT_TOLERANCE = 1e-6;

export function deriveMaturity(meanScore: number | null): Maturity {
  if (meanScore === null) return 'insufficient-data';
  if (meanScore >= 4.5) return 'optimising';
  if (meanScore >= 3.75) return 'mature';
  if (meanScore >= 3.0) return 'developing';
  if (meanScore >= 2.0) return 'initial';
  return 'ad-hoc';
}

function clampWeight(w: number | undefined | null): number {
  if (w === null || w === undefined || Number.isNaN(w)) return DEFAULT_WEIGHT;
  if (w <= 0) return DEFAULT_WEIGHT;
  if (w < 0.5) return 0.5;
  if (w > 2.0) return 2.0;
  return w;
}

export function calculateMaturity(data: AgileAssessment): GradingResult {
  let sum = 0;
  let weightedSum = 0;
  let weightSum = 0;
  let answeredCount = 0;
  let weightsCustomised = false;

  for (const r of data.responses) {
    const w = clampWeight(r.weight);
    if (Math.abs(w - DEFAULT_WEIGHT) > WEIGHT_TOLERANCE) weightsCustomised = true;
    if (r.score !== null) {
      sum += r.score;
      weightedSum += r.score * w;
      weightSum += w;
      answeredCount += 1;
    }
  }

  const enoughAnswers = answeredCount >= MIN_ANSWERED_FOR_REPORT;
  const meanScore = enoughAnswers ? round2(sum / answeredCount) : null;
  const weightedMeanScore = enoughAnswers && weightSum > 0 ? round2(weightedSum / weightSum) : null;
  const maturity = deriveMaturity(weightedMeanScore);

  const { perPrincipleBands, firedRules } = applyMaturityRules(data);
  const additionalFlags = detectAdditionalFlags(data);

  return {
    answeredCount,
    meanScore,
    weightedMeanScore,
    weightsCustomised,
    maturity,
    perPrincipleBands,
    firedRules,
    additionalFlags,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
