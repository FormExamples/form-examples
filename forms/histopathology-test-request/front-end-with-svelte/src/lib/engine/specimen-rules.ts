import type { HistopathologyRequest, SpecimenQualityBand, FiredRule } from './types';

/**
 * Axis B — specimen quality (RCPath specimen-handling: fixative + labelling).
 *
 * Band ok / caution / reject-risk. Reject-risk fires when the specimen is
 * likely unfit for diagnosis: a fresh (unfixed) specimen routed outside an
 * urgent frozen-section pathway, or a missing fixative entirely. Caution fires
 * for softer concerns: specimen not confirmed labelled, fixative recorded as
 * "other", or no specimen count recorded.
 */
export function scoreSpecimenQuality(data: HistopathologyRequest): {
	band: SpecimenQualityBand;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];
	let band: SpecimenQualityBand = 'ok';

	const fixative = data.specimen.fixative;
	const isFrozen =
		data.specimen.specimenType === 'frozen-section' ||
		data.urgency.urgentFrozenSection === true;

	// reject-risk conditions ------------------------------------------------
	if (fixative === 'fresh' && !isFrozen) {
		band = 'reject-risk';
		firedRules.push({
			ruleId: 'R-SPECIMEN-FRESH-NOT-FROZEN',
			axis: 'specimen',
			category: 'fixation',
			description:
				'Fresh (unfixed) specimen submitted outside a frozen-section pathway — autolysis / drying risk.'
		});
	}
	if (data.specimen.specimenType && !fixative) {
		band = band === 'reject-risk' ? band : 'caution';
		firedRules.push({
			ruleId: 'R-SPECIMEN-NO-FIXATIVE',
			axis: 'specimen',
			category: 'fixation',
			description: 'No fixative recorded for the specimen.'
		});
	}

	// caution conditions ----------------------------------------------------
	if (data.specimen.specimenType && data.specimen.specimenLabelled !== true) {
		if (band !== 'reject-risk') band = 'caution';
		firedRules.push({
			ruleId: 'R-SPECIMEN-NOT-LABELLED',
			axis: 'specimen',
			category: 'labelling',
			description: 'Specimen container labelling not confirmed — mislabel risk.'
		});
	}
	if (fixative === 'other') {
		if (band === 'ok') band = 'caution';
		firedRules.push({
			ruleId: 'R-SPECIMEN-FIXATIVE-OTHER',
			axis: 'specimen',
			category: 'fixation',
			description: 'Fixative recorded as "other"; confirm suitability for histology.'
		});
	}
	if (
		data.specimen.specimenType &&
		(data.specimen.numberOfSpecimens === null ||
			data.specimen.numberOfSpecimens === undefined ||
			data.specimen.numberOfSpecimens === 0)
	) {
		if (band === 'ok') band = 'caution';
		firedRules.push({
			ruleId: 'R-SPECIMEN-NO-COUNT',
			axis: 'specimen',
			category: 'adequacy',
			description: 'Number of specimen containers / pots not recorded.'
		});
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-SPECIMEN-OK',
			axis: 'specimen',
			category: 'quality',
			description: 'Fixative, labelling, and specimen count are satisfactory.'
		});
	}

	return { band, firedRules };
}
