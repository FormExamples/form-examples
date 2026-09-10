// ──────────────────────────────────────────────
// Core assessment data types (Diabetes Podiatry Assessment)
//
// Diabetes podiatry assessment is a *risk-stratification* pathway, not a
// numeric-score form. For each foot an assessor records the neuropathy
// status, pedal pulses status, deformity, callus, skin breakdown, active
// ulceration (and its severity), ulceration/amputation history, and a
// suspected-Charcot-foot marker, plus patient-wide risk factors (renal
// replacement therapy, visual acuity impairment, self-care ability,
// footwear). The engine classifies each foot's risk independently, applies
// patient-wide high-risk/urgent overrides, and derives an overall risk
// category and review pathway via a gated, first-match cascade ordered by
// clinical urgency (most urgent wins). It does not sum a total.
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_diabetes_podiatry_assessment.sql`.
// ──────────────────────────────────────────────

export type AssessmentSetting =
	| 'annual-review'
	| 'foot-protection-clinic'
	| 'hospital-admission'
	| 'pre-discharge'
	| 'other'
	| '';
export type DiabetesType = 'type-1' | 'type-2' | 'other' | 'unknown' | '';
export type SelfCareAbility = 'independent' | 'partial' | 'unable' | '';
export type NeuropathyStatus = 'sensate' | 'insensate' | 'not-tested' | '';
export type PulsesStatus = 'normal' | 'diminished' | 'absent' | 'not-tested' | '';
export type UlcerSeverity = 'superficial' | 'deep' | 'infected' | 'critical-ischaemia' | '';
export type PreviousAmputation = 'none' | 'minor' | 'major' | '';
export type YesNo = 'yes' | 'no' | '';
export type Priority = 'high' | 'medium' | 'low';

/** The per-foot and overall risk category (NICE NG19). */
export type Risk = 'low' | 'moderate' | 'high' | 'active-urgent' | '';

/** The review pathway the classification cascade resolves to. */
export type ReviewPathway =
	| 'urgent-mdt-referral'
	| 'high-risk-review'
	| 'moderate-risk-review'
	| 'annual-review'
	| '';

/** The referral destination derived from the review pathway. */
export type Referral =
	| 'none'
	| 'foot-protection-service'
	| 'multidisciplinary-foot-team'
	| 'urgent-mdt'
	| '';

export type Status = 'complete' | 'incomplete';

/** Step 1 — assessment context. */
export interface Context {
	/** date string; '' when unset. */
	assessedAt: string;
	assessmentSetting: AssessmentSetting;
}

/** Step 2 — patient identification & patient-wide risk factors. */
export interface RiskFactors {
	diabetesType: DiabetesType;
	yearsSinceDiagnosis: number | null;
	onRenalReplacementTherapy: YesNo;
	visualAcuityImpairment: YesNo;
	selfCareAbility: SelfCareAbility;
	footwearAppropriate: YesNo;
}

/** Steps 3 / 4 — per-foot examination block (right foot and left foot). */
export interface FootExam {
	neuropathyStatus: NeuropathyStatus;
	pulsesStatus: PulsesStatus;
	deformity: YesNo;
	callus: YesNo;
	skinBreakdown: YesNo;
	activeUlcer: YesNo;
	ulcerSeverity: UlcerSeverity;
	previousUlcer: YesNo;
	previousAmputation: PreviousAmputation;
	suspectedCharcot: YesNo;
}

/** Step 5 — assessor free-text note. */
export interface Note {
	clinicalContext: string;
}

/** The full diabetes-podiatry-assessment data model. */
export interface AssessmentData {
	context: Context;
	riskFactors: RiskFactors;
	rightFoot: FootExam;
	leftFoot: FootExam;
	note: Note;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** The overall classification context the review-pathway cascade evaluates. */
export interface OverallContext {
	rightFootRisk: Risk;
	leftFootRisk: Risk;
	worstFootRisk: Risk;
	onRenalReplacementTherapy: boolean;
	/** True when the worse foot also carries a previous-ulcer/amputation history. */
	tighterHighRiskInterval: boolean;
}

/** A single evaluated / fired rule row (mirrors the grade_rule SQL table). */
export interface FiredRule {
	/** Stable rule id, e.g. R-OVERALL-ACTIVE-URGENT-01. */
	id: string;
	stage: string;
	category: string;
	description: string;
}

/** An assessor-facing safety flag (mirrors the grade_flag SQL table). */
export interface FlaggedIssue {
	id: string;
	category: string;
	priority: Priority;
	description: string;
	suggestedAction: string;
}

/** A diabetes-podiatry-assessment review-pathway rule (gated, first-match). */
export interface ReviewRule {
	id: string;
	stage: string;
	category: string;
	reviewPathway: ReviewPathway;
	referral: Referral;
	intervalMonths: 1 | 3 | 6 | 12 | null;
	description: string;
	/** true when this rule's gated condition matches. */
	evaluate: (ctx: OverallContext) => boolean;
}

/** The full classification result for one assessment record. */
export interface GradingResult {
	rightFootRisk: Risk;
	leftFootRisk: Risk;
	overallRisk: Risk;
	reviewPathway: ReviewPathway;
	reviewIntervalMonths: 1 | 3 | 6 | 12 | null;
	referral: Referral;
	status: Status;
	firedRules: FiredRule[];
	flaggedIssues: FlaggedIssue[];
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
