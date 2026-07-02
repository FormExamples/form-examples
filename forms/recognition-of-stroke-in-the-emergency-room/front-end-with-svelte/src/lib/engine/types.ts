// ──────────────────────────────────────────────
// Core assessment data types (ROSIER)
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_recognition_of_stroke_in_the_emergency_room.sql`.
// ──────────────────────────────────────────────

export type ClinicianRole = 'doctor' | 'nurse' | 'paramedic' | 'other' | '';
export type CareSetting = 'emergency-department' | 'acute-medical' | 'other' | '';
export type AgeBand = '16-39' | '40-59' | '60-74' | '75-plus' | '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';
export type YesNo = 'yes' | 'no' | '';
export type YesNoNa = 'yes' | 'no' | 'na' | '';
export type Band = 'stroke-unlikely' | 'stroke-likely';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — assessment context. */
export interface Context {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	/** ISO-ish datetime-local string; '' when unset. */
	assessedAt: string;
	careSetting: CareSetting;
	/** Reported time the patient was last known well / symptoms began; '' when unset. */
	symptomOnsetAt: string;
}

/** Step 2 — patient identification. */
export interface Identification {
	patientIdentifier: string;
	ageBand: AgeBand;
	sex: Sex;
}

/**
 * Step 3 — blood-glucose precondition. Measured before scoring; a value < 3.5
 * mmol/L flags the hypoglycaemia mimic and the ROSIER score is not valid while
 * the patient is hypoglycaemic.
 */
export interface Precondition {
	/** mmol/L; null when not yet recorded. */
	bloodGlucose: number | null;
	hypoglycaemiaCorrected: YesNoNa;
}

/** Step 4 — mimic-exclusion criteria (each scores -1 if yes). */
export interface Mimics {
	lossOfConsciousness: YesNo;
	seizureActivity: YesNo;
}

/** Step 5 — acute-onset neurological signs (each scores +1 if yes). */
export interface Signs {
	facialWeakness: YesNo;
	armWeakness: YesNo;
	legWeakness: YesNo;
	speechDisturbance: YesNo;
	visualFieldDefect: YesNo;
}

/** Step 6 — clinician free-text note. */
export interface Note {
	clinicalNote: string;
}

/** The full ROSIER assessment data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	precondition: Precondition;
	mimics: Mimics;
	signs: Signs;
	note: Note;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single scored/derived criterion row (mirrors the grade_rule SQL table). */
export interface FiredCriterion {
	/** Stable rule id, e.g. R-FACIAL-WEAKNESS-01. */
	id: string;
	/**
	 * loss-of-consciousness | seizure-activity | facial-weakness | arm-weakness |
	 * leg-weakness | speech-disturbance | visual-field-defect | band
	 */
	criterion: string;
	/** Signed point contributed (-1, +1, or 0 for the band row). */
	points: number;
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

/** A ROSIER grading rule. */
export interface RosierRule {
	id: string;
	/**
	 * loss-of-consciousness | seizure-activity | facial-weakness | arm-weakness |
	 * leg-weakness | speech-disturbance | visual-field-defect
	 */
	criterion: string;
	/** Signed point contributed when the rule fires (-1 for a mimic, +1 for a sign). */
	points: number;
	/** rosier-mimic | rosier-sign */
	category: string;
	description: string;
	evaluate: (data: AssessmentData) => boolean;
}

/** The full grading result for one assessment. */
export interface GradingResult {
	lossOfConsciousnessPoint: 0 | -1;
	seizureActivityPoint: 0 | -1;
	facialWeaknessPoint: 0 | 1;
	armWeaknessPoint: 0 | 1;
	legWeaknessPoint: 0 | 1;
	speechDisturbancePoint: 0 | 1;
	visualFieldDefectPoint: 0 | 1;
	/** Signed total -2..+5. */
	rosierScore: number;
	band: Band;
	firedCriteria: FiredCriterion[];
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
