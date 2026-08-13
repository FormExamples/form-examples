// ──────────────────────────────────────────────
// Dietetic Assessment — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in sql/08_create_table_dietic_assessment.sql and
// sql/09_create_table_dietic_assessment_grade.sql.
//
// Convention: unanswered text and enum fields are ''; unanswered numeric,
// date, and time fields are null. Yes/no fields are the string union
// 'yes' | 'no' | '' so they round-trip to the SQL CHECK constraints without a
// boolean-to-enum translation layer.
// ──────────────────────────────────────────────

/** Tri-state yes / no / unanswered, matching the SQL CHECK constraints. */
export type YesNo = 'yes' | 'no' | '';

/** Assessment lifecycle status. */
export type AssessmentStatus = 'draft' | 'submitted' | 'reviewed' | 'urgent';

/** MUST risk category (BAPEN). */
export type MustRisk = 'low' | 'medium' | 'high';

/** GLIM malnutrition diagnosis. */
export type GlimDiagnosis = 'none' | 'moderate' | 'severe';

/** Refeeding-syndrome risk per NICE CG32. */
export type RefeedingRisk = 'none' | 'high' | 'highest';

/** Composite nutrition risk, by the max-grade algorithm. */
export type CompositeRisk = 'low' | 'moderate' | 'high' | 'critical';

/** Overall recommendation, following the BAPEN MUST management pathway. */
export type Recommendation =
	| 'routine-care'
	| 'observe-and-rescreen'
	| 'dietetic-treatment-plan'
	| 'urgent-referral'
	| 'discharge'
	| '';

/** How height and weight were obtained. `declined` is a first-class answer. */
export type MeasurementMethod = 'measured' | 'self-reported' | 'estimated' | 'declined' | '';

/** Severity scale shared by several physical-examination findings. */
export type Severity4 = 'none' | 'mild' | 'moderate' | 'severe' | '';

/** Scoring instrument a fired rule belongs to. */
export type Instrument =
	| 'must'
	| 'glim'
	| 'nrs-2002'
	| 'sarcf'
	| 'scoff'
	| 'refeeding'
	| 'composite';

/** Safety-flag priority. */
export type FlagPriority = 'low' | 'medium' | 'high';

/** Safety-flag category, mirroring the SQL CHECK constraint on grade_flag. */
export type FlagCategory =
	| 'high-malnutrition-risk'
	| 'severe-underweight'
	| 'severe-weight-loss'
	| 'refeeding-syndrome-risk'
	| 'dysphagia-aspiration-risk'
	| 'inadequate-oral-intake'
	| 'micronutrient-deficiency'
	| 'electrolyte-derangement'
	| 'dehydration-risk'
	| 'food-insecurity'
	| 'disordered-eating-concern'
	| 'pressure-ulcer'
	| 'sarcopenia-risk'
	| 'uncontrolled-diabetes'
	| 'renal-dietary-conflict'
	| 'drug-nutrient-interaction'
	| 'allergy-anaphylaxis-risk'
	| 'enteral-tube-complication'
	| 'alcohol-excess'
	| 'pregnancy-lactation'
	| 'paediatric'
	| 'capacity-concern'
	| 'safeguarding'
	| 'other';

/** One rule that fired during grading, stored as the audit trail. */
export interface FiredRule {
	ruleId: string;
	instrument: Instrument;
	component: string;
	score: number | null;
	band: string;
	category: string;
	description: string;
}

/** One safety flag raised independently of the MUST score. */
export interface AdditionalFlag {
	flagId: string;
	category: FlagCategory;
	priority: FlagPriority;
	description: string;
	suggestedAction: string;
}

/** One wizard step, for the step list and progress indicator. */
export interface StepConfig {
	number: number;
	title: string;
	shortTitle: string;
}

/** Step 1 — dietitian identification. */
export interface DietitianSection {
	dietitianName: string;
	role: string;
	specialty: string;
	registrationBody: string;
	registrationNumber: string;
	assessmentDate: string;
	assessmentTime: string;
	siteName: string;
	serviceName: string;
	setting: string;
	appointmentType: string;
	plannedDurationMinutes: number | null;
	interpreterRequired: YesNo;
	interpreterLanguage: string;
}

/** Step 2 — patient identification and referral. */
export interface PatientSection {
	firstName: string;
	lastName: string;
	birthDate: string;
	sex: string;
	nhsNumber: string;
	preferredLanguage: string;
	referralSource: string;
	referralDate: string;
	referralReason: string;
	primaryCondition: string;
	consentToRecord: YesNo;
	accompaniedBy: string;
}

/** Step 3 — medical history review. */
export interface HistorySection {
	conditionDiabetes: string;
	conditionCoeliac: YesNo;
	conditionInflammatoryBowelDisease: YesNo;
	conditionChronicKidneyDisease: YesNo;
	conditionLiverDisease: YesNo;
	conditionCancer: YesNo;
	conditionCardiovascularDisease: YesNo;
	conditionRespiratoryDisease: YesNo;
	conditionStroke: YesNo;
	conditionDementia: YesNo;
	conditionEatingDisorder: YesNo;
	conditionOther: string;
	recentSurgery: YesNo;
	recentSurgeryType: string;
	recentSurgeryDate: string;
	gastrointestinalSurgery: string;
	currentSymptoms: string;
	familyHistory: string;
	pregnancyStatus: string;
}

/** Step 4 — medication and supplement check. */
export interface MedicationSection {
	takesPrescriptionMedicines: YesNo;
	takesOverTheCounterMedicines: YesNo;
	takesVitaminSupplements: YesNo;
	takesMineralSupplements: YesNo;
	takesHerbalProducts: YesNo;
	takesOralNutritionalSupplements: YesNo;
	oralNutritionalSupplementDetail: string;
	enteralNutrition: YesNo;
	enteralRoute: string;
	enteralTubeProblem: YesNo;
	parenteralNutrition: YesNo;
	drugNutrientInteraction: YesNo;
	drugNutrientInteractionDetail: string;
	medicationAdherence: string;
	medicationNotes: string;
}

/** Step 5 — anthropometry and physical measurements. */
export interface AnthropometrySection {
	measurementMethod: MeasurementMethod;
	heightAsCm: number | null;
	weightAsKg: number | null;
	midUpperArmCircumferenceAsCm: number | null;
	calfCircumferenceAsCm: number | null;
	waistAsCm: number | null;
	usualWeightAsKg: number | null;
	weight3MonthsAgoAsKg: number | null;
	weight6MonthsAgoAsKg: number | null;
	weightLossIsIntentional: YesNo;
	weightTrend: string;
	clothesOrJewelleryLooser: YesNo;
	oedemaPresent: YesNo;
	oedemaAdjustmentKg: number | null;
	ascitesPresent: YesNo;
	amputationPresent: YesNo;
	amputationAdjustmentPercent: number | null;
	anthropometryNotes: string;
}

/** Step 6 — biochemistry and clinical monitoring. */
export interface BiochemistrySection {
	bloodsSampleDate: string;
	albuminGPerL: number | null;
	cReactiveProteinMgPerL: number | null;
	haemoglobinGPerL: number | null;
	ferritinUgPerL: number | null;
	vitaminB12NgPerL: number | null;
	folateUgPerL: number | null;
	vitaminDNmolPerL: number | null;
	hba1cMmolPerMol: number | null;
	sodiumMmolPerL: number | null;
	potassiumMmolPerL: number | null;
	magnesiumMmolPerL: number | null;
	phosphateMmolPerL: number | null;
	correctedCalciumMmolPerL: number | null;
	ureaMmolPerL: number | null;
	creatinineUmolPerL: number | null;
	egfrMlPerMin: number | null;
	alanineAminotransferaseUPerL: number | null;
	bilirubinUmolPerL: number | null;
	totalCholesterolMmolPerL: number | null;
	triglyceridesMmolPerL: number | null;
	biochemistryNotes: string;
}

/** Step 7 — nutrition-focused physical examination. */
export interface PhysicalExamSection {
	subcutaneousFatLoss: Severity4;
	muscleWastingTemples: YesNo;
	muscleWastingClavicles: YesNo;
	muscleWastingQuadriceps: YesNo;
	muscleWastingSeverity: Severity4;
	peripheralOedemaSeverity: Severity4;
	oralHealth: string;
	dentition: string;
	chewingAbility: string;
	tongueAndMucosa: string;
	skinCondition: string;
	hairCondition: string;
	nailCondition: string;
	pressureUlcerPresent: YesNo;
	pressureUlcerCategory: string;
	handGripStrengthKg: number | null;
	physicalExamNotes: string;
}

/** Step 8 — dietary recall. */
export interface DietaryRecallSection {
	mealsPerDay: number | null;
	snacksPerDay: number | null;
	recallBreakfast: string;
	recallMidMorning: string;
	recallLunch: string;
	recallAfternoon: string;
	recallDinner: string;
	recallEvening: string;
	portionSize: string;
	appetite: string;
	appetiteScore0To10: number | null;
	proportionOfUsualIntakePercent: number | null;
	mealsOutPerWeek: number | null;
	takeawaysPerWeek: number | null;
	foodDiaryCompleted: YesNo;
	estimatedEnergyIntakeKcal: number | null;
	estimatedProteinIntakeG: number | null;
	eatsAlone: YesNo;
	dietaryRecallNotes: string;
}

/** Step 9 — fluid intake and hydration. */
export interface HydrationSection {
	fluidIntakeMlPerDay: number | null;
	fluidTypes: string;
	caffeinatedDrinksPerDay: number | null;
	alcoholUnitsPerWeek: number | null;
	thickenedFluids: YesNo;
	thickenedFluidsIddsiLevel: string;
	hydrationSigns: string;
	fluidRestriction: YesNo;
	fluidRestrictionMlPerDay: number | null;
	hydrationNotes: string;
}

/** Step 10 — food preferences, allergies, and cultural requirements. */
export interface PreferencesSection {
	hasFoodAllergy: YesNo;
	foodAllergyDetail: string;
	allergySeverity: string;
	hasFoodIntolerance: YesNo;
	foodsAvoided: string;
	avoidanceReason: string;
	dislikes: string;
	therapeuticDiet: string;
	dietaryPattern: string;
	religiousOrCulturalRequirement: string;
	fastingPractice: string;
	textureModifiedDiet: YesNo;
	textureModifiedIddsiLevel: string;
	preferencesNotes: string;
}

/** Step 11 — gastrointestinal and swallowing. */
export interface GastrointestinalSection {
	appetiteChange: string;
	earlySatiety: YesNo;
	nausea: YesNo;
	vomiting: YesNo;
	dysphagia: YesNo;
	dysphagiaScreenOutcome: string;
	speechAndLanguageTherapy: YesNo;
	reflux: YesNo;
	abdominalPain: YesNo;
	bloating: YesNo;
	bowelFrequencyPerWeek: number | null;
	bristolStoolType: string;
	constipation: YesNo;
	diarrhoea: YesNo;
	stomaPresent: YesNo;
	stomaOutputMlPerDay: number | null;
	malabsorptionSigns: YesNo;
	gastrointestinalNotes: string;
}

/** Step 12 — lifestyle and environment. */
export interface EnvironmentSection {
	livingSituation: string;
	whoShops: string;
	whoCooks: string;
	cookingSkills: string;
	cookingConfidence0To10: number | null;
	hasCooker: YesNo;
	hasFridge: YesNo;
	hasFreezer: YesNo;
	hasMicrowave: YesNo;
	foodBudgetPerWeek: number | null;
	worriedFoodWouldRunOut: YesNo;
	skippedMealsForMoney: YesNo;
	usesFoodBank: YesNo;
	accessToShops: string;
	hasTransport: YesNo;
	workPattern: string;
	mealSupport: string;
	socialSupport: string;
	environmentNotes: string;
}

/** Step 13 — physical activity and function. */
export interface ActivitySection {
	activityLevel: string;
	exerciseType: string;
	exerciseMinutesPerWeek: number | null;
	sedentaryHoursPerDay: number | null;
	mobility: string;
	fallsInLast12Months: number | null;
	sarcfStrength: number | null;
	sarcfWalking: number | null;
	sarcfRisingFromChair: number | null;
	sarcfClimbingStairs: number | null;
	sarcfFalls: number | null;
	eatsIndependently: YesNo;
	feedingAssistanceRequired: string;
	functionNotes: string;
}

/** Step 14 — behavioural, psychological, and readiness to change. */
export interface BehaviouralSection {
	motivation0To10: number | null;
	stageOfChange: string;
	selfEfficacy0To10: number | null;
	previousAttempts: string;
	barriers: string;
	scoffMakeYourselfSick: YesNo;
	scoffLostControl: YesNo;
	scoffLostOneStone: YesNo;
	scoffBelieveYourselfFat: YesNo;
	scoffFoodDominates: YesNo;
	mood: string;
	anxiety: Severity4;
	cognitiveImpairment: Severity4;
	capacityConcern: YesNo;
	safeguardingConcern: YesNo;
	healthLiteracy: string;
	preferredLearningStyle: string;
	patientGoalInOwnWords: string;
}

/** Step 15 — screening inputs and nutrition diagnosis. */
export interface ScreeningSection {
	acutelyIll: YesNo;
	noNutritionalIntakeOver5Days: YesNo;
	daysOfNegligibleIntake: number | null;
	nrs2002Score: number | null;
	energyRequirementKcal: number | null;
	proteinRequirementG: number | null;
	fluidRequirementMl: number | null;
	requirementEquation: string;
	pesProblem: string;
	pesEtiology: string;
	pesSignsSymptoms: string;
}

/** Step 16 — nutrition care plan, monitoring, and sign-off. */
export interface PlanSection {
	interventionType: string;
	prescribedSupplement: string;
	prescribedSupplementDose: string;
	textureModificationPlan: string;
	goal1: string;
	goal2: string;
	goal3: string;
	educationProvided: string;
	resourcesGiven: string;
	monitoringIndicators: string;
	reviewIntervalWeeks: number | null;
	reviewDate: string;
	onwardReferral: string;
	overrideCompositeRisk: CompositeRisk | '';
	overrideReason: string;
	additionalNotes: string;
	signedByName: string;
}

/** The whole assessment: one section per wizard step. */
export interface DieticAssessment {
	status: AssessmentStatus;
	dietitian: DietitianSection;
	patient: PatientSection;
	history: HistorySection;
	medication: MedicationSection;
	anthropometry: AnthropometrySection;
	biochemistry: BiochemistrySection;
	physicalExam: PhysicalExamSection;
	dietaryRecall: DietaryRecallSection;
	hydration: HydrationSection;
	preferences: PreferencesSection;
	gastrointestinal: GastrointestinalSection;
	environment: EnvironmentSection;
	activity: ActivitySection;
	behavioural: BehaviouralSection;
	screening: ScreeningSection;
	plan: PlanSection;
}

/** The engine's output, mirroring the dietic_assessment_grade table. */
export interface GradingResult {
	mustBmiScore: number;
	mustWeightLossScore: number;
	mustAcuteDiseaseScore: number;
	mustScore: number;
	mustRisk: MustRisk;
	mustIsEstimated: boolean;
	bmi: number | null;
	adjustedWeightKg: number | null;
	weightLossPercent: number | null;
	glimPhenotypicCriteria: string[];
	glimEtiologicCriteria: string[];
	glimDiagnosis: GlimDiagnosis;
	nrs2002Score: number | null;
	sarcfScore: number | null;
	scoffScore: number | null;
	refeedingRisk: RefeedingRisk;
	energyRequirementKcal: number | null;
	proteinRequirementG: number | null;
	computedCompositeRisk: CompositeRisk;
	finalCompositeRisk: CompositeRisk;
	overrideReason: string;
	recommendation: Recommendation;
	firedRules: FiredRule[];
	flags: AdditionalFlag[];
}

/** One assessment row displayed in the dashboard. */
export interface AssessmentRow {
	id: string;
	assessmentDate: string;
	patient: string;
	nhs: string;
	bmi: number | null;
	weightLossPercent: number | null;
	mustScore: number;
	mustRisk: MustRisk;
	mustIsEstimated: boolean;
	glimDiagnosis: GlimDiagnosis;
	refeedingRisk: RefeedingRisk;
	compositeRisk: CompositeRisk;
	recommendation: Recommendation;
	dietitian: string;
	reviewDate: string;
	flags: string[];
}
