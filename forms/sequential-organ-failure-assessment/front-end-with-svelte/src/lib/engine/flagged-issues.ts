import type { AssessmentData, FlaggedIssue, OrganSystem, SubScores } from './types';
import { systemLabel } from './utils';

/**
 * Detect clinician-facing safety flags (red flags), independent of the total
 * SOFA score (spec §7):
 *
 *   - Severe single-organ failure (high)  — any system sub-score = 4
 *   - Multi-organ failure (high)          — two or more systems sub-scored >= 3
 *   - Rising SOFA (high)                  — deltaSofa >= 2 (drives Sepsis-3)
 *   - Marked deterioration (high)         — deltaSofa >= 4
 *   - High mortality risk (high)          — totalSofa >= 12
 *   - Improving trajectory (low)          — deltaSofa <= -2 (informational)
 *   - Incomplete assessment (medium)      — one or more sub-scores null
 *
 * Rows mirror the `sequential_organ_failure_assessment_grade_flag` SQL table
 * (flag_id, category, priority, description, suggested_action).
 */
export function detectFlaggedIssues(
	data: AssessmentData,
	grade: { subScores: SubScores; totalSofa: number; deltaSofa: number | null }
): FlaggedIssue[] {
	const flags: FlaggedIssue[] = [];
	const { subScores, totalSofa, deltaSofa } = grade;

	const systems: OrganSystem[] = [
		'respiration',
		'coagulation',
		'liver',
		'cardiovascular',
		'cns',
		'renal'
	];
	const failing4 = systems.filter((s) => subScores[s] === 4);
	const failing3plus = systems.filter((s) => subScores[s] !== null && (subScores[s] as number) >= 3);
	const missing = systems.filter((s) => subScores[s] === null);

	// ─── Severe single-organ failure (HIGH) ─────────────────────
	if (failing4.length > 0) {
		const names = failing4.map((s) => systemLabel(s)).join(', ');
		flags.push({
			id: 'F-SEVERE-SINGLE-ORGAN-FAILURE-001',
			category: 'severe-single-organ-failure',
			priority: 'high',
			description: `Maximal (sub-score 4) dysfunction in: ${names}.`,
			suggestedAction:
				'Provide or escalate organ support for the affected system and obtain urgent critical-care review.'
		});
	}

	// ─── Multi-organ failure (HIGH) ─────────────────────────────
	if (failing3plus.length >= 2) {
		const names = failing3plus.map((s) => systemLabel(s)).join(', ');
		flags.push({
			id: 'F-MULTI-ORGAN-FAILURE-001',
			category: 'multi-organ-failure',
			priority: 'high',
			description: `Two or more systems severely dysfunctional (sub-score >= 3): ${names}.`,
			suggestedAction:
				'Manage as multi-organ dysfunction: senior critical-care input, source control, and consideration of full organ support.'
		});
	}

	// ─── Rising SOFA (HIGH) ─────────────────────────────────────
	if (deltaSofa !== null && deltaSofa >= 2) {
		flags.push({
			id: 'F-RISING-SOFA-001',
			category: 'rising-sofa',
			priority: 'high',
			description: `Delta-SOFA +${deltaSofa} versus baseline — deteriorating organ function.`,
			suggestedAction:
				data.baseline.suspectedInfection === 'yes'
					? 'Meets the Sepsis-3 criterion: commence the sepsis six and escalate to critical care.'
					: 'Reassess for a precipitant, review the management plan, and consider critical-care escalation.'
		});
	}

	// ─── Marked deterioration (HIGH) ────────────────────────────
	if (deltaSofa !== null && deltaSofa >= 4) {
		flags.push({
			id: 'F-MARKED-DETERIORATION-001',
			category: 'marked-deterioration',
			priority: 'high',
			description: `Delta-SOFA +${deltaSofa} over the interval — marked deterioration.`,
			suggestedAction:
				'Urgent review: a rapidly rising SOFA over the first 48 hours predicts a mortality of at least 50%.'
		});
	}

	// ─── High mortality risk (HIGH) ─────────────────────────────
	if (totalSofa >= 12) {
		flags.push({
			id: 'F-HIGH-MORTALITY-RISK-001',
			category: 'high-mortality-risk',
			priority: 'high',
			description: `Total SOFA ${totalSofa} of 24 — high predicted ICU mortality.`,
			suggestedAction:
				'Ensure ceilings of care and treatment-escalation plans are documented and discussed with the patient / family.'
		});
	}

	// ─── Improving trajectory (LOW) ─────────────────────────────
	if (deltaSofa !== null && deltaSofa <= -2) {
		flags.push({
			id: 'F-IMPROVING-TRAJECTORY-001',
			category: 'improving-trajectory',
			priority: 'low',
			description: `Delta-SOFA ${deltaSofa} versus baseline — improving organ function.`,
			suggestedAction:
				'Continue current management; consider de-escalation of organ support as tolerated.'
		});
	}

	// ─── Incomplete assessment (MEDIUM) ─────────────────────────
	if (missing.length > 0) {
		const names = missing.map((s) => systemLabel(s)).join(', ');
		flags.push({
			id: 'F-INCOMPLETE-ASSESSMENT-001',
			category: 'incomplete-assessment',
			priority: 'medium',
			description: `Systems not scored (missing input): ${names} — the total may understate risk.`,
			suggestedAction: 'Record the missing physiology / laboratory value(s) and re-score.'
		});
	}

	// Sort: high > medium > low.
	const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
