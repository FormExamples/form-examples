import type { AssessmentData, ControlLevel } from '#lib/engine/types.js';
import { calculateControl } from '#lib/engine/diabetes-grader.js';
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
	controlLevel: ControlLevel;
	controlScore: number;
	flagCount: number;
}

function sample(fullName: string, dob: string, diabetesType: string, hba1c: number): AssessmentData {
	const a = createDefaultAssessment();
	a.patientInformation = { ...a.patientInformation, fullName, dateOfBirth: dob };
	a.diabetesHistory = { ...a.diabetesHistory, diabetesType, ageAtDiagnosis: 45, yearsDuration: 8 };
	a.glycaemicControl = {
		...a.glycaemicControl,
		hba1cValue: hba1c,
		hba1cUnit: 'mmolMol',
		hba1cTarget: 53
	};
	return a;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'DM-2026-0001', patientName: 'John Smith', assessedDate: '2026-06-10', data: sample('John Smith', '1965-04-12', 'type2', 45) },
	{ id: 'DM-2026-0002', patientName: 'Priya Patel', assessedDate: '2026-06-12', data: sample('Priya Patel', '1958-09-30', 'type2', 58) },
	{ id: 'DM-2026-0003', patientName: 'Margaret Jones', assessedDate: '2026-06-15', data: sample('Margaret Jones', '1950-01-22', 'type1', 75) },
	{ id: 'DM-2026-0004', patientName: 'David Williams', assessedDate: '2026-06-18', data: sample('David Williams', '1948-11-03', 'type2', 95) }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const { controlLevel, controlScore } = calculateControl(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		controlLevel,
		controlScore,
		flagCount: detectAdditionalFlags(s.data).length
	};
});
