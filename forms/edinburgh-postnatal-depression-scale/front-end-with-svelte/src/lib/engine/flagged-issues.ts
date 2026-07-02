import type { AssessmentData, FlaggedIssue } from './types';

/**
 * Detect clinician-facing safety flags (red flags), independent of the
 * interpretation band (spec §5):
 *
 *   - Self-harm risk (urgent)      — item 10 score > 0; overrides every band
 *   - Likely depression (high)     — totalScore >= 13
 *   - Possible depression (medium) — totalScore 10-12 (sensitive threshold)
 *   - Elevated anxiety (low)       — anxiety subscale (items 3, 4, 5) >= 4
 *   - Incomplete assessment (low)  — any of the ten item responses missing
 *
 * The self-harm flag is mandatory and urgent whenever item 10 > 0, regardless
 * of the total score. Rows mirror the
 * `edinburgh_postnatal_depression_scale_grade_flag` SQL table.
 */
export function detectFlaggedIssues(
	data: AssessmentData,
	grade: {
		itemScores: number[];
		totalScore: number;
		item10Score: number;
		selfHarmFlag: boolean;
		anxietySubscale: number;
	}
): FlaggedIssue[] {
	const flags: FlaggedIssue[] = [];

	const { totalScore, item10Score, selfHarmFlag, anxietySubscale } = grade;

	// ─── Self-harm risk (URGENT) — overrides everything ─────────
	if (selfHarmFlag) {
		flags.push({
			id: 'F-SELF-HARM-URGENT-001',
			category: 'self-harm-urgent',
			priority: 'urgent',
			description:
				`Item 10 (thoughts of self-harm) is positive (score ${item10Score} of 3) — ` +
				'any response other than "Never" is a mandatory red flag, regardless of the total score',
			suggestedAction:
				'Perform an immediate suicide / self-harm risk assessment and take appropriate safeguarding action; do not leave the person alone if acute risk is identified. Escalate per local perinatal mental-health and safeguarding pathways.'
		});
	}

	// ─── Likely depression (HIGH) ───────────────────────────────
	if (totalScore >= 13) {
		flags.push({
			id: 'F-LIKELY-DEPRESSION-001',
			category: 'likely-depression',
			priority: 'high',
			description: `Total EPDS score ${totalScore} of 30 is at or above the specific threshold (>= 13) — likely depressive illness`,
			suggestedAction:
				'Arrange assessment by an appropriately qualified clinician and refer per the local perinatal mental-health pathway. This is a screen, not a diagnosis.'
		});
	}

	// ─── Possible depression (MEDIUM) ───────────────────────────
	// Fires in the sensitive band only (10-12); the likely flag covers >= 13.
	if (totalScore >= 10 && totalScore < 13) {
		flags.push({
			id: 'F-POSSIBLE-DEPRESSION-001',
			category: 'possible-depression',
			priority: 'medium',
			description: `Total EPDS score ${totalScore} of 30 is at or above the sensitive threshold (>= 10) — possible depression`,
			suggestedAction:
				'Arrange further assessment / clinical review and repeat the EPDS in 2-4 weeks, or refer per the local pathway.'
		});
	}

	// ─── Elevated anxiety subscale (LOW) ────────────────────────
	if (anxietySubscale >= 4) {
		flags.push({
			id: 'F-ELEVATED-ANXIETY-001',
			category: 'elevated-anxiety',
			priority: 'low',
			description: `Anxiety subscale (items 3, 4, 5) scored ${anxietySubscale} of 9 (EPDS-3A >= 4) — features of perinatal anxiety`,
			suggestedAction:
				'Consider perinatal anxiety alongside the depression screen when planning assessment and support.'
		});
	}

	// ─── Incomplete assessment (LOW) ────────────────────────────
	const missing: string[] = [];
	for (let i = 1; i <= 10; i++) {
		const v = data.items[`item${i}` as keyof AssessmentData['items']];
		if (v === null || v === undefined) missing.push(String(i));
	}
	if (missing.length > 0) {
		flags.push({
			id: 'F-INCOMPLETE-ASSESSMENT-001',
			category: 'incomplete',
			priority: 'low',
			description: `Missing response(s) for item(s): ${missing.join(', ')} — the total may understate risk`,
			suggestedAction:
				'Re-administer the missing item(s) and re-score. Review item 10 in every case, regardless of the total.'
		});
	}

	// Sort: urgent > high > medium > low.
	const priorityOrder: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
