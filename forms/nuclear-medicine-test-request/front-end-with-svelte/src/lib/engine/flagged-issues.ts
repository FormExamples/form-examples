import type { CardiologyRequest, Flag, FlagPriority } from './types';
import { hasTypicalAngina } from './utils';

/**
 * Detects safety-critical flags independently of the four axes. Flag categories
 * mirror sql/07_create_table_cardiology_request_grade_flag.sql. Flags are
 * returned sorted high → medium → low priority.
 */
export function detectFlags(r: CardiologyRequest): Flag[] {
	const flags: Flag[] = [];

	// ─── suspected-acs ───
	if (r.suspectedAcs || r.troponinStatus === 'elevated') {
		flags.push({
			flagId: 'F-SUSPECTED-ACS-001',
			category: 'suspected-acs',
			priority: 'high',
			description: 'Suspected acute coronary syndrome (or elevated troponin) is present.',
			suggestedAction:
				'Divert to the emergency ACS pathway now; do not wait for a routine cardiology clinic.'
		});
	}

	// ─── exertional-syncope ───
	if (r.exertionalSyncope) {
		flags.push({
			flagId: 'F-EXERTIONAL-SYNCOPE-001',
			category: 'exertional-syncope',
			priority: 'high',
			description: 'Exertional syncope is reported.',
			suggestedAction:
				'Arrange urgent assessment for a structural or arrhythmic cause; advise driving / activity precautions.'
		});
	}

	// ─── new-onset-heart-failure ───
	if (r.newOnsetHeartFailure) {
		flags.push({
			flagId: 'F-NEW-ONSET-HF-001',
			category: 'new-onset-heart-failure',
			priority: 'high',
			description: 'New-onset heart failure is reported.',
			suggestedAction:
				'Arrange urgent assessment per NICE NG106; check BNP / NT-proBNP and arrange echocardiography.'
		});
	}

	// ─── red-flag-chest-pain ───
	if (hasTypicalAngina(r) && !r.suspectedAcs) {
		flags.push({
			flagId: 'F-RED-FLAG-CHEST-PAIN-001',
			category: 'red-flag-chest-pain',
			priority: 'medium',
			description: 'Typical-angina chest pain is reported without a coded ACS red flag.',
			suggestedAction:
				'Vet for urgent rapid-access chest-pain review rather than a routine clinic.'
		});
	}

	// ─── missing-reason ───
	if (r.referralReason === '') {
		flags.push({
			flagId: 'F-MISSING-REASON-001',
			category: 'missing-reason',
			priority: 'medium',
			description: 'No primary reason for referral was supplied.',
			suggestedAction: 'Query the referrer for the primary reason before the referral can be vetted.'
		});
	}

	// ─── missing-clinical-question ───
	if (r.clinicalQuestion.trim() === '') {
		flags.push({
			flagId: 'F-MISSING-CLINICAL-QUESTION-001',
			category: 'missing-clinical-question',
			priority: 'low',
			description: 'No specific clinical question was supplied.',
			suggestedAction: 'Ask the referrer for the specific question the cardiology team should answer.'
		});
	}

	// ─── other: ECG abnormality with no ECG actually performed ───
	if (r.referralReason === 'abnormal-ecg' && !r.ecgDone) {
		flags.push({
			flagId: 'F-OTHER-001',
			category: 'other',
			priority: 'low',
			description: 'Referral reason is an abnormal ECG but no resting ECG is recorded as performed.',
			suggestedAction: 'Attach the ECG or its findings to support vetting.'
		});
	}

	// Sort: high > medium > low
	const priorityOrder: Record<FlagPriority, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
