// ──────────────────────────────────────────────
// Cardiology Request — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in sql/04_create_table_cardiology_request.sql and
// sql/05_create_table_cardiology_request_grade.sql.
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the SQL CHECK constraints) ───

/** Referral lifecycle status. */
export type RequestStatus =
	| 'draft'
	| 'submitted'
	| 'triaged'
	| 'accepted'
	| 'redirected'
	| 'rejected'
	| '';

/** Care setting the referral originates from. */
export type Setting = 'outpatient' | 'inpatient' | 'community' | 'emergency' | '';

/** Requested cardiology service. */
export type RequestedService =
	| 'general-cardiology'
	| 'rapid-access-chest-pain'
	| 'heart-failure'
	| 'arrhythmia-ep'
	| 'valve-clinic'
	| 'inherited-cardiac-conditions'
	| 'pre-operative-cardiac'
	| 'other'
	| '';

/** Primary reason for referral. */
export type ReferralReason =
	| 'chest-pain'
	| 'breathlessness'
	| 'palpitations'
	| 'syncope'
	| 'heart-failure-symptoms'
	| 'murmur-or-valve'
	| 'abnormal-ecg'
	| 'hypertension'
	| 'arrhythmia'
	| 'pre-operative-assessment'
	| 'other'
	| '';

/** Character of chest pain per the angina typicality model. */
export type ChestPainCharacter = 'typical-angina' | 'atypical' | 'non-anginal' | 'none' | '';

/** New York Heart Association functional class. */
export type NyhaClass = 'i' | 'ii' | 'iii' | 'iv' | '';

/** Troponin / BNP result status. */
export type InvestigationStatus = 'elevated' | 'normal' | 'not-done' | '';

/** Requested triage urgency. */
export type Urgency = 'routine' | 'urgent' | 'emergency' | '';

// ─── Axis enumerations (grade) ───

/** Axis A — referral appropriateness. */
export type AppropriatenessBand =
	| 'usually-appropriate'
	| 'may-be-appropriate'
	| 'usually-not-appropriate'
	| '';

/** Axis B — safety / red-flag. */
export type SafetyBand = 'ok' | 'caution' | 'red-flag' | '';

/** Axis D — triage priority. */
export type TriageTier = 'routine' | 'urgent' | 'emergency' | '';

/** Overall vetting recommendation. */
export type Recommendation = 'accept' | 'query-referrer' | 'redirect' | 'reject' | '';

// ─── The request record (sql/04) ───

/**
 * The cardiology referral / consult request — the source-of-truth record the
 * four-axis vetting grade is computed from.
 */
export interface CardiologyRequest {
	// Referring clinician
	referringClinician: string;
	referrerRole: string;
	registrationBody: string;
	registrationNumber: string;
	supervisingConsultant: string;
	requesterContact: string;
	referralDate: string;

	// Patient identification
	nhsNumber: string;
	patientName: string;
	dateOfBirth: string;

	// Referral lifecycle / setting
	status: RequestStatus;
	siteName: string;
	setting: Setting;
	requestedByDate: string;

	// Requested service and reason
	requestedService: RequestedService;
	referralReason: ReferralReason;
	clinicalQuestion: string;
	relevantHistory: string;

	// Symptoms
	symptomChestPain: boolean;
	chestPainCharacter: ChestPainCharacter;
	symptomBreathlessness: boolean;
	nyhaClass: NyhaClass;
	symptomPalpitations: boolean;
	symptomSyncope: boolean;
	symptomOedema: boolean;

	// Red flags / acuity
	suspectedAcs: boolean;
	exertionalSyncope: boolean;
	newOnsetHeartFailure: boolean;

	// Investigations already performed
	ecgDone: boolean;
	ecgFindings: string;
	troponinStatus: InvestigationStatus;
	bnpStatus: InvestigationStatus;

	// Cardiac history and risk factors
	knownCoronaryArteryDisease: boolean;
	previousMi: boolean;
	heartFailure: boolean;
	valveDisease: boolean;
	arrhythmia: boolean;
	hypertension: boolean;
	diabetes: boolean;
	currentMedications: string;

	// Triage
	urgency: Urgency;
	notes: string;
}

// ─── Grading types (sql/05, sql/06, sql/07) ───

/** A scoring axis, used in the fired-rule audit trail. */
export type Axis = 'appropriateness' | 'safety' | 'completeness' | 'triage';

/** Flag category (mirrors the sql/07 CHECK constraint). */
export type FlagCategory =
	| 'suspected-acs'
	| 'exertional-syncope'
	| 'new-onset-heart-failure'
	| 'red-flag-chest-pain'
	| 'missing-reason'
	| 'missing-clinical-question'
	| 'other';

/** Flag priority. */
export type FlagPriority = 'low' | 'medium' | 'high';

/** A single rule that fired during grading (audit trail). */
export interface FiredRule {
	ruleId: string;
	axis: Axis;
	category: string;
	description: string;
}

/** A safety-critical flag, independent of the four axes. */
export interface Flag {
	flagId: string;
	category: FlagCategory;
	priority: FlagPriority;
	description: string;
	suggestedAction: string;
}

/**
 * The computed four-axis vetting grade. Mirrors
 * sql/05_create_table_cardiology_request_grade.sql.
 */
export interface GradingResult {
	// Axis A
	appropriatenessBand: AppropriatenessBand;
	// Axis B
	safetyBand: SafetyBand;
	// Axis C
	completenessPercent: number;
	// Axis D
	triageTier: TriageTier;
	targetTimeframe: string;
	// Overall
	recommendation: Recommendation;
	firedRules: FiredRule[];
	flags: Flag[];
	gradedAt: string;
}

// ─── Step configuration ───

export interface StepConfig {
	number: number;
	title: string;
	shortTitle: string;
}

// ─── Dashboard row ───

/** A graded referral row for the vetting dashboard table. */
export interface ReferralRow {
	id: string;
	patientName: string;
	requestedService: RequestedService;
	referralReason: ReferralReason;
	status: RequestStatus;
	referralDate: string;
	appropriatenessBand: AppropriatenessBand;
	safetyBand: SafetyBand;
	completenessPercent: number;
	triageTier: TriageTier;
	recommendation: Recommendation;
	flagCount: number;
}
