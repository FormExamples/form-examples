import type { AssessmentData, FiredRule, GradingResult } from './types';
import { ldRules } from './ld-rules';
import { classifyAdaptiveScore } from './utils';
import { detectAdditionalFlags } from './flagged-issues';

/**
 * Pure function: evaluates the 10-item adaptive-functioning section against the
 * supplied assessment data and produces the mean per-item score, severity
 * category, per-item audit trail, and the flagged-issue list.
 *
 * Severity cutoffs (mean score over answered items, 0-3):
 *   < 1.0    → Mild (independent with support in complex tasks)
 *   1.0-1.99 → Moderate (significant support with daily living)
 *   2.0-2.59 → Severe (substantial support; limited communication)
 *   >= 2.6   → Profound (very limited understanding; intensive support)
 */
export function calculateLD(data: AssessmentData): GradingResult {
	const firedRules: FiredRule[] = [];
	let total = 0;
	let answeredCount = 0;

	for (const rule of ldRules) {
		try {
			const probe = rule.evaluate(data);
			if (probe > 0) {
				// Probe is (levelScore + 1); recover the true 0-3 weight.
				const weight = probe - 1;
				answeredCount++;
				total += weight;
				firedRules.push({
					id: rule.id,
					category: rule.category,
					description: rule.description,
					score: weight
				});
			}
		} catch (e) {
			console.warn(`LD rule ${rule.id} evaluation failed:`, e);
		}
	}

	// If no items answered, default to 0 (mild) so an empty submission doesn't
	// claim the most severe category by accident.
	const adaptiveScore = answeredCount === 0 ? 0 : total / answeredCount;
	const severityCategory = classifyAdaptiveScore(adaptiveScore);
	const additionalFlags = detectAdditionalFlags(data);

	return {
		adaptiveScore: Math.round(adaptiveScore * 100) / 100,
		severityCategory,
		answeredCount,
		firedRules,
		additionalFlags,
		timestamp: new Date().toISOString()
	};
}
