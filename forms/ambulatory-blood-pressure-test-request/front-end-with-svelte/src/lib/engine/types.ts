// ──────────────────────────────────────────────
// Ambulatory Blood Pressure Test Request — data model + grading types.
//
// A UK NHS-aligned ambulatory blood pressure monitoring (ABPM) request that a
// clinician completes to request 24-hour ABPM (or home BP monitoring) for a
// patient. The engine grades each request on four independent axes
// (appropriateness, suitability, completeness, triage) plus safety flags.
// ──────────────────────────────────────────────

/** Requested test type. */
export type TestType =
	| '24-hour-abpm'
	| 'home-blood-pressure-monitoring'
	| 'other'
	| '';

/** Primary clinical indication for the request. */
export type Indication =
	| 'diagnose-hypertension'
	| 'white-coat-hypertension'
	| 'masked-hypertension'
	| 'resistant-hypertension'
	| 'treatment-monitoring'
	| 'hypotension-symptoms'
	| 'pregnancy-hypertension'
	| 'other'
	| '';

/** Requested urgency / triage tier. */
export type Urgency = 'routine' | 'urgent' | 'emergency' | '';

// ──────────────────────────────────────────────
// Section data models (camelCase, mirrors the SQL / examples convention)
// ──────────────────────────────────────────────

export interface Clinician {
	clinicianName: string;
	clinicianRole: string;
	registrationBody: string;
	registrationNumber: string;
	requesterContact: string;
	supervisingConsultant: string;
	siteName: string;
	referralDate: string;
}

export interface Patient {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	nhsNumber: string;
	bodyMassIndex: number | null;
}

export interface RequestDetails {
	testType: TestType;
	primaryIndication: Indication;
	clinicalQuestion: string;
	relevantHistory: string;
}

export interface BloodPressure {
	clinicBpSystolic: number | null;
	clinicBpDiastolic: number | null;
	onAntihypertensives: boolean;
	currentMedications: string;
}

export interface Symptoms {
	symptomDizziness: boolean;
	symptomHeadache: boolean;
	atrialFibrillation: boolean;
	pregnant: boolean;
}

export interface Triage {
	urgency: Urgency;
	requestedByDate: string;
	setting: string;
	notes: string;
}

// ──────────────────────────────────────────────
// Full request data model
// ──────────────────────────────────────────────

export interface AbpmRequest {
	clinician: Clinician;
	patient: Patient;
	request: RequestDetails;
	bloodPressure: BloodPressure;
	symptoms: Symptoms;
	triage: Triage;
}

// ──────────────────────────────────────────────
// Grading types (four-axis)
// ──────────────────────────────────────────────

/** Axis A — appropriateness band (NICE NG136 1-9 ordinal). */
export type AppropriatenessBand =
	| 'usually-appropriate'
	| 'may-be-appropriate'
	| 'usually-not-appropriate';

/** Axis B — oscillometric measurement suitability band (BIHS). */
export type SuitabilityBand = 'ok' | 'caution' | 'limited';

/** Axis D — triage tier (NICE NG136 severe-BP escalation). */
export type TriageTier = 'routine' | 'urgent' | 'emergency';

/** Overall vetting recommendation derived from the four axes. */
export type Recommendation = 'accept' | 'query-referrer' | 'redirect' | 'reject';

export type FlagPriority = 'high' | 'medium' | 'low';

/** A rule that fired during grading (stable rule IDs across all front/back-ends). */
export interface FiredRule {
	ruleId: string;
	axis: string;
	category: string;
	description: string;
}

/** A safety flag detected independently of the axes. */
export interface SafetyFlag {
	flagId: string;
	category: string;
	priority: FlagPriority;
	description: string;
	suggestedAction: string;
}

/** The full grading result produced by `calculateGrade`. */
export interface GradingResult {
	appropriatenessScore: number;
	appropriatenessBand: AppropriatenessBand;
	suitabilityBand: SuitabilityBand;
	completenessPercent: number;
	triageTier: TriageTier;
	targetTimeframe: string;
	recommendation: Recommendation;
	recommendationLabel: string;
	firedRules: FiredRule[];
	flags: SafetyFlag[];
	timestamp: string;
}

// ──────────────────────────────────────────────
// Step configuration
// ──────────────────────────────────────────────

export interface StepConfig {
	number: number;
	title: string;
	shortTitle: string;
	section: keyof AbpmRequest;
}
