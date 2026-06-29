import type { UrinalysisRequest, PreanalyticalBand, FiredRule } from './types';

const PREANALYTICAL_ORDER: PreanalyticalBand[] = ['ok', 'caution', 'reject-risk'];

/** Return whichever of two preanalytical bands is worse (more severe). */
export function worseBand(a: PreanalyticalBand, b: PreanalyticalBand): PreanalyticalBand {
	const ia = PREANALYTICAL_ORDER.indexOf(a);
	const ib = PREANALYTICAL_ORDER.indexOf(b);
	return ib > ia ? b : a;
}

/**
 * Axis B — preanalytical specimen suitability (UK SMI B41).
 *
 * Bands: ok / caution / reject-risk. Driven by whether a specimen has been
 * collected, the specimen type, contamination / asymptomatic-bacteriuria risk
 * (catheter), and antibiotic suppression of culture growth. Returns the band,
 * an advisory note, and the fired rules.
 */
export function gradePreanalytical(r: UrinalysisRequest): {
	preanalyticalBand: PreanalyticalBand;
	note: string;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];
	const sp = r.specimen;
	const cultureRequested = r.tests.microscopyCultureSensitivity === true || r.tests.cytology === true;

	let band: PreanalyticalBand = 'ok';
	let note = 'Specimen handling appears acceptable.';

	const push = (band2: PreanalyticalBand, note2: string, rule: FiredRule) => {
		band = worseBand(band, band2);
		if (note2) note = note2;
		firedRules.push(rule);
	};

	if (sp.specimenCollected === 'no') {
		push(
			'reject-risk',
			'Specimen not yet collected; the request cannot proceed until a sample is provided.',
			{
				ruleId: 'R-PREANALYTICAL-NOT-COLLECTED',
				axis: 'preanalytical',
				category: 'specimen-not-collected',
				description: 'Specimen has not been collected; cannot be processed.'
			}
		);
	}

	if (cultureRequested && sp.specimenType === 'random') {
		push(
			'caution',
			'A random specimen is sub-optimal for culture; prefer a midstream (MSU) or clean-catch sample.',
			{
				ruleId: 'R-PREANALYTICAL-RANDOM-FOR-CULTURE',
				axis: 'preanalytical',
				category: 'contamination-risk',
				description:
					'Random specimen requested for culture; contamination / contamination-risk per UK SMI B41.'
			}
		);
	}

	if (r.context.catheterised === true && r.tests.microscopyCultureSensitivity === true) {
		push(
			'caution',
			'Catheter specimen (CSU): interpret culture with caution; asymptomatic bacteriuria is common and not usually treated.',
			{
				ruleId: 'R-PREANALYTICAL-CATHETER',
				axis: 'preanalytical',
				category: 'catheter',
				description:
					'Catheterised patient with culture requested; asymptomatic bacteriuria caveat.'
			}
		);
	}

	if (r.context.currentAntibiotics === true && r.tests.microscopyCultureSensitivity === true) {
		push(
			'caution',
			'Current antibiotics may suppress culture growth; note antibiotic on the request and consider timing.',
			{
				ruleId: 'R-PREANALYTICAL-ON-ANTIBIOTICS',
				axis: 'preanalytical',
				category: 'antibiotics',
				description: 'Culture requested while on antibiotics; growth may be suppressed.'
			}
		);
	}

	if (r.tests.twentyFourHourCollection === true) {
		push(
			'caution',
			'24-hour collection: ensure correct container, complete collection, and prompt delivery — preanalytical handling is critical.',
			{
				ruleId: 'R-PREANALYTICAL-24H',
				axis: 'preanalytical',
				category: 'handling',
				description: '24-hour collection requested; handling and completeness are critical.'
			}
		);
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-PREANALYTICAL-OK',
			axis: 'preanalytical',
			category: 'specimen',
			description: 'No preanalytical concerns detected for the requested tests.'
		});
	}

	return { preanalyticalBand: band, note, firedRules };
}
