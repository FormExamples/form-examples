// ──────────────────────────────────────────────
// Core assessment data types (Parkland Formula for Burns)
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_parkland_formula_for_burns.sql`
// (`weight_kg` -> `weightKg`, `tbsa_percent` -> `tbsaPercent`,
// `injury_at` -> `injuryAt`, `inhalation_suspected` -> `inhalationSuspected`).
// ──────────────────────────────────────────────

export type ClinicianRole = 'doctor' | 'nurse' | 'paramedic' | 'other' | '';
export type CareSetting =
	| 'emergency-department'
	| 'burns-unit'
	| 'intensive-care'
	| 'retrieval'
	| 'other'
	| '';
export type AgeBand = 'adult' | 'child' | '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';
export type TbsaMethod = 'rule-of-nines' | 'lund-browder' | 'other' | '';
export type InjuryTimeKnown = 'known' | 'estimated' | '';
export type YesNo = 'yes' | 'no' | '';
export type Mechanism = 'thermal' | 'electrical' | 'chemical' | 'other' | '';
export type Priority = 'high' | 'medium' | 'low';

/** Overall plan status derived by the grader (drives dashboard + banner). */
export type PlanStatus = 'planned' | 'overdue' | 'incomplete';

/** Step 1 — assessment context. */
export interface Context {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	/** ISO-ish datetime-local string; '' when unset. */
	assessedAt: string;
	careSetting: CareSetting;
}

/** Step 2 — patient identification. */
export interface Identification {
	patientIdentifier: string;
	ageBand: AgeBand;
	sex: Sex;
}

/** Step 3 — body weight (calculation input 1). */
export interface Weight {
	/** Body weight in kilograms. */
	weightKg: number | null;
}

/** Step 4 — burn extent (calculation input 2). */
export interface Burn {
	/** %TBSA, partial-thickness or deeper. */
	tbsaPercent: number | null;
	tbsaMethod: TbsaMethod;
}

/** Step 5 — time of injury (calculation input 3 — drives the phase offset). */
export interface Injury {
	/** ISO-ish datetime-local string; '' when unset. */
	injuryAt: string;
	injuryTimeKnown: InjuryTimeKnown;
}

/** Step 6 — injury features (drive flags, not the arithmetic). */
export interface Features {
	inhalationSuspected: YesNo;
	circumferentialOrDeep: YesNo;
	mechanism: Mechanism;
}

/** Step 7 — clinician free-text note. */
export interface Note {
	clinicalNote: string;
}

/** The full Parkland assessment data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	weight: Weight;
	burn: Burn;
	injury: Injury;
	features: Features;
	note: Note;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single fired rule row (mirrors the grade_rule SQL table). */
export interface FiredRule {
	/** Stable rule id, e.g. R-TOTAL-VOLUME-01. */
	id: string;
	/** formula | phase-split | offset | titration. */
	instrument: string;
	/** resuscitation | overdue | unknown. */
	band: string;
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

/** The full grading result for one assessment. */
export interface GradingResult {
	/** Total 24-hour crystalloid volume in mL; null when inputs incomplete. */
	total24hVolumeMl: number | null;
	/** First-8-hour phase volume in mL (half of the total). */
	first8hVolumeMl: number | null;
	/** Next-16-hour phase volume in mL (half of the total). */
	next16hVolumeMl: number | null;
	/** Hours elapsed since injury (>= 0); null when a timestamp is missing. */
	hoursSinceInjury: number | null;
	/** Hours of the first-8-hour window that remain (0 when overdue). */
	remainingFirst8hHours: number;
	/** First-phase infusion rate in mL/h; null when overdue or inputs incomplete. */
	first8hRateMlPerHour: number | null;
	/** Second-phase infusion rate in mL/h. */
	next16hRateMlPerHour: number | null;
	/** Low end of the urine-output target in mL/h (0.5 mL/kg/h). */
	targetUrineOutputLowMlPerHour: number | null;
	/** High end of the urine-output target in mL/h (1.0 mL/kg/h). */
	targetUrineOutputHighMlPerHour: number | null;
	/** Overall plan status for the dashboard + report banner. */
	status: PlanStatus;
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
