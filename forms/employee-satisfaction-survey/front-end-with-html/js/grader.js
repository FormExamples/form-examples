import { GRADED_DOMAIN_KEYS, surveyItems } from './rules.js';
import { classifyENps, classifyScore } from './types.js';

// Employee Satisfaction Survey grader. Pure functions: given an
// `AssessmentData` object, return per-domain 0-100 scores, a 0-100
// composite, the satisfaction category, and the eNPS classification.
//
// Methodology:
//
//   * Each Likert item is rated 1-5 (positively worded; no reverse-coding).
//   * Per-domain mean = sum(answers) / answeredCount.
//   * Per-domain 0-100 score = mean × 20.
//   * Composite 0-100 = average of the eight graded domain scores
//     (only domains with at least one answer are included).
//   * Category bands:
//       85-100  excellent
//       70-84   good
//       50-69   satisfactory
//       25-49   poor
//        0-24   very-poor
//   * eNPS: 9-10 promoter, 7-8 passive, 0-6 detractor.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').DomainScore} DomainScore
 * @typedef {import('./types.js').DomainScores} DomainScores
 * @typedef {import('./types.js').SatisfactionCategory} SatisfactionCategory
 * @typedef {import('./types.js').FiredItem} FiredItem
 * @typedef {import('./types.js').ENpsResult} ENpsResult
 */

/**
 * Score a single domain: mean of 1-5 answers and 0-100 normalised score.
 *
 * @param {AssessmentData} data
 * @param {string} domainKey
 * @returns {{ result: DomainScore, fired: FiredItem[] }}
 */
function gradeDomain(data, domainKey) {
  /** @type {FiredItem[]} */
  const fired = [];
  const items = surveyItems.filter((it) => it.domain === domainKey);
  let sum = 0;
  let answered = 0;

  for (const item of items) {
    const raw = data[domainKey] ? data[domainKey][item.id] : null;
    if (raw === null || raw === undefined || raw === '') continue;
    const numeric = Number(raw);
    if (!Number.isFinite(numeric) || numeric < 1 || numeric > 5) continue;
    sum += numeric;
    answered++;
    fired.push({
      id: item.id,
      domain: item.domain,
      label: item.label,
      rawValue: numeric
    });
  }

  const mean = answered === 0 ? null : sum / answered;
  const score = mean === null ? null : mean * 20;
  const category = score === null ? '' : classifyScore(score);

  return {
    result: {
      mean: mean === null ? null : Math.round(mean * 100) / 100,
      score: score === null ? null : Math.round(score * 10) / 10,
      answeredCount: answered,
      totalCount: items.length,
      category
    },
    fired
  };
}

/**
 * Grade the eNPS 0-10 recommend question.
 *
 * @param {AssessmentData} data
 * @returns {ENpsResult}
 */
function gradeENps(data) {
  const raw = data.overall ? data.overall.recommendScore : null;
  if (raw === null || raw === undefined || raw === '') {
    return { score: null, classification: '' };
  }
  const numeric = Number(raw);
  if (!Number.isFinite(numeric) || numeric < 0 || numeric > 10) {
    return { score: null, classification: '' };
  }
  return {
    score: /** @type {any} */ (numeric),
    classification: classifyENps(numeric)
  };
}

/**
 * Grade the entire assessment.
 *
 * @param {AssessmentData} data
 * @returns {{
 *   compositeScore: number | null,
 *   category: SatisfactionCategory,
 *   domainScores: DomainScores,
 *   eNPS: ENpsResult,
 *   answeredCount: number,
 *   totalCount: number,
 *   firedRules: FiredItem[]
 * }}
 */
function gradeSatisfaction(data) {
  /** @type {FiredItem[]} */
  const firedRules = [];

  /** @type {Partial<DomainScores>} */
  const domainScores = {};
  let totalAnswered = 0;
  const totalCount = surveyItems.length;

  let scoreSum = 0;
  let scoredDomains = 0;

  for (const key of GRADED_DOMAIN_KEYS) {
    const { result, fired } = gradeDomain(data, key);
    domainScores[key] = result;
    totalAnswered += result.answeredCount;
    firedRules.push(...fired);
    if (result.score !== null) {
      scoreSum += result.score;
      scoredDomains++;
    }
  }

  const compositeRaw = scoredDomains === 0 ? null : scoreSum / scoredDomains;
  const compositeScore = compositeRaw === null
    ? null
    : Math.round(compositeRaw * 10) / 10;

  const category = classifyScore(compositeScore);
  const eNPS = gradeENps(data);

  return {
    compositeScore,
    category,
    domainScores: /** @type {DomainScores} */ (domainScores),
    eNPS,
    answeredCount: totalAnswered,
    totalCount,
    firedRules
  };
}

export { gradeDomain, gradeENps, gradeSatisfaction };
