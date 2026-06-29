import type {
	AssessmentData,
	CompletenessLevel,
	FiredRule,
	GradingResult
} from './types';
import { ipsRules } from './ips-rules';
import { detectAdditionalFlags } from './flagged-issues';

/**
 * Classify the overall IPS completeness from the populated-section counts.
 *
 *   All 8 mandatory + all 2 optional populated   -> complete
 *   All 8 mandatory populated, optional missing   -> partial
 *   Any 1 mandatory missing                       -> incomplete
 */
export function classifyCompleteness(counts: {
	mandatoryPopulated: number;
	mandatoryTotal: number;
	optionalPopulated: number;
	optionalTotal: number;
}): CompletenessLevel {
	if (counts.mandatoryPopulated < counts.mandatoryTotal) return 'incomplete';
	if (counts.optionalPopulated < counts.optionalTotal) return 'partial';
	return 'complete';
}

/**
 * Pure function: evaluate every IPS section-population rule against the supplied
 * data, then derive the completeness level, the per-section audit trail, and the
 * clinician-facing flags.
 */
export function calculateIPSGrade(data: AssessmentData): GradingResult {
	const firedRules: FiredRule[] = [];
	let mandatoryPopulated = 0;
	let mandatoryTotal = 0;
	let optionalPopulated = 0;
	let optionalTotal = 0;

	for (const rule of ipsRules) {
		let outcome: 'ok' | 'empty' | 'optional' = 'empty';
		try {
			outcome = rule.evaluate(data);
		} catch (e) {
			console.warn(`IPS rule ${rule.id} evaluation failed:`, e);
		}
		if (rule.mandatory) {
			mandatoryTotal++;
			if (outcome === 'ok') mandatoryPopulated++;
		} else {
			optionalTotal++;
			if (outcome === 'ok') optionalPopulated++;
			// Optional sections surface as "optional" in the audit table when
			// empty so they read as informational rather than blocking failures.
			if (outcome === 'empty') outcome = 'optional';
		}
		firedRules.push({
			id: rule.id,
			category: rule.category,
			description: rule.description,
			status: outcome,
			mandatory: rule.mandatory
		});
	}

	const completenessLevel = classifyCompleteness({
		mandatoryPopulated,
		mandatoryTotal,
		optionalPopulated,
		optionalTotal
	});

	return {
		completenessLevel,
		mandatoryPopulated,
		mandatoryTotal,
		optionalPopulated,
		optionalTotal,
		firedRules,
		additionalFlags: detectAdditionalFlags(data),
		timestamp: new Date().toISOString()
	};
}
