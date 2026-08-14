// ──────────────────────────────────────────────
// Perioperative Optimization — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in sql/08_create_table_perioperative_optimization.sql and the grade
// tables beside it.
//
// Convention: unanswered text and enum fields are ''; unanswered numeric, date,
// and time fields are null. Yes/no fields are the string union
// 'yes' | 'no' | '' so they round-trip to the SQL CHECK constraints without a
// boolean-to-enum translation layer.
//
// The section interfaces below are derived from the same object literal as
// `createDefaultAssessment()` in defaults.ts, so the two cannot drift.
// ──────────────────────────────────────────────

/** Tri-state yes / no / unanswered, matching the SQL CHECK constraints. */
export type YesNo = 'yes' | 'no' | '';

/** Assessment lifecycle status. */
export type AssessmentStatus = 'draft' | 'submitted' | 'reviewed' | 'urgent';

/** The eight optimization domains. */
export type DomainKey =
	| 'anaemia'
	| 'glycaemic-control'
	| 'smoking'
	| 'alcohol'
	| 'nutrition'
	| 'physical-fitness'
	| 'medication'
	| 'cardiorespiratory';

/** Per-domain status after time-to-surgery gating. */
export type DomainStatus =
	| 'optimized'
	| 'in-progress'
	| 'action-required'
	| 'insufficient-time'
	| 'not-applicable';

/** Composite surgical readiness band, by max-grade across the domains. */
export type Readiness =
	| 'ready'
	| 'optimization-in-progress'
	| 'optimization-required'
	| 'defer-surgery';

/** The explicit human decision recorded at sign-off. */
export type GateDecision =
	| 'proceed'
	| 'proceed-with-prehabilitation'
	| 'defer-and-optimize'
	| 'accept-unoptimized-risk'
	| 'mdt-review'
	| 'cancel'
	| '';

/** MUST risk category. */
export type MustRisk = 'low' | 'medium' | 'high' | '';

/** Safety-flag priority. */
export type FlagPriority = 'low' | 'medium' | 'high';

/** Safety-flag category, mirroring the SQL CHECK constraint on grade_flag. */
export type FlagCategory =
	| 'severe-anaemia'
	| 'iron-deficiency-untreated'
	| 'hba1c-above-threshold'
	| 'undiagnosed-diabetes'
	| 'sglt2-inhibitor-not-held'
	| 'glp1-agonist-aspiration-risk'
	| 'anticoagulation-plan-missing'
	| 'insufficient-time-to-optimize'
	| 'active-smoker-major-surgery'
	| 'alcohol-dependence-risk'
	| 'high-malnutrition-risk'
	| 'poor-functional-capacity'
	| 'severe-frailty'
	| 'uncontrolled-hypertension'
	| 'cardiac-optimization-required'
	| 'respiratory-optimization-required'
	| 'osa-unassessed'
	| 'renal-optimization-required'
	| 'prior-anaesthetic-complication'
	| 'cognitive-assessment-indicated'
	| 'sarcopenia-risk'
	| 'dehydration-aki-risk'
	| 'rebound-glycaemic-risk'
	| 'psychological-support-required'
	| 'social-support-gap'
	| 'capacity-concern'
	| 'pregnancy'
	| 'paediatric'
	| 'safeguarding'
	| 'other';

/** One safety flag raised independently of the readiness band. */
export interface AdditionalFlag {
	flagId: string;
	category: FlagCategory;
	priority: FlagPriority;
	domain: string;
	description: string;
	suggestedAction: string;
}

/** One wizard step, for the step list and progress indicator. */
export interface StepConfig {
	number: number;
	title: string;
	shortTitle: string;
}

/** Wizard section: assessment. */
export interface AssessmentSection {
	clinicianName: string;
	role: string;
	registrationBody: string;
	registrationNumber: string;
	assessmentDate: string;
	assessmentTime: string;
	siteName: string;
	serviceName: string;
	pathwayStage: string;
	assessmentMode: string;
	referralSource: string;
}

/** Wizard section: patient. */
export interface PatientSection {
	firstName: string;
	lastName: string;
	birthDate: string;
	sex: string;
	nhsNumber: string;
	phone: string;
	email: string;
}

/** Wizard section: procedure. */
export interface ProcedureSection {
	plannedProcedure: string;
	surgicalSpecialty: string;
	consultantSurgeon: string;
	plannedSurgeryDate: string;
	urgency: string;
	surgicalSeverity: string;
	laterality: string;
	anticipatedBloodLossMl: number | null;
	anticipatedLengthOfStayDays: number | null;
	interpreterRequired: YesNo;
	interpreterLanguage: string;
}

/** Wizard section: history. */
export interface HistorySection {
	conditionCardiac: YesNo;
	conditionRespiratory: YesNo;
	conditionRenal: YesNo;
	conditionHepatic: YesNo;
	conditionStroke: YesNo;
	conditionCancer: YesNo;
	conditionRheumatological: YesNo;
	conditionThyroid: YesNo;
	conditionOther: string;
	previousSurgery: YesNo;
	previousSurgeryDetail: string;
	previousAnaestheticComplication: YesNo;
	previousAnaestheticComplicationDetail: string;
	postoperativeNauseaHistory: YesNo;
	difficultAirwayHistory: YesNo;
	malignantHyperthermiaHistory: YesNo;
	venousThromboembolismHistory: YesNo;
	familyHistory: string;
	pregnancyStatus: string;
}

/** Wizard section: medication. */
export interface MedicationSection {
	takesPrescriptionMedicines: YesNo;
	takesOverTheCounterMedicines: YesNo;
	takesHerbalProducts: YesNo;
	takesAnticoagulant: YesNo;
	takesAntiplatelet: YesNo;
	takesAceInhibitorOrArb: YesNo;
	takesSglt2Inhibitor: YesNo;
	takesGlp1Agonist: YesNo;
	glp1Formulation: 'daily' | 'weekly' | '';
	glp1HeldPerGuideline: YesNo;
	glp1ExtendedClearFluidsConfirmed: YesNo;
	glp1GiSymptoms: YesNo;
	glp1GiSymptomsDetails: string;
	glp1GastricUltrasoundPerformed: YesNo;
	glp1GastricUltrasoundFindings: 'empty' | 'low-risk' | 'full-stomach' | '';
	takesCorticosteroid: YesNo;
	takesImmunosuppressant: YesNo;
	takesHormoneTherapy: YesNo;
	medicationHoldPlanAgreed: YesNo;
	medicationHoldPlanAgreedBy: string;
	medicationAdherence: string;
	medicationNotes: string;
}

/** Wizard section: allergy. */
export interface AllergySection {
	hasDrugAllergy: YesNo;
	drugAllergyDetail: string;
	hasFoodAllergy: YesNo;
	foodAllergyDetail: string;
	hasLatexAllergy: YesNo;
	hasAdhesiveAllergy: YesNo;
	hasContrastAllergy: YesNo;
	allergySeverity: string;
	adrenalineAutoInjector: YesNo;
	allergyNotes: string;
}

/** Wizard section: anaemia. */
export interface AnaemiaSection {
	bloodsSampleDate: string;
	haemoglobinGPerL: number | null;
	meanCellVolumeFl: number | null;
	ferritinUgPerL: number | null;
	transferrinSaturationPercent: number | null;
	vitaminB12NgPerL: number | null;
	folateUgPerL: number | null;
	cReactiveProteinMgPerL: number | null;
	creatinineUmolPerL: number | null;
	egfrMlPerMin: number | null;
	anaemiaKnownCause: string;
	anaemiaTreatmentStarted: YesNo;
	anaemiaTreatmentRoute: string;
	anaemiaTreatmentStartDate: string;
	previousTransfusion: YesNo;
	groupAndSaveDone: YesNo;
	anaemiaNotes: string;
}

/** Wizard section: glycaemic. */
export interface GlycaemicSection {
	diabetesType: string;
	diabetesDurationYears: number | null;
	hba1cMmolPerMol: number | null;
	hba1cSampleDate: string;
	capillaryGlucoseMmolPerL: number | null;
	diabetesTreatment: string;
	insulinRegimen: string;
	hypoglycaemiaAwareness: string;
	diabetesTeamReview: YesNo;
	diabetesTeamReviewDate: string;
	footCheckDone: YesNo;
	glycaemicNotes: string;
}

/** Wizard section: smoking. */
export interface SmokingSection {
	smokingStatus: string;
	cigarettesPerDay: number | null;
	packYears: number | null;
	quitDate: string;
	smokingCessationOffered: YesNo;
	smokingCessationAccepted: YesNo;
	nicotineReplacement: YesNo;
	vaping: YesNo;
	smokingNotes: string;
}

/** Wizard section: alcohol. */
export interface AlcoholSection {
	alcoholUnitsPerWeek: number | null;
	auditCFrequency: number | null;
	auditCTypicalQuantity: number | null;
	auditCBingeFrequency: number | null;
	alcoholDependenceFeatures: YesNo;
	alcoholReductionPlanAgreed: YesNo;
	alcoholServicesReferral: YesNo;
	recreationalDrugUse: YesNo;
	recreationalDrugDetail: string;
	alcoholNotes: string;
}

/** Wizard section: nutrition. */
export interface NutritionSection {
	heightAsCm: number | null;
	weightAsKg: number | null;
	usualWeightAsKg: number | null;
	weightLossIsIntentional: YesNo;
	acutelyIll: YesNo;
	noNutritionalIntakeOver5Days: YesNo;
	appetite: string;
	oralNutritionalSupplements: YesNo;
	immunonutrition: YesNo;
	dietitianReferral: YesNo;
	nutritionNotes: string;
}

/** Wizard section: fitness. */
export interface FitnessSection {
	usualActivityLevel: string;
	climbsFlightOfStairs: string;
	metabolicEquivalents: number | null;
	dukeActivityStatusIndex: number | null;
	sixMinuteWalkMetres: number | null;
	cpetAnaerobicThreshold: number | null;
	cpetPeakVo2: number | null;
	gripStrengthKg: number | null;
	prehabilitationOffered: YesNo;
	prehabilitationEnrolled: YesNo;
	prehabilitationSessionsPerWeek: number | null;
	prehabilitationStartDate: string;
	proteinSupplementationRecommended: YesNo;
	fitnessNotes: string;
}

/** Wizard section: frailty. */
export interface FrailtySection {
	clinicalFrailtyScale: number | null;
	// Fried Frailty Phenotype (Fried et al. 2001) — five criteria.
	friedWeakness: YesNo;
	friedSlowness: YesNo;
	friedLowPhysicalActivity: YesNo;
	friedExhaustion: YesNo;
	friedUnintentionalWeightLoss: YesNo;
	// Risk Analysis Index — higher scores indicate greater frailty.
	riskAnalysisIndexScore: number | null;
	// Mini-Cog, indicated when the Clinical Frailty Scale is 5 or above.
	miniCogPerformed: YesNo;
	miniCogScore: number | null;
	cognitiveScreenTool: string;
	cognitiveScreenScore: number | null;
	cognitiveImpairment: string;
	capacityConcern: YesNo;
	fallsInLast12Months: number | null;
	mobilityAid: string;
	livingSituation: string;
	carePackage: string;
	frailtyNotes: string;
}

/** Wizard section: cardioresp. */
export interface CardiorespSection {
	systolicBp: number | null;
	diastolicBp: number | null;
	heartRate: number | null;
	heartRhythm: string;
	murmurPresent: YesNo;
	exerciseTolerance: string;
	ejectionFractionPercent: number | null;
	echoDate: string;
	asthmaControl: string;
	copdControl: string;
	inhalerTechniqueChecked: YesNo;
	rescueSteroids: YesNo;
	spirometryFev1Percent: number | null;
	stopBangScore: number | null;
	sleepApnoeaDiagnosis: YesNo;
	cpapUse: YesNo;
	oxygenSaturationPercent: number | null;
	cardiorespiratoryNotes: string;
}

/** Wizard section: social. */
export interface SocialSection {
	anxietyLevel: string;
	depressionScreen: string;
	understandsProcedure: YesNo;
	expectationsRealistic: YesNo;
	sharedDecisionMakingDiscussed: YesNo;
	hasCarer: YesNo;
	transportHomeArranged: YesNo;
	supportAfterDischarge: string;
	healthLiteracy: string;
	psychologicalSupportOffered: YesNo;
	socialNotes: string;
}

/** Wizard section: plan. */
export interface PlanSection {
	planAnaemia: string;
	referralAnaemia: YesNo;
	planGlycaemicControl: string;
	referralGlycaemicControl: YesNo;
	planSmoking: string;
	referralSmoking: YesNo;
	planAlcohol: string;
	referralAlcohol: YesNo;
	planNutrition: string;
	referralNutrition: YesNo;
	planPhysicalFitness: string;
	referralPhysicalFitness: YesNo;
	planMedication: string;
	referralMedication: YesNo;
	planCardiorespiratory: string;
	referralCardiorespiratory: YesNo;
	responsibleClinician: string;
	planAgreedWithPatient: YesNo;
	planSharedWithPatient: YesNo;
	nextReviewDate: string;
	planNotes: string;
}

/** Wizard section: signoff. */
export interface SignoffSection {
	/** Blank, or one of the Readiness bands, when the clinician overrides. */
	overrideReadiness: Readiness | '';
	overrideReason: string;
	gateDecision: GateDecision;
	additionalNotes: string;
	signedByName: string;
}
/** The whole assessment: one section per wizard step. */
export interface PerioperativeOptimization {
	assessment: AssessmentSection;
	patient: PatientSection;
	procedure: ProcedureSection;
	history: HistorySection;
	medication: MedicationSection;
	allergy: AllergySection;
	anaemia: AnaemiaSection;
	glycaemic: GlycaemicSection;
	smoking: SmokingSection;
	alcohol: AlcoholSection;
	nutrition: NutritionSection;
	fitness: FitnessSection;
	frailty: FrailtySection;
	cardioresp: CardiorespSection;
	social: SocialSection;
	plan: PlanSection;
	signoff: SignoffSection;
}

/** What one domain evaluator returns, before gating. */
export interface DomainEvaluation {
	triggered: boolean;
	applicable: boolean;
	leadTimeWeeks: number;
	started: boolean;
	ruleId: string;
	finding: string;
	intervention: string;
}

/** One domain's result after gating: the form's primary output. */
export interface DomainResult {
	domain: DomainKey;
	status: DomainStatus;
	triggered: boolean;
	leadTimeWeeks: number;
	/** How many weeks short of the lead time, when short; else null. */
	weeksShortfall: number | null;
	interventionStarted: boolean;
	ruleId: string;
	finding: string;
	intervention: string;
}

/** The engine's output, mirroring the grade tables. */
export interface GradingResult {
	weeksToSurgery: number | null;
	gatingApplied: boolean;
	domains: DomainResult[];
	counts: {
		optimized: number;
		inProgress: number;
		actionRequired: number;
		insufficientTime: number;
	};
	bmi: number | null;
	weightLossPercent: number | null;
	mustScore: number | null;
	mustRisk: MustRisk;
	auditCScore: number | null;
	stopBangScore: number | null;
	dukeActivityStatusIndex: number | null;
	clinicalFrailtyScale: number | null;
	friedPhenotypeScore: number | null;
	friedFrailtyCategory: 'robust' | 'pre-frail' | 'frail' | '';
	computedReadiness: Readiness;
	finalReadiness: Readiness;
	overrideReason: string;
	gateDecision: GateDecision;
	recommendedEarliestSurgeryDate: string;
	flags: AdditionalFlag[];
}

/** One assessment row displayed in the dashboard. */
export interface AssessmentRow {
	id: string;
	assessmentDate: string;
	surgeryDate: string;
	weeksToSurgery: number | null;
	patient: string;
	nhs: string;
	procedure: string;
	severity: string;
	readiness: Readiness;
	domainsShortOnTime: string[];
	actionRequired: number;
	gateDecision: GateDecision;
	surgeon: string;
	flagCount: number;
}
