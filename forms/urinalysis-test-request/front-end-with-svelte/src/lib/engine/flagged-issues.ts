import type { UrinalysisRequest, Flag, FlagPriority } from './types';
import { countSelectedTests } from './utils';

/**
 * Detects safety-critical flags independently of the four axes. Flag categories
 * mirror the sql grade_flag CHECK constraint. Flag IDs are stable and identical
 * across every front-end and the back-end. Flags are returned sorted
 * high → medium → low priority.
 */
export function detectFlags(r: UrinalysisRequest): Flag[] {
	const flags: Flag[] = [];

	// ─── Red-flag symptom categories ───
	if (r.symptoms.symptomVisibleHaematuria === true) {
		flags.push({
			flagId: 'F-VISIBLE-HAEMATURIA-2WW-001',
			category: 'visible-haematuria-2ww',
			priority: 'high',
			description: 'Visible (macroscopic) haematuria reported.',
			suggestedAction:
				'Consider NICE NG12 suspected-cancer (2-week-wait) bladder pathway, especially age ≥45 with unexplained visible haematuria.'
		});
	}
	if (r.symptoms.symptomFever === true && r.symptoms.symptomLoinPain === true) {
		flags.push({
			flagId: 'F-SUSPECTED-PYELONEPHRITIS-001',
			category: 'suspected-pyelonephritis',
			priority: 'high',
			description:
				'Fever with loin pain — possible upper-tract infection (pyelonephritis) / urosepsis.',
			suggestedAction:
				'Expedite MSU culture and clinical assessment; do not delay empirical treatment if systemically unwell.'
		});
	}

	// ─── Specimen / preanalytical ───
	if (r.specimen.specimenCollected === 'no') {
		flags.push({
			flagId: 'F-SPECIMEN-NOT-COLLECTED-001',
			category: 'specimen-not-collected',
			priority: 'medium',
			description: 'The specimen has not yet been collected.',
			suggestedAction:
				'Collect an appropriate specimen (e.g. MSU) before the request can be processed; refrigerate or use boric acid if >4 h to lab.'
		});
	}

	// ─── Completeness / data-quality flags ───
	if (countSelectedTests(r.tests) === 0) {
		flags.push({
			flagId: 'F-NO-TEST-SELECTED-001',
			category: 'no-test-selected',
			priority: 'high',
			description: 'No test has been selected on the panel.',
			suggestedAction: 'Select at least one urine test to order; there is nothing to process.'
		});
	}
	if (!r.context.primaryIndication) {
		flags.push({
			flagId: 'F-MISSING-INDICATION-001',
			category: 'missing-indication',
			priority: 'medium',
			description: 'No primary clinical indication recorded.',
			suggestedAction: 'Query the referrer for the clinical indication before vetting.'
		});
	}
	if (!r.context.clinicalDetails || r.context.clinicalDetails.trim() === '') {
		flags.push({
			flagId: 'F-MISSING-CLINICAL-DETAILS-001',
			category: 'missing-clinical-details',
			priority: 'low',
			description: 'No clinical details recorded (highest-value field).',
			suggestedAction:
				'Add the relevant clinical details so the laboratory can interpret and triage the request.'
		});
	}

	// Sort: high > medium > low
	const priorityOrder: Record<FlagPriority, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
