import type { Flag, FlagPriority, SuitabilityBand, UltrasoundRequest } from './types';

/** Optional engine context passed from the grader. */
export interface FlagContext {
	suitabilityBand?: SuitabilityBand;
	prepRequirements?: string;
}

/**
 * Detect safety-critical flags for a general ultrasound request, independently
 * of the four axes. Flag categories mirror the SQL grade_flag CHECK constraint:
 * suspected-dvt-urgent, suspected-testicular-torsion, suspected-aaa,
 * prep-not-met, missing-indication, missing-clinical-question, other. Flag IDs
 * are stable and identical across every front-end and the back-end.
 */
export function detectFlags(data: UltrasoundRequest, context: FlagContext = {}): Flag[] {
	const flags: Flag[] = [];

	// ─── Red-flag clinical categories ───
	if (data.redFlags.suspectedTesticularTorsion === true) {
		flags.push({
			flagId: 'F-SUSPECTED-TESTICULAR-TORSION-001',
			category: 'suspected-testicular-torsion',
			priority: 'high',
			description: 'Suspected testicular torsion.',
			suggestedAction:
				'Arrange emergency scrotal Doppler now and alert urology / surgery; do not delay for routine booking — the salvage window is short.'
		});
	}
	if (data.redFlags.suspectedAaa === true) {
		flags.push({
			flagId: 'F-SUSPECTED-AAA-001',
			category: 'suspected-aaa',
			priority: 'high',
			description: 'Suspected abdominal aortic aneurysm.',
			suggestedAction:
				'Arrange emergency abdominal aortic ultrasound; if haemodynamically unstable or tender, treat as a surgical emergency.'
		});
	}
	if (data.redFlags.suspectedDvt === true) {
		flags.push({
			flagId: 'F-SUSPECTED-DVT-URGENT-001',
			category: 'suspected-dvt-urgent',
			priority: 'high',
			description: 'Suspected deep vein thrombosis.',
			suggestedAction:
				'Arrange urgent leg-vein Doppler within the local DVT pathway; consider interim anticoagulation if the scan is delayed.'
		});
	}

	// ─── Preparation / technical-suitability flags ───
	if (context.suitabilityBand === 'caution' || context.suitabilityBand === 'limited') {
		flags.push({
			flagId: 'F-PREP-NOT-MET-001',
			category: 'prep-not-met',
			priority: 'medium',
			description:
				context.suitabilityBand === 'limited'
					? 'Examination may be technically limited (preparation or body habitus).'
					: 'Required preparation has not been flagged on the request.',
			suggestedAction: context.prepRequirements
				? `Confirm preparation before booking: ${context.prepRequirements}`
				: 'Confirm the preparation requirements with the referrer before booking.'
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
			suggestedAction: 'Query the referrer for the specific question the scan should answer.'
		});
	}

	// Sort: high > medium > low
	const priorityOrder: Record<FlagPriority, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
