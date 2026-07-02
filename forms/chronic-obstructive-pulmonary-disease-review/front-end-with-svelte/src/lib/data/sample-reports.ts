import type {
	AbeGroup,
	AssessmentData,
	GoldGrade,
	ReviewStatus,
	ReviewType
} from '$lib/engine/types';
import { gradeCopdReview } from '$lib/engine/copd-review-grader';
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
	reviewType: ReviewType;
	goldGrade: GoldGrade;
	abeGroup: AbeGroup;
	reviewStatus: ReviewStatus;
	highFlagCount: number;
	flagCount: number;
	reviewedDate: string;
}

/** GOLD 1, group A, complete — mild, well-controlled ex-smoker. */
function goldOneGroupA(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Sister J. Okonkwo',
		clinicianRole: 'respiratory-nurse',
		reviewedAt: '2026-06-20',
		reviewType: 'routine-annual',
		patientIdentifier: 'COPD-100482',
		ageBand: '60-79',
		sex: 'female'
	};
	d.diagnosis = { diagnosisYear: 2019, spirometryConfirmed: 'yes', exposureNotes: 'Ex-smoker, 20 pack-years.' };
	d.spirometry = {
		fev1Litres: 2.1,
		fev1PercentPredicted: 84,
		fvcLitres: 3.4,
		fev1FvcRatio: 0.62,
		spirometryDate: '2026-06-10'
	};
	d.symptoms = { mrcGrade: 1, mmrcGrade: 0, catScore: 6 };
	d.exacerbations = {
		exacerbationsLast12m: 0,
		hospitalisationsLast12m: 0,
		lastExacerbationDate: '',
		rescuePackCourses: 0
	};
	d.smoking = { smokingStatus: 'ex', packYears: 20, cessationSupportOffered: 'no' };
	d.inhaler = {
		inhaledTherapy: 'SABA (salbutamol) PRN.',
		deviceType: 'pMDI + spacer',
		inhalerTechniqueChecked: 'yes',
		inhalerTechniqueAdequate: 'yes',
		adherence: 'good'
	};
	d.vaccinations = {
		influenzaVaccine: 'up-to-date',
		pneumococcalVaccine: 'up-to-date',
		covidVaccine: 'up-to-date'
	};
	d.rehab = { pulmonaryRehabStatus: 'not-indicated', oxygenUse: 'none', restingSpo2: 97 };
	d.selfManagement = {
		comorbidities: 'Hypertension.',
		selfManagementPlan: 'yes',
		rescuePackSupplied: 'yes',
		nextReviewInterval: '12 months'
	};
	d.note = { clinicianNote: 'Stable mild COPD; continue current management.' };
	return d;
}

/** GOLD 2, group B, complete — moderate, breathless but low exacerbation risk. */
function goldTwoGroupB(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr I. Mackenzie',
		clinicianRole: 'gp',
		reviewedAt: '2026-06-22',
		reviewType: 'routine-annual',
		patientIdentifier: 'COPD-100517',
		ageBand: '60-79',
		sex: 'male'
	};
	d.diagnosis = { diagnosisYear: 2015, spirometryConfirmed: 'yes', exposureNotes: 'Lifetime tobacco.' };
	d.spirometry = {
		fev1Litres: 1.6,
		fev1PercentPredicted: 62,
		fvcLitres: 3.0,
		fev1FvcRatio: 0.53,
		spirometryDate: '2026-06-12'
	};
	d.symptoms = { mrcGrade: 3, mmrcGrade: 2, catScore: 18 };
	d.exacerbations = {
		exacerbationsLast12m: 1,
		hospitalisationsLast12m: 0,
		lastExacerbationDate: '2026-01-14',
		rescuePackCourses: 1
	};
	d.smoking = { smokingStatus: 'ex', packYears: 40, cessationSupportOffered: 'yes' };
	d.inhaler = {
		inhaledTherapy: 'LABA+LAMA (tiotropium/olodaterol); SABA PRN.',
		deviceType: 'Respimat soft-mist',
		inhalerTechniqueChecked: 'yes',
		inhalerTechniqueAdequate: 'yes',
		adherence: 'good'
	};
	d.vaccinations = {
		influenzaVaccine: 'up-to-date',
		pneumococcalVaccine: 'up-to-date',
		covidVaccine: 'up-to-date'
	};
	// MRC 3 without a rehab referral → pulmonary-rehab flag.
	d.rehab = { pulmonaryRehabStatus: 'eligible-not-referred', oxygenUse: 'none', restingSpo2: 95 };
	d.selfManagement = {
		comorbidities: 'Ischaemic heart disease.',
		selfManagementPlan: 'yes',
		rescuePackSupplied: 'yes',
		nextReviewInterval: '12 months'
	};
	d.note = { clinicianNote: 'High symptom burden; refer for pulmonary rehabilitation.' };
	return d;
}

/** GOLD 3, group E, complete — severe, frequent exacerbations, current smoker. */
function goldThreeGroupE(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr Z. Nowak',
		clinicianRole: 'respiratory-nurse',
		reviewedAt: '2026-06-24',
		reviewType: 'post-exacerbation',
		patientIdentifier: 'COPD-100639',
		ageBand: '60-79',
		sex: 'female'
	};
	d.diagnosis = { diagnosisYear: 2011, spirometryConfirmed: 'yes', exposureNotes: 'Current smoker, biomass exposure.' };
	d.spirometry = {
		fev1Litres: 1.0,
		fev1PercentPredicted: 42,
		fvcLitres: 2.4,
		fev1FvcRatio: 0.42,
		spirometryDate: '2026-06-18'
	};
	d.symptoms = { mrcGrade: 4, mmrcGrade: 3, catScore: 26 };
	d.exacerbations = {
		exacerbationsLast12m: 3,
		hospitalisationsLast12m: 1,
		lastExacerbationDate: '2026-05-30',
		rescuePackCourses: 3
	};
	d.smoking = { smokingStatus: 'current', packYears: 45, cessationSupportOffered: 'yes' };
	d.inhaler = {
		inhaledTherapy: 'LABA+LAMA+ICS triple therapy; SABA PRN.',
		deviceType: 'DPI',
		inhalerTechniqueChecked: 'yes',
		inhalerTechniqueAdequate: 'no',
		adherence: 'partial'
	};
	d.vaccinations = {
		influenzaVaccine: 'up-to-date',
		pneumococcalVaccine: 'due',
		covidVaccine: 'up-to-date'
	};
	d.rehab = { pulmonaryRehabStatus: 'referred', oxygenUse: 'ambulatory', restingSpo2: 92 };
	d.selfManagement = {
		comorbidities: 'Anxiety, osteoporosis.',
		selfManagementPlan: 'yes',
		rescuePackSupplied: 'yes',
		nextReviewInterval: '3 months'
	};
	d.note = {
		clinicianNote: 'Frequent exacerbations and current smoker; escalate support and address technique.'
	};
	return d;
}

/** GOLD not assigned, group not assigned, incomplete — opportunistic partial review. */
function ungradedIncomplete(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Pharmacist M. Silva',
		clinicianRole: 'pharmacist',
		reviewedAt: '2026-06-27',
		reviewType: 'opportunistic',
		patientIdentifier: 'COPD-100927',
		ageBand: '40-59',
		sex: 'male'
	};
	d.diagnosis = { diagnosisYear: 2022, spirometryConfirmed: '', exposureNotes: '' };
	// No spirometry, no symptom measure recorded → incomplete, ungraded.
	d.smoking = { smokingStatus: 'current', packYears: null, cessationSupportOffered: '' };
	d.note = { clinicianNote: 'Opportunistic medicines review; full annual review to be booked.' };
	return d;
}

/** The sample reviews, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{
		id: 'COPD-2026-0001',
		patientName: 'Osei, Grace',
		reviewedDate: '2026-06-20',
		data: goldOneGroupA()
	},
	{
		id: 'COPD-2026-0002',
		patientName: 'Mackenzie, Ian',
		reviewedDate: '2026-06-22',
		data: goldTwoGroupB()
	},
	{
		id: 'COPD-2026-0003',
		patientName: 'Nowak, Zofia',
		reviewedDate: '2026-06-24',
		data: goldThreeGroupE()
	},
	{
		id: 'COPD-2026-0004',
		patientName: 'Silva, Marcos',
		reviewedDate: '2026-06-27',
		data: ungradedIncomplete()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeCopdReview(s.data);
	return {
		id: s.id,
		patientIdentifier: s.data.context.patientIdentifier,
		patientName: s.patientName,
		reviewType: s.data.context.reviewType,
		goldGrade: g.goldGrade,
		abeGroup: g.abeGroup,
		reviewStatus: g.reviewStatus,
		highFlagCount: g.flags.filter((f) => f.priority === 'high').length,
		flagCount: g.flags.length,
		reviewedDate: s.reviewedDate
	};
});
