// ──────────────────────────────────────────────
// Provider Transfer Request — core data types
//
// Inter-provider handover (SBAR-aligned) data model. Mirrors the plain-JS
// reference engine in `front-end-form-with-html/js/types.js`.
// ──────────────────────────────────────────────

export type Sex = 'male' | 'female' | 'other' | 'unknown' | '';
export type YesNoUnknown = 'yes' | 'no' | 'unknown' | '';
export type TransferUrgency = 'routine' | 'urgent' | 'emergent' | '';
export type TransferType =
	| 'ward-to-ward'
	| 'inter-hospital'
	| 'inter-organisation'
	| 'community'
	| '';
export type TransportMode =
	| 'self'
	| 'wheelchair'
	| 'stretcher'
	| 'ambulance'
	| 'critical-care-transport'
	| '';
export type ConsciousLevel = 'awake' | 'drowsy' | 'unresponsive' | '';
export type FlagPriority = 'urgent' | 'high' | 'medium' | 'low';
export type CompletenessLevel = 'complete' | 'partial' | 'incomplete';

export interface ProviderDetails {
	clinicianName: string;
	clinicianRole: string;
	organisation: string;
	ward: string;
	phone: string;
	email: string;
	registrationBody: string;
	registrationNumber: string;
}

export interface PatientDemographics {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	sex: Sex;
	nhsNumber: string;
	hospitalNumber: string;
	addressLine: string;
	postcode: string;
	nextOfKinName: string;
	nextOfKinPhone: string;
}

export interface Situation {
	reasonForTransfer: string;
	primaryDiagnosis: string;
	urgency: TransferUrgency;
	transferType: TransferType;
	requestedDateTime: string;
}

export interface Background {
	presentingComplaint: string;
	relevantHistory: string;
	pastMedicalHistory: string;
	currentMedications: string;
	allergies: string;
	recentInvestigations: string;
	infectionStatus: string;
}

export interface VitalSigns {
	heartRate: number | null;
	respiratoryRate: number | null;
	systolicBloodPressure: number | null;
	diastolicBloodPressure: number | null;
	temperatureCelsius: number | null;
	oxygenSaturation: number | null;
	newsScore: number | null;
}

export interface Assessment {
	currentClinicalStatus: string;
	consciousLevel: ConsciousLevel;
	vitalSigns: VitalSigns;
	clinicallyStable: YesNoUnknown;
	stabilityNotes: string;
}

export interface Recommendation {
	requestedAction: string;
	expectedOutcomes: string;
	ongoingCarePlan: string;
	pendingResults: string;
}

export interface TransferLogistics {
	transportMode: TransportMode;
	departureDateTime: string;
	estimatedArrivalDateTime: string;
	escortRequired: boolean;
	escortDetails: string;
	oxygenRequired: boolean;
	cardiacMonitoringRequired: boolean;
	infectiousPrecautions: boolean;
	infectiousPrecautionsDetails: string;
	fallsRisk: boolean;
	mentalCapacityConcerns: boolean;
	equipmentRequired: string;
}

export interface SignoffAcknowledgement {
	requestingProviderSignature: string;
	requestingProviderSignatureDate: string;
	receivingProviderName: string;
	receivingProviderSignature: string;
	receivingProviderSignatureDate: string;
	acknowledgementReceived: boolean;
	acknowledgementNotes: string;
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

export interface AssessmentData {
	requestingProvider: ProviderDetails;
	receivingProvider: ProviderDetails;
	patientDemographics: PatientDemographics;
	situation: Situation;
	background: Background;
	assessment: Assessment;
	recommendation: Recommendation;
	transferLogistics: TransferLogistics;
	signoffAcknowledgement: SignoffAcknowledgement;
}

// ──────────────────────────────────────────────
// Validation / completeness types
// ──────────────────────────────────────────────

export type SectionKey = keyof AssessmentData;

export interface FiredRule {
	id: string;
	section: string;
	description: string;
	mandatory: boolean;
}

export interface ValidationRule {
	id: string;
	section: SectionKey;
	description: string;
	mandatory: boolean;
	applies: (d: AssessmentData) => boolean;
	isSatisfied: (d: AssessmentData) => boolean;
}

export interface SectionCompleteness {
	section: string;
	required: number;
	satisfied: number;
	mandatoryRequired: number;
	mandatorySatisfied: number;
	missing: FiredRule[];
}

export interface ValidationResult {
	completeness: CompletenessLevel;
	totalRequired: number;
	totalSatisfied: number;
	mandatoryRequired: number;
	mandatorySatisfied: number;
	sections: SectionCompleteness[];
	missing: FiredRule[];
}

export interface FlaggedIssue {
	id: string;
	category: string;
	message: string;
	priority: FlagPriority;
}

/**
 * The full grading result the store holds after submit: the completeness
 * validation, the flagged issues, and a generation timestamp.
 */
export interface GradingResult {
	validation: ValidationResult;
	flags: FlaggedIssue[];
	timestamp: string;
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
