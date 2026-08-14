// ──────────────────────────────────────────────
// Hip Replacement Surgery Evaluation — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in sql/04_create_table_hip_replacement_surgery_evaluation.sql and
// sql/05_create_table_hip_replacement_surgery_evaluation_grade.sql.
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

/** Oxford Hip Score category — this form's operational convention. */
export type OhsCategory = 'severe' | 'moderate' | 'mild-to-moderate' | 'satisfactory' | '';

/** Surgical-candidacy recommendation. */
export type Candidacy =
	| 'strong-candidate'
	| 'candidate'
	| 'continue-conservative'
	| 'not-indicated'
	| 'mdt-review'
	| '';

/** Scoring instrument a fired rule belongs to. */
export type Instrument = 'ohs' | 'imaging' | 'conservative' | 'composite';

/** Safety-flag priority. */
export type FlagPriority = 'low' | 'medium' | 'high';

/** Safety-flag category, mirroring the SQL CHECK constraint on grade_flag. */
export type FlagCategory =
	| 'conservative-treatment-not-exhausted'
	| 'high-bmi-surgical-risk'
	| 'pre-op-bloods-incomplete'
	| 'leg-length-discrepancy-significant'
	| 'trendelenburg-positive'
	| 'bilateral-symptomatic'
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

/** One safety flag raised independently of the candidacy recommendation. */
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
	gmcNumber: string;
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
}

/** Step 3 — presenting history. */
export interface HistorySection {
	affectedSide: string;
	symptomDurationMonths: number | null;
	painAtRest0To10: number | null;
	painOnActivity0To10: number | null;
	nightPain: YesNo;
	priorHipSurgery: YesNo;
	priorHipSurgeryDetail: string;
	priorInjuryOrDysplasiaHistory: YesNo;
	priorInjuryOrDysplasiaDetail: string;
}

/** Step 4 — Oxford Hip Score, 12 items, each 0 (worst) to 4 (best). */
export interface OhsSection {
	painSeverity: number | null;
	washingAndDrying: number | null;
	transport: number | null;
	dressingSocks: number | null;
	shopping: number | null;
	walkingPain: number | null;
	limping: number | null;
	kneeling: number | null;
	nightPain: number | null;
	workInterference: number | null;
	givingWay: number | null;
	stairs: number | null;
}

/** Step 5 — functional limitations. */
export interface FunctionSection {
	walkingDistanceBeforePain: string;
	shoesAndSocksDifficulty: string;
	walkingAidUse: string;
}

/** Step 6 — physical examination: gait and biomechanical. */
export interface GaitSection {
	limpPresent: YesNo;
	antalgicGait: YesNo;
	trendelenburgSign: YesNo;
	legLengthDiscrepancyAsCm: number | null;
}

/** Step 7 — physical examination: range of motion. */
export interface RangeOfMotionSection {
	flexionDegrees: number | null;
	internalRotationDegrees: number | null;
	externalRotationDegrees: number | null;
	abductionDegrees: number | null;
	adductionDegrees: number | null;
	fixedFlexionDeformityPresent: YesNo;
}

/** Step 8 — physical examination: stability and muscle strength. */
export interface StabilitySection {
	hipAbductorStrengthMrc: number | null;
	jointStability: string;
	tendernessSite: string;
}

/** Step 9 — diagnostic imaging. */
export interface ImagingSection {
	weightBearingXrayPerformed: YesNo;
	kellgrenLawrenceGrade: number | null;
	jointSpaceNarrowing: string;
	subchondralSclerosisOrCystsPresent: YesNo;
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
	steroidInjectionGiven: YesNo;
	steroidInjectionCount: number | null;
	steroidInjectionResponse: string;
	analgesicTrialGiven: YesNo;
	analgesicTrialResponse: string;
	walkingAidTrial: YesNo;
	conservativeMeasuresExhausted: YesNo;
}

/** Step 11 — general health and surgical fitness screen. */
export interface FitnessSection {
	diabetesControlled: string;
	cardiacDiseasePresent: YesNo;
	bleedingDisorderOrAnticoagulantUse: YesNo;
	smokingStatus: string;
	generalFitnessNote: string;
}

/** Step 12 — pre-operative baseline bloods and tests. */
export interface BaselineTestsSection {
	fullBloodCountDone: YesNo;
	renalFunctionDone: YesNo;
	clottingOrInrDone: YesNo;
	ecgDone: YesNo;
	mrsaScreenDone: YesNo;
	urinalysisDone: YesNo;
}

/** Step 13 — shared decision-making. */
export interface DecisionMakingSection {
	risksAndBenefitsDiscussed: YesNo;
	realisticExpectationsDiscussed: YesNo;
	patientDecisionAidGiven: YesNo;
	interpreterRequired: YesNo;
	interpreterLanguage: string;
}

/** Step 14 — management plan and recommendation. */
export interface PlanSection {
	recommendation: string;
	targetListDate: string;
	responsibleSurgeon: string;
}

/** Step 15 — summary and sign-off. */
export interface SummarySection {
	overrideCandidacy: Candidacy;
	overrideReason: string;
	clinicianNotes: string;
	additionalNotes: string;
	signedByName: string;
}

/** The whole evaluation: one section per wizard step. */
export interface HipReplacementSurgeryEvaluation {
	status: EvaluationStatus;
	clinician: ClinicianSection;
	patient: PatientSection;
	history: HistorySection;
	ohs: OhsSection;
	function: FunctionSection;
	gait: GaitSection;
	rangeOfMotion: RangeOfMotionSection;
	stability: StabilitySection;
	imaging: ImagingSection;
	conservative: ConservativeSection;
	fitness: FitnessSection;
	baselineTests: BaselineTestsSection;
	decisionMaking: DecisionMakingSection;
	plan: PlanSection;
	summary: SummarySection;
}

/** The engine's output, mirroring the hip_replacement_surgery_evaluation_grade table. */
export interface GradingResult {
	ohsTotal: number;
	ohsCategory: OhsCategory;
	bmi: number | null;
	kellgrenLawrenceGrade: number | null;
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
	bmi: number | null;
	ohsTotal: number;
	ohsCategory: OhsCategory;
	kellgrenLawrenceGrade: number | null;
	candidacy: Candidacy;
	clinician: string;
	flags: string[];
}
