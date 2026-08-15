// ──────────────────────────────────────────────
// Hernia Diagnostic Evaluation — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in sql/04_create_table_hernia_diagnostic_evaluation.sql and
// sql/05_create_table_hernia_diagnostic_evaluation_grade.sql.
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

/** Hernia type, per the SQL CHECK constraint. */
export type HerniaType =
	| 'inguinal'
	| 'femoral'
	| 'umbilical'
	| 'epigastric'
	| 'incisional'
	| 'paraumbilical'
	| 'spigelian'
	| 'other'
	| '';

/** European Hernia Society inguinal subtype. */
export type InguinalSubtype = 'direct' | 'indirect' | 'pantaloon' | 'uncertain' | '';

/** Laterality. */
export type Laterality = 'left' | 'right' | 'bilateral' | '';

/** European Hernia Society size grade: 1 (< 2cm), 2 (2-4cm), 3 (> 4cm). */
export type EhsSizeGrade = '1' | '2' | '3' | '';

/** Clinician judgement of reducibility. */
export type ReducibilityStatus = 'reducible' | 'irreducible' | 'incarcerated' | '';

/** Urgency band, computed red-flag-first rather than by summing a score. */
export type UrgencyBand = 'routine' | 'soon' | 'urgent' | 'emergency' | '';

/** Imaging finding. */
export type ImagingFinding = 'confirms-hernia' | 'no-hernia' | 'inconclusive' | '';

/** Management plan / overall recommendation. */
export type ManagementPlan =
	| 'watchful-waiting'
	| 'elective-repair-referral'
	| 'urgent-referral'
	| 'emergency-referral'
	| 'conservative'
	| '';

/** Scoring instrument a fired rule belongs to. */
export type Instrument = 'reducibility' | 'red-flag' | 'classification' | 'composite';

/** Safety-flag priority. */
export type FlagPriority = 'low' | 'medium' | 'high';

/** Safety-flag category, mirroring the SQL CHECK constraint on grade_flag. */
export type FlagCategory =
	| 'strangulation-suspected'
	| 'incarceration-risk'
	| 'emergency-surgical-referral'
	| 'atypical-presentation'
	| 'occult-hernia-suspected'
	| 'recurrent-hernia'
	| 'paediatric'
	| 'pregnancy'
	| 'capacity-concern'
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

/** One safety flag raised independently of the urgency band. */
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
	assessmentDate: string;
	assessmentTime: string;
	siteName: string;
}

/** Step 2 — patient identification. */
export interface PatientSection {
	firstName: string;
	lastName: string;
	birthDate: string;
	sex: string;
	nhsNumber: string;
	email: string;
	phone: string;
}

/** Step 3 — presenting complaint and history. */
export interface HistorySection {
	durationOfBulge: string;
	painScore0To10: number | null;
	painOnset: string;
	aggravatedByStraining: YesNo;
	aggravatedByLifting: YesNo;
	aggravatedByCoughing: YesNo;
	priorHerniaHistory: YesNo;
	priorHerniaRepair: YesNo;
	priorHerniaRepairMesh: string;
	priorHerniaRepairSite: string;
	historyNotes: string;
}

/** Step 4 — risk factors. */
export interface RiskFactorsSection {
	riskChronicCough: YesNo;
	riskConstipationOrStraining: YesNo;
	riskHeavyLiftingOccupation: YesNo;
	riskObesity: YesNo;
	riskSmoking: YesNo;
	riskFamilyHistory: YesNo;
	riskPriorAbdominalSurgery: YesNo;
	riskPregnancy: YesNo;
	riskConnectiveTissueDisorder: YesNo;
	riskAscites: YesNo;
	riskFactorsNotes: string;
}

/** Step 5 — visual inspection. */
export interface InspectionSection {
	inspectionLocation: string;
	inspectionLocationOther: string;
	bulgeVisibleAtRest: YesNo;
	bulgeEnlargesOnStandingOrStraining: YesNo;
	skinChanges: string;
	inspectionNotes: string;
}

/** Step 6 — palpation and cough impulse. */
export interface PalpationSection {
	palpableMass: YesNo;
	coughImpulsePositive: YesNo;
	tenderness: YesNo;
	massSizeAsCm: number | null;
	palpationNotes: string;
}

/** Step 7 — reducibility assessment. */
export interface ReducibilitySection {
	reducibilityStatus: ReducibilityStatus;
	reducesSpontaneously: YesNo;
	reducesWithManualPressure: YesNo;
	doesNotReduce: YesNo;
	reducibilityNotes: string;
}

/** Step 8 — red-flag / emergency symptom screen. */
export interface RedFlagSection {
	redFlagSeverePain: YesNo;
	redFlagVomiting: YesNo;
	redFlagFever: YesNo;
	redFlagAbsoluteConstipation: YesNo;
	redFlagErythemaOrDiscolouration: YesNo;
	redFlagPreviouslyReducibleNowIrreducible: YesNo;
	redFlagTachycardia: YesNo;
	redFlagNotes: string;
}

/** Step 9 — clinical classification. */
export interface ClassificationSection {
	herniaType: HerniaType;
	herniaTypeOther: string;
	inguinalSubtype: InguinalSubtype;
	laterality: Laterality;
	ehsSizeGrade: EhsSizeGrade;
	classificationNotes: string;
}

/** Step 10 — imaging. */
export interface ImagingSection {
	ultrasoundPerformed: YesNo;
	ultrasoundFindings: ImagingFinding;
	ctPerformed: YesNo;
	ctFindings: ImagingFinding;
	mriPerformed: YesNo;
	mriFindings: ImagingFinding;
	imagingIndication: string;
	imagingNotes: string;
}

/** Step 11 — differential diagnosis considered. */
export interface DifferentialSection {
	differentialLipoma: YesNo;
	differentialLymphadenopathy: YesNo;
	differentialHydrocele: YesNo;
	differentialUndescendedTestis: YesNo;
	differentialFemoralAneurysm: YesNo;
	differentialAbscess: YesNo;
	differentialOther: string;
	differentialNotes: string;
}

/** Step 12 — functional impact. */
export interface FunctionalImpactSection {
	painInterferesWithWorkOrActivity: YesNo;
	functionalImpactScale0To10: number | null;
	activityLimitation: string;
}

/** Step 13 — management plan. */
export interface ManagementSection {
	managementPlan: ManagementPlan;
	conservativeDetail: string;
	referralMade: YesNo;
	referralTargetTimeframe: string;
	managementNotes: string;
}

/** Step 14 — summary and sign-off. */
export interface SummarySection {
	overrideUrgency: UrgencyBand;
	overrideReason: string;
	additionalNotes: string;
	signedByName: string;
}

/** The whole evaluation: one section per wizard step. */
export interface HerniaDiagnosticEvaluation {
	status: EvaluationStatus;
	clinician: ClinicianSection;
	patient: PatientSection;
	history: HistorySection;
	riskFactors: RiskFactorsSection;
	inspection: InspectionSection;
	palpation: PalpationSection;
	reducibility: ReducibilitySection;
	redFlags: RedFlagSection;
	classification: ClassificationSection;
	imaging: ImagingSection;
	differential: DifferentialSection;
	functionalImpact: FunctionalImpactSection;
	management: ManagementSection;
	summary: SummarySection;
}

/** The engine's output, mirroring the hernia_diagnostic_evaluation_grade table. */
export interface GradingResult {
	herniaType: HerniaType;
	herniaSubtype: InguinalSubtype | 'not-applicable' | '';
	ehsClassification: string;
	ehsSizeGrade: EhsSizeGrade;
	reducibilityStatus: ReducibilityStatus;
	anyRedFlag: boolean;
	computedUrgency: UrgencyBand;
	finalUrgency: UrgencyBand;
	overrideReason: string;
	recommendation: ManagementPlan;
	firedRules: FiredRule[];
	flags: AdditionalFlag[];
}

/** One evaluation row displayed in the dashboard. */
export interface EvaluationRow {
	id: string;
	assessmentDate: string;
	patient: string;
	nhs: string;
	herniaType: HerniaType;
	reducibilityStatus: ReducibilityStatus;
	computedUrgency: UrgencyBand;
	finalUrgency: UrgencyBand;
	recommendation: ManagementPlan;
	clinician: string;
	flags: string[];
}
