import type {
	AssessmentData,
	Outcome,
	FiredRule,
	CategoryFindings,
	SeverityGrade,
	GradingResult
} from './types';
import { safetyRules } from './safety-rules';
import { gradeToFindingLevel } from './utils';
import { detectAdditionalFlags } from './flagged-issues';

// Workplace Safety Assessment grader. Pure functions: take an `AssessmentData`
// object, return the overall outcome, the per-category findings tally, and the
// list of rules that fired (compliant + non-compliant).
//
// Outcome rules:
//   any rule fired at grade 4         -> 'critical'
//   any rule fired at grade 3 (no 4s) -> 'major'
//   any rule fired at grade 2 (no 3-4) -> 'minor'
//   only grade-1 rules                 -> 'compliant'
//
// Rules that score 0 are unanswered and excluded entirely from the totals (so a
// partially-completed audit does not auto-fail).

/** Determine the worst outcome from a set of fired rules. */
export function highestOutcome(firedRules: FiredRule[]): Outcome {
	let worst = 1;
	for (const r of firedRules) {
		if (r.grade > worst) worst = r.grade;
	}
	return gradeToFindingLevel(worst);
}

/** Evaluate the workplace safety audit checklist against the supplied data. */
export function gradeSafety(data: AssessmentData): GradingResult {
	const firedRules: FiredRule[] = [];
	const findingsByCategory: Record<string, CategoryFindings> = {};
	let answeredCount = 0;

	for (const rule of safetyRules) {
		let grade: number;
		try {
			grade = rule.evaluate(data);
		} catch (e) {
			console.warn(`Safety rule ${rule.id} evaluation failed:`, e);
			continue;
		}

		if (grade === 0) continue; // unanswered
		answeredCount++;

		const g = grade as SeverityGrade;
		firedRules.push({
			id: rule.id,
			category: rule.category,
			description: rule.description,
			grade: g
		});

		if (!findingsByCategory[rule.category]) {
			findingsByCategory[rule.category] = {
				category: rule.category,
				compliant: 0,
				minor: 0,
				major: 0,
				critical: 0,
				total: 0
			};
		}
		const bucket = findingsByCategory[rule.category];
		bucket.total++;
		if (g === 4) bucket.critical++;
		else if (g === 3) bucket.major++;
		else if (g === 2) bucket.minor++;
		else bucket.compliant++;
	}

	const outcome: Outcome = answeredCount === 0 ? 'compliant' : highestOutcome(firedRules);

	return {
		outcome,
		findingsByCategory,
		firedRules,
		additionalFlags: detectAdditionalFlags(data),
		answeredCount,
		timestamp: new Date().toISOString()
	};
}
