import type { CardiologyResponse, Flag, FlagPriority } from './types';
import { hasCriticalFinding, hasReducedEjectionFraction } from './utils';

/**
 * Detects safety-critical flags independently of the four axes. Flag
 * categories mirror sql/07_create_table_cardiology_response_grade_flag.sql.
 * Flags are returned sorted high → medium → low priority.
 */
export function detectFlags(r: CardiologyResponse): Flag[] {
	const flags: Flag[] = [];

	// ─── critical-finding (auto-raised with a critical result) ───
	if (hasCriticalFinding(r)) {
		flags.push({
			flagId: 'F-CRITICAL-FINDING-001',
			category: 'critical-finding',
			priority: 'high',
			description:
				'A critical or unexpected significant cardiac result is present (e.g. critical arrhythmia, severe symptomatic aortic stenosis, acute coronary syndrome).',
			suggestedAction:
				'Communicate the critical result to the referrer immediately, arrange urgent review, and document the communication.'
		});

		// critical result that has not yet been communicated
		if (!r.criticalResultCommunicated) {
			flags.push({
				flagId: 'F-CRITICAL-FINDING-002',
				category: 'critical-finding',
				priority: 'high',
				description:
					'Critical result present but it has not been recorded as communicated to the referrer.',
				suggestedAction: 'Contact the referrer now and record who was informed, with date and time.'
			});
		}
	}

	// ─── severe-valve-disease ───
	if (r.significantValveDisease) {
		flags.push({
			flagId: 'F-SEVERE-VALVE-DISEASE-001',
			category: 'severe-valve-disease',
			priority: 'high',
			description: 'Significant (moderate–severe) valve disease requiring specialist management.',
			suggestedAction:
				'Refer to the valve / structural heart team and consider Heart Team discussion per ESC/EACTS guidance.'
		});
	}

	// ─── significant-arrhythmia ───
	if (r.significantArrhythmia) {
		flags.push({
			flagId: 'F-SIGNIFICANT-ARRHYTHMIA-001',
			category: 'significant-arrhythmia',
			priority: 'medium',
			description: 'Significant arrhythmia present and may require management.',
			suggestedAction:
				'Arrange rhythm management, anticoagulation assessment, and arrhythmia-service follow-up as indicated.'
		});
	}

	// ─── reduced-ejection-fraction ───
	if (hasReducedEjectionFraction(r)) {
		flags.push({
			flagId: 'F-REDUCED-EJECTION-FRACTION-001',
			category: 'reduced-ejection-fraction',
			priority: 'high',
			description:
				'Reduced left-ventricular ejection fraction (heart failure with reduced ejection fraction).',
			suggestedAction:
				'Start / optimise guideline-directed heart-failure therapy and arrange heart-failure service follow-up per NICE NG106.'
		});
	}

	// ─── missing-diagnosis ───
	if (r.primaryDiagnosisCategory === '' && r.diagnosisNarrative.trim() === '') {
		flags.push({
			flagId: 'F-MISSING-DIAGNOSIS-001',
			category: 'missing-diagnosis',
			priority: 'medium',
			description: 'No diagnosis category or narrative has been recorded.',
			suggestedAction: 'Record a diagnosis that answers the referral clinical question.'
		});
	}

	// ─── incomplete-response ───
	const missingSections =
		(r.clinicalSummary.trim() === '' ? 1 : 0) +
		(r.examinationFindings.trim() === '' ? 1 : 0) +
		(r.managementPlan.trim() === '' ? 1 : 0) +
		(r.recommendedFollowUp.trim() === '' ? 1 : 0);
	if (missingSections > 0) {
		flags.push({
			flagId: 'F-INCOMPLETE-RESPONSE-001',
			category: 'incomplete-response',
			priority: missingSections >= 2 ? 'medium' : 'low',
			description: `One or more mandatory response sections are missing (${missingSections} of summary / examination / management / follow-up).`,
			suggestedAction: 'Complete the missing response sections before finalising the reply.'
		});
	}

	// ─── other: structured cardiac finding without a critical flag set ───
	if (r.uncontrolledHypertension && !hasCriticalFinding(r)) {
		flags.push({
			flagId: 'F-OTHER-001',
			category: 'other',
			priority: 'low',
			description: 'Uncontrolled hypertension documented.',
			suggestedAction:
				'Optimise antihypertensive therapy and arrange blood-pressure monitoring per NICE guidance.'
		});
	}

	// Sort: high > medium > low
	const priorityOrder: Record<FlagPriority, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
