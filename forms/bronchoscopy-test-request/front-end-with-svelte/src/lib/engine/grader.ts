import type {
	BronchoscopyRequest,
	GradingResult,
	Recommendation,
	AppropriatenessBand,
	FiredRule
} from './types';
import { gradeAppropriateness } from './appropriateness-rules';
import { gradeUrgency } from './urgency-rules';
import { gradeCompleteness } from './completeness-rules';
import { gradeRisk } from './risk-rules';
import { detectFlags } from './flagged-issues';

/**
 * Pure four-axis vetting engine for a bronchoscopy request.
 *
 * Computes:
 * - Axis A: appropriateness (BTS bronchoscopy + indication match, 1–9 ordinal
 *   score + band).
 * - Axis B: cancer-pathway urgency (NICE NG12 triage tier + target timeframe +
 *   two-week-wait eligibility).
 * - Axis C: request completeness percent (0–100, weighted).
 * - Axis D: pre-procedure risk band (low / moderate / high) + the recommended
 *   anticoagulant action.
 *
 * Plus an overall recommendation, the fired-rule audit trail, and safety flags.
 *
 * Invariant: massive haemoptysis or haemodynamic instability auto-escalates the
 * triage tier to emergency regardless of the other axes. No side effects, no
 * network calls, no I/O.
 */
export function calculateGrade(request: BronchoscopyRequest): GradingResult {
	const firedRules: FiredRule[] = [];

	// Axis A — appropriateness.
	const a = gradeAppropriateness(request);
	firedRules.push(...a.firedRules);

	// Axis B — cancer-pathway urgency.
	const b = gradeUrgency(request);
	firedRules.push(...b.firedRules);

	// Axis C — completeness.
	const c = gradeCompleteness(request);
	firedRules.push(...c.firedRules);

	// Axis D — pre-procedure risk.
	const d = gradeRisk(request);
	firedRules.push(...d.firedRules);

	const recommendation = deriveRecommendation(a.appropriatenessBand, c.completenessPercent);

	const flags = detectFlags(request, { twoWeekWaitEligible: b.twoWeekWaitEligible });

	return {
		appropriatenessScore: a.appropriatenessScore,
		appropriatenessBand: a.appropriatenessBand,
		triageTier: b.triageTier,
		targetTimeframe: b.targetTimeframe,
		twoWeekWaitEligible: b.twoWeekWaitEligible,
		completenessPercent: c.completenessPercent,
		riskBand: d.riskBand,
		anticoagulantAction: d.anticoagulantAction,
		recommendation,
		firedRules,
		flags,
		gradedAt: new Date().toISOString()
	};
}

/**
 * Derives the overall recommendation for the bronchoscopy vetting desk from the
 * graded axes. Least-alarming wins only when nothing escalates.
 *
 * - query-referrer: the request is usually not appropriate, or it is materially
 *   incomplete (< 50%).
 * - accept: an appropriate, sufficiently complete request.
 */
export function deriveRecommendation(
	appropriatenessBand: AppropriatenessBand,
	completenessPercent: number
): Recommendation {
	if (appropriatenessBand === 'usually-not-appropriate') return 'query-referrer';
	if (completenessPercent < 50) return 'query-referrer';
	return 'accept';
}
