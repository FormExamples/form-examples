import type { MicrobiologyRequest, Flag } from './types';
import { anyTestSelected } from './utils';

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 } as const;

/**
 * Detect safety flags for a microbiology culture request. Pure and
 * deterministic; flag IDs are stable and identical across every front-end and
 * the back-end. Flags are returned sorted high → medium → low.
 */
export function detectFlags(data: MicrobiologyRequest): Flag[] {
	const flags: Flag[] = [];

	// --- Suspected sepsis: process as stat (NICE NG51) ------------------
	if (data.clinical.primaryIndication === 'suspected-sepsis') {
		flags.push({
			flagId: 'F-SUSPECTED-SEPSIS-STAT-001',
			category: 'suspected-sepsis-stat',
			priority: 'high',
			description: 'Suspected sepsis — this request must be processed as stat.',
			suggestedAction:
				'Escalate to the on-call microbiologist; take blood cultures and give broad-spectrum antibiotics within the hour (NICE NG51).'
		});
	}

	// --- Blood culture taken while / after antibiotics started ----------
	if (
		data.specimen.specimenType === 'blood-culture' &&
		data.clinical.currentAntibiotics === true
	) {
		flags.push({
			flagId: 'F-BLOOD-CULTURE-BEFORE-ANTIBIOTICS-001',
			category: 'blood-culture-before-antibiotics',
			priority: 'high',
			description: 'Blood culture requested while the patient is on antibiotics.',
			suggestedAction:
				'Cultures should be taken before the first antibiotic dose; flag reduced yield to the requester.'
		});
	}

	// --- Specimen not collected -----------------------------------------
	if (data.specimen.specimenCollected === 'no') {
		flags.push({
			flagId: 'F-SPECIMEN-NOT-COLLECTED-001',
			category: 'specimen-not-collected',
			priority: 'high',
			description: 'Request submitted but no specimen has been collected.',
			suggestedAction:
				'Collect and label the specimen before the laboratory can accept the request.'
		});
	}

	// --- No test selected -----------------------------------------------
	if (!anyTestSelected(data.tests)) {
		flags.push({
			flagId: 'F-NO-TEST-SELECTED-001',
			category: 'no-test-selected',
			priority: 'high',
			description: 'No microbiology test has been selected on the request.',
			suggestedAction:
				'Select at least one test (culture & sensitivity is the most common) before submitting.'
		});
	}

	// --- Missing clinical details (highest-value field) -----------------
	if (!data.clinical.clinicalDetails || data.clinical.clinicalDetails.trim() === '') {
		flags.push({
			flagId: 'F-MISSING-CLINICAL-DETAILS-001',
			category: 'missing-clinical-details',
			priority: 'medium',
			description:
				'No clinical details recorded — the highest-value field for laboratory interpretation.',
			suggestedAction: 'Query the referrer for the clinical details before vetting.'
		});
	}

	// --- Missing indication ---------------------------------------------
	if (!data.clinical.primaryIndication) {
		flags.push({
			flagId: 'F-MISSING-INDICATION-001',
			category: 'missing-indication',
			priority: 'medium',
			description: 'No primary clinical indication recorded.',
			suggestedAction: 'Query the referrer for the clinical indication before vetting.'
		});
	}

	return flags.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
}
