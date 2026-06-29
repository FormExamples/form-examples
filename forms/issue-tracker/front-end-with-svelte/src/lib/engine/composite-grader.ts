import type { CompositePriority, FiredRule, GradeResult, IssueTrackerAssessment } from './types';
import { gradePriority } from './priority-rules';
import { gradeSeverity } from './severity-rules';
import { gradeMagnitude } from './magnitude-rules';
import { gradeHarm } from './harm-rules';
import { gradeFailure } from './failure-rules';
import { gradeMoscow } from './moscow-rules';
import { gradeFrequency } from './frequency-rules';
import { computeFlags } from './flagged-issues';
import { bandToCompositePriority, maxBand } from './utils';

// Top-level scoring entrypoint. Takes a complete IssueTrackerAssessment and
// returns the seven raw scores, the composite priority, fired rules, and
// safety flags.
//
// Algorithm: max-grade. The composite is the worst single-dimension band
// across all seven instruments. The composite is `low` only when *every*
// instrument is in its low band.
export function gradeIssue(data: IssueTrackerAssessment): GradeResult {
	const priority = gradePriority(data.scores);
	const severity = gradeSeverity(data.scores);
	const magnitude = gradeMagnitude(data.scores);
	const harm = gradeHarm(data.scores);
	const failure = gradeFailure(data.scores);
	const moscow = gradeMoscow(data.scores);
	const frequency = gradeFrequency(data.scores);

	const compositeBand = maxBand(
		priority.band,
		severity.band,
		magnitude.band,
		harm.band,
		failure.band,
		moscow.band,
		frequency.band,
	);
	const compositePriority: CompositePriority = bandToCompositePriority(compositeBand);

	const firedRules: FiredRule[] = [
		...priority.firedRules,
		...severity.firedRules,
		...magnitude.firedRules,
		...harm.firedRules,
		...failure.firedRules,
		...moscow.firedRules,
		...frequency.firedRules,
		{
			ruleId: `R-COMPOSITE-${compositePriority.toUpperCase()}`,
			instrument: 'composite',
			grade: compositePriority,
			category: 'composite',
			description: `Composite priority is ${compositePriority} — the worst band across all seven instruments.`,
			band: compositeBand,
		},
	];

	const additionalFlags = computeFlags(data);

	return {
		scoreByPriorityRank: data.scores.scoreByPriorityRank,
		scoreBySeverityOfImpact: data.scores.scoreBySeverityOfImpact,
		scoreByMagnitudeOfDamage: data.scores.scoreByMagnitudeOfDamage,
		scoreByHarmGrade: data.scores.scoreByHarmGrade,
		scoreByFailureCondition: data.scores.scoreByFailureCondition,
		scoreByMoscowRequirement: data.scores.scoreByMoscowRequirement,
		scoreByFrequencyPercent: data.scores.scoreByFrequencyPercent,
		compositePriority,
		firedRules,
		additionalFlags,
	};
}
