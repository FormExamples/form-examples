// ──────────────────────────────────────────────
// Knee Replacement Surgery Evaluation — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in sql/04_create_table_knee_replacement_surgery_evaluation.sql and
// sql/05_create_table_knee_replacement_surgery_evaluation_grade.sql.
//
// Convention: unanswered text and enum fields are ''; unanswered numeric,
// date, and time fields are null. Yes/no fields are the string union
// 'yes' | 'no' | '' so they round-trip to the SQL CHECK constraints without a
// boolean-to-enum translation layer.
// ──────────────────────────────────────────────

/** Tri-state yes / no / unanswered, matching the SQL CHECK constraints. */
export type YesNo = 'yes' | 'no' | '';

/** Evaluation lifecycle status. */
export type EvaluationStatus = 'draft' | 'submitted' | 'reviewed' | 'urgent';

/** Oxford Knee Score category, this form's operational banding. */
export type OksCategory = 'severe' | 'moderate' | 'mild-to-moderate' | 'satisfactory' | '';

/** Computed surgical-candidacy recommendation. */
export type Candidacy =
	| 'strong-candidate'
	| 'candidate'
	| 'continue-conservative'
	| 'not-indicated'
	| 'mdt-review'
	| '';

/** Clinician recommendation on the management plan, step 14. */
export type PlanRecommendation =
	| 'total-knee-replacement'
	| 'partial-knee-replacement'
	| 'continue-conservative-management'
	| 'mdt-review'
	| 'not-currently-a-candidate'
	| '';

/** Scoring instrument a fired rule belongs to. */
export type Instrument = 'oks' | 'kellgren-lawrence' | 'candidacy' | 'safety';

/** Safety-flag priority. */
export type FlagPriority = 'low' | 'medium' | 'high';

/** Safety-flag category, mirroring the SQL CHECK constraint on grade_flag. */
export type FlagCategory =
	| 'conservative-treatment-not-exhausted'
	| 'high-bmi-surgical-risk'
	| 'pre-op-bloods-incomplete'
	| 'fixed-flexion-deformity'
	| 'bilateral-symptomatic'
	| 'paediatric'
	| 'other';

/** One rule that fired during grading, for the audit trail and the report. */
export interface FiredRule {
	ruleId: string;
	instrument: Instrument;
	component: string;
	score: number | null;
	band: string;
	category: string;
	description: string;
}

/** One safety flag raised independently of the candidacy override. */
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

/** Step 1 — clinician identification. */
export interface ClinicianSection {
	clinicianName: string;
	role: string;
	registrationBody: string;
	registrationNumber: string;
	siteName: string;
	assessmentDate: string;
	assessmentTime: string;
}

/** Step 2 — patient identification. */
export interface PatientSection {
	name: string;
	birthDate: string;
	sex: string;
	nhsNumber: string;
	email: string;
	phone: string;
	heightAsCm: number | null;
	weightAsKg: number | null;
	preferredLanguage: string;
}

/** Step 3 — presenting history. */
export interface HistorySection {
	kneeSide: string;
	symptomDurationMonths: number | null;
	painAtRest0To10: number | null;
	painOnActivity0To10: number | null;
	nightPain: YesNo;
	priorKneeSurgery: YesNo;
	priorKneeSurgeryType: string;
	priorKneeSurgeryDate: string;
	priorInjury: YesNo;
	priorInjuryDetail: string;
}

/** Step 4 — Oxford Knee Score, 12 items each scored 0 (worst) to 4 (best). */
export interface OksSection {
	oksPainSeverity: number | null;
	oksWashingAndDrying: number | null;
	oksTransport: number | null;
	oksWalkingDistance: number | null;
	oksPainSittingOrLying: number | null;
	oksLimping: number | null;
	oksKneeling: number | null;
	oksNightPainFrequency: number | null;
	oksPainInterferingWithWork: number | null;
	oksGivingWay: number | null;
	oksShopping: number | null;
	oksStairs: number | null;
}

/** The 12 Oxford Knee Score fields, in publication order. */
export const OKS_ITEM_KEYS: (keyof OksSection)[] = [
	'oksPainSeverity',
	'oksWashingAndDrying',
	'oksTransport',
	'oksWalkingDistance',
	'oksPainSittingOrLying',
	'oksLimping',
	'oksKneeling',
	'oksNightPainFrequency',
	'oksPainInterferingWithWork',
	'oksGivingWay',
	'oksShopping',
	'oksStairs'
];

/** Step 5 — functional limitations. */
export interface FunctionalSection {
	walkingDistanceBeforePain: string;
	stairClimbingAbility: string;
	standFromChairUnaided: YesNo;
	walkingAid: string;
}

/** Step 6 — physical examination: range of motion. */
export interface RangeOfMotionSection {
	flexionDegrees: number | null;
	extensionDeficitDegrees: number | null;
	fixedFlexionDeformityPresent: YesNo;
	fixedFlexionDeformityDegrees: number | null;
}

/** Step 7 — physical examination: stability and alignment. */
export interface StabilitySection {
	coronalDeformityType: string;
	coronalDeformitySeverity: string;
	ligamentAcl: string;
	ligamentPcl: string;
	ligamentMcl: string;
	ligamentLcl: string;
	patellarTracking: string;
}

/** Step 8 — physical examination: muscle strength and effusion. */
export interface StrengthSection {
	quadricepsStrengthMrc: number | null;
	effusionPresent: YesNo;
	crepitusPresent: YesNo;
}

/** Step 9 — diagnostic imaging. */
export interface ImagingSection {
	weightBearingXrayPerformed: YesNo;
	kellgrenLawrenceGradeMedial: number | null;
	kellgrenLawrenceGradeLateral: number | null;
	kellgrenLawrenceGradePatellofemoral: number | null;
	mriPerformed: YesNo;
	mriFindings: string;
	ctPerformed: YesNo;
	ctIndication: string;
}

/** Step 10 — conservative treatment audit. */
export interface ConservativeSection {
	physiotherapyTried: YesNo;
	physiotherapyDurationWeeks: number | null;
	weightManagementAdviceGiven: YesNo;
	injectionGiven: YesNo;
	injectionType: string;
	injectionCount: number | null;
	injectionResponse: string;
	nsaidAnalgesicTrial: YesNo;
	nsaidAnalgesicResponse: string;
	walkingAidTrial: YesNo;
	conservativeMeasuresExhausted: YesNo;
}

/** Step 11 — general health and surgical fitness screen. */
export interface GeneralHealthSection {
	diabetesControlled: string;
	cardiacDisease: YesNo;
	bleedingDisorderOrAnticoagulant: YesNo;
	smokingStatus: string;
	generalFitnessNote: string;
}

/** Step 12 — pre-operative baseline bloods and tests, done / not done. */
export interface PreOpBloodsSection {
	fbcDone: YesNo;
	renalFunctionDone: YesNo;
	clottingDone: YesNo;
	ecgDone: YesNo;
	mrsaScreenDone: YesNo;
	urinalysisDone: YesNo;
}

/** Step 13 — shared decision-making. */
export interface SharedDecisionSection {
	risksBenefitsDiscussed: YesNo;
	realisticExpectationsDiscussed: YesNo;
	patientDecisionAidGiven: YesNo;
	interpreterRequired: YesNo;
}

/** Step 14 — management plan and recommendation. */
export interface PlanSection {
	planRecommendation: PlanRecommendation;
	targetListDate: string;
	responsibleSurgeon: string;
}

/** Step 15 — summary and sign-off. */
export interface SummarySection {
	overrideCandidacy: Candidacy;
	overrideReason: string;
	clinicianNotes: string;
	signedByName: string;
}

/** The whole evaluation: one section per wizard step. */
export interface KneeReplacementSurgeryEvaluation {
	status: EvaluationStatus;
	clinician: ClinicianSection;
	patient: PatientSection;
	history: HistorySection;
	oks: OksSection;
	functional: FunctionalSection;
	rangeOfMotion: RangeOfMotionSection;
	stability: StabilitySection;
	strength: StrengthSection;
	imaging: ImagingSection;
	conservative: ConservativeSection;
	generalHealth: GeneralHealthSection;
	preOpBloods: PreOpBloodsSection;
	sharedDecision: SharedDecisionSection;
	plan: PlanSection;
	summary: SummarySection;
}

/** The engine's output, mirroring the knee_replacement_surgery_evaluation_grade table. */
export interface GradingResult {
	oksItemScores: Record<string, number | null>;
	oksTotal: number;
	computedOksCategory: OksCategory;
	finalOksCategory: OksCategory;
	maxKellgrenLawrenceGrade: number | null;
	computedCandidacy: Candidacy;
	finalCandidacy: Candidacy;
	overrideReason: string;
	firedRules: FiredRule[];
	flags: AdditionalFlag[];
}

/** One evaluation row displayed in the dashboard. */
export interface EvaluationRow {
	id: string;
	assessmentDate: string;
	patient: string;
	nhs: string;
	kneeSide: string;
	oksTotal: number;
	oksCategory: OksCategory;
	candidacy: Candidacy;
	clinician: string;
	planRecommendation: PlanRecommendation;
	flags: string[];
}
