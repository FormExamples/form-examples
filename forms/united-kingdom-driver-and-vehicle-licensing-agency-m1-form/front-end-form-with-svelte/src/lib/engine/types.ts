// ──────────────────────────────────────────────
// Core form data types — DVLA M1 (mental health)
// ──────────────────────────────────────────────

export type YesNo = 'yes' | 'no' | '';

/** Contact preference channel — DVLA correspondence. */
export type ContactPreference = 'email' | 'sms' | '';

// ──────────────────────────────────────────────
// Part A — About You
// ──────────────────────────────────────────────

export interface PersonalDetails {
	title: string;
	fullName: string;
	dateOfBirth: string;
	address: string;
	postcode: string;
	email: string;
	contactNumber: string;
	changeOfDetails: string;
}

// ──────────────────────────────────────────────
// Part B — Healthcare Professionals
// ──────────────────────────────────────────────

export interface GpDetails {
	gpName: string;
	surgeryName: string;
	address: string;
	town: string;
	postcode: string;
	contactNumber: string;
	email: string;
	dateLastSeen: string;
}

export interface ConsultantDetails {
	consultantName: string;
	speciality: string;
	department: string;
	hospitalName: string;
	address: string;
	town: string;
	postcode: string;
	contactNumber: string;
	email: string;
	dateLastSeen: string;
}

export interface HealthcareProfessionals {
	gp: GpDetails;
	consultant: ConsultantDetails;
}

// ──────────────────────────────────────────────
// Q1 — Diagnosis confirmation
// ──────────────────────────────────────────────

export interface DiagnosisConfirmation {
	/** Q1: Have you been diagnosed with a mental health condition? */
	hasMentalHealthDiagnosis: YesNo;
}

// ──────────────────────────────────────────────
// Q2 — Mental health conditions
// ──────────────────────────────────────────────

export interface MentalHealthConditions {
	/** Anxiety or depression (without any impairment of concentration, memory or agitation). */
	anxietyDepressionWithoutImpairment: YesNo;
	/** Anxiety or depression (with suicidal thoughts or impairment in concentration, memory or agitation). */
	anxietyDepressionWithImpairment: YesNo;
	/** Bipolar affective disorder. */
	bipolarAffectiveDisorder: YesNo;
	/** Eating disorder (anorexia nervosa, bulimia). */
	eatingDisorder: YesNo;
	/** Obsessive compulsive disorder or post-traumatic stress disorder. */
	ocdOrPtsd: YesNo;
	/** Personality disorder (any type). */
	personalityDisorder: YesNo;
	/** Schizophrenia or psychosis or delusional disorder or schizoaffective disorder. */
	schizophreniaOrPsychosis: YesNo;
	/** Other mental health condition. */
	other: YesNo;
	/** Free-text details when `other` is 'yes'. */
	otherDetails: string;
}

// ──────────────────────────────────────────────
// Q3 — Recent contact with healthcare professionals
// ──────────────────────────────────────────────

export interface RecentContact {
	/** Q3: Have you had any contact with your healthcare professional in the last 12 months? */
	hadRecentContact: YesNo;
	/** If yes — date last seen by Doctor. */
	doctorLastDate: string;
	/** If yes — date last seen by Consultant. */
	consultantLastDate: string;
	/** If yes — date last seen by Community psychiatric nurse. */
	communityPsychiatricNurseLastDate: string;
}

// ──────────────────────────────────────────────
// Applicant's Authorisation
// ──────────────────────────────────────────────

export interface Authorisation {
	declarationConfirmed: YesNo;
	signatoryName: string;
	signatureText: string;
	signatureDate: string;
	electronicCorrespondenceConsent: YesNo;
	dvlaContactPreference: ContactPreference;
	healthcareProfessionalContactPreference: ContactPreference;
}

// ──────────────────────────────────────────────
// Full form data model
// ──────────────────────────────────────────────

export interface AssessmentData {
	personalDetails: PersonalDetails;
	healthcareProfessionals: HealthcareProfessionals;
	diagnosisConfirmation: DiagnosisConfirmation;
	mentalHealthConditions: MentalHealthConditions;
	recentContact: RecentContact;
	authorisation: Authorisation;
}

// ──────────────────────────────────────────────
// Validation / rules engine types
// ──────────────────────────────────────────────

export type RulePriority = 'urgent' | 'high' | 'medium' | 'low';

export type RuleCategory =
	| 'completeness'
	| 'consistency'
	| 'safety'
	| 'declaration';

/** A validation rule — pure predicate over the form data. */
export interface ValidationRule {
	id: string;
	category: RuleCategory;
	priority: RulePriority;
	description: string;
	/** Returns true when the rule is *triggered* (a problem is detected). */
	evaluate: (data: AssessmentData) => boolean;
	/** Human-readable message emitted when triggered. */
	message: string;
}

export interface FiredRule {
	id: string;
	category: RuleCategory;
	priority: RulePriority;
	description: string;
	message: string;
}

export interface AdditionalFlag {
	id: string;
	category: string;
	message: string;
	priority: RulePriority;
}

export interface ValidationResult {
	/** Form is considered "complete" for the active branch. */
	complete: boolean;
	/** True when the patient answered Q1 = No (form stops there). */
	stoppedAtQ1: boolean;
	firedRules: FiredRule[];
	additionalFlags: AdditionalFlag[];
	/** Number of Q2 conditions selected as 'yes'. */
	conditionCount: number;
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
