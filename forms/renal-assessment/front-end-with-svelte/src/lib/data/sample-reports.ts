import type { AssessmentData, GfrCategory, AlbuminuriaCategory, RiskLevel } from '$lib/engine/types';
import { calculateKdigo } from '$lib/engine/kdigo-grader';
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
	gfrCategory: GfrCategory;
	albuminuriaCategory: AlbuminuriaCategory;
	riskLevel: RiskLevel;
	egfr: number | null;
	acr: number | null;
	referralFlag: boolean;
	flagCount: number;
}

/** A low-risk assessment: G1/A1, well-controlled hypertension only. */
function lowRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'John', lastName: 'Smith', dateOfBirth: '1972-04-12', sex: 'male', ethnicity: 'white', weight: 78, height: 178, bmi: 24.6 };
	d.ckdRiskFactors = { ...d.ckdRiskFactors, hypertension: 'yes', diabetes: 'no', smoking: 'never', obesity: 'no' };
	d.bloodTests = { ...d.bloodTests, serumCreatinine: 0.9, sodium: 140, potassium: 4.2, bicarbonate: 26, calcium: 2.35, phosphate: 1.1, hemoglobin: 145 };
	d.urineTests = { ...d.urineTests, acr: 1.2, dipstickProtein: 'negative', dipstickBlood: 'negative' };
	d.physicalExamination = { ...d.physicalExamination, systolicBp: 128, diastolicBp: 78 };
	return d;
}

/** A moderate-risk assessment: G3a/A1 (moderate), diabetic. */
function moderateRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Priya', lastName: 'Patel', dateOfBirth: '1959-09-30', sex: 'female', ethnicity: 'asian', weight: 82, height: 162, bmi: 31.2 };
	d.ckdRiskFactors = { ...d.ckdRiskFactors, hypertension: 'yes', diabetes: 'yes', diabetesType: 'type2', obesity: 'yes', smoking: 'ex' };
	d.bloodTests = { ...d.bloodTests, serumCreatinine: 1.3, sodium: 139, potassium: 4.6, bicarbonate: 24, calcium: 2.3, phosphate: 1.2, hemoglobin: 125, hba1c: 7.8 };
	d.urineTests = { ...d.urineTests, acr: 2.0, dipstickProtein: 'trace', dipstickBlood: 'negative' };
	d.physicalExamination = { ...d.physicalExamination, systolicBp: 138, diastolicBp: 84 };
	d.medicationReview = { ...d.medicationReview, aceiArb: 'yes', sglt2Inhibitor: 'no', statin: 'yes' };
	return d;
}

/** A high-risk assessment: G3b/A2 (high), diabetic nephropathy. */
function highRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Margaret', lastName: 'Jones', dateOfBirth: '1951-01-22', sex: 'female', ethnicity: 'white', weight: 70, height: 160, bmi: 27.3 };
	d.presentingSymptoms = { ...d.presentingSymptoms, fatigue: 'yes', edema: 'yes', nocturia: 'yes' };
	d.ckdRiskFactors = { ...d.ckdRiskFactors, hypertension: 'yes', diabetes: 'yes', diabetesType: 'type2', priorAki: 'yes', nsaidUse: 'yes', smoking: 'ex' };
	d.bloodTests = { ...d.bloodTests, serumCreatinine: 1.9, sodium: 138, potassium: 5.6, bicarbonate: 20, calcium: 2.2, phosphate: 1.5, hemoglobin: 108, hba1c: 8.4 };
	d.urineTests = { ...d.urineTests, acr: 18, dipstickProtein: '2+', dipstickBlood: 'trace' };
	d.physicalExamination = { ...d.physicalExamination, systolicBp: 152, diastolicBp: 90, peripheralEdema: 'yes' };
	d.medicationReview = { ...d.medicationReview, aceiArb: 'no', sglt2Inhibitor: 'no', diuretic: 'yes', statin: 'yes' };
	d.clinicalImpression = { ...d.clinicalImpression, suspectedEtiology: 'diabetic-nephropathy', nephrologyReferral: 'yes', referralUrgency: 'soon' };
	return d;
}

/** A very-high-risk assessment: G5/A3, kidney failure with hyperkalemia. */
function veryHighRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'David', lastName: 'Williams', dateOfBirth: '1955-11-03', sex: 'male', ethnicity: 'black', weight: 90, height: 180, bmi: 27.8 };
	d.presentingSymptoms = { ...d.presentingSymptoms, fatigue: 'yes', edema: 'yes', nauseaVomiting: 'yes', appetiteLoss: 'yes', pruritus: 'yes', reducedUrineOutput: 'yes', confusion: 'yes' };
	d.ckdRiskFactors = { ...d.ckdRiskFactors, hypertension: 'yes', diabetes: 'yes', diabetesType: 'type2', cardiovascularDisease: 'yes', priorAki: 'yes', smoking: 'current' };
	d.bloodTests = { ...d.bloodTests, serumCreatinine: 6.2, sodium: 136, potassium: 6.7, bicarbonate: 15, calcium: 1.95, phosphate: 2.1, hemoglobin: 86, pth: 420 };
	d.urineTests = { ...d.urineTests, acr: 120, dipstickProtein: '3+', dipstickBlood: '2+', microscopyCasts: 'yes', castType: 'granular' };
	d.physicalExamination = { ...d.physicalExamination, systolicBp: 186, diastolicBp: 102, peripheralEdema: 'yes', pulmonaryEdema: 'yes', pallor: 'yes' };
	d.imagingBiopsy = { ...d.imagingBiopsy, renalUltrasoundDone: 'yes', hydronephrosis: 'no', cysts: 'no' };
	d.medicationReview = { ...d.medicationReview, aceiArb: 'no', sglt2Inhibitor: 'no', diuretic: 'yes', phosphateBinder: 'yes', erythropoietinAgent: 'yes', contrastImagingPlanned: 'yes' };
	d.clinicalImpression = { ...d.clinicalImpression, suspectedEtiology: 'diabetic-nephropathy', aksuperimposedOnCkd: 'yes', nephrologyReferral: 'yes', referralUrgency: 'urgent', dialysisDiscussionNeeded: 'yes' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'RA-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-10', data: lowRisk() },
	{ id: 'RA-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-12', data: moderateRisk() },
	{ id: 'RA-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-15', data: highRisk() },
	{ id: 'RA-2026-0004', patientName: 'Williams, David', assessedDate: '2026-06-18', data: veryHighRisk() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateKdigo(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		gfrCategory: g.gfrCategory,
		albuminuriaCategory: g.albuminuriaCategory,
		riskLevel: g.riskLevel,
		egfr: g.egfr,
		acr: g.acr,
		referralFlag: s.data.clinicalImpression.nephrologyReferral === 'yes',
		flagCount: g.additionalFlags.length
	};
});
