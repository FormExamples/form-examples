import type { AssessmentData, Classification, FiredRule, GradingResult } from './types';
import {
	REF_ALBUMIN,
	ALBUMIN_FACTOR,
	NORMAL_LOW,
	NORMAL_HIGH_WITH_K,
	NORMAL_HIGH_WITHOUT_K,
	classificationRules
} from './anion-gap-rules';
import { detectFlaggedIssues } from './flagged-issues';

/** True when a numeric value is present (not null/undefined/NaN). */
export function present(n: number | null | undefined): n is number {
	return n !== null && n !== undefined && !Number.isNaN(n);
}

/** Round a number to one decimal place (returns null unchanged). */
export function roundOne(n: number | null): number | null {
	if (n === null || n === undefined || Number.isNaN(n)) return null;
	return Math.round(n * 10) / 10;
}

/**
 * Pure function: compute the full anion-gap grade for the supplied assessment
 * data.
 *
 * Algorithm (spec §4). All electrolytes in mmol/L; albumin in g/L.
 *   includesPotassium = potassium != null
 *   anionGap = includesPotassium
 *                ? (sodium + potassium) − (chloride + bicarbonate)
 *                :  sodium              − (chloride + bicarbonate)
 *   correctedAnionGap = albumin != null
 *                         ? anionGap + 0.25 × (40 − albumin)
 *                         : null
 *   normalLow  = 8
 *   normalHigh = includesPotassium ? 16 : 12
 *   classificationValue = correctedAnionGap != null ? correctedAnionGap : anionGap
 *   band = classificationValue >= 20        -> 'very-high'
 *        : classificationValue >  normalHigh -> 'high'
 *        : classificationValue <  normalLow  -> 'low'
 *        : else                              -> 'normal'
 *
 * `anionGap` is null when any required electrolyte (sodium, chloride,
 * bicarbonate) is missing; the classification is then 'unknown'. The unrounded
 * values drive classification and every flag threshold; values are rounded to
 * one decimal place for display only.
 */
export function calculateAnionGap(data: AssessmentData): GradingResult {
	const { sodium, potassium, chloride, bicarbonate } = data.electrolytes;
	const albumin = data.albumin.albumin;

	const includesPotassium = present(potassium);
	const normalLow = NORMAL_LOW;
	const normalHigh = includesPotassium ? NORMAL_HIGH_WITH_K : NORMAL_HIGH_WITHOUT_K;

	const firedRules: FiredRule[] = [];

	// ─── Raw anion gap ─────────────────────────────────────────────
	let anionGapRaw: number | null = null;
	if (present(sodium) && present(chloride) && present(bicarbonate)) {
		anionGapRaw = includesPotassium
			? sodium + (potassium as number) - (chloride + bicarbonate)
			: sodium - (chloride + bicarbonate);
	}

	if (anionGapRaw === null) {
		firedRules.push({
			id: 'R-FORMULA-INCOMPLETE-01',
			instrument: 'formula',
			band: '',
			category: 'missing-input',
			description:
				'Anion gap not computed — sodium, chloride and/or bicarbonate is missing'
		});
		const snapshot = {
			anionGapRaw: null,
			correctedAnionGapRaw: null,
			classificationValue: null,
			normalLow,
			normalHigh
		};
		return {
			includesPotassium,
			anionGap: null,
			anionGapRaw: null,
			correctedAnionGap: null,
			correctedAnionGapRaw: null,
			normalLow,
			normalHigh,
			classificationValue: null,
			classification: 'unknown',
			firedRules,
			flaggedIssues: detectFlaggedIssues(data, snapshot),
			timestamp: new Date().toISOString()
		};
	}

	firedRules.push({
		id: includesPotassium ? 'R-FORMULA-WITH-K-01' : 'R-FORMULA-WITHOUT-K-01',
		instrument: 'formula',
		band: '',
		category: 'formula',
		description: includesPotassium
			? `Anion gap = (${sodium} + ${potassium}) − (${chloride} + ${bicarbonate}) = ` +
				`${roundOne(anionGapRaw)} mmol/L (potassium-inclusive; normal 8–16)`
			: `Anion gap = ${sodium} − (${chloride} + ${bicarbonate}) = ` +
				`${roundOne(anionGapRaw)} mmol/L (potassium-exclusive; normal 8–12)`
	});

	// ─── Albumin correction ────────────────────────────────────────
	let correctedAnionGapRaw: number | null = null;
	if (present(albumin)) {
		correctedAnionGapRaw = anionGapRaw + ALBUMIN_FACTOR * (REF_ALBUMIN - albumin);
		firedRules.push({
			id: 'R-CORRECTION-01',
			instrument: 'correction',
			band: '',
			category: 'albumin-correction',
			description:
				`Corrected anion gap = ${roundOne(anionGapRaw)} + 0.25 × (40 − ${albumin}) = ` +
				`${roundOne(correctedAnionGapRaw)} mmol/L`
		});
	}

	// ─── Classification ────────────────────────────────────────────
	const classificationValue =
		correctedAnionGapRaw !== null ? correctedAnionGapRaw : anionGapRaw;

	let classification: Classification = 'unknown';
	for (const rule of classificationRules) {
		try {
			if (rule.evaluate(classificationValue, normalLow, normalHigh)) {
				classification = rule.band as Classification;
				firedRules.push({
					id: rule.id,
					instrument: rule.instrument,
					band: rule.band,
					category: rule.category,
					description: rule.description
				});
				break;
			}
		} catch (e) {
			console.warn(`Anion-gap rule ${rule.id} evaluation failed:`, e);
		}
	}

	const snapshot = {
		anionGapRaw,
		correctedAnionGapRaw,
		classificationValue,
		normalLow,
		normalHigh
	};

	return {
		includesPotassium,
		anionGap: roundOne(anionGapRaw),
		anionGapRaw,
		correctedAnionGap: roundOne(correctedAnionGapRaw),
		correctedAnionGapRaw,
		normalLow,
		normalHigh,
		classificationValue,
		classification,
		firedRules,
		flaggedIssues: detectFlaggedIssues(data, snapshot),
		timestamp: new Date().toISOString()
	};
}
