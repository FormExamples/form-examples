// ──────────────────────────────────────────────
// Core assessment data types (Child-Pugh Score / Child-Turcotte-Pugh)
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_child_pugh_score.sql`. Five scored parameters — total
// bilirubin, serum albumin, coagulation (INR or prothrombin time), ascites, and
// hepatic encephalopathy — each award 1, 2, or 3 points; the total 5-15 bands
// into Class A / B / C.
// ──────────────────────────────────────────────

export type ClinicianRole =
	| 'hepatologist'
	| 'surgeon'
	| 'anaesthetist'
	| 'physician'
	| 'nurse'
	| 'other'
	| '';
export type CareSetting =
	| 'hepatology-clinic'
	| 'ward'
	| 'pre-operative'
	| 'intensive-care'
	| 'other'
	| '';
export type Aetiology =
	| 'alcohol'
	| 'viral-hepatitis'
	| 'nafld'
	| 'autoimmune'
	| 'cholestatic'
	| 'other'
	| '';
export type AgeBand = '16-39' | '40-59' | '60-74' | '75-plus' | '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';
export type Ascites = 'none' | 'mild' | 'moderate-severe' | '';
export type Encephalopathy = 'none' | 'grade-1-2' | 'grade-3-4' | '';
export type ChildPughClass = 'A' | 'B' | 'C';
export type SurgicalRisk = 'low' | 'moderate' | 'high';
export type Priority = 'high' | 'medium' | 'low';

/** A per-parameter point award (1-3), or null when the parameter is unanswered. */
export type ParameterPoint = 1 | 2 | 3 | null;

/** Step 1 — assessment context. */
export interface Context {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	/** ISO-ish datetime-local string; '' when unset. */
	assessedAt: string;
	careSetting: CareSetting;
	aetiology: Aetiology;
}

/** Step 2 — patient identification. */
export interface Identification {
	patientIdentifier: string;
	ageBand: AgeBand;
	sex: Sex;
}

/** Step 3 — total bilirubin (parameter 1). */
export interface Bilirubin {
	/** µmol/L; 1 pt < 34, 2 pt 34-50, 3 pt > 50. */
	totalBilirubin: number | null;
}

/** Step 4 — serum albumin (parameter 2). */
export interface Albumin {
	/** g/L; 1 pt > 35, 2 pt 28-35, 3 pt < 28. */
	serumAlbumin: number | null;
}

/**
 * Step 5 — coagulation (parameter 3). INR is preferred; prothrombin-time
 * prolongation (seconds) is the fallback used only when no INR is recorded.
 */
export interface Coagulation {
	/** Ratio; 1 pt < 1.7, 2 pt 1.7-2.3, 3 pt > 2.3. */
	inr: number | null;
	/** Seconds; 1 pt < 4, 2 pt 4-6, 3 pt > 6. */
	prothrombinTimeProlongation: number | null;
}

/** Step 6 — ascites (parameter 4). */
export interface AscitesStep {
	ascites: Ascites;
}

/** Step 7 — hepatic encephalopathy (parameter 5). */
export interface EncephalopathyStep {
	encephalopathy: Encephalopathy;
}

/** Step 8 — clinician free-text note. */
export interface Note {
	clinicalNote: string;
}

/** The full Child-Pugh assessment data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	bilirubin: Bilirubin;
	albumin: Albumin;
	coagulation: Coagulation;
	ascitesStep: AscitesStep;
	encephalopathyStep: EncephalopathyStep;
	note: Note;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single fired rule row (mirrors the grade_rule SQL table). */
export interface FiredRule {
	/** Stable rule id, e.g. R-BILIRUBIN-3POINT-01. */
	id: string;
	/** bilirubin | albumin | coagulation | ascites | encephalopathy | class. */
	parameter: string;
	/** Points contributed for the parameter (1-3), or null. */
	points: number | null;
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

/** A declarative per-parameter scoring rule. */
export interface ChildPughRule {
	id: string;
	/** bilirubin | albumin | coagulation | ascites | encephalopathy. */
	parameter: string;
	/** Points awarded when the rule fires (1-3). */
	points: number;
	category: string;
	description: string;
	evaluate: (d: AssessmentData) => boolean;
}

/** The full grading result for one assessment. */
export interface GradingResult {
	bilirubinPoint: ParameterPoint;
	albuminPoint: ParameterPoint;
	coagulationPoint: ParameterPoint;
	ascitesPoint: ParameterPoint;
	encephalopathyPoint: ParameterPoint;
	/** 5..15 when complete; a partial sum over the answered parameters otherwise. */
	childPughScore: number;
	childPughClass: ChildPughClass;
	oneYearSurvival: string;
	twoYearSurvival: string;
	surgicalRisk: SurgicalRisk;
	/** True only once all five parameters are answered. */
	complete: boolean;
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
