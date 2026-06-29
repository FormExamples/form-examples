import type { XRayRequest, RadiationSafetyBand, RadiationDoseBand, FiredRule } from './types';

/**
 * Axis B — Radiation safety (IR(ME)R 2017) + relative effective-dose band.
 *
 * Each body region carries a relative effective-dose band (low / moderate /
 * high). The safety band starts at "safe" and is forced to "caution" or
 * "contraindicated" when a radiation-safety concern fires: a possible / known
 * pregnancy, a missing IR(ME)R justification (unjustified exposure), or a recent
 * duplicate of the same region (repeat exposure). Least-alarming band only when
 * no concern fires.
 */
export const REGION_DOSE_BAND: Record<string, RadiationDoseBand> = {
	chest: 'low',
	abdomen: 'moderate',
	'spine-cervical': 'moderate',
	'spine-thoracic': 'moderate',
	'spine-lumbar': 'high',
	pelvis: 'moderate',
	hip: 'moderate',
	knee: 'low',
	'ankle-foot': 'low',
	shoulder: 'low',
	'wrist-hand': 'low',
	skull: 'low',
	dental: 'low',
	other: 'moderate'
};

const SAFETY_ORDER: RadiationSafetyBand[] = ['safe', 'caution', 'contraindicated'];

/** Return whichever of two safety bands is more severe. */
export function maxSafetyBand(a: RadiationSafetyBand, b: RadiationSafetyBand): RadiationSafetyBand {
	const ia = SAFETY_ORDER.indexOf(a);
	const ib = SAFETY_ORDER.indexOf(b);
	return ia >= ib ? a : b;
}

/** Relative effective-dose band for a body region. */
export function doseBand(bodyRegion: string): RadiationDoseBand {
	return REGION_DOSE_BAND[bodyRegion] ?? '';
}

/**
 * Evaluate radiation safety: a band plus the fired safety rules. Higher-dose
 * regions raise the threshold for concern.
 */
export function scoreRadiationSafety(data: XRayRequest): {
	band: RadiationSafetyBand;
	doseBand: RadiationDoseBand;
	firedRules: FiredRule[];
} {
	const region = data.request.bodyRegion;
	const dose = doseBand(region);
	const firedRules: FiredRule[] = [];
	let band: RadiationSafetyBand = 'safe';

	const preg = data.safety.pregnancyStatus;
	const highOrModerate = dose === 'high' || dose === 'moderate';

	if (preg === 'pregnant') {
		band = maxSafetyBand(band, highOrModerate ? 'contraindicated' : 'caution');
		firedRules.push({
			ruleId: 'R-SAFETY-PREGNANT',
			axis: 'safety',
			category: 'pregnancy',
			description: highOrModerate
				? `Confirmed pregnancy with a ${dose}-dose ${region || 'examination'} — exposure to the conceptus must be justified or avoided.`
				: 'Confirmed pregnancy — apply the 28-day / 10-day rule and justify the exposure.'
		});
	} else if (preg === 'possible' || preg === 'unknown') {
		band = maxSafetyBand(band, 'caution');
		firedRules.push({
			ruleId: 'R-SAFETY-POSSIBLE-PREGNANCY',
			axis: 'safety',
			category: 'pregnancy',
			description: 'Pregnancy is possible or unknown — confirm pregnancy status before exposure.'
		});
	}

	if (!data.safety.irMeRJustification || data.safety.irMeRJustification.trim() === '') {
		band = maxSafetyBand(band, 'caution');
		firedRules.push({
			ruleId: 'R-SAFETY-UNJUSTIFIED',
			axis: 'safety',
			category: 'unjustified-exposure',
			description:
				'No IR(ME)R justification recorded — the referrer must justify the exposure before it can proceed.'
		});
	}

	if (data.safety.recentSimilarXray === true) {
		band = maxSafetyBand(band, 'caution');
		firedRules.push({
			ruleId: 'R-SAFETY-REPEAT',
			axis: 'safety',
			category: 'repeat-recent-imaging',
			description:
				'A similar X-ray of the same region was recently performed — review prior imaging before repeating.'
		});
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-SAFETY-OK',
			axis: 'safety',
			category: 'justified',
			description: dose
				? `Exposure justified; ${region} carries a ${dose} relative effective dose.`
				: 'No radiation-safety concern fired.'
		});
	}

	return { band, doseBand: dose, firedRules };
}
