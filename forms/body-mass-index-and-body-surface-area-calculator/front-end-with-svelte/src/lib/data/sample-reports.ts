import type { AssessmentData, BmiCategory, CareSetting } from '$lib/engine/types';
import { calculateBmiBsa } from '$lib/engine/bmi-bsa-grader';
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
	patientIdentifier: string;
	patientName: string;
	assessedDate: string;
	careSetting: CareSetting;
	bmi: number | null;
	bmiCategory: BmiCategory;
	bsaMosteller: number | null;
	severeFlag: boolean;
	flagCount: number;
}

/** Normal — BMI within the WHO healthy-weight band. */
function normalCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr G. Osei',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-24T09:15',
		careSetting: 'primary-care',
		purpose: 'screening'
	};
	d.identification = {
		patientIdentifier: 'GP-100482',
		ageBand: '40-64',
		sex: 'female',
		ancestry: 'other'
	};
	d.height.heightCm = 165;
	d.weight.weightKg = 61.5; // BMI ≈ 22.6 → normal
	d.results.bsaFormula = 'mosteller';
	d.results.clinicalNote = 'Routine health check; BMI within the healthy range.';
	return d;
}

/** Overweight — BMI in the 25.0-29.9 pre-obesity band. */
function overweightCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Nurse I. Mackenzie',
		clinicianRole: 'nurse',
		assessedAt: '2026-06-25T11:40',
		careSetting: 'outpatient',
		purpose: 'monitoring'
	};
	d.identification = {
		patientIdentifier: 'OP-573110',
		ageBand: '40-64',
		sex: 'male',
		ancestry: 'unspecified'
	};
	d.height.heightCm = 178;
	d.weight.weightKg = 88; // BMI ≈ 27.8 → overweight
	d.results.bsaFormula = 'mosteller';
	d.results.clinicalNote = 'Weight-management advice offered; review in three months.';
	return d;
}

/** Underweight — BMI below 18.5 (raises a high-priority flag). */
function underweightCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr Z. Nowak',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-26T16:05',
		careSetting: 'oncology',
		purpose: 'drug-dosing'
	};
	d.identification = {
		patientIdentifier: 'ON-100517',
		ageBand: '65-74',
		sex: 'female',
		ancestry: 'asian'
	};
	d.height.heightCm = 170;
	d.weight.weightKg = 48; // BMI ≈ 16.6 → underweight
	d.results.bsaFormula = 'du-bois';
	d.results.clinicalNote = 'Low BMI; nutritional review requested before chemotherapy dosing.';
	return d;
}

/** Obese class III — BMI at or above 40 (raises a high-priority flag). */
function severeObesityCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr B. Ahmed',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-26T22:20',
		careSetting: 'inpatient',
		purpose: 'monitoring'
	};
	d.identification = {
		patientIdentifier: 'IP-100628',
		ageBand: '40-64',
		sex: 'male',
		ancestry: 'unspecified'
	};
	d.height.heightCm = 168;
	d.weight.weightKg = 118; // BMI ≈ 41.8 → obese class III
	d.results.bsaFormula = 'mosteller';
	d.results.clinicalNote = 'Severe obesity; specialist weight-management referral in progress.';
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'BMI-2026-0001', patientName: 'Osei, Grace', assessedDate: '2026-06-24', data: normalCase() },
	{
		id: 'BMI-2026-0002',
		patientName: 'Mackenzie, Ian',
		assessedDate: '2026-06-25',
		data: overweightCase()
	},
	{
		id: 'BMI-2026-0003',
		patientName: 'Nowak, Zofia',
		assessedDate: '2026-06-26',
		data: underweightCase()
	},
	{
		id: 'BMI-2026-0004',
		patientName: 'Ahmed, Bilal',
		assessedDate: '2026-06-26',
		data: severeObesityCase()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateBmiBsa(s.data);
	const severe = g.flaggedIssues.some(
		(f) => f.id === 'F-SEVERE-OBESITY-001' || f.id === 'F-UNDERWEIGHT-001'
	);
	return {
		id: s.id,
		patientIdentifier: s.data.identification.patientIdentifier,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		careSetting: s.data.context.careSetting,
		bmi: g.bmi,
		bmiCategory: g.bmiCategory,
		bsaMosteller: g.bsaMosteller,
		severeFlag: severe,
		flagCount: g.flaggedIssues.length
	};
});
