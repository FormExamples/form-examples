// ──────────────────────────────────────────────
// Core assessment data types (Ward Round Note)
//
// The ward round note is a DOCUMENTATION and COMPLETENESS instrument, not a
// numeric-score form: the engine classifies the daily inpatient review as
// Complete, Partial, or Incomplete across the eight required review components
// (header, problems, examination, investigations, VTE, medication, plan,
// escalation) plus two recommended components (overnight events, estimated
// discharge), reports a completeness percentage, and — independently — raises
// safety flags each with a priority. It never sums a total. An explicit negative
// (e.g. "no changes", "none outstanding") counts as documented — a deliberate
// negative is a valid clinical record. camelCase property names mirror the
// snake_case SQL columns in `sql/04_create_table_ward_round_note.sql`.
// ──────────────────────────────────────────────

export type ClinicianGrade =
	| 'fy1'
	| 'fy2'
	| 'core-trainee'
	| 'specialty-registrar'
	| 'acp'
	| 'physician-associate'
	| 'consultant'
	| '';
export type ObservationTrend = 'improving' | 'stable' | 'deteriorating' | '';
export type VteStatus = 'assessed' | 'not-required' | 'not-done' | '';
export type EscalationStatus =
	| 'for-full-escalation'
	| 'ward-level-ceiling'
	| 'dnacpr'
	| 'not-recorded'
	| '';
export type YesNo = 'yes' | 'no' | '';

export type CompletenessStatus = 'complete' | 'partial' | 'incomplete';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — review header (required component). */
export interface Header {
	clinicianName: string;
	clinicianGrade: ClinicianGrade;
	/** ISO-ish datetime-local string; '' when unset. */
	reviewedAt: string;
	ward: string;
}

/** Step 2 — patient identification. */
export interface Identification {
	patientIdentifier: string;
	/** yyyy-mm-dd; '' when unset. */
	admissionDate: string;
	primaryDiagnosis: string;
}

/** Step 3 — overnight events (recommended component). */
export interface Overnight {
	overnightEvents: string;
	/** Explicit "no events overnight" flag. */
	noOvernightEvents: YesNo;
}

/** Step 4 — current issues and progress (required component: problems). */
export interface Problems {
	problemList: string;
}

/** Step 5 — examination and latest observations (required component: examination). */
export interface Examination {
	examinationSummary: string;
	/** Latest NEWS2 total (0..25); null when unrecorded. */
	news2Total: number | null;
	/** Any single parameter scoring 3. */
	news2SingleParamThree: YesNo;
	observationTrend: ObservationTrend;
}

/** Step 6 — investigations reviewed (required component: investigations). */
export interface Investigations {
	investigationsReviewed: string;
	/** Explicit "none outstanding" flag. */
	noInvestigationsOutstanding: YesNo;
	abnormalResultFlagged: YesNo;
	abnormalResultActioned: YesNo;
}

/** Step 7 — VTE assessment (required component: vte). */
export interface Vte {
	vteStatus: VteStatus;
	vteProphylaxisInPlace: YesNo;
}

/** Step 8 — medication changes (required component: medication). */
export interface Medication {
	medicationChanges: string;
	/** Explicit "no changes" flag. */
	noMedicationChanges: YesNo;
}

/** Step 9 — plan and jobs for the day (required component: plan). */
export interface Plan {
	planAndJobs: string;
}

/** Step 10 — escalation and discharge (required: escalation; recommended: discharge). */
export interface Escalation {
	escalationStatus: EscalationStatus;
	/** A consultant / senior grade named on the entry. */
	seniorReviewPresent: YesNo;
	/** yyyy-mm-dd; '' when unset. */
	estimatedDischargeDate: string;
	/** Explicit "not yet estimable" flag. */
	dischargeNotEstimable: YesNo;
}

/** Step 11 — summary. */
export interface Summary {
	clinicalNote: string;
}

/** The full ward round note data model. */
export interface AssessmentData {
	header: Header;
	identification: Identification;
	overnight: Overnight;
	problems: Problems;
	examination: Examination;
	investigations: Investigations;
	vte: Vte;
	medication: Medication;
	plan: Plan;
	escalation: Escalation;
	summary: Summary;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** Per-component `documented` booleans (all ten review components). */
export interface ComponentPresence {
	header: boolean;
	problems: boolean;
	examination: boolean;
	investigations: boolean;
	vte: boolean;
	medication: boolean;
	plan: boolean;
	escalation: boolean;
	overnightEvents: boolean;
	estimatedDischarge: boolean;
}

/** Per-component presence row (for the report). */
export interface ComponentStatus {
	/** header | problems | examination | ... | estimated-discharge */
	component: string;
	/** Human-readable component name. */
	label: string;
	/** Whether the component is a required component. */
	required: boolean;
	/** Whether the component is documented. */
	present: boolean;
}

/** A required (or recommended) component in the completeness tally. */
export interface RuleComponent {
	/** Stable rule id, e.g. R-PLAN-DOCUMENTED-01. */
	id: string;
	/** header | problems | ... | estimated-discharge */
	component: string;
	/** required-component | recommended-component */
	category: string;
	/** Human-readable component name. */
	label: string;
	description: string;
	/** Whether the component is documented. */
	present: boolean;
}

/** A single fired / derived rule row (mirrors the grade_rule SQL table). */
export interface FiredRule {
	/** Stable rule id, e.g. R-PLAN-DOCUMENTED-01. */
	id: string;
	/** header | problems | ... | completeness */
	component: string;
	category: string;
	description: string;
}

/** A clinician-facing safety flag (mirrors the grade_flag SQL table). */
export interface FlaggedIssue {
	id: string;
	/** deteriorating-news2-escalation | vte-not-done | no-plan-jobs | ... */
	category: string;
	priority: Priority;
	description: string;
	suggestedAction: string;
}

/** The full completeness result for one ward round note. */
export interface GradingResult {
	status: CompletenessStatus;
	/** 0..100 over the eight required components. */
	completenessPercent: number;
	componentStatuses: ComponentStatus[];
	presence: ComponentPresence;
	documentedComponents: string[];
	documentedRequired: number;
	totalRequired: number;
	firedRules: FiredRule[];
	flags: FlaggedIssue[];
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
