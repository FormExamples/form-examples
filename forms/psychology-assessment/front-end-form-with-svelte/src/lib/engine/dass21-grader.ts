import type {
	AssessmentData,
	FiredRule,
	SubscaleScore
} from './types';
import { dass21Rules } from './dass21-rules';
import {
	classifyDassAnxiety,
	classifyDassDepression,
	classifyDassStress
} from './utils';

/**
 * Pure function: evaluates DASS-21 across all 21 items.
 *
 * For each subscale (Depression, Anxiety, Stress) we sum the seven 0–3 item
 * responses, then double the raw total to align with the published DASS-42
 * normative cutoffs. Unanswered items are treated as 0 for the sum but counted
 * separately so the consumer can know completeness.
 */
export function calculateDass21(data: AssessmentData): {
	depression: SubscaleScore;
	anxiety: SubscaleScore;
	stress: SubscaleScore;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];
	const totals = { depression: 0, anxiety: 0, stress: 0 };
	const answered = { depression: 0, anxiety: 0, stress: 0 };

	for (const rule of dass21Rules) {
		try {
			const value = rule.evaluate(data);
			if (value !== null && value !== undefined) {
				totals[rule.subscale] += value;
				answered[rule.subscale]++;
				firedRules.push({
					id: rule.id,
					subscale: rule.subscale,
					itemNumber: rule.itemNumber,
					description: rule.description,
					score: value
				});
			}
		} catch (e) {
			console.warn(`DASS-21 rule ${rule.id} evaluation failed:`, e);
		}
	}

	const depression: SubscaleScore = {
		raw: totals.depression,
		scaled: totals.depression * 2,
		severity: classifyDassDepression(totals.depression * 2),
		answered: answered.depression
	};
	const anxiety: SubscaleScore = {
		raw: totals.anxiety,
		scaled: totals.anxiety * 2,
		severity: classifyDassAnxiety(totals.anxiety * 2),
		answered: answered.anxiety
	};
	const stress: SubscaleScore = {
		raw: totals.stress,
		scaled: totals.stress * 2,
		severity: classifyDassStress(totals.stress * 2),
		answered: answered.stress
	};

	return { depression, anxiety, stress, firedRules };
}
