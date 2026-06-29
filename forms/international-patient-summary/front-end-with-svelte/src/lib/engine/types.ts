// ──────────────────────────────────────────────
// International Patient Summary (IPS) data types
//
// The IPS is a standardised, minimal, specialty-agnostic clinical extract
// conforming to ISO 27269 and HL7 FHIR R5. The data model mirrors the eight
// mandatory IPS sections plus two optional ones (medical devices and advance
// directives), and the authoring clinician.
// ──────────────────────────────────────────────

export type Sex = 'male' | 'female' | 'other' | 'unknown' | '';
export type YesNo = 'yes' | 'no' | '';
export type ProblemStatus = 'active' | 'inactive' | 'resolved' | '';
export type ClinicalSeverity = 'mild' | 'moderate' | 'severe' | '';
export type AllergyCriticality = 'low' | 'high' | 'unable-to-assess' | '';
export type ResultInterpretation = 'low' | 'normal' | 'high' | 'critical' | '';
export type AuthoringStatus = 'draft' | 'final' | '';

export interface PatientDemographics {
	givenName: string;
	familyName: string;
	dateOfBirth: string;
	sex: Sex;
	nationalIdentifier: string;
	addressLine: string;
	city: string;
	postalCode: string;
	country: string;
	preferredLanguage: string;
	contactPhone: string;
}

export interface Problem {
	description: string;
	icd10Code: string;
	onsetDate: string;
	status: ProblemStatus;
}

export interface Medication {
	name: string;
	atcCode: string;
	dose: string;
	frequency: string;
	route: string;
}

export interface Allergy {
	substance: string;
	reaction: string;
	severity: ClinicalSeverity;
	criticality: AllergyCriticality;
}

export interface Immunisation {
	vaccine: string;
	date: string;
	lotNumber: string;
}

export interface Procedure {
	description: string;
	date: string;
	performer: string;
}

export interface Result {
	testName: string;
	value: string;
	unit: string;
	interpretation: ResultInterpretation;
	date: string;
}

export interface Device {
	description: string;
	udi: string;
	implantDate: string;
}

export interface AdvanceDirective {
	dnrInPlace: YesNo;
	livingWillInPlace: YesNo;
	consentToShareEu: YesNo;
	directiveNotes: string;
}

export interface AuthoringClinician {
	clinicianName: string;
	clinicianRole: string;
	organisation: string;
	country: string;
	email: string;
	phone: string;
	signoffDate: string;
	authoringStatus: AuthoringStatus;
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

export interface AssessmentData {
	patientDemographics: PatientDemographics;
	problemList: Problem[];
	medicationSummary: Medication[];
	allergiesIntolerances: Allergy[];
	immunisations: Immunisation[];
	procedures: Procedure[];
	resultsInvestigations: Result[];
	medicalDevices: Device[];
	advanceDirectives: AdvanceDirective;
	authoringClinician: AuthoringClinician;
}

// ──────────────────────────────────────────────
// IPS completeness grading types
// ──────────────────────────────────────────────

export type CompletenessLevel = 'complete' | 'partial' | 'incomplete';

export type RuleStatus = 'ok' | 'empty' | 'optional';

/** A declarative IPS section-population rule. */
export interface IPSRule {
	id: string;
	category: string;
	description: string;
	mandatory: boolean;
	evaluate: (data: AssessmentData) => 'ok' | 'empty';
}

/** A rule after evaluation, recorded in the per-section audit trail. */
export interface FiredRule {
	id: string;
	category: string;
	description: string;
	status: RuleStatus;
	mandatory: boolean;
}

/** A clinician-facing flag raised independently of completeness grading. */
export interface AdditionalFlag {
	id: string;
	category: string;
	message: string;
	priority: 'urgent' | 'high' | 'medium' | 'low';
}

export interface GradingResult {
	completenessLevel: CompletenessLevel;
	mandatoryPopulated: number;
	mandatoryTotal: number;
	optionalPopulated: number;
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
