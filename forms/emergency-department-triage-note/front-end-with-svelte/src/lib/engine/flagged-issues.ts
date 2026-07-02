// Flagged-issue detection (safety-escalation flags). Computed independently of
// the assigned MTS priority level (which the grader produces), this module
// raises clinician-facing red flags per spec §5. Rule/category IDs are shared
// with the HTML front-end and the Loco back-end, mirroring the
// `emergency_department_triage_note_grade_flag` SQL table (flag_id, category,
// priority, description, suggested_action):
//
//   - resus-immediate (high)      — any Level-1 discriminator fires
//   - sepsis-escalate (high)      — sepsisFeatures, or NEWS2 >= 7, or any parameter 3
//   - chest-pain (high)           — possible cardiac chest pain (time-critical)
//   - stroke (high)               — features of acute stroke (time-critical)
//   - paediatric-red-flag (high)  — paediatric red flag (time-critical)
//   - severe-pain (medium)        — pain score >= 7
//   - incomplete-vitals (low)     — any core vital sign not yet recorded

import type { AssessmentData, FiredDiscriminator, FlaggedIssue } from './types';

export function detectFlaggedIssues(
	data: AssessmentData,
	result: {
		firedDiscriminators: FiredDiscriminator[];
		news2Total: number;
		news2AnyParameterThree: boolean;
	}
): FlaggedIssue[] {
	const flags: FlaggedIssue[] = [];
	const d = data.discriminators;
	const { firedDiscriminators, news2Total, news2AnyParameterThree } = result;

	// ─── Life threat / category 1 (HIGH) ────────────────────────
	const level1 = firedDiscriminators.filter((f) => f.level === 1);
	if (level1.length > 0) {
		flags.push({
			id: 'F-RESUS-IMMEDIATE-001',
			category: 'resus-immediate',
			priority: 'high',
			description: `Life-threatening finding (${level1.map((f) => f.description).join('; ')}) — Category 1 / Immediate.`,
			suggestedAction:
				'Move to the resuscitation room immediately; summon the resuscitation team and manage airway, breathing, and circulation.'
		});
	}

	// ─── Sepsis / high NEWS2 (HIGH) ─────────────────────────────
	if (d.sepsisFeatures === 'yes' || news2Total >= 7 || news2AnyParameterThree) {
		const why: string[] = [];
		if (d.sepsisFeatures === 'yes') why.push('sepsis features');
		if (news2Total >= 7) why.push(`NEWS2 ${news2Total} (>= 7)`);
		if (news2AnyParameterThree && news2Total < 7) why.push('a single parameter scored 3');
		flags.push({
			id: 'F-SEPSIS-ESCALATE-001',
			category: 'sepsis-escalate',
			priority: 'high',
			description: `Deterioration / sepsis risk (${why.join('; ')}).`,
			suggestedAction:
				'Start the sepsis screen and Sepsis Six as indicated; escalate for senior clinical review and continuous monitoring.'
		});
	}

	// ─── Time-critical: chest pain (HIGH) ───────────────────────
	if (d.chestPainCardiac === 'yes') {
		flags.push({
			id: 'F-CHEST-PAIN-001',
			category: 'chest-pain',
			priority: 'high',
			description: 'Chest pain of possible cardiac origin — time-critical.',
			suggestedAction:
				'Obtain a 12-lead ECG within 10 minutes and place the patient on the chest-pain / ACS pathway.'
		});
	}

	// ─── Time-critical: stroke (HIGH) ───────────────────────────
	if (d.strokeFeatures === 'yes') {
		flags.push({
			id: 'F-STROKE-001',
			category: 'stroke',
			priority: 'high',
			description: 'Features suggestive of acute stroke — time-critical.',
			suggestedAction:
				'Activate the stroke pathway; record onset time and prioritise urgent imaging and thrombolysis assessment.'
		});
	}

	// ─── Time-critical: paediatric red flag (HIGH) ──────────────
	if (d.paediatricRedFlag === 'yes') {
		flags.push({
			id: 'F-PAEDIATRIC-RED-FLAG-001',
			category: 'paediatric-red-flag',
			priority: 'high',
			description: 'Paediatric red flag identified — time-critical.',
			suggestedAction:
				'Escalate to the paediatric team; apply a paediatric early-warning system (PEWS) and reassess frequently.'
		});
	}

	// ─── Severe pain (MEDIUM) ───────────────────────────────────
	const pain = data.pain.painScore;
	if (pain !== null && pain !== undefined && pain >= 7) {
		flags.push({
			id: 'F-SEVERE-PAIN-001',
			category: 'severe-pain',
			priority: 'medium',
			description: `Severe pain (score ${pain}/10).`,
			suggestedAction:
				'Offer prompt analgesia and Very-urgent (Level 2) clinical review; reassess pain after treatment.'
		});
	}

	// ─── Incomplete triage (LOW) ────────────────────────────────
	const missing: string[] = [];
	const v = data.vitals;
	if (v.respiratoryRate === null) missing.push('respiratory rate');
	if (v.spo2 === null) missing.push('oxygen saturation');
	if (v.onOxygen === '') missing.push('air or oxygen');
	if (v.systolicBp === null) missing.push('systolic blood pressure');
	if (v.pulse === null) missing.push('pulse');
	if (v.consciousnessAcvpu === '') missing.push('consciousness (ACVPU)');
	if (v.temperature === null) missing.push('temperature');
	if (missing.length > 0) {
		flags.push({
			id: 'F-INCOMPLETE-VITALS-001',
			category: 'incomplete-vitals',
			priority: 'low',
			description: `Missing core observation(s): ${missing.join(', ')} — the NEWS2 aggregate and category may understate risk.`,
			suggestedAction: 'Complete the missing bedside observation(s) and re-triage.'
		});
	}

	// Sort: high > medium > low.
	const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
