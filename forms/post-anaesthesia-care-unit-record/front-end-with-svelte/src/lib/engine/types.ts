// ──────────────────────────────────────────────
// Core assessment data types (PACU Record / Modified Aldrete)
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_post_anaesthesia_care_unit_record.sql`.
// ──────────────────────────────────────────────

export type NurseRole = 'recovery-nurse' | 'odp' | 'anaesthetist' | 'other' | '';
export type AnaestheticTechnique = 'general' | 'regional' | 'sedation' | 'combined' | '';
export type AgeBand = '16-39' | '40-59' | '60-74' | '75-plus' | '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';
export type AsaStatus = 'I' | 'II' | 'III' | 'IV' | 'V' | '';
export type YesNo = 'yes' | 'no' | '';

export type Activity = 'all-four' | 'two' | 'none' | '';
export type Respiration = 'deep-cough' | 'limited' | 'apnoeic' | '';
export type Circulation = 'within-20' | 'within-50' | 'over-50' | '';
export type Consciousness = 'awake' | 'arousable' | 'unresponsive' | '';
export type OxygenSaturation = 'room-air' | 'needs-o2' | 'low-on-o2' | '';

export type AirwayStatus = 'patent' | 'oral-airway' | 'other' | '';
export type PonvSeverity = 'none' | 'mild' | 'moderate' | 'severe' | '';

export type PadssVitalSigns = 'within-20' | 'within-40' | 'over-40' | '';
export type PadssAmbulation = 'steady' | 'with-assistance' | 'unable' | '';
export type PadssTriState = 'minimal' | 'moderate' | 'severe' | '';

export type ReadinessBand = 'not-ready' | 'discharge-ready';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — recovery context. */
export interface Context {
	nurseName: string;
	nurseRole: NurseRole;
	anaesthetistName: string;
	/** ISO-ish datetime-local string; '' when unset. */
	admittedAt: string;
	anaestheticTechnique: AnaestheticTechnique;
	procedure: string;
}

/** Step 2 — patient identification. */
export interface Identification {
	patientIdentifier: string;
	ageBand: AgeBand;
	sex: Sex;
	asaStatus: AsaStatus;
	/** mmHg pre-anaesthetic baseline; null when unset. */
	baselineSystolicBp: number | null;
	/** Day-surgery case → enables PADSS. */
	ambulatoryCase: YesNo;
}

/** Steps 3-7 — the five Modified Aldrete parameter inputs. */
export interface ActivitySection {
	activity: Activity;
}
export interface RespirationSection {
	respiration: Respiration;
}
export interface CirculationSection {
	circulation: Circulation;
}
export interface ConsciousnessSection {
	consciousness: Consciousness;
}
export interface OxygenSaturationSection {
	oxygenSaturation: OxygenSaturation;
}

/** Step 8 — airway, pain and PONV. */
export interface Observations {
	airwayStatus: AirwayStatus;
	/** Verbal / numeric rating scale 0-10; null when unset. */
	painScore: number | null;
	ponvSeverity: PonvSeverity;
	analgesiaGiven: string;
	antiemeticsGiven: string;
}

/** Step 9 — PADSS criterion inputs (optional; ambulatory cases only). */
export interface Padss {
	padssVitalSigns: PadssVitalSigns;
	padssAmbulation: PadssAmbulation;
	padssNauseaVomiting: PadssTriState;
	padssPain: PadssTriState;
	padssSurgicalBleeding: PadssTriState;
}

/** Step 10 — clinician free-text recovery note. */
export interface Note {
	recoveryNote: string;
}

/** The full PACU record data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	activity: ActivitySection;
	respiration: RespirationSection;
	circulation: CirculationSection;
	consciousness: ConsciousnessSection;
	oxygenSaturation: OxygenSaturationSection;
	observations: Observations;
	padss: Padss;
	note: Note;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single scored/derived parameter row (mirrors the grade_rule SQL table). */
export interface FiredParameter {
	/** Stable rule id, e.g. R-ACTIVITY-01. */
	id: string;
	/** activity | respiration | circulation | consciousness | oxygenSaturation | band | padss */
	parameter: string;
	/** Points contributed (0, 1, or 2; PADSS row carries its total). */
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

/** A Modified Aldrete grading rule. */
export interface AldreteRule {
	id: string;
	/** activity | respiration | circulation | consciousness | oxygenSaturation */
	parameter: string;
	category: string;
	description: string;
	get: (data: AssessmentData) => string;
}

/** The full grading result for one PACU record. */
export interface GradingResult {
	activityScore: 0 | 1 | 2;
	respirationScore: 0 | 1 | 2;
	circulationScore: 0 | 1 | 2;
	consciousnessScore: 0 | 1 | 2;
	oxygenSaturationScore: 0 | 1 | 2;
	/** Modified Aldrete total 0..10. */
	aldreteTotal: number;
	readinessBand: ReadinessBand;
	/** PADSS total 0..10 or null when not scored. */
	padssTotal: number | null;
	padssStreetFit: boolean | null;
	firedParameters: FiredParameter[];
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
