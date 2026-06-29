// ──────────────────────────────────────────────
// Four-axis grader for the CT Scan Test Request.
//
// Composes the rule sets (appropriateness / safety / completeness / triage) and
// the safety flags into a single pure, deterministic grading result. The public
// entry point is `calculateGrade(data)`. The output shape and rule / flag IDs
// are identical across every front-end and the back-end, and map onto the
// ct_scan_test_request_grade SQL columns.
// ──────────────────────────────────────────────

import type {
	AppropriatenessBand,
	ContrastSafetyBand,
	CtScanRequest,
	FiredRule,
	GradingResult,
	Recommendation
} from './types';
import { gradeAppropriateness } from './appropriateness-rules';
import { evaluateContrastSafety, evaluateDose } from './safety-rules';
import { gradeCompleteness } from './completeness-rules';
import { gradeTriage } from './triage-rules';
import { detectFlags } from './flagged-issues';

/**
 * Derive an overall recommendation for the imaging vetting desk from the four
 * axes. Least-alarming wins only when nothing escalates.
 */
export function deriveRecommendation(
	apprBand: AppropriatenessBand,
	contrastSafetyBand: ContrastSafetyBand,
	completenessPercent: number
): Recommendation {
	if (contrastSafetyBand === 'contraindicated') return 'redirect';
	if (apprBand === 'usually-not-appropriate') return 'query-referrer';
	if (completenessPercent < 50) return 'query-referrer';
	return 'accept';
}

/**
 * Pure four-axis vetting engine for a CT scan request. No side effects, no
 * network calls, no I/O.
 *
 * Computes:
 * - Axis A: appropriateness (1–9 ordinal + band).
 * - Axis B: radiation & contrast safety (contrast band + dose band + renal-risk).
 * - Axis C: request completeness percent (0–100, weighted).
 * - Axis D: triage priority (routine / urgent / emergency) + target timeframe.
 *
 * Plus an overall recommendation, the fired-rule audit trail, and safety flags.
 */
export function calculateGrade(data: CtScanRequest): GradingResult {
	const firedRules: FiredRule[] = [];

	// Axis A — appropriateness.
	const appr = gradeAppropriateness(data.request.primaryIndication, data.request.bodyRegion);
	firedRules.push(...appr.firedRules);

	// Axis B — radiation & contrast safety.
	const dose = evaluateDose(data.request.bodyRegion);
	firedRules.push(...dose.firedRules);
	const contrast = evaluateContrastSafety(data.contrast);
	firedRules.push(...contrast.firedRules);

	// Axis C — completeness.
	const completeness = gradeCompleteness(data);
	firedRules.push(...completeness.firedRules);

	// Axis D — triage.
	const triage = gradeTriage(data);
	firedRules.push(...triage.firedRules);

	const recommendation = deriveRecommendation(
		appr.appropriatenessBand,
		contrast.contrastSafetyBand,
		completeness.completenessPercent
	);

	const flags = detectFlags(data, {
		estimatedDoseBand: dose.estimatedDoseBand,
		contrastSafetyBand: contrast.contrastSafetyBand,
		renalRisk: contrast.renalRisk
	});

	return {
		appropriatenessScore: appr.appropriatenessScore,
		appropriatenessBand: appr.appropriatenessBand,
		contrastSafetyBand: contrast.contrastSafetyBand,
		estimatedDoseBand: dose.estimatedDoseBand,
		renalRisk: contrast.renalRisk,
		completenessPercent: completeness.completenessPercent,
		triageTier: triage.triageTier,
		targetTimeframe: triage.targetTimeframe,
		recommendation,
		firedRules,
		flags,
		gradedAt: new Date().toISOString()
	};
}
