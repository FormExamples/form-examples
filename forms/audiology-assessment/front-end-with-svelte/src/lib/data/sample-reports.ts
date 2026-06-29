import type { AssessmentData, HearingGrade } from '$lib/engine/types';
import { calculateHearingGrade } from '$lib/engine/hearing-grader';
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
	hearingGrade: HearingGrade;
	flagCount: number;
}

function base(
	firstName: string,
	lastName: string,
	dob: string,
	sex: 'male' | 'female' | 'other',
	ptaRight: number,
	ptaLeft: number
): AssessmentData {
	const a = createDefaultAssessment();
	a.demographics = { ...a.demographics, firstName, lastName, dateOfBirth: dob, sex };
	a.audiometricResults = {
		...a.audiometricResults,
		pureToneAverageRight: ptaRight,
		pureToneAverageLeft: ptaLeft
	};
	return a;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'AU-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-10', data: base('John', 'Smith', '1990-04-12', 'male', 15, 18) },
	{ id: 'AU-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-12', data: base('Priya', 'Patel', '1975-09-30', 'female', 35, 38) },
	{ id: 'AU-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-15', data: base('Margaret', 'Jones', '1958-01-22', 'female', 52, 48) },
	{ id: 'AU-2026-0004', patientName: 'Williams, David', assessedDate: '2026-06-18', data: base('David', 'Williams', '1945-11-03', 'male', 85, 90) }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const { hearingGrade } = calculateHearingGrade(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		hearingGrade,
		flagCount: detectAdditionalFlags(s.data).length
	};
});
