import type { RagBand } from '$engine/types';
import { gradeObjective } from '$engine/composite-grader';
import { createDefaultFormState, type FormData } from '$stores/formState.svelte';

/** A sample objective: an identifier plus the full data the engine grades. */
export interface SampleObjective {
	id: string;
	objectiveTitle: string;
	owner: string;
	updatedDate: string;
	data: FormData;
}

/** A row in the OKR dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	objectiveTitle: string;
	owner: string;
	level: string;
	updatedDate: string;
	rag: RagBand;
	progressPercent: number | null;
	confidenceDecile: number | null;
	flagCount: number;
}

/** Build the assessment input the engine expects from a full form record. */
function assessmentFrom(d: FormData) {
	return {
		scores: d.scores,
		keyResults: d.keyResults,
		context: {
			level: d.cycle.level,
			parentObjectiveId: d.objective.parent_objective_id || null,
			parentObjectiveStatus: null,
			driPresent: !!d.participants.dri,
			cycleStartDate: d.cycle.cycleStartDate || null,
			cycleEndDate: d.cycle.cycleEndDate || null,
			checkedInAt: d.checkIn.narrative ? '2026-06-20T09:00:00.000Z' : null,
			previousConfidenceDecile: null
		},
		now: '2026-06-25T09:00:00.000Z'
	};
}

/** On-track company objective: strong progress, high confidence. */
function onTrack(): FormData {
	const d = createDefaultFormState();
	d.reporter = { name: 'Ada Okafor', email: 'ada@example.com', role: 'VP Product' };
	d.cycle = { level: 'company', cycle: 'quarterly', cycleStartDate: '2026-04-01', cycleEndDate: '2026-06-30' };
	d.objective = {
		obj_title: 'Reach 10,000 active teams',
		obj_long_description: 'Grow weekly active teams to 10k across all plans.',
		strategic_theme: 'Growth',
		parent_objective_id: ''
	};
	d.participants = { dri: 'Ada Okafor', contributors: 'Growth pod', reviewers: 'CEO', stakeholders: 'Board' };
	d.keyResults = [
		{ position: 1, title: 'Weekly active teams', krType: 'numeric', startValue: 6000, currentValue: 9200, targetValue: 10000, milestonesJson: null, binaryDone: null, progressFraction: 0.8 },
		{ position: 2, title: 'Activation rate', krType: 'numeric', startValue: 40, currentValue: 58, targetValue: 60, milestonesJson: null, binaryDone: null, progressFraction: 0.9 }
	];
	d.checkIn = { narrative: 'Strong week, ahead of plan.', since_last_changes: '', blockers: '', asks: '' };
	d.scores = { progressPercent: 82, confidenceDecile: 9, stretchTier: 2, alignmentGrade: 5, impactTier: 5, smartQuality: 5, paceDeviationPercent: 5 };
	d.signature = { signed_by: 'Ada Okafor', override_reason: '', recommendation: '' };
	return d;
}

/** At-risk team objective: middling progress, moderate confidence. */
function atRisk(): FormData {
	const d = createDefaultFormState();
	d.reporter = { name: 'Bo Tran', email: 'bo@example.com', role: 'Eng Manager' };
	d.cycle = { level: 'team', cycle: 'quarterly', cycleStartDate: '2026-04-01', cycleEndDate: '2026-06-30' };
	d.objective = {
		obj_title: 'Cut p95 API latency below 200ms',
		obj_long_description: 'Reduce tail latency on the core API.',
		strategic_theme: 'Reliability',
		parent_objective_id: 'OKR-2026-0001'
	};
	d.participants = { dri: 'Bo Tran', contributors: 'Platform team', reviewers: 'CTO', stakeholders: 'Support' };
	d.keyResults = [
		{ position: 1, title: 'p95 latency (ms)', krType: 'numeric', startValue: 480, currentValue: 300, targetValue: 200, milestonesJson: null, binaryDone: null, progressFraction: 0.5 }
	];
	d.checkIn = { narrative: 'Progress slower than hoped; profiling underway.', since_last_changes: '', blockers: 'Vendor dependency', asks: 'More SRE time' };
	d.scores = { progressPercent: 55, confidenceDecile: 5, stretchTier: 1, alignmentGrade: 4, impactTier: 4, smartQuality: 4, paceDeviationPercent: -20 };
	d.signature = { signed_by: 'Bo Tran', override_reason: '', recommendation: '' };
	return d;
}

/** Off-track individual objective: low progress, low confidence, several flags. */
function offTrack(): FormData {
	const d = createDefaultFormState();
	d.reporter = { name: 'Chen Wei', email: 'chen@example.com', role: 'Designer' };
	d.cycle = { level: 'individual', cycle: 'quarterly', cycleStartDate: '2026-04-01', cycleEndDate: '2026-06-30' };
	d.objective = {
		obj_title: 'Ship the new onboarding flow',
		obj_long_description: 'Redesign and launch onboarding.',
		strategic_theme: '',
		parent_objective_id: ''
	};
	d.participants = { dri: '', contributors: '', reviewers: '', stakeholders: '' };
	d.keyResults = [
		{ position: 1, title: 'Onboarding flow shipped', krType: 'binary', startValue: null, currentValue: null, targetValue: null, milestonesJson: null, binaryDone: false, progressFraction: 0.2 }
	];
	d.checkIn = { narrative: '', since_last_changes: '', blockers: 'Blocked on research', asks: '' };
	d.scores = { progressPercent: 30, confidenceDecile: 2, stretchTier: 1, alignmentGrade: 2, impactTier: 2, smartQuality: 1, paceDeviationPercent: -60 };
	d.signature = { signed_by: '', override_reason: '', recommendation: '' };
	return d;
}

/** Moonshot department objective: aspirational stretch, strong momentum. */
function moonshot(): FormData {
	const d = createDefaultFormState();
	d.reporter = { name: 'Dana Ruiz', email: 'dana@example.com', role: 'Head of Data' };
	d.cycle = { level: 'department', cycle: 'half-yearly', cycleStartDate: '2026-01-01', cycleEndDate: '2026-06-30' };
	d.objective = {
		obj_title: 'Make every report self-serve',
		obj_long_description: 'Eliminate manual reporting requests.',
		strategic_theme: 'Efficiency',
		parent_objective_id: 'OKR-2026-0001'
	};
	d.participants = { dri: 'Dana Ruiz', contributors: 'Data team', reviewers: 'COO', stakeholders: 'All depts' };
	d.keyResults = [
		{ position: 1, title: 'Self-serve report coverage', krType: 'numeric', startValue: 10, currentValue: 75, targetValue: 90, milestonesJson: null, binaryDone: null, progressFraction: 0.75 }
	];
	d.checkIn = { narrative: 'Great momentum on a moonshot.', since_last_changes: '', blockers: '', asks: '' };
	d.scores = { progressPercent: 72, confidenceDecile: 7, stretchTier: 3, alignmentGrade: 4, impactTier: 5, smartQuality: 4, paceDeviationPercent: 0 };
	d.signature = { signed_by: 'Dana Ruiz', override_reason: '', recommendation: '' };
	return d;
}

/** The sample objectives, keyed by stable id (used to seed the wizard). */
export const sampleObjectives: SampleObjective[] = [
	{ id: 'OKR-2026-0001', objectiveTitle: 'Reach 10,000 active teams', owner: 'Ada Okafor', updatedDate: '2026-06-20', data: onTrack() },
	{ id: 'OKR-2026-0002', objectiveTitle: 'Cut p95 API latency below 200ms', owner: 'Bo Tran', updatedDate: '2026-06-21', data: atRisk() },
	{ id: 'OKR-2026-0003', objectiveTitle: 'Ship the new onboarding flow', owner: 'Chen Wei', updatedDate: '2026-06-22', data: offTrack() },
	{ id: 'OKR-2026-0004', objectiveTitle: 'Make every report self-serve', owner: 'Dana Ruiz', updatedDate: '2026-06-23', data: moonshot() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleObjectiveRows: DashboardRow[] = sampleObjectives.map((s) => {
	const g = gradeObjective(assessmentFrom(s.data));
	return {
		id: s.id,
		objectiveTitle: s.objectiveTitle,
		owner: s.owner,
		level: s.data.cycle.level,
		updatedDate: s.updatedDate,
		rag: g.computedCompositeRag,
		progressPercent: s.data.scores.progressPercent,
		confidenceDecile: s.data.scores.confidenceDecile,
		flagCount: g.flags.length
	};
});
