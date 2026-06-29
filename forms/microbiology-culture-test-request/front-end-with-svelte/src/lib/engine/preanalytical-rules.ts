import type { MicrobiologyRequest, PreanalyticalBand, FiredRule } from './types';

// ----------------------------------------------------------------------
// Axis B — Pre-analytical / specimen safety (UKHSA SMI; ok/caution/reject-risk)
// ----------------------------------------------------------------------
//
// reject-risk: a critical pre-analytical problem (e.g. blood culture taken
// while on antibiotics, or no specimen collected). caution: a recoverable
// concern (e.g. on antibiotics for a non-blood specimen, transport-sensitive
// specimen with no collection time). ok: no concern fired.

const PREANALYTICAL_ORDER: PreanalyticalBand[] = ['ok', 'caution', 'reject-risk'];

/** Specimens whose yield / transport is time-critical (UKHSA SMI transport). */
const TRANSPORT_SENSITIVE = ['blood-culture', 'csf', 'genital-swab'];

/** Return whichever of two pre-analytical bands is more severe. */
export function worsePreanalytical(a: PreanalyticalBand, b: PreanalyticalBand): PreanalyticalBand {
	const ia = PREANALYTICAL_ORDER.indexOf(a);
	const ib = PREANALYTICAL_ORDER.indexOf(b);
	return ia >= ib ? a : b;
}

/**
 * Axis B — evaluate pre-analytical / specimen safety. Returns the most-severe
 * band fired plus the audit-trail rules.
 */
export function scorePreanalytical(data: MicrobiologyRequest): {
	band: PreanalyticalBand;
	firedRules: FiredRule[];
} {
	let band: PreanalyticalBand = 'ok';
	const firedRules: FiredRule[] = [];

	const collected = data.specimen.specimenCollected;
	const specimenType = data.specimen.specimenType;
	const onAntibiotics = data.clinical.currentAntibiotics === true;
	const isBloodCulture = specimenType === 'blood-culture';

	// reject-risk: blood culture taken while on antibiotics (yield compromised).
	if (isBloodCulture && onAntibiotics) {
		band = worsePreanalytical(band, 'reject-risk');
		firedRules.push({
			ruleId: 'R-PREANALYTICAL-BLOOD-CULTURE-ON-ABX',
			axis: 'preanalytical',
			category: 'blood-culture-before-antibiotics',
			description:
				'Blood culture requested while the patient is on antibiotics — cultures should be taken before the first dose.'
		});
	}

	// reject-risk: request submitted but specimen explicitly not collected.
	if (collected === 'no') {
		band = worsePreanalytical(band, 'reject-risk');
		firedRules.push({
			ruleId: 'R-PREANALYTICAL-NOT-COLLECTED',
			axis: 'preanalytical',
			category: 'specimen-not-collected',
			description: 'No specimen has been collected — the laboratory cannot process the request.'
		});
	}

	// caution: on antibiotics for a non-blood specimen (reduced yield).
	if (onAntibiotics && !isBloodCulture) {
		band = worsePreanalytical(band, 'caution');
		firedRules.push({
			ruleId: 'R-PREANALYTICAL-ON-ANTIBIOTICS',
			axis: 'preanalytical',
			category: 'current-antibiotics',
			description:
				'Current antibiotics may reduce culture yield; interpret a negative result with caution.'
		});
	}

	// caution: transport-sensitive specimen collected but no collection time.
	if (
		collected === 'yes' &&
		TRANSPORT_SENSITIVE.includes(specimenType) &&
		!data.specimen.collectionDatetime
	) {
		band = worsePreanalytical(band, 'caution');
		firedRules.push({
			ruleId: 'R-PREANALYTICAL-NO-COLLECTION-TIME',
			axis: 'preanalytical',
			category: 'transport-sensitive',
			description: `${specimenType} is transport-sensitive but no collection date/time was recorded; record it for the transport clock.`
		});
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-PREANALYTICAL-OK',
			axis: 'preanalytical',
			category: 'ok',
			description: 'No pre-analytical concerns identified.'
		});
	}

	return { band, firedRules };
}
