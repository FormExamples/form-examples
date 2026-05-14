import type { FiredFlag, FlagCode, FlagPriority, ObjectiveAssessment } from './types';

function add(flags: FiredFlag[], code: FlagCode, priority: FlagPriority, description: string) {
	flags.push({ flagCode: code, priority, description });
}

function daysBetween(a: string, b: string): number {
	return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000);
}

export function computeFlags(a: ObjectiveAssessment): FiredFlag[] {
	const flags: FiredFlag[] = [];
	const s = a.scores;
	const c = a.context;

	if (s.alignmentGrade !== null && s.alignmentGrade <= 2) {
		add(flags, 'mis-aligned', 'high', `Alignment grade ${s.alignmentGrade}/5 — mis-aligned with parent / theme.`);
	}
	if (['individual', 'team', 'department'].includes(c.level) && c.parentObjectiveId === null) {
		add(flags, 'orphaned', 'high', `Level ${c.level} but no parent_objective_id set.`);
	}
	if (s.smartQuality !== null && s.smartQuality <= 1) {
		add(flags, 'non-smart', 'high', `SMART quality ${s.smartQuality}/5 — objective is poorly formed.`);
	}
	const krTypes = a.keyResults.map((k) => k.krType);
	if (krTypes.length > 0 && !krTypes.some((t) => t === 'numeric' || t === 'milestone')) {
		add(flags, 'unmeasurable', 'high', 'No KR is numeric or milestone — objective is unmeasurable.');
	}
	if (!c.driPresent) {
		add(flags, 'no-dri', 'high', 'No DRI assigned.');
	}
	if (s.stretchTier === 1 && s.progressPercent !== null && s.progressPercent < 50 && c.cycleStartDate && c.cycleEndDate) {
		const total = daysBetween(c.cycleStartDate, c.cycleEndDate);
		const elapsed = daysBetween(c.cycleStartDate, a.now);
		if (total > 0 && elapsed / total >= 0.5) {
			add(flags, 'committed-at-risk', 'high', 'Committed objective behind ≥50% of cycle elapsed and progress <50%.');
		}
	}
	if (s.paceDeviationPercent !== null && s.paceDeviationPercent <= -50) {
		add(flags, 'pace-collapse', 'high', `Pace deviation ${s.paceDeviationPercent}% — collapsing.`);
	}
	if (c.previousConfidenceDecile !== null && s.confidenceDecile !== null && c.previousConfidenceDecile - s.confidenceDecile >= 3) {
		add(flags, 'confidence-collapse', 'medium', `Confidence dropped ${c.previousConfidenceDecile - s.confidenceDecile} deciles since last check-in.`);
	}
	if (c.checkedInAt && c.cycleStartDate && c.cycleEndDate) {
		const totalDays = daysBetween(c.cycleStartDate, c.cycleEndDate);
		const since = daysBetween(c.checkedInAt, a.now);
		const threshold = Math.max(14, Math.round(totalDays * 0.25));
		if (since > threshold) {
			add(flags, 'stale-check-in', 'medium', `${since} days since last check-in (threshold ${threshold}).`);
		}
	}
	const closed = ['retired', 'cancelled', 'missed'];
	if (c.parentObjectiveStatus !== null && closed.includes(c.parentObjectiveStatus)) {
		add(flags, 'cascading-broken', 'medium', `Parent objective is ${c.parentObjectiveStatus} — cascade is broken.`);
	}
	if (a.keyResults.length > 5) {
		add(flags, 'over-scoped', 'low', `${a.keyResults.length} KRs — exceeds the 5-KR cap.`);
	}
	if (s.stretchTier === 3 && s.progressPercent !== null && s.progressPercent >= 70) {
		add(flags, 'moonshot-progress', 'low', `Moonshot at ${s.progressPercent}% — worth recognising.`);
	}
	return flags;
}
