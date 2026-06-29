import { describe, it, expect } from 'vitest';
import { calculateNutritionGrade } from './nutrition-grader';
import { detectAdditionalFlags } from './flagged-issues';
import { mustRules } from './must-rules';
import type { AssessmentData } from './types';

/**
 * A blank assessment built locally (rather than importing the `.svelte.ts`
 * store, whose runes do not compile under plain vitest). Mirrors
 * `createDefaultAssessment()`.
 */
function blank(): AssessmentData {
	return {
		demographics: { firstName: '', lastName: '', dateOfBirth: '', sex: '', ethnicity: '', primaryLanguage: '' },
		anthropometricMeasurements: {
			weightKg: null, heightCm: null, bmi: null, usualWeightKg: null, weightLossKg: null,
			weightLossPercent: null, midUpperArmCircumferenceCm: null, tricepsSkinfoldMm: null, measurementDate: ''
		},
		dietaryHistory: {
			typicalDiet: '', dietPattern: '', dietPatternOther: '', mealsPerDay: null, snacksPerDay: null,
			appetiteDecreased: '', appetiteChangeNotes: '', foodIntakeReduced: '', reducedIntakeDays: null,
			fluidIntakeAdequate: '', fluidIntakeMlPerDay: null, alcoholUse: '', alcoholUnitsPerWeek: null,
			culturalReligiousRestrictions: '', culturalReligiousDetails: ''
		},
		nutritionalScreening: {
			bmiCategory: '', weightLossCategory: '', acuteDisease: '', unintentionalWeightLoss: '',
			reducedAppetite7Days: '', additionalScreeningNotes: ''
		},
		swallowingOralHealth: {
			swallowingDifficulty: '', coughingWhileEating: '', chokingEpisodes: '', dentureUse: '',
			denturesFitWell: '', dentalPain: '', mouthSores: '', dryMouth: '', tasteChanges: '', swallowingNotes: ''
		},
		gastrointestinalFunction: {
			nausea: '', vomiting: '', diarrhea: '', constipation: '', abdominalPain: '', bloating: '',
			reflux: '', earlysatiety: '', bowelHabitNotes: ''
		},
		foodAllergiesIntolerances: {
			foodAllergies: [], foodIntolerances: [], lactoseIntolerance: '', glutenIntolerance: '',
			allergyTestingDone: '', allergyTestResults: ''
		},
		nutritionalRequirements: {
			estimatedEnergyKcal: null, estimatedProteinG: null, estimatedFluidMl: null,
			requirementsBasis: '', increasedRequirements: '', increasedRequirementsReason: ''
		},
		currentNutritionalSupport: {
			oralSupplements: '', oralSupplementList: [], enteralFeeding: '', enteralRoute: '',
			enteralFormula: '', parenteralNutrition: '', parenteralDetails: '', vitaminMineralSupplements: '',
			vitaminMineralList: [], dieticianInvolvement: '', lastDieticianReviewDate: ''
		},
		carePlanMonitoring: {
			nutritionGoals: '', interventionsPlanned: '', weightMonitoringPlanned: '',
			weightMonitoringFrequency: '', foodIntakeMonitoringPlanned: '', referralRequired: '',
			referralDetails: '', followUpDate: '', additionalNotes: ''
		}
	};
}

function wellNourished(): AssessmentData {
	const d = blank();
	d.anthropometricMeasurements.bmi = 24.6;
	d.anthropometricMeasurements.weightLossPercent = 1;
	d.nutritionalScreening.bmiCategory = '>=20';
	d.nutritionalScreening.weightLossCategory = '<5';
	d.nutritionalScreening.acuteDisease = 'none';
	return d;
}

describe('Nutrition MUST Grading Engine', () => {
	it('returns low risk for a well-nourished patient (score 0)', () => {
		const result = calculateNutritionGrade(wellNourished());
		expect(result.mustScore).toBe(0);
		expect(result.mustRisk).toBe('low');
		expect(result.severity).toBe('low');
		expect(result.answeredCount).toBe(3);
	});

	it('returns medium risk for a MUST score of 1', () => {
		const d = wellNourished();
		d.nutritionalScreening.bmiCategory = '18.5-20'; // 1
		const result = calculateNutritionGrade(d);
		expect(result.mustScore).toBe(1);
		expect(result.mustRisk).toBe('medium');
		expect(result.severity).toBe('moderate');
	});

	it('returns high risk for a MUST score of >=2', () => {
		const d = wellNourished();
		d.anthropometricMeasurements.bmi = 17;
		d.anthropometricMeasurements.weightLossPercent = 8;
		d.nutritionalScreening.bmiCategory = '<18.5'; // 2
		d.nutritionalScreening.weightLossCategory = '5-10'; // 1
		const result = calculateNutritionGrade(d);
		expect(result.mustScore).toBe(3);
		expect(result.mustRisk).toBe('high');
		expect(result.severity).toBe('high');
	});

	it('escalates to critical when acutely ill with no intake >5 days', () => {
		const d = wellNourished();
		d.nutritionalScreening.bmiCategory = '<18.5'; // 2
		d.nutritionalScreening.weightLossCategory = '>10'; // 2
		d.nutritionalScreening.acuteDisease = 'acutely-ill-no-intake-5d'; // 2
		const result = calculateNutritionGrade(d);
		expect(result.mustScore).toBe(6);
		expect(result.severity).toBe('critical');
	});

	it('escalates to critical for severe underweight (BMI < 16) at high risk', () => {
		const d = wellNourished();
		d.anthropometricMeasurements.bmi = 15.2;
		d.nutritionalScreening.bmiCategory = '<18.5'; // 2
		const result = calculateNutritionGrade(d);
		expect(result.mustRisk).toBe('high');
		expect(result.severity).toBe('critical');
	});

	it('escalates to critical for swallowing difficulty with choking at high risk', () => {
		const d = wellNourished();
		d.nutritionalScreening.bmiCategory = '<18.5'; // 2
		d.swallowingOralHealth.swallowingDifficulty = 'yes';
		d.swallowingOralHealth.chokingEpisodes = 'yes';
		const result = calculateNutritionGrade(d);
		expect(result.severity).toBe('critical');
	});

	it('counts only answered MUST steps', () => {
		const d = blank();
		d.nutritionalScreening.bmiCategory = '>=20';
		const result = calculateNutritionGrade(d);
		expect(result.answeredCount).toBe(1);
		expect(result.firedRules).toHaveLength(1);
	});

	it('has unique MUST rule IDs', () => {
		const ids = mustRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Nutrition Flagged Issues Detection', () => {
	it('returns no flags for a well-nourished patient', () => {
		const d = wellNourished();
		d.currentNutritionalSupport.dieticianInvolvement = 'yes';
		const flags = detectAdditionalFlags(d);
		expect(flags).toHaveLength(0);
	});

	it('flags severe underweight as urgent', () => {
		const d = wellNourished();
		d.anthropometricMeasurements.bmi = 15;
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-BMI-001' && f.priority === 'urgent')).toBe(true);
	});

	it('flags choking episodes as urgent', () => {
		const d = wellNourished();
		d.swallowingOralHealth.chokingEpisodes = 'yes';
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-SWAL-001' && f.priority === 'urgent')).toBe(true);
	});

	it('flags anaphylaxis food allergy as urgent', () => {
		const d = wellNourished();
		d.foodAllergiesIntolerances.foodAllergies = [
			{ allergen: 'Peanuts', reaction: 'Anaphylaxis', severity: 'anaphylaxis' }
		];
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id.startsWith('FLAG-ALLERGY-ANAPH') && f.priority === 'urgent')).toBe(true);
	});

	it('flags parenteral nutrition', () => {
		const d = wellNourished();
		d.currentNutritionalSupport.parenteralNutrition = 'yes';
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-SUPP-001')).toBe(true);
	});

	it('sorts flags by priority (urgent first)', () => {
		const d = wellNourished();
		d.anthropometricMeasurements.bmi = 15; // urgent
		d.gastrointestinalFunction.constipation = 'yes'; // low
		const flags = detectAdditionalFlags(d);
		const order = { urgent: 0, high: 1, medium: 2, low: 3 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
