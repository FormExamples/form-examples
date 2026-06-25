import type { AllergySkinResult, Flag, FlagPriority } from './types';
import { hasCriticalFinding } from './utils';

/**
 * Detects safety-critical flags independently of the four axes. Flag
 * categories mirror sql/07_create_table_allergy_skin_test_result_grade_flag.sql.
 * Flags are returned sorted high → medium → low priority.
 */
export function detectFlags(r: AllergySkinResult): Flag[] {
	const flags: Flag[] = [];

	// ─── critical-result-alert + anaphylaxis-during-test (auto-raised) ───
	if (hasCriticalFinding(r)) {
		flags.push({
			flagId: 'F-CRITICAL-RESULT-001',
			category: 'critical-result-alert',
			priority: 'high',
			description: 'A systemic / anaphylactic reaction occurred during the test.',
			suggestedAction:
				'Communicate the critical result to the referrer immediately and document the reaction, treatment, and observation.'
		});

		flags.push({
			flagId: 'F-ANAPHYLAXIS-001',
			category: 'anaphylaxis-during-test',
			priority: 'high',
			description: 'Anaphylaxis during testing is a critical safety event.',
			suggestedAction:
				'Ensure resuscitation was provided, prescribe / review an adrenaline auto-injector, and refer to allergy / immunology.'
		});

		// critical result that has not yet been communicated
		if (!r.criticalResultCommunicated) {
			flags.push({
				flagId: 'F-CRITICAL-RESULT-002',
				category: 'critical-result-alert',
				priority: 'high',
				description: 'Critical event present but the result has not been recorded as communicated.',
				suggestedAction: 'Contact the referrer now and record who was informed, with date and time.'
			});
		}
	}

	// ─── clinically-relevant-sensitisation ───
	if (r.sensitisationConfirmed && !hasCriticalFinding(r)) {
		flags.push({
			flagId: 'F-SENSITISATION-001',
			category: 'clinically-relevant-sensitisation',
			priority: 'medium',
			description: 'Clinically relevant sensitisation was confirmed.',
			suggestedAction:
				'Provide allergen avoidance advice and consider immunotherapy referral or an oral challenge.'
		});
	}

	// ─── abnormal-requiring-action ───
	if (r.positiveReactions && !r.sensitisationConfirmed && !hasCriticalFinding(r)) {
		flags.push({
			flagId: 'F-ABNORMAL-ACTION-001',
			category: 'abnormal-requiring-action',
			priority: 'medium',
			description: 'Positive reaction(s) present; sensitisation versus clinical allergy needs review.',
			suggestedAction: 'Correlate the positive result with the clinical history before advising the patient.'
		});
	}

	// ─── urgent-referral ───
	if (r.sensitisationConfirmed && r.recommendedFollowUp.trim() === '') {
		flags.push({
			flagId: 'F-URGENT-REFERRAL-001',
			category: 'urgent-referral',
			priority: 'medium',
			description: 'Clinically relevant sensitisation but no recommended follow-up recorded.',
			suggestedAction: 'Record a follow-up plan (avoidance advice, immunotherapy, or challenge).'
		});
	}

	// ─── invalid-test ───
	if (r.testInvalid) {
		flags.push({
			flagId: 'F-INVALID-TEST-001',
			category: 'invalid-test',
			priority: r.anaphylaxisDuringTest ? 'medium' : 'high',
			description:
				'Test is invalid / non-interpretable (antihistamines not withheld, absent positive control, or dermographism).',
			suggestedAction: 'Repeat testing after an adequate washout, or arrange specific-IgE blood testing.'
		});
	}

	// ─── unexpected-finding (sensitisation but no originating request linked) ───
	if (r.positiveReactions && r.originatingRequestReference.trim() === '') {
		flags.push({
			flagId: 'F-UNEXPECTED-FINDING-001',
			category: 'unexpected-finding',
			priority: 'low',
			description: 'A positive result is present but no originating request reference is recorded.',
			suggestedAction: 'Link the report to the originating request to support discrepancy review.'
		});
	}

	// ─── missing-impression ───
	if (r.impression.trim() === '') {
		flags.push({
			flagId: 'F-MISSING-IMPRESSION-001',
			category: 'missing-impression',
			priority: 'medium',
			description: 'No impression / conclusion has been recorded.',
			suggestedAction: 'Add an impression that answers the clinical question.'
		});
	}

	// ─── missing-measurement ───
	if (r.positiveReactions && r.whealSizes.trim() === '' && r.specificIgeResults.trim() === '') {
		flags.push({
			flagId: 'F-MISSING-MEASUREMENT-001',
			category: 'missing-measurement',
			priority: 'low',
			description: 'A positive reaction is reported but no weal sizes or specific-IgE results were recorded.',
			suggestedAction: 'Record the measured weal sizes (mm) or specific-IgE results (kUA/L) per allergen.'
		});
	}

	// Sort: high > medium > low
	const priorityOrder: Record<FlagPriority, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
