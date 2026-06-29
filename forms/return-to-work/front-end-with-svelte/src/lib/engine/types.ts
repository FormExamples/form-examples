// ──────────────────────────────────────────────
// Core return-to-work data types
// ──────────────────────────────────────────────

export type YesNo = 'yes' | 'no' | '';
export type Sex = 'male' | 'female' | 'other' | '';

export type ClinicianRole =
	| 'gp'
	| 'oh-physician'
	| 'hospital-consultant'
	| 'nurse'
	| 'pharmacist'
	| 'physiotherapist'
	| 'occupational-therapist'
	| '';

export type AbsenceMechanism =
	| 'illness'
	| 'injury'
	| 'surgery'
	| 'mental-health'
	| 'pregnancy-related'
	| 'other'
	| '';

export type RecoveryTrajectory = 'improving' | 'stable' | 'deteriorating' | 'uncertain' | '';

export type FunctionalLevel = 'full' | 'mild' | 'moderate' | 'severe' | '';

export type FitnessOutcome = 'fit' | 'may-be-fit' | 'not-fit' | '';
export type ClinicianConfidence = 'high' | 'medium' | 'low' | '';
export type ReviewClinic = 'gp' | 'oh' | 'specialist' | 'none' | '';

// Computed fitness statement (engine output; never blank).
export type FitnessStatement = 'fit' | 'may-be-fit' | 'not-fit';
// Computed restriction-priority grade (engine output; never blank).
export type RestrictionPriority = 'routine' | 'standard' | 'restricted' | 'high-risk';

export interface Clinician {
	name: string;
	role: ClinicianRole;
	registrationNumber: string;
	site: string;
	signature: string;
	date: string;
}

export interface Patient {
	nhsNumber: string;
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	sex: Sex;
	phone: string;
	email: string;
	employerName: string;
	employerOhContact: string;
}

export interface JobContext {
	jobTitle: string;
	roleDescription: string;
	contractedHours: number | null;
	shiftPattern: string;
	safetyCritical: YesNo;
	dvlaNotifiableRole: YesNo;
	industrySector: string;
}

export interface AbsenceHistory {
	firstDayOfAbsence: string;
	totalDaysAbsent: number | null;
	priorMed3Ref: string;
	previousSelfCertification: YesNo;
}

export interface ReasonForAbsence {
	primaryDiagnosis: string;
	diagnosisCode: string;
	comorbidConditions: string;
	mechanism: AbsenceMechanism;
	workplaceCause: YesNo;
	riddorReference: string;
}

export interface CurrentTreatment {
	currentMedications: string;
	ongoingTherapy: string;
	lastConsultationDate: string;
	recoveryTrajectory: RecoveryTrajectory;
}

export interface FunctionalAssessment {
	mobility: FunctionalLevel;
	manualHandling: FunctionalLevel;
	cognition: FunctionalLevel;
	mood: FunctionalLevel;
	sleep: FunctionalLevel;
	pain: number | null;
	drivingCapacity: YesNo;
	standingTolerance: FunctionalLevel;
	sittingTolerance: FunctionalLevel;
	screenTolerance: FunctionalLevel;
	adlIndependence: YesNo;
}

export interface FitnessStatementInput {
	outcome: FitnessOutcome;
	clinicianConfidence: ClinicianConfidence;
	validFrom: string;
	validTo: string;
	validWeeks: number | null;
	reassessmentRequired: YesNo;
}

export interface PhasedReturn {
	applicable: YesNo;
	startHoursPerWeek: number | null;
	targetFullHoursDate: string;
	daysPerWeek: number | null;
	supportContact: string;
}

export interface Adjustments {
	alteredHours: boolean;
	amendedDuties: boolean;
	workplaceAdaptations: boolean;
	noHeavyLifting: boolean;
	liftingKgLimit: number | null;
	noDriving: boolean;
	noOperatingMachinery: boolean;
	noWorkingAtHeight: boolean;
	noLoneWorking: boolean;
	noNightShifts: boolean;
	noPatientContact: boolean;
	sedentaryOnly: boolean;
	noExposure: string;
	screenBreakFrequency: string;
	workstationReviewRequired: YesNo;
	additionalAdjustments: string;
}

export interface FollowUp {
	reviewClinic: ReviewClinic;
	reviewDate: string;
	ohReferralMade: YesNo;
	dvlaNotificationRequired: YesNo;
	employerOhNotified: YesNo;
}

export interface SignOff {
	clinicianOverride: YesNo;
	overrideOutcome: FitnessOutcome;
	overrideReason: string;
	finalNotes: string;
	signature: string;
}

// ──────────────────────────────────────────────
// Full record data model
// ──────────────────────────────────────────────

export interface AssessmentData {
	clinician: Clinician;
	patient: Patient;
	job: JobContext;
	absence: AbsenceHistory;
	diagnosis: ReasonForAbsence;
	treatment: CurrentTreatment;
	functional: FunctionalAssessment;
	fitness: FitnessStatementInput;
	phasedReturn: PhasedReturn;
	adjustments: Adjustments;
	followUp: FollowUp;
	signOff: SignOff;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/**
 * A restriction rule: maps a fired workplace adjustment to a severity grade
 * (1 routine, 2 standard, 3 restricted, 4 high-risk). The most severe fired
 * rule sets the overall restriction priority (max-grade rule).
 */
export interface RestrictionRule {
	id: string;
	system: string;
	description: string;
	grade: number;
	evaluate: (data: AssessmentData) => boolean;
}

export interface FiredRule {
	id: string;
	system: string;
	description: string;
	grade: number;
}

export interface AdditionalFlag {
	id: string;
	category: string;
	message: string;
	priority: 'high' | 'medium' | 'low';
}

export interface GradingResult {
	/** Final fitness statement (clinician override applied, if any). */
	fitnessStatement: FitnessStatement;
	/** Engine-computed fitness statement before any clinician override. */
	computedFitness: FitnessStatement;
	/** Whether the clinician overrode the computed statement. */
	overridden: boolean;
	restrictionPriority: RestrictionPriority;
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
