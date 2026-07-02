import type { AssessmentData, FiredRule, GradingResult, PlanStatus } from './types';
import {
	PARKLAND_COEFFICIENT,
	FIRST_PHASE_HOURS,
	SECOND_PHASE_HOURS,
	URINE_LOW_FACTOR,
	URINE_HIGH_FACTOR
} from './parkland-rules';
import { detectFlaggedIssues } from './flagged-issues';

/** Round a number to one decimal place (returns null unchanged). */
export function roundOne(n: number | null): number | null {
	if (n === null || n === undefined || Number.isNaN(n)) return null;
	return Math.round(n * 10) / 10;
}

/** True when a value is a finite number. */
function isNum(n: number | null): n is number {
	return n !== null && n !== undefined && typeof n === 'number' && !Number.isNaN(n);
}

/**
 * Compute the hours elapsed (as a float) between two datetime-local strings,
 * clamped to be non-negative. Returns null when either timestamp is missing or
 * unparseable.
 */
export function computeHoursSinceInjury(injuryAt: string, assessedAt: string): number | null {
	if (!injuryAt || !assessedAt) return null;
	const injury = new Date(injuryAt).getTime();
	const assessed = new Date(assessedAt).getTime();
	if (Number.isNaN(injury) || Number.isNaN(assessed)) return null;
	const hours = (assessed - injury) / 3600000;
	return hours >= 0 ? hours : 0;
}

/**
 * Pure function: compute the full Parkland fluid-resuscitation plan for the
 * supplied assessment data.
 *
 * Algorithm (spec §4):
 *   total24hVolumeMl = (weightKg != null && tbsaPercent != null)
 *                        ? 4 × weightKg × tbsaPercent : null
 *   first8hVolumeMl  = total24hVolumeMl != null ? total24hVolumeMl / 2 : null
 *   next16hVolumeMl  = total24hVolumeMl != null ? total24hVolumeMl / 2 : null
 *
 *   hoursSinceInjury      = (injuryAt != null && assessedAt != null)
 *                             ? max((assessedAt − injuryAt) in hours, 0) : null
 *   remainingFirst8hHours = hoursSinceInjury != null ? max(8 − hoursSinceInjury, 0) : 8
 *
 *   first8hRateMlPerHour  = (first8hVolumeMl != null && remainingFirst8hHours > 0)
 *                             ? first8hVolumeMl / remainingFirst8hHours
 *                             : null   // null when overdue: give outstanding volume now
 *   next16hRateMlPerHour  = next16hVolumeMl != null ? next16hVolumeMl / 16 : null
 *
 *   targetUrineOutputLowMlPerHour  = weightKg != null ? 0.5 × weightKg : null
 *   targetUrineOutputHighMlPerHour = weightKg != null ? 1.0 × weightKg : null
 *
 * The 8h/16h split is measured from the TIME OF INJURY, not from arrival, so the
 * remaining first-phase window shrinks as time passes and the first-phase rate
 * rises accordingly. Missing weight or %TBSA yields null derived volumes; no
 * partial arithmetic is invented.
 */
export function calculateParkland(data: AssessmentData): GradingResult {
	const weightKg = data.weight.weightKg;
	const tbsaPercent = data.burn.tbsaPercent;
	const injuryAt = data.injury.injuryAt;
	const assessedAt = data.context.assessedAt;

	const firedRules: FiredRule[] = [];

	// ─── Base formula and phase split ──────────────────────────────
	let total24hVolumeMl: number | null = null;
	let first8hVolumeMl: number | null = null;
	let next16hVolumeMl: number | null = null;

	if (isNum(weightKg) && isNum(tbsaPercent)) {
		total24hVolumeMl = PARKLAND_COEFFICIENT * weightKg * tbsaPercent;
		first8hVolumeMl = total24hVolumeMl / 2;
		next16hVolumeMl = total24hVolumeMl / 2;
		firedRules.push({
			id: 'R-TOTAL-VOLUME-01',
			instrument: 'formula',
			band: 'resuscitation',
			category: 'total-volume',
			description:
				`Total 24 h volume = 4 × ${weightKg} kg × ${tbsaPercent}% = ` +
				`${roundOne(total24hVolumeMl)} mL crystalloid`
		});
		firedRules.push({
			id: 'R-PHASE-SPLIT-01',
			instrument: 'phase-split',
			band: 'resuscitation',
			category: 'phase-split',
			description:
				`Half (${roundOne(first8hVolumeMl)} mL) in the first 8 h from injury; ` +
				`half (${roundOne(next16hVolumeMl)} mL) over the next 16 h`
		});
	} else {
		firedRules.push({
			id: 'R-TOTAL-VOLUME-INCOMPLETE-01',
			instrument: 'formula',
			band: 'unknown',
			category: 'missing-input',
			description: 'Total volume not computed — body weight and/or %TBSA is missing'
		});
	}

	// ─── Time-since-injury offset ──────────────────────────────────
	const hoursSinceInjury = computeHoursSinceInjury(injuryAt, assessedAt);
	const remainingFirst8hHours =
		hoursSinceInjury !== null ? Math.max(FIRST_PHASE_HOURS - hoursSinceInjury, 0) : FIRST_PHASE_HOURS;

	if (hoursSinceInjury !== null) {
		firedRules.push({
			id: 'R-OFFSET-01',
			instrument: 'offset',
			band: remainingFirst8hHours > 0 ? 'resuscitation' : 'overdue',
			category: 'time-offset',
			description:
				`${roundOne(hoursSinceInjury)} h elapsed since injury; ` +
				`${roundOne(remainingFirst8hHours)} h of the first-8-h window remain`
		});
	}

	// ─── Infusion rates ────────────────────────────────────────────
	let first8hRateMlPerHour: number | null = null;
	if (first8hVolumeMl !== null && remainingFirst8hHours > 0) {
		first8hRateMlPerHour = first8hVolumeMl / remainingFirst8hHours;
	}
	const next16hRateMlPerHour =
		next16hVolumeMl !== null ? next16hVolumeMl / SECOND_PHASE_HOURS : null;

	if (first8hVolumeMl !== null && remainingFirst8hHours <= 0) {
		firedRules.push({
			id: 'R-OVERDUE-01',
			instrument: 'offset',
			band: 'overdue',
			category: 'overdue',
			description:
				'First-8-h window from injury has elapsed — give the outstanding ' +
				'first-phase volume as a priority and re-plan against the 24 h total'
		});
	}

	// ─── Urine-output titration target ─────────────────────────────
	const targetUrineOutputLowMlPerHour = isNum(weightKg) ? URINE_LOW_FACTOR * weightKg : null;
	const targetUrineOutputHighMlPerHour = isNum(weightKg) ? URINE_HIGH_FACTOR * weightKg : null;

	if (isNum(weightKg)) {
		firedRules.push({
			id: 'R-TITRATION-01',
			instrument: 'titration',
			band: 'resuscitation',
			category: 'urine-output',
			description:
				`Titrate to a urine output of ${roundOne(targetUrineOutputLowMlPerHour)}` +
				`-${roundOne(targetUrineOutputHighMlPerHour)} mL/h (0.5-1.0 mL/kg/h)`
		});
	}

	// ─── Overall plan status ───────────────────────────────────────
	let status: PlanStatus;
	if (total24hVolumeMl === null) {
		status = 'incomplete';
	} else if (remainingFirst8hHours <= 0 && hoursSinceInjury !== null) {
		status = 'overdue';
	} else {
		status = 'planned';
	}

	return {
		total24hVolumeMl,
		first8hVolumeMl,
		next16hVolumeMl,
		hoursSinceInjury,
		remainingFirst8hHours,
		first8hRateMlPerHour,
		next16hRateMlPerHour,
		targetUrineOutputLowMlPerHour,
		targetUrineOutputHighMlPerHour,
		status,
		firedRules,
		flaggedIssues: detectFlaggedIssues(data, { total24hVolumeMl, hoursSinceInjury }),
		timestamp: new Date().toISOString()
	};
}
