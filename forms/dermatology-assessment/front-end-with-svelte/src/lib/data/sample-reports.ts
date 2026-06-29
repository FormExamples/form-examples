import type { AssessmentData } from '$lib/engine/types';
import { calculateDLQI } from '$lib/engine/dlqi-grader';
import { detectAdditionalFlags } from '$lib/engine/flagged-issues';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

/** A sample assessment: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	patientName: string;
	assessedDate: string;
	data: AssessmentData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientName: string;
	assessedDate: string;
	dlqiScore: number;
	dlqiCategory: string;
	flagCount: number;
}

/** Build a sample with the given per-question DLQI answers (each 0–3). */
function sample(
	firstName: string,
	lastName: string,
	dob: string,
	sex: 'male' | 'female' | 'other',
	q: number[]
): AssessmentData {
	const a = createDefaultAssessment();
	a.demographics = { ...a.demographics, firstName, lastName, dateOfBirth: dob, sex, skinType: 'III' };
	a.chiefComplaint = { ...a.chiefComplaint, primaryConcern: 'Itchy rash', duration: 'months' };
	a.dlqiQuestionnaire = {
		q1: q[0], q2: q[1], q3: q[2], q4: q[3], q5: q[4],
		q6: q[5], q7: q[6], q8: q[7], q9: q[8], q10: q[9]
	} as never;
	return a;
}

const fill = (v: number, n = 10) => Array.from({ length: 10 }, (_, i) => (i < n ? v : 0));

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'DE-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-10', data: sample('John', 'Smith', '1990-04-12', 'male', fill(0)) },
	{ id: 'DE-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-12', data: sample('Priya', 'Patel', '1985-09-30', 'female', fill(1, 4)) },
	{ id: 'DE-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-15', data: sample('Margaret', 'Jones', '1972-01-22', 'female', fill(2, 7)) },
	{ id: 'DE-2026-0004', patientName: 'Williams, David', assessedDate: '2026-06-18', data: sample('David', 'Williams', '1968-11-03', 'male', fill(3)) }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const { dlqiScore, dlqiCategoryLabel } = calculateDLQI(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		dlqiScore,
		dlqiCategory: dlqiCategoryLabel,
		flagCount: detectAdditionalFlags(s.data).length
	};
});
