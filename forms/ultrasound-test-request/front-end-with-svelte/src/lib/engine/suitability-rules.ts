import type { BodyRegion, FiredRule, SuitabilityBand, UltrasoundRequest } from './types';

/**
 * Axis B — Preparation / technical suitability (BMUS / AIUM).
 *
 * Each body region has expected preparation. The engine compares the
 * preparation the clinician has flagged against what the region needs, and
 * folds in a body-habitus caveat from BMI. The band is ok / caution / limited
 * and a human-readable prep-requirements string is produced.
 */

/** Expected preparation per body region. */
const REGION_PREP: Record<string, { fasting: boolean; fullBladder: boolean; note: string }> = {
	abdomen: { fasting: true, fullBladder: false, note: 'Fasting 6 hours for upper-abdominal / biliary views.' },
	'liver-biliary': { fasting: true, fullBladder: false, note: 'Fasting 6 hours to distend the gallbladder.' },
	'renal-tract': { fasting: false, fullBladder: true, note: 'Full bladder for the lower urinary tract.' },
	pelvis: { fasting: false, fullBladder: true, note: 'Full bladder for a transabdominal pelvic view.' },
	'thyroid-neck': { fasting: false, fullBladder: false, note: 'No specific preparation.' },
	'scrotum-testes': { fasting: false, fullBladder: false, note: 'No specific preparation.' },
	breast: { fasting: false, fullBladder: false, note: 'No specific preparation.' },
	'soft-tissue': { fasting: false, fullBladder: false, note: 'No specific preparation.' },
	'vascular-doppler': { fasting: false, fullBladder: false, note: 'No specific preparation.' },
	'dvt-leg': { fasting: false, fullBladder: false, note: 'No specific preparation.' },
	carotid: { fasting: false, fullBladder: false, note: 'No specific preparation.' },
	'msk-joint': { fasting: false, fullBladder: false, note: 'No specific preparation.' },
	other: { fasting: false, fullBladder: false, note: 'Confirm preparation with the imaging department.' }
};

/** Body-habitus caveat for technical quality on deep scans. */
const HIGH_BMI_THRESHOLD = 35;

const DEEP_REGIONS: BodyRegion[] = ['abdomen', 'liver-biliary', 'renal-tract', 'pelvis', 'vascular-doppler'];

/**
 * Evaluate preparation / technical suitability for the requested region.
 * Returns the band, a human-readable prep-requirements string, and the
 * audit-trail rules that fired. Rule IDs are stable and identical across every
 * front-end and the back-end.
 */
export function evaluateSuitability(data: UltrasoundRequest): {
	band: SuitabilityBand;
	prepRequirements: string;
	firedRules: FiredRule[];
} {
	const region = data.request.bodyRegion;
	const firedRules: FiredRule[] = [];

	if (!region) {
		return {
			band: '',
			prepRequirements: '',
			firedRules: [
				{
					ruleId: 'R-SUIT-UNKNOWN',
					axis: 'suitability',
					category: 'unspecified',
					description: 'Body region not yet specified — suitability not assessed.'
				}
			]
		};
	}

	const expected = REGION_PREP[region] ?? REGION_PREP['other'];
	const regionKey = region.toUpperCase().replace(/[^A-Z]+/g, '-');
	let band: SuitabilityBand = 'ok';
	const prepParts = [expected.note];

	// Caution when required preparation has not been flagged on the request.
	if (expected.fasting && data.prep.fastingRequired !== true) {
		band = 'caution';
		firedRules.push({
			ruleId: `R-SUIT-${regionKey}-FASTING-NOT-FLAGGED`,
			axis: 'suitability',
			category: 'prep',
			description: `A ${region} scan usually needs fasting, but the request does not flag fasting required.`
		});
	}
	if (expected.fullBladder && data.prep.fullBladderRequired !== true) {
		band = 'caution';
		firedRules.push({
			ruleId: `R-SUIT-${regionKey}-BLADDER-NOT-FLAGGED`,
			axis: 'suitability',
			category: 'prep',
			description: `A ${region} scan usually needs a full bladder, but the request does not flag full bladder required.`
		});
	}

	// Body-habitus caveat — high BMI can limit deep abdominal / pelvic views.
	const bmi = data.patient.bodyMassIndex;
	const deepRegion = DEEP_REGIONS.includes(region);
	if (bmi !== null && bmi !== undefined && Number(bmi) >= HIGH_BMI_THRESHOLD && deepRegion) {
		band = 'limited';
		firedRules.push({
			ruleId: 'R-SUIT-HIGH-BMI',
			axis: 'suitability',
			category: 'body-habitus',
			description: `Raised BMI (${Number(bmi)} kg/m²) may technically limit a deep ${region} ultrasound.`
		});
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: `R-SUIT-${regionKey}-OK`,
			axis: 'suitability',
			category: 'prep',
			description: `Preparation requirements are met for a ${region} scan.`
		});
	}

	if (expected.fasting) prepParts.push('Fasting required.');
	if (expected.fullBladder) prepParts.push('Full bladder required.');

	return {
		band,
		prepRequirements: prepParts.join(' '),
		firedRules
	};
}
