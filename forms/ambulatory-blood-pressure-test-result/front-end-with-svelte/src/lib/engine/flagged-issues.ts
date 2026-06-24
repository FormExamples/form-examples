import type { AmbulatoryBloodPressureResult, Flag, FlagPriority } from './types';
import {
	hasCriticalFinding,
	recordingIsInadequate,
	nighttimeHypertensive
} from './utils';

/**
 * Detects safety-critical flags independently of the four axes. Flag
 * categories mirror
 * sql/07_create_table_ambulatory_blood_pressure_test_result_grade_flag.sql.
 * Flags are returned sorted high → medium → low priority.
 */
export function detectFlags(r: AmbulatoryBloodPressureResult): Flag[] {
	const flags: Flag[] = [];

	// ─── critical-result-alert (auto-raised with severe hypertension) ───
	if (hasCriticalFinding(r)) {
		flags.push({
			flagId: 'F-CRITICAL-RESULT-001',
			category: 'critical-result-alert',
			priority: 'high',
			description:
				'A severe-hypertension result (ABPM average >= 150/95, equivalent to clinic >= 180/120) is present.',
			suggestedAction:
				'Arrange same-day specialist review and communicate the critical result to the referrer immediately; document the communication.'
		});

		// critical result that has not yet been communicated
		if (!r.criticalResultCommunicated) {
			flags.push({
				flagId: 'F-CRITICAL-RESULT-002',
				category: 'critical-result-alert',
				priority: 'high',
				description:
					'Severe hypertension present but the result has not been recorded as communicated.',
				suggestedAction: 'Contact the referrer now and record who was informed, with date and time.'
			});
		}
	}

	// ─── abnormal-requiring-action (confirmed hypertension, not yet critical) ───
	if (r.hypertensionConfirmed && !hasCriticalFinding(r)) {
		flags.push({
			flagId: 'F-ABNORMAL-ACTION-001',
			category: 'abnormal-requiring-action',
			priority: 'high',
			description: 'Hypertension is confirmed on ambulatory averages and requires action.',
			suggestedAction:
				'Ensure the referrer is alerted and a treatment / management plan is documented per NICE NG136.'
		});
	}

	// ─── urgent-referral (masked or nocturnal hypertension) ───
	if (r.maskedHypertension || r.nocturnalHypertension || nighttimeHypertensive(r)) {
		flags.push({
			flagId: 'F-URGENT-REFERRAL-001',
			category: 'urgent-referral',
			priority: 'medium',
			description:
				'Masked or nocturnal hypertension is present and carries elevated cardiovascular risk.',
			suggestedAction: 'Consider referral to a hypertension specialist for further assessment.'
		});
	}

	// ─── inadequate-technique (low valid-readings percentage) ───
	if (recordingIsInadequate(r)) {
		flags.push({
			flagId: 'F-INADEQUATE-TECHNIQUE-001',
			category: 'inadequate-technique',
			priority: 'medium',
			description:
				'Recording adequacy is below the 70% valid-readings threshold; diagnostic confidence may be reduced.',
			suggestedAction: 'Consider repeating the monitoring period to obtain an adequate study.'
		});
	}

	// ─── incidental-finding (white-coat effect) ───
	if (r.whiteCoatEffect) {
		flags.push({
			flagId: 'F-INCIDENTAL-FINDING-001',
			category: 'incidental-finding',
			priority: 'low',
			description: 'A white-coat effect is documented (raised clinic BP but normal ambulatory averages).',
			suggestedAction: 'Manage per the relevant white-coat-hypertension pathway and document.'
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

	// ─── missing-measurement (no averages recorded) ───
	if (
		r.daytimeAverageSystolic === null &&
		r.twentyFourHourAverageSystolic === null
	) {
		flags.push({
			flagId: 'F-MISSING-MEASUREMENT-001',
			category: 'missing-measurement',
			priority: 'low',
			description: 'No daytime or 24-hour average blood pressure was recorded.',
			suggestedAction: 'Record the averaged blood-pressure measurements for interpretation.'
		});
	}

	// ─── unexpected-finding (abnormal but no originating request linked) ───
	if (
		(r.hypertensionConfirmed || r.severeHypertension) &&
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
