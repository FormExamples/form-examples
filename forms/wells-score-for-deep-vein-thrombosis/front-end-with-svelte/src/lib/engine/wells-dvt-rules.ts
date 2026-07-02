import type { WellsRule } from './types';

/**
 * Declarative Wells DVT grading rules.
 *
 * The Wells DVT instrument has nine clinical criteria — each worth +1 when
 * present — plus a single adjustment worth −2 when an alternative diagnosis is
 * judged at least as likely as DVT. Each rule evaluates the patient data and
 * returns true when its criterion is positive (its yes/no input is 'yes'); the
 * grader (`wells-dvt-grader.ts`) sums the points into the total Wells score
 * (−2..9) and derives the two-level and three-level bands. Rows mirror the
 * `wells_score_for_deep_vein_thrombosis_grade_rule` SQL table.
 */
export const wellsRules: WellsRule[] = [
	// ─── CRITERION 1: ACTIVE CANCER ───────────────────────────────
	{
		id: 'R-ACTIVE-CANCER-01',
		criterion: 'active-cancer',
		points: 1,
		category: 'wells-criterion',
		description:
			'Active cancer — treatment ongoing, within the previous 6 months, or palliative',
		evaluate: (d) => d.predisposing.activeCancer === 'yes'
	},

	// ─── CRITERION 2: PARALYSIS / IMMOBILISATION ──────────────────
	{
		id: 'R-PARALYSIS-IMMOBILISATION-01',
		criterion: 'paralysis-or-immobilisation',
		points: 1,
		category: 'wells-criterion',
		description:
			'Paralysis, paresis, or recent plaster immobilisation of the lower extremities',
		evaluate: (d) => d.predisposing.paralysisOrImmobilisation === 'yes'
	},

	// ─── CRITERION 3: BEDRIDDEN / MAJOR SURGERY ───────────────────
	{
		id: 'R-BEDRIDDEN-OR-SURGERY-01',
		criterion: 'recently-bedridden-or-surgery',
		points: 1,
		category: 'wells-criterion',
		description:
			'Recently bedridden >= 3 days, or major surgery within the previous 12 weeks requiring general or regional anaesthesia',
		evaluate: (d) => d.predisposing.recentlyBedriddenOrSurgery === 'yes'
	},

	// ─── CRITERION 4: LOCALISED TENDERNESS ────────────────────────
	{
		id: 'R-LOCALISED-TENDERNESS-01',
		criterion: 'localised-tenderness',
		points: 1,
		category: 'wells-criterion',
		description: 'Localised tenderness along the distribution of the deep venous system',
		evaluate: (d) => d.examination.localisedTenderness === 'yes'
	},

	// ─── CRITERION 5: ENTIRE LEG SWOLLEN ──────────────────────────
	{
		id: 'R-ENTIRE-LEG-SWOLLEN-01',
		criterion: 'entire-leg-swollen',
		points: 1,
		category: 'wells-criterion',
		description: 'Entire leg swollen',
		evaluate: (d) => d.examination.entireLegSwollen === 'yes'
	},

	// ─── CRITERION 6: CALF SWELLING >= 3 CM ───────────────────────
	{
		id: 'R-CALF-SWELLING-OVER-3CM-01',
		criterion: 'calf-swelling-over-3cm',
		points: 1,
		category: 'wells-criterion',
		description:
			'Calf swelling >= 3 cm larger than the asymptomatic side (measured 10 cm below the tibial tuberosity)',
		evaluate: (d) => d.examination.calfSwellingOver3cm === 'yes'
	},

	// ─── CRITERION 7: PITTING OEDEMA ──────────────────────────────
	{
		id: 'R-PITTING-OEDEMA-01',
		criterion: 'pitting-oedema',
		points: 1,
		category: 'wells-criterion',
		description: 'Pitting oedema confined to the symptomatic leg',
		evaluate: (d) => d.examination.pittingOedema === 'yes'
	},

	// ─── CRITERION 8: COLLATERAL SUPERFICIAL VEINS ────────────────
	{
		id: 'R-COLLATERAL-SUPERFICIAL-VEINS-01',
		criterion: 'collateral-superficial-veins',
		points: 1,
		category: 'wells-criterion',
		description: 'Collateral superficial veins (non-varicose)',
		evaluate: (d) => d.examination.collateralSuperficialVeins === 'yes'
	},

	// ─── CRITERION 9: PREVIOUSLY DOCUMENTED DVT ───────────────────
	{
		id: 'R-PREVIOUSLY-DOCUMENTED-DVT-01',
		criterion: 'previously-documented-dvt',
		points: 1,
		category: 'wells-criterion',
		description: 'Previously documented DVT',
		evaluate: (d) => d.predisposing.previouslyDocumentedDvt === 'yes'
	},

	// ─── ADJUSTMENT: ALTERNATIVE DIAGNOSIS AT LEAST AS LIKELY ──────
	{
		id: 'R-ALTERNATIVE-DIAGNOSIS-01',
		criterion: 'alternative-diagnosis-as-likely',
		points: -2,
		category: 'wells-adjustment',
		description: 'An alternative diagnosis is at least as likely as DVT (−2)',
		evaluate: (d) => d.alternative.alternativeDiagnosisAsLikely === 'yes'
	}
];
