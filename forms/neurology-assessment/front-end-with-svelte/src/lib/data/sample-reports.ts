import type { AssessmentData } from '#lib/engine/types.js';
import { gradeAssessment } from '#lib/engine/nihss-grader.js';
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
	nihssScore: number;
	nihssSeverity: string;
	mrsScore: number | null;
	anticoagulantFlag: boolean;
	flagCount: number;
}

/** No stroke symptoms: migraine with aura, normal NIHSS. */
function noStroke(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'John', lastName: 'Smith', dateOfBirth: '1985-04-12', sex: 'male', weight: 80, height: 180 };
	d.chiefComplaint = { ...d.chiefComplaint, primarySymptom: 'Recurrent headache with visual aura', onsetType: 'gradual', progression: 'stable' };
	d.nihssAssessment = { ...d.nihssAssessment, consciousness: 0, consciousnessQuestions: 0, consciousnessCommands: 0, gaze: 0, visual: 0, facialPalsy: 0, motorLeftArm: 0, motorRightArm: 0, motorLeftLeg: 0, motorRightLeg: 0, limbAtaxia: 0, sensory: 0, language: 0, dysarthria: 0, extinctionInattention: 0 };
	d.headacheAssessment = { ...d.headacheAssessment, headachePresent: 'yes', headacheType: 'migraine', frequency: 'monthly', severity: 6, aura: 'yes', auraDescription: 'Visual scintillations' };
	d.functionalSocial = { ...d.functionalSocial, mrsScore: 0, drivingStatus: 'driving', employmentStatus: 'employed' };
	return d;
}

/** Minor stroke: small deficit, NIHSS 3, on anticoagulants. */
function minorStroke(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Priya', lastName: 'Patel', dateOfBirth: '1959-09-30', sex: 'female', weight: 68, height: 162 };
	d.chiefComplaint = { ...d.chiefComplaint, primarySymptom: 'Transient right-arm weakness and slurred speech', onsetType: 'sudden', progression: 'improving' };
	d.nihssAssessment = { ...d.nihssAssessment, consciousness: 0, consciousnessQuestions: 0, consciousnessCommands: 0, gaze: 0, visual: 0, facialPalsy: 1, motorLeftArm: 0, motorRightArm: 1, motorLeftLeg: 0, motorRightLeg: 0, limbAtaxia: 0, sensory: 0, language: 0, dysarthria: 1, extinctionInattention: 0 };
	d.motorSensoryExam = { ...d.motorSensoryExam, strengthUpperRight: '4', tone: 'normal', gait: 'normal' };
	d.currentMedications = { ...d.currentMedications, anticoagulants: 'yes', anticoagulantDetails: 'Apixaban 5 mg BD' };
	d.functionalSocial = { ...d.functionalSocial, mrsScore: 1, drivingStatus: 'not-driving-medical', employmentStatus: 'retired' };
	return d;
}

/** Moderate stroke: left MCA ischaemic stroke, NIHSS 12. */
function moderateStroke(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Margaret', lastName: 'Jones', dateOfBirth: '1948-01-22', sex: 'female', weight: 70, height: 160 };
	d.chiefComplaint = { ...d.chiefComplaint, primarySymptom: 'Sudden left-sided weakness and aphasia', onsetType: 'sudden', progression: 'worsening' };
	d.nihssAssessment = { ...d.nihssAssessment, consciousness: 1, consciousnessQuestions: 1, consciousnessCommands: 0, gaze: 1, visual: 1, facialPalsy: 2, motorLeftArm: 2, motorRightArm: 0, motorLeftLeg: 1, motorRightLeg: 0, limbAtaxia: 0, sensory: 1, language: 2, dysarthria: 0, extinctionInattention: 0 };
	d.motorSensoryExam = { ...d.motorSensoryExam, strengthUpperLeft: '2', strengthLowerLeft: '3', tone: 'increased', sensation: 'decreased', gait: 'unable' };
	d.diagnosticResults = { ...d.diagnosticResults, mriCtPerformed: 'yes', mriCtFinding: 'infarct', mriCtDetails: 'Left MCA territory infarct' };
	d.functionalSocial = { ...d.functionalSocial, mrsScore: 4, drivingStatus: 'not-driving-medical', employmentStatus: 'retired', carePlanRequired: 'yes' };
	return d;
}

/** Severe stroke: haemorrhagic stroke, NIHSS 22, anticoagulated. */
function severeStroke(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'David', lastName: 'Williams', dateOfBirth: '1951-11-03', sex: 'male', weight: 88, height: 178 };
	d.chiefComplaint = { ...d.chiefComplaint, primarySymptom: 'Sudden collapse with reduced consciousness and dense hemiplegia', onsetType: 'sudden', progression: 'worsening' };
	d.nihssAssessment = { ...d.nihssAssessment, consciousness: 2, consciousnessQuestions: 2, consciousnessCommands: 2, gaze: 2, visual: 2, facialPalsy: 2, motorLeftArm: 3, motorRightArm: 0, motorLeftLeg: 2, motorRightLeg: 0, limbAtaxia: 0, sensory: 1, language: 2, dysarthria: 0, extinctionInattention: 0 };
	d.headacheAssessment = { ...d.headacheAssessment, headachePresent: 'yes', headacheType: 'thunderclap', severity: 10, redFlagSuddenOnset: 'yes', redFlagWorstEver: 'yes', redFlagNeurologicalDeficit: 'yes' };
	d.motorSensoryExam = { ...d.motorSensoryExam, strengthUpperLeft: '1', strengthLowerLeft: '2', tone: 'increased', sensation: 'decreased', gait: 'unable' };
	d.currentMedications = { ...d.currentMedications, anticoagulants: 'yes', anticoagulantDetails: 'Warfarin (INR 3.4)' };
	d.diagnosticResults = { ...d.diagnosticResults, mriCtPerformed: 'yes', mriCtFinding: 'haemorrhage', mriCtDetails: 'Large right basal-ganglia haemorrhage' };
	d.functionalSocial = { ...d.functionalSocial, mrsScore: 5, drivingStatus: 'not-driving-medical', employmentStatus: 'retired', carePlanRequired: 'yes' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'NA-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-10', data: noStroke() },
	{ id: 'NA-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-12', data: minorStroke() },
	{ id: 'NA-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-15', data: moderateStroke() },
	{ id: 'NA-2026-0004', patientName: 'Williams, David', assessedDate: '2026-06-18', data: severeStroke() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeAssessment(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		nihssScore: g.nihssScore,
		nihssSeverity: g.nihssSeverity,
		mrsScore: s.data.functionalSocial.mrsScore,
		anticoagulantFlag: s.data.currentMedications.anticoagulants === 'yes',
		flagCount: g.additionalFlags.length
	};
});
