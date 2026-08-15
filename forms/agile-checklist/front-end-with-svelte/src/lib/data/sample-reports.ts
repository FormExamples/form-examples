import type { AgileChecklist, Band, Maturity } from '#lib/engine/types.js';
import {
	PRACTICES_ITEMS,
	STAKEHOLDERS_ITEMS,
	TEAMS_ITEMS,
	type ItemDef,
} from '#lib/config/items.js';
import { calculateMaturity } from '#lib/engine/composite-grader.js';
import { createDefaultAssessment } from '#lib/stores/checklist.svelte.js';

/** A sample checklist: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	respondent: string;
	team: string;
	assessedDate: string;
	data: AgileChecklist;
}

/** A row in the coach dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	respondent: string;
	team: string;
	assessedDate: string;
	maturity: Maturity;
	overallPercent: number | null;
	teamsBand: Band;
	stakeholdersBand: Band;
	practicesBand: Band;
	/** The lowest-scoring section, e.g. 'practices', or '' when none is defined. */
	weakSection: string;
	flagCount: number;
}

/** Mark the first `yesCount` items of a section 'yes' and the rest 'no'. */
function answerSection(answers: Record<string, string>, items: ItemDef[], yesCount: number) {
	items.forEach((item, i) => {
		answers[item.id] = i < yesCount ? 'yes' : 'no';
	});
}

/**
 * Build a checklist with the given per-section yes-counts. Every item is
 * answered (no N/A), so each section's applicable count equals its length.
 */
function build(
	yes: { teams: number; stakeholders: number; practices: number },
	respondent: Partial<AgileChecklist['respondent']>,
	actionPlan: Partial<AgileChecklist['actionPlan']> = {},
): AgileChecklist {
	const d = createDefaultAssessment();
	d.respondent = { ...d.respondent, ...respondent };
	d.actionPlan = { ...d.actionPlan, ...actionPlan };
	answerSection(d.answers, TEAMS_ITEMS, yes.teams);
	answerSection(d.answers, STAKEHOLDERS_ITEMS, yes.stakeholders);
	answerSection(d.answers, PRACTICES_ITEMS, yes.practices);
	return d;
}

/** Optimising — uniformly high yes-rates across all three sections (~92%). */
function optimising(): AgileChecklist {
	return build(
		{ teams: 24, stakeholders: 13, practices: 17 },
		{
			fullName: 'Alice Hopper',
			role: 'agile-coach',
			teamName: 'Aurora',
			organisationName: 'Acme Engineering',
			assessmentDate: '2026-06-10',
			assessmentPeriod: 'quarter',
		},
		{ topAction1: 'Protect psychological safety as the team grows.' },
	);
}

/** Mature — strong but not perfect (~78%). */
function mature(): AgileChecklist {
	return build(
		{ teams: 20, stakeholders: 11, practices: 14 },
		{
			fullName: 'Bao Nguyen',
			role: 'scrum-master',
			teamName: 'Borealis',
			organisationName: 'Acme Engineering',
			assessmentDate: '2026-06-12',
			assessmentPeriod: 'quarter',
		},
		{ topAction1: 'Pick the two weakest practices and address them at the system level.' },
	);
}

/** Developing — middling, with practices the weak section (~58%). */
function developing(): AgileChecklist {
	return build(
		{ teams: 16, stakeholders: 9, practices: 8 },
		{
			fullName: 'Carmen Diaz',
			role: 'product-owner',
			teamName: 'Cobalt',
			organisationName: 'Globex',
			assessmentDate: '2026-06-15',
			assessmentPeriod: 'sprint',
		},
		{ topAction1: 'Audit finished-over-WIP and quality-over-deadline discipline.' },
	);
}

/** Ad-hoc — low across the board, stakeholders the binding constraint (~22%). */
function adHoc(): AgileChecklist {
	return build(
		{ teams: 6, stakeholders: 2, practices: 4 },
		{
			fullName: 'Dmitri Volkov',
			role: 'engineering-manager',
			teamName: 'Dusk',
			organisationName: 'Initech',
			assessmentDate: '2026-06-18',
			assessmentPeriod: 'ad-hoc',
		},
		{ topAction1: 'Start with team autonomy, finishing work, and dissent-safety.' },
	);
}

/** The sample checklists, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'AC-2026-0001', respondent: 'Alice Hopper', team: 'Aurora', assessedDate: '2026-06-10', data: optimising() },
	{ id: 'AC-2026-0002', respondent: 'Bao Nguyen', team: 'Borealis', assessedDate: '2026-06-12', data: mature() },
	{ id: 'AC-2026-0003', respondent: 'Carmen Diaz', team: 'Cobalt', assessedDate: '2026-06-15', data: developing() },
	{ id: 'AC-2026-0004', respondent: 'Dmitri Volkov', team: 'Dusk', assessedDate: '2026-06-18', data: adHoc() },
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateMaturity(s.data);
	const sections: { name: string; percent: number | null }[] = [
		{ name: 'teams', percent: g.teams.percent },
		{ name: 'stakeholders', percent: g.stakeholders.percent },
		{ name: 'practices', percent: g.practices.percent },
	];
	const defined = sections.filter((x) => x.percent !== null);
	const weakSection = defined.length
		? defined.reduce((a, b) => ((b.percent as number) < (a.percent as number) ? b : a)).name
		: '';
	return {
		id: s.id,
		respondent: s.respondent,
		team: s.team,
		assessedDate: s.assessedDate,
		maturity: g.maturity,
		overallPercent: g.overallPercent,
		teamsBand: g.teams.band,
		stakeholdersBand: g.stakeholders.band,
		practicesBand: g.practices.band,
		weakSection,
		flagCount: g.additionalFlags.length,
	};
});
