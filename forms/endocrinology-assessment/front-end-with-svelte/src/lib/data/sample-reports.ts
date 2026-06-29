import type { AssessmentData, AxisStatus } from '$lib/engine/types';
import { calculateGrades } from '$lib/engine/endocrine-grader';
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
	overallStatus: AxisStatus;
	abnormalAxes: number;
	urgentFlag: boolean;
	flagCount: number;
}

/** A normal assessment: indices within reference range, no symptoms. */
function normalCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'John', lastName: 'Smith', dateOfBirth: '1972-04-12', sex: 'male', weight: 78, height: 178, bmi: 24.6, ethnicity: 'White British' };
	d.thyroidAxis = { ...d.thyroidAxis, tsh: 2.1, ft4: 15, ft3: 5, antibodiesPositive: 'no', goitre: 'no' };
	d.glucoseMetabolism = { ...d.glucoseMetabolism, hba1c: 35, fastingGlucose: 5.0, knownDiabetes: 'no' };
	d.boneCalcium = { ...d.boneCalcium, calciumCorrected: 2.4, vitaminD: 72, pth: 4.0 };
	d.medicationsLifestyle = { ...d.medicationsLifestyle, smoking: 'never' };
	return d;
}

/** A subclinical assessment: biochemical drift without symptoms. */
function subclinicalCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Priya', lastName: 'Patel', dateOfBirth: '1981-09-30', sex: 'female', weight: 68, height: 164, bmi: 25.3, ethnicity: 'South Asian' };
	d.thyroidAxis = { ...d.thyroidAxis, tsh: 3.2, antibodiesPositive: 'yes', goitre: 'no' };
	d.glucoseMetabolism = { ...d.glucoseMetabolism, hba1c: 44, fastingGlucose: 5.8, knownDiabetes: 'no' };
	d.medicationsLifestyle = { ...d.medicationsLifestyle, smoking: 'ex' };
	d.clinicalImpression = { ...d.clinicalImpression, workingDiagnosis: 'Euthyroid autoimmune thyroiditis; pre-diabetes' };
	return d;
}

/** A moderate assessment: hypothyroidism, vitamin-D deficiency, several findings. */
function moderateCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Margaret', lastName: 'Jones', dateOfBirth: '1958-01-22', sex: 'female', weight: 84, height: 160, bmi: 32.8, ethnicity: 'White British' };
	d.presentingSymptoms = { ...d.presentingSymptoms, fatigue: 'yes', coldIntolerance: 'yes', weightChange: 'yes', weightChangeDirection: 'gain', symptomDuration: '6-12-months' };
	d.thyroidAxis = { ...d.thyroidAxis, tsh: 8.5, ft4: 8, antibodiesPositive: 'yes', goitre: 'yes' };
	d.glucoseMetabolism = { ...d.glucoseMetabolism, hba1c: 60, fastingGlucose: 8.2, knownDiabetes: 'yes', diabetesType: 'type2' };
	d.boneCalcium = { ...d.boneCalcium, vitaminD: 20, calciumCorrected: 2.35, pth: 7.4, fragilityFracture: 'yes' };
	d.medicationsLifestyle = { ...d.medicationsLifestyle, smoking: 'current', steroidUse: 'no', familyHistoryEndocrine: 'Mother — hypothyroidism' };
	d.clinicalImpression = { ...d.clinicalImpression, workingDiagnosis: 'Primary hypothyroidism; sub-optimal T2DM control', referralRequired: 'no' };
	return d;
}

/** A severe assessment: overt thyrotoxicosis, adrenal insufficiency, pituitary mass effect. */
function severeCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'David', lastName: 'Williams', dateOfBirth: '1965-11-03', sex: 'male', weight: 70, height: 180, bmi: 21.6, ethnicity: 'White British' };
	d.presentingSymptoms = { ...d.presentingSymptoms, palpitations: 'yes', tremor: 'yes', heatIntolerance: 'yes', weightChange: 'yes', weightChangeDirection: 'loss', symptomDuration: '1-6-months' };
	d.thyroidAxis = { ...d.thyroidAxis, tsh: 0.02, ft4: 38, ft3: 12, antibodiesPositive: 'yes', goitre: 'yes' };
	d.adrenalAxis = { ...d.adrenalAxis, morningCortisol: 70, acth: 30, hyperpigmentation: 'yes', posturalHypotension: 'yes' };
	d.pituitaryFunction = { ...d.pituitaryFunction, prolactin: 6200, visualDisturbance: 'yes', headaches: 'yes', pituitaryImagingDone: 'yes', pituitaryImagingFindings: 'Macroadenoma with chiasmal compression' };
	d.boneCalcium = { ...d.boneCalcium, calciumCorrected: 3.2, pth: 12, vitaminD: 18, fragilityFracture: 'yes' };
	d.medicationsLifestyle = { ...d.medicationsLifestyle, steroidUse: 'yes', steroidDetails: 'Prednisolone 10 mg OD', smoking: 'current' };
	d.clinicalImpression = { ...d.clinicalImpression, workingDiagnosis: 'Thyrotoxicosis; adrenal insufficiency; macroprolactinoma; hypercalcaemia', referralRequired: 'yes', referralSpecialty: 'Pituitary MDT' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'EA-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-10', data: normalCase() },
	{ id: 'EA-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-12', data: subclinicalCase() },
	{ id: 'EA-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-15', data: moderateCase() },
	{ id: 'EA-2026-0004', patientName: 'Williams, David', assessedDate: '2026-06-18', data: severeCase() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateGrades(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		overallStatus: g.overallStatus,
		abnormalAxes: g.axisGrades.filter((a) => a.status !== '' && a.status !== 'normal').length,
		urgentFlag: g.additionalFlags.some((f) => f.priority === 'urgent'),
		flagCount: g.additionalFlags.length
	};
});
