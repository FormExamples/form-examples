import type { AssessmentData, ASAGrade } from '#lib/engine/types.js';
import { calculateASA } from '#lib/engine/asa-grader.js';
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
	asaGrade: ASAGrade;
	procedureUrgency: string;
	airwayFlag: boolean;
	allergyFlag: boolean;
	anticoagulantFlag: boolean;
	flagCount: number;
}

/** ASA I: a fit, healthy patient with no comorbidities. */
function healthy(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		...d.demographics,
		firstName: 'John',
		lastName: 'Smith',
		dateOfBirth: '1992-04-12',
		sex: 'male',
		weight: 78,
		height: 178,
		bmi: 24.6,
		plannedProcedure: 'Inguinal hernia repair',
		procedureUrgency: 'elective'
	};
	d.functionalCapacity = {
		...d.functionalCapacity,
		exerciseTolerance: 'vigorous-exercise',
		estimatedMETs: 10
	};
	return d;
}

/** ASA II: mild, well-controlled systemic disease. */
function mildDisease(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		...d.demographics,
		firstName: 'Priya',
		lastName: 'Patel',
		dateOfBirth: '1969-09-30',
		sex: 'female',
		weight: 82,
		height: 162,
		bmi: 31.2,
		plannedProcedure: 'Laparoscopic cholecystectomy',
		procedureUrgency: 'elective'
	};
	d.cardiovascular = {
		...d.cardiovascular,
		hypertension: 'yes',
		hypertensionControlled: 'yes'
	};
	d.respiratory = {
		...d.respiratory,
		asthma: 'yes',
		asthmaFrequency: 'intermittent',
		smoking: 'ex'
	};
	d.allergies = [{ allergen: 'Penicillin', reaction: 'Rash', severity: 'mild' }];
	d.medications = [{ name: 'Amlodipine', dose: '5 mg', frequency: 'once daily' }];
	return d;
}

/** ASA III: severe systemic disease (uncontrolled HTN + advanced CKD). */
function severeDisease(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		...d.demographics,
		firstName: 'Margaret',
		lastName: 'Jones',
		dateOfBirth: '1953-01-22',
		sex: 'female',
		weight: 70,
		height: 160,
		bmi: 27.3,
		plannedProcedure: 'Total knee replacement',
		procedureUrgency: 'urgent'
	};
	d.cardiovascular = {
		...d.cardiovascular,
		hypertension: 'yes',
		hypertensionControlled: 'no',
		ischemicHeartDisease: 'yes',
		ihdDetails: 'Stable angina'
	};
	d.renal = { ...d.renal, ckd: 'yes', ckdStage: '4' };
	d.endocrine = {
		...d.endocrine,
		diabetes: 'type2',
		diabetesControl: 'poorly-controlled',
		diabetesOnInsulin: 'yes'
	};
	d.haematological = {
		...d.haematological,
		onAnticoagulants: 'yes',
		anticoagulantType: 'Apixaban 5 mg'
	};
	d.allergies = [{ allergen: 'Latex', reaction: 'Contact dermatitis', severity: 'moderate' }];
	d.medications = [
		{ name: 'Insulin glargine', dose: '24 units', frequency: 'at night' },
		{ name: 'Apixaban', dose: '5 mg', frequency: 'twice daily' }
	];
	return d;
}

/** ASA IV: life-threatening disease (recent MI + NYHA IV heart failure). */
function lifeThreatening(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		...d.demographics,
		firstName: 'David',
		lastName: 'Williams',
		dateOfBirth: '1950-11-03',
		sex: 'male',
		weight: 95,
		height: 180,
		bmi: 29.3,
		plannedProcedure: 'Emergency laparotomy',
		procedureUrgency: 'emergency'
	};
	d.cardiovascular = {
		...d.cardiovascular,
		hypertension: 'yes',
		hypertensionControlled: 'no',
		ischemicHeartDisease: 'yes',
		heartFailure: 'yes',
		heartFailureNYHA: '4',
		recentMI: 'yes',
		recentMIWeeks: 2
	};
	d.respiratory = { ...d.respiratory, smoking: 'current', smokingPackYears: 40 };
	d.haematological = {
		...d.haematological,
		onAnticoagulants: 'yes',
		anticoagulantType: 'Clexane'
	};
	d.musculoskeletalAirway = {
		...d.musculoskeletalAirway,
		previousDifficultAirway: 'yes',
		mallampatiScore: '4',
		limitedMouthOpening: 'yes'
	};
	d.allergies = [{ allergen: 'Morphine', reaction: 'Anaphylaxis', severity: 'anaphylaxis' }];
	d.functionalCapacity = {
		...d.functionalCapacity,
		exerciseTolerance: 'unable',
		estimatedMETs: 1
	};
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'PA-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-10', data: healthy() },
	{ id: 'PA-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-12', data: mildDisease() },
	{
		id: 'PA-2026-0003',
		patientName: 'Jones, Margaret',
		assessedDate: '2026-06-15',
		data: severeDisease()
	},
	{
		id: 'PA-2026-0004',
		patientName: 'Williams, David',
		assessedDate: '2026-06-18',
		data: lifeThreatening()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const { asaGrade } = calculateASA(s.data);
	const flags = detectAdditionalFlags(s.data);
	const a = s.data.musculoskeletalAirway;
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		asaGrade,
		procedureUrgency: s.data.demographics.procedureUrgency,
		airwayFlag:
			a.previousDifficultAirway === 'yes' ||
			a.limitedMouthOpening === 'yes' ||
			a.limitedNeckMovement === 'yes' ||
			a.mallampatiScore === '3' ||
			a.mallampatiScore === '4',
		allergyFlag: s.data.allergies.length > 0,
		anticoagulantFlag: s.data.haematological.onAnticoagulants === 'yes',
		flagCount: flags.length
	};
});
