import type { AssessmentData, CareSetting, ResultBand } from '#lib/engine/types.js';
import { calculateCageGrade } from '#lib/engine/cage-grader.js';
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
	cageScore: number;
	resultBand: ResultBand;
	positiveScreen: boolean;
	flagCount: number;
}

/** Score 0 — fully-negative screen. */
function score0(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Khan',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-10T08:15',
		careSetting: 'primary-care'
	};
	d.identification = { patientIdentifier: 'GP-2041', ageBand: '40-59', sex: 'female' };
	d.criteria = { cutDown: 'no', annoyed: 'no', guilty: 'no', eyeOpener: 'no' };
	d.note.clinicalNote = 'No positive items; brief advice given.';
	return d;
}

/** Score 1 — one positive item (guilty), sub-threshold. */
function score1(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Nurse P. Reyes',
		clinicianRole: 'nurse',
		assessedAt: '2026-06-12T14:40',
		careSetting: 'ward'
	};
	d.identification = { patientIdentifier: 'WRD-100482', ageBand: '60-74', sex: 'male' };
	d.criteria = { cutDown: 'no', annoyed: 'no', guilty: 'yes', eyeOpener: 'no' };
	d.note.clinicalNote = 'One positive item; will revisit drinking patterns.';
	return d;
}

/** Score 2 — positive screen (cut down + annoyed). */
function score2(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr L. Osei',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-15T22:05',
		careSetting: 'emergency-department'
	};
	d.identification = { patientIdentifier: 'ED-100517', ageBand: '40-59', sex: 'female' };
	d.criteria = { cutDown: 'yes', annoyed: 'yes', guilty: 'no', eyeOpener: 'no' };
	d.note.clinicalNote = 'Positive screen; fuller assessment arranged.';
	return d;
}

/** Score 4 — all four positive, including eye-opener dependence marker. */
function score4(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Midwife S. Doyle',
		clinicianRole: 'midwife',
		assessedAt: '2026-06-18T03:20',
		careSetting: 'antenatal'
	};
	d.identification = { patientIdentifier: 'ANC-77-2211', ageBand: '16-39', sex: 'female' };
	d.criteria = { cutDown: 'yes', annoyed: 'yes', guilty: 'yes', eyeOpener: 'yes' };
	d.note.clinicalNote = 'High score with eye-opener; referred to specialist support.';
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'CAGE-2026-0001', patientName: 'Adeyemi, Grace', assessedDate: '2026-06-10', data: score0() },
	{ id: 'CAGE-2026-0002', patientName: 'Novak, Peter', assessedDate: '2026-06-12', data: score1() },
	{ id: 'CAGE-2026-0003', patientName: 'Ferreira, Ana', assessedDate: '2026-06-15', data: score2() },
	{ id: 'CAGE-2026-0004', patientName: 'Okonkwo, Ruth', assessedDate: '2026-06-18', data: score4() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateCageGrade(s.data);
	return {
		id: s.id,
		patientIdentifier: s.data.identification.patientIdentifier,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		careSetting: s.data.context.careSetting,
		cageScore: g.cageScore,
		resultBand: g.resultBand,
		positiveScreen: g.thresholdMet === 'yes',
		flagCount: g.flaggedIssues.length
	};
});
