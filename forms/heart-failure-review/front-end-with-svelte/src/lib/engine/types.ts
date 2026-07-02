// ──────────────────────────────────────────────
// Core data types (Heart Failure Annual Review)
//
// This is a DOCUMENTATION and STATUS-CLASSIFICATION instrument, not a numeric
// score. The engine derives FOUR independent outputs (spec §4):
//   - NYHA functional status         (stable / symptomatic / advanced / unknown)
//   - medication-optimisation status (optimised / partial / suboptimal /
//                                     not-applicable) against the four pillars
//   - review-completeness grade      (complete / partial / incomplete)
//   - safety flags                   (each with a high / medium / low priority)
// None of these is a numeric severity total. camelCase property names mirror
// the snake_case SQL columns in `sql/04_create_table_heart_failure_review.sql`.
// ──────────────────────────────────────────────

export type ClinicianRole =
	| 'gp'
	| 'practice-nurse'
	| 'hf-nurse'
	| 'pharmacist'
	| 'cardiologist'
	| 'other'
	| '';
export type CareSetting =
	| 'general-practice'
	| 'community-hf-service'
	| 'hospital-clinic'
	| 'other'
	| '';
export type ReviewType = 'routine-annual' | 'post-discharge' | 'medication-titration' | '';
export type AgeBand = '18-39' | '40-59' | '60-79' | '>=80' | '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';
export type HeartFailureType = 'reduced' | 'mildly-reduced' | 'preserved' | 'unknown' | '';
export type Aetiology = 'ischaemic' | 'hypertensive' | 'valvular' | 'other' | 'unknown' | '';
export type PillarStatus =
	| 'prescribed'
	| 'not-prescribed'
	| 'contraindicated'
	| 'not-tolerated'
	| '';
export type YesNo = 'yes' | 'no' | '';

export type FunctionalStatus = 'stable' | 'symptomatic' | 'advanced' | 'unknown';
export type OptimisationStatus = 'optimised' | 'partial' | 'suboptimal' | 'not-applicable';
export type ReviewStatus = 'complete' | 'partial' | 'incomplete';
export type Priority = 'high' | 'medium' | 'low';

/** Stable pillar key. */
export type Pillar = 'raasInhibitor' | 'betaBlocker' | 'mra' | 'sglt2Inhibitor';

/** Step 1 — review context. */
export interface Context {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	reviewDate: string;
	careSetting: CareSetting;
	reviewType: ReviewType;
	lastReviewDate: string;
}

/** Step 2a — patient identification. */
export interface Identification {
	patientIdentifier: string;
	ageBand: AgeBand;
	sex: Sex;
}

/** Step 2b — established diagnosis. */
export interface Diagnosis {
	yearOfDiagnosis: number | null;
	heartFailureType: HeartFailureType;
	latestLvef: number | null;
	lastEchoDate: string;
	aetiology: Aetiology;
}

/** Step 3 — functional status. */
export interface Functional {
	nyhaClass: number | null;
	breathlessness: string;
	orthopnoea: YesNo;
	paroxysmalNocturnalDyspnoea: YesNo;
	fatigue: string;
	changeSinceLastReview: string;
	decompensation: YesNo;
}

/** Step 4 — fluid status and observations. */
export interface Fluid {
	weightKg: number | null;
	weightChangeKg: number | null;
	peripheralOedema: string;
	raisedJvp: YesNo;
	lungCrackles: YesNo;
	systolicBloodPressure: number | null;
	diastolicBloodPressure: number | null;
	heartRate: number | null;
	heartRhythm: string;
}

/** Step 5 — investigations. */
export interface Investigations {
	ntProBnp: number | null;
	sodium: number | null;
	potassium: number | null;
	urea: number | null;
	creatinine: number | null;
	egfr: number | null;
	haemoglobin: number | null;
	ferritin: number | null;
	transferrinSaturation: number | null;
	hba1c: number | null;
	bloodsDate: string;
}

/** Step 6 — medication optimisation (four pillars + loop diuretic + other). */
export interface Medication {
	raasInhibitorStatus: PillarStatus;
	raasInhibitorAgent: string;
	raasInhibitorDose: string;
	raasInhibitorAtTargetDose: YesNo;
	raasInhibitorAdherence: string;
	betaBlockerStatus: PillarStatus;
	betaBlockerAgent: string;
	betaBlockerDose: string;
	betaBlockerAtTargetDose: YesNo;
	betaBlockerAdherence: string;
	mraStatus: PillarStatus;
	mraAgent: string;
	mraDose: string;
	mraAtTargetDose: YesNo;
	mraAdherence: string;
	sglt2InhibitorStatus: PillarStatus;
	sglt2InhibitorAgent: string;
	sglt2InhibitorDose: string;
	sglt2InhibitorAtTargetDose: YesNo;
	sglt2InhibitorAdherence: string;
	loopDiureticAgent: string;
	loopDiureticDose: string;
	otherMedications: string;
}

/** Step 7 — devices and procedures. */
export interface Devices {
	icd: YesNo;
	crt: YesNo;
	pacemaker: YesNo;
	deviceCheckStatus: string;
}

/** Step 8 — vaccinations and self-management. */
export interface Vaccinations {
	influenzaVaccination: YesNo;
	pneumococcalVaccination: YesNo;
	covidVaccination: YesNo;
	smokingStatus: string;
	alcoholStatus: string;
	dailyWeights: YesNo;
	selfManagementPlan: YesNo;
	cardiacRehab: YesNo;
}

/** Step 9 — summary and plan. */
export interface Summary {
	reviewContext: string;
}

/** The full heart-failure-review data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	diagnosis: Diagnosis;
	functional: Functional;
	fluid: Fluid;
	investigations: Investigations;
	medication: Medication;
	devices: Devices;
	vaccinations: Vaccinations;
	summary: Summary;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** One evaluated medication pillar. */
export interface PillarResult {
	key: Pillar;
	label: string;
	status: PillarStatus;
	/** Whether this pillar counts for the record's HF type. */
	indicated: boolean;
}

/** The four-pillar medication-optimisation result. */
export interface MedicationOptimisation {
	indicatedPillars: number;
	prescribedPillars: number;
	/** Indicated pillar keys whose status is not-prescribed. */
	missingPillars: Pillar[];
	status: OptimisationStatus;
	pillars: PillarResult[];
}

/** Per-domain documentation status row. */
export interface DomainStatus {
	domain: string;
	label: string;
	documented: boolean;
}

/** A single evaluated / derived rule row (mirrors the grade_rule SQL table). */
export interface FiredRule {
	id: string;
	domain: string;
	category: string;
	description: string;
}

/** A clinician-facing safety flag (mirrors the grade_flag SQL table). */
export interface FlaggedIssue {
	id: string;
	/** urgent-review | optimisation-gap | deranged-u-e-hyperkalaemia |
	 *  fluid-overload | missing-monitoring | incomplete | other */
	category: string;
	priority: Priority;
	description: string;
	suggestedAction: string;
}

/** A review-domain documentation rule. */
export interface DomainRule {
	id: string;
	domain: string;
	category: string;
	label: string;
	description: string;
	satisfied: (data: AssessmentData) => boolean;
}

/** The full review grade for one record. */
export interface GradingResult {
	functionalStatus: FunctionalStatus;
	medicationOptimisation: MedicationOptimisation;
	reviewStatus: ReviewStatus;
	/** 0..100. */
	completenessScore: number;
	domainStatuses: DomainStatus[];
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
