// ──────────────────────────────────────────────
// Pregnancy Ultrasound Test Request — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in the form's sql/ migrations. The request is a nested record with
// one object per wizard section. The engine computes a four-axis vetting grade
// (appropriateness, gestational-age window fit, request completeness, triage
// priority) plus safety flags. Rule and flag IDs are identical across every
// front-end and the back-end.
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the SQL CHECK constraints) ───

/** Requested obstetric ultrasound scan type. */
export type ScanType =
	| 'viability'
	| 'dating'
	| 'nuchal-translucency'
	| 'anomaly'
	| 'growth'
	| 'doppler'
	| 'presentation'
	| 'cervical-length'
	| 'placental-location'
	| 'liquor-volume'
	| 'reassurance'
	| 'other'
	| '';

/** Primary clinical indication for the scan. */
export type Indication =
	| 'dating'
	| 'viability'
	| 'exclude-ectopic'
	| 'bleeding'
	| 'pain'
	| 'aneuploidy-screening'
	| 'anomaly-screening'
	| 'suspected-anomaly'
	| 'growth-restriction'
	| 'large-for-dates'
	| 'reduced-fetal-movements'
	| 'multiple-pregnancy'
	| 'placental-location'
	| 'liquor-assessment'
	| 'presentation'
	| 'cervical-assessment'
	| 'antepartum-haemorrhage'
	| 'maternal-condition'
	| 'doppler-surveillance'
	| 'follow-up'
	| 'other'
	| '';

/** Vaginal bleeding severity. */
export type Bleeding = 'none' | 'light' | 'moderate' | 'heavy' | '';

/** Abdominal pain severity. */
export type Pain = 'none' | 'mild' | 'moderate' | 'severe' | '';

/** Requested triage urgency. */
export type Urgency = 'routine' | 'soon' | 'urgent' | 'emergency' | '';

/** Care setting the referral originates from. */
export type Setting = 'outpatient' | 'inpatient' | 'community' | 'emergency' | '';

// ─── Axis enumerations (grade) ───

/** Axis A — appropriateness band (ACR-style ordinal). */
export type AppropriatenessBand =
	| 'usually-appropriate'
	| 'may-be-appropriate'
	| 'usually-not-appropriate'
	| '';

/** Axis B — gestational-age window fit. */
export type WindowFit = 'appropriate' | 'borderline' | 'outside-window' | '';

/** Axis D — triage tier. */
export type TriageTier = 'routine' | 'soon' | 'urgent' | 'emergency' | '';

/** Overall vetting recommendation. */
export type Recommendation = 'accept' | 'query-referrer' | 'redirect' | 'reject' | '';

// ─── The request record (nested by wizard section) ───

/** Requesting clinician details. */
export interface ClinicianSection {
	clinicianName: string;
	clinicianRole: string;
	registrationBody: string;
	registrationNumber: string;
	requesterContact: string;
	supervisingConsultant: string;
	siteName: string;
	referralDate: string;
}

/** Patient identification and access needs. */
export interface PatientSection {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	nhsNumber: string;
	bodyMassIndex: number | null;
	interpreterRequired: boolean;
}

/** Pregnancy dating — drives the gestational-age window-fit axis. */
export interface DatingSection {
	lastMenstrualPeriodDate: string;
	lastMenstrualPeriodReliability: string;
	estimatedDueDate: string;
	estimatedDueDateMethod: string;
	gestationalAgeWeeks: number | null;
	gestationalAgeDays: number | null;
}

/** Obstetric history. */
export interface HistorySection {
	gravida: number | null;
	para: number | null;
	plurality: string;
	chorionicity: string;
	conceptionMethod: string;
	rhesusStatus: string;
}

/** Requested examination — the highest-value fields. */
export interface RequestSection {
	requestedScanType: ScanType;
	primaryIndication: Indication;
	clinicalQuestion: string;
	relevantHistory: string;
	previousScanFinding: string;
	previousScanDate: string;
}

/** Presenting symptoms and red flags. */
export interface SymptomsSection {
	vaginalBleeding: Bleeding;
	abdominalPain: Pain;
	reducedFetalMovements: boolean;
	suspectedEctopic: boolean;
	haemodynamicallyUnstable: boolean;
}

/** Maternal and obstetric risk factors. */
export interface RiskFactorsSection {
	hypertension: boolean;
	diabetes: boolean;
	previousGrowthRestriction: boolean;
	previousPretermBirth: boolean;
	previousCaesarean: boolean;
	smoker: boolean;
}

/** Triage and submission details. */
export interface TriageSection {
	urgency: Urgency;
	requestedByDate: string;
	setting: Setting;
	notes: string;
}

/**
 * The obstetric ultrasound request — the source-of-truth record the four-axis
 * vetting grade is computed from.
 */
export interface UltrasoundRequest {
	clinician: ClinicianSection;
	patient: PatientSection;
	dating: DatingSection;
	history: HistorySection;
	request: RequestSection;
	symptoms: SymptomsSection;
	riskFactors: RiskFactorsSection;
	triage: TriageSection;
}

// ─── Grading types ───

/** A scoring axis, used in the fired-rule audit trail. */
export type Axis = 'appropriateness' | 'window' | 'completeness' | 'triage';

/** Flag category (mirrors the sql grade_flag CHECK constraint). */
export type FlagCategory =
	| 'suspected-ectopic'
	| 'heavy-bleeding'
	| 'severe-pain'
	| 'haemodynamic-instability'
	| 'reduced-fetal-movements'
	| 'suspected-praevia'
	| 'suspected-severe-fgr'
	| 'pre-eclampsia'
	| 'missing-indication'
	| 'missing-clinical-question'
	| 'window-mismatch'
	| 'incomplete-dating';

/** Flag priority. */
export type FlagPriority = 'low' | 'medium' | 'high';

/** A single rule that fired during grading (audit trail). */
export interface FiredRule {
	ruleId: string;
	axis: Axis | string;
	category: string;
	description: string;
}

/** A safety-critical flag, independent of the four axes. */
export interface Flag {
	flagId: string;
	category: FlagCategory;
	priority: FlagPriority;
	description: string;
	suggestedAction: string;
}

/** The computed four-axis vetting grade. */
export interface GradingResult {
	// Axis A
	appropriatenessScore: number;
	appropriatenessBand: AppropriatenessBand;
	// Axis B
	windowFit: WindowFit;
	recommendedScanType: ScanType;
	// Axis C
	completenessPercent: number;
	// Axis D
	triageTier: TriageTier;
	targetTimeframe: string;
	// Overall
	recommendation: Recommendation;
	recommendationLabel: string;
	firedRules: FiredRule[];
	flags: Flag[];
	gradedAt: string;
}

// ─── Step configuration ───

export interface StepConfig {
	number: number;
	title: string;
	shortTitle: string;
}

// ─── Dashboard row ───

/** A graded request row for the vetting dashboard table. */
export interface RequestRow {
	id: string;
	referralDate: string;
	patientName: string;
	nhsNumber: string;
	scanType: ScanType;
	indication: Indication;
	gestationalAge: string;
	appropriatenessBand: AppropriatenessBand;
	windowFit: WindowFit;
	completenessPercent: number;
	triageTier: TriageTier;
	recommendation: Recommendation;
	flagCount: number;
}
