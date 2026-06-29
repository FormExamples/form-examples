import type { PulmonaryFunctionTestRequest, Flag, FlagPriority } from './types';

/**
 * Detects safety-critical flags independently of the four axes. Flag categories
 * mirror the sql grade_flag CHECK constraint. Flag IDs are stable and identical
 * across every front-end and the back-end. Flags are returned sorted high →
 * medium → low priority.
 */
export function detectFlags(r: PulmonaryFunctionTestRequest): Flag[] {
	const flags: Flag[] = [];

	// ─── Forced-expiration contraindications ───
	if (r.safety.recentMiOrEyeAbdominalSurgery === true) {
		flags.push({
			flagId: 'F-RECENT-MI-001',
			category: 'recent-mi-contraindication',
			priority: 'high',
			description: 'Recent myocardial infarction or recent eye / thoracic / abdominal surgery.',
			suggestedAction:
				'Defer forced-expiration testing; query referrer and confirm the safe interval since the event / surgery.'
		});
	}
	if (r.safety.haemoptysis === true) {
		flags.push({
			flagId: 'F-HAEMOPTYSIS-001',
			category: 'haemoptysis',
			priority: 'high',
			description: 'Haemoptysis of unknown origin reported.',
			suggestedAction:
				'Defer forced expiration until the cause is investigated; expedite respiratory review.'
		});
	}

	// ─── Infection-control concerns ───
	if (r.safety.suspectedActiveTuberculosis === true) {
		flags.push({
			flagId: 'F-SUSPECTED-TB-001',
			category: 'suspected-tb-infection-control',
			priority: 'high',
			description: 'Suspected active tuberculosis.',
			suggestedAction:
				'Apply infection-control precautions for shared equipment; defer until TB excluded or appropriate controls in place.'
		});
	}
	if (r.safety.recentRespiratoryInfection === true) {
		flags.push({
			flagId: 'F-ACTIVE-RESPIRATORY-INFECTION-001',
			category: 'active-respiratory-infection',
			priority: 'medium',
			description: 'Recent or active respiratory infection.',
			suggestedAction:
				'Defer until recovered (typically 4-6 weeks) for infection control and result validity.'
		});
	}

	// ─── Completeness / data-quality flags ───
	if (!r.request.primaryIndication) {
		flags.push({
			flagId: 'F-MISSING-INDICATION-001',
			category: 'missing-indication',
			priority: 'medium',
			description: 'No primary clinical indication recorded.',
			suggestedAction: 'Query the referrer for the clinical indication before vetting.'
		});
	}
	if (r.request.clinicalQuestion.trim() === '') {
		flags.push({
			flagId: 'F-MISSING-CLINICAL-QUESTION-001',
			category: 'missing-clinical-question',
			priority: 'medium',
			description: 'No specific clinical question recorded.',
			suggestedAction: 'Query the referrer for the specific question the test should answer.'
		});
	}

	// Sort: high > medium > low
	const priorityOrder: Record<FlagPriority, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
