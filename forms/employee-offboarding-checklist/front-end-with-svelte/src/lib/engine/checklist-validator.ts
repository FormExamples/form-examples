import type { AssessmentData, Blocker, FiredRule, GradingResult, Outcome } from './types';
import { validationRules } from './validation-rules';
import { detectAdditionalFlags } from './flagged-issues';

/**
 * Pure function: validate an offboarding checklist. Returns the outcome
 * (Complete / Partial / Incomplete), the completion percentage (0-100, based
 * on mandatory items satisfied), the list of blocker items, the full list of
 * fired rules, and the HR/manager priority flags.
 *
 * Outcome rules:
 *   Incomplete — at least one mandatory blocker rule has fired.
 *   Partial    — no mandatory blockers fired, but at least one rule
 *                (mandatory or non-mandatory) is outstanding.
 *   Complete   — every rule satisfied (no rule fired).
 */
export function validateChecklist(data: AssessmentData): GradingResult {
	const firedRules: FiredRule[] = [];
	const blockers: Blocker[] = [];

	let mandatoryTotal = 0;
	let mandatorySatisfied = 0;
	let anyOutstanding = false;
	let anyMandatoryBlockerOutstanding = false;

	for (const rule of validationRules) {
		let outstanding = false;
		try {
			outstanding = !!rule.evaluate(data);
		} catch (e) {
			// Rule evaluation failed — log for debugging but continue validating.
			console.warn(`Validation rule ${rule.id} evaluation failed:`, e);
			outstanding = false;
		}

		if (rule.mandatory) {
			mandatoryTotal++;
			if (!outstanding) mandatorySatisfied++;
		}

		if (outstanding) {
			anyOutstanding = true;
			firedRules.push({
				id: rule.id,
				category: rule.category,
				description: rule.description,
				mandatory: rule.mandatory,
				blocker: rule.blocker
			});

			if (rule.mandatory && rule.blocker) {
				anyMandatoryBlockerOutstanding = true;
				blockers.push({
					id: rule.id,
					category: rule.category,
					description: rule.description
				});
			}
		}
	}

	let outcome: Outcome;
	if (anyMandatoryBlockerOutstanding) {
		outcome = 'incomplete';
	} else if (anyOutstanding) {
		outcome = 'partial';
	} else {
		outcome = 'complete';
	}

	const completionPercent =
		mandatoryTotal === 0
			? 100
			: Math.round((mandatorySatisfied / mandatoryTotal) * 1000) / 10;

	return {
		outcome,
		completionPercent,
		blockers,
		firedRules,
		additionalFlags: detectAdditionalFlags(data),
		mandatoryTotal,
		mandatorySatisfied,
		timestamp: new Date().toISOString()
	};
}
