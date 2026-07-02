import type { AssessmentData, FlaggedIssue } from './types';

/**
 * The six yes/no criterion inputs, in wizard order, with a human label for the
 * incomplete-assessment flag. The numeric heart rate is checked separately.
 */
const CRITERION_INPUTS: [keyof AssessmentData, string, string][] = [
	['criteria', 'dvtSigns', 'clinical signs of DVT'],
	['criteria', 'peMostLikely', 'PE most likely diagnosis'],
	['criteria', 'immobilisationSurgery', 'immobilisation or recent surgery'],
	['criteria', 'previousDvtPe', 'previous DVT or PE'],
	['criteria', 'haemoptysis', 'haemoptysis'],
	['criteria', 'malignancy', 'malignancy']
];

/**
 * Detect clinician-facing safety flags (red flags), independent of the Wells
 * total (spec §5):
 *
 *   - Haemodynamic instability (high)  — haemodynamicStatus == 'unstable'
 *   - PE likely — arrange CTPA (high)  — twoLevelBand == 'likely' (wellsScore > 4)
 *   - PE unlikely — arrange D-dimer (medium) — twoLevelBand == 'unlikely' (<= 4)
 *   - Incomplete assessment (low)      — any criterion input missing
 *                                        ('' enum or null heart rate)
 *
 * Rows mirror the `wells_score_for_pulmonary_embolism_grade_flag` SQL table
 * (flag_id, category, priority, description, suggested_action).
 */
export function detectFlaggedIssues(data: AssessmentData, wellsScore: number): FlaggedIssue[] {
	const flags: FlaggedIssue[] = [];

	const twoLevelBand = wellsScore > 4 ? 'likely' : 'unlikely';

	// ─── Haemodynamic instability (HIGH) ────────────────────────
	if (data.haemodynamic.haemodynamicStatus === 'unstable') {
		flags.push({
			id: 'F-HAEMODYNAMIC-INSTABILITY-001',
			category: 'haemodynamic-instability',
			priority: 'high',
			description:
				'Patient recorded as haemodynamically unstable — suspected massive PE; do not wait on scoring',
			suggestedAction:
				'Resuscitate and arrange immediate CTPA or bedside echocardiography, and consider empirical thrombolysis per local policy.'
		});
	}

	// ─── PE likely — arrange CTPA (HIGH) ────────────────────────
	if (twoLevelBand === 'likely') {
		flags.push({
			id: 'F-PE-LIKELY-CTPA-001',
			category: 'pe-likely-ctpa',
			priority: 'high',
			description: `PE likely (Wells score ${wellsScore}) — arrange an immediate CT pulmonary angiogram`,
			suggestedAction:
				'Arrange an immediate CTPA. Give interim anticoagulation if imaging is delayed. If CTPA is negative, consider proximal-leg vein ultrasound.'
		});
	}

	// ─── PE unlikely — arrange D-dimer (MEDIUM) ─────────────────
	if (twoLevelBand === 'unlikely') {
		flags.push({
			id: 'F-PE-UNLIKELY-D-DIMER-001',
			category: 'pe-unlikely-d-dimer',
			priority: 'medium',
			description: `PE unlikely (Wells score ${wellsScore}) — arrange a D-dimer test`,
			suggestedAction:
				'Arrange a D-dimer test. If positive, arrange CTPA; if negative, consider an alternative diagnosis and, where gestalt probability is low, apply the PERC rule to support ruling PE out without D-dimer.'
		});
	}

	// ─── Incomplete assessment (LOW) ────────────────────────────
	const missing: string[] = [];
	for (const [section, field, label] of CRITERION_INPUTS) {
		const sectionData = data[section] as unknown as Record<string, string>;
		if (sectionData[field] === '') missing.push(label);
	}
	if (data.observations.heartRate === null || data.observations.heartRate === undefined) {
		missing.push('measured heart rate');
	}
	if (missing.length > 0) {
		flags.push({
			id: 'F-INCOMPLETE-ASSESSMENT-001',
			category: 'incomplete-assessment',
			priority: 'low',
			description: `Missing criterion input(s): ${missing.join(', ')} — the score may understate risk`,
			suggestedAction: 'Record the missing criterion answer(s) and re-score.'
		});
	}

	// Sort: high > medium > low.
	const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
