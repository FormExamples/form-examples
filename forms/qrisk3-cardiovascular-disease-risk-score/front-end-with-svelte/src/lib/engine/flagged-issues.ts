import type { AssessmentData, FlaggedIssue } from './types';

/**
 * Detect clinician-facing safety flags (red flags), independent of the numeric
 * result (which the grader produces) — spec §5:
 *
 *   - Statin offer (high)            — tenYearRiskPercent >= 10 (NICE threshold)
 *   - High risk (high)               — tenYearRiskPercent >= 20
 *   - Not eligible (high)            — established CVD, familial hypercholesterolaemia,
 *                                       or age outside 25-84 (QRISK3 not valid)
 *   - Missing cholesterol (medium)   — cholesterolHdlRatio == null
 *   - Incomplete assessment (medium) — any required model input missing
 *   - Severe hypertension (medium)   — systolicBloodPressure >= 180
 *
 * Rows mirror the `qrisk3_cardiovascular_disease_risk_score_grade_flag` SQL
 * table (flag_id, category, priority, description, suggested_action). Ported
 * verbatim from `front-end-with-html/js/flags.js`.
 *
 * @param tenYearRiskPercent from the grader (null when not computable).
 */
export function detectFlaggedIssues(
	data: AssessmentData,
	tenYearRiskPercent: number | null
): FlaggedIssue[] {
	const flags: FlaggedIssue[] = [];

	const id = data.identification;
	const elig = data.eligibility;
	const cm = data.cardiometabolic;
	const age = id.age;
	const sbp = cm.systolicBloodPressure;

	// ─── Statin offer (HIGH) — NICE threshold ───────────────────────────
	if (tenYearRiskPercent !== null && tenYearRiskPercent >= 10) {
		flags.push({
			id: 'F-STATIN-OFFER-001',
			category: 'statin-offer',
			priority: 'high',
			description: `10-year CVD risk ${tenYearRiskPercent}% meets the NICE threshold (>= 10%)`,
			suggestedAction:
				'Offer a lipid-lowering statin (atorvastatin 20 mg) for primary prevention after informed discussion, alongside structured lifestyle advice (smoking, diet, activity, alcohol, weight).'
		});
	}

	// ─── High risk (HIGH) ───────────────────────────────────────────────
	if (tenYearRiskPercent !== null && tenYearRiskPercent >= 20) {
		flags.push({
			id: 'F-HIGH-RISK-001',
			category: 'high-risk',
			priority: 'high',
			description: `10-year CVD risk ${tenYearRiskPercent}% is in the high band (>= 20%)`,
			suggestedAction:
				'Prioritise the statin offer and intensive lifestyle optimisation; review modifiable factors and treatment adherence.'
		});
	}

	// ─── Not eligible (HIGH) ────────────────────────────────────────────
	const eligibilityReasons: string[] = [];
	if (elig.hasEstablishedCvd === 'yes') eligibilityReasons.push('established cardiovascular disease');
	if (elig.hasFamilialHypercholesterolaemia === 'yes')
		eligibilityReasons.push('familial hypercholesterolaemia');
	if (age !== null && age < 25) eligibilityReasons.push('age below 25');
	if (age !== null && age > 84) eligibilityReasons.push('age above 84');
	if (eligibilityReasons.length > 0) {
		flags.push({
			id: 'F-NOT-ELIGIBLE-001',
			category: 'not-eligible',
			priority: 'high',
			description: `QRISK3 is not valid for this patient: ${eligibilityReasons.join(', ')}`,
			suggestedAction:
				'Do not rely on this primary-prevention score. Assess by the appropriate pathway (secondary prevention, FH specialist review, or age-appropriate assessment).'
		});
	}

	// ─── Missing cholesterol ratio (MEDIUM) ─────────────────────────────
	if (cm.cholesterolHdlRatio === null) {
		flags.push({
			id: 'F-MISSING-CHOLESTEROL-001',
			category: 'missing-cholesterol',
			priority: 'medium',
			description:
				'Total-cholesterol : HDL ratio not recorded — the risk estimate cannot be computed accurately',
			suggestedAction: 'Obtain a lipid profile (non-fasting) and re-calculate the score.'
		});
	}

	// ─── Incomplete assessment (MEDIUM) ─────────────────────────────────
	const missing: string[] = [];
	if (age === null) missing.push('age');
	if (id.sex === '') missing.push('sex');
	if (data.lifestyle.bodyMassIndex === null) missing.push('body-mass index');
	if (cm.cholesterolHdlRatio === null) missing.push('cholesterol : HDL ratio');
	if (sbp === null) missing.push('systolic blood pressure');
	if (missing.length > 0) {
		flags.push({
			id: 'F-INCOMPLETE-ASSESSMENT-001',
			category: 'incomplete-assessment',
			priority: 'medium',
			description: `Missing required model input(s): ${missing.join(', ')} — the result may be unreliable or unavailable`,
			suggestedAction: 'Record the missing measurement(s) and re-calculate.'
		});
	}

	// ─── Severe hypertension (MEDIUM) ───────────────────────────────────
	if (sbp !== null && sbp >= 180) {
		flags.push({
			id: 'F-SEVERE-HYPERTENSION-001',
			category: 'severe-hypertension',
			priority: 'medium',
			description: `Systolic blood pressure ${sbp} mmHg at or above 180 mmHg — severe hypertension`,
			suggestedAction:
				'Review blood pressure independently of the CVD score; investigate and manage per hypertension guidance.'
		});
	}

	// Sort: high > medium > low.
	const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
