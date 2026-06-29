// ──────────────────────────────────────────────
// Axis B — Radiation & contrast safety (RCR iRefer / ESUR + IR(ME)R)
//
// Two derived bands plus a renal-risk flag:
//   - contrastSafetyBand: safe / caution / contraindicated
//   - estimatedDoseBand:  low / moderate / high (by body region)
//   - renalRisk:          eGFR-driven CIN risk for IV iodinated contrast
// Rule IDs are stable and identical across every front-end and the back-end
// (R-SAFETY-*). Ported verbatim from the source-of-truth HTML engine.
// ──────────────────────────────────────────────

import type {
	BodyRegion,
	ContrastSafetyBand,
	ContrastSection,
	DoseBand,
	FiredRule
} from './types';
import { usesIvContrast } from './utils';

/** ESUR thresholds for IV iodinated contrast nephropathy risk. */
export const EGFR_CONTRAINDICATED = 30; // eGFR < 30 → high CIN risk
export const EGFR_CAUTION = 45; // eGFR 30–44 → caution

/** Estimated effective-dose band per body region (illustrative, from index.md). */
const DOSE_BY_REGION: Record<string, DoseBand> = {
	head: 'low',
	neck: 'low',
	spine: 'moderate',
	chest: 'moderate',
	'ct-angiogram': 'moderate',
	extremity: 'low',
	abdomen: 'moderate',
	pelvis: 'moderate',
	'abdomen-pelvis': 'high',
	'ct-colonography': 'high',
	'whole-body': 'high'
};

/** The result of estimating Axis B radiation dose. */
export interface DoseResult {
	estimatedDoseBand: DoseBand;
	firedRules: FiredRule[];
}

/** The result of grading Axis B contrast safety. */
export interface ContrastSafetyResult {
	contrastSafetyBand: ContrastSafetyBand;
	renalRisk: boolean;
	firedRules: FiredRule[];
}

/** Estimate the radiation-dose band for the requested body region. */
export function evaluateDose(bodyRegion: BodyRegion): DoseResult {
	if (!bodyRegion) {
		return {
			estimatedDoseBand: '',
			firedRules: [
				{
					ruleId: 'R-SAFETY-DOSE-UNKNOWN',
					axis: 'safety',
					category: 'radiation-dose',
					description: 'Body region not yet specified — radiation dose not estimated.'
				}
			]
		};
	}
	const band: DoseBand = DOSE_BY_REGION[bodyRegion] ?? 'moderate';
	const regionKey = bodyRegion.toUpperCase().replace(/[^A-Z]+/g, '-');
	return {
		estimatedDoseBand: band,
		firedRules: [
			{
				ruleId: `R-SAFETY-DOSE-${regionKey}`,
				axis: 'safety',
				category: 'radiation-dose',
				description: `Estimated radiation dose for CT ${bodyRegion} is ${band}.`
			}
		]
	};
}

/** Evaluate contrast safety and renal risk for the requested study. */
export function evaluateContrastSafety(contrast: ContrastSection): ContrastSafetyResult {
	const firedRules: FiredRule[] = [];
	const iv = usesIvContrast(contrast.contrastRequired);
	const egfr = contrast.egfr;
	let band: ContrastSafetyBand = 'safe';
	let renalRisk = false;

	// Severe iodinated-contrast allergy / prior severe reaction.
	if (iv && (contrast.iodineContrastAllergy === true || contrast.previousContrastReaction === 'severe')) {
		band = 'contraindicated';
		firedRules.push({
			ruleId: 'R-SAFETY-CONTRAST-ALLERGY',
			axis: 'safety',
			category: 'contrast-allergy',
			description:
				'Known iodinated-contrast allergy or previous severe reaction with IV contrast requested.'
		});
	}

	// Renal function for IV iodinated contrast (ESUR thresholds).
	if (iv && egfr !== null && egfr !== undefined) {
		const e = Number(egfr);
		if (!Number.isNaN(e)) {
			if (e < EGFR_CONTRAINDICATED) {
				renalRisk = true;
				if (band !== 'contraindicated') band = 'contraindicated';
				firedRules.push({
					ruleId: 'R-SAFETY-EGFR-LOW',
					axis: 'safety',
					category: 'renal-impairment',
					description: `eGFR ${e} mL/min/1.73m2 is below 30 — high contrast-induced nephropathy risk.`
				});
			} else if (e < EGFR_CAUTION) {
				renalRisk = true;
				if (band === 'safe') band = 'caution';
				firedRules.push({
					ruleId: 'R-SAFETY-EGFR-BORDERLINE',
					axis: 'safety',
					category: 'renal-impairment',
					description: `eGFR ${e} mL/min/1.73m2 is 30-44 — caution; consider hydration / nephrology advice.`
				});
			}
		}
	}

	// IV contrast requested but no eGFR recorded → caution.
	if (iv && (egfr === null || egfr === undefined) && band === 'safe') {
		band = 'caution';
		firedRules.push({
			ruleId: 'R-SAFETY-EGFR-MISSING',
			axis: 'safety',
			category: 'renal-impairment',
			description: 'IV iodinated contrast requested but no eGFR recorded — obtain renal function first.'
		});
	}

	// Moderate prior reaction → caution.
	if (iv && contrast.previousContrastReaction === 'moderate' && band === 'safe') {
		band = 'caution';
		firedRules.push({
			ruleId: 'R-SAFETY-PRIOR-REACTION',
			axis: 'safety',
			category: 'contrast-allergy',
			description: 'Previous moderate contrast reaction — premedication / specialist review advised.'
		});
	}

	// Metformin interaction at reduced eGFR.
	if (iv && contrast.metformin === true) {
		const e = egfr === null || egfr === undefined ? null : Number(egfr);
		if (e !== null && !Number.isNaN(e) && e < EGFR_CAUTION) {
			firedRules.push({
				ruleId: 'R-SAFETY-METFORMIN',
				axis: 'safety',
				category: 'metformin-contrast',
				description: 'Patient on metformin with eGFR < 45 — withhold metformin around IV contrast.'
			});
		}
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-SAFETY-CONTRAST-OK',
			axis: 'safety',
			category: 'contrast-safety',
			description: iv
				? 'No contrast-safety concerns identified for the requested IV contrast study.'
				: 'No intravascular iodinated contrast requested.'
		});
	}

	return { contrastSafetyBand: band, renalRisk, firedRules };
}
