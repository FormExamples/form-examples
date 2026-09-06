import type { SleepStudyResult, Flag, FlagPriority } from './types';
import { hasCriticalFinding, isSevereAhi } from './utils';

/**
 * Detects safety-critical flags independently of the four axes. Flag
 * categories mirror sql/07_create_table_sleep_study_test_result_grade_flag.sql.
 * Flags are returned sorted high → medium → low priority.
 */
export function detectFlags(r: SleepStudyResult): Flag[] {
	const flags: Flag[] = [];

	// ─── critical-result-alert (auto-raised with a critical finding) ───
	if (hasCriticalFinding(r)) {
		flags.push({
			flagId: 'F-CRITICAL-RESULT-001',
			category: 'critical-result-alert',
			priority: 'high',
			description:
				'A critical finding (severe OSA with significant desaturation, or nocturnal hypoventilation) is present.',
			suggestedAction:
				'Arrange an urgent CPAP / ventilation review, communicate the critical result to the referrer immediately, document the communication, and advise on DVLA driving implications.'
		});

		// critical result that has not yet been communicated
		if (!r.criticalResultCommunicated) {
			flags.push({
				flagId: 'F-CRITICAL-RESULT-002',
				category: 'critical-result-alert',
				priority: 'high',
				description: 'Critical finding present but the result has not been recorded as communicated.',
				suggestedAction: 'Contact the referrer now and record who was informed, with date and time.'
			});
		}
	}

	// ─── abnormal-requiring-action (severe OSA without the critical desaturation pairing) ───
	if (isSevereAhi(r) && !hasCriticalFinding(r)) {
		flags.push({
			flagId: 'F-ABNORMAL-ACTION-001',
			category: 'abnormal-requiring-action',
			priority: 'high',
			description: 'Severe OSA (AHI >= 30) is present and requires timely action.',
			suggestedAction: 'Ensure the referrer is alerted and arrange a sleep-clinic review for CPAP titration.'
		});
	}

	// ─── urgent-referral ───
	if (r.centralSleepApnoea || r.nocturnalHypoventilation) {
		flags.push({
			flagId: 'F-URGENT-REFERRAL-001',
			category: 'urgent-referral',
			priority: 'medium',
			description:
				'Central sleep apnoea or nocturnal hypoventilation is present and may warrant urgent referral.',
			suggestedAction: 'Consider urgent referral to the respiratory / ventilation specialist team.'
		});
	}

	// ─── inadequate-technique ───
	if (r.studyAdequacy === 'failed' || r.studyAdequacy === 'limited') {
		flags.push({
			flagId: 'F-INADEQUATE-TECHNIQUE-001',
			category: 'inadequate-technique',
			priority: r.studyAdequacy === 'failed' ? 'high' : 'medium',
			description: `Study adequacy is ${r.studyAdequacy}; diagnostic confidence may be reduced.`,
			suggestedAction: 'Consider repeating or supplementing the study to reach diagnostic quality.'
		});
	}

	// ─── incidental-finding (periodic limb movements documented) ───
	if (r.periodicLimbMovements) {
		flags.push({
			flagId: 'F-INCIDENTAL-FINDING-001',
			category: 'incidental-finding',
			priority: 'low',
			description: 'Periodic limb movements of sleep are documented.',
			suggestedAction: 'Manage the periodic limb movements per the relevant sleep-medicine pathway.'
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

	// ─── missing-measurement (no AHI recorded) ───
	if (r.apnoeaHypopnoeaIndex === null) {
		flags.push({
			flagId: 'F-MISSING-MEASUREMENT-001',
			category: 'missing-measurement',
			priority: 'low',
			description: 'No apnoea-hypopnoea index (AHI) was recorded.',
			suggestedAction: 'Record the AHI for OSA severity banding and surveillance.'
		});
	}

	// ─── unexpected-finding (significant finding but no originating request linked) ───
	if (
		// Aligned with hasAnyAbnormalFinding: central sleep apnoea and
		// significant desaturation are just as much an unexpected significant
		// finding as obstructive sleep apnoea or nocturnal hypoventilation, and
		// must not go unflagged just because no request reference is on file.
		(r.obstructiveSleepApnoea ||
			r.centralSleepApnoea ||
			r.nocturnalHypoventilation ||
			r.significantDesaturation) &&
		r.originatingRequestReference.trim() === ''
	) {
		flags.push({
			flagId: 'F-UNEXPECTED-FINDING-001',
			category: 'unexpected-finding',
			priority: 'low',
			description: 'A significant finding is present but no originating request reference is recorded.',
			suggestedAction: 'Link the report to the originating request to support discrepancy review.'
		});
	}

	// Sort: high > medium > low
	const priorityOrder: Record<FlagPriority, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
