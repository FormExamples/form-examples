import type {
	PetScanRequest,
	GradingResult,
	Recommendation,
	AppropriatenessBand,
	PrepSafetyBand,
	FiredRule
} from './types';
import { scoreAppropriateness } from './appropriateness-rules';
import { scorePrepSafety, scoreRadiationDose } from './safety-rules';
import { scoreCompleteness } from './completeness-rules';
import { scoreTriage } from './triage-rules';
import { detectFlags } from './flagged-issues';

/** Overall recommendation display labels. */
export const RECOMMENDATION_LABELS: Record<string, string> = {
	accept: 'Accept and book',
	'query-referrer': 'Query the referrer',
	redirect: 'Redirect to a more suitable scan',
	reject: 'Reject'
};

/**
 * Derive an overall recommendation for the imaging vetting desk from the four
 * axes. Least-alarming wins only when nothing escalates.
 */
export function deriveRecommendation(
	appropriatenessBand: AppropriatenessBand,
	prepSafetyBand: PrepSafetyBand,
	completenessPercent: number
): Recommendation {
	if (prepSafetyBand === 'contraindicated') return 'reject';
	if (appropriatenessBand === 'usually-not-appropriate') return 'query-referrer';
	if (prepSafetyBand === 'caution') return 'query-referrer';
	if (completenessPercent < 50) return 'query-referrer';
	return 'accept';
}

/**
 * Pure four-axis vetting engine for a PET-CT scan request.
 *
 * Computes:
 * - Axis A: appropriateness 1–9 + band (usually / may-be / usually-not).
 * - Axis B: preparation-safety band (ok / caution / contraindicated) and the
 *   relative radiation-dose band (low / moderate / high).
 * - Axis C: request completeness percent (0–100, weighted).
 * - Axis D: triage priority (routine / urgent / emergency) + target timeframe.
 *
 * Plus an overall recommendation, the fired-rule audit trail, and safety flags.
 *
 * Invariant: pregnancy or uncontrolled glucose (an FDG study with blood glucose
 * above ~11 mmol/L) force the caution / contraindicated safety band and raise a
 * flag regardless of appropriateness. No side effects, no network calls, no I/O.
 */
export function calculateGrade(data: PetScanRequest): GradingResult {
	const firedRules: FiredRule[] = [];

	// Axis A — appropriateness.
	const appr = scoreAppropriateness(data.request.primaryIndication, data.request.scanType);
	firedRules.push(...appr.firedRules);

	// Axis B — preparation safety & radiation dose.
	const prep = scorePrepSafety(data);
	firedRules.push(...prep.firedRules);
	const dose = scoreRadiationDose(data.request.scanType);
	firedRules.push(...dose.firedRules);

	// Axis C — completeness.
	const completeness = scoreCompleteness(data);
	firedRules.push(...completeness.firedRules);

	// Axis D — triage.
	const triage = scoreTriage(data);
	firedRules.push(...triage.firedRules);

	const recommendation = deriveRecommendation(appr.band, prep.band, completeness.percent);

	const flags = detectFlags(data, { radiationDoseBand: dose.band });

	return {
		appropriatenessScore: appr.score,
		appropriatenessBand: appr.band,
		prepSafetyBand: prep.band,
		radiationDoseBand: dose.band,
		completenessPercent: completeness.percent,
		triageTier: triage.tier,
		targetTimeframe: triage.targetTimeframe,
		recommendation,
		firedRules,
		flags,
		gradedAt: new Date().toISOString()
	};
}
