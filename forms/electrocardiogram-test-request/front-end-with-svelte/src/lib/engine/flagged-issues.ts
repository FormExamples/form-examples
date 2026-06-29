import type { EcgRequest, Flag, FlagPriority } from './types';

/**
 * Detects safety-critical flags independently of the four axes. Flag categories
 * mirror the form's sql grade_flag CHECK constraint: suspected-acs,
 * active-chest-pain, syncope-red-flag, suspected-vt, missing-indication,
 * missing-clinical-question, other. Flag IDs are stable and identical across
 * every front-end and the back-end. Flags are returned sorted high → medium →
 * low priority.
 */
export function detectFlags(data: EcgRequest): Flag[] {
	const flags: Flag[] = [];

	// ─── Red-flag clinical categories ───
	if (data.symptoms.suspectedAcs === true || data.request.primaryIndication === 'suspected-mi-acs') {
		flags.push({
			flagId: 'F-SUSPECTED-ACS-001',
			category: 'suspected-acs',
			priority: 'high',
			description: 'Acute coronary syndrome is suspected.',
			suggestedAction:
				'Arrange same-hour emergency 12-lead ECG and senior review; follow the ACS pathway (NICE NG185).'
		});
	}
	if (data.symptoms.symptomChestPain === true && data.symptoms.currentlySymptomatic === true) {
		flags.push({
			flagId: 'F-ACTIVE-CHEST-PAIN-001',
			category: 'active-chest-pain',
			priority: 'high',
			description: 'Patient has active chest pain at the time of request.',
			suggestedAction:
				'Do not delay for routine booking; perform an emergency same-hour 12-lead ECG (NICE CG95).'
		});
	}
	if (data.symptoms.symptomSyncope === true) {
		flags.push({
			flagId: 'F-SYNCOPE-RED-FLAG-001',
			category: 'syncope-red-flag',
			priority: 'high',
			description: 'Syncope or collapse reported.',
			suggestedAction:
				'Urgent 12-lead ECG to exclude an arrhythmic / structural cause; consider ambulatory monitoring.'
		});
	}
	if (data.symptoms.knownArrhythmia === 'vt') {
		flags.push({
			flagId: 'F-SUSPECTED-VT-001',
			category: 'suspected-vt',
			priority: 'high',
			description: 'Known or suspected ventricular tachycardia.',
			suggestedAction:
				'Urgent cardiology review; capture a 12-lead ECG during symptoms and consider continuous monitoring.'
		});
	}

	// ─── Completeness / data-quality flags ───
	if (!data.request.primaryIndication) {
		flags.push({
			flagId: 'F-MISSING-INDICATION-001',
			category: 'missing-indication',
			priority: 'medium',
			description: 'No primary clinical indication recorded.',
			suggestedAction: 'Query the referrer for the clinical indication before vetting.'
		});
	}
	if (!data.request.clinicalQuestion || data.request.clinicalQuestion.trim() === '') {
		flags.push({
			flagId: 'F-MISSING-CLINICAL-QUESTION-001',
			category: 'missing-clinical-question',
			priority: 'medium',
			description: 'No specific clinical question recorded.',
			suggestedAction: 'Query the referrer for the specific question the ECG should answer.'
		});
	}

	// Sort: high > medium > low
	const priorityOrder: Record<FlagPriority, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
