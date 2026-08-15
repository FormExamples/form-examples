import type { AssessmentData, MRCGrade } from '#lib/engine/types.js';
import { calculateRespirologyGrade } from '#lib/engine/mrc-grader.js';
import { mrcSeverityLabel } from '#lib/engine/utils.js';
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
	mrcGrade: MRCGrade;
	severity: string;
	oxygenFlag: boolean;
	allergyFlag: boolean;
	flagCount: number;
}

/** MRC 1 — breathless only on strenuous exercise; no significant findings. */
function gradeOne(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'John', lastName: 'Smith', dateOfBirth: '1978-04-12', sex: 'male', weight: 78, height: 178, bmi: 24.6 };
	d.chiefComplaint = { ...d.chiefComplaint, primarySymptom: 'Intermittent cough', duration: '3 weeks', severityRating: 2 };
	d.dyspnoeaAssessment = { ...d.dyspnoeaAssessment, mrcGrade: '1' };
	d.coughAssessment = { ...d.coughAssessment, duration: '3 weeks', character: 'dry', sputumVolume: 'none', haemoptysis: 'no' };
	d.smokingExposures = { ...d.smokingExposures, smokingStatus: 'never' };
	d.sleepFunctional = { ...d.sleepFunctional, sleepQuality: 'good', functionalStatus: 'independent' };
	return d;
}

/** MRC 2 — short of breath when hurrying; known asthma, ex-smoker. */
function gradeTwo(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Priya', lastName: 'Patel', dateOfBirth: '1969-09-30', sex: 'female', weight: 68, height: 162, bmi: 25.9 };
	d.chiefComplaint = { ...d.chiefComplaint, primarySymptom: 'Wheeze on exertion', duration: '6 months', severityRating: 4 };
	d.dyspnoeaAssessment = { ...d.dyspnoeaAssessment, mrcGrade: '2' };
	d.coughAssessment = { ...d.coughAssessment, duration: '6 months', character: 'dry', sputumVolume: 'small', sputumColour: 'clear', haemoptysis: 'no' };
	d.respiratoryHistory = { ...d.respiratoryHistory, asthma: 'yes' };
	d.currentMedications = { ...d.currentMedications, inhalers: [{ name: 'Salbutamol', dose: '100 mcg', frequency: 'PRN' }] };
	d.smokingExposures = { ...d.smokingExposures, smokingStatus: 'ex', packYears: 8 };
	d.sleepFunctional = { ...d.sleepFunctional, sleepQuality: 'good', functionalStatus: 'independent' };
	return d;
}

/** MRC 3 — walks slower than peers; moderate COPD, heavy smoking history. */
function gradeThree(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Margaret', lastName: 'Jones', dateOfBirth: '1957-01-22', sex: 'female', weight: 64, height: 160, bmi: 25.0 };
	d.chiefComplaint = { ...d.chiefComplaint, primarySymptom: 'Progressive breathlessness', duration: '2 years', severityRating: 6 };
	d.dyspnoeaAssessment = { ...d.dyspnoeaAssessment, mrcGrade: '3', exerciseToleranceMetres: 200 };
	d.coughAssessment = { ...d.coughAssessment, duration: '2 years', character: 'productive', sputumVolume: 'moderate', sputumColour: 'white', haemoptysis: 'no' };
	d.respiratoryHistory = { ...d.respiratoryHistory, copd: 'yes', copdSeverity: 'moderate' };
	d.pulmonaryFunction = { ...d.pulmonaryFunction, fev1: 62, fvc: 80, fev1FvcRatio: 65, oxygenSaturation: 95 };
	d.currentMedications = { ...d.currentMedications, inhalers: [{ name: 'Tiotropium', dose: '18 mcg', frequency: 'OD' }] };
	d.smokingExposures = { ...d.smokingExposures, smokingStatus: 'ex', packYears: 35 };
	d.sleepFunctional = { ...d.sleepFunctional, sleepQuality: 'fair', functionalStatus: 'independent' };
	return d;
}

/** MRC 4 — stops for breath after ~100m; severe COPD on long-term oxygen. */
function gradeFour(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'David', lastName: 'Williams', dateOfBirth: '1951-11-03', sex: 'male', weight: 62, height: 174, bmi: 20.5 };
	d.chiefComplaint = { ...d.chiefComplaint, primarySymptom: 'Severe exertional dyspnoea', duration: '5 years', severityRating: 8 };
	d.dyspnoeaAssessment = { ...d.dyspnoeaAssessment, mrcGrade: '4', exerciseToleranceMetres: 80 };
	d.coughAssessment = { ...d.coughAssessment, duration: '5 years', character: 'productive', sputumVolume: 'large', sputumColour: 'yellow', haemoptysis: 'no' };
	d.respiratoryHistory = { ...d.respiratoryHistory, copd: 'yes', copdSeverity: 'severe' };
	d.pulmonaryFunction = { ...d.pulmonaryFunction, fev1: 42, fvc: 70, fev1FvcRatio: 55, oxygenSaturation: 90 };
	d.currentMedications = { ...d.currentMedications, inhalers: [{ name: 'Trelegy Ellipta', dose: '1 puff', frequency: 'OD' }], oxygenTherapy: 'yes', oxygenDelivery: 'nasal-cannula', oxygenFlowRate: 2, oralSteroids: 'yes', oralSteroidDetails: 'Prednisolone 10 mg OD' };
	d.smokingExposures = { ...d.smokingExposures, smokingStatus: 'ex', packYears: 50 };
	d.sleepFunctional = { ...d.sleepFunctional, sleepQuality: 'poor', functionalStatus: 'limited' };
	return d;
}

/** MRC 5 — too breathless to leave the house; end-stage disease, anaphylaxis history. */
function gradeFive(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Catherine', lastName: 'Evans', dateOfBirth: '1948-06-18', sex: 'female', weight: 55, height: 158, bmi: 22.0 };
	d.chiefComplaint = { ...d.chiefComplaint, primarySymptom: 'Breathless at rest', duration: '7 years', severityRating: 10 };
	d.dyspnoeaAssessment = { ...d.dyspnoeaAssessment, mrcGrade: '5', exerciseToleranceMetres: 20, orthopnoea: 'yes', orthopnoeaPillows: 3, pnd: 'yes' };
	d.coughAssessment = { ...d.coughAssessment, duration: '7 years', character: 'productive', sputumVolume: 'large', sputumColour: 'green', haemoptysis: 'yes', haemoptysisDetails: 'Streaks for 2 weeks' };
	d.respiratoryHistory = { ...d.respiratoryHistory, copd: 'yes', copdSeverity: 'severe', interstitialLungDisease: 'yes', ildType: 'IPF', pulmonaryEmbolism: 'yes', peDate: '2023-02-10' };
	d.pulmonaryFunction = { ...d.pulmonaryFunction, fev1: 25, fvc: 50, fev1FvcRatio: 50, dlco: 35, oxygenSaturation: 85 };
	d.currentMedications = { ...d.currentMedications, oxygenTherapy: 'yes', oxygenDelivery: 'bipap', oxygenFlowRate: 4, oralSteroids: 'yes', oralSteroidDetails: 'Prednisolone 20 mg OD' };
	d.allergies = { ...d.allergies, drugAllergies: [{ allergen: 'Penicillin', reaction: 'Anaphylaxis', severity: 'anaphylaxis' }] };
	d.smokingExposures = { ...d.smokingExposures, smokingStatus: 'ex', packYears: 60, asbestosExposure: 'yes', asbestosDetails: 'Shipyard, 1970s' };
	d.sleepFunctional = { ...d.sleepFunctional, sleepQuality: 'poor', daytimeSomnolence: 'yes', epworthScore: 14, functionalStatus: 'dependent' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'RA-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-10', data: gradeOne() },
	{ id: 'RA-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-12', data: gradeTwo() },
	{ id: 'RA-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-15', data: gradeThree() },
	{ id: 'RA-2026-0004', patientName: 'Williams, David', assessedDate: '2026-06-18', data: gradeFour() },
	{ id: 'RA-2026-0005', patientName: 'Evans, Catherine', assessedDate: '2026-06-20', data: gradeFive() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateRespirologyGrade(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		mrcGrade: g.mrcGrade,
		severity: mrcSeverityLabel(g.mrcGrade),
		oxygenFlag: s.data.currentMedications.oxygenTherapy === 'yes',
		allergyFlag: s.data.allergies.drugAllergies.length > 0,
		flagCount: g.additionalFlags.length
	};
});
