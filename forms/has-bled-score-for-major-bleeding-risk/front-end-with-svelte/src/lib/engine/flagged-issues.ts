import type { AssessmentData, FlaggedIssue } from './types';

/**
 * Detect clinician-facing safety flags (red flags), independent of the total
 * HAS-BLED score (spec §5). The four modifiable-factor flags are the point of
 * HAS-BLED: they surface correctable bleeding-risk factors rather than gate
 * anticoagulation.
 *
 *   - High bleeding risk (high)         — hasBledScore >= 3
 *   - Modifiable: hypertension (medium) — hypertensionUncontrolled == 'yes'
 *   - Modifiable: labile INR (medium)   — labileInr == 'yes'
 *   - Modifiable: drugs (medium)        — antiplateletOrNsaid == 'yes'
 *   - Modifiable: alcohol (medium)      — alcoholUnitsPerWeek >= 8
 *   - Incomplete assessment (low)       — any criterion input missing
 *
 * Rows mirror the `has_bled_score_for_major_bleeding_risk_grade_flag` SQL table
 * (flag_id, category, priority, description, suggested_action).
 */
export function detectFlaggedIssues(data: AssessmentData, hasBledScore: number): FlaggedIssue[] {
	const flags: FlaggedIssue[] = [];

	const alcohol = data.drugsAlcohol.alcoholUnitsPerWeek;

	// ─── High bleeding risk (HIGH) ──────────────────────────────
	if (hasBledScore >= 3) {
		flags.push({
			id: 'F-HIGH-BLEEDING-RISK-001',
			category: 'high-bleeding-risk',
			priority: 'high',
			description: `HAS-BLED score ${hasBledScore} of 9 (>= 3) — higher estimated risk of major bleeding`,
			suggestedAction:
				'Not a contraindication to anticoagulation: exercise caution, review more frequently, correct modifiable factors, and weigh against the CHA2DS2-VASc stroke risk.'
		});
	}

	// ─── Modifiable: uncontrolled hypertension (MEDIUM) ─────────
	if (data.hypertension.hypertensionUncontrolled === 'yes') {
		flags.push({
			id: 'F-MODIFIABLE-HYPERTENSION-001',
			category: 'modifiable-hypertension',
			priority: 'medium',
			description:
				'Uncontrolled hypertension (systolic blood pressure > 160 mmHg) — a correctable bleeding-risk factor',
			suggestedAction: 'Optimise blood-pressure control to reduce bleeding risk and re-score.'
		});
	}

	// ─── Modifiable: labile INR (MEDIUM) ───────────────────────
	if (data.labileInr.labileInr === 'yes') {
		flags.push({
			id: 'F-MODIFIABLE-LABILE-INR-001',
			category: 'modifiable-labile-inr',
			priority: 'medium',
			description:
				'Labile INR (unstable/high INR, or time in therapeutic range < 60%) — a correctable bleeding-risk factor',
			suggestedAction:
				'Improve INR stability, review warfarin control, or consider a DOAC where appropriate.'
		});
	}

	// ─── Modifiable: drugs (MEDIUM) ────────────────────────────
	if (data.drugsAlcohol.antiplateletOrNsaid === 'yes') {
		flags.push({
			id: 'F-MODIFIABLE-DRUGS-001',
			category: 'modifiable-drugs',
			priority: 'medium',
			description:
				'Concomitant antiplatelet agents or NSAIDs — a correctable bleeding-risk factor',
			suggestedAction:
				'Review the need for concomitant antiplatelets or NSAIDs and stop where not essential.'
		});
	}

	// ─── Modifiable: alcohol (MEDIUM) ──────────────────────────
	if (alcohol !== null && alcohol >= 8) {
		flags.push({
			id: 'F-MODIFIABLE-ALCOHOL-001',
			category: 'modifiable-alcohol',
			priority: 'medium',
			description: `Alcohol ${alcohol} units per week (>= 8) — a correctable bleeding-risk factor`,
			suggestedAction: 'Offer alcohol-reduction advice and support to lower bleeding risk.'
		});
	}

	// ─── Incomplete assessment (LOW) ───────────────────────────
	const missing: string[] = [];
	if (data.hypertension.hypertensionUncontrolled === '') missing.push('hypertension');
	if (data.organFunction.abnormalRenalFunction === '') missing.push('abnormal renal function');
	if (data.organFunction.abnormalLiverFunction === '') missing.push('abnormal liver function');
	if (data.stroke.strokeHistory === '') missing.push('stroke history');
	if (data.bleeding.bleedingHistory === '') missing.push('bleeding history');
	if (data.labileInr.labileInr === '') missing.push('labile INR');
	if (data.identification.ageYears === null) missing.push('age (elderly criterion)');
	if (data.drugsAlcohol.antiplateletOrNsaid === '') missing.push('drugs (antiplatelets/NSAIDs)');
	if (alcohol === null) missing.push('alcohol units per week');
	if (missing.length > 0) {
		flags.push({
			id: 'F-INCOMPLETE-ASSESSMENT-001',
			category: 'incomplete-assessment',
			priority: 'low',
			description: `Missing criterion input(s): ${missing.join(', ')} — the score may understate risk`,
			suggestedAction: 'Record the missing item(s) and re-score.'
		});
	}

	// Sort: high > medium > low.
	const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
