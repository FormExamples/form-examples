// ──────────────────────────────────────────────
// Core WHO Counter-Referral Form data types
// ──────────────────────────────────────────────

/** Yes / No / unanswered. */
export type YesNo = 'yes' | 'no' | '';

/** Patient sex per WHO form (Male / Female / Unknown). */
export type Sex = 'male' | 'female' | 'unknown' | '';

/** Pregnancy status per WHO form (Yes / No / Unknown). */
export type PregnancyStatus = 'yes' | 'no' | 'unknown' | '';

/** Acuity classification of the original referral. */
export type Acuity = 'acute' | 'non-acute' | '';

/** Time frame for primary care follow-up with the patient. */
export type FollowUpTimeframe =
	| 'urgent-within-24-hours'
	| '2-to-6-days'
	| '1-to-2-weeks'
	| 'more-than-2-weeks'
	| '';

// ──────────────────────────────────────────────
// Step 1 — Patient Identification
// ──────────────────────────────────────────────

export interface EmergencyContact {
	name: string;
	contactInformation: string;
}

export interface PatientIdentification {
	patientName: string;
	dateOfBirth: string;
	sex: Sex;
	patientContact: string;
	emergencyContact: EmergencyContact;
}

// ──────────────────────────────────────────────
// Step 2 — Facility Details
// ──────────────────────────────────────────────

export interface FacilityContact {
	name: string;
	focalPoint: string;
	phoneNumber: string;
}

export interface FacilityCommunication {
	discussedWithPrimaryCareProvider: boolean;
	discussedWithInitiatingFacility: boolean;
}

export interface FacilityDetails {
	initiatingFacility: FacilityContact;
	referralDate: string;
	referralReason: string;
	acuity: Acuity;
	referralFacility: FacilityContact;
	communication: FacilityCommunication;
	primaryCareFacility: FacilityContact;
	followUpTimeframe: FollowUpTimeframe;
}

// ──────────────────────────────────────────────
// Step 3 — Situation (S of SBAR)
// ──────────────────────────────────────────────

export interface Situation {
	chiefComplaint: string;
	primaryDiagnosis: string;
	pregnant: PregnancyStatus;
	treatmentsInitiated: string;
	icuStay: boolean;
	surgery: boolean;
	hospitalized: boolean;
}

// ──────────────────────────────────────────────
// Step 4 — Background (B of SBAR)
// ──────────────────────────────────────────────

export interface Background {
	historyOfPresentIllness: string;
	pastMedicalHistory: string;
	significantEvents: string;
}

// ──────────────────────────────────────────────
// Step 5 — Assessment (A of SBAR)
// ──────────────────────────────────────────────

export interface Assessment {
	finalDiagnoses: string;
	prognosisAndGoalsOfCare: string;
	patientFamilyInformed: YesNo;
	informedExplanation: string;
}

// ──────────────────────────────────────────────
// Step 6 — Recommendations (R of SBAR)
// ──────────────────────────────────────────────

export interface StatusFlags {
	cognitiveImpairment: boolean;
	carerDependent: boolean;
	spinalPrecautions: boolean;
	weightBearingRestrictions: boolean;
	palliativeCare: boolean;
}

export interface Recommendations {
	followUpPlan: string;
	pendingInvestigations: string;
	followUpArrangements: string;
	deteriorationInstructions: string;
	contactName: string;
	contactInformation: string;
	statusFlags: StatusFlags;
}

// ──────────────────────────────────────────────
// Step 7 — Provider Sign-off
// ──────────────────────────────────────────────

export interface ProviderSignOff {
	providerName: string;
	signature: string;
	signatureDate: string;
}

// ──────────────────────────────────────────────
// Full counter-referral data model
// ──────────────────────────────────────────────

export interface AssessmentData {
	patientIdentification: PatientIdentification;
	facilityDetails: FacilityDetails;
	situation: Situation;
	background: Background;
	assessment: Assessment;
	recommendations: Recommendations;
	providerSignOff: ProviderSignOff;
}

// ──────────────────────────────────────────────
// Validation engine types
// ──────────────────────────────────────────────

/** Section keys referenced by validation rules. */
export type SectionKey = keyof AssessmentData;

/** A single validation rule that may fire against the assessment data. */
export interface ValidationRule {
	id: string;
	section: SectionKey;
	description: string;
	/** True if the rule applies given the conditional logic of the form. */
	applies: (data: AssessmentData) => boolean;
	/** True if the rule is satisfied; false if it has fired (i.e. is incomplete). */
	isSatisfied: (data: AssessmentData) => boolean;
}

/** A rule that has fired (the field is required but unanswered). */
export interface FiredRule {
	id: string;
	section: SectionKey;
	description: string;
}

/** Per-section completeness summary. */
export interface SectionCompleteness {
	section: SectionKey;
	required: number;
	satisfied: number;
	missing: FiredRule[];
}

/** Result of running the completeness validator. */
export interface ValidationResult {
	complete: boolean;
	totalRequired: number;
	totalSatisfied: number;
	sections: SectionCompleteness[];
	missing: FiredRule[];
}

/** Priority for clinician-relevant flags. */
export type FlagPriority = 'urgent' | 'high' | 'medium' | 'low';

export interface FlaggedIssue {
	id: string;
	category: string;
	message: string;
	priority: FlagPriority;
}

// ──────────────────────────────────────────────
// Step configuration
// ──────────────────────────────────────────────

export interface StepConfig {
	number: number;
	title: string;
	shortTitle: string;
	section: SectionKey;
}
