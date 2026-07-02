import type {
	AlbuminuriaCategory,
	AssessmentData,
	GfrCategory,
	KdigoRiskZone,
	ReviewStatus
} from '$lib/engine/types';
import { review } from '$lib/engine/ckd-review-grader';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

/** A sample review: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	patientName: string;
	reviewedDate: string;
	data: AssessmentData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientIdentifier: string;
	patientName: string;
	careSetting: string;
	gfrCategory: GfrCategory;
	albuminuriaCategory: AlbuminuriaCategory;
	kdigoRiskZone: KdigoRiskZone;
	reviewStatus: ReviewStatus;
	referralFlag: boolean;
	highFlagCount: number;
	flagCount: number;
	reviewedDate: string;
}

/** Very-high risk, complete — G4/A3 with severe albuminuria; referral flags. */
function veryHighComplete(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Rahman',
		clinicianRole: 'nephrology',
		reviewedAt: '2026-06-24',
		careSetting: 'community-nephrology',
		reviewType: 'annual'
	};
	d.patient = {
		patientIdentifier: 'NHS 611 208 3344',
		ageBand: '60-79',
		sex: 'female',
		diabetesStatus: 'type2',
		primaryCause: 'diabetic',
		monthsSinceDiagnosis: 84
	};
	d.renal = { egfr: 22, egfrSampleDate: '2026-06-20', previousEgfr: 28, previousEgfrDate: '2025-06-18' };
	d.albuminuria = { acr: 96, acrSampleDate: '2026-06-20', acrMeasured: 'yes' };
	d.bloodPressure = { systolicBloodPressure: 134, diastolicBloodPressure: 78 };
	d.medication = {
		aceiOrArbPrescribed: 'yes',
		sglt2iPrescribed: 'yes',
		statinPrescribed: 'yes',
		nephrotoxicDrugPresent: 'no',
		nephrotoxicDoseAdjusted: 'not-applicable',
		medicationReviewCompleted: 'yes'
	};
	d.bloods = {
		hba1c: 58,
		potassium: 5.1,
		bicarbonate: 22,
		calcium: 2.3,
		phosphate: 1.3,
		pth: 12,
		haemoglobin: 118
	};
	d.summary = {
		referralDecision: 'already-under-nephrology',
		clinicalNote:
			'Advanced CKD (G4/A3) with type 2 diabetes; under community nephrology. Continue RAAS blockade and SGLT2i; monitor potassium closely.'
	};
	return d;
}

/** High risk, partial — G3a/A2; medication review and core bloods outstanding. */
function highPartial(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'PN J. Okonkwo',
		clinicianRole: 'nurse',
		reviewedAt: '2026-06-24',
		careSetting: 'long-term-conditions-clinic',
		reviewType: 'annual'
	};
	d.patient = {
		patientIdentifier: 'NHS 330 149 7720',
		ageBand: '60-79',
		sex: 'male',
		diabetesStatus: 'none',
		primaryCause: 'hypertensive',
		monthsSinceDiagnosis: 48
	};
	d.renal = { egfr: 52, egfrSampleDate: '2026-06-19', previousEgfr: 55, previousEgfrDate: '2025-06-20' };
	d.albuminuria = { acr: 12, acrSampleDate: '2026-06-19', acrMeasured: 'yes' };
	d.bloodPressure = { systolicBloodPressure: 148, diastolicBloodPressure: 92 };
	d.medication = {
		aceiOrArbPrescribed: 'yes',
		sglt2iPrescribed: 'not-indicated',
		statinPrescribed: 'yes',
		nephrotoxicDrugPresent: 'no',
		nephrotoxicDoseAdjusted: 'not-applicable',
		medicationReviewCompleted: 'no'
	};
	d.summary = {
		referralDecision: 'monitor',
		clinicalNote:
			'G3a/A2, blood pressure above target on current therapy. Complete structured medication review and repeat core bloods.'
	};
	return d;
}

/** Low risk, complete — G2/A1, at target, everything documented; no flags. */
function lowComplete(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr I. Mackenzie',
		clinicianRole: 'gp',
		reviewedAt: '2026-06-25',
		careSetting: 'general-practice',
		reviewType: 'annual'
	};
	d.patient = {
		patientIdentifier: 'NHS 943 476 5919',
		ageBand: '40-59',
		sex: 'female',
		diabetesStatus: 'none',
		primaryCause: 'unknown',
		monthsSinceDiagnosis: 30
	};
	d.renal = { egfr: 72, egfrSampleDate: '2026-06-21', previousEgfr: 74, previousEgfrDate: '2025-06-22' };
	d.albuminuria = { acr: 1.4, acrSampleDate: '2026-06-21', acrMeasured: 'yes' };
	d.bloodPressure = { systolicBloodPressure: 126, diastolicBloodPressure: 76 };
	d.medication = {
		aceiOrArbPrescribed: 'yes',
		sglt2iPrescribed: 'not-indicated',
		statinPrescribed: 'yes',
		nephrotoxicDrugPresent: 'no',
		nephrotoxicDoseAdjusted: 'not-applicable',
		medicationReviewCompleted: 'yes'
	};
	d.bloods = {
		hba1c: 37,
		potassium: 4.4,
		bicarbonate: 25,
		calcium: 2.35,
		phosphate: 1.1,
		pth: 6,
		haemoglobin: 134
	};
	d.summary = {
		referralDecision: 'none',
		clinicalNote: 'Stable G2/A1 CKD, well controlled. Continue current management; 12-month recall.'
	};
	return d;
}

/** Incomplete — no eGFR recorded; KDIGO staging cannot be determined. */
function incompleteNoEgfr(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr Z. Nowak',
		clinicianRole: 'pharmacist',
		reviewedAt: '2026-06-28',
		careSetting: 'general-practice',
		reviewType: 'interval'
	};
	d.patient = {
		patientIdentifier: 'NHS 204 815 5528',
		ageBand: '18-39',
		sex: 'male',
		diabetesStatus: 'none',
		primaryCause: 'glomerular',
		monthsSinceDiagnosis: 12
	};
	d.bloodPressure = { systolicBloodPressure: 132, diastolicBloodPressure: 82 };
	d.medication = {
		aceiOrArbPrescribed: 'yes',
		sglt2iPrescribed: 'no',
		statinPrescribed: 'declined',
		nephrotoxicDrugPresent: 'no',
		nephrotoxicDoseAdjusted: 'not-applicable',
		medicationReviewCompleted: 'no'
	};
	d.summary = {
		referralDecision: 'monitor',
		clinicalNote:
			'Medication review only; no bloods this visit. Recall for eGFR and urine ACR to complete KDIGO staging.'
	};
	return d;
}

/** The sample reviews, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{
		id: 'CKD-2026-0001',
		patientName: 'Doyle, Aoife',
		reviewedDate: '2026-06-24',
		data: veryHighComplete()
	},
	{
		id: 'CKD-2026-0002',
		patientName: 'Nowak, Piotr',
		reviewedDate: '2026-06-24',
		data: highPartial()
	},
	{
		id: 'CKD-2026-0003',
		patientName: 'Fernandez, Rosa',
		reviewedDate: '2026-06-25',
		data: lowComplete()
	},
	{
		id: 'CKD-2026-0004',
		patientName: 'Sato, Kenji',
		reviewedDate: '2026-06-28',
		data: incompleteNoEgfr()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = review(s.data);
	const referralFlag = g.flaggedIssues.some((f) =>
		['very-high-risk-referral', 'egfr-referral', 'acr-referral'].includes(f.category)
	);
	return {
		id: s.id,
		patientIdentifier: s.data.patient.patientIdentifier,
		patientName: s.patientName,
		careSetting: s.data.context.careSetting,
		gfrCategory: g.gfrCategory,
		albuminuriaCategory: g.albuminuriaCategory,
		kdigoRiskZone: g.kdigoRiskZone,
		reviewStatus: g.reviewStatus,
		referralFlag,
		highFlagCount: g.flaggedIssues.filter((f) => f.priority === 'high').length,
		flagCount: g.flaggedIssues.length,
		reviewedDate: s.reviewedDate
	};
});
