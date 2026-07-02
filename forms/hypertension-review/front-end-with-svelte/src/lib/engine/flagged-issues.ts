import type { AssessmentData, ControlClass, FlaggedIssue, ReviewStatus } from './types';
import { present } from './utils';

/**
 * Detect the clinician-facing flags raised by the review findings. Computed
 * INDEPENDENTLY of the control class and completeness status (which the grader
 * produces), each flag carries a priority (spec §5). Categories mirror the
 * `hypertension_review_grade_flag` SQL CHECK constraint: severe-hypertension,
 * uncontrolled-bp, missing-bloods, missing-acr, high-cv-risk-untreated,
 * adherence-concern, postural-drop, incomplete, other.
 *
 *   - Severe hypertension (high)          — clinic BP 180/120 and over
 *   - Uncontrolled blood pressure (high)  — controlClass == 'uncontrolled'
 *   - Missing annual bloods (medium)      — U&E, HbA1c, or lipids not recorded
 *   - Missing urine ACR (medium)          — urineAcr == null
 *   - High CV risk untreated (medium)     — qriskPercent 10 and over and not on a statin
 *   - Adherence concern (medium)          — adherence == 'poor' or sideEffects == 'yes'
 *   - Postural drop (medium)              — posturalDrop == 'yes'
 *   - Incomplete review (low)             — reviewStatus == 'incomplete' (no BP)
 */
export function detectFlaggedIssues(
	data: AssessmentData,
	grade?: { controlClass?: ControlClass; reviewStatus?: ReviewStatus }
): FlaggedIssue[] {
	const flags: FlaggedIssue[] = [];

	const c = data.clinicBp;
	const b = data.bloods;
	const cv = data.cardiovascularRisk;
	const m = data.medication;

	const hasClinic = present(c.clinicSystolic) && present(c.clinicDiastolic);

	// ─── Severe hypertension (HIGH) ────────────────────────────
	if (hasClinic && (c.clinicSystolic! >= 180 || c.clinicDiastolic! >= 120)) {
		flags.push({
			id: 'F-SEVERE-HYPERTENSION-001',
			category: 'severe-hypertension',
			priority: 'high',
			description: `Clinic blood pressure ${c.clinicSystolic}/${c.clinicDiastolic} mmHg is 180/120 or above`,
			suggestedAction:
				'Arrange same-day clinical assessment; assess for accelerated hypertension and target-organ damage.'
		});
	}

	// ─── Uncontrolled blood pressure (HIGH) ────────────────────
	if (grade && grade.controlClass === 'uncontrolled') {
		flags.push({
			id: 'F-UNCONTROLLED-BP-001',
			category: 'uncontrolled-bp',
			priority: 'high',
			description: 'Blood pressure is above the applicable NICE target',
			suggestedAction:
				'Review adherence and step up antihypertensive medication per NICE NG136; arrange follow-up.'
		});
	}

	// ─── Missing annual bloods (MEDIUM) ────────────────────────
	const ueRecorded =
		present(b.serumCreatinine) || present(b.egfr) || present(b.serumPotassium);
	const hba1cRecorded = present(b.hba1c);
	const lipidsRecorded = present(b.totalCholesterol) || present(b.hdlCholesterol);
	if (!ueRecorded || !hba1cRecorded || !lipidsRecorded) {
		const missing: string[] = [];
		if (!ueRecorded) missing.push('U&E');
		if (!hba1cRecorded) missing.push('HbA1c');
		if (!lipidsRecorded) missing.push('lipids');
		flags.push({
			id: 'F-MISSING-BLOODS-001',
			category: 'missing-bloods',
			priority: 'medium',
			description: `Annual bloods not recorded: ${missing.join(', ')}`,
			suggestedAction:
				'Request the outstanding annual bloods (U&E, HbA1c, lipids) to complete the review.'
		});
	}

	// ─── Missing urine ACR (MEDIUM) ────────────────────────────
	if (!present(data.urine.urineAcr)) {
		flags.push({
			id: 'F-MISSING-ACR-001',
			category: 'missing-acr',
			priority: 'medium',
			description: 'No urine albumin:creatinine ratio (ACR) recorded',
			suggestedAction:
				'Send a urine ACR to screen for hypertensive kidney damage and to confirm the applicable BP target.'
		});
	}

	// ─── High cardiovascular risk untreated (MEDIUM) ───────────
	if (present(cv.qriskPercent) && cv.qriskPercent >= 10 && cv.statinTherapy !== 'yes') {
		flags.push({
			id: 'F-HIGH-CV-RISK-UNTREATED-001',
			category: 'high-cv-risk-untreated',
			priority: 'medium',
			description: `QRISK 10-year risk ${cv.qriskPercent}% is 10% or above with no statin therapy recorded`,
			suggestedAction: 'Discuss and offer statin therapy for primary prevention per NICE CG181.'
		});
	}

	// ─── Adherence concern (MEDIUM) ────────────────────────────
	if (m.adherence === 'poor' || m.sideEffects === 'yes') {
		flags.push({
			id: 'F-ADHERENCE-CONCERN-001',
			category: 'adherence-concern',
			priority: 'medium',
			description:
				m.adherence === 'poor'
					? 'Poor self-reported medication adherence'
					: 'Troublesome medication side effects reported',
			suggestedAction:
				'Explore barriers to adherence and tolerability; consider simplifying the regimen or switching agents.'
		});
	}

	// ─── Postural drop (MEDIUM) ────────────────────────────────
	if (c.posturalDrop === 'yes') {
		flags.push({
			id: 'F-POSTURAL-DROP-001',
			category: 'postural-drop',
			priority: 'medium',
			description: 'Symptomatic postural systolic fall of 20 mmHg or more',
			suggestedAction:
				'Review antihypertensive burden and falls risk; consider deprescribing where appropriate.'
		});
	}

	// ─── Incomplete review (LOW) ───────────────────────────────
	if (grade && grade.reviewStatus === 'incomplete') {
		flags.push({
			id: 'F-INCOMPLETE-001',
			category: 'incomplete',
			priority: 'low',
			description: 'No blood-pressure reading recorded — control cannot be classified',
			suggestedAction:
				'Record a clinic or home/ambulatory blood pressure to complete the review.'
		});
	}

	// Sort: high > medium > low.
	const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((x, y) => priorityOrder[x.priority] - priorityOrder[y.priority]);

	return flags;
}
