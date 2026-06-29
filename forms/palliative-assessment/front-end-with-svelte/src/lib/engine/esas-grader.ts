import type {
	AssessmentData,
	FiredRule,
	IndividualFlag,
	GradingResult,
	SeverityBand
} from './types';
import { rules } from './rules';
import { classifyESASTotal, ESAS_ITEMS } from './utils';
import { detectAdditionalFlags } from './flagged-issues';

/**
 * Evaluate the ten-item ESAS-r against the supplied assessment data and produce
 * the total, severity band, answered count, audit trail of fired rules, and
 * per-symptom severe-symptom flags (any symptom >= 7). Ancillary (non-ESAS)
 * rules are also evaluated and returned via `firedRules` for completeness.
 *
 * Items the patient has not answered (null) are excluded from the total and
 * from the answered count.
 */
export function gradeESAS(data: AssessmentData): {
	esasTotal: number;
	severityBand: SeverityBand;
	answeredCount: number;
	firedRules: FiredRule[];
	individualFlags: IndividualFlag[];
} {
	const firedRules: FiredRule[] = [];
	const individualFlags: IndividualFlag[] = [];

	let total = 0;
	let answeredCount = 0;

	const labelByKey: Record<string, string> = Object.create(null);
	for (const item of ESAS_ITEMS) labelByKey[item.key] = item.label;

	for (const rule of rules) {
		let score = 0;
		try {
			score = rule.evaluate(data);
		} catch (e) {
			console.warn(`Palliative rule ${rule.id} evaluation failed:`, e);
			continue;
		}

		if (rule.kind === 'esas' && rule.symptomKey) {
			const raw = data.esasrSymptoms[rule.symptomKey];
			const answered = raw !== null && raw !== undefined;
			if (answered) {
				answeredCount += 1;
				total += score;
				firedRules.push({
					id: rule.id,
					category: rule.category,
					description: rule.description,
					score
				});
				if (score >= 7) {
					individualFlags.push({
						symptomKey: rule.symptomKey,
						symptomLabel: labelByKey[rule.symptomKey] || rule.category,
						score
					});
				}
			}
		} else if (rule.kind === 'ancillary') {
			if (score > 0) {
				firedRules.push({
					id: rule.id,
					category: rule.category,
					description: rule.description,
					score
				});
			}
		}
	}

	const severityBand = classifyESASTotal(total);

	return { esasTotal: total, severityBand, answeredCount, firedRules, individualFlags };
}

/**
 * Pure function: full palliative grading. Combines the ESAS-r grade with the
 * independent clinician-facing flagged issues and a timestamp.
 */
export function calculatePalliativeGrade(data: AssessmentData): GradingResult {
	const esas = gradeESAS(data);
	const additionalFlags = detectAdditionalFlags(data);

	return {
		...esas,
		additionalFlags,
		timestamp: new Date().toISOString()
	};
}
