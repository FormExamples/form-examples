import type { AgileAssessment, Maturity } from '$lib/engine/types.js';
import { calculateMaturity } from '$lib/engine/composite-grader.js';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte.js';

/** A sample assessment: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	respondentName: string;
	role: string;
	team: string;
	organisation: string;
	assessedDate: string;
	data: AgileAssessment;
}

/** A row in the coaching dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	respondent: string;
	role: string;
	team: string;
	assessedDate: string;
	answered: number;
	meanScore: number | null;
	maturity: Maturity;
	weakCount: number;
	flagCount: number;
}

/** Apply a list of principle scores (1..12) to a fresh assessment. */
function withScores(scores: (number | null)[]): AgileAssessment {
	const d = createDefaultAssessment();
	scores.forEach((s, i) => {
		if (i < d.responses.length) d.responses[i].score = s as AgileAssessment['responses'][number]['score'];
	});
	return d;
}

/** An optimising team: consistently high scores across the principles. */
function optimising(): AgileAssessment {
	const d = withScores([5, 5, 4, 5, 5, 4, 5, 4, 5, 4, 5, 5]);
	d.respondent = {
		...d.respondent,
		fullName: 'Alice Hopper',
		role: 'scrum-master',
		teamName: 'Aurora',
		organisationName: 'Acme Engineering',
		yearsInAgile: 8,
		assessmentDate: '2026-04-12',
		assessmentPeriod: 'quarter'
	};
	d.actionPlan = {
		...d.actionPlan,
		topAction1: 'Keep shrinking batch size on the highest-throughput stream.',
		topAction2: 'Continue tracking outcome metrics over output proxies.'
	};
	return d;
}

/** A mature team: strong, with one persistent weak principle. */
function mature(): AgileAssessment {
	const d = withScores([4, 4, 4, 4, 4, 4, 4, 3, 2, 3, 4, 4]);
	d.respondent = {
		...d.respondent,
		fullName: 'Ben Carter',
		role: 'engineering-manager',
		teamName: 'Borealis',
		organisationName: 'Acme Engineering',
		yearsInAgile: 6,
		assessmentDate: '2026-04-13',
		assessmentPeriod: 'quarter'
	};
	d.actionPlan = {
		...d.actionPlan,
		topAction1: 'Carve out explicit weekly capacity for tests and refactoring.'
	};
	return d;
}

/** A developing team: middling scores with a couple of low principles. */
function developing(): AgileAssessment {
	const d = withScores([4, 3, 2, 3, 4, 3, 3, 3, 2, 3, 3, 3]);
	d.respondent = {
		...d.respondent,
		fullName: 'Chris Diaz',
		role: 'product-owner',
		teamName: 'Cygnus',
		organisationName: 'Acme Engineering',
		yearsInAgile: 4,
		assessmentDate: '2026-04-15',
		assessmentPeriod: 'quarter'
	};
	return d;
}

/** An initial team: several low principles, command-and-control culture. */
function initial(): AgileAssessment {
	const d = withScores([3, 2, 2, 2, 2, 3, 3, 2, 3, 3, 1, 2]);
	d.respondent = {
		...d.respondent,
		fullName: 'Dana Patel',
		role: 'agile-coach',
		teamName: 'Draco',
		organisationName: 'Acme Engineering',
		yearsInAgile: 3,
		assessmentDate: '2026-04-16',
		assessmentPeriod: 'half-year'
	};
	return d;
}

/** An ad-hoc team: predominantly low scores, multiple critical gaps. */
function adHoc(): AgileAssessment {
	const d = withScores([1, 1, 2, 2, 1, 2, 2, 1, 2, 2, 1, 1]);
	d.respondent = {
		...d.respondent,
		isAnonymous: true,
		teamName: 'Eridanus',
		organisationName: 'Acme Engineering',
		assessmentDate: '2026-04-17',
		assessmentPeriod: 'ad-hoc'
	};
	return d;
}

/** An incomplete submission: fewer than six principles answered. */
function insufficient(): AgileAssessment {
	const d = withScores([4, 3, null, null, 4, null, null, null, null, null, null, null]);
	d.respondent = {
		...d.respondent,
		fullName: 'Farah Lopez',
		role: 'team-lead',
		teamName: 'Fornax',
		organisationName: 'Acme Engineering',
		yearsInAgile: 2,
		assessmentDate: '2026-04-18',
		assessmentPeriod: 'sprint'
	};
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'AP-2026-0001', respondentName: 'Alice Hopper', role: 'scrum-master', team: 'Aurora', organisation: 'Acme Engineering', assessedDate: '2026-04-12', data: optimising() },
	{ id: 'AP-2026-0002', respondentName: 'Ben Carter', role: 'engineering-manager', team: 'Borealis', organisation: 'Acme Engineering', assessedDate: '2026-04-13', data: mature() },
	{ id: 'AP-2026-0003', respondentName: 'Chris Diaz', role: 'product-owner', team: 'Cygnus', organisation: 'Acme Engineering', assessedDate: '2026-04-15', data: developing() },
	{ id: 'AP-2026-0004', respondentName: 'Dana Patel', role: 'agile-coach', team: 'Draco', organisation: 'Acme Engineering', assessedDate: '2026-04-16', data: initial() },
	{ id: 'AP-2026-0005', respondentName: 'Anonymous', role: '', team: 'Eridanus', organisation: 'Acme Engineering', assessedDate: '2026-04-17', data: adHoc() },
	{ id: 'AP-2026-0006', respondentName: 'Farah Lopez', role: 'team-lead', team: 'Fornax', organisation: 'Acme Engineering', assessedDate: '2026-04-18', data: insufficient() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateMaturity(s.data);
	return {
		id: s.id,
		respondent: s.data.respondent.isAnonymous ? 'Anonymous' : s.respondentName,
		role: s.data.respondent.isAnonymous ? '' : s.role,
		team: s.team,
		assessedDate: s.assessedDate,
		answered: g.answeredCount,
		meanScore: g.meanScore,
		maturity: g.maturity,
		weakCount: g.perPrincipleBands.filter((b) => b === 'low').length,
		flagCount: g.additionalFlags.length
	};
});
