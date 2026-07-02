import type { AssessmentData, FiredRule, GradingResult, MeldVariant, MortalityBand } from './types';
import {
	COEF_BILIRUBIN,
	COEF_INR,
	COEF_CREATININE,
	CONSTANT,
	LOWER_BOUND,
	CREATININE_CAP,
	DIALYSIS_CREATININE,
	BILIRUBIN_UMOL_DIVISOR,
	CREATININE_UMOL_DIVISOR,
	SODIUM_LOW,
	SODIUM_HIGH,
	SODIUM_GATE,
	SCORE_MIN,
	SCORE_MAX,
	MELD3_CREATININE_CAP,
	MELD3_ALBUMIN_LOW,
	MELD3_ALBUMIN_HIGH,
	bandRules
} from './meld-rules';
import { detectFlaggedIssues } from './flagged-issues';

/** Present numeric predicate. */
export function isNum(n: number | null | undefined): n is number {
	return n !== null && n !== undefined && !Number.isNaN(Number(n));
}

/** Round to n decimal places (returns null unchanged). */
export function roundTo(n: number | null, dp: number): number | null {
	if (n === null || n === undefined || Number.isNaN(n)) return null;
	const f = Math.pow(10, dp);
	return Math.round(n * f) / f;
}

/** Clamp helper. */
export function clamp(n: number, lo: number, hi: number): number {
	return Math.min(Math.max(n, lo), hi);
}

/**
 * Which laboratory inputs does the chosen variant require? Returns a
 * human-readable list of missing inputs ([] when complete).
 */
export function missingInputs(
	variant: MeldVariant,
	v: {
		bili: number | null;
		inr: number | null;
		creat: number | null;
		sodium: number | null;
		albumin: number | null;
	}
): string[] {
	const missing: string[] = [];
	if (variant === '') missing.push('MELD variant');
	if (!isNum(v.bili)) missing.push('total bilirubin');
	if (!isNum(v.inr)) missing.push('INR');
	if (!isNum(v.creat)) missing.push('serum creatinine');
	if ((variant === 'meld-na' || variant === 'meld-3') && !isNum(v.sodium)) {
		missing.push('serum sodium');
	}
	if (variant === 'meld-3' && !isNum(v.albumin)) missing.push('serum albumin');
	return missing;
}

/** Map a final clamped score to its mortality band, recording the audit row. */
function classifyBand(
	score: number,
	firedRules: FiredRule[]
): { band: MortalityBand; percent: number | null } {
	for (const rule of bandRules) {
		if (rule.evaluate(score)) {
			firedRules.push({
				id: rule.id,
				instrument: rule.instrument,
				band: rule.band,
				category: rule.category,
				description: rule.description
			});
			return { band: rule.band, percent: rule.percent };
		}
	}
	return { band: '', percent: null };
}

/**
 * Pure function: compute the full MELD grade for the supplied assessment data.
 *
 * Algorithm (spec §4):
 *   Step 1 — unit conversion (umol/L -> mg/dL)
 *   Step 2 — dialysis rule (≥ 2 sessions OR CVVHD → creatinine 4.0)
 *   Step 3 — bounds (floor bili/INR/creat to 1.0; cap creatinine to 4.0)
 *   Step 4 — base MELD = round(3.78·ln(b) + 11.2·ln(i) + 9.57·ln(c) + 6.43)
 *   Step 5 — MELD-Na sodium correction (sodium clamped 125–137, when meld > 11)
 *   Step 6 — MELD 3.0 variant (sex + albumin; creatinine cap 3.0)
 *   Step 7 — clamp to 6–40
 *   Step 8 — map to a mortality band
 *
 * A missing lab input required by the chosen variant leaves meldScore = null,
 * mortalityBand = '' and raises an incomplete-assessment audit row.
 */
export function calculateMeld(data: AssessmentData): GradingResult {
	const variant = data.context.meldVariant || '';
	const bili = data.bilirubin.bilirubin;
	const biliUnit = data.bilirubin.bilirubinUnit;
	const inr = data.inr.inr;
	const creat = data.renal.creatinine;
	const creatUnit = data.renal.creatinineUnit;
	const dialysisSessions = data.renal.dialysisSessionsPastWeek;
	const cvvhd = data.renal.cvvhd24h;
	const sodium = data.sodium.sodium;
	const albumin = data.albumin.albumin;

	const firedRules: FiredRule[] = [];

	const result: GradingResult = {
		bilirubinMgDl: null,
		creatinineMgDl: null,
		creatinineAdjusted: null,
		dialysisRuleApplied: false,
		meldScore: null,
		mortalityBand: '',
		estimatedMortalityPercent: null,
		firedRules,
		flaggedIssues: [],
		timestamp: new Date().toISOString()
	};

	// ─── Step 1 — unit conversion ──────────────────────────────────
	const bilirubinMgDl = isNum(bili)
		? biliUnit === 'umol/L'
			? Number(bili) / BILIRUBIN_UMOL_DIVISOR
			: Number(bili)
		: null;
	const creatinineMgDl = isNum(creat)
		? creatUnit === 'umol/L'
			? Number(creat) / CREATININE_UMOL_DIVISOR
			: Number(creat)
		: null;

	result.bilirubinMgDl = roundTo(bilirubinMgDl, 2);
	result.creatinineMgDl = roundTo(creatinineMgDl, 2);

	// ─── Step 2 — dialysis rule ────────────────────────────────────
	const dialysisRuleApplied =
		(isNum(dialysisSessions) && Number(dialysisSessions) >= 2) || cvvhd === 'yes';
	result.dialysisRuleApplied = dialysisRuleApplied;

	// ─── Missing-input gate ────────────────────────────────────────
	const missing = missingInputs(variant, { bili, inr, creat, sodium, albumin });
	if (missing.length > 0) {
		firedRules.push({
			id: 'R-INCOMPLETE-01',
			instrument: 'formula',
			band: '',
			category: 'missing-input',
			description: `Score not computed — missing input(s): ${missing.join(', ')}`
		});
		result.flaggedIssues = detectFlaggedIssues(data, result);
		return result;
	}

	const creatinineAdjusted = dialysisRuleApplied
		? DIALYSIS_CREATININE
		: (creatinineMgDl as number);
	result.creatinineAdjusted = roundTo(creatinineAdjusted, 2);

	if (dialysisRuleApplied) {
		firedRules.push({
			id: 'R-DIALYSIS-01',
			instrument: 'dialysis',
			band: '',
			category: 'dialysis-rule',
			description:
				'Dialysis rule applied — creatinine set to 4.0 mg/dL ' +
				'(≥ 2 haemodialysis sessions or ≥ 24 h CVVHD in the past 7 days)'
		});
	}

	let meld: number;

	if (variant === 'meld-3') {
		// ─── Step 6 — MELD 3.0 (Kim et al. 2021) ─────────────────────
		// Creatinine capped at 3.0; albumin clamped 1.5–3.5; sodium clamped
		// 125–137; bilirubin/INR/creatinine floored to 1.0.
		const b = Math.max(bilirubinMgDl as number, LOWER_BOUND);
		const i = Math.max(Number(inr), LOWER_BOUND);
		const cRaw = dialysisRuleApplied ? MELD3_CREATININE_CAP : (creatinineMgDl as number);
		const c = clamp(cRaw, LOWER_BOUND, MELD3_CREATININE_CAP);
		const na = clamp(Number(sodium), SODIUM_LOW, SODIUM_HIGH);
		const alb = clamp(Number(albumin), MELD3_ALBUMIN_LOW, MELD3_ALBUMIN_HIGH);
		const female = data.identification.sex === 'female' ? 1 : 0;

		meld =
			1.33 * female +
			4.56 * Math.log(b) +
			0.82 * (137 - na) -
			0.24 * (137 - na) * Math.log(b) +
			9.09 * Math.log(i) +
			11.14 * Math.log(c) +
			1.85 * (3.5 - alb) -
			1.83 * (3.5 - alb) * Math.log(c) +
			6;
		meld = Math.round(meld);

		firedRules.push({
			id: 'R-FORMULA-MELD3-01',
			instrument: 'formula',
			band: '',
			category: 'meld-3',
			description: `MELD 3.0 = ${meld} (sex, bilirubin, INR, creatinine, sodium, albumin)`
		});
	} else {
		// ─── Steps 3–4 — bounds and base MELD ────────────────────────
		const b = Math.max(bilirubinMgDl as number, LOWER_BOUND);
		const i = Math.max(Number(inr), LOWER_BOUND);
		const c = clamp(creatinineAdjusted, LOWER_BOUND, CREATININE_CAP);

		meld = Math.round(
			COEF_BILIRUBIN * Math.log(b) +
				COEF_INR * Math.log(i) +
				COEF_CREATININE * Math.log(c) +
				CONSTANT
		);

		firedRules.push({
			id: 'R-FORMULA-MELD-01',
			instrument: 'formula',
			band: '',
			category: 'base-meld',
			description:
				`Base MELD = round(3.78·ln(${roundTo(b, 2)}) + 11.2·ln(${roundTo(i, 2)}) + ` +
				`9.57·ln(${roundTo(c, 2)}) + 6.43) = ${meld}`
		});

		// ─── Step 5 — sodium correction (MELD-Na), when base MELD > 11 ─
		if (variant === 'meld-na' && meld > SODIUM_GATE) {
			const na = clamp(Number(sodium), SODIUM_LOW, SODIUM_HIGH);
			const meldNa = meld + 1.32 * (137 - na) - 0.033 * meld * (137 - na);
			const corrected = Math.round(meldNa);
			firedRules.push({
				id: 'R-SODIUM-CORRECTION-01',
				instrument: 'formula',
				band: '',
				category: 'sodium-correction',
				description: `MELD-Na correction (Na=${roundTo(na, 1)} mEq/L): ${meld} → ${corrected}`
			});
			meld = corrected;
		}
	}

	// ─── Step 7 — clamp to 6–40 ────────────────────────────────────
	const meldScore = clamp(meld, SCORE_MIN, SCORE_MAX);
	result.meldScore = meldScore;

	// ─── Step 8 — mortality band ───────────────────────────────────
	const { band, percent } = classifyBand(meldScore, firedRules);
	result.mortalityBand = band;
	result.estimatedMortalityPercent = percent;

	result.flaggedIssues = detectFlaggedIssues(data, result);
	return result;
}
