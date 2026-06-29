// Employee Satisfaction Survey grader. Pure functions: given an
// `AssessmentData` object, return per-domain 0-100 scores, a 0-100
// composite, the satisfaction category, the eNPS classification, and the
// flagged issues.
//
// Methodology:
//
//   * Each Likert item is rated 1-5 (positively worded; no reverse-coding).
//   * Per-domain mean = sum(answers) / answeredCount.
//   * Per-domain 0-100 score = mean × 20.
//   * Composite 0-100 = average of the eight graded domain scores
//     (only domains with at least one answer are included).
//   * Category bands: 85-100 excellent, 70-84 good, 50-69 satisfactory,
//     25-49 poor, 0-24 very-poor.
//   * eNPS: 9-10 promoter, 7-8 passive, 0-6 detractor.

import type {
	AssessmentData,
	DomainScore,
	DomainScores,
	ENpsResult,
	FiredItem,
	GradedDomainKey,
	GradingResult
} from './types';
import { surveyItems, GRADED_DOMAIN_KEYS } from './rules';
import { classifyScore, classifyENps } from './utils';
import { detectAdditionalFlags } from './flagged-issues';

/** Score a single domain: mean of 1-5 answers and 0-100 normalised score. */
export function gradeDomain(
	data: AssessmentData,
	domainKey: GradedDomainKey
): { result: DomainScore; fired: FiredItem[] } {
	const fired: FiredItem[] = [];
	const items = surveyItems.filter((it) => it.domain === domainKey);
	const section = data[domainKey] as unknown as Record<string, unknown>;
	let sum = 0;
	let answered = 0;

	for (const item of items) {
		const raw = section ? section[item.id] : null;
		if (raw === null || raw === undefined || raw === '') continue;
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

/** Grade the eNPS 0-10 recommend question. */
export function gradeENps(data: AssessmentData): ENpsResult {
	const raw = data.overall ? data.overall.recommendScore : null;
	if (raw === null || raw === undefined) {
		return { score: null, classification: '' };
	}
	const numeric = Number(raw);
	if (!Number.isFinite(numeric) || numeric < 0 || numeric > 10) {
		return { score: null, classification: '' };
	}
	return {
		score: numeric as ENpsResult['score'],
		classification: classifyENps(numeric as ENpsResult['score'])
	};
}

/** Grade the entire survey and return the full graded result. */
export function gradeSatisfaction(data: AssessmentData): GradingResult {
	const firedRules: FiredItem[] = [];
	const domainScores: Partial<DomainScores> = {};
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
	const compositeScore = compositeRaw === null ? null : Math.round(compositeRaw * 10) / 10;

	const category = classifyScore(compositeScore);
	const eNPS = gradeENps(data);

	const result: GradingResult = {
		compositeScore,
		category,
		domainScores: domainScores as DomainScores,
		eNPS,
		answeredCount: totalAnswered,
		totalCount,
		firedRules,
		additionalFlags: [],
		timestamp: new Date().toISOString()
	};

	result.additionalFlags = detectAdditionalFlags(data, result);
	return result;
}
