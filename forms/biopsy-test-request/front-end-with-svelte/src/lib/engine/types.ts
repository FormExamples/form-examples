// ──────────────────────────────────────────────
// Biopsy Test Request — core data types
// ──────────────────────────────────────────────
//
// The data model mirrors the HTML reference engine (front-end-form-with-html)
// and SQL migrations: a clinician-driven tissue-biopsy / pathology request
// graded on four orthogonal axes. Property names are camelCase to match the
// front-end serde / examples convention.

/** Periprocedural bleeding-risk band emitted by Axis B. */
export type BleedingRiskBand = 'low' | 'moderate' | 'high';
/** ACR appropriateness band emitted by Axis A. */
export type AppropriatenessBand =
	| 'usually-appropriate'
	| 'may-be-appropriate'
	| 'usually-not-appropriate';
/** Urgency / cancer-pathway triage tier emitted by Axis D. */
export type TriageTier = 'routine' | 'urgent' | 'two-week-wait' | 'emergency';
/** Overall vetting recommendation derived from the four axes. */
export type Recommendation = 'accept' | 'query-referrer' | 'redirect' | 'reject';
/** Safety-flag priority. */
export type FlagPriority = 'high' | 'medium' | 'low';

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

export interface Procedure {
	biopsySite: string;
	biopsyMethod: string;
	laterality: string;
	imagingGuidanceRequired: boolean;
	setting: string;
}

export interface Indication {
	primaryIndication: string;
	clinicalQuestion: string;
	relevantHistory: string;
}

export interface Lesion {
	lesionDescription: string;
	lesionSize: number | null;
	lesionLocation: string;
	imagingCorrelate: string;
	previousFinding: string;
}

export interface Bleeding {
	takingAnticoagulant: boolean;
	anticoagulantAgent: string;
	takingAntiplatelet: boolean;
	antiplateletAgent: string;
	inr: number | null;
	plateletCount: number | null;
	bleedingDisorder: boolean;
	immunosuppressed: boolean;
}

export interface Triage {
	urgency: string;
	requestedByDate: string;
	notes: string;
}

// ──────────────────────────────────────────────
// Full request data model
// ──────────────────────────────────────────────

export interface BiopsyRequestData {
	clinician: Clinician;
	patient: Patient;
	procedure: Procedure;
	indication: Indication;
	lesion: Lesion;
	bleeding: Bleeding;
	triage: Triage;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A rule fired by one of the four axes. */
export interface FiredRule {
	ruleId: string;
	axis: string;
	category: string;
	description: string;
}

/** A safety flag raised independently of the axes. */
export interface SafetyFlag {
	flagId: string;
	category: string;
	priority: FlagPriority;
	description: string;
	suggestedAction: string;
}

/** The complete, deterministic four-axis grading result. */
export interface GradingResult {
	appropriatenessScore: number;
	appropriatenessBand: AppropriatenessBand;
	bleedingRiskBand: BleedingRiskBand;
	anticoagulantAction: string;
	completenessPercent: number;
	triageTier: TriageTier;
	targetTimeframe: string;
	twoWeekWaitEligible: boolean;
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
	section: keyof BiopsyRequestData;
}
