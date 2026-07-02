// ──────────────────────────────────────────────
// Core assessment data types (Abdominal Aortic Aneurysm Screening)
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_abdominal_aortic_aneurysm_screening.sql`
// (`max_aortic_diameter_cm` -> `maxAorticDiameterCm`, etc.).
// ──────────────────────────────────────────────

export type TechnicianRole = 'screening-technician' | 'clinical-skills-trainer' | 'other' | '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';
export type EligibilityRoute = 'routine-year-of-65' | 'self-referral-over-65' | 'other' | '';
export type ScanType = 'first-scan' | 'surveillance-rescan' | '';
export type YesNo = 'yes' | 'no' | '';
export type Category = 'normal' | 'small' | 'medium' | 'large' | 'non-visualised';
export type SurveillanceBand = 'discharge' | 'annual' | 'three-monthly' | 'refer-vascular' | 'rescan';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — scan context. */
export interface Context {
	technicianName: string;
	technicianRole: TechnicianRole;
	clinicSite: string;
	/** ISO-ish datetime-local string; '' when unset. */
	scannedAt: string;
	deviceIdentifier: string;
}

/** Step 2 — patient identification and eligibility. */
export interface Identification {
	patientIdentifier: string;
	age: number | null;
	sex: Sex;
	eligibilityRoute: EligibilityRoute;
	scanType: ScanType;
}

/** Step 3 — consent. */
export interface Consent {
	consentGiven: YesNo;
	leafletProvided: YesNo;
	consentNote: string;
}

/** Step 4 — ultrasound measurement. */
export interface Measurement {
	aortaVisualised: YesNo;
	/** Maximum antero-posterior diameter (cm); the classified value. */
	maxAorticDiameterCm: number | null;
	/** Prior maximum diameter (cm); surveillance patients. */
	priorMaxDiameterCm: number | null;
	/** ISO date string; '' when unset. */
	priorScanDate: string;
}

/** Step 5 — clinical observations. */
export interface Observations {
	symptomatic: YesNo;
	incidentalFindings: string;
}

/** Step 6 — result note. */
export interface Result {
	resultNote: string;
}

/** The full AAA screening assessment data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	consent: Consent;
	measurement: Measurement;
	observations: Observations;
	result: Result;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single fired rule row (mirrors the grade_rule SQL table). */
export interface FiredRule {
	/** Stable rule id, e.g. R-CLASSIFY-SMALL-01. */
	id: string;
	/** classification. */
	instrument: string;
	/** normal | small | medium | large | non-visualised. */
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

/** A diameter-band classification rule. */
export interface ClassificationRule {
	id: string;
	/** classification. */
	instrument: string;
	/** normal | small | medium | large. */
	band: string;
	category: string;
	description: string;
	evaluate: (diameterCm: number) => boolean;
}

/** The full grading result for one assessment. */
export interface GradingResult {
	category: Category;
	surveillanceBand: SurveillanceBand;
	recommendedAction: string;
	/** cm, rounded to 1 dp for display; null when non-visualised. */
	maxAorticDiameterCm: number | null;
	/** Growth since the prior scan (cm); null when not computable. */
	growthCm: number | null;
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
