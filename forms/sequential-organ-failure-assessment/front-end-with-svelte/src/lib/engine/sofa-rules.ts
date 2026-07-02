import type { AssessmentData, OrganSystem, SystemScore } from './types';

/**
 * Declarative SOFA per-system scorers.
 *
 * SOFA scores six organ systems, each on an ordinal 0-4 scale using the
 * published thresholds in `../index.md` §Scoring system. Every scorer below is
 * a pure function of the assessment data that returns a `SystemScore` object,
 * where `score` is 0-4 or `null` when the required input is missing (the engine
 * never guesses). Cardiovascular and renal take the maximum band across their
 * two criteria; respiration sub-scores of 3 and 4 apply only when the patient
 * is receiving respiratory support.
 *
 * The P/F ratio is scored in mmHg (Berlin/ARDS cut-offs 400/300/200/100).
 * Bilirubin and creatinine are scored in SI units (umol/L), platelets in
 * x10^9/L.
 */

/** True when a numeric value is present (not null/undefined/NaN). */
function has(v: number | null | undefined): v is number {
	return v !== null && v !== undefined && !Number.isNaN(v);
}

/**
 * Respiration — PaO2/FiO2 ratio (mmHg). Prefers a directly-entered ratio;
 * otherwise derives it from PaO2 and FiO2. Bands of 3 and 4 require respiratory
 * support (mechanical ventilation or CPAP); without support the score caps at 2.
 */
export function scoreRespiration(d: AssessmentData): SystemScore {
	const r = d.respiration;
	let ratio: number | null = null;
	if (has(r.pao2Fio2Ratio)) {
		ratio = r.pao2Fio2Ratio;
	} else if (has(r.pao2) && has(r.fio2) && r.fio2 > 0) {
		ratio = r.pao2 / r.fio2;
	}
	if (ratio === null) {
		return {
			score: null,
			ruleId: 'R-RESPIRATION-NA',
			category: 'threshold-band',
			description: 'Respiration not scored — PaO2/FiO2 ratio unavailable.'
		};
	}
	const supported = r.respiratorySupport === 'ventilated' || r.respiratorySupport === 'cpap';
	let band: 0 | 1 | 2 | 3 | 4;
	if (ratio < 100) band = 4;
	else if (ratio < 200) band = 3;
	else if (ratio < 300) band = 2;
	else if (ratio < 400) band = 1;
	else band = 0;
	let capped = false;
	if (band >= 3 && !supported) {
		band = 2;
		capped = true;
	}
	const shown = Math.round(ratio);
	return {
		score: band,
		ruleId: `R-RESPIRATION-${band}`,
		category: 'threshold-band',
		description: capped
			? `PaO2/FiO2 ${shown} mmHg but no respiratory support recorded — capped at 2.`
			: `PaO2/FiO2 ${shown} mmHg — respiration sub-score ${band}.`
	};
}

/** Coagulation — platelet count, x10^9/L. */
export function scoreCoagulation(d: AssessmentData): SystemScore {
	const p = d.coagulation.platelets;
	if (!has(p)) {
		return {
			score: null,
			ruleId: 'R-COAGULATION-NA',
			category: 'threshold-band',
			description: 'Coagulation not scored — platelet count unavailable.'
		};
	}
	let band: 0 | 1 | 2 | 3 | 4;
	if (p < 20) band = 4;
	else if (p < 50) band = 3;
	else if (p < 100) band = 2;
	else if (p < 150) band = 1;
	else band = 0;
	return {
		score: band,
		ruleId: `R-COAGULATION-${band}`,
		category: 'threshold-band',
		description: `Platelets ${p} x10^9/L — coagulation sub-score ${band}.`
	};
}

/** Liver — total bilirubin, umol/L. */
export function scoreLiver(d: AssessmentData): SystemScore {
	const b = d.liver.bilirubin;
	if (!has(b)) {
		return {
			score: null,
			ruleId: 'R-LIVER-NA',
			category: 'threshold-band',
			description: 'Liver not scored — bilirubin unavailable.'
		};
	}
	let band: 0 | 1 | 2 | 3 | 4;
	if (b < 20) band = 0;
	else if (b <= 32) band = 1;
	else if (b <= 101) band = 2;
	else if (b <= 204) band = 3;
	else band = 4;
	return {
		score: band,
		ruleId: `R-LIVER-${band}`,
		category: 'threshold-band',
		description: `Bilirubin ${b} umol/L — liver sub-score ${band}.`
	};
}

/**
 * Cardiovascular — the maximum of the MAP band and the vasopressor band.
 * MAP >= 70 -> 0, < 70 -> 1. Vasopressor bands (doses ug/kg/min, given >= 1h):
 * dobutamine any -> 2; dopamine <= 5 -> 2, > 5 -> 3, > 15 -> 4;
 * adrenaline/noradrenaline <= 0.1 -> 3, > 0.1 -> 4. The presence of a
 * catecholamine sets that agent's floor even when the dose is not recorded.
 */
export function scoreCardiovascular(d: AssessmentData): SystemScore {
	const c = d.cardiovascular;
	let mapBand: 0 | 1 | null = null;
	if (has(c.map)) mapBand = c.map >= 70 ? 0 : 1;

	let vasoBand: 2 | 3 | 4 | null = null;
	const dose = c.vasopressorDose;
	switch (c.vasopressor) {
		case 'dobutamine':
			vasoBand = 2;
			break;
		case 'dopamine':
			if (!has(dose)) vasoBand = 2;
			else if (dose > 15) vasoBand = 4;
			else if (dose > 5) vasoBand = 3;
			else vasoBand = 2;
			break;
		case 'adrenaline':
		case 'noradrenaline':
			if (!has(dose)) vasoBand = 3;
			else vasoBand = dose > 0.1 ? 4 : 3;
			break;
		case 'other':
			vasoBand = 2;
			break;
		default:
			vasoBand = null; // 'none' or unset — no vasopressor contribution
	}

	if (mapBand === null && vasoBand === null) {
		return {
			score: null,
			ruleId: 'R-CARDIOVASCULAR-NA',
			category: 'threshold-band',
			description: 'Cardiovascular not scored — neither MAP nor vasopressor recorded.'
		};
	}
	const band = Math.max(mapBand ?? 0, vasoBand ?? 0) as 0 | 1 | 2 | 3 | 4;
	const driver = vasoBand !== null && vasoBand >= (mapBand ?? 0) ? 'vasopressor' : 'MAP';
	return {
		score: band,
		ruleId: `R-CARDIOVASCULAR-${band}`,
		category: 'threshold-band',
		description: `Cardiovascular sub-score ${band} (driven by ${driver}).`
	};
}

/** Central nervous system — Glasgow Coma Scale total (3-15). */
export function scoreCns(d: AssessmentData): SystemScore {
	const g = d.cns.glasgowComaScale;
	if (!has(g)) {
		return {
			score: null,
			ruleId: 'R-CNS-NA',
			category: 'threshold-band',
			description: 'CNS not scored — Glasgow Coma Scale unavailable.'
		};
	}
	let band: 0 | 1 | 2 | 3 | 4;
	if (g >= 15) band = 0;
	else if (g >= 13) band = 1;
	else if (g >= 10) band = 2;
	else if (g >= 6) band = 3;
	else band = 4;
	return {
		score: band,
		ruleId: `R-CNS-${band}`,
		category: 'threshold-band',
		description: `Glasgow Coma Scale ${g} — CNS sub-score ${band}.`
	};
}

/**
 * Renal — the maximum of the creatinine band and the urine-output band.
 * Creatinine (umol/L): < 110 -> 0, 110-170 -> 1, 171-299 -> 2, 300-440 -> 3,
 * > 440 -> 4. Urine output (mL/day): < 500 -> 3, < 200 -> 4; otherwise no
 * renal points from urine.
 */
export function scoreRenal(d: AssessmentData): SystemScore {
	const cr = d.renal.creatinine;
	const uo = d.renal.urineOutput;

	let crBand: 0 | 1 | 2 | 3 | 4 | null = null;
	if (has(cr)) {
		if (cr < 110) crBand = 0;
		else if (cr <= 170) crBand = 1;
		else if (cr <= 299) crBand = 2;
		else if (cr <= 440) crBand = 3;
		else crBand = 4;
	}

	let uoBand: 0 | 3 | 4 | null = null;
	if (has(uo)) {
		if (uo < 200) uoBand = 4;
		else if (uo < 500) uoBand = 3;
		else uoBand = 0;
	}

	if (crBand === null && uoBand === null) {
		return {
			score: null,
			ruleId: 'R-RENAL-NA',
			category: 'threshold-band',
			description: 'Renal not scored — neither creatinine nor urine output recorded.'
		};
	}
	const band = Math.max(crBand ?? 0, uoBand ?? 0) as 0 | 1 | 2 | 3 | 4;
	const driver = uoBand !== null && uoBand >= (crBand ?? 0) ? 'urine output' : 'creatinine';
	return {
		score: band,
		ruleId: `R-RENAL-${band}`,
		category: 'threshold-band',
		description: `Renal sub-score ${band} (driven by ${driver}).`
	};
}

/** Ordered scorer registry keyed by organ-system parameter. */
export const systemScorers: Record<OrganSystem, (d: AssessmentData) => SystemScore> = {
	respiration: scoreRespiration,
	coagulation: scoreCoagulation,
	liver: scoreLiver,
	cardiovascular: scoreCardiovascular,
	cns: scoreCns,
	renal: scoreRenal
};

/** The six SOFA organ systems, in scoring order. */
export const SYSTEMS: OrganSystem[] = [
	'respiration',
	'coagulation',
	'liver',
	'cardiovascular',
	'cns',
	'renal'
];
