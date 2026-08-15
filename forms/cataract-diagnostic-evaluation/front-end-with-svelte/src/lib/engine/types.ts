// ──────────────────────────────────────────────
// Cataract Diagnostic Evaluation — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in sql/04_create_table_cataract_diagnostic_evaluation.sql and
// sql/05_create_table_cataract_diagnostic_evaluation_grade.sql.
//
// Convention: unanswered text and enum fields are ''; unanswered numeric,
// date, and time fields are null. Yes/no fields are the string union
// 'yes' | 'no' | '' so they round-trip to the SQL CHECK constraints without a
// boolean-to-enum translation layer. Bilateral findings use paired Right /
// Left properties, matching the SQL _right / _left column-suffix convention.
// ──────────────────────────────────────────────

/** Tri-state yes / no / unanswered, matching the SQL CHECK constraints. */
export type YesNo = 'yes' | 'no' | '';

/** Evaluation lifecycle status. */
export type EvaluationStatus = 'draft' | 'submitted' | 'reviewed' | 'urgent';

/** LOCS III severity band, this form's own operational simplification. */
export type LocsIIISeverity = 'mild' | 'moderate' | 'severe' | '';

/** Computed / final surgical-candidacy recommendation. */
export type SurgicalCandidacy = 'not-indicated' | 'consider' | 'indicated' | 'urgent-referral' | '';

/** Management-plan recommendation recorded on step 14. */
export type ManagementRecommendation =
	| 'monitor'
	| 'spectacle-change'
	| 'surgical-referral-routine'
	| 'surgical-referral-urgent'
	| '';

/** Which eye(s), used for laterality and eye-for-surgery fields. */
export type EyeChoice = 'right' | 'left' | 'both' | 'none' | '';

/** Symptom laterality, step 3. */
export type SymptomLaterality = 'right-eye' | 'left-eye' | 'both-eyes' | '';

/** Functional-impact / severity scale shared by several findings. */
export type Severity4 = 'none' | 'mild' | 'moderate' | 'severe' | '';

/** Scoring instrument a fired rule belongs to. */
export type Instrument = 'locs-iii' | 'acuity' | 'glare' | 'composite';

/** Safety-flag priority. */
export type FlagPriority = 'low' | 'medium' | 'high';

/** Safety-flag category, mirroring the SQL CHECK constraint on grade_flag. */
export type FlagCategory =
	| 'competing-pathology-suspected'
	| 'raised-iop'
	| 'view-obscured-fundus-not-assessed'
	| 'rapid-progression'
	| 'biometry-incomplete-for-surgical-planning'
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

/** One safety flag raised independently of the surgical-candidacy recommendation. */
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
	firstName: string;
	lastName: string;
	birthDate: string;
	sex: string;
	nhsNumber: string;
	email: string;
	phone: string;
}

/** Step 3 — presenting complaint & visual symptoms. */
export interface SymptomsSection {
	blurredVision: YesNo;
	glareOrHalos: YesNo;
	nightDrivingDifficulty: YesNo;
	fadedColourPerception: YesNo;
	frequentPrescriptionChanges: YesNo;
	symptomDurationMonths: number | null;
	symptomLaterality: SymptomLaterality;
	presentingComplaintNotes: string;
}

/** Step 4 — ocular & medical history. */
export interface HistorySection {
	historyDiabetes: YesNo;
	historyPriorEyeSurgery: YesNo;
	historyPriorEyeSurgeryDetail: string;
	historyOcularTrauma: YesNo;
	historyUveitis: YesNo;
	historySteroidUse: 'none' | 'systemic' | 'topical' | 'both' | '';
	historyFamilyCataract: YesNo;
	historySmokingStatus: 'never' | 'former' | 'current' | '';
	historyHighUvExposure: YesNo;
	historyHighMyopia: YesNo;
	medicalHistoryNotes: string;
}

/** Step 5 — visual acuity, per eye. */
export interface AcuitySection {
	unaidedVaLogmarRight: number | null;
	unaidedVaLogmarLeft: number | null;
	unaidedVaSnellenRight: string;
	unaidedVaSnellenLeft: string;
	bestCorrectedVaLogmarRight: number | null;
	bestCorrectedVaLogmarLeft: number | null;
	bestCorrectedVaSnellenRight: string;
	bestCorrectedVaSnellenLeft: string;
	pinholeVaLogmarRight: number | null;
	pinholeVaLogmarLeft: number | null;
	pinholeVaSnellenRight: string;
	pinholeVaSnellenLeft: string;
}

/** Step 6 — refraction. */
export interface RefractionSection {
	refractionSphereRight: number | null;
	refractionSphereLeft: number | null;
	refractionCylinderRight: number | null;
	refractionCylinderLeft: number | null;
	refractionAxisRight: number | null;
	refractionAxisLeft: number | null;
	refractionStability: 'stable' | 'changing' | '';
}

/** Step 7 — slit-lamp examination, including LOCS III grading. */
export interface SlitLampSection {
	locsIiiNoRight: number | null;
	locsIiiNoLeft: number | null;
	locsIiiNcRight: number | null;
	locsIiiNcLeft: number | null;
	locsIiiCRight: number | null;
	locsIiiCLeft: number | null;
	locsIiiPRight: number | null;
	locsIiiPLeft: number | null;
	cataractTypeRight: 'nuclear' | 'cortical' | 'posterior-subcapsular' | 'mixed' | 'none' | '';
	cataractTypeLeft: 'nuclear' | 'cortical' | 'posterior-subcapsular' | 'mixed' | 'none' | '';
	anteriorChamberDepthRight: 'normal' | 'shallow' | 'deep' | '';
	anteriorChamberDepthLeft: 'normal' | 'shallow' | 'deep' | '';
	cornealClarityRight: 'clear' | 'hazy' | 'scarred' | '';
	cornealClarityLeft: 'clear' | 'hazy' | 'scarred' | '';
	pupilReactionRight: 'normal' | 'sluggish' | 'fixed' | '';
	pupilReactionLeft: 'normal' | 'sluggish' | 'fixed' | '';
}

/** Step 8 — glare testing. */
export interface GlareSection {
	glareAcuityResultRight: string;
	glareAcuityResultLeft: string;
	glareFunctionalImpact: Severity4;
}

/** Step 9 — tonometry. */
export interface TonometrySection {
	intraocularPressureRightMmhg: number | null;
	intraocularPressureLeftMmhg: number | null;
	tonometryMethod: 'goldmann' | 'non-contact' | 'icare' | 'other' | '';
}

/** Step 10 — dilated fundus examination. */
export interface FundusSection {
	dilatedFundusExamPerformed: YesNo;
	opticDiscCupDiscRatioRight: number | null;
	opticDiscCupDiscRatioLeft: number | null;
	maculaFindingsRight: 'normal' | 'amd-suspected' | 'other' | '';
	maculaFindingsLeft: 'normal' | 'amd-suspected' | 'other' | '';
	retinalFindingsRight: string;
	retinalFindingsLeft: string;
	viewObscuredByCataractRight: YesNo;
	viewObscuredByCataractLeft: YesNo;
}

/** Step 11 — differential / competing-pathology screen. */
export interface DifferentialSection {
	glaucomaSuspected: YesNo;
	glaucomaNotes: string;
	amdSuspected: YesNo;
	amdNotes: string;
	diabeticRetinopathySuspected: YesNo;
	diabeticRetinopathyNotes: string;
}

/** Step 12 — biometry (surgical planning). */
export interface BiometrySection {
	biometryPerformed: YesNo;
	axialLengthRightMm: number | null;
	axialLengthLeftMm: number | null;
	keratometryK1Right: number | null;
	keratometryK1Left: number | null;
	keratometryK2Right: number | null;
	keratometryK2Left: number | null;
	octPerformed: YesNo;
	octFindings: string;
	calculatedIolPowerRight: number | null;
	calculatedIolPowerLeft: number | null;
}

/** Step 13 — functional & quality-of-life impact. */
export interface FunctionalSection {
	functionalDifficultyReading: number | null;
	functionalDifficultyDriving: number | null;
	functionalDifficultyDailyActivities: number | null;
	functionalImpactNotes: string;
}

/** Step 14 — management plan. */
export interface ManagementSection {
	managementRecommendation: ManagementRecommendation;
	eyeForSurgery: EyeChoice;
	risksBenefitsCounselled: YesNo;
	consentDiscussed: YesNo;
	managementNotes: string;
}

/** Step 15 — summary, override, and sign-off. */
export interface SummarySection {
	overrideSurgicalCandidacy: SurgicalCandidacy;
	overrideReason: string;
	clinicianNotes: string;
	signedByName: string;
}

/** The whole evaluation: one section per wizard step. */
export interface CataractDiagnosticEvaluation {
	status: EvaluationStatus;
	clinician: ClinicianSection;
	patient: PatientSection;
	symptoms: SymptomsSection;
	history: HistorySection;
	acuity: AcuitySection;
	refraction: RefractionSection;
	slitLamp: SlitLampSection;
	glare: GlareSection;
	tonometry: TonometrySection;
	fundus: FundusSection;
	differential: DifferentialSection;
	biometry: BiometrySection;
	functional: FunctionalSection;
	management: ManagementSection;
	summary: SummarySection;
}

/** The engine's output, mirroring the cataract_diagnostic_evaluation_grade table. */
export interface GradingResult {
	locsIIISeverityRight: LocsIIISeverity;
	locsIIISeverityLeft: LocsIIISeverity;
	computedSurgicalCandidacy: SurgicalCandidacy;
	finalSurgicalCandidacy: SurgicalCandidacy;
	overrideReason: string;
	functionalImpactScore: number | null;
	firedRules: FiredRule[];
	flags: AdditionalFlag[];
}

/** One evaluation row displayed in the dashboard. */
export interface EvaluationRow {
	id: string;
	assessmentDate: string;
	patient: string;
	nhs: string;
	locsIIISeverityRight: LocsIIISeverity;
	locsIIISeverityLeft: LocsIIISeverity;
	computedSurgicalCandidacy: SurgicalCandidacy;
	finalSurgicalCandidacy: SurgicalCandidacy;
	clinician: string;
	flags: string[];
}
