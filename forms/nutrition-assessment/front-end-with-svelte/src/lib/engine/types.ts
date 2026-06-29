// ──────────────────────────────────────────────
// Core assessment data types
// ──────────────────────────────────────────────

export type YesNo = 'yes' | 'no' | '';
export type Sex = 'male' | 'female' | 'other' | '';
export type AllergySeverity = 'mild' | 'moderate' | 'anaphylaxis' | '';

export interface Demographics {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	sex: Sex;
	ethnicity: string;
	primaryLanguage: string;
}

export interface AnthropometricMeasurements {
	weightKg: number | null;
	heightCm: number | null;
	bmi: number | null;
	usualWeightKg: number | null;
	weightLossKg: number | null;
	weightLossPercent: number | null;
	midUpperArmCircumferenceCm: number | null;
	tricepsSkinfoldMm: number | null;
	measurementDate: string;
}

export interface DietaryHistory {
	typicalDiet: string;
	dietPattern: 'omnivore' | 'vegetarian' | 'vegan' | 'pescatarian' | 'other' | '';
	dietPatternOther: string;
	mealsPerDay: number | null;
	snacksPerDay: number | null;
	appetiteDecreased: YesNo;
	appetiteChangeNotes: string;
	foodIntakeReduced: YesNo;
	reducedIntakeDays: number | null;
	fluidIntakeAdequate: YesNo;
	fluidIntakeMlPerDay: number | null;
	alcoholUse: YesNo;
	alcoholUnitsPerWeek: number | null;
	culturalReligiousRestrictions: YesNo;
	culturalReligiousDetails: string;
}

export interface NutritionalScreening {
	bmiCategory: '>=20' | '18.5-20' | '<18.5' | '';
	weightLossCategory: '<5' | '5-10' | '>10' | '';
	acuteDisease: 'none' | 'acutely-ill-no-intake-5d' | '';
	unintentionalWeightLoss: YesNo;
	reducedAppetite7Days: YesNo;
	additionalScreeningNotes: string;
}

export interface SwallowingOralHealth {
	swallowingDifficulty: YesNo;
	coughingWhileEating: YesNo;
	chokingEpisodes: YesNo;
	dentureUse: YesNo;
	denturesFitWell: YesNo;
	dentalPain: YesNo;
	mouthSores: YesNo;
	dryMouth: YesNo;
	tasteChanges: YesNo;
	swallowingNotes: string;
}

export interface GastrointestinalFunction {
	nausea: YesNo;
	vomiting: YesNo;
	diarrhea: YesNo;
	constipation: YesNo;
	abdominalPain: YesNo;
	bloating: YesNo;
	reflux: YesNo;
	earlysatiety: YesNo;
	bowelHabitNotes: string;
}

export interface Allergy {
	allergen: string;
	reaction: string;
	severity: AllergySeverity;
}

export interface FoodAllergiesIntolerances {
	foodAllergies: Allergy[];
	foodIntolerances: string[];
	lactoseIntolerance: YesNo;
	glutenIntolerance: YesNo;
	allergyTestingDone: YesNo;
	allergyTestResults: string;
}

export interface NutritionalRequirements {
	estimatedEnergyKcal: number | null;
	estimatedProteinG: number | null;
	estimatedFluidMl: number | null;
	requirementsBasis: string;
	increasedRequirements: YesNo;
	increasedRequirementsReason: string;
}

export interface Supplement {
	name: string;
	dose: string;
	frequency: string;
}

export interface CurrentNutritionalSupport {
	oralSupplements: YesNo;
	oralSupplementList: Supplement[];
	enteralFeeding: YesNo;
	enteralRoute: 'NG' | 'NJ' | 'PEG' | 'PEJ' | 'RIG' | 'other' | '';
	enteralFormula: string;
	parenteralNutrition: YesNo;
	parenteralDetails: string;
	vitaminMineralSupplements: YesNo;
	vitaminMineralList: Supplement[];
	dieticianInvolvement: YesNo;
	lastDieticianReviewDate: string;
}

export interface CarePlanMonitoring {
	nutritionGoals: string;
	interventionsPlanned: string;
	weightMonitoringPlanned: YesNo;
	weightMonitoringFrequency: 'daily' | 'twice-weekly' | 'weekly' | 'fortnightly' | 'monthly' | '';
	foodIntakeMonitoringPlanned: YesNo;
	referralRequired: YesNo;
	referralDetails: string;
	followUpDate: string;
	additionalNotes: string;
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

export interface AssessmentData {
	demographics: Demographics;
	anthropometricMeasurements: AnthropometricMeasurements;
	dietaryHistory: DietaryHistory;
	nutritionalScreening: NutritionalScreening;
	swallowingOralHealth: SwallowingOralHealth;
	gastrointestinalFunction: GastrointestinalFunction;
	foodAllergiesIntolerances: FoodAllergiesIntolerances;
	nutritionalRequirements: NutritionalRequirements;
	currentNutritionalSupport: CurrentNutritionalSupport;
	carePlanMonitoring: CarePlanMonitoring;
}

// ──────────────────────────────────────────────
// Nutrition (MUST) grading types
// ──────────────────────────────────────────────

/** Malnutrition Universal Screening Tool risk band. */
export type MUSTRisk = 'low' | 'medium' | 'high';

/** Overall clinical severity level. */
export type SeverityLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface MUSTRule {
	id: string;
	category: string;
	description: string;
	/** Score 0-2 for an answered step; -1 when unanswered. */
	evaluate: (data: AssessmentData) => number;
}

export interface FiredRule {
	id: string;
	category: string;
	description: string;
	score: number;
}

export interface AdditionalFlag {
	id: string;
	category: string;
	message: string;
	priority: 'urgent' | 'high' | 'medium' | 'low';
}

export interface GradingResult {
	mustScore: number;
	mustRisk: MUSTRisk;
	severity: SeverityLevel;
	answeredCount: number;
	firedRules: FiredRule[];
	additionalFlags: AdditionalFlag[];
	timestamp: string;
}

// ──────────────────────────────────────────────
// Step configuration
// ──────────────────────────────────────────────

export interface StepConfig {
	number: number;
	title: string;
	shortTitle: string;
	section: keyof AssessmentData;
}
