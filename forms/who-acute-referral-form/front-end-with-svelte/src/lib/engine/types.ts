// ──────────────────────────────────────────────
// Core WHO Acute Referral Form data types
// ──────────────────────────────────────────────

export type YesNoUnknown = 'yes' | 'no' | 'unknown' | '';

export type Sex = 'male' | 'female' | 'unknown' | '';

export type ModeOfTransfer = 'ground' | 'air' | 'sea' | '';

// ──────────────────────────────────────────────
// Step 1 — Patient Identification
// ──────────────────────────────────────────────

export interface EmergencyContact {
	name: string;
	contactInformation: string;
}

export interface PatientIdentification {
	patientLastName: string;
	patientFirstName: string;
	dateOfBirth: string;
	sex: Sex;
	patientContactInformation: string;
	emergencyContact: EmergencyContact;
}

// ──────────────────────────────────────────────
// Step 2 — Facility & Transport
// ──────────────────────────────────────────────

export interface FacilityDetails {
	name: string;
	focalPoint: string;
	phoneNumber: string;
}

export interface AmbulanceDetails {
	name: string;
	focalPoint: string;
	phoneNumber: string;
}

export interface FacilityAndTransport {
	initiatingFacility: FacilityDetails;
	reasonForReferral: string;
	referralFacilityContacted: boolean;
	referralFacility: FacilityDetails;
	ambulance: AmbulanceDetails;
	transferDecisionDateTime: string;
	departureDateTime: string;
	modeOfTransfer: ModeOfTransfer;
}

// ──────────────────────────────────────────────
// Step 3 — Situation
// ──────────────────────────────────────────────

export interface Situation {
	chiefComplaint: string;
	primaryDiagnosis: string;
	pregnant: YesNoUnknown;
	otherAcuteDiagnoses: string;
	treatmentsInitiated: string;
}

// ──────────────────────────────────────────────
// Step 4 — Background (history + ABCDE)
// ──────────────────────────────────────────────

export interface AbcdeEntry {
	findingNormal: boolean;
	findingDetails: string;
	interventionNone: boolean;
	interventionDetails: string;
}

export interface Background {
	historyOfPresentIllness: string;
	pastMedicalAndSurgicalHistory: string;
	airway: AbcdeEntry;
	breathing: AbcdeEntry;
	circulation: AbcdeEntry;
	disability: AbcdeEntry;
	exposure: AbcdeEntry;
	otherSignificantTreatments: string;
}

// ──────────────────────────────────────────────
// Step 5 — Assessment (clinical assessment + vital signs)
// ──────────────────────────────────────────────

export interface VitalSigns {
	heartRate: number | null;
	respiratoryRate: number | null;
	systolicBloodPressure: number | null;
	diastolicBloodPressure: number | null;
	temperatureCelsius: number | null;
	oxygenSaturation: number | null;
	glasgowComaScale: number | null;
}

export interface Assessment {
	clinicalAssessment: string;
	vitalSigns: VitalSigns;
}

// ──────────────────────────────────────────────
// Step 6 — Recommendations
// ──────────────────────────────────────────────

export interface Precautions {
	highlyInfectiousDisease: boolean;
	spinalPrecautions: boolean;
	weightBearingRestrictions: boolean;
	fallRisk: boolean;
	aspirationRisk: boolean;
	other: boolean;
	otherDetails: string;
}

export interface Recommendations {
	treatmentPlanDuringTransport: string;
	potentialWorseningOfCondition: string;
	cautionsRegardingPriorTherapies: string;
	precautions: Precautions;
}

// ──────────────────────────────────────────────
// Step 7 — Provider Sign-off (initiating facility)
// ──────────────────────────────────────────────

export interface InitiatingProviderSignoff {
	providerName: string;
	signature: string;
	signatureDate: string;
}

// ──────────────────────────────────────────────
// Step 8 — Referral Facility Receipt
// ──────────────────────────────────────────────

export interface ReferralFacilityReceipt {
	patientArrivalDateTime: string;
	receivingProviderName: string;
	receivingProviderSignature: string;
	feedbackProvidedToInitiatingFacility: boolean;
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

export interface AssessmentData {
	patientIdentification: PatientIdentification;
	facilityAndTransport: FacilityAndTransport;
	situation: Situation;
	background: Background;
	assessment: Assessment;
	recommendations: Recommendations;
	initiatingProviderSignoff: InitiatingProviderSignoff;
	referralFacilityReceipt: ReferralFacilityReceipt;
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
