import type { ColonoscopyResult, Flag, FlagPriority } from './types';
import { hasCriticalFinding } from './utils';

/**
 * Detects safety-critical flags independently of the four axes. Flag
 * categories mirror sql/07_create_table_colonoscopy_test_result_grade_flag.sql.
 * Flags are returned sorted high → medium → low priority.
 */
export function detectFlags(r: ColonoscopyResult): Flag[] {
	const flags: Flag[] = [];

	// ─── critical-result-alert (auto-raised with a critical finding) ───
	if (hasCriticalFinding(r)) {
		flags.push({
			flagId: 'F-CRITICAL-RESULT-001',
			category: 'critical-result-alert',
			priority: 'high',
			description: 'A critical finding (mass lesion or perforation) is present.',
			suggestedAction:
				'Communicate the critical result to the referrer immediately, document the communication, and arrange an urgent MDT / colorectal-surgical referral.'
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

	// ─── abnormal-requiring-action ───
	if (r.bleedingSourceIdentified && !hasCriticalFinding(r)) {
		flags.push({
			flagId: 'F-ABNORMAL-ACTION-001',
			category: 'abnormal-requiring-action',
			priority: 'high',
			description: 'A lower-GI bleeding source has been identified and requires timely action.',
			suggestedAction: 'Ensure the referrer is alerted and a clear management plan is documented.'
		});
	}

	// ─── urgent-referral ───
	if (r.inflammationIbd || r.angiodysplasia) {
		flags.push({
			flagId: 'F-URGENT-REFERRAL-001',
			category: 'urgent-referral',
			priority: 'medium',
			description:
				'Inflammation suggestive of IBD or angiodysplasia is present and may warrant specialist referral.',
			suggestedAction: 'Consider referral to the appropriate gastroenterology specialist team.'
		});
	}

	// ─── inadequate-technique ───
	if (r.bowelPreparationQuality === 'poor' || r.extentReached === 'incomplete') {
		const nonDiagnostic = r.bowelPreparationQuality === 'poor' && r.extentReached === 'incomplete';
		flags.push({
			flagId: 'F-INADEQUATE-TECHNIQUE-001',
			category: 'inadequate-technique',
			priority: nonDiagnostic ? 'high' : 'medium',
			description:
				'Bowel preparation was poor and/or the examination was incomplete; diagnostic confidence may be reduced.',
			suggestedAction: 'Consider a repeat or alternative examination to reach diagnostic completeness.'
		});
	}

	// ─── incidental-finding ───
	if (r.diverticulosis) {
		flags.push({
			flagId: 'F-INCIDENTAL-FINDING-001',
			category: 'incidental-finding',
			priority: 'low',
			description: 'Diverticulosis is documented as an incidental finding.',
			suggestedAction: 'Manage the incidental finding per the relevant structured pathway.'
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
	if (r.polypsFound && r.largestPolypMm === null) {
		flags.push({
			flagId: 'F-MISSING-MEASUREMENT-001',
			category: 'missing-measurement',
			priority: 'low',
			description: 'Polyps are reported but no largest-polyp measurement was recorded.',
			suggestedAction:
				'Record the largest polyp size in millimetres for surveillance-interval determination.'
		});
	}

	// ─── unexpected-finding (significant finding but no originating request linked) ───
	if (
		(r.massLesion || r.polypsFound) &&
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
