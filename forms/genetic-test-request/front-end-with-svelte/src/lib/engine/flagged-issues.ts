import type { GeneticTestRequest, Flag, FlagPriority } from './types';
import { isPredictiveTest, isPrenatalRequest } from './utils';

/**
 * Detects safety-critical flags independently of the four axes. Flag categories
 * mirror the sql grade_flag CHECK constraint. Flags are returned sorted
 * high → medium → low priority. Flag IDs are stable and identical across every
 * front-end and the back-end.
 */
export function detectFlags(r: GeneticTestRequest): Flag[] {
	const flags: Flag[] = [];

	const consent = r.consent.consentObtained === true;
	const counselling = r.consent.geneticCounsellingOffered === true;
	const predictive = isPredictiveTest(r.request.testType, r.request.primaryIndication);
	const prenatal = isPrenatalRequest(
		r.request.testType,
		r.request.primaryIndication,
		r.triage.specimenType
	);

	// ─── Consent & counselling (mandatory-blocking for predictive) ───
	if (predictive && !counselling) {
		flags.push({
			flagId: 'F-PREDICTIVE-COUNSELLING-001',
			category: 'predictive-test-counselling-required',
			priority: 'high',
			description:
				'Predictive / presymptomatic testing without documented pre-test genetic counselling.',
			suggestedAction:
				'Arrange pre-test genetic counselling before proceeding; do not process the test until counselling is documented.'
		});
	}
	if (predictive && !consent) {
		flags.push({
			flagId: 'F-PREDICTIVE-CONSENT-001',
			category: 'consent-not-obtained',
			priority: 'high',
			description: 'Predictive / presymptomatic testing without documented informed consent.',
			suggestedAction:
				'Obtain and document informed consent (Record of Discussion) before proceeding.'
		});
	} else if (!consent) {
		flags.push({
			flagId: 'F-CONSENT-NOT-OBTAINED-001',
			category: 'consent-not-obtained',
			priority: 'medium',
			description: 'Informed consent for genomic testing has not been documented.',
			suggestedAction:
				'Confirm and record informed consent (Record of Discussion) before the test is processed.'
		});
	}

	// ─── Triage urgency ───
	if (prenatal) {
		flags.push({
			flagId: 'F-PRENATAL-TIME-CRITICAL-001',
			category: 'prenatal-time-critical',
			priority: 'high',
			description:
				'Prenatal request is time-critical; the result is needed within the prenatal decision window.',
			suggestedAction:
				'Expedite specimen receipt and analysis; confirm the gestational decision deadline with the referrer.'
		});
	}

	// ─── Completeness / data-quality flags ───
	if (!r.request.primaryIndication) {
		flags.push({
			flagId: 'F-MISSING-INDICATION-001',
			category: 'missing-indication',
			priority: 'medium',
			description: 'No primary clinical indication recorded.',
			suggestedAction:
				'Query the referrer for the clinical indication and map it to a Test Directory clinical indication before vetting.'
		});
	}
	if (r.clinical.clinicalDetails.trim() === '') {
		flags.push({
			flagId: 'F-MISSING-CLINICAL-DETAILS-001',
			category: 'missing-clinical-details',
			priority: 'medium',
			description: 'No clinical details / phenotype recorded.',
			suggestedAction:
				'Query the referrer for the clinical details and phenotype (e.g. HPO terms) needed for test selection.'
		});
	}
	if (r.clinical.familyHistory.trim() === '') {
		flags.push({
			flagId: 'F-MISSING-FAMILY-HISTORY-001',
			category: 'missing-family-history',
			priority: 'low',
			description: 'No family history recorded.',
			suggestedAction:
				'Request a family history / pedigree summary; inheritance pattern informs eligibility and test selection.'
		});
	}

	// Sort: high > medium > low
	const priorityOrder: Record<FlagPriority, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
