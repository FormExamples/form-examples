import type { CytologyRequest, Flag, FlagPriority } from './types';

/**
 * Detects safety-critical flags independently of the four axes. Flag categories
 * mirror the form's grade-flag CHECK constraint: suspected-cancer-2ww,
 * previous-high-grade-cytology, specimen-not-collected, missing-clinical-details,
 * missing-indication, other. Flags are returned sorted high → medium → low. Flag
 * IDs are stable and identical across every front-end and the back-end.
 */
export function detectFlags(data: CytologyRequest): Flag[] {
	const flags: Flag[] = [];

	// ─── suspected-cancer two-week-wait ───
	if (
		data.request.primaryIndication === 'suspected-malignancy' ||
		data.request.primaryIndication === 'breast-lump'
	) {
		flags.push({
			flagId: 'F-SUSPECTED-CANCER-2WW-001',
			category: 'suspected-cancer-2ww',
			priority: 'high',
			description: 'Suspected-cancer indication recorded.',
			suggestedAction:
				'Route on the NICE NG12 two-week-wait suspected-cancer pathway; do not delay for routine booking.'
		});
	}

	// ─── previous high-grade cytology ───
	if (data.context.previousAbnormalCytology === 'high-grade') {
		flags.push({
			flagId: 'F-PREVIOUS-HIGH-GRADE-CYTOLOGY-001',
			category: 'previous-high-grade-cytology',
			priority: 'high',
			description: 'Previous high-grade abnormal cytology recorded.',
			suggestedAction:
				'Expedite to colposcopy / two-week-wait pathway; ensure prior results are reviewed.'
		});
	}

	// ─── specimen not collected ───
	if (data.collection.specimenCollected === 'no') {
		flags.push({
			flagId: 'F-SPECIMEN-NOT-COLLECTED-001',
			category: 'specimen-not-collected',
			priority: 'medium',
			description: 'Specimen has not yet been collected.',
			suggestedAction:
				'Arrange specimen collection before laboratory processing; confirm fixation and labelling.'
		});
	}

	// ─── completeness / data-quality flags ───
	if (!data.request.primaryIndication) {
		flags.push({
			flagId: 'F-MISSING-INDICATION-001',
			category: 'missing-indication',
			priority: 'medium',
			description: 'No primary clinical indication recorded.',
			suggestedAction: 'Query the referrer for the clinical indication before vetting.'
		});
	}
	if (data.request.clinicalDetails.trim() === '') {
		flags.push({
			flagId: 'F-MISSING-CLINICAL-DETAILS-001',
			category: 'missing-clinical-details',
			priority: 'low',
			description: 'No relevant clinical details recorded for the reporting cytologist.',
			suggestedAction:
				'Provide relevant history and findings to support accurate cytological interpretation.'
		});
	}

	// Sort: high > medium > low
	const priorityOrder: Record<FlagPriority, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
