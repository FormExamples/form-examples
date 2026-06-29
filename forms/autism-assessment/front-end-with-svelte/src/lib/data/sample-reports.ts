import type { AssessmentData } from '$lib/engine/types';
import { calculateAQ10 } from '$lib/engine/aq10-grader';
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
	aq10Score: number;
	aq10Category: string;
	flagCount: number;
}

/** Per-question AQ-10 scoring direction (agree vs disagree scores 1). */
const DIR: Record<number, 'agree' | 'disagree'> = {
	1: 'agree', 2: 'disagree', 3: 'disagree', 4: 'disagree', 5: 'disagree',
	6: 'disagree', 7: 'agree', 8: 'agree', 9: 'disagree', 10: 'agree'
};

/** Build a q1..q10 answer set; `scores[i]` true means answer in the scoring direction. */
function answers(scores: boolean[]) {
	const q: Record<string, string> = {};
	for (let i = 1; i <= 10; i++) {
		const d = DIR[i];
		const scoring = d === 'agree' ? 'definitely-agree' : 'definitely-disagree';
		const notScoring = d === 'agree' ? 'definitely-disagree' : 'definitely-agree';
		q[`q${i}`] = scores[i - 1] ? scoring : notScoring;
	}
	return q;
}

function sample(
	firstName: string,
	lastName: string,
	dob: string,
	sex: 'male' | 'female' | 'other',
	scoreCount: number
): AssessmentData {
	const a = createDefaultAssessment();
	a.demographics = { ...a.demographics, firstName, lastName, dateOfBirth: dob, sex };
	a.aq10Questionnaire = answers(Array.from({ length: 10 }, (_, i) => i < scoreCount)) as never;
	return a;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'AT-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-10', data: sample('John', 'Smith', '2012-04-12', 'male', 1) },
	{ id: 'AT-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-12', data: sample('Priya', 'Patel', '2010-09-30', 'female', 4) },
	{ id: 'AT-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-15', data: sample('Margaret', 'Jones', '2008-01-22', 'female', 7) },
	{ id: 'AT-2026-0004', patientName: 'Williams, David', assessedDate: '2026-06-18', data: sample('David', 'Williams', '2009-11-03', 'male', 10) }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const { aq10Score, aq10CategoryLabel } = calculateAQ10(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		aq10Score,
		aq10Category: aq10CategoryLabel,
		flagCount: detectAdditionalFlags(s.data).length
	};
});
