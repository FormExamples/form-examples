import type { AssessmentData, CareSetting, ChildPughClass, SurgicalRisk } from '#lib/engine/types.js';
import { calculateChildPughGrade } from '#lib/engine/child-pugh-grader.js';
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
	patientIdentifier: string;
	patientName: string;
	assessedDate: string;
	careSetting: CareSetting;
	childPughScore: number;
	childPughClass: ChildPughClass;
	surgicalRisk: SurgicalRisk;
	highFlag: boolean;
	flagCount: number;
}

/** Class A — well-compensated cirrhosis (score 5). */
function classACase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr G. Osei',
		clinicianRole: 'hepatologist',
		assessedAt: '2026-06-24T09:15',
		careSetting: 'hepatology-clinic',
		aetiology: 'viral-hepatitis'
	};
	d.identification = { patientIdentifier: 'HEP-100482', ageBand: '40-59', sex: 'female' };
	d.bilirubin.totalBilirubin = 18; // 1
	d.albumin.serumAlbumin = 42; // 1
	d.coagulation.inr = 1.1; // 1
	d.ascitesStep.ascites = 'none'; // 1
	d.encephalopathyStep.encephalopathy = 'none'; // 1
	d.note.clinicalNote = 'Stable, well-compensated cirrhosis; routine surveillance.';
	return d;
}

/** Class B — significant functional compromise (score 9). */
function classBCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr Z. Nowak',
		clinicianRole: 'physician',
		assessedAt: '2026-06-25T11:40',
		careSetting: 'ward',
		aetiology: 'alcohol'
	};
	d.identification = { patientIdentifier: 'WRD-573110', ageBand: '60-74', sex: 'male' };
	d.bilirubin.totalBilirubin = 42; // 2
	d.albumin.serumAlbumin = 30; // 2
	d.coagulation.inr = 2.0; // 2
	d.ascitesStep.ascites = 'mild'; // 2
	d.encephalopathyStep.encephalopathy = 'none'; // 1  → score 9 (Class B)
	d.note.clinicalNote = 'Decompensation with mild ascites; pre-operative risk review requested.';
	return d;
}

/** Class C — decompensated cirrhosis (score 14). */
function classCCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr B. Ahmed',
		clinicianRole: 'hepatologist',
		assessedAt: '2026-06-26T16:05',
		careSetting: 'intensive-care',
		aetiology: 'alcohol'
	};
	d.identification = { patientIdentifier: 'ICU-100517', ageBand: '60-74', sex: 'female' };
	d.bilirubin.totalBilirubin = 80; // 3
	d.albumin.serumAlbumin = 24; // 3
	d.coagulation.inr = 2.6; // 3
	d.ascitesStep.ascites = 'moderate-severe'; // 3
	d.encephalopathyStep.encephalopathy = 'grade-1-2'; // 2  → score 14
	d.note.clinicalNote = 'Decompensated cirrhosis; transplant assessment and goals-of-care discussion.';
	return d;
}

/** Incomplete — partial assessment, class provisional. */
function incompleteCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Nurse I. Mackenzie',
		clinicianRole: 'nurse',
		assessedAt: '2026-06-26T22:20',
		careSetting: 'pre-operative',
		aetiology: 'nafld'
	};
	d.identification = { patientIdentifier: 'PRE-100628', ageBand: '75-plus', sex: 'male' };
	d.bilirubin.totalBilirubin = 30; // 1
	d.albumin.serumAlbumin = 38; // 1
	// coagulation, ascites, encephalopathy left unanswered
	d.note.clinicalNote = 'Awaiting coagulation and clinical grading before pre-operative sign-off.';
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'CPS-2026-0001', patientName: 'Osei, Grace', assessedDate: '2026-06-24', data: classACase() },
	{ id: 'CPS-2026-0002', patientName: 'Nowak, Zofia', assessedDate: '2026-06-25', data: classBCase() },
	{ id: 'CPS-2026-0003', patientName: 'Ahmed, Bilal', assessedDate: '2026-06-26', data: classCCase() },
	{
		id: 'CPS-2026-0004',
		patientName: 'Mackenzie, Ian',
		assessedDate: '2026-06-26',
		data: incompleteCase()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateChildPughGrade(s.data);
	const highFlag = g.flaggedIssues.some((f) => f.priority === 'high');
	return {
		id: s.id,
		patientIdentifier: s.data.identification.patientIdentifier,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		careSetting: s.data.context.careSetting,
		childPughScore: g.childPughScore,
		childPughClass: g.childPughClass,
		surgicalRisk: g.surgicalRisk,
		highFlag,
		flagCount: g.flaggedIssues.length
	};
});
