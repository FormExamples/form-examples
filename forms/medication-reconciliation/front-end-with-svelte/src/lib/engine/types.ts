// ──────────────────────────────────────────────
// Core data types (Medication Reconciliation)
//
// A documentation-and-completeness form: the engine grades a STATUS
// (complete / discrepancies-outstanding / incomplete), not a numeric score.
//
// camelCase property names mirror the snake_case SQL columns across the parent
// header (`sql/04_create_table_medication_reconciliation.sql`) and its FOUR
// one-to-many child tables:
//   - information sources  (`..._information_source`)
//   - allergies            (`..._allergy`)
//   - medication line items, tagged bpmh|inpatient via `listSource`
//                          (`..._line_item`)
//   - discrepancies        (`..._discrepancy`)
// ──────────────────────────────────────────────

export type ReconciliationType = 'admission' | 'transfer' | 'discharge' | '';
export type CareSetting =
	| 'emergency-department'
	| 'acute-medical-unit'
	| 'surgical-admissions'
	| 'ward'
	| 'critical-care'
	| 'other'
	| '';
export type ClinicianRole =
	| 'pharmacist'
	| 'pharmacy-technician'
	| 'prescriber'
	| 'nurse'
	| 'other'
	| '';
export type AgeBand = 'adult' | 'paediatric' | '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';
export type AllergyStatus = 'documented' | 'no-known-drug-allergies' | 'not-documented' | '';
export type SourceType =
	| 'patient-interview'
	| 'carer-interview'
	| 'gp-record'
	| 'repeat-prescription'
	| 'community-pharmacy'
	| 'dispensing-history'
	| 'previous-discharge-summary'
	| 'own-drugs-bag'
	| 'care-home-mar'
	| '';
export type ReactionType = 'allergy' | 'intolerance' | 'adverse-effect' | 'unknown' | '';
export type Severity = 'mild' | 'moderate' | 'severe' | 'anaphylaxis' | '';
export type ListSource = 'bpmh' | 'inpatient' | '';
export type Route = 'oral' | 'iv' | 'im' | 'subcutaneous' | 'topical' | 'inhaled' | 'other' | '';
export type HighRiskClass = 'none' | 'anticoagulant' | 'insulin' | 'opioid' | 'other' | '';
export type Adherence = 'taking' | 'not-taking' | 'intermittent' | 'unknown' | '';
export type ItemStatus = 'active' | 'held' | 'stopped' | 'suspended' | '';
export type DiscrepancyType =
	| 'omission'
	| 'commission'
	| 'duplication'
	| 'dose'
	| 'frequency'
	| 'route'
	| 'formulation'
	| '';
export type IntendedAction = 'continue' | 'hold' | 'stop' | 'change' | 'start' | '';
export type YesNo = 'yes' | 'no' | '';
export type ReconciliationStatus = 'complete' | 'discrepancies-outstanding' | 'incomplete';
export type Priority = 'high' | 'medium' | 'low';

/** One information source used to build the BPMH (`..._information_source`). */
export interface InformationSource {
	sourceType: SourceType;
	/** Whether the source was directly checked. */
	verified: YesNo;
}

/** One drug allergy / adverse reaction (`..._allergy`). */
export interface Allergy {
	substance: string;
	reactionType: ReactionType;
	severity: Severity;
}

/**
 * One medication line item on either list (`..._line_item`). `listSource`
 * discriminates a BPMH (home) line from a current inpatient / proposed line.
 */
export interface LineItem {
	listSource: ListSource;
	drugName: string;
	form: string;
	dose: string;
	route: Route;
	frequency: string;
	indication: string;
	highRiskClass: HighRiskClass;
	adherence: Adherence;
	sourceType: SourceType;
	/** Prescribing status for inpatient rows. */
	status: ItemStatus;
}

/** One reconciliation discrepancy (`..._discrepancy`). */
export interface Discrepancy {
	discrepancyType: DiscrepancyType;
	bpmhItemRef: string;
	inpatientItemRef: string;
	intendedAction: IntendedAction;
	rationale: string;
	/** 'yes' = documented decision; otherwise unexplained (an error). */
	intentional: YesNo;
}

/** Step 1 — encounter context (parent header fields). */
export interface Encounter {
	reconciliationType: ReconciliationType;
	careSetting: CareSetting;
	/** ISO-ish datetime-local string; '' when unset. */
	reconciledAt: string;
	clinicianName: string;
	clinicianRole: ClinicianRole;
}

/** Step 2 — patient identification (parent header fields). */
export interface Identification {
	patientIdentifier: string;
	ageBand: AgeBand;
	sex: Sex;
	weightKg: number | null;
}

/** Step 4 — patient-level allergy status (parent header field). */
export interface AllergyReview {
	allergyStatus: AllergyStatus;
}

/** Step 7 — sign-off note. */
export interface Note {
	clinicalNote: string;
}

/** The full medication-reconciliation data model. */
export interface ReconciliationData {
	encounter: Encounter;
	identification: Identification;
	allergyReview: AllergyReview;
	informationSources: InformationSource[];
	allergies: Allergy[];
	lineItems: LineItem[];
	discrepancies: Discrepancy[];
	note: Note;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single derived audit row (mirrors the grade_rule SQL table). */
export interface FiredRule {
	id: string;
	category: string;
	description: string;
}

/** A clinician-facing safety flag (mirrors the grade_flag SQL table). */
export interface FlaggedIssue {
	id: string;
	category: string;
	priority: Priority;
	description: string;
	suggestedAction: string;
}

/** The full grading result for one reconciliation. */
export interface GradingResult {
	status: ReconciliationStatus;
	sourceCount: number;
	verifiedSourceCount: number;
	allergyCount: number;
	lineItemCount: number;
	bpmhCount: number;
	inpatientCount: number;
	discrepancyCount: number;
	intentionalCount: number;
	unintentionalCount: number;
	highRiskUnintentionalCount: number;
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
	section: keyof ReconciliationData;
}
