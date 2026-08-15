// ──────────────────────────────────────────────
// Health Screening Questionnaire — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in sql/04_create_table_health_screening_questionnaire.sql and
// sql/05_create_table_health_screening_questionnaire_grade.sql.
//
// Convention: unanswered text and enum fields are ''; unanswered numeric,
// date, and time fields are null. Yes/no fields are the string union
// 'yes' | 'no' | '' so they round-trip to the SQL CHECK constraints without a
// boolean-to-enum translation layer.
// ──────────────────────────────────────────────

/** Tri-state yes / no / unanswered, matching the SQL CHECK constraints. */
export type YesNo = 'yes' | 'no' | '';

/** Questionnaire lifecycle status. */
export type QuestionnaireStatus = 'draft' | 'submitted' | 'reviewed' | 'urgent';

/** PAR-Q+ clearance status. */
export type ParqPlusClearance = 'cleared' | 'further-assessment-required' | '';

/** AUDIT-C band. */
export type AuditCBand = 'low' | 'increasing-risk' | 'higher-risk' | '';

/** Composite risk band, by the max-grade algorithm. */
export type RiskBand = 'low' | 'moderate' | 'high' | 'refer-urgently' | '';

/** Referral recommendation, following the computed risk band. */
export type Recommendation =
	| 'clear-to-proceed'
	| 'routine-review'
	| 'gp-review-required'
	| 'refer-urgently'
	| 'paediatric-pathway'
	| '';

/** Scoring instrument a fired rule belongs to. */
export type Instrument = 'parq-plus' | 'audit-c' | 'composite';

/** Safety-flag priority. */
export type FlagPriority = 'low' | 'medium' | 'high';

/** Safety-flag category, mirroring the SQL CHECK constraint on grade_flag. */
export type FlagCategory =
	| 'urgent-cardiac-symptom'
	| 'parq-positive-medical-clearance-needed'
	| 'alcohol-higher-risk'
	| 'family-history-premature-cardiac-event'
	| 'unexplained-weight-loss'
	| 'occupational-restriction-indicated'
	| 'vaccination-gap'
	| 'paediatric'
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

/** One safety flag raised independently of the risk band. */
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

/** Step 2 — the screened person's identity and emergency contact. */
export interface PatientSection {
	name: string;
	birthDate: string;
	sex: string;
	identifierType: string;
	identifierValue: string;
	email: string;
	phone: string;
	emergencyContactName: string;
	emergencyContactRelationship: string;
	emergencyContactPhone: string;
}

/** The assessor conducting the screen (see AGENTS.md "assessor, not clinician"). */
export interface AssessorSection {
	name: string;
	email: string;
	phone: string;
	role: string;
	registrationBody: string;
	registrationNumber: string;
	employer: string;
}

/** Step 1 — assessment context. */
export interface ContextSection {
	screeningPurpose: string;
	siteName: string;
	assessmentDate: string;
	assessmentMode: string;
}

/** Step 3 — lifestyle: activity and diet. */
export interface ActivityDietSection {
	usualActivityLevel: string;
	moderateExerciseDaysPerWeek: number | null;
	fruitAndVegetablePortionsPerDay: number | null;
	dietNotes: string;
}

/** Step 4 — lifestyle: smoking and alcohol, including AUDIT-C. */
export interface SmokingAlcoholSection {
	smokingStatus: string;
	cigarettesPerDay: number | null;
	auditCFrequency: number | null;
	auditCTypicalQuantity: number | null;
	auditCBingeFrequency: number | null;
}

/** Step 5 — medical history. */
export interface MedicalHistorySection {
	conditionDiabetes: YesNo;
	conditionHypertension: YesNo;
	conditionAsthma: YesNo;
	conditionCopd: YesNo;
	conditionHeartDisease: YesNo;
	conditionKidneyDisease: YesNo;
	conditionThyroid: YesNo;
	conditionOther: string;
	pastSurgeries: string;
	currentMedications: string;
	knownDrugAllergies: string;
}

/** Step 6 — family history. */
export interface FamilyHistorySection {
	familyHistoryPrematureCardiacEvent: YesNo;
	familyHistoryOther: string;
}

/** Step 7 — symptom review. */
export interface SymptomSection {
	symptomUnexplainedChestPain: YesNo;
	symptomDizzySpellsOrFainting: YesNo;
	symptomPersistentCoughOver3Weeks: YesNo;
	symptomUnexplainedWeightLoss: YesNo;
	symptomJointPainRestrictingMovement: YesNo;
	symptomShortnessOfBreathOnExertion: YesNo;
	symptomPalpitations: YesNo;
}

/** Step 8 — PAR-Q+ general health screen, 7 items. */
export interface ParqSection {
	parqDiagnosedHeartCondition: YesNo;
	parqChestPainAtRest: YesNo;
	parqChestPainDuringActivity: YesNo;
	parqDizzinessOrLossOfConsciousness: YesNo;
	parqOtherChronicMedicalCondition: YesNo;
	parqPrescribedMedicationForChronicCondition: YesNo;
	parqBoneOrJointProblem: YesNo;
}

/** Step 9 — vital signs / basic measurements, all optional. */
export interface VitalsSection {
	heightAsCm: number | null;
	weightAsKg: number | null;
	restingBloodPressureSystolic: number | null;
	restingBloodPressureDiastolic: number | null;
	restingHeartRate: number | null;
}

/** Step 10 — occupational / role-specific factors (conditional on step 1). */
export interface OccupationalSection {
	jobRole: string;
	physicalDemandsOfRole: string;
	exposureNoise: YesNo;
	exposureChemicals: YesNo;
	exposureManualHandling: YesNo;
	exposureOther: YesNo;
	exposureOtherDetail: string;
}

/** Step 11 — mental health and wellbeing check, light-touch only. */
export interface WellbeingSection {
	stressLevel: number | null;
	sleepQuality: number | null;
	mentalHealthConcern: YesNo;
	mentalHealthConcernNote: string;
}

/** Step 12 — vaccination status. */
export interface VaccinationSection {
	vaccinationUpToDate: 'yes' | 'no' | 'unsure' | '';
	vaccinationGapsNote: string;
}

/** Step 13 — consent and data. */
export interface ConsentSection {
	consentToScreening: YesNo;
	informationAccurateConfirmed: YesNo;
	interpreterRequired: YesNo;
}

/** Step 14 — summary, override, and sign-off. */
export interface SummarySection {
	overrideRiskBand: RiskBand;
	overrideReason: string;
	notes: string;
	signedByName: string;
}

/** The whole questionnaire: one section per wizard step. */
export interface HealthScreeningQuestionnaire {
	status: QuestionnaireStatus;
	context: ContextSection;
	assessor: AssessorSection;
	patient: PatientSection;
	activityDiet: ActivityDietSection;
	smokingAlcohol: SmokingAlcoholSection;
	medicalHistory: MedicalHistorySection;
	familyHistory: FamilyHistorySection;
	symptoms: SymptomSection;
	parq: ParqSection;
	vitals: VitalsSection;
	occupational: OccupationalSection;
	wellbeing: WellbeingSection;
	vaccination: VaccinationSection;
	consent: ConsentSection;
	summary: SummarySection;
}

/** The engine's output, mirroring the health_screening_questionnaire_grade table. */
export interface GradingResult {
	parqPlusClearance: ParqPlusClearance;
	bodyMassIndex: number | null;
	auditCScore: number | null;
	auditCBand: AuditCBand;
	computedRiskBand: RiskBand;
	finalRiskBand: RiskBand;
	computedRecommendation: Recommendation;
	finalRecommendation: Recommendation;
	overrideReason: string;
	isPaediatric: boolean;
	firedRules: FiredRule[];
	flags: AdditionalFlag[];
}

/** One questionnaire row displayed in the dashboard. */
export interface QuestionnaireRow {
	id: string;
	assessmentDate: string;
	patient: string;
	identifier: string;
	screeningPurpose: string;
	parqPlusClearance: ParqPlusClearance;
	auditCScore: number | null;
	auditCBand: AuditCBand;
	riskBand: RiskBand;
	recommendation: Recommendation;
	assessor: string;
	flags: string[];
}
