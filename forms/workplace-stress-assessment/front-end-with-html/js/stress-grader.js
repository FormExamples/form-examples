import { HSE_BENCHMARKS, stressItems } from './rules.js';
import { riskLevelRank } from './types.js';

// HSE Management Standards stress grader. Pure functions: given an
// `AssessmentData` object, return per-domain means + concern categories,
// and an overall risk equal to the worst-domain category.
//
// Reverse-scored items (negatively worded statements like "I have to work
// very fast") are transformed via (6 - raw) before being averaged, so a
// higher domain mean is *always* a more favourable outcome.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').DomainResult} DomainResult
 * @typedef {import('./types.js').DomainResults} DomainResults
 * @typedef {import('./types.js').RiskLevel} RiskLevel
 * @typedef {import('./types.js').FiredItem} FiredItem
 */

// Wrapped in an IIFE; published via window.WorkplaceStressAssessment.

/**
 * Classify a domain mean against its HSE percentile cut-offs.
 *
 *   mean ≥ goodAt           → 'low'        concern (above 80th percentile)
 *   moderateAt ≤ mean < good → 'moderate'   (50th–80th)
 *   highAt     ≤ mean < mod  → 'high'       (20th–50th)
 *   mean < highAt            → 'very-high'  (below 20th percentile)
 *
 * @param {string} domainKey
 * @param {number | null} mean
 * @returns {RiskLevel}
 */
function classifyDomainMean(domainKey, mean) {
  if (mean === null || mean === undefined || isNaN(mean)) return '';
  const b = HSE_BENCHMARKS[domainKey];
  if (!b) return '';
  if (mean >= b.goodAt) return 'low';
  if (mean >= b.moderateAt) return 'moderate';
  if (mean >= b.highAt) return 'high';
  return 'very-high';
}

/**
 * Apply reverse-coding if needed.
 * @param {number} raw
 * @param {boolean} reverseScored
 */
function effectiveValue(raw, reverseScored) {
  return reverseScored ? 6 - raw : raw;
}

/**
 * Score a single domain. Returns mean (or null), counts and category.
 *
 * @param {AssessmentData} data
 * @param {string} domainKey
 * @returns {{ result: DomainResult, fired: FiredItem[] }}
 */
function gradeDomain(data, domainKey) {
  /** @type {FiredItem[]} */
  const fired = [];
  const items = stressItems.filter((it) => it.domain === domainKey);
  let sum = 0;
  let answered = 0;

  for (const item of items) {
    const raw = data[domainKey] ? data[domainKey][item.id] : null;
    if (raw === null || raw === undefined || raw === '') continue;
    const numeric = Number(raw);
    if (!Number.isFinite(numeric) || numeric < 1 || numeric > 5) continue;
    const eff = effectiveValue(numeric, item.reverseScored);
    sum += eff;
    answered++;
    fired.push({
      id: item.id,
      domain: item.domain,
      label: item.label,
      rawValue: numeric,
      effectiveValue: eff,
      reverseScored: item.reverseScored
    });
  }

  const mean = answered === 0 ? null : sum / answered;
  const category = mean === null ? '' : classifyDomainMean(domainKey, mean);

  return {
    result: {
      mean: mean === null ? null : Math.round(mean * 100) / 100,
      answeredCount: answered,
      totalCount: items.length,
      category
    },
    fired
  };
}

/**
 * Grade the entire assessment. Computes per-domain means + categories
 * and the overall risk (worst category across the seven domains).
 *
 * @param {AssessmentData} data
 * @returns {{ domains: DomainResults, overallRisk: RiskLevel, answeredCount: number, firedRules: FiredItem[] }}
 */
function gradeStress(data) {
  /** @type {FiredItem[]} */
  const firedRules = [];

  const dKeys = ['demands', 'control', 'managerSupport', 'peerSupport',
    'relationships', 'role', 'change'];

  /** @type {Partial<DomainResults>} */
  const domains = {};
  let totalAnswered = 0;
  /** @type {RiskLevel} */
  let worst = '';

  for (const key of dKeys) {
    const { result, fired } = gradeDomain(data, key);
    domains[key] = result;
    totalAnswered += result.answeredCount;
    firedRules.push(...fired);
    if (result.category && riskLevelRank(result.category) > riskLevelRank(worst)) {
      worst = result.category;
    }
  }

  // If nothing has been answered yet, fall back to '' (unknown). Otherwise
  // the worst category we observed is the overall risk.
  const overallRisk = totalAnswered === 0 ? '' : worst;

  return {
    domains: /** @type {DomainResults} */ (domains),
    overallRisk,
    answeredCount: totalAnswered,
    firedRules
  };
}

export { classifyDomainMean, gradeDomain, gradeStress };
