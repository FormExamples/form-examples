// ──────────────────────────────────────────────
// Core DVLA B1 form data types
// ──────────────────────────────────────────────

export type YesNo = 'yes' | 'no' | '';

/** Q2 — provider last seen for this condition. */
export type LastSeenProvider = 'gp' | 'consultant' | '';

/** Q4 — seizure diagnosis category. */
export type SeizureDiagnosis = 'first-ever' | 'more-than-one-or-epilepsy' | '';

/** Q10b — method used to suppress or control double vision. */
export type DiplopiaCorrection = 'patch' | 'prism' | 'glasses-or-lenses' | 'other' | '';

/** Q12 / authorisation correspondence channel preferences. */
export type ContactChannel = 'email' | 'sms' | '';

// ──────────────────────────────────────────────
// Step 1 — Personal Details (Part A)
// ──────────────────────────────────────────────

export interface PersonalDetails {
	title: string;
	fullName: string;
	dateOfBirth: string;
	addressLine1: string;
	addressLine2: string;
	addressLine3: string;
	postcode: string;
	email: string;
	contactNumber: string;
	changeOfDetails: string;
}

// ──────────────────────────────────────────────
// Step 2 — Healthcare Professionals (Part B)
// ──────────────────────────────────────────────

export interface GpDetails {
	gpName: string;
	surgeryName: string;
	addressLine1: string;
	addressLine2: string;
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
	addressLine1: string;
	addressLine2: string;
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
// Step 3 — Q1 Condition History
// ──────────────────────────────────────────────

export interface ConditionHistory {
	brainHaemorrhage: boolean;
	brainHaemorrhageDate: string;
	brainHaemorrhageDetails: string;
	severeHeadInjury: boolean;
	severeHeadInjuryDate: string;
	severeHeadInjuryDetails: string;
	otherCondition: boolean;
	otherConditionDate: string;
	otherConditionDetails: string;
	brainSurgeryDate: string;
	brainSurgeryNotApplicable: boolean;
}

// ──────────────────────────────────────────────
// Step 4 — Q2 Treatment Provider
// ──────────────────────────────────────────────

export interface TreatmentProvider {
	lastSeen: LastSeenProvider;
	gpLastContactDate: string;
	gpNextContactDate: string;
	consultantLastContactDate: string;
	consultantNextContactDate: string;
}

// ──────────────────────────────────────────────
// Step 5 — Q3 Blackouts
// ──────────────────────────────────────────────

export interface Blackouts {
	hadBlackouts: YesNo;
	blackoutDate: string;
}

// ──────────────────────────────────────────────
// Step 6 — Q4–Q6 Seizures
// ──────────────────────────────────────────────

export interface FirstEverSeizure {
	date: string;
	details: string;
}

export interface MultipleSeizureDetails {
	twoOrMoreWithinFiveYears: YesNo;
	firstAwakeSeizureDate: string;
	firstAsleepSeizureDate: string;
	lastTwoAwakeSeizureDate1: string;
	lastTwoAwakeSeizureDate2: string;
	lastTwoAsleepSeizureDate1: string;
	lastTwoAsleepSeizureDate2: string;
	firstSleepAttackAfterLastAwakeAttackDate: string;
	affectedConsciousness: YesNo;
	wouldHaveAffectedDriving: YesNo;
	attackDescription: string;
	resultOfMedicationAdvice: YesNo;
	dateMedicationStartedToReduce: string;
	previousMedicationRestarted: YesNo;
	datePreviousMedicationRestarted: string;
	dateOfLastSeizurePriorToWithdrawal: string;
	provokedSeizureDetails: string;
}

export interface EpilepsyDeclaration {
	declarationAccepted: boolean;
	signedName: string;
	signatureDate: string;
}

export interface Seizures {
	hadSeizures: YesNo;
	diagnosis: SeizureDiagnosis;
	firstEver: FirstEverSeizure;
	multiple: MultipleSeizureDetails;
	epilepsyDeclaration: EpilepsyDeclaration;
}

// ──────────────────────────────────────────────
// Step 7 — Q7 Medication
// ──────────────────────────────────────────────

export interface MedicationEntry {
	name: string;
	startDate: string;
	endDate: string;
}

export interface Medication {
	noMedicationTaken: boolean;
	entries: MedicationEntry[];
	makesDrowsyOrConfused: YesNo;
}

// ──────────────────────────────────────────────
// Step 8 — Q8 VP Shunt
// ──────────────────────────────────────────────

export interface VpShunt {
	hadVpShuntOrDrain: YesNo;
	procedureDate: string;
}

// ──────────────────────────────────────────────
// Step 9 — Q9 Daily Living
// ──────────────────────────────────────────────

export interface DailyLiving {
	needsHelp: YesNo;
	helpDetails: string;
}

// ──────────────────────────────────────────────
// Step 10 — Q10 Double Vision
// ──────────────────────────────────────────────

export interface DoubleVision {
	hasDoubleVision: YesNo;
	suppressedOrControlled: YesNo;
	correctionMethod: DiplopiaCorrection;
	correctionMethodOther: string;
}

// ──────────────────────────────────────────────
// Step 11 — Q11 Eyesight
// ──────────────────────────────────────────────

export interface Eyesight {
	hasEyesightProblems: YesNo;
	details: string;
}

// ──────────────────────────────────────────────
// Step 12 — Q12 Vehicle Adaptations
// ──────────────────────────────────────────────

export interface VehicleAdaptations {
	needsAdaptations: YesNo;
	previouslyDeclared: YesNo;
	additionalControlsFitted: YesNo;
}

// ──────────────────────────────────────────────
// Step 13 — Authorisation
// ──────────────────────────────────────────────

export interface Authorisation {
	declarationAccepted: boolean;
	name: string;
	signatureDate: string;
	electronicCorrespondenceConsent: YesNo;
	dvlaContactPreference: ContactChannel;
	healthcareContactPreference: ContactChannel;
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

export interface AssessmentData {
	personalDetails: PersonalDetails;
	healthcareProfessionals: HealthcareProfessionals;
	conditionHistory: ConditionHistory;
	treatmentProvider: TreatmentProvider;
	blackouts: Blackouts;
	seizures: Seizures;
	medication: Medication;
	vpShunt: VpShunt;
	dailyLiving: DailyLiving;
	doubleVision: DoubleVision;
	eyesight: Eyesight;
	vehicleAdaptations: VehicleAdaptations;
	authorisation: Authorisation;
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
