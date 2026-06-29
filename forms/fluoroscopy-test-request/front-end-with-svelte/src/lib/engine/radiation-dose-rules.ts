import type { RadiationDoseBand, FiredRule } from './types';

/**
 * Axis B (part 1) — radiation-dose band (study-type dependent).
 *
 * Typical effective-dose bands per study type, from the form spec.
 */
const STUDY_DOSE_BANDS: Record<string, RadiationDoseBand> = {
	'barium-swallow': 'low',
	'water-soluble-contrast-swallow': 'low',
	'barium-meal': 'moderate',
	'barium-follow-through': 'moderate',
	'barium-enema': 'high',
	'defecating-proctogram': 'moderate',
	hysterosalpingogram: 'moderate',
	'micturating-cystourethrogram': 'moderate',
	arthrogram: 'low',
	'fluoroscopy-guided-procedure': 'moderate',
	other: 'moderate'
};

/** Determine the radiation-dose band for the requested study type. */
export function scoreRadiationDose(studyType: string): {
	band: RadiationDoseBand;
	firedRule: FiredRule | null;
} {
	if (!studyType) {
		return {
			band: '',
			firedRule: {
				ruleId: 'R-DOSE-UNSPECIFIED',
				axis: 'safety',
				category: 'radiation-dose',
				description: 'Study type not yet specified — radiation dose not assessed.'
			}
		};
	}
	const band = STUDY_DOSE_BANDS[studyType] || 'moderate';
	const studyKey = studyType.toUpperCase().replace(/[^A-Z]+/g, '-');
	return {
		band,
		firedRule: {
			ruleId: `R-DOSE-${studyKey}`,
			axis: 'safety',
			category: 'radiation-dose',
			description: `Estimated radiation-dose band for a ${studyType} study is ${band}.`
		}
	};
}
