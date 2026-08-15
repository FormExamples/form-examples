import type { AssessmentData, ControlLevel } from '#lib/engine/types.js';
import { calculateACT } from '#lib/engine/act-grader.js';
import { detectAdditionalFlags } from '#lib/engine/flagged-issues.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

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
	actScore: number;
	controlLevel: ControlLevel;
	flagCount: number;
}

function base(
	firstName: string,
	lastName: string,
	dob: string,
	sex: 'male' | 'female' | 'other'
): AssessmentData {
	const a = createDefaultAssessment();
	a.demographics = { ...a.demographics, firstName, lastName, dateOfBirth: dob, sex };
	return a;
}

/** Well-controlled: top ACT answers (score 25). */
function wellControlled(): AssessmentData {
	const a = base('John', 'Smith', '1990-04-12', 'male');
	a.symptomFrequency = {
		daytimeSymptoms: 'not-at-all',
		nighttimeAwakening: 'not-at-all',
		rescueInhalerUse: 'not-at-all',
		activityLimitation: 'not-at-all',
		selfRatedControl: 'completely-controlled'
	};
	return a;
}

/** Borderline well-controlled (around 20). */
function borderline(): AssessmentData {
	const a = base('Priya', 'Patel', '1985-09-30', 'female');
	a.symptomFrequency = {
		daytimeSymptoms: 'once-or-twice',
		nighttimeAwakening: 'once-or-twice',
		rescueInhalerUse: 'once-or-twice',
		activityLimitation: 'a-little',
		selfRatedControl: 'well-controlled'
	};
	return a;
}

/** Not well controlled (around 16-19). */
function notWellControlled(): AssessmentData {
	const a = base('Margaret', 'Jones', '1972-01-22', 'female');
	a.symptomFrequency = {
		daytimeSymptoms: 'three-to-six',
		nighttimeAwakening: 'once-a-week',
		rescueInhalerUse: 'three-to-six',
		activityLimitation: 'somewhat',
		selfRatedControl: 'somewhat-controlled'
	};
	return a;
}

/** Very poorly controlled (≤15). */
function poorlyControlled(): AssessmentData {
	const a = base('David', 'Williams', '1968-11-03', 'male');
	a.symptomFrequency = {
		daytimeSymptoms: 'more-than-once-a-day',
		nighttimeAwakening: 'four-or-more-nights',
		rescueInhalerUse: 'two-or-more-times-a-day',
		activityLimitation: 'extremely',
		selfRatedControl: 'not-controlled-at-all'
	};
	return a;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'AS-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-10', data: wellControlled() },
	{ id: 'AS-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-12', data: borderline() },
	{ id: 'AS-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-15', data: notWellControlled() },
	{ id: 'AS-2026-0004', patientName: 'Williams, David', assessedDate: '2026-06-18', data: poorlyControlled() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const { actScore, controlLevel } = calculateACT(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		actScore,
		controlLevel,
		flagCount: detectAdditionalFlags(s.data).length
	};
});
