// Workplace Climate Assessment grader. Pure functions: given an
// `AssessmentData` object, return per-domain 0-100 scores, a 0-100 composite
// Workplace Climate Index, and the climate category.
//
// Methodology:
//
//   * Each Likert item is rated 1-5 (positively worded; no reverse-coding).
//   * Per-domain mean = sum(answers) / answeredCount.
//   * Per-domain 0-100 score = mean × 20.
//   * Composite 0-100 = average of the eight graded domain scores
//     (only domains with at least one answer are included).
//   * Category bands:
//       85-100  thriving
//       70-84   healthy
//       50-69   developing
//       25-49   strained
//        0-24   critical
//
// The three `overall` Likert items (oc1-oc3) are reported alongside but are
// NOT folded into the composite — the composite is the eight graded domain
// blocks only.

import { GRADED_DOMAIN_KEYS, surveyItems } from './rules';
import { classifyScore } from './utils';
import type {
	AssessmentData,
	DomainScore,
	DomainScores,
	FiredItem,
	GradedDomainKey,
	GradingResult
} from './types';

import { detectAdditionalFlags } from './flagged-issues';

/** Score a single domain: mean of 1-5 answers and 0-100 normalised score. */
export function gradeDomain(
	data: AssessmentData,
	domainKey: GradedDomainKey
): { result: DomainScore; fired: FiredItem[] } {
	const fired: FiredItem[] = [];
	const items = surveyItems.filter((it) => it.domain === domainKey);
	const section = data[domainKey] as unknown as Record<string, number | null>;
	let sum = 0;
	let answered = 0;

	for (const item of items) {
		const raw = section ? section[item.id] : null;
		if (raw === null || raw === undefined) continue;
		const numeric = Number(raw);
		if (!Number.isFinite(numeric) || numeric < 1 || numeric > 5) continue;
		sum += numeric;
		answered++;
		fired.push({ id: item.id, domain: item.domain, label: item.label, rawValue: numeric });
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

/** Grade the entire assessment and attach flagged issues. */
export function gradeClimate(data: AssessmentData): GradingResult {
	const firedRules: FiredItem[] = [];
	const domainScores = {} as DomainScores;
	let totalAnswered = 0;

	// Total only counts items in the eight graded domains.
	const totalCount = surveyItems.filter(
		(it) => GRADED_DOMAIN_KEYS.indexOf(it.domain as GradedDomainKey) !== -1
	).length;

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
	const compositeScore = compositeRaw === null ? null : Math.round(compositeRaw * 10) / 10;
	const category = classifyScore(compositeScore);

	const additionalFlags = detectAdditionalFlags(data, {
		compositeScore,
		category,
		domainScores,
		answeredCount: totalAnswered
	});

	return {
		compositeScore,
		category,
		domainScores,
		answeredCount: totalAnswered,
		totalCount,
		firedRules,
		additionalFlags,
		timestamp: new Date().toISOString()
	};
}
