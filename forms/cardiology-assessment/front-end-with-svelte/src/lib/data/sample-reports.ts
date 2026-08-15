import type { AssessmentData, CCSClass, NYHAClass, RiskLevel } from '#lib/engine/types.js';
import { calculateCardioGrade } from '#lib/engine/cardio-grader.js';
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
	ccsClass: CCSClass | null;
	nyhaClass: NYHAClass | null;
	riskLevel: RiskLevel;
	allergyFlag: boolean;
	anticoagulantFlag: boolean;
	flagCount: number;
}

/** A low-risk assessment: stable, minimal symptoms, well-controlled. */
function lowRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'John', lastName: 'Smith', dateOfBirth: '1968-04-12', sex: 'male', weight: 78, height: 178, bmi: 24.6 };
	d.riskFactors = { ...d.riskFactors, hypertension: 'yes', hypertensionControlled: 'yes', diabetes: 'no', hyperlipidaemia: 'no', familyHistory: 'no', obesity: 'no' };
	d.socialFunctional = { ...d.socialFunctional, smoking: 'never', alcohol: 'occasional', exerciseTolerance: 'moderate-exercise', estimatedMETs: 7 };
	return d;
}

/** A moderate-risk assessment: CCS II angina, several risk factors. */
function moderateRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Priya', lastName: 'Patel', dateOfBirth: '1959-09-30', sex: 'female', weight: 82, height: 162, bmi: 31.2 };
	d.chestPainAngina = { ...d.chestPainAngina, chestPain: 'yes', painCharacter: 'pressure', ccsClass: '2', anginaFrequency: 'weekly', anginaDuration: '5-20-min', unstableAngina: 'no' };
	d.riskFactors = { ...d.riskFactors, hypertension: 'yes', hypertensionControlled: 'no', diabetes: 'yes', diabetesType: 'type2', hyperlipidaemia: 'yes', familyHistory: 'yes', obesity: 'yes' };
	d.currentMedications = { ...d.currentMedications, antiplatelets: 'yes', antiplateletType: 'Aspirin 75 mg', statins: 'yes', statinType: 'Atorvastatin 40 mg', betaBlockers: 'yes', betaBlockerType: 'Bisoprolol 5 mg' };
	d.allergies = { ...d.allergies, drugAllergies: 'yes', allergies: [{ allergen: 'Penicillin', reaction: 'Rash', severity: 'mild' }] };
	d.socialFunctional = { ...d.socialFunctional, smoking: 'ex', alcohol: 'moderate', exerciseTolerance: 'climb-stairs', estimatedMETs: 4 };
	return d;
}

/** A high-risk assessment: CCS III angina, NYHA III heart failure, prior MI. */
function highRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Margaret', lastName: 'Jones', dateOfBirth: '1948-01-22', sex: 'female', weight: 70, height: 160, bmi: 27.3 };
	d.chestPainAngina = { ...d.chestPainAngina, chestPain: 'yes', painCharacter: 'crushing', ccsClass: '3', anginaFrequency: 'daily', anginaDuration: '5-20-min', unstableAngina: 'no' };
	d.heartFailureSymptoms = { ...d.heartFailureSymptoms, dyspnoea: 'yes', dyspnoeaOnExertion: 'yes', orthopnoea: 'yes', peripheralOedema: 'yes', nyhaClass: '3' };
	d.cardiacHistory = { ...d.cardiacHistory, previousMI: 'yes', miDate: '2021-06-01', pci: 'yes', pciDetails: 'LAD stent 2021' };
	d.riskFactors = { ...d.riskFactors, hypertension: 'yes', hypertensionControlled: 'no', diabetes: 'yes', diabetesType: 'type2', hyperlipidaemia: 'yes', familyHistory: 'yes' };
	d.currentMedications = { ...d.currentMedications, anticoagulants: 'yes', anticoagulantType: 'Apixaban 5 mg', betaBlockers: 'yes', diuretics: 'yes', aceInhibitorsARBs: 'yes' };
	d.socialFunctional = { ...d.socialFunctional, smoking: 'ex', exerciseTolerance: 'light-housework', estimatedMETs: 2 };
	return d;
}

/** A critical assessment: unstable angina with recent MI. */
function critical(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'David', lastName: 'Williams', dateOfBirth: '1955-11-03', sex: 'male', weight: 95, height: 180, bmi: 29.3 };
	d.chestPainAngina = { ...d.chestPainAngina, chestPain: 'yes', painCharacter: 'crushing', ccsClass: '4', anginaFrequency: 'daily', anginaDuration: 'greater-20-min', unstableAngina: 'yes' };
	d.heartFailureSymptoms = { ...d.heartFailureSymptoms, dyspnoea: 'yes', dyspnoeaOnExertion: 'yes', nyhaClass: '4' };
	d.cardiacHistory = { ...d.cardiacHistory, previousMI: 'yes', recentMI: 'yes', recentMIWeeks: 2 };
	d.riskFactors = { ...d.riskFactors, hypertension: 'yes', hypertensionControlled: 'no', diabetes: 'yes', diabetesType: 'type2', hyperlipidaemia: 'yes' };
	d.currentMedications = { ...d.currentMedications, antiplatelets: 'yes', anticoagulants: 'yes', anticoagulantType: 'Clexane' };
	d.allergies = { ...d.allergies, contrastAllergy: 'yes', contrastAllergyDetails: 'Iodinated contrast — urticaria' };
	d.socialFunctional = { ...d.socialFunctional, smoking: 'current', smokingPackYears: 40, exerciseTolerance: 'unable', estimatedMETs: 1 };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'CA-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-10', data: lowRisk() },
	{ id: 'CA-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-12', data: moderateRisk() },
	{ id: 'CA-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-15', data: highRisk() },
	{ id: 'CA-2026-0004', patientName: 'Williams, David', assessedDate: '2026-06-18', data: critical() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateCardioGrade(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		ccsClass: g.ccsClass,
		nyhaClass: g.nyhaClass,
		riskLevel: g.overallRisk,
		allergyFlag: s.data.allergies.drugAllergies === 'yes' || s.data.allergies.allergies.length > 0,
		anticoagulantFlag: s.data.currentMedications.anticoagulants === 'yes',
		flagCount: g.additionalFlags.length
	};
});
