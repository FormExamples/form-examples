// ──────────────────────────────────────────────
// Core data types — Partogram (Partograph)
//
// This is a MULTI-TABLE labour-monitoring form: a parent labour-record header
// (context, patient identification, admission findings) plus a one-to-many child
// list of timed intrapartum observation rows. The Partogram is NOT a validated
// numeric score: the engine plots the latest cervical-dilatation observation
// against two reference lines — the alert line and the action line — and
// classifies labour progress (Normal / Alert-line crossed / Action-line
// crossed), and — independently — raises threshold flags across the whole
// observation series.
//
// camelCase property names mirror the snake_case SQL columns in the parent table
// `sql/04_create_table_partogram.sql` and the child table
// `sql/05_create_table_partogram_observation.sql`.
// ──────────────────────────────────────────────

export type ClinicianRole = 'midwife' | 'obstetrician' | 'nurse' | 'other' | '';
export type CareSetting = 'labour-ward' | 'birth-centre' | 'triage' | 'other' | '';
export type AgeBand = 'under-18' | '18-24' | '25-34' | '35-39' | '40-plus' | '';
export type Parity = 'nulliparous' | 'multiparous' | '';
export type Membranes = 'intact' | 'ruptured' | '';
export type ContractionDurationBand = '<20s' | '20-40s' | '>40s' | '';
export type ContractionStrength = 'mild' | 'moderate' | 'strong' | '';
export type LiquorState = 'intact' | 'clear' | 'meconium' | 'blood-stained' | 'absent' | '';
export type Moulding = '0' | '+' | '++' | '+++' | '';
export type Dipstick = 'negative' | 'trace' | '+' | '++' | '+++' | '';
export type ProgressClassification = 'normal' | 'alertLineCrossed' | 'actionLineCrossed';
export type Priority = 'high' | 'medium' | 'low';

/**
 * One timed intrapartum observation row — mirrors the child table
 * `partogram_observation`. Any field may be left unanswered.
 */
export interface Observation {
	/** ISO-ish datetime-local string; '' when unset. */
	observedAt: string;
	/** Cervical dilatation, 0-10 cm. */
	cervicalDilatationCm: number | null;
	/** Fifths of the fetal head palpable above the brim, 5 → 0. */
	descentFifths: number | null;
	/** Contraction frequency per 10 minutes. */
	contractionsPer10Min: number | null;
	contractionDurationBand: ContractionDurationBand;
	contractionStrength: ContractionStrength;
	/** Fetal heart rate in bpm. */
	fetalHeartRate: number | null;
	liquorState: LiquorState;
	moulding: Moulding;
	/** Maternal systolic BP, mmHg. */
	systolicBloodPressure: number | null;
	/** Maternal diastolic BP, mmHg. */
	diastolicBloodPressure: number | null;
	/** Maternal pulse, bpm. */
	pulse: number | null;
	/** Maternal temperature, degrees C. */
	temperature: number | null;
	/** Urine passed, mL. */
	urineVolumeMl: number | null;
	urineProtein: Dipstick;
	urineKetones: Dipstick;
	urineGlucose: Dipstick;
	/** Oxytocin infusion rate (drops/min or mU/min). */
	oxytocinRate: number | null;
	/** Other drugs and IV fluids. */
	drugsAndFluids: string;
}

/** Step 1 — labour context (mirrors the header recording-context fields). */
export interface Context {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	careSetting: CareSetting;
	/** ISO-ish datetime-local string; '' when unset. Reference time for the lines. */
	activePhaseStartAt: string;
}

/** Step 2 — patient identification. */
export interface Patient {
	patientIdentifier: string;
	ageBand: AgeBand;
	parity: Parity;
	gestationWeeks: number | null;
}

/** Step 3 — admission findings. */
export interface Admission {
	membranesOnAdmission: Membranes;
	riskFactors: string;
	plannedCare: string;
}

/** The full partogram data model (parent labour header + one child list). */
export interface AssessmentData {
	context: Context;
	patient: Patient;
	admission: Admission;
	observations: Observation[];
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** One reference line the latest plotted point has crossed. */
export interface FiredLine {
	/** 'alert' | 'action'. */
	id: string;
	description: string;
}

/** A clinician-facing flagged issue. Mirrors the `partogram_grade_flag` SQL table. */
export interface FlaggedIssue {
	id: string;
	category: string;
	priority: Priority;
	description: string;
	suggestedAction: string;
}

/** The full grading result for one partogram. */
export interface GradingResult {
	/** Echo of the reference time for the lines; null when unset. */
	activePhaseStartAt: string | null;
	/** Dilatation of the latest timed observation carrying a non-null dilatation. */
	latestDilatationCm: number | null;
	/** Hours from activePhaseStartAt to that observation. */
	elapsedHours: number | null;
	/** Expected dilatation on the alert line at elapsedHours (4 + t). */
	alertLineExpectedCm: number | null;
	/** Expected dilatation on the action line at elapsedHours (t). */
	actionLineExpectedCm: number | null;
	progressClassification: ProgressClassification;
	firedLines: FiredLine[];
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
