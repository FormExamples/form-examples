// ──────────────────────────────────────────────
// Core assessment data types (Bhutani Bilirubin Nomogram)
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_bhutani_bilirubin_nomogram.sql`. The Bhutani instrument
// is a *classification* (a percentile risk zone plus treatment-threshold
// signals), not an additive score.
// ──────────────────────────────────────────────

export type ClinicianRole = 'midwife' | 'neonatal-nurse' | 'paediatrician' | 'other' | '';
export type CareSetting =
	| 'postnatal-ward'
	| 'neonatal-unit'
	| 'midwife-led-unit'
	| 'community'
	| 'other'
	| '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';
export type MeasurementMethod = 'serum' | 'transcutaneous' | '';
export type YesNo = 'yes' | 'no' | '';
export type RiskZone = 'low' | 'low-intermediate' | 'high-intermediate' | 'high' | null;
export type PercentileBand = '<40' | '40-75' | '75-95' | '>=95' | null;
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — assessment context. */
export interface Context {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	/** ISO-ish datetime-local string; '' when unset. */
	assessedAt: string;
	careSetting: CareSetting;
}

/** Step 2 — infant identification. */
export interface Identification {
	infantIdentifier: string;
	sex: Sex;
	/** datetime-local string; '' when unset. */
	bornAt: string;
	/** Weeks; selects the treatment-threshold curve. */
	gestationalAgeWeeks: number | null;
}

/** Step 3 — bilirubin measurement. */
export interface Measurement {
	/** Age at measurement (nomogram x-axis, hours). */
	ageHours: number | null;
	/** Measured TSB (nomogram y-axis, µmol/L). */
	totalSerumBilirubinUmolL: number | null;
	measurementMethod: MeasurementMethod;
}

/** Step 4 — neonatal hyperbilirubinaemia risk factors (each yes/no). */
export interface RiskFactors {
	/** Gestational age < 38 weeks. */
	pretermUnder38: YesNo;
	/** Previous sibling required phototherapy / had neonatal jaundice. */
	previousSiblingJaundice: YesNo;
	/** Exclusively breastfed. */
	exclusiveBreastfeeding: YesNo;
	/** Significant bruising or cephalohaematoma. */
	bruising: YesNo;
	/** ABO / Rhesus incompatibility or positive DAT. */
	bloodGroupIncompatibility: YesNo;
	/** Jaundice onset before 24 hours of age. */
	earlyOnsetUnder24h: YesNo;
}

/** Step 5 — clinician free-text note. */
export interface Note {
	clinicalNote: string;
}

/** The full Bhutani nomogram assessment data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	measurement: Measurement;
	riskFactors: RiskFactors;
	note: Note;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A risk factor that is set to 'yes'. */
export interface FiredRiskFactor {
	/** Stable field key, e.g. earlyOnsetUnder24h. */
	id: string;
	/** Human-readable label. */
	label: string;
}

/** A single fired rule row (mirrors the grade_rule SQL table). */
export interface FiredRule {
	/** Stable rule id, e.g. R-ZONE-HIGH-INTERMEDIATE-01. */
	id: string;
	/** zone-lookup | phototherapy-threshold | exchange-threshold. */
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

/** The full classification result for one assessment. */
export interface GradingResult {
	ageHours: number | null;
	riskZone: RiskZone;
	percentileBand: PercentileBand;
	/** Interpolated 40th-percentile track (µmol/L). */
	p40: number | null;
	/** Interpolated 75th-percentile track (µmol/L). */
	p75: number | null;
	/** Interpolated 95th-percentile track (µmol/L). */
	p95: number | null;
	gestationBand: string;
	phototherapyThreshold: number | null;
	exchangeThreshold: number | null;
	abovePhototherapy: boolean;
	aboveExchange: boolean;
	outOfRange: boolean;
	firedRiskFactors: FiredRiskFactor[];
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
