import type {
	EndoscopyRequest,
	GradingResult,
	Recommendation,
	AppropriatenessBand,
	FiredRule
} from './types';
import { gradeAppropriateness } from './appropriateness-rules';
import { gradeTriage } from './triage-rules';
import { gradeCompleteness } from './completeness-rules';
import { gradeRisk } from './risk-rules';
import { detectFlags } from './flagged-issues';

/** Human-readable label for an overall recommendation. */
export const RECOMMENDATION_LABELS: Record<string, string> = {
	accept: 'Accept and book',
	'query-referrer': 'Query the referrer',
	redirect: 'Redirect to a more suitable procedure',
	reject: 'Reject'
};

/**
 * Pure four-axis vetting engine for a GI endoscopy procedure request.
 *
 * Computes:
 * - Axis A: appropriateness 1–9 + band (usually-appropriate / may-be-appropriate
 *   / usually-not-appropriate) by indication × procedure.
 * - Axis B: cancer-pathway urgency / triage tier (routine / urgent /
 *   two-week-wait / emergency) + target timeframe + two-week-wait eligibility.
 * - Axis C: request completeness percent (0–100, weighted).
 * - Axis D: pre-procedure risk (Glasgow-Blatchford + Rockall + BSG/ESGE
 *   anticoagulant stratification) → low / moderate / high band + anticoag action.
 *
 * Plus an overall recommendation, the fired-rule audit trail, and safety flags.
 *
 * Invariant: an acute red-flag (active GI bleeding) auto-escalates the triage
 * tier to emergency; NICE NG12 / DG56 suspected-cancer criteria escalate to
 * two-week-wait, regardless of the requested urgency. The least-alarming band is
 * only chosen when no rule fires.
 *
 * No side effects, no network calls, no I/O.
 */
export function calculateGrade(request: EndoscopyRequest): GradingResult {
	const firedRules: FiredRule[] = [];

	// Axis A — appropriateness.
	const appr = gradeAppropriateness(request);
	firedRules.push(...appr.firedRules);

	// Axis B — cancer-pathway urgency.
	const urgency = gradeTriage(request);
	firedRules.push(...urgency.firedRules);

	// Axis C — completeness.
	const completeness = gradeCompleteness(request);
	firedRules.push(...completeness.firedRules);

	// Axis D — pre-procedure risk.
	const risk = gradeRisk(request);
	firedRules.push(...risk.firedRules);

	const recommendation = deriveRecommendation(
		appr.appropriatenessBand,
		completeness.completenessPercent
	);

	const flags = detectFlags(request, {
		twoWeekWaitEligible: urgency.twoWeekWaitEligible,
		twoWeekWaitRationale: urgency.twoWeekWaitRationale,
		riskBand: risk.riskBand
	});

	return {
		appropriatenessScore: appr.appropriatenessScore,
		appropriatenessBand: appr.appropriatenessBand,
		triageTier: urgency.triageTier,
		targetTimeframe: urgency.targetTimeframe,
		twoWeekWaitEligible: urgency.twoWeekWaitEligible,
		twoWeekWaitRationale: urgency.twoWeekWaitRationale,
		completenessPercent: completeness.completenessPercent,
		glasgowBlatchfordScore: risk.glasgowBlatchfordScore,
		rockallScore: risk.rockallScore,
		riskBand: risk.riskBand,
		anticoagulantAction: risk.anticoagulantAction,
		recommendation,
		recommendationLabel: RECOMMENDATION_LABELS[recommendation] ?? recommendation,
		firedRules,
		flags,
		gradedAt: new Date().toISOString()
	};
}

/**
 * Derive an overall recommendation for the endoscopy vetting desk from the
 * four axes. Least-alarming wins only when nothing escalates.
 */
function deriveRecommendation(
	appropriatenessBand: AppropriatenessBand,
	completenessPercent: number
): Recommendation {
	if (appropriatenessBand === 'usually-not-appropriate') return 'query-referrer';
	if (completenessPercent < 50) return 'query-referrer';
	return 'accept';
}
