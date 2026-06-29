import type { AssessmentData, FiredRule, ValidationResult } from './types';
import { matB1Rules } from './mat-b1-rules';
import { detectAdditionalFlags } from './flagged-issues';
import { priorityOrder, weeksBetween } from './utils';

/**
 * Pure function: validate a MAT B1 maternity certificate.
 *
 * Branching:
 *   - certificateType = 'pre'  → Part A rules apply; Part B rules skipped.
 *   - certificateType = 'post' → Part B rules apply; Part A rules skipped.
 *   - certificateType = ''     → MATB1-CERT-001 fires; both Part A/B detail
 *                                rules are skipped (avoids noise until the
 *                                user picks a branch).
 *
 *   - issuer.issuerType = 'doctor'  → MATB1-DR-* rules apply; midwife rules
 *                                     skipped.
 *   - issuer.issuerType = 'midwife' → MATB1-MW-* rules apply; doctor rules
 *                                     skipped.
 *   - issuer.issuerType = ''        → MATB1-ISS-001 fires; both branches
 *                                     are skipped.
 *
 * The function does *not* mutate `data` and emits no side effects.
 */
export function validateMatB1(data: AssessmentData): ValidationResult {
	const firedRules: FiredRule[] = [];

	for (const rule of matB1Rules) {
		// Skip Part A / Part B rules when no certificate type is selected;
		// MATB1-CERT-001 covers the missing selection.
		if (data.certificateType === '' && (rule.id.startsWith('MATB1-A-') || rule.id.startsWith('MATB1-B-'))) {
			continue;
		}
		// Skip doctor / midwife rules when no issuer type is selected;
		// MATB1-ISS-001 covers the missing selection.
		if (data.issuer.issuerType === '' && (rule.id.startsWith('MATB1-DR-') || rule.id.startsWith('MATB1-MW-'))) {
			continue;
		}

		try {
			if (rule.evaluate(data)) {
				firedRules.push({
					id: rule.id,
					category: rule.category,
					priority: rule.priority,
					description: rule.description,
					message: rule.message
				});
			}
		} catch (e) {
			console.warn(`MAT B1 rule ${rule.id} evaluation failed:`, e);
		}
	}

	firedRules.sort((a, b) => priorityOrder(a.priority) - priorityOrder(b.priority));

	const additionalFlags = detectAdditionalFlags(data);

	const complete = firedRules.filter((r) => r.category === 'completeness').length === 0;

	const weeksBeforeEwc =
		data.certificateType === 'pre'
			? weeksBetween(
					data.preConfinement.examinationDate,
					data.preConfinement.expectedDateOfConfinement
				)
			: null;

	return {
		complete,
		certificateType: data.certificateType,
		issuerType: data.issuer.issuerType,
		firedRules,
		additionalFlags,
		weeksBeforeEwc,
		timestamp: new Date().toISOString()
	};
}
