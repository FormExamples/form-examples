// ──────────────────────────────────────────────
// Core assessment data types
// ──────────────────────────────────────────────

export type YesNo = 'yes' | 'no' | '';
export type Sex = 'male' | 'female' | 'other' | '';
export type DischargeDestination =
	| 'home'
	| 'care-home'
	| 'nursing-home'
	| 'rehab'
	| 'hospice'
	| 'other-hospital'
	| 'other'
	| '';
export type CareResponsibility =
	| 'self'
	| 'family'
	| 'carer'
	| 'community-team'
	| 'care-home-staff'
	| 'other'
	| '';
export type TransportMode = 'walking' | 'wheelchair' | 'stretcher' | 'ambulance' | 'unknown' | '';
export type MedicationStatus = 'new' | 'changed' | 'unchanged' | 'stopped' | '';
export type DiagnosisType = 'primary' | 'secondary' | '';

export interface PatientDetails {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	sex: Sex;
	nhsNumber: string;
	hospitalNumber: string;
	address: string;
	postcode: string;
	phone: string;
	gpName: string;
	gpPractice: string;
	nextOfKinName: string;
	nextOfKinPhone: string;
}

export interface AdmissionSummary {
	admissionDate: string;
	dischargeDate: string;
	ward: string;
	consultant: string;
	specialty: string;
	reasonForAdmission: string;
	presentingComplaint: string;
	clinicalNarrative: string;
}

export interface Diagnosis {
	description: string;
	icd10: string;
	type: DiagnosisType;
}

export interface Diagnoses {
	diagnoses: Diagnosis[];
}

export interface Procedure {
	description: string;
	opcs4: string;
	date: string;
	performedBy: string;
}

export interface ProceduresPerformed {
	procedures: Procedure[];
	noProceduresPerformed: YesNo;
}

export interface Medication {
	name: string;
	dose: string;
	route: string;
	frequency: string;
	duration: string;
	status: MedicationStatus;
	indication: string;
}

export interface DischargeMedications {
	medications: Medication[];
	reconciliationCompleted: YesNo;
	reconciliationNotes: string;
	allergiesReviewed: YesNo;
	allergyNotes: string;
}

export interface FollowupAppointment {
	provider: string;
	date: string;
	location: string;
	purpose: string;
}

export interface FollowupArrangements {
	appointments: FollowupAppointment[];
	gpFollowupRequired: YesNo;
	gpFollowupTimeframe: string;
	outpatientFollowupRequired: YesNo;
	investigationsPending: YesNo;
	pendingInvestigationDetails: string;
	resultsToBeChasedByGp: YesNo;
}

export interface CommunityCareInstructions {
	dischargeDestination: DischargeDestination;
	otherDestinationDetails: string;
	careResponsibility: CareResponsibility;
	transportMode: TransportMode;
	districtNurseReferral: YesNo;
	socialServicesReferral: YesNo;
	physiotherapyReferral: YesNo;
	occupationalTherapyReferral: YesNo;
	packageOfCareInPlace: YesNo;
	mobilityStatus: string;
	dietaryRequirements: string;
	woundCareInstructions: string;
	equipmentProvided: string;
}

export interface WarningSigns {
	redFlagSymptoms: string[];
	whenToSeekHelp: string;
	emergencyContactNumber: string;
	safetyNetingProvided: YesNo;
	writtenInfoGiven: YesNo;
}

export interface ClinicianSignoff {
	clinicianName: string;
	clinicianRole: string;
	gmcNumber: string;
	signoffDate: string;
	bleepOrContact: string;
	responsibleConsultantInformed: YesNo;
	additionalNotes: string;
}

export interface PatientAcknowledgement {
	patientUnderstandsPlan: YesNo;
	carerInformed: YesNo;
	carerName: string;
	medicationsExplained: YesNo;
	writtenSummaryProvided: YesNo;
	questionsAnswered: YesNo;
	acknowledgementDate: string;
	signedBy: string;
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

export interface AssessmentData {
	patientDetails: PatientDetails;
	admissionSummary: AdmissionSummary;
	diagnoses: Diagnoses;
	proceduresPerformed: ProceduresPerformed;
	dischargeMedications: DischargeMedications;
	followupArrangements: FollowupArrangements;
	communityCareInstructions: CommunityCareInstructions;
	warningSigns: WarningSigns;
	clinicianSignoff: ClinicianSignoff;
	patientAcknowledgement: PatientAcknowledgement;
}

// ──────────────────────────────────────────────
// Discharge-summary completeness grading types
// ──────────────────────────────────────────────

/** NICE NG27 completeness classification. */
export type CompletenessLevel = 'complete' | 'partial' | 'incomplete';

export interface ValidationRule {
	id: string;
	category: string;
	description: string;
	mandatory: boolean;
	evaluate: (data: AssessmentData) => boolean;
}

export interface FiredRule {
	id: string;
	category: string;
	description: string;
	mandatory: boolean;
	satisfied: boolean;
}

export interface AdditionalFlag {
	id: string;
	category: string;
	message: string;
	priority: 'urgent' | 'high' | 'medium' | 'low';
}

export interface GradingResult {
	completenessLevel: CompletenessLevel;
	mandatorySatisfied: number;
	mandatoryTotal: number;
	optionalSatisfied: number;
	optionalTotal: number;
	firedRules: FiredRule[];
	additionalFlags: AdditionalFlag[];
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
