// HSE Management Standards stress grader. Pure functions: given an
// `AssessmentData` object, return per-domain means + concern categories, and an
// overall risk equal to the worst-domain category.
//
// Reverse-scored items (negatively worded statements like "I have to work very
// fast") are transformed via (6 - raw) before being averaged, so a higher
// domain mean is *always* a more favourable outcome.

import type {
	AssessmentData,
	DomainKey,
	DomainResult,
	DomainResults,
	FiredItem,
	GradingResult,
	RiskLevel
} from './types';
import { stressItems, HSE_BENCHMARKS } from './rules';
import { riskLevelRank } from './utils';
import { detectAdditionalFlags } from './flagged-issues';

/** The seven HSE domains, in the canonical order the engine emits them. */
export const DOMAIN_KEYS: DomainKey[] = [
	'demands',
	'control',
	'managerSupport',
	'peerSupport',
	'relationships',
	'role',
	'change'
];

/**
 * Classify a domain mean against its HSE percentile cut-offs.
 *
 *   mean ≥ goodAt            → 'low'        concern (above 80th percentile)
 *   moderateAt ≤ mean < good → 'moderate'   (50th–80th)
 *   highAt     ≤ mean < mod  → 'high'       (20th–50th)
 *   mean < highAt            → 'very-high'  (below 20th percentile)
 */
export function classifyDomainMean(domainKey: DomainKey, mean: number | null): RiskLevel {
	if (mean === null || Number.isNaN(mean)) return '';
	const b = HSE_BENCHMARKS[domainKey];
	if (!b) return '';
	if (mean >= b.goodAt) return 'low';
	if (mean >= b.moderateAt) return 'moderate';
	if (mean >= b.highAt) return 'high';
	return 'very-high';
}

/** Apply reverse-coding if needed. */
function effectiveValue(raw: number, reverseScored: boolean): number {
	return reverseScored ? 6 - raw : raw;
}

/** Score a single domain. Returns mean (or null), counts and category. */
export function gradeDomain(
	data: AssessmentData,
	domainKey: DomainKey
): { result: DomainResult; fired: FiredItem[] } {
	const fired: FiredItem[] = [];
	const items = stressItems.filter((it) => it.domain === domainKey);
	const section = data[domainKey] as unknown as Record<string, number | null> | undefined;
	let sum = 0;
	let answered = 0;

	for (const item of items) {
		const raw = section ? section[item.id] : null;
		if (raw === null || raw === undefined) continue;
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
 * Grade the entire assessment. Computes per-domain means + categories, the
 * overall risk (worst category across the seven domains), the per-item audit
 * trail, and the additional flagged issues. Pure — no side effects.
 */
export function gradeStress(data: AssessmentData): GradingResult {
	const firedRules: FiredItem[] = [];
	const domains = {} as DomainResults;
	let totalAnswered = 0;
	let worst: RiskLevel = '';

	for (const key of DOMAIN_KEYS) {
		const { result, fired } = gradeDomain(data, key);
		domains[key] = result;
		totalAnswered += result.answeredCount;
		firedRules.push(...fired);
		if (result.category && riskLevelRank(result.category) > riskLevelRank(worst)) {
			worst = result.category;
		}
	}

	// If nothing has been answered yet, fall back to '' (unknown). Otherwise the
	// worst category we observed is the overall risk.
	const overallRisk = totalAnswered === 0 ? '' : worst;
	const additionalFlags = detectAdditionalFlags(data, domains);

	return {
		domains,
		overallRisk,
		answeredCount: totalAnswered,
		firedRules,
		additionalFlags,
		timestamp: new Date().toISOString()
	};
}
