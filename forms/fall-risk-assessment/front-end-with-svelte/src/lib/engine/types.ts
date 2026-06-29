// ──────────────────────────────────────────────
// Core assessment data types
// ──────────────────────────────────────────────

export type YesNo = 'yes' | 'no' | '';
export type Sex = 'male' | 'female' | 'other' | '';

export interface Demographics {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	sex: Sex;
	age: number | null;
	careSetting: string;
	primaryDiagnosis: string;
}

export interface FallHistory {
	hasFallenInPastYear: YesNo;
	numberOfFallsPastYear: number | null;
	lastFallDate: string;
	mostRecentFallInjurious: YesNo;
	mostRecentFallInjuryDetails: string;
	recurrentFallsWithInjury: YesNo;
	fearOfFalling: YesNo;
	fallCircumstances: string;
}

/**
 * Morse Fall Scale (MFS) responses. Each value is the integer score selected
 * for that item (`0` = no/none; `null` = not yet answered).
 */
export interface MorseFallScale {
	historyOfFalling: number | null; // 0 or 25
	secondaryDiagnosis: number | null; // 0 or 15
	ambulatoryAid: number | null; // 0, 15, or 30
	ivOrHeparinLock: number | null; // 0 or 20
	gaitTransferring: number | null; // 0, 10, or 20
	mentalStatus: number | null; // 0 or 15
}

export interface MobilityGait {
	mobilityLevel: string;
	assistiveDeviceUsed: string;
	unsteadyGait: YesNo;
	difficultyRisingFromChair: YesNo;
	balanceImpairment: YesNo;
	weaknessLowerExtremity: YesNo;
	orthostaticHypotension: YesNo;
	orthostaticHypotensionSevere: YesNo;
	timedUpAndGoSeconds: string;
	mobilityNotes: string;
}

export interface Medication {
	name: string;
	dose: string;
	frequency: string;
}

export interface MedicationReview {
	medications: Medication[];
	polypharmacy: YesNo;
	sedativesOrHypnotics: YesNo;
	antihypertensives: YesNo;
	diuretics: YesNo;
	anticoagulants: YesNo;
	opioids: YesNo;
	antidepressants: YesNo;
	antipsychotics: YesNo;
	recentMedicationChange: YesNo;
	medicationNotes: string;
}

export interface VisionSensory {
	visionImpairment: YesNo;
	visionCorrected: YesNo;
	hearingImpairment: YesNo;
	peripheralNeuropathy: YesNo;
	cataracts: YesNo;
	glaucoma: YesNo;
	macularDegeneration: YesNo;
	visionLastChecked: string;
	sensoryNotes: string;
}

export interface EnvironmentalAssessment {
	loosThrowRugs: YesNo;
	clutteredWalkways: YesNo;
	poorLighting: YesNo;
	stairsWithoutHandrails: YesNo;
	bathroomGrabBarsAbsent: YesNo;
	unsuitableFootwear: YesNo;
	bedHeightProblem: YesNo;
	hipProtectorsUsed: YesNo;
	environmentalNotes: string;
}

export interface CognitiveAssessment {
	dementiaDiagnosis: YesNo;
	confusionOrDisorientation: YesNo;
	impulsivity: YesNo;
	overestimatesAbility: YesNo;
	delirium: YesNo;
	cognitiveScreenTool: string;
	cognitiveScreenScore: string;
	cognitiveNotes: string;
}

export interface PreviousInterventions {
	fallsClinicReferral: YesNo;
	physiotherapyProvided: YesNo;
	occupationalTherapyProvided: YesNo;
	medicationReviewCompleted: YesNo;
	homeSafetyAssessment: YesNo;
	interventionDeclined: YesNo;
	missedReferral: YesNo;
	interventionNotes: string;
}

export interface FallPreventionPlan {
	bedAlarm: YesNo;
	chairAlarm: YesNo;
	nonSlipFootwear: YesNo;
	hipProtectorsRecommended: YesNo;
	exerciseProgramme: YesNo;
	vitaminDSupplement: YesNo;
	environmentalModifications: YesNo;
	medicationDeprescribing: YesNo;
	carerEducationProvided: YesNo;
	planNotes: string;
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

export interface AssessmentData {
	demographics: Demographics;
	fallHistory: FallHistory;
	mfs: MorseFallScale;
	mobilityGait: MobilityGait;
	medicationReview: MedicationReview;
	visionSensory: VisionSensory;
	environmental: EnvironmentalAssessment;
	cognitive: CognitiveAssessment;
	previousInterventions: PreviousInterventions;
	preventionPlan: FallPreventionPlan;
}

// ──────────────────────────────────────────────
// Fall-risk grading types
// ──────────────────────────────────────────────

/** Morse Fall Scale severity bands, with a Critical override. */
export type Severity = 'low' | 'moderate' | 'high' | 'critical';

/** A single Morse Fall Scale item plus its selectable scored options. */
export interface MfsOption {
	score: number;
	label: string;
}

export interface MfsItem {
	id: string;
	field: keyof MorseFallScale;
	label: string;
	description: string;
	options: MfsOption[];
}

/** An MFS item that contributed to the total score. */
export interface FiredRule {
	id: string;
	category: string;
	description: string;
	score: number;
}

export interface AdditionalFlag {
	id: string;
	category: string;
	message: string;
	priority: 'high' | 'medium' | 'low';
}

export interface GradingResult {
	mfsScore: number;
	severity: Severity;
	criticalOverride: boolean;
	criticalReasons: string[];
	answeredCount: number;
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
