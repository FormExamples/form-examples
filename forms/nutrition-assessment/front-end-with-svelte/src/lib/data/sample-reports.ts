import type { AssessmentData, MUSTRisk, SeverityLevel } from '$lib/engine/types';
import { calculateNutritionGrade } from '$lib/engine/nutrition-grader';
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
	mustScore: number;
	mustRisk: MUSTRisk;
	severity: SeverityLevel;
	bmi: number | null;
	swallowingFlag: boolean;
	flagCount: number;
}

/** A low-risk assessment: healthy BMI, no weight loss, well-nourished. */
function lowRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'John', lastName: 'Smith', dateOfBirth: '1968-04-12', sex: 'male', ethnicity: 'White British', primaryLanguage: 'English' };
	d.anthropometricMeasurements = { ...d.anthropometricMeasurements, weightKg: 78, heightCm: 178, bmi: 24.6, usualWeightKg: 79, weightLossKg: 1, weightLossPercent: 1.3, measurementDate: '2026-06-10' };
	d.dietaryHistory = { ...d.dietaryHistory, dietPattern: 'omnivore', mealsPerDay: 3, snacksPerDay: 2, appetiteDecreased: 'no', foodIntakeReduced: 'no', fluidIntakeAdequate: 'yes', alcoholUse: 'no' };
	d.nutritionalScreening = { ...d.nutritionalScreening, bmiCategory: '>=20', weightLossCategory: '<5', acuteDisease: 'none', unintentionalWeightLoss: 'no', reducedAppetite7Days: 'no' };
	d.currentNutritionalSupport = { ...d.currentNutritionalSupport, oralSupplements: 'no', enteralFeeding: 'no', parenteralNutrition: 'no', vitaminMineralSupplements: 'no', dieticianInvolvement: 'no' };
	return d;
}

/** A moderate-risk assessment: low-normal BMI, reduced appetite. */
function moderateRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Priya', lastName: 'Patel', dateOfBirth: '1959-09-30', sex: 'female', ethnicity: 'Asian British', primaryLanguage: 'English' };
	d.anthropometricMeasurements = { ...d.anthropometricMeasurements, weightKg: 49, heightCm: 158, bmi: 19.6, usualWeightKg: 51, weightLossKg: 2, weightLossPercent: 3.9, measurementDate: '2026-06-12' };
	d.dietaryHistory = { ...d.dietaryHistory, dietPattern: 'vegetarian', mealsPerDay: 3, snacksPerDay: 1, appetiteDecreased: 'yes', appetiteChangeNotes: 'Reduced over the last month', foodIntakeReduced: 'no', fluidIntakeAdequate: 'yes', alcoholUse: 'no' };
	d.nutritionalScreening = { ...d.nutritionalScreening, bmiCategory: '18.5-20', weightLossCategory: '<5', acuteDisease: 'none', unintentionalWeightLoss: 'no', reducedAppetite7Days: 'yes' };
	d.gastrointestinalFunction = { ...d.gastrointestinalFunction, nausea: 'yes', constipation: 'yes' };
	d.currentNutritionalSupport = { ...d.currentNutritionalSupport, oralSupplements: 'no', enteralFeeding: 'no', parenteralNutrition: 'no', vitaminMineralSupplements: 'yes', vitaminMineralList: [{ name: 'Multivitamin', dose: '1 tablet', frequency: 'OD' }], dieticianInvolvement: 'no' };
	return d;
}

/** A high-risk assessment: underweight, moderate weight loss, swallowing issues. */
function highRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Margaret', lastName: 'Jones', dateOfBirth: '1948-01-22', sex: 'female', ethnicity: 'White British', primaryLanguage: 'English' };
	d.anthropometricMeasurements = { ...d.anthropometricMeasurements, weightKg: 44, heightCm: 162, bmi: 16.8, usualWeightKg: 48, weightLossKg: 4, weightLossPercent: 8.3, measurementDate: '2026-06-15' };
	d.dietaryHistory = { ...d.dietaryHistory, dietPattern: 'omnivore', mealsPerDay: 2, snacksPerDay: 0, appetiteDecreased: 'yes', foodIntakeReduced: 'yes', reducedIntakeDays: 4, fluidIntakeAdequate: 'no', alcoholUse: 'no' };
	d.nutritionalScreening = { ...d.nutritionalScreening, bmiCategory: '<18.5', weightLossCategory: '5-10', acuteDisease: 'none', unintentionalWeightLoss: 'yes', reducedAppetite7Days: 'yes' };
	d.swallowingOralHealth = { ...d.swallowingOralHealth, swallowingDifficulty: 'yes', coughingWhileEating: 'yes', chokingEpisodes: 'no', dentureUse: 'yes', denturesFitWell: 'no', mouthSores: 'no' };
	d.foodAllergiesIntolerances = { ...d.foodAllergiesIntolerances, foodAllergies: [{ allergen: 'Shellfish', reaction: 'Hives', severity: 'moderate' }] };
	d.currentNutritionalSupport = { ...d.currentNutritionalSupport, oralSupplements: 'yes', oralSupplementList: [{ name: 'Fortisip', dose: '200 ml', frequency: 'BD' }], enteralFeeding: 'no', parenteralNutrition: 'no', vitaminMineralSupplements: 'no', dieticianInvolvement: 'yes', lastDieticianReviewDate: '2026-05-20' };
	return d;
}

/** A critical assessment: severe underweight, large weight loss, acutely ill, PN. */
function critical(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'David', lastName: 'Williams', dateOfBirth: '1955-11-03', sex: 'male', ethnicity: 'White British', primaryLanguage: 'English' };
	d.anthropometricMeasurements = { ...d.anthropometricMeasurements, weightKg: 42, heightCm: 175, bmi: 13.7, usualWeightKg: 52, weightLossKg: 10, weightLossPercent: 19.2, measurementDate: '2026-06-18' };
	d.dietaryHistory = { ...d.dietaryHistory, dietPattern: 'omnivore', mealsPerDay: 1, snacksPerDay: 0, appetiteDecreased: 'yes', foodIntakeReduced: 'yes', reducedIntakeDays: 10, fluidIntakeAdequate: 'no', alcoholUse: 'yes', alcoholUnitsPerWeek: 28 };
	d.nutritionalScreening = { ...d.nutritionalScreening, bmiCategory: '<18.5', weightLossCategory: '>10', acuteDisease: 'acutely-ill-no-intake-5d', unintentionalWeightLoss: 'yes', reducedAppetite7Days: 'yes' };
	d.swallowingOralHealth = { ...d.swallowingOralHealth, swallowingDifficulty: 'yes', coughingWhileEating: 'yes', chokingEpisodes: 'yes', dentureUse: 'no', mouthSores: 'yes' };
	d.gastrointestinalFunction = { ...d.gastrointestinalFunction, nausea: 'yes', vomiting: 'yes', diarrhea: 'yes', earlysatiety: 'yes' };
	d.foodAllergiesIntolerances = { ...d.foodAllergiesIntolerances, foodAllergies: [{ allergen: 'Peanuts', reaction: 'Throat swelling', severity: 'anaphylaxis' }] };
	d.currentNutritionalSupport = { ...d.currentNutritionalSupport, oralSupplements: 'no', enteralFeeding: 'no', parenteralNutrition: 'yes', parenteralDetails: 'Central line TPN', vitaminMineralSupplements: 'yes', vitaminMineralList: [{ name: 'Pabrinex', dose: '1 pair', frequency: 'TDS' }], dieticianInvolvement: 'yes', lastDieticianReviewDate: '2026-06-17' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'NA-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-10', data: lowRisk() },
	{ id: 'NA-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-12', data: moderateRisk() },
	{ id: 'NA-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-15', data: highRisk() },
	{ id: 'NA-2026-0004', patientName: 'Williams, David', assessedDate: '2026-06-18', data: critical() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateNutritionGrade(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		mustScore: g.mustScore,
		mustRisk: g.mustRisk,
		severity: g.severity,
		bmi: s.data.anthropometricMeasurements.bmi,
		swallowingFlag:
			s.data.swallowingOralHealth.swallowingDifficulty === 'yes' ||
			s.data.swallowingOralHealth.chokingEpisodes === 'yes',
		flagCount: g.additionalFlags.length
	};
});
