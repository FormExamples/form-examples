import type {
	AssessmentData,
	Classification,
	CriterionResult,
	FiredRule,
	GradingResult
} from './types';
import { percRules } from './perc-rules';
import { detectFlaggedIssues } from './flagged-issues';

/**
 * Evaluate the eight PERC criterion rules, returning one CriterionResult per
 * criterion plus an audit trail of fired rules.
 */
export function evaluateCriteria(data: AssessmentData): {
	criterionResults: CriterionResult[];
	firedRules: FiredRule[];
} {
	const criterionResults: CriterionResult[] = [];
	const firedRules: FiredRule[] = [];
	for (const rule of percRules) {
		let satisfied = false;
		try {
			satisfied = rule.evaluate(data) === true;
		} catch (e) {
			// Rule evaluation failed - log for debugging but continue grading.
			console.warn(`PERC rule ${rule.id} evaluation failed:`, e);
		}
		criterionResults.push({
			number: rule.number,
			criterion: rule.criterion,
			satisfied,
			label: rule.label
		});
		firedRules.push({
			id: rule.id,
			instrument: 'criterion',
			satisfied,
			outcome: satisfied ? 'satisfied' : 'failed',
			category: rule.category,
			description: `Criterion ${rule.number} — ${rule.description} — ${satisfied ? 'SATISFIED' : 'FAILED'}`
		});
	}
	return { criterionResults, firedRules };
}

/**
 * Pure function: compute the full PERC classification for the supplied
 * assessment data. This is a status / classification form — there is NO
 * numeric total, no cut-off, and no band table.
 *
 * Classification algorithm (spec §4):
 *   allCriteriaSatisfied = c1 AND c2 AND ... AND c8   (boolean conjunction)
 *   applicable           = pretestProbability === 'low'
 *   classification       = (applicable AND allCriteriaSatisfied)
 *                            ? 'perc-negative'   // PE excluded, no D-dimer/imaging
 *                            : 'perc-positive';  // proceed to D-dimer / imaging
 *
 * The rule is deliberately conservative: a single failed criterion, or a
 * pre-test probability that is not low, yields 'perc-positive'. A criterion
 * whose input is missing is treated as FAILED (the reassuring state must be
 * positively documented). It is not a count or a sum — one failure is decisive.
 */
export function calculatePercGrade(data: AssessmentData): GradingResult {
	const timestamp = new Date().toISOString();

	// ─── Evaluate the eight criteria ────────────────────────────────
	const { criterionResults, firedRules } = evaluateCriteria(data);
	const allCriteriaSatisfied = criterionResults.every((c) => c.satisfied);
	const failedCriteria = criterionResults.filter((c) => !c.satisfied).map((c) => c.number);

	// ─── Applicability gate (pre-test probability low) ──────────────
	const applicable = data.pretest.pretestProbability === 'low';
	firedRules.push({
		id: 'R-APPLICABILITY-GATE-01',
		instrument: 'gate',
		satisfied: null,
		outcome: applicable ? 'applicable' : 'not-applicable',
		category: 'applicability',
		description: applicable
			? 'Pre-test probability is low — PERC applies'
			: 'Pre-test probability is not low — PERC does not apply; criteria are informational only'
	});

	// ─── Composite classification ───────────────────────────────────
	const classification: Classification =
		applicable && allCriteriaSatisfied ? 'perc-negative' : 'perc-positive';
	firedRules.push({
		id: 'R-CLASSIFICATION-01',
		instrument: 'composite',
		satisfied: null,
		outcome: classification,
		category: 'classification',
		description:
			classification === 'perc-negative'
				? 'Pre-test probability low AND all eight criteria satisfied — PERC-negative; PE excluded without D-dimer or imaging'
				: 'Pre-test probability not low, or at least one criterion failed — PERC-positive; proceed to D-dimer and/or imaging'
	});

	return {
		classification,
		allCriteriaSatisfied,
		applicable,
		criterionResults,
		failedCriteria,
		firedRules,
		flaggedIssues: detectFlaggedIssues(data, classification),
		timestamp
	};
}
