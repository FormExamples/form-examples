// ──────────────────────────────────────────────
// Eye Vision Test Request — core data types
//
// Field names are camelCase (front-end serde); they mirror the snake_case
// columns in the form's SQL migrations. The data model is nested by wizard
// section (clinician, patient, request, symptoms, riskFactors, triage).
// ──────────────────────────────────────────────

// ─── Enumerations (mirror the SQL CHECK constraints) ───

/** Requested ophthalmic / optometric examination. */
export type TestType =
	| 'visual-acuity'
	| 'visual-fields'
	| 'refraction'
	| 'fundus-examination'
	| 'optical-coherence-tomography'
	| 'fluorescein-angiography'
	| 'tonometry'
	| 'slit-lamp'
	| 'orthoptic-assessment'
	| 'other'
	| '';

/** Eye(s) to be examined. */
export type Laterality = 'right' | 'left' | 'both' | '';

/** Primary clinical indication for the examination. */
export type PrimaryIndication =
	| 'reduced-vision'
	| 'suspected-glaucoma'
	| 'diabetic-retinopathy-screening'
	| 'sudden-visual-loss'
	| 'flashes-floaters'
	| 'red-eye'
	| 'childhood-squint'
	| 'visual-field-defect'
	| 'cataract-assessment'
	| 'headache-visual-symptoms'
	| 'other'
	| '';

/** Requested triage urgency. */
export type Urgency = 'routine' | 'urgent' | 'emergency' | '';

/** Care setting the request originates from. */
export type Setting =
	| 'hospital-eye-service'
	| 'community-optometry'
	| 'gp-surgery'
	| 'emergency-eye-clinic'
	| 'triage-desk'
	| '';

// ─── Axis enumerations (grade) ───

/** Axis A — appropriateness band. */
export type AppropriatenessBand =
	| 'usually-appropriate'
	| 'may-be-appropriate'
	| 'usually-not-appropriate'
	| '';

/** Axis B — urgency / triage tier. */
export type TriageTier = 'routine' | 'urgent' | 'emergency' | '';

/** Axis D — clinical priority band. */
export type PriorityBand = 'low' | 'moderate' | 'high' | '';

/** Overall vetting recommendation. */
export type Recommendation = 'accept' | 'query-referrer' | 'redirect' | 'reject' | '';

// ─── The request record (nested by wizard section) ───

/** Requesting clinician (referrer) details. */
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

/** Patient identification. */
export interface PatientSection {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	nhsNumber: string;
	interpreterRequired: boolean;
}

/** Requested examination, indication, clinical question, and history. */
export interface RequestSection {
	testType: TestType;
	laterality: Laterality;
	primaryIndication: PrimaryIndication;
	clinicalQuestion: string;
	relevantHistory: string;
}

/** Symptoms and red flags. */
export interface SymptomsSection {
	reducedVision: boolean;
	suddenLoss: boolean;
	flashesFloaters: boolean;
	eyePain: boolean;
	redEye: boolean;
}

/** Risk factors. */
export interface RiskFactorsSection {
	diabetes: boolean;
	knownGlaucoma: boolean;
}

/** Triage details. */
export interface TriageSection {
	urgency: Urgency;
	requestedByDate: string;
	setting: Setting;
	notes: string;
}

/**
 * The eye vision test request — the source-of-truth record the four-axis
 * vetting grade is computed from.
 */
export interface EyeVisionRequest {
	clinician: ClinicianSection;
	patient: PatientSection;
	request: RequestSection;
	symptoms: SymptomsSection;
	riskFactors: RiskFactorsSection;
	triage: TriageSection;
}

// ─── Grading types ───

/** A scoring axis, used in the fired-rule audit trail. */
export type Axis = 'appropriateness' | 'urgency' | 'completeness' | 'priority';

/** Flag category (mirrors the SQL grade_flag CHECK constraint). */
export type FlagCategory =
	| 'sudden-visual-loss-emergency'
	| 'retinal-detachment-symptoms'
	| 'acute-painful-red-eye'
	| 'suspected-giant-cell-arteritis'
	| 'missing-indication'
	| 'missing-clinical-question'
	| 'other';

/** Flag priority. */
export type FlagPriority = 'low' | 'medium' | 'high';

/** A single rule that fired during grading (audit trail). */
export interface FiredRule {
	ruleId: string;
	axis: Axis;
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

/**
 * The computed four-axis vetting grade.
 */
export interface GradingResult {
	// Axis A — appropriateness
	appropriatenessScore: number;
	appropriatenessBand: AppropriatenessBand;
	// Axis B — urgency / triage
	triageTier: TriageTier;
	targetTimeframe: string;
	// Axis C — completeness
	completenessPercent: number;
	// Axis D — clinical priority
	priorityBand: PriorityBand;
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
	patientName: string;
	testType: TestType;
	primaryIndication: PrimaryIndication;
	referralDate: string;
	appropriatenessBand: AppropriatenessBand;
	completenessPercent: number;
	triageTier: TriageTier;
	priorityBand: PriorityBand;
	recommendation: Recommendation;
	flagCount: number;
}
