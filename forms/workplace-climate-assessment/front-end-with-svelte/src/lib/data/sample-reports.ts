import type { AssessmentData, ClimateCategory, GradedDomainKey } from '$lib/engine/types';
import { gradeClimate } from '$lib/engine/grader';
import { GRADED_DOMAIN_KEYS } from '$lib/engine/rules';
import { categoryRank, domainLabel, optionLabel, DEPARTMENT_OPTIONS } from '$lib/engine/utils';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

/** A sample response: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	department: string;
	submittedDate: string;
	data: AssessmentData;
}

/** A row in the leadership dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	department: string;
	submittedDate: string;
	compositeScore: number | null;
	category: ClimateCategory;
	worstDomain: string;
	recommend: string;
	flagCount: number;
}

/** Fill every item of a domain with one value. */
function setDomain(d: AssessmentData, key: GradedDomainKey, values: number[]) {
	const section = d[key] as unknown as Record<string, number | null>;
	const ids = Object.keys(section);
	ids.forEach((id, i) => {
		section[id] = values[i] ?? values[values.length - 1] ?? null;
	});
}

/** A thriving response: high agreement across every domain. */
function thriving(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		department: 'engineering',
		tenureBand: '3-to-5-years',
		hoursBand: 'full-time-35-to-44',
		roleLevel: 'individual-contributor',
		workLocation: 'hybrid'
	};
	for (const key of GRADED_DOMAIN_KEYS) setDomain(d, key, [5, 5, 4, 5, 5]);
	d.overall = {
		oc1: 5,
		oc2: 5,
		oc3: 5,
		recommendAsPlaceToWork: 'definitely',
		biggestStrength: '',
		biggestImprovement: '',
		otherComments: ''
	};
	return d;
}

/** A developing response: mixed agreement, a couple of softer domains. */
function developing(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		department: 'customer-service',
		tenureBand: '1-to-3-years',
		hoursBand: 'full-time-35-to-44',
		roleLevel: 'team-lead',
		workLocation: 'on-site'
	};
	setDomain(d, 'leadership', [3, 4, 3, 3, 3]);
	setDomain(d, 'psychSafety', [3, 3, 4, 3, 3]);
	setDomain(d, 'inclusion', [3, 3, 3, 3, 4]);
	setDomain(d, 'communication', [3, 2, 3, 3]);
	setDomain(d, 'collaboration', [4, 3, 3, 4]);
	setDomain(d, 'recognition', [2, 2, 3, 3]);
	setDomain(d, 'wellbeing', [3, 3, 2, 3, 3]);
	setDomain(d, 'career', [3, 2, 3, 3]);
	d.overall = {
		oc1: 3,
		oc2: 3,
		oc3: 3,
		recommendAsPlaceToWork: 'probably',
		biggestStrength: 'My immediate team is supportive and helps each other out.',
		biggestImprovement: 'Clearer recognition for good work would make a real difference.',
		otherComments: ''
	};
	return d;
}

/** A strained response: low scores across most domains, retention risk. */
function strained(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		department: 'operations',
		tenureBand: '5-to-10-years',
		hoursBand: 'long-hours-45-plus',
		roleLevel: 'individual-contributor',
		workLocation: 'on-site'
	};
	setDomain(d, 'leadership', [2, 3, 2, 2, 2]);
	setDomain(d, 'psychSafety', [2, 2, 3, 2, 2]);
	setDomain(d, 'inclusion', [2, 2, 3, 2, 2]);
	setDomain(d, 'communication', [2, 2, 2, 2]);
	setDomain(d, 'collaboration', [3, 2, 2, 3]);
	setDomain(d, 'recognition', [1, 2, 2, 2]);
	setDomain(d, 'wellbeing', [1, 2, 1, 2, 2]);
	setDomain(d, 'career', [2, 1, 2, 2]);
	d.overall = {
		oc1: 2,
		oc2: 2,
		oc3: 2,
		recommendAsPlaceToWork: 'probably-not',
		biggestStrength: '',
		biggestImprovement: 'Workloads are unsustainable and time off is hard to take.',
		otherComments: ''
	};
	return d;
}

/** A critical response: very low scores, psychological-safety red flags. */
function critical(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		department: 'finance',
		tenureBand: 'less-than-1-year',
		hoursBand: 'full-time-35-to-44',
		roleLevel: 'individual-contributor',
		workLocation: 'remote'
	};
	setDomain(d, 'leadership', [1, 1, 1, 2, 1]);
	setDomain(d, 'psychSafety', [1, 1, 2, 1, 1]);
	setDomain(d, 'inclusion', [1, 1, 2, 1, 1]);
	setDomain(d, 'communication', [1, 1, 2, 1]);
	setDomain(d, 'collaboration', [2, 1, 1, 2]);
	setDomain(d, 'recognition', [1, 1, 1, 1]);
	setDomain(d, 'wellbeing', [1, 1, 1, 2, 1]);
	setDomain(d, 'career', [1, 1, 1, 2]);
	d.overall = {
		oc1: 1,
		oc2: 1,
		oc3: 1,
		recommendAsPlaceToWork: 'definitely-not',
		biggestStrength: '',
		biggestImprovement: 'Leadership needs to listen; raising concerns goes nowhere.',
		otherComments: ''
	};
	return d;
}

/** The sample responses, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'WC-2026-0001', department: 'Engineering / IT', submittedDate: '2026-06-10', data: thriving() },
	{ id: 'WC-2026-0002', department: 'Customer Service', submittedDate: '2026-06-12', data: developing() },
	{ id: 'WC-2026-0003', department: 'Operations', submittedDate: '2026-06-15', data: strained() },
	{ id: 'WC-2026-0004', department: 'Finance', submittedDate: '2026-06-18', data: critical() }
];

/** The lowest-scoring graded domain (the team's biggest concern). */
function worstDomainLabel(data: AssessmentData): string {
	const g = gradeClimate(data);
	let worst: GradedDomainKey | null = null;
	let worstScore = Infinity;
	let worstRank = -1;
	for (const key of GRADED_DOMAIN_KEYS) {
		const r = g.domainScores[key];
		if (!r || r.score === null) continue;
		const rank = categoryRank(r.category);
		if (r.score < worstScore || (r.score === worstScore && rank > worstRank)) {
			worstScore = r.score;
			worstRank = rank;
			worst = key;
		}
	}
	return worst ? domainLabel(worst) : '—';
}

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeClimate(s.data);
	return {
		id: s.id,
		department: s.department,
		submittedDate: s.submittedDate,
		compositeScore: g.compositeScore,
		category: g.category,
		worstDomain: worstDomainLabel(s.data),
		recommend: optionLabel(
			// Recommend choice → friendly short label.
			[
				{ value: 'definitely', label: 'Definitely' },
				{ value: 'probably', label: 'Probably' },
				{ value: 'unsure', label: 'Unsure' },
				{ value: 'probably-not', label: 'Probably not' },
				{ value: 'definitely-not', label: 'Definitely not' }
			],
			s.data.overall.recommendAsPlaceToWork
		),
		flagCount: g.additionalFlags.length
	};
});

// Re-exported so dashboard filters can build a department list if needed.
export { DEPARTMENT_OPTIONS };
