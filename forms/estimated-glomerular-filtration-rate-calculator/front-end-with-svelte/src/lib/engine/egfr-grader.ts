import type { AssessmentData, FiredRule, GStage, GradingResult } from './types';
import {
	UMOL_PER_MGDL,
	KAPPA_FEMALE,
	KAPPA_MALE,
	ALPHA_FEMALE,
	ALPHA_MALE,
	MAX_EXPONENT,
	BASE_COEFFICIENT,
	AGE_DECAY_BASE,
	FEMALE_MULTIPLIER,
	stageRules
} from './egfr-rules';
import { detectFlaggedIssues } from './flagged-issues';

/** Round to the nearest whole number (returns null unchanged). */
export function roundWhole(n: number | null): number | null {
	if (n === null || n === undefined || Number.isNaN(n)) return null;
	return Math.round(n);
}

/** Round to three decimal places (returns null unchanged). */
export function roundThree(n: number | null): number | null {
	if (n === null || n === undefined || Number.isNaN(n)) return null;
	return Math.round(n * 1000) / 1000;
}

/**
 * Pure function: compute the CKD-EPI 2021 creatinine eGFR and CKD G-stage for
 * the supplied assessment data.
 *
 * Algorithm (spec §4):
 *   Scr_mgdl = serumCreatinine / 88.42            // µmol/L → mg/dL
 *   κ = sex == 'female' ? 0.7 : 0.9
 *   α = sex == 'female' ? -0.241 : -0.302
 *   ratio = Scr_mgdl / κ
 *   eGFR  = 142
 *         × min(ratio, 1)^α
 *         × max(ratio, 1)^(-1.200)
 *         × 0.9938^ageYears
 *         × (sex == 'female' ? 1.012 : 1.0)
 *
 * The unrounded eGFR drives banding and every flag threshold; the value is
 * rounded to a whole number for display only. When any required input
 * (ageYears, sex, serumCreatinine) is missing, the eGFR is null, there is no
 * stage, and an incomplete-assessment flag is raised.
 */
export function calculateEgfr(data: AssessmentData): GradingResult {
	const scrUmol = data.creatinine.serumCreatinine;
	const ageYears = data.identification.ageYears;
	const sex = data.identification.sex;

	const firedRules: FiredRule[] = [];

	const missing = scrUmol === null || ageYears === null || sex === '';

	if (missing) {
		firedRules.push({
			id: 'R-EQUATION-INCOMPLETE-01',
			instrument: 'equation',
			band: 'unknown',
			category: 'missing-input',
			description: 'eGFR not computed — serum creatinine, age, and/or sex is missing'
		});
		return {
			serumCreatinineMgDl: null,
			egfr: null,
			egfrRaw: null,
			egfrStage: null,
			egfrStageLabel: '',
			firedRules,
			flaggedIssues: detectFlaggedIssues(data, null, null),
			timestamp: new Date().toISOString()
		};
	}

	// ─── µmol/L → mg/dL conversion ──────────────────────────────
	const scrMgdl = scrUmol / UMOL_PER_MGDL;
	firedRules.push({
		id: 'R-CONVERT-01',
		instrument: 'conversion',
		band: 'unknown',
		category: 'conversion',
		description: `Serum creatinine ${scrUmol} µmol/L ÷ 88.42 = ${roundThree(scrMgdl)} mg/dL`
	});

	// ─── CKD-EPI 2021 creatinine equation ───────────────────────
	const isFemale = sex === 'female';
	const kappa = isFemale ? KAPPA_FEMALE : KAPPA_MALE;
	const alpha = isFemale ? ALPHA_FEMALE : ALPHA_MALE;
	const femaleMult = isFemale ? FEMALE_MULTIPLIER : 1.0;
	const ratio = scrMgdl / kappa;

	const egfrRaw =
		BASE_COEFFICIENT *
		Math.pow(Math.min(ratio, 1), alpha) *
		Math.pow(Math.max(ratio, 1), MAX_EXPONENT) *
		Math.pow(AGE_DECAY_BASE, ageYears) *
		femaleMult;

	firedRules.push({
		id: 'R-EQUATION-01',
		instrument: 'equation',
		band: 'unknown',
		category: 'ckd-epi-2021-creatinine',
		description:
			`eGFR = 142 × min(${roundThree(ratio)}, 1)^${alpha} × ` +
			`max(${roundThree(ratio)}, 1)^-1.200 × 0.9938^${ageYears}` +
			`${isFemale ? ' × 1.012' : ''} = ${roundWhole(egfrRaw)} mL/min/1.73 m²`
	});

	// ─── CKD G-stage banding (unrounded eGFR) ───────────────────
	let egfrStage: GStage = null;
	let egfrStageLabel = '';
	for (const rule of stageRules) {
		try {
			if (rule.evaluate(egfrRaw)) {
				egfrStage = rule.band as GStage;
				egfrStageLabel = rule.label;
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
			console.warn(`eGFR staging rule ${rule.id} evaluation failed:`, e);
		}
	}

	return {
		serumCreatinineMgDl: roundThree(scrMgdl),
		egfr: roundWhole(egfrRaw),
		egfrRaw,
		egfrStage,
		egfrStageLabel,
		firedRules,
		flaggedIssues: detectFlaggedIssues(data, egfrRaw, egfrStage),
		timestamp: new Date().toISOString()
	};
}
