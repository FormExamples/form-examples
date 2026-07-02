// ──────────────────────────────────────────────
// Core data types — Anaesthetic Record
//
// This is a MULTI-TABLE documentation form: a parent record plus three
// one-to-many child lists (drug administrations, timed observations, and
// intra-operative events). Unlike a numeric-score form, the engine grades
// COMPLETENESS and VALIDITY: it classifies each record as Complete / Partial /
// Incomplete against a fixed set of mandatory-item rules (split critical /
// non-critical), reports a `completenessPercent`, and — independently — raises
// safety flags.
//
// camelCase property names mirror the snake_case SQL columns in the parent
// table `sql/04_create_table_anaesthetic_record.sql` and the child tables
// `..._drug_administration`, `..._timed_observation`, and
// `..._intra_operative_event`.
// ──────────────────────────────────────────────

export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';
export type Urgency = 'elective' | 'urgent' | 'emergency' | 'immediate' | '';
export type AnaestheticTechnique =
	| 'general'
	| 'regional'
	| 'sedation'
	| 'mac'
	| 'combined'
	| '';
export type YesNo = 'yes' | 'no' | '';
export type AsaStatus = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI' | '';
export type AirwayTechnique =
	| 'facemask'
	| 'supraglottic'
	| 'tracheal-tube'
	| 'tracheostomy'
	| 'awake-foi'
	| '';
export type RegionalTechnique =
	| 'none'
	| 'spinal'
	| 'epidural'
	| 'cse'
	| 'peripheral-block'
	| '';
export type RecoveryDestination = 'recovery' | 'hdu' | 'icu' | 'ward' | '';
export type DoseUnit =
	| 'mg'
	| 'mcg'
	| 'g'
	| 'ml'
	| 'units'
	| 'mmol'
	| 'puff'
	| 'other'
	| '';
export type Route =
	| 'iv'
	| 'im'
	| 'subcutaneous'
	| 'inhalational'
	| 'oral'
	| 'topical'
	| 'neuraxial'
	| 'infusion'
	| 'other'
	| '';
export type DrugCategory =
	| 'induction'
	| 'neuromuscular-blocker'
	| 'maintenance'
	| 'reversal'
	| 'analgesia'
	| 'antiemetic'
	| 'antibiotic'
	| 'vasoactive'
	| 'local-anaesthetic'
	| 'other'
	| '';
export type EventType =
	| 'desaturation'
	| 'hypotension'
	| 'arrhythmia'
	| 'laryngospasm'
	| 'bronchospasm'
	| 'anaphylaxis'
	| 'difficult-airway'
	| 'awareness'
	| 'other'
	| '';
export type CompletenessStatus = 'complete' | 'partial' | 'incomplete';
export type Priority = 'high' | 'medium' | 'low';

/**
 * One administered drug — mirrors the child table
 * `anaesthetic_record_drug_administration`.
 */
export interface DrugAdministration {
	drugName: string;
	dose: number | null;
	doseUnit: DoseUnit;
	route: Route;
	category: DrugCategory;
	/** ISO-ish datetime-local string; '' when unset. */
	administeredAt: string;
}

/**
 * One timed physiological observation — mirrors the child table
 * `anaesthetic_record_timed_observation`.
 */
export interface TimedObservation {
	/** ISO-ish datetime-local string; '' when unset. */
	observedAt: string;
	systolicBloodPressure: number | null;
	diastolicBloodPressure: number | null;
	heartRate: number | null;
	spo2: number | null;
	endTidalCo2: number | null;
	temperature: number | null;
	agentPercent: number | null;
	freshGasFlowL: number | null;
}

/**
 * One intra-operative event — mirrors the child table
 * `anaesthetic_record_intra_operative_event`.
 */
export interface IntraOperativeEvent {
	eventType: EventType;
	/** ISO-ish datetime-local string; '' when unset. */
	occurredAt: string;
	management: string;
}

/** Step 1 — case identification (also carries the overall anaesthetic technique). */
export interface Identification {
	patientIdentifier: string;
	patientName: string;
	dateOfBirth: string;
	sex: Sex;
	weightKg: number | null;
	heightCm: number | null;
	theatre: string;
	operationDate: string;
	anaesthetistName: string;
	assistantName: string;
	surgeonName: string;
	plannedProcedure: string;
	urgency: Urgency;
	anaestheticTechnique: AnaestheticTechnique;
}

/** Step 2 — pre-induction checks. */
export interface PreInduction {
	machineChecked: YesNo;
	whoSignIn: YesNo;
	whoTimeOut: YesNo;
	consentConfirmed: YesNo;
	fastingConfirmed: YesNo;
	ivAccess: string;
	allergyBandChecked: YesNo;
	documentedAllergies: string;
}

/** Step 3 — ASA & airway assessment. */
export interface AsaAirway {
	asaStatus: AsaStatus;
	asaEmergencyModifier: YesNo;
	mallampatiClass: number | null;
	mouthOpeningCm: number | null;
	thyromentalDistanceCm: number | null;
	dentition: string;
	anticipatedDifficultAirway: YesNo;
	priorDifficultIntubation: YesNo;
}

/** Step 5 — airway management. */
export interface Airway {
	airwayTechnique: AirwayTechnique;
	deviceSize: string;
	tubeDepthCm: number | null;
	cuffed: YesNo;
	cormackLehaneGrade: number | null;
	intubationAttempts: number | null;
	capnographyConfirmed: YesNo;
}

/** Step 6 — monitoring modalities in use. */
export interface Monitoring {
	monitoringModalities: string[];
}

/** Step 8 — fluids & blood loss. */
export interface Fluids {
	crystalloidMl: number | null;
	colloidMl: number | null;
	bloodProductsMl: number | null;
	estimatedBloodLossMl: number | null;
	urineOutputMl: number | null;
	cellSalvageMl: number | null;
}

/** Step 9 — regional / neuraxial technique. */
export interface Regional {
	regionalTechnique: RegionalTechnique;
	regionalLevel: string;
	regionalDrug: string;
	regionalDoseMg: number | null;
	blockHeight: string;
	regionalComplications: string;
}

/** Step 11 — recovery handover. */
export interface Handover {
	recoveryDestination: RecoveryDestination;
	handoverAirwayStatus: string;
	analgesiaPlan: string;
	antiemeticPlan: string;
	oxygenPlan: string;
	outstandingTasks: string;
	handoverAt: string;
	receivingPractitioner: string;
}

/** Step 12 — sign-off. */
export interface SignOff {
	anaesthetistSignature: string;
	signedAt: string;
}

/** The full anaesthetic-record data model (parent record + three child lists). */
export interface AssessmentData {
	identification: Identification;
	preInduction: PreInduction;
	asaAirway: AsaAirway;
	drugs: DrugAdministration[];
	airway: Airway;
	monitoring: Monitoring;
	observations: TimedObservation[];
	fluids: Fluids;
	regional: Regional;
	events: IntraOperativeEvent[];
	handover: Handover;
	signoff: SignOff;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/**
 * One mandatory-item rule result in the completeness audit trail. Mirrors the
 * `anaesthetic_record_grade_rule` SQL table.
 */
export interface FiredRule {
	id: string;
	category: 'critical' | 'noncritical';
	label: string;
	satisfied: boolean;
}

/** One mandatory-item rule definition. */
export interface MandatoryRule {
	id: string;
	category: 'critical' | 'noncritical';
	label: string;
	satisfied: (data: AssessmentData) => boolean;
}

/** A clinician-facing safety flag. Mirrors the `anaesthetic_record_grade_flag` SQL table. */
export interface FlaggedIssue {
	id: string;
	category: string;
	priority: Priority;
	description: string;
	suggestedAction: string;
}

/** The full grading result for one record. */
export interface GradingResult {
	status: CompletenessStatus;
	/** 0..100 */
	completenessPercent: number;
	firedRules: FiredRule[];
	criticalMissing: number;
	noncriticalMissing: number;
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
