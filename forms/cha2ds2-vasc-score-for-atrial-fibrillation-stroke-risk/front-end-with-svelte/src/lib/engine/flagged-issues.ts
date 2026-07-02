import type { AssessmentData, FlaggedIssue, RiskBand } from './types';

/**
 * Detect clinician-facing safety flags (red flags), independent of the total
 * CHA2DS2-VASc score (spec §5):
 *
 *   - Anticoagulation recommended (high)   — riskBand == 'high'
 *   - High risk, decision undocumented (high) — riskBand == 'high'
 *   - Bleeding-risk cross-reference (high)  — riskBand == 'high'
 *   - Prior stroke / TIA (high)             — priorStrokeTiaThromboembolism == 'yes'
 *   - Advanced age (medium)                 — ageYears >= 75
 *   - Female sex modifier (low)             — sex == 'female' and total == 1
 *   - Incomplete assessment (low)           — any criterion input or ageYears missing
 *
 * Rows mirror the `cha2ds2_vasc_grade_flag` SQL table (flag_id, category,
 * priority, description, suggested_action).
 */
export function detectFlaggedIssues(
	data: AssessmentData,
	grade: { riskBand: RiskBand; cha2ds2VascScore: number }
): FlaggedIssue[] {
	const flags: FlaggedIssue[] = [];

	const { riskBand, cha2ds2VascScore } = grade;
	const chf = data.cardiac.congestiveHeartFailure;
	const htn = data.cardiac.hypertension;
	const vasc = data.cardiac.vascularDisease;
	const dm = data.metabolic.diabetes;
	const stroke = data.metabolic.priorStrokeTiaThromboembolism;
	const ageYears = data.identification.ageYears;
	const sex = data.identification.sex;

	// ─── Anticoagulation recommended (HIGH) ─────────────────────
	if (riskBand === 'high') {
		flags.push({
			id: 'F-ANTICOAGULATION-RECOMMENDED-001',
			category: 'anticoagulation-recommended',
			priority: 'high',
			description: `High CHA2DS2-VASc score (${cha2ds2VascScore} of 9) — oral anticoagulation is recommended unless contraindicated`,
			suggestedAction:
				'Offer oral anticoagulation (DOAC preferred, or warfarin with good time-in-therapeutic-range) as part of shared decision-making.'
		});
	}

	// ─── High risk, decision undocumented (HIGH) ────────────────
	if (riskBand === 'high') {
		flags.push({
			id: 'F-HIGH-RISK-UNTREATED-001',
			category: 'high-risk-untreated',
			priority: 'high',
			description:
				'High stroke risk that may be untreated — no anticoagulation decision is recorded on this assessment',
			suggestedAction:
				'Document the anticoagulation decision (started, declined, or contraindicated) and the reasoning.'
		});
	}

	// ─── Bleeding-risk cross-reference (HIGH) ───────────────────
	if (riskBand === 'high') {
		flags.push({
			id: 'F-BLEEDING-RISK-CROSS-REF-001',
			category: 'bleeding-risk-cross-ref',
			priority: 'high',
			description: 'Before starting anticoagulation, weigh stroke risk against bleeding risk',
			suggestedAction:
				'Complete a HAS-BLED assessment and correct modifiable bleeding risks; a high HAS-BLED score is not by itself a reason to withhold anticoagulation.'
		});
	}

	// ─── Prior stroke / TIA (HIGH) ──────────────────────────────
	if (stroke === 'yes') {
		flags.push({
			id: 'F-PRIOR-STROKE-TIA-001',
			category: 'prior-stroke-tia',
			priority: 'high',
			description:
				'Prior stroke, TIA, or thromboembolism — the strongest single risk factor (2 points)',
			suggestedAction:
				'Secondary prevention is indicated; ensure anticoagulation is addressed unless contraindicated.'
		});
	}

	// ─── Advanced age (MEDIUM) ──────────────────────────────────
	if (ageYears !== null && ageYears >= 75) {
		flags.push({
			id: 'F-ADVANCED-AGE-001',
			category: 'advanced-age',
			priority: 'medium',
			description: `Age ${ageYears} years — age >= 75 contributes 2 points and raises both stroke and fall/bleeding considerations`,
			suggestedAction:
				'Assess falls risk and review medications; age is not a reason to withhold anticoagulation.'
		});
	}

	// ─── Female sex modifier (LOW) ──────────────────────────────
	if (sex === 'female' && cha2ds2VascScore === 1) {
		flags.push({
			id: 'F-FEMALE-SEX-MODIFIER-001',
			category: 'female-sex-modifier',
			priority: 'low',
			description:
				'Score driven by female sex category alone — female sex is a risk modifier, not an independent risk factor',
			suggestedAction: 'Manage as low risk: no anticoagulation for the sex category alone.'
		});
	}

	// ─── Incomplete assessment (LOW) ────────────────────────────
	const missing: string[] = [];
	if (chf === '') missing.push('congestive heart failure');
	if (htn === '') missing.push('hypertension');
	if (vasc === '') missing.push('vascular disease');
	if (dm === '') missing.push('diabetes');
	if (stroke === '') missing.push('prior stroke / TIA / thromboembolism');
	if (ageYears === null) missing.push('age (years)');
	if (sex === '') missing.push('sex');
	if (missing.length > 0) {
		flags.push({
			id: 'F-INCOMPLETE-ASSESSMENT-001',
			category: 'incomplete-assessment',
			priority: 'low',
			description: `Missing input(s): ${missing.join(', ')} — the score may misstate risk`,
			suggestedAction: 'Complete every criterion and re-score.'
		});
	}

	// Sort: high > medium > low.
	const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
