import type { AssessmentData } from '#lib/engine/types.js';
import { calculateSymptomScore } from '#lib/engine/symptom-grader.js';
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
	symptomScore: number;
	symptomCategory: string;
	menopausalStatus: string;
	screeningOverdueFlag: boolean;
	flagCount: number;
}

/** A minimal-symptom assessment: routine review, up-to-date screening. */
function minimal(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		firstName: 'Emily',
		lastName: 'Smith',
		dateOfBirth: '1990-04-12',
		sex: 'female',
		menopausalStatus: 'pre-menopausal'
	};
	d.chiefComplaint = {
		primaryConcern: 'Routine cervical screening',
		duration: 'N/A',
		progression: 'stable',
		previousTreatments: ''
	};
	d.menstrualHistory = {
		cycleLength: 28,
		cycleDuration: 5,
		flowHeaviness: 'light',
		painSeverity: 0,
		regularity: 'regular',
		lastMenstrualPeriod: '2026-06-01'
	};
	d.gynecologicalSymptoms = { pelvicPain: 0, abnormalBleeding: 0, discharge: 0, urinarySymptoms: 0 };
	d.cervicalScreening = {
		lastSmearDate: '2025-02-15',
		lastSmearResult: 'normal',
		hpvVaccination: 'complete'
	};
	return d;
}

/** A mild assessment: heavy menstrual bleeding, minor symptoms. */
function mild(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		firstName: 'Priya',
		lastName: 'Patel',
		dateOfBirth: '1988-09-30',
		sex: 'female',
		menopausalStatus: 'pre-menopausal'
	};
	d.chiefComplaint = {
		primaryConcern: 'Heavy menstrual bleeding',
		duration: '6 months',
		progression: 'stable',
		previousTreatments: 'Tranexamic acid'
	};
	d.menstrualHistory = {
		cycleLength: 26,
		cycleDuration: 7,
		flowHeaviness: 'heavy',
		painSeverity: 2,
		regularity: 'regular',
		lastMenstrualPeriod: '2026-06-05'
	};
	d.gynecologicalSymptoms = { pelvicPain: 1, abnormalBleeding: 1, discharge: 0, urinarySymptoms: 0 };
	d.cervicalScreening = {
		lastSmearDate: '2024-11-10',
		lastSmearResult: 'normal',
		hpvVaccination: 'complete'
	};
	d.currentMedications = {
		hormonal: [],
		nonHormonal: [{ name: 'Tranexamic acid', dose: '1 g', frequency: 'TDS during menses' }],
		supplements: 'Iron'
	};
	return d;
}

/** A moderate assessment: pelvic pain and abnormal discharge, abnormal smear. */
function moderate(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		firstName: 'Catherine',
		lastName: 'Davies',
		dateOfBirth: '1982-03-22',
		sex: 'female',
		menopausalStatus: 'pre-menopausal'
	};
	d.chiefComplaint = {
		primaryConcern: 'Pelvic pain and abnormal discharge',
		duration: '3 months',
		progression: 'worsening',
		previousTreatments: ''
	};
	d.menstrualHistory = {
		cycleLength: 30,
		cycleDuration: 6,
		flowHeaviness: 'heavy',
		painSeverity: 3,
		regularity: 'irregular',
		lastMenstrualPeriod: '2026-05-28'
	};
	d.gynecologicalSymptoms = { pelvicPain: 2, abnormalBleeding: 2, discharge: 1, urinarySymptoms: 1 };
	d.cervicalScreening = {
		lastSmearDate: '2025-01-20',
		lastSmearResult: 'abnormal',
		hpvVaccination: 'partial'
	};
	d.sexualHealth = {
		sexuallyActive: 'yes',
		contraceptionMethod: 'Condoms',
		stiHistory: 'yes',
		stiDetails: 'Chlamydia 2023'
	};
	d.familyHistory = {
		breastCancer: 'no',
		ovarianCancer: 'no',
		cervicalCancer: 'no',
		endometriosis: 'yes',
		pcos: 'no',
		otherDetails: ''
	};
	return d;
}

/** A severe assessment: post-menopausal bleeding, overdue screening, family history. */
function severe(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		firstName: 'Margaret',
		lastName: 'Jones',
		dateOfBirth: '1958-01-22',
		sex: 'female',
		menopausalStatus: 'post-menopausal'
	};
	d.chiefComplaint = {
		primaryConcern: 'Post-menopausal bleeding',
		duration: '2 months',
		progression: 'worsening',
		previousTreatments: ''
	};
	d.menstrualHistory = {
		cycleLength: null,
		cycleDuration: null,
		flowHeaviness: 'very-heavy',
		painSeverity: 3,
		regularity: 'absent',
		lastMenstrualPeriod: '2018-06-01'
	};
	d.gynecologicalSymptoms = { pelvicPain: 3, abnormalBleeding: 3, discharge: 2, urinarySymptoms: 3 };
	d.cervicalScreening = {
		lastSmearDate: '2018-03-15',
		lastSmearResult: 'unknown',
		hpvVaccination: 'none'
	};
	d.medicalHistory = {
		previousGynConditions: 'Fibroids',
		chronicDiseases: 'Hypertension',
		surgicalHistory: '',
		autoimmuneDiseases: 'no',
		autoimmuneDiseaseDetails: ''
	};
	d.familyHistory = {
		breastCancer: 'yes',
		ovarianCancer: 'yes',
		cervicalCancer: 'no',
		endometriosis: 'no',
		pcos: 'no',
		otherDetails: ''
	};
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'GA-2026-0001', patientName: 'Smith, Emily', assessedDate: '2026-06-10', data: minimal() },
	{ id: 'GA-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-12', data: mild() },
	{ id: 'GA-2026-0003', patientName: 'Davies, Catherine', assessedDate: '2026-06-15', data: moderate() },
	{ id: 'GA-2026-0004', patientName: 'Jones, Margaret', assessedDate: '2026-06-18', data: severe() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const { symptomScore, symptomCategoryLabel } = calculateSymptomScore(s.data);
	const flags = detectAdditionalFlags(s.data);
	const screeningOverdueFlag = flags.some(
		(f) => f.id === 'FLAG-SCREEN-001' || f.id === 'FLAG-SCREEN-002'
	);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		symptomScore,
		symptomCategory: symptomCategoryLabel,
		menopausalStatus: s.data.demographics.menopausalStatus,
		screeningOverdueFlag,
		flagCount: flags.length
	};
});
