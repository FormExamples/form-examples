import type { AssessmentData, FlaggedIssue } from './types';

/**
 * Detect clinician-facing safety flags (red flags), independent of the total
 * 4AT score (spec §5):
 *
 *   - Possible delirium (high)             — totalScore >= 4
 *   - Abnormal alertness (high)            — item 1 clearly abnormal
 *   - Acute change present (high)          — item 4 positive
 *   - Possible cognitive impairment (med)  — totalScore in 1-3
 *   - Incomplete acute-change info (med)   — item 4 not reliably obtained and
 *                                            totalScore === 0
 *
 * Rows mirror the `four_a_test_for_delirium_grade_flag` SQL table
 * (flag_id, category, priority, description, suggested_action).
 */
export function detectFlaggedIssues(data: AssessmentData, totalScore: number): FlaggedIssue[] {
	const flags: FlaggedIssue[] = [];

	const alertness = data.item1.alertness;
	const acuteChange = data.item4.acuteChange;
	const acuteChangeSource = data.item4.acuteChangeSource;

	// ─── Possible delirium (HIGH) ───────────────────────────────
	if (totalScore >= 4) {
		flags.push({
			id: 'F-POSSIBLE-DELIRIUM-001',
			category: 'possible-delirium',
			priority: 'high',
			description: `Total 4AT score ${totalScore} of 12 (4 or more) — delirium is possible, with or without cognitive impairment`,
			suggestedAction:
				'Undertake a full clinical assessment against DSM-5 / ICD-10 delirium criteria, search for precipitants, and instigate delirium management per local policy.'
		});
	}

	// ─── Abnormal alertness (HIGH) ──────────────────────────────
	if (alertness === 'abnormal') {
		flags.push({
			id: 'F-ABNORMAL-ALERTNESS-001',
			category: 'abnormal-alertness',
			priority: 'high',
			description:
				'Item 1 alertness clearly abnormal — markedly drowsy or agitated / hyperactive',
			suggestedAction:
				'Obtain an urgent clinical review regardless of the total score; assess airway, consciousness, and reversible causes.'
		});
	}

	// ─── Acute change present (HIGH) ────────────────────────────
	if (acuteChange === 'yes') {
		flags.push({
			id: 'F-ACUTE-CHANGE-PRESENT-001',
			category: 'acute-change-present',
			priority: 'high',
			description:
				'Item 4 positive — acute change or fluctuating course in alertness, cognition, or other mental function',
			suggestedAction:
				'Treat as a strong pointer to delirium; corroborate with collateral history and review the timeline of onset and fluctuation.'
		});
	}

	// ─── Possible cognitive impairment (MEDIUM) ─────────────────
	if (totalScore >= 1 && totalScore <= 3) {
		flags.push({
			id: 'F-POSSIBLE-COGNITIVE-IMPAIRMENT-001',
			category: 'possible-cognitive-impairment',
			priority: 'medium',
			description: `Total 4AT score ${totalScore} of 12 (1-3) — possible cognitive impairment`,
			suggestedAction:
				'Arrange further cognitive assessment and obtain a collateral history to distinguish delirium from established cognitive impairment.'
		});
	}

	// ─── Incomplete acute-change information (MEDIUM) ────────────
	const acuteChangeIncomplete =
		acuteChange === '' || acuteChangeSource === '' || acuteChangeSource === 'none';
	if (totalScore === 0 && acuteChangeIncomplete) {
		flags.push({
			id: 'F-INCOMPLETE-ACUTE-CHANGE-001',
			category: 'incomplete-acute-change',
			priority: 'medium',
			description:
				'Item 4 acute-change information could not be reliably established — a score of 0 does not exclude delirium',
			suggestedAction:
				'Seek collateral history from family, carers, or records and re-score item 4 before ruling out delirium.'
		});
	}

	// Sort: high > medium > low.
	const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
