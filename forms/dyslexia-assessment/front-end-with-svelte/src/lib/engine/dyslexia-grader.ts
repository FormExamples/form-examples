import type { AssessmentData, DomainScore, Severity, GradingResult } from './types';
import { dyslexiaRules } from './dyslexia-rules';
import { scoreSeverity, maxSeverity } from './utils';
import { detectAdditionalFlags } from './flagged-issues';

/**
 * Pure function: evaluates the dyslexia battery against the supplied data.
 *
 * The overall severity is driven by the lowest non-null standardised score
 * (the most-impaired domain), matching the per-domain rules. If no domain has
 * been answered, the overall severity is 'none' and `lowestScore` is null.
 */
export function gradeDyslexia(data: AssessmentData): GradingResult {
	const domainScores: DomainScore[] = [];
	let overall: Severity = 'none';
	let lowestScore: number | null = null;
	let answeredCount = 0;

	for (const rule of dyslexiaRules) {
		let score: number | null = null;
		try {
			score = rule.evaluate(data);
		} catch (e) {
			console.warn(`Dyslexia rule ${rule.id} evaluation failed:`, e);
		}
		const severity = scoreSeverity(score);
		domainScores.push({
			id: rule.id,
			category: rule.category,
			description: rule.description,
			score: score === undefined ? null : score,
			severity
		});
		if (score !== null && score !== undefined && !Number.isNaN(score)) {
			answeredCount++;
			overall = maxSeverity(overall, severity);
			if (lowestScore === null || score < lowestScore) {
				lowestScore = score;
			}
		}
	}

	return {
		overallSeverity: overall,
		lowestScore,
		answeredCount,
		domainScores,
		additionalFlags: detectAdditionalFlags(data),
		timestamp: new Date().toISOString()
	};
}
