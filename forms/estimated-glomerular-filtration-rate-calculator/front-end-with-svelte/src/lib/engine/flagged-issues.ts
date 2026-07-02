import type { AssessmentData, FlaggedIssue, GStage } from './types';
import { G1_MIN, G2_MIN, G3A_MIN, BOUNDARY_MARGIN } from './egfr-rules';

/**
 * Detect clinician-facing safety flags (red flags), using the unrounded eGFR
 * and the assessment inputs (spec §5):
 *
 *   - Kidney failure / nephrology referral (high)    — egfrStage === 'G5' (< 15)
 *   - Severely decreased / nephrology referral (high)— egfrStage === 'G4' (15–29)
 *   - Drug-dosing review (high)                      — egfr < 60 (G3a or worse)
 *   - Possible acute drop / AKI (high)               — steadyState === 'no'
 *   - Reduced function (medium)                      — egfrStage in {G3a, G3b}
 *   - Confirm CKD near threshold (low)               — G2/G3a near a band boundary
 *   - Incomplete assessment (low)                    — a required input missing
 *
 * Rows mirror the `estimated_glomerular_filtration_rate_calculator_grade_flag`
 * SQL table (flag_id, category, priority, description, suggested_action).
 */
export function detectFlaggedIssues(
	data: AssessmentData,
	egfr: number | null,
	egfrStage: GStage
): FlaggedIssue[] {
	const flags: FlaggedIssue[] = [];

	const scr = data.creatinine.serumCreatinine;
	const ageYears = data.identification.ageYears;
	const sex = data.identification.sex;
	const steadyState = data.creatinine.steadyState;

	// ─── Possible acute drop / AKI (HIGH) — independent of a computed eGFR ──
	if (steadyState === 'no') {
		flags.push({
			id: 'F-ACUTE-DROP-AKI-001',
			category: 'acute-drop-aki',
			priority: 'high',
			description:
				'Renal function is not at steady state — eGFR assumes steady state and may be unreliable, and a rising creatinine may reflect acute kidney injury',
			suggestedAction:
				'Do not stage on this value; repeat the creatinine, compare with the baseline, and consider the AKI pathway.'
		});
	}

	// ─── Incomplete assessment (LOW) ────────────────────────────
	if (egfr === null || egfr === undefined || egfrStage === null) {
		const missing: string[] = [];
		if (scr === null || scr === undefined) missing.push('serum creatinine');
		if (ageYears === null || ageYears === undefined) missing.push('age');
		if (sex === '') missing.push('sex');
		flags.push({
			id: 'F-INCOMPLETE-001',
			category: 'incomplete',
			priority: 'low',
			description: `Missing input(s): ${missing.join(', ')} — no eGFR can be computed`,
			suggestedAction: 'Record the serum creatinine, age, and sex, then re-calculate.'
		});
		// No stage-dependent flags when the eGFR is not available.
		return sortByPriority(flags);
	}

	const shown = `${Math.round(egfr)} mL/min/1.73 m²`;

	// ─── Kidney failure — nephrology referral (HIGH) ────────────
	if (egfrStage === 'G5') {
		flags.push({
			id: 'F-G5-NEPHROLOGY-REFERRAL-001',
			category: 'g5-nephrology-referral',
			priority: 'high',
			description: `eGFR ${shown} (G5) — established kidney failure`,
			suggestedAction:
				'Refer to nephrology urgently for renal replacement / conservative-care planning per NICE NG203.'
		});
	}

	// ─── Severely decreased — nephrology referral (HIGH) ────────
	if (egfrStage === 'G4') {
		flags.push({
			id: 'F-G4-NEPHROLOGY-REFERRAL-001',
			category: 'g4-nephrology-referral',
			priority: 'high',
			description: `eGFR ${shown} (G4) — severely decreased renal function`,
			suggestedAction:
				'Refer to nephrology per NICE NG203; assess complications of CKD (anaemia, bone-mineral, acidosis).'
		});
	}

	// ─── Drug-dosing review (HIGH) — G3a or worse ───────────────
	if (egfr < G2_MIN) {
		flags.push({
			id: 'F-DRUG-DOSING-REVIEW-001',
			category: 'drug-dosing-review',
			priority: 'high',
			description: `eGFR ${shown} below 60 — renally-cleared drugs and contrast need review`,
			suggestedAction:
				'Review and adjust renally-cleared medicines, avoid nephrotoxins, and reassess iodinated / gadolinium contrast exposure.'
		});
	}

	// ─── Reduced function (MEDIUM) — G3a or G3b ─────────────────
	if (egfrStage === 'G3a' || egfrStage === 'G3b') {
		flags.push({
			id: 'F-REDUCED-FUNCTION-001',
			category: 'reduced-function',
			priority: 'medium',
			description: `eGFR ${shown} (${egfrStage}) — moderately reduced renal function`,
			suggestedAction:
				'Monitor renal function and manage per CKD guidance; check albuminuria (ACR) and blood pressure.'
		});
	}

	// ─── Confirm CKD near threshold (LOW) — G2/G3a within margin ─
	if (egfrStage === 'G2' || egfrStage === 'G3a') {
		const nearBoundary =
			Math.abs(egfr - G1_MIN) <= BOUNDARY_MARGIN || // 90 (G1/G2)
			Math.abs(egfr - G2_MIN) <= BOUNDARY_MARGIN || // 60 (G2/G3a)
			Math.abs(egfr - G3A_MIN) <= BOUNDARY_MARGIN; // 45 (G3a/G3b)
		if (nearBoundary) {
			flags.push({
				id: 'F-CONFIRM-CKD-001',
				category: 'confirm-ckd',
				priority: 'low',
				description: `eGFR ${shown} (${egfrStage}) is within ${BOUNDARY_MARGIN} mL/min of a G-stage boundary`,
				suggestedAction:
					'Consider a confirmatory cystatin-C-based estimate before assigning a definitive stage, and confirm chronicity over ≥ 3 months.'
			});
		}
	}

	return sortByPriority(flags);
}

/** Sort in place: high > medium > low. */
function sortByPriority(flags: FlaggedIssue[]): FlaggedIssue[] {
	const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
	return flags;
}
