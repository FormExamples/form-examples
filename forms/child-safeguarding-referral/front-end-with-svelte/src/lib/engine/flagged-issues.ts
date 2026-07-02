import type { AssessmentData, FlaggedIssue } from './types';
import { consentBasisOk, additionalSexual } from './child-safeguarding-rules';

const nonEmpty = (s: string): boolean => typeof s === 'string' && s.trim() !== '';
const hasNumber = (n: number | null | undefined): boolean =>
	typeof n === 'number' && !Number.isNaN(n);

/**
 * Names the mandatory fields that are blank, mirroring the mandatory rules in
 * `child-safeguarding-rules.ts`. Used by the mandatory-field-missing flag.
 */
function missingMandatoryFields(r: AssessmentData): string[] {
	const missing: string[] = [];
	if (!nonEmpty(r.referrer.referrerName)) missing.push('referrer name');
	if (!nonEmpty(r.referrer.referrerPhone) && !nonEmpty(r.referrer.referrerEmail)) {
		missing.push('referrer contact (phone or email)');
	}
	if (!nonEmpty(r.child.childName)) missing.push('child name');
	if (!nonEmpty(r.child.childDateOfBirth) && !hasNumber(r.child.childAge)) {
		missing.push('child date of birth or age');
	}
	if (!nonEmpty(r.concern.concernDescription)) missing.push('concern description');
	if (!nonEmpty(r.category.primaryCategory)) missing.push('primary category of abuse');
	if (!nonEmpty(r.risk.immediateDanger)) missing.push('immediate-danger answer');
	if (!consentBasisOk(r)) missing.push('consent / information-sharing basis');
	return missing;
}

/**
 * Detect duty-team-facing safeguarding flags. Independent of the completeness
 * status and urgency classification the grader produces (spec §5):
 *
 *   - Immediate danger (high)             — immediateDanger == 'yes'.
 *   - Disclosure of abuse (high)          — childDisclosed == 'yes'.
 *   - Sexual abuse category (high)        — primaryCategory == 'sexual' (or listed
 *                                           in additionalCategories).
 *   - Other children at risk (high)       — otherChildrenAtRisk == 'yes'.
 *   - No consent basis documented (high)  — consent not given and no lawful
 *                                           information-sharing basis recorded.
 *   - Mandatory field missing (medium)    — any mandatory field blank; names them.
 *   - Child unaware / unsafe to inform (medium) — familyAware == 'no' with a
 *                                           recorded unsafe-to-inform reason.
 *   - Previous safeguarding history (low) — previousSafeguardingHistory non-empty.
 *
 * Rows mirror the `child_safeguarding_referral_grade_flag` SQL table (flag_id,
 * category, priority, description, suggested_action).
 */
export function detectFlaggedIssues(referral: AssessmentData): FlaggedIssue[] {
	const flags: FlaggedIssue[] = [];

	// ─── Immediate danger (HIGH) ────────────────────────────────
	if (referral.risk.immediateDanger === 'yes') {
		flags.push({
			id: 'F-IMMEDIATE-DANGER-001',
			category: 'immediate-danger',
			priority: 'high',
			description:
				'The child is recorded as being in immediate danger — this is an emergency.',
			suggestedAction:
				'Phone the police (999) and children’s social care now. Do not wait for the written referral to be completed or submitted.'
		});
	}

	// ─── Disclosure of abuse (HIGH) ─────────────────────────────
	if (referral.concern.childDisclosed === 'yes') {
		flags.push({
			id: 'F-DISCLOSURE-OF-ABUSE-001',
			category: 'disclosure-of-abuse',
			priority: 'high',
			description:
				'The child has made a disclosure of abuse — the account must be preserved and prioritised.',
			suggestedAction:
				'Record the child’s own words, avoid leading questions, do not investigate, and pass the account to children’s social care and, where relevant, the police.'
		});
	}

	// ─── Sexual abuse category (HIGH) ───────────────────────────
	if (referral.category.primaryCategory === 'sexual' || additionalSexual(referral)) {
		flags.push({
			id: 'F-SEXUAL-ABUSE-CATEGORY-001',
			category: 'sexual-abuse-category',
			priority: 'high',
			description:
				'Sexual abuse is recorded as a category — this needs a specialist and possibly a police / medical response.',
			suggestedAction:
				'Do not examine or question the child. Contact children’s social care and the police so a joint specialist assessment can be arranged; preserve any evidence.'
		});
	}

	// ─── Other children at risk (HIGH) ──────────────────────────
	if (referral.risk.otherChildrenAtRisk === 'yes') {
		flags.push({
			id: 'F-OTHER-CHILDREN-AT-RISK-001',
			category: 'other-children-at-risk',
			priority: 'high',
			description:
				'Siblings or other children in the household may also be at risk — they must be considered in the referral.',
			suggestedAction:
				'Identify every child who may be affected and ensure the referral covers them; a strategy discussion may be required.'
		});
	}

	// ─── No consent basis documented (HIGH) ─────────────────────
	if (!consentBasisOk(referral)) {
		flags.push({
			id: 'F-NO-CONSENT-BASIS-001',
			category: 'no-consent-basis',
			priority: 'high',
			description:
				'Consent to refer was not given and no lawful basis for sharing without consent is recorded — the referral cannot be justified as it stands.',
			suggestedAction:
				'Record the lawful basis for sharing (risk of serious harm, or that seeking consent would increase risk), or seek consent, per Working Together 2023 and the Information Sharing guidance.'
		});
	}

	// ─── Mandatory field missing (MEDIUM) ───────────────────────
	const missing = missingMandatoryFields(referral);
	if (missing.length > 0) {
		flags.push({
			id: 'F-MANDATORY-FIELD-MISSING-001',
			category: 'mandatory-field-missing',
			priority: 'medium',
			description: `The referral is incomplete — required field(s) missing: ${missing.join(', ')}.`,
			suggestedAction:
				'Complete the missing mandatory field(s) so the referral is valid and can be acted on.'
		});
	}

	// ─── Child unaware / unsafe to inform (MEDIUM) ──────────────
	if (
		referral.consent.familyAware === 'no' &&
		nonEmpty(referral.consent.unsafeToInformReason)
	) {
		flags.push({
			id: 'F-CHILD-UNAWARE-UNSAFE-001',
			category: 'child-unaware-unsafe',
			priority: 'medium',
			description:
				'The child / family are not aware of the referral because informing them would increase risk — contact must be handled carefully.',
			suggestedAction:
				'Note the reason informing would increase risk and agree with children’s social care how and when the family will be told.'
		});
	}

	// ─── Previous safeguarding history (LOW) ────────────────────
	if (nonEmpty(referral.informed.previousSafeguardingHistory)) {
		flags.push({
			id: 'F-PREVIOUS-HISTORY-001',
			category: 'previous-history',
			priority: 'low',
			description:
				'Previous safeguarding involvement is recorded — this referral should be linked to the existing records.',
			suggestedAction:
				'Reference the prior involvement so the duty team can retrieve the child’s existing safeguarding record.'
		});
	}

	// Sort: high > medium > low.
	const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
