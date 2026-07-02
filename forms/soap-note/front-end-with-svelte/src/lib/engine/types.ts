// ──────────────────────────────────────────────
// Core assessment data types (SOAP Note)
//
// The SOAP note is a DOCUMENTATION and COMPLETENESS instrument, not a
// numeric-score form: the engine classifies the record as Complete, Partial,
// or Incomplete across the four SOAP sections (Subjective, Objective,
// Assessment, Plan), reports a completeness percentage, and — independently —
// raises safety flags each with a priority. It never sums a total. camelCase
// property names mirror the snake_case SQL columns in
// `sql/04_create_table_soap_note.sql`.
// ──────────────────────────────────────────────

export type ClinicianRole =
	| 'doctor'
	| 'nurse'
	| 'paramedic'
	| 'pharmacist'
	| 'allied-health'
	| 'other'
	| '';
export type CareSetting =
	| 'general-practice'
	| 'outpatient'
	| 'ward'
	| 'emergency-department'
	| 'community'
	| 'telehealth'
	| 'other'
	| '';
export type EncounterType = 'new-problem' | 'follow-up' | 'review' | 'other' | '';
export type AgeBand = 'under-18' | '18-39' | '40-59' | '60-74' | '75-plus' | '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';
export type YesNo = 'yes' | 'no' | '';

export type CompletenessStatus = 'complete' | 'partial' | 'incomplete';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — encounter context. */
export interface Context {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	/** ISO-ish datetime-local string; '' when unset. */
	encounteredAt: string;
	careSetting: CareSetting;
	encounterType: EncounterType;
}

/** Step 2 — patient identification. */
export interface Identification {
	patientIdentifier: string;
	ageBand: AgeBand;
	sex: Sex;
}

/** Step 3 — Subjective (S). */
export interface Subjective {
	/** Required component. */
	presentingComplaint: string;
	/** Required component. */
	historyOfPresentingComplaint: string;
	patientReportedSymptoms: string;
	relevantHistory: string;
	/** Drives the conditional safety-netting requirement. */
	redFlagSymptoms: YesNo;
}

/** Step 4 — Objective (O). */
export interface Objective {
	examinationFindings: string;
	vitalSigns: string;
	/** Drives the abnormal-vitals-unaddressed flag. */
	abnormalVitalsPresent: YesNo;
	investigationResults: string;
}

/** Step 5 — Assessment (A). */
export interface Assessment {
	/** Primary diagnosis or problem — required component. */
	primaryDiagnosis: string;
	problemList: string;
	differential: string;
	clinicalImpression: string;
}

/** Step 6 — Plan (P). */
export interface Plan {
	investigationsPlan: string;
	treatmentPlan: string;
	referrals: string;
	/** Plan item + satisfies the conditional follow-up requirement. */
	followUp: string;
	/** Conditional safety component. */
	safetyNetting: string;
	/** Drives the conditional safety-netting requirement. */
	managedAtHome: YesNo;
}

/** Step 7 — summary. */
export interface Summary {
	clinicalNote: string;
}

/** The full SOAP note data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	subjective: Subjective;
	objective: Objective;
	assessment: Assessment;
	plan: Plan;
	summary: Summary;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** The four section-presence booleans. */
export interface SectionPresence {
	subjectivePresent: boolean;
	objectivePresent: boolean;
	assessmentPresent: boolean;
	planPresent: boolean;
}

/** Per-SOAP-section presence row (for the report). */
export interface SectionStatus {
	/** subjective | objective | assessment | plan */
	section: string;
	/** Human-readable section name. */
	label: string;
	/** True when the section's required component(s) are recorded. */
	present: boolean;
}

/** A required (or conditionally-required) component in the completeness tally. */
export interface RequiredComponent {
	/** Stable rule id, e.g. R-ASSESSMENT-PRESENT-01. */
	id: string;
	/** subjective | objective | assessment | plan */
	section: string;
	/** required-component | conditional-requirement */
	category: string;
	/** Human-readable component name. */
	label: string;
	description: string;
	/** Whether the component is satisfied. */
	present: boolean;
}

/** A single fired / derived rule row (mirrors the grade_rule SQL table). */
export interface FiredRule {
	/** Stable rule id, e.g. R-ASSESSMENT-PRESENT-01. */
	id: string;
	/** subjective | objective | assessment | plan | completeness */
	section: string;
	category: string;
	description: string;
}

/** A clinician-facing safety flag (mirrors the grade_flag SQL table). */
export interface FlaggedIssue {
	id: string;
	/** missing-assessment | missing-plan | red-flag-no-plan | ... */
	category: string;
	priority: Priority;
	description: string;
	suggestedAction: string;
}

/** The full completeness result for one SOAP note. */
export interface GradingResult {
	status: CompletenessStatus;
	/** 0..100. */
	completenessPercent: number;
	sectionStatuses: SectionStatus[];
	presence: SectionPresence;
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
