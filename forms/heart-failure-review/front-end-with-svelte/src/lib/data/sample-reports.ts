import type {
	AssessmentData,
	CareSetting,
	FunctionalStatus,
	OptimisationStatus,
	ReviewStatus
} from '$lib/engine/types';
import { gradeReview } from '$lib/engine/heart-failure-review-grader';
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
	careSetting: CareSetting;
	functionalStatus: FunctionalStatus;
	optimisationStatus: OptimisationStatus;
	reviewStatus: ReviewStatus;
	completenessScore: number;
	highFlagCount: number;
	flagCount: number;
	reviewedDate: string;
}

/**
 * Stable, complete, optimised HFrEF — NYHA II, all four pillars prescribed and
 * at target, monitoring bloods in range. No safety flags.
 */
function stableOptimisedHfref(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Sister J. Okoro',
		clinicianRole: 'hf-nurse',
		reviewDate: '2026-06-20',
		careSetting: 'community-hf-service',
		reviewType: 'routine-annual',
		lastReviewDate: '2025-06-18'
	};
	d.identification = { patientIdentifier: 'NHS-441-882-201', ageBand: '60-79', sex: 'male' };
	d.diagnosis = {
		yearOfDiagnosis: 2019,
		heartFailureType: 'reduced',
		latestLvef: 32,
		lastEchoDate: '2026-02-11',
		aetiology: 'ischaemic'
	};
	d.functional = {
		nyhaClass: 2,
		breathlessness: 'on-exertion',
		orthopnoea: 'no',
		paroxysmalNocturnalDyspnoea: 'no',
		fatigue: 'mild',
		changeSinceLastReview: 'unchanged',
		decompensation: 'no'
	};
	d.fluid = {
		weightKg: 82,
		weightChangeKg: 0.5,
		peripheralOedema: 'none',
		raisedJvp: 'no',
		lungCrackles: 'no',
		systolicBloodPressure: 118,
		diastolicBloodPressure: 72,
		heartRate: 64,
		heartRhythm: 'sinus'
	};
	d.investigations = {
		ntProBnp: 640,
		sodium: 139,
		potassium: 4.4,
		urea: 6.8,
		creatinine: 98,
		egfr: 68,
		haemoglobin: 138,
		ferritin: 180,
		transferrinSaturation: 24,
		hba1c: 41,
		bloodsDate: '2026-06-10'
	};
	d.medication = {
		raasInhibitorStatus: 'prescribed',
		raasInhibitorAgent: 'Sacubitril/valsartan',
		raasInhibitorDose: '97/103 mg twice daily',
		raasInhibitorAtTargetDose: 'yes',
		raasInhibitorAdherence: 'good',
		betaBlockerStatus: 'prescribed',
		betaBlockerAgent: 'Bisoprolol',
		betaBlockerDose: '10 mg once daily',
		betaBlockerAtTargetDose: 'yes',
		betaBlockerAdherence: 'good',
		mraStatus: 'prescribed',
		mraAgent: 'Spironolactone',
		mraDose: '25 mg once daily',
		mraAtTargetDose: 'yes',
		mraAdherence: 'good',
		sglt2InhibitorStatus: 'prescribed',
		sglt2InhibitorAgent: 'Dapagliflozin',
		sglt2InhibitorDose: '10 mg once daily',
		sglt2InhibitorAtTargetDose: 'yes',
		sglt2InhibitorAdherence: 'good',
		loopDiureticAgent: 'Furosemide',
		loopDiureticDose: '40 mg once daily',
		otherMedications: 'Atorvastatin 80 mg, aspirin 75 mg.'
	};
	d.devices = { icd: 'yes', crt: 'no', pacemaker: 'no', deviceCheckStatus: 'up-to-date' };
	d.vaccinations = {
		influenzaVaccination: 'yes',
		pneumococcalVaccination: 'yes',
		covidVaccination: 'yes',
		smokingStatus: 'ex',
		alcoholStatus: 'within-limits',
		dailyWeights: 'yes',
		selfManagementPlan: 'yes',
		cardiacRehab: 'yes'
	};
	d.summary = {
		reviewContext:
			'Stable on optimised guideline-directed medical therapy. Continue current regime; next routine annual review in 12 months.'
	};
	return d;
}

/**
 * Symptomatic HFrEF with an optimisation gap — NYHA III, MRA and SGLT2i not
 * prescribed, signs of congestion. Multiple high flags.
 */
function symptomaticGapHfref(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Rahman',
		clinicianRole: 'gp',
		reviewDate: '2026-06-22',
		careSetting: 'general-practice',
		reviewType: 'post-discharge',
		lastReviewDate: '2026-03-02'
	};
	d.identification = { patientIdentifier: 'NHS-559-104-778', ageBand: '>=80', sex: 'female' };
	d.diagnosis = {
		yearOfDiagnosis: 2022,
		heartFailureType: 'reduced',
		latestLvef: 28,
		lastEchoDate: '2025-11-04',
		aetiology: 'hypertensive'
	};
	d.functional = {
		nyhaClass: 3,
		breathlessness: 'at-rest',
		orthopnoea: 'yes',
		paroxysmalNocturnalDyspnoea: 'yes',
		fatigue: 'severe',
		changeSinceLastReview: 'worse',
		decompensation: 'yes'
	};
	d.fluid = {
		weightKg: 74,
		weightChangeKg: 3.2,
		peripheralOedema: 'moderate',
		raisedJvp: 'yes',
		lungCrackles: 'yes',
		systolicBloodPressure: 104,
		diastolicBloodPressure: 64,
		heartRate: 92,
		heartRhythm: 'atrial-fibrillation'
	};
	d.investigations = {
		ntProBnp: 3800,
		sodium: 136,
		potassium: 4.9,
		urea: 11.2,
		creatinine: 142,
		egfr: 44,
		haemoglobin: 118,
		ferritin: 60,
		transferrinSaturation: 14,
		hba1c: 48,
		bloodsDate: '2026-06-19'
	};
	d.medication = {
		raasInhibitorStatus: 'prescribed',
		raasInhibitorAgent: 'Ramipril',
		raasInhibitorDose: '5 mg once daily',
		raasInhibitorAtTargetDose: 'no',
		raasInhibitorAdherence: 'partial',
		betaBlockerStatus: 'prescribed',
		betaBlockerAgent: 'Bisoprolol',
		betaBlockerDose: '2.5 mg once daily',
		betaBlockerAtTargetDose: 'no',
		betaBlockerAdherence: 'good',
		mraStatus: 'not-prescribed',
		mraAgent: '',
		mraDose: '',
		mraAtTargetDose: '',
		mraAdherence: '',
		sglt2InhibitorStatus: 'not-prescribed',
		sglt2InhibitorAgent: '',
		sglt2InhibitorDose: '',
		sglt2InhibitorAtTargetDose: '',
		sglt2InhibitorAdherence: '',
		loopDiureticAgent: 'Furosemide',
		loopDiureticDose: '80 mg twice daily',
		otherMedications: 'Apixaban 5 mg twice daily.'
	};
	d.devices = { icd: 'no', crt: 'no', pacemaker: 'no', deviceCheckStatus: 'not-applicable' };
	d.vaccinations = {
		influenzaVaccination: 'yes',
		pneumococcalVaccination: 'no',
		covidVaccination: 'yes',
		smokingStatus: 'never',
		alcoholStatus: 'none',
		dailyWeights: 'no',
		selfManagementPlan: 'yes',
		cardiacRehab: 'no'
	};
	d.summary = {
		reviewContext:
			'Recent decompensation with ongoing congestion. Two indicated pillars (MRA, SGLT2i) not prescribed. Up-titrate diuretic, add MRA and SGLT2 inhibitor with monitoring, and refer to the heart-failure specialist team.'
	};
	return d;
}

/**
 * HFpEF, complete review, SGLT2 inhibitor prescribed (optimised for type), NYHA
 * II. Iron deficiency noted; no derangement flags.
 */
function preservedOptimised(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Pharmacist L. Chen',
		clinicianRole: 'pharmacist',
		reviewDate: '2026-06-24',
		careSetting: 'general-practice',
		reviewType: 'medication-titration',
		lastReviewDate: '2025-12-15'
	};
	d.identification = { patientIdentifier: 'NHS-208-660-913', ageBand: '60-79', sex: 'female' };
	d.diagnosis = {
		yearOfDiagnosis: 2023,
		heartFailureType: 'preserved',
		latestLvef: 56,
		lastEchoDate: '2026-01-20',
		aetiology: 'hypertensive'
	};
	d.functional = {
		nyhaClass: 2,
		breathlessness: 'on-exertion',
		orthopnoea: 'no',
		paroxysmalNocturnalDyspnoea: 'no',
		fatigue: 'mild',
		changeSinceLastReview: 'improved',
		decompensation: 'no'
	};
	d.fluid = {
		weightKg: 71,
		weightChangeKg: -1,
		peripheralOedema: 'mild',
		raisedJvp: 'no',
		lungCrackles: 'no',
		systolicBloodPressure: 132,
		diastolicBloodPressure: 78,
		heartRate: 70,
		heartRhythm: 'sinus'
	};
	d.investigations = {
		ntProBnp: 480,
		sodium: 141,
		potassium: 4.1,
		urea: 5.9,
		creatinine: 84,
		egfr: 72,
		haemoglobin: 121,
		ferritin: 22,
		transferrinSaturation: 12,
		hba1c: 52,
		bloodsDate: '2026-06-16'
	};
	d.medication = {
		raasInhibitorStatus: 'prescribed',
		raasInhibitorAgent: 'Losartan',
		raasInhibitorDose: '50 mg once daily',
		raasInhibitorAtTargetDose: 'yes',
		raasInhibitorAdherence: 'good',
		betaBlockerStatus: 'not-prescribed',
		betaBlockerAgent: '',
		betaBlockerDose: '',
		betaBlockerAtTargetDose: '',
		betaBlockerAdherence: '',
		mraStatus: 'not-prescribed',
		mraAgent: '',
		mraDose: '',
		mraAtTargetDose: '',
		mraAdherence: '',
		sglt2InhibitorStatus: 'prescribed',
		sglt2InhibitorAgent: 'Empagliflozin',
		sglt2InhibitorDose: '10 mg once daily',
		sglt2InhibitorAtTargetDose: 'yes',
		sglt2InhibitorAdherence: 'good',
		loopDiureticAgent: 'Furosemide',
		loopDiureticDose: '20 mg once daily',
		otherMedications: 'Amlodipine 5 mg, metformin 500 mg twice daily.'
	};
	d.devices = { icd: 'no', crt: 'no', pacemaker: 'no', deviceCheckStatus: 'not-applicable' };
	d.vaccinations = {
		influenzaVaccination: 'yes',
		pneumococcalVaccination: 'yes',
		covidVaccination: 'no',
		smokingStatus: 'never',
		alcoholStatus: 'within-limits',
		dailyWeights: 'yes',
		selfManagementPlan: 'yes',
		cardiacRehab: 'yes'
	};
	d.summary = {
		reviewContext:
			'HFpEF, well controlled on SGLT2 inhibitor (the principal disease-modifying pillar for preserved EF). Iron deficiency present — arrange IV iron review. Continue current regime.'
	};
	return d;
}

/**
 * Incomplete review — only context, patient, and NYHA recorded; monitoring
 * bloods, medication, vaccinations, and self-management left undocumented.
 */
function incompletePartial(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr M. Idris',
		clinicianRole: 'gp',
		reviewDate: '2026-06-26',
		careSetting: 'general-practice',
		reviewType: 'routine-annual',
		lastReviewDate: '2025-06-25'
	};
	d.identification = { patientIdentifier: 'NHS-773-201-004', ageBand: '40-59', sex: 'male' };
	d.diagnosis = {
		yearOfDiagnosis: 2021,
		heartFailureType: 'mildly-reduced',
		latestLvef: 44,
		lastEchoDate: '2024-09-30',
		aetiology: 'unknown'
	};
	d.functional = {
		nyhaClass: 2,
		breathlessness: 'on-exertion',
		orthopnoea: 'no',
		paroxysmalNocturnalDyspnoea: 'no',
		fatigue: 'mild',
		changeSinceLastReview: 'unchanged',
		decompensation: 'no'
	};
	// Fluid, investigations, medication, vaccinations left blank → incomplete.
	d.summary = {
		reviewContext:
			'Brief consultation only. Bloods, medication review, vaccinations, and self-management outstanding — arrange a full annual review.'
	};
	return d;
}

/** The sample reviews, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{
		id: 'HFR-2026-0001',
		patientName: 'Okonkwo, Daniel',
		reviewedDate: '2026-06-20',
		data: stableOptimisedHfref()
	},
	{
		id: 'HFR-2026-0002',
		patientName: 'Whitfield, Margaret',
		reviewedDate: '2026-06-22',
		data: symptomaticGapHfref()
	},
	{
		id: 'HFR-2026-0003',
		patientName: 'Alvarez, Rosa',
		reviewedDate: '2026-06-24',
		data: preservedOptimised()
	},
	{
		id: 'HFR-2026-0004',
		patientName: 'Harding, Paul',
		reviewedDate: '2026-06-26',
		data: incompletePartial()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeReview(s.data);
	return {
		id: s.id,
		patientIdentifier: s.data.identification.patientIdentifier,
		patientName: s.patientName,
		careSetting: s.data.context.careSetting,
		functionalStatus: g.functionalStatus,
		optimisationStatus: g.medicationOptimisation.status,
		reviewStatus: g.reviewStatus,
		completenessScore: g.completenessScore,
		highFlagCount: g.flaggedIssues.filter((f) => f.priority === 'high').length,
		flagCount: g.flaggedIssues.length,
		reviewedDate: s.reviewedDate
	};
});
