// ──────────────────────────────────────────────
// Core assessment data types (Ottawa Ankle / Foot Rules)
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_ottawa_ankle_rules.sql`.
//
// This instrument is a boolean DECISION RULE, not a numeric score: there is no
// total and no risk band. The engine emits two independent imaging decisions
// (ankle X-ray indicated yes/no, foot X-ray indicated yes/no) plus the criteria
// that drove them.
// ──────────────────────────────────────────────

export type ClinicianRole =
	| 'doctor'
	| 'nurse-practitioner'
	| 'paramedic'
	| 'physiotherapist'
	| 'other'
	| '';
export type CareSetting =
	| 'emergency-department'
	| 'minor-injury-unit'
	| 'urgent-care'
	| 'other'
	| '';
export type InjuredSide = 'left' | 'right' | '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';
export type YesNo = 'yes' | 'no' | '';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — assessment context. */
export interface Context {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	/** ISO-ish datetime-local string; '' when unset. */
	assessedAt: string;
	careSetting: CareSetting;
	injuredSide: InjuredSide;
	/** Hours elapsed since the injury; null when unset. */
	hoursSinceInjury: number | null;
}

/** Step 2 — patient identification. */
export interface Identification {
	patientIdentifier: string;
	ageYears: number | null;
	sex: Sex;
}

/** Step 3 — applicability. */
export interface Applicability {
	/** No intoxication, distracting injury, or sensory deficit. */
	assessmentReliable: YesNo;
}

/** Step 4 — pain zones (the two decision preconditions). */
export interface PainZones {
	/** Ankle precondition. */
	malleolarZonePain: YesNo;
	/** Foot precondition. */
	midfootZonePain: YesNo;
}

/** Step 5 — ankle bone tenderness (criteria A1, A2). */
export interface AnkleTenderness {
	/** A1: posterior edge / tip of the lateral malleolus. */
	lateralMalleolusTenderness: YesNo;
	/** A2: posterior edge / tip of the medial malleolus. */
	medialMalleolusTenderness: YesNo;
}

/** Step 6 — foot bone tenderness (criteria F1, F2). */
export interface FootTenderness {
	/** F1: base of the fifth metatarsal. */
	fifthMetatarsalBaseTenderness: YesNo;
	/** F2: navicular. */
	navicularTenderness: YesNo;
}

/** Step 7 — weight-bearing (derives "unable to bear weight", criterion A3/F3). */
export interface WeightBearing {
	/** Four steps immediately after the injury. */
	ableToBearWeightImmediately: YesNo;
	/** Four steps at assessment. */
	ableToBearWeightNow: YesNo;
}

/** Step 8 — clinician free-text note. */
export interface Note {
	clinicalNotes: string;
}

/** The full Ottawa Ankle / Foot Rules assessment data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	applicability: Applicability;
	painZones: PainZones;
	ankleTenderness: AnkleTenderness;
	footTenderness: FootTenderness;
	weightBearing: WeightBearing;
	note: Note;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single criterion whose finding is positive (mirrors the grade_rule SQL table). */
export interface FiredCriterion {
	/** Stable rule id, e.g. A1, A2, A3/F3, F1, F2. */
	id: string;
	region: 'ankle' | 'foot' | 'both';
	/** Criterion slug. */
	criterion: string;
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

/** An Ottawa Ankle / Foot decision rule. */
export interface OttawaRule {
	id: string;
	region: 'ankle' | 'foot' | 'both';
	/** Criterion slug. */
	criterion: string;
	description: string;
	evaluate: (data: AssessmentData) => boolean;
}

/** The two independent imaging decisions plus the shared derived input. */
export interface OttawaDecision {
	unableToBearWeight: boolean;
	ankleXrayIndicated: boolean;
	footXrayIndicated: boolean;
}

/** The full grading result for one assessment. */
export interface GradingResult extends OttawaDecision {
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
