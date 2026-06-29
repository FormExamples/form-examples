// ──────────────────────────────────────────────
// Core allergy-skin-test-request data types
// ──────────────────────────────────────────────
//
// Ported from the canonical vanilla-JS engine in
// `front-end-form-with-html/js/`. Property names are camelCase to match the
// front-end serde / examples convention; allergen panels and validity/safety
// history are booleans mirroring the BOOLEAN columns in the SQL source of truth.

export type TestType =
	| 'skin-prick-test'
	| 'intradermal-test'
	| 'patch-test'
	| 'specific-ige-blood'
	| 'drug-provocation-challenge'
	| 'other'
	| '';

export type Indication =
	| 'suspected-food-allergy'
	| 'suspected-drug-allergy'
	| 'rhinitis-asthma'
	| 'anaphylaxis-investigation'
	| 'venom-allergy'
	| 'contact-dermatitis'
	| 'urticaria'
	| 'other'
	| '';

export type Urgency = 'routine' | 'urgent' | '';

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
	interpreterRequired: boolean;
}

export interface Test {
	testType: TestType;
	allergenAeroallergens: boolean;
	allergenFood: boolean;
	allergenDrug: boolean;
	allergenVenom: boolean;
	allergenLatex: boolean;
	allergenContact: boolean;
}

export interface IndicationSection {
	primaryIndication: Indication;
	clinicalQuestion: string;
	clinicalDetails: string;
}

export interface Safety {
	previousAnaphylaxis: boolean;
	onAntihistamines: boolean;
	onBetaBlocker: boolean;
	currentSkinDisease: boolean;
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

export interface RequestData {
	clinician: Clinician;
	patient: Patient;
	test: Test;
	indication: IndicationSection;
	safety: Safety;
	triage: Triage;
}

// ──────────────────────────────────────────────
// Four-axis grading types
// ──────────────────────────────────────────────

export type AppropriatenessBand =
	| 'usually-appropriate'
	| 'may-be-appropriate'
	| 'usually-not-appropriate';

export type ValidityBand = 'ok' | 'caution' | 'contraindicated';

export type TriageTier = 'routine' | 'urgent';

export type Recommendation = 'accept' | 'query-referrer' | 'redirect' | 'reject';

export type FlagPriority = 'high' | 'medium' | 'low';

/** A rule that fired during grading, contributing to one of the four axes. */
export interface FiredRule {
	ruleId: string;
	axis: string;
	category: string;
	description: string;
}

/** A safety flag detected independently of the four axes. */
export interface SafetyFlag {
	flagId: string;
	category: string;
	priority: FlagPriority;
	description: string;
	suggestedAction: string;
}

/** The complete, deterministic grading result for one request. */
export interface GradingResult {
	appropriatenessScore: number;
	appropriatenessBand: AppropriatenessBand;
	validitySafetyBand: ValidityBand;
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
	section: keyof RequestData | 'review';
}
