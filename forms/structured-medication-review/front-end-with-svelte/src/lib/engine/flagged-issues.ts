import type { FlaggedIssue, GradingResult, ReviewData } from './types';

/**
 * Flagged-issue detection (red flags). Emitted independently of the burden
 * bands (spec §5). Each flag mirrors a category in the
 * `structured_medication_review_grade_flag` SQL table:
 *
 *   - high-acb                 (high)   — anticholinergicBurdenScore >= 3
 *   - stopp-trigger            (high)   — >= 1 medicine carries a stoppCriterion
 *   - start-omission           (medium) — >= 1 medicine carries a startCriterion
 *   - missing-monitoring       (high)   — medicine monitoringRequired==yes &
 *                                          monitoringUpToDate==no, or
 *                                          overdueMonitoringCount > 0
 *   - adherence-concern        (medium) — >= 1 medicine adherence partial/poor
 *   - high-risk-no-indication  (high)   — high-risk medicine with no indication
 *   - incomplete               (low)    — reviewStatus == 'incomplete'
 */

/** The grade shape flag detection needs (the grader output before flags). */
type Grade = Omit<GradingResult, 'flaggedIssues' | 'timestamp'>;

export function detectFlaggedIssues(data: ReviewData, grade: Grade): FlaggedIssue[] {
	const flags: FlaggedIssue[] = [];
	const medicines = data.medicines || [];

	// ─── High anticholinergic burden (HIGH) ─────────────────────
	if (grade.anticholinergicBurdenScore >= 3) {
		flags.push({
			id: 'F-HIGH-ACB-001',
			category: 'high-acb',
			priority: 'high',
			description: `Anticholinergic burden score ${grade.anticholinergicBurdenScore} (at or above the significant threshold of 3)`,
			suggestedAction:
				'Review sedating and anticholinergic medicines; consider deprescribing to reduce falls and cognitive-impairment risk.'
		});
	}

	// ─── STOPP trigger (HIGH) ───────────────────────────────────
	if (grade.stopFlags.length > 0) {
		const names = grade.stopFlags.map((f) => f.drugName).join(', ');
		flags.push({
			id: 'F-STOPP-TRIGGER-001',
			category: 'stopp-trigger',
			priority: 'high',
			description: `${grade.stopFlags.length} STOPP criterion / criteria identified (${names})`,
			suggestedAction:
				'Review the potentially inappropriate prescribing for stopping, in line with STOPP/START v3 and shared decision making.'
		});
	}

	// ─── START omission (MEDIUM) ────────────────────────────────
	if (grade.startFlags.length > 0) {
		const names = grade.startFlags.map((f) => f.drugName).join(', ');
		flags.push({
			id: 'F-START-OMISSION-001',
			category: 'start-omission',
			priority: 'medium',
			description: `${grade.startFlags.length} START criterion / criteria identified (${names})`,
			suggestedAction:
				'Consider the potential prescribing omission(s) for starting, in line with STOPP/START v3.'
		});
	}

	// ─── Missing / overdue monitoring (HIGH) ────────────────────
	const monitoringGaps = medicines.filter(
		(m) => m.monitoringRequired === 'yes' && m.monitoringUpToDate === 'no'
	);
	const overdue = data.monitoring.overdueMonitoringCount;
	if (monitoringGaps.length > 0 || (typeof overdue === 'number' && overdue > 0)) {
		const parts: string[] = [];
		if (monitoringGaps.length > 0) {
			parts.push(`${monitoringGaps.length} medicine(s) with monitoring not up to date`);
		}
		if (typeof overdue === 'number' && overdue > 0) {
			parts.push(`${overdue} overdue monitoring item(s)`);
		}
		flags.push({
			id: 'F-MISSING-MONITORING-001',
			category: 'missing-monitoring',
			priority: 'high',
			description: `Monitoring outstanding: ${parts.join('; ')}`,
			suggestedAction:
				'Arrange the outstanding blood tests / monitoring before continuing the affected medicines.'
		});
	}

	// ─── Adherence concern (MEDIUM) ─────────────────────────────
	const adherenceIssues = medicines.filter(
		(m) => m.adherence === 'partial' || m.adherence === 'poor'
	);
	if (adherenceIssues.length > 0) {
		const names = adherenceIssues.map((m, i) => m.drugName || `Medicine ${i + 1}`).join(', ');
		flags.push({
			id: 'F-ADHERENCE-CONCERN-001',
			category: 'adherence-concern',
			priority: 'medium',
			description: `${adherenceIssues.length} medicine(s) with partial or poor adherence (${names})`,
			suggestedAction:
				'Explore the reasons for non-adherence with the patient and agree practical support.'
		});
	}

	// ─── High-risk medicine without indication (HIGH) ───────────
	const highRiskNoIndication = medicines.filter(
		(m) =>
			m.isHighRisk === 'yes' && (m.indicationRecorded === 'no' || (m.indication || '').trim() === '')
	);
	if (highRiskNoIndication.length > 0) {
		const names = highRiskNoIndication.map((m, i) => m.drugName || `Medicine ${i + 1}`).join(', ');
		flags.push({
			id: 'F-HIGH-RISK-NO-INDICATION-001',
			category: 'high-risk-no-indication',
			priority: 'high',
			description: `${highRiskNoIndication.length} high-risk medicine(s) without a recorded indication (${names})`,
			suggestedAction:
				'Confirm and document the indication for each high-risk medicine, or review for stopping.'
		});
	}

	// ─── Incomplete review (LOW) ────────────────────────────────
	if (grade.reviewStatus === 'incomplete') {
		flags.push({
			id: 'F-INCOMPLETE-001',
			category: 'incomplete',
			priority: 'low',
			description:
				'Required sections are not finished — the burden indicator may understate risk',
			suggestedAction:
				'Complete the problems, medicines, monitoring, goals and plan sections, then mark the review finished.'
		});
	}

	// Sort: high > medium > low.
	const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
