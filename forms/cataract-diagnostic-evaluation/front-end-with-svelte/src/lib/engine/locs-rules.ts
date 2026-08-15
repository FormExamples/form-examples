// LOCS III (Lens Opacities Classification System III) grading rules and the
// surgical-candidacy computation.
//
// LOCS III is published by Chylack et al., Arch Ophthalmol 1993, and is a
// continuous four-subscale grading scale read against standard photographs.
// It does not itself define a severity band. The severity band computed here
// is this form's own operational simplification for surgical-candidacy
// triage — see doc/locs-iii-grading.md.
//
// Every function here is pure: same inputs, same outputs, no I/O, no clock.

import type {
	AcuitySection,
	CataractDiagnosticEvaluation,
	FiredRule,
	GlareSection,
	LocsIIISeverity,
	SlitLampSection,
	SurgicalCandidacy
} from './types';
import { num, rule } from './utils';

/** Best-corrected visual acuity, LogMAR, at or better than 6/12. */
export const LOGMAR_6_12 = 0.3;
/** Best-corrected visual acuity, LogMAR, at or worse than 6/18. */
export const LOGMAR_6_18 = 0.48;

/** Severity-band order, worst last, for max-grade comparisons. */
export const SEVERITY_ORDER: LocsIIISeverity[] = ['', 'mild', 'moderate', 'severe'];

/** Surgical-candidacy order, worst last, for max-grade comparisons. */
export const CANDIDACY_ORDER: SurgicalCandidacy[] = [
	'',
	'not-indicated',
	'consider',
	'indicated',
	'urgent-referral'
];

/** Return whichever of two severity bands is worse. */
export function worseSeverity(a: LocsIIISeverity, b: LocsIIISeverity): LocsIIISeverity {
	return SEVERITY_ORDER.indexOf(b) > SEVERITY_ORDER.indexOf(a) ? b : a;
}

/** Return whichever of two surgical-candidacy bands is worse. */
export function worseCandidacy(a: SurgicalCandidacy, b: SurgicalCandidacy): SurgicalCandidacy {
	return CANDIDACY_ORDER.indexOf(b) > CANDIDACY_ORDER.indexOf(a) ? b : a;
}

export interface EyeLocsScores {
	no: number | null;
	nc: number | null;
	c: number | null;
	p: number | null;
}

/**
 * Compute the LOCS III severity band for one eye from its four subscores.
 *
 * `severe`   if any of NO, NC, C, P >= 5.0
 * `moderate` if not severe and any of NO, NC, C, P is 3.0-4.9
 * `mild`     if all four (recorded) subscores are below 3.0
 * `''`       if no subscore is recorded
 */
export function computeLocsIIISeverity(scores: EyeLocsScores): LocsIIISeverity {
	const values = [scores.no, scores.nc, scores.c, scores.p].filter(
		(v): v is number => v !== null
	);
	if (values.length === 0) return '';
	if (values.some((v) => v >= 5.0)) return 'severe';
	if (values.some((v) => v >= 3.0)) return 'moderate';
	return 'mild';
}

/** Extract one eye's four LOCS III subscores from the slit-lamp section. */
export function eyeLocsScores(s: SlitLampSection, eye: 'right' | 'left'): EyeLocsScores {
	if (eye === 'right') {
		return {
			no: num(s.locsIiiNoRight),
			nc: num(s.locsIiiNcRight),
			c: num(s.locsIiiCRight),
			p: num(s.locsIiiPRight)
		};
	}
	return {
		no: num(s.locsIiiNoLeft),
		nc: num(s.locsIiiNcLeft),
		c: num(s.locsIiiCLeft),
		p: num(s.locsIiiPLeft)
	};
}

export interface LocsResult {
	severityRight: LocsIIISeverity;
	severityLeft: LocsIIISeverity;
	firedRules: FiredRule[];
}

/** Compute the LOCS III severity band for both eyes, with an audit trail. */
export function scoreLocsIII(data: CataractDiagnosticEvaluation): LocsResult {
	const firedRules: FiredRule[] = [];
	const right = eyeLocsScores(data.slitLamp, 'right');
	const left = eyeLocsScores(data.slitLamp, 'left');
	const severityRight = computeLocsIIISeverity(right);
	const severityLeft = computeLocsIIISeverity(left);

	if (severityRight) {
		firedRules.push(
			rule(
				`R-LOCS-SEVERITY-RIGHT-${severityRight.toUpperCase()}`,
				'locs-iii',
				'severity-right',
				null,
				severityRight,
				'slit-lamp',
				`Right eye LOCS III severity band is ${severityRight} (NO ${right.no ?? '–'}, NC ${right.nc ?? '–'}, C ${right.c ?? '–'}, P ${right.p ?? '–'}).`
			)
		);
	}
	if (severityLeft) {
		firedRules.push(
			rule(
				`R-LOCS-SEVERITY-LEFT-${severityLeft.toUpperCase()}`,
				'locs-iii',
				'severity-left',
				null,
				severityLeft,
				'slit-lamp',
				`Left eye LOCS III severity band is ${severityLeft} (NO ${left.no ?? '–'}, NC ${left.nc ?? '–'}, C ${left.c ?? '–'}, P ${left.p ?? '–'}).`
			)
		);
	}

	return { severityRight, severityLeft, firedRules };
}

/** Whether best-corrected acuity in either eye is worse than 6/12 (LogMAR > 0.30). */
export function acuityWorseThan6_12(a: AcuitySection): boolean {
	const right = num(a.bestCorrectedVaLogmarRight);
	const left = num(a.bestCorrectedVaLogmarLeft);
	return (right !== null && right > LOGMAR_6_12) || (left !== null && left > LOGMAR_6_12);
}

/** Whether best-corrected acuity in either eye is worse than 6/18 (LogMAR >= 0.48). */
export function acuityWorseThan6_18(a: AcuitySection): boolean {
	const right = num(a.bestCorrectedVaLogmarRight);
	const left = num(a.bestCorrectedVaLogmarLeft);
	return (right !== null && right >= LOGMAR_6_18) || (left !== null && left >= LOGMAR_6_18);
}

/** Whether best-corrected acuity is recorded and 6/12 or better in both eyes. */
export function acuity6_12OrBetterBothEyes(a: AcuitySection): boolean {
	const right = num(a.bestCorrectedVaLogmarRight);
	const left = num(a.bestCorrectedVaLogmarLeft);
	return right !== null && left !== null && right <= LOGMAR_6_12 && left <= LOGMAR_6_12;
}

export interface CandidacyResult {
	candidacy: SurgicalCandidacy;
	firedRules: FiredRule[];
}

/**
 * Compute the surgical-candidacy recommendation from LOCS III severity,
 * best-corrected visual acuity, and glare testing. Evaluated as a max-grade
 * accumulation: later, worse findings always override earlier, milder ones.
 * Safety-flag-driven `urgent-referral` is applied by the caller (grader.ts),
 * which knows about the fired safety flags.
 */
export function computeSurgicalCandidacy(
	severityRight: LocsIIISeverity,
	severityLeft: LocsIIISeverity,
	acuity: AcuitySection,
	glare: GlareSection
): CandidacyResult {
	const firedRules: FiredRule[] = [];
	let candidacy: SurgicalCandidacy = 'not-indicated';

	const moderateEye = severityRight === 'moderate' || severityLeft === 'moderate';
	const severeEye = severityRight === 'severe' || severityLeft === 'severe';
	const worse6_12 = acuityWorseThan6_12(acuity);
	const worse6_18 = acuityWorseThan6_18(acuity);
	const glareSevere = glare.glareFunctionalImpact === 'severe';

	if (moderateEye) {
		candidacy = worseCandidacy(candidacy, 'consider');
		firedRules.push(
			rule('R-CANDIDACY-MODERATE-LOCS', 'composite', 'severity', null, 'consider', 'surgical candidacy',
				'A moderate LOCS III severity band is present in at least one eye.')
		);
	}
	if (worse6_12) {
		candidacy = worseCandidacy(candidacy, 'consider');
		firedRules.push(
			rule('R-CANDIDACY-ACUITY-6-12', 'acuity', 'best-corrected', null, 'consider', 'surgical candidacy',
				'Best-corrected visual acuity is worse than 6/12 in at least one eye.')
		);
	}
	if (severeEye) {
		candidacy = worseCandidacy(candidacy, 'indicated');
		firedRules.push(
			rule('R-CANDIDACY-SEVERE-LOCS', 'composite', 'severity', null, 'indicated', 'surgical candidacy',
				'A severe LOCS III severity band is present in at least one eye.')
		);
	}
	if (worse6_18) {
		candidacy = worseCandidacy(candidacy, 'indicated');
		firedRules.push(
			rule('R-CANDIDACY-ACUITY-6-18', 'acuity', 'best-corrected', null, 'indicated', 'surgical candidacy',
				'Best-corrected visual acuity is worse than 6/18 in at least one eye.')
		);
	}
	if (glareSevere) {
		candidacy = worseCandidacy(candidacy, 'indicated');
		firedRules.push(
			rule('R-CANDIDACY-GLARE-SEVERE', 'glare', 'functional-impact', null, 'indicated', 'surgical candidacy',
				'Glare testing shows a severe functional impact, an independent indication for surgery.')
		);
	}

	return { candidacy, firedRules };
}

/** Functional/quality-of-life composite score, 0-12, or null if unanswered. */
export function computeFunctionalImpactScore(data: CataractDiagnosticEvaluation): number | null {
	const reading = num(data.functional.functionalDifficultyReading);
	const driving = num(data.functional.functionalDifficultyDriving);
	const daily = num(data.functional.functionalDifficultyDailyActivities);
	if (reading === null && driving === null && daily === null) return null;
	return (reading ?? 0) + (driving ?? 0) + (daily ?? 0);
}
