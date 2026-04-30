// ──────────────────────────────────────────────
// DVLA V1 form — core data types
// ──────────────────────────────────────────────

export type YesNo = 'yes' | 'no' | '';

/** Eyesight standard self-declaration. */
export type EyesightStandard =
	| 'yes-without-correction'
	| 'yes-with-correction'
	| 'no'
	| '';

/** Which eye is affected, for monocular declarations. */
export type WhichEye = 'left' | 'right' | '';

/** Which eye(s) are affected, for bilateral conditions. */
export type WhichEyes = 'both' | 'left' | 'right' | '';

/** Origin of monocular vision. */
export type MonocularDuration =
	| 'since-birth-or-childhood'
	| 'health-or-injury'
	| '';

/** Whether the patient has adapted to monocular vision. */
export type MonocularAdaptation =
	| 'adapted-advised'
	| 'adapted-self'
	| 'not-adapted'
	| '';

/** Cause of visual field problem, when not solely an eye condition. */
export type VisualFieldCause =
	| 'brain-tumour'
	| 'head-injury'
	| 'stroke'
	| 'other'
	| '';

/** Contact preference (for healthcare professional or DVLA correspondence). */
export type ContactPreference = 'email' | 'sms' | '';

// ──────────────────────────────────────────────
// Step 1 — Personal Details (Part A)
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
// Step 2 — Healthcare Professionals (Part B)
// ──────────────────────────────────────────────

export interface GpDetails {
	name: string;
	surgeryName: string;
	address: string;
	town: string;
	postcode: string;
	contactNumber: string;
	email: string;
	dateLastSeen: string;
}

export interface ConsultantDetails {
	name: string;
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
// Step 3 — Q1 Eyesight Standards
// ──────────────────────────────────────────────

export interface EyesightStandards {
	meetsStandard: EyesightStandard;
}

// ──────────────────────────────────────────────
// Step 4 — Q2 Vision in Both Eyes / Monocular
// ──────────────────────────────────────────────

export interface VisionInBothEyes {
	hasVisionInBothEyes: YesNo;
	whichEye: WhichEye;
	duration: MonocularDuration;
	adaptation: MonocularAdaptation;
	monocularDeclarationConfirmed: boolean;
}

// ──────────────────────────────────────────────
// Step 5 — Q3 Field of Vision
// ──────────────────────────────────────────────

export interface FieldOfVision {
	hasProblem: YesNo;
	causedSolelyByEyeCondition: YesNo;
	cause: VisualFieldCause;
	causeOtherDetails: string;
}

// ──────────────────────────────────────────────
// Step 6 — Q4 Glaucoma
// ──────────────────────────────────────────────

export interface Glaucoma {
	hasCondition: YesNo;
	whichEyes: WhichEyes;
}

// ──────────────────────────────────────────────
// Step 7 — Q5 Retinitis Pigmentosa
// ──────────────────────────────────────────────

export interface RetinitisPigmentosa {
	hasCondition: YesNo;
	whichEyes: WhichEyes;
}

// ──────────────────────────────────────────────
// Step 8 — Q6 Laser Treatment
// ──────────────────────────────────────────────

export interface LaserTreatment {
	hasHadTreatment: YesNo;
	leftEyeFirstDate: string;
	rightEyeFirstDate: string;
	leftEyeLastDate: string;
	rightEyeLastDate: string;
}

// ──────────────────────────────────────────────
// Step 9 — Q7 Blepharospasm
// ──────────────────────────────────────────────

export interface Blepharospasm {
	hasCondition: YesNo;
	whichEyes: WhichEyes;
	hasHadTreatment: YesNo;
	adequatelyControlled: YesNo;
}

// ──────────────────────────────────────────────
// Step 10 — Q8 Night Blindness
// ──────────────────────────────────────────────

export interface NightBlindness {
	hasCondition: YesNo;
	whichEyes: WhichEyes;
}

// ──────────────────────────────────────────────
// Step 11 — Q9 Double Vision
// ──────────────────────────────────────────────

export interface DoubleVision {
	hasCondition: YesNo;
	controlled: YesNo;
	sameForSixMonthsOrMore: YesNo;
	doubleVisionDeclarationConfirmed: boolean;
	declarationSignatureName: string;
	declarationDate: string;
}

// ──────────────────────────────────────────────
// Step 12 — Q10 Other Vision Conditions
// ──────────────────────────────────────────────

export interface OtherVisionConditions {
	hasOther: YesNo;
	details: string;
}

// ──────────────────────────────────────────────
// Step 13 — Q11 Recent Contact
// ──────────────────────────────────────────────

export interface RecentContact {
	hadContact: YesNo;
	dateOfContact: string;
}

// ──────────────────────────────────────────────
// Step 14 — Authorisation
// ──────────────────────────────────────────────

export interface Authorisation {
	declarationConfirmed: boolean;
	name: string;
	signature: string;
	date: string;
	authoriseElectronicCorrespondence: YesNo;
	contactPreferenceFromHealthcareProfessional: ContactPreference;
	contactPreferenceFromDvla: ContactPreference;
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

export interface AssessmentData {
	personalDetails: PersonalDetails;
	healthcareProfessionals: HealthcareProfessionals;
	eyesightStandards: EyesightStandards;
	visionInBothEyes: VisionInBothEyes;
	fieldOfVision: FieldOfVision;
	glaucoma: Glaucoma;
	retinitisPigmentosa: RetinitisPigmentosa;
	laserTreatment: LaserTreatment;
	blepharospasm: Blepharospasm;
	nightBlindness: NightBlindness;
	doubleVision: DoubleVision;
	otherVisionConditions: OtherVisionConditions;
	recentContact: RecentContact;
	authorisation: Authorisation;
}

// ──────────────────────────────────────────────
// Validation engine types
// ──────────────────────────────────────────────

export type ValidationSeverity = 'error' | 'warning' | 'info';

/** A validation rule applied to the active branch of the form. */
export interface ValidationRule {
	id: string;
	section: keyof AssessmentData;
	severity: ValidationSeverity;
	description: string;
	/** Returns true when the rule is satisfied (no issue). */
	evaluate: (data: AssessmentData) => boolean;
	/** Human-readable issue message when the rule fails. */
	message: string;
}

export interface FiredValidation {
	id: string;
	section: keyof AssessmentData;
	severity: ValidationSeverity;
	description: string;
	message: string;
}

export interface FlaggedIssue {
	id: string;
	category: string;
	message: string;
	priority: 'urgent' | 'high' | 'medium' | 'low';
}

export interface ValidationResult {
	isComplete: boolean;
	completionRatio: number;
	firedValidations: FiredValidation[];
	flaggedIssues: FlaggedIssue[];
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
