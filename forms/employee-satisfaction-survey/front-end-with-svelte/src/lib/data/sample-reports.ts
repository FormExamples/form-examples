import type {
	AssessmentData,
	SatisfactionCategory,
	ENpsClassification
} from '$lib/engine/types';
import { gradeSatisfaction } from '$lib/engine/grader';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';
import { DEPARTMENT_OPTIONS, TENURE_OPTIONS, type OptionItem } from '$lib/engine/rules';

/** A sample survey: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	/** Anonymised respondent label (department + tenure band). */
	respondent: string;
	submittedDate: string;
	data: AssessmentData;
}

/** A row in the HR dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	department: string;
	tenure: string;
	submittedDate: string;
	compositeScore: number | null;
	category: SatisfactionCategory;
	enps: ENpsClassification;
	retentionRisk: boolean;
	flagCount: number;
}

function labelFor(options: OptionItem[], value: string): string {
	return options.find((o) => o.value === value)?.label ?? value;
}

/** A high-satisfaction survey: mostly "agree" / "strongly agree", a promoter. */
function excellent(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { department: 'engineering', tenureBand: '3-to-5-years', hoursBand: 'full-time-35-to-44' };
	d.roleTenure = { roleLevel: 'individual-contributor', workLocation: 'hybrid', rt1: 5, rt2: 5 };
	d.workload = { wl1: 5, wl2: 5, wl3: 4, wl4: 5, wl5: 5 };
	d.management = { mg1: 5, mg2: 5, mg3: 5, mg4: 4, mg5: 5 };
	d.growth = { gr1: 5, gr2: 4, gr3: 5, gr4: 5 };
	d.compensation = { cb1: 5, cb2: 4, cb3: 5, cb4: 4 };
	d.culture = { cu1: 5, cu2: 5, cu3: 5, cu4: 5, cu5: 4 };
	d.environment = { en1: 5, en2: 5, en3: 5, en4: 5 };
	d.recognition = { rc1: 5, rc2: 5, rc3: 4, rc4: 5 };
	d.overall = {
		ov1: 5, ov2: 5, ov3: 5, ov4: 5,
		recommendScore: 10,
		retentionIntent: 'definitely-stay',
		suggestionsForImprovement: '',
		otherComments: ''
	};
	return d;
}

/** An above-average survey with minor improvement areas; a passive eNPS. */
function good(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { department: 'operations', tenureBand: '5-to-10-years', hoursBand: 'full-time-35-to-44' };
	d.roleTenure = { roleLevel: 'team-lead', workLocation: 'on-site', rt1: 4, rt2: 4 };
	d.workload = { wl1: 4, wl2: 3, wl3: 4, wl4: 4, wl5: 4 };
	d.management = { mg1: 4, mg2: 4, mg3: 4, mg4: 3, mg5: 4 };
	d.growth = { gr1: 4, gr2: 3, gr3: 4, gr4: 4 };
	d.compensation = { cb1: 3, cb2: 4, cb3: 3, cb4: 3 };
	d.culture = { cu1: 4, cu2: 4, cu3: 4, cu4: 4, cu5: 4 };
	d.environment = { en1: 4, en2: 4, en3: 4, en4: 5 };
	d.recognition = { rc1: 3, rc2: 4, rc3: 4, rc4: 4 };
	d.overall = {
		ov1: 4, ov2: 4, ov3: 4, ov4: 4,
		recommendScore: 8,
		retentionIntent: 'probably-stay',
		suggestionsForImprovement: 'More regular one-to-ones would help.',
		otherComments: ''
	};
	return d;
}

/** A below-average survey requiring significant improvement; a detractor. */
function poor(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { department: 'customer-service', tenureBand: '1-to-3-years', hoursBand: 'long-hours-45-plus' };
	d.roleTenure = { roleLevel: 'individual-contributor', workLocation: 'on-site', rt1: 2, rt2: 2 };
	d.workload = { wl1: 2, wl2: 1, wl3: 1, wl4: 2, wl5: 2 };
	d.management = { mg1: 3, mg2: 2, mg3: 2, mg4: 2, mg5: 2 };
	d.growth = { gr1: 2, gr2: 2, gr3: 2, gr4: 3 };
	d.compensation = { cb1: 2, cb2: 2, cb3: 1, cb4: 2 };
	d.culture = { cu1: 3, cu2: 3, cu3: 3, cu4: 3, cu5: 2 };
	d.environment = { en1: 3, en2: 2, en3: 3, en4: 3 };
	d.recognition = { rc1: 2, rc2: 2, rc3: 2, rc4: 2 };
	d.overall = {
		ov1: 2, ov2: 2, ov3: 2, ov4: 2,
		recommendScore: 4,
		retentionIntent: 'probably-leave-12-months',
		suggestionsForImprovement: 'Workload is unsustainable; please hire more staff.',
		otherComments: ''
	};
	return d;
}

/** A critically deficient survey requiring urgent action; a detractor leaving soon. */
function veryPoor(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { department: 'sales-marketing', tenureBand: 'less-than-1-year', hoursBand: 'long-hours-45-plus' };
	d.roleTenure = { roleLevel: 'individual-contributor', workLocation: 'remote', rt1: 1, rt2: 1 };
	d.workload = { wl1: 1, wl2: 1, wl3: 1, wl4: 1, wl5: 1 };
	d.management = { mg1: 1, mg2: 1, mg3: 1, mg4: 1, mg5: 1 };
	d.growth = { gr1: 1, gr2: 1, gr3: 1, gr4: 2 };
	d.compensation = { cb1: 1, cb2: 1, cb3: 1, cb4: 1 };
	d.culture = { cu1: 1, cu2: 2, cu3: 1, cu4: 2, cu5: 1 };
	d.environment = { en1: 2, en2: 1, en3: 1, en4: 2 };
	d.recognition = { rc1: 1, rc2: 1, rc3: 1, rc4: 1 };
	d.overall = {
		ov1: 1, ov2: 1, ov3: 1, ov4: 1,
		recommendScore: 1,
		retentionIntent: 'leaving-within-6-months',
		suggestionsForImprovement: 'Leadership needs to listen to staff.',
		otherComments: ''
	};
	return d;
}

/** The sample surveys, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'ESS-2026-0001', respondent: 'Engineering / IT · 3–5 years', submittedDate: '2026-06-10', data: excellent() },
	{ id: 'ESS-2026-0002', respondent: 'Operations · 5–10 years', submittedDate: '2026-06-12', data: good() },
	{ id: 'ESS-2026-0003', respondent: 'Customer Service · 1–3 years', submittedDate: '2026-06-15', data: poor() },
	{ id: 'ESS-2026-0004', respondent: 'Sales / Marketing · <1 year', submittedDate: '2026-06-18', data: veryPoor() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeSatisfaction(s.data);
	const intent = s.data.overall.retentionIntent;
	return {
		id: s.id,
		department: labelFor(DEPARTMENT_OPTIONS, s.data.demographics.department),
		tenure: labelFor(TENURE_OPTIONS, s.data.demographics.tenureBand),
		submittedDate: s.submittedDate,
		compositeScore: g.compositeScore,
		category: g.category,
		enps: g.eNPS.classification,
		retentionRisk: intent === 'leaving-within-6-months' || intent === 'probably-leave-12-months',
		flagCount: g.additionalFlags.length
	};
});
