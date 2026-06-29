// ──────────────────────────────────────────────
// Core assessment data types
// ──────────────────────────────────────────────

export type YesNo = 'yes' | 'no' | '';
export type Sex = 'male' | 'female' | 'other' | '';
export type Severity = 'mild' | 'moderate' | 'severe' | 'critical';

export type CognitiveImpairment = 'none' | 'mild' | 'moderate' | 'severe' | '';
export type DementiaStage = 'normal' | 'mild' | 'moderate' | 'severe' | '';
export type EpisodeFrequency = 'none' | 'occasional' | 'frequent' | 'continuous' | '';
export type Adherence = 'good' | 'partial' | 'poor' | '';
export type CarerStrain = 'none' | 'minimal' | 'moderate' | 'severe' | '';

export interface Demographics {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	sex: Sex;
	ageYears: number | null;
	primaryDiagnosis: string;
	careSetting: string;
}

export interface CognitiveStatus {
	dementiaStage: DementiaStage;
	cognitiveImpairment: CognitiveImpairment;
	mmseScore: number | null;
	mmseDate: string;
	priorDeliriumHistory: YesNo;
	cognitiveNotes: string;
}

/** Map of CMAI item id (`cmai01`..`cmai29`) -> 1..7 score. 0 means unanswered. */
export type CMAIResponses = Record<string, number>;

/** A single NPI domain rating: frequency 0..4, severity 0..3 (0 = unanswered). */
export interface NPIDomainScore {
	frequency: number;
	severity: number;
}

/** Map of NPI domain key -> { frequency, severity }. */
export type NPIResponses = Record<string, NPIDomainScore>;

export interface BehaviouralSymptoms {
	cmai: CMAIResponses;
	npi: NPIResponses;
	behaviouralNotes: string;
}

export interface TemporalPattern {
	typicalOnsetTime: string;
	typicalOffsetTime: string;
	peakTime: string;
	episodeFrequency: EpisodeFrequency;
	averageDurationMinutes: number | null;
	worseAtDusk: YesNo;
	worseSeasonally: YesNo;
	temporalNotes: string;
}

export interface TriggerIdentification {
	fatigue: YesNo;
	hunger: YesNo;
	pain: YesNo;
	infection: YesNo;
	dehydration: YesNo;
	sensoryOverload: YesNo;
	unfamiliarSurroundings: YesNo;
	carerChange: YesNo;
	lowLight: YesNo;
	medicationTiming: YesNo;
	otherTriggers: string;
}

export interface SleepWakeCycle {
	bedtimeHourClock: number | null;
	averageHoursOfSleep: number | null;
	difficultyFallingAsleep: YesNo;
	nighttimeWandering: YesNo;
	earlyMorningWaking: YesNo;
	daytimeNapping: YesNo;
	nightAwakeningCount: number | null;
	reversedSleepCycle: YesNo;
	sleepNotes: string;
}

export interface MedicationItem {
	name: string;
	dose: string;
	frequency: string;
	indication: string;
}

export interface MedicationReview {
	currentMedications: MedicationItem[];
	anticholinergicBurden: YesNo;
	sedativeUse: YesNo;
	antipsychoticUse: YesNo;
	recentMedicationChange: YesNo;
	recentMedicationChangeDetails: string;
	medicationAdherence: Adherence;
	medicationNotes: string;
}

export interface EnvironmentalAssessment {
	adequateDaylight: YesNo;
	excessiveNoise: YesNo;
	unfamiliarEnvironment: YesNo;
	cluttered: YesNo;
	mirrorsOrShadows: YesNo;
	consistentRoutine: YesNo;
	adequateSocialContact: YesNo;
	environmentalNotes: string;
}

export interface CarerImpact {
	primaryCarer: string;
	carerRelationship: string;
	carerStrainLevel: CarerStrain;
	carerSleepDisturbed: YesNo;
	carerBurnoutSigns: YesNo;
	respiteCareInPlace: YesNo;
	formalSupportEngaged: YesNo;
	carerNotes: string;
}

export interface ManagementPlan {
	nonPharmacologicalPlan: YesNo;
	nonPharmacologicalDetails: string;
	environmentalModifications: YesNo;
	environmentalModificationDetails: string;
	medicationReviewRequired: YesNo;
	referralRequired: YesNo;
	referralDetails: string;
	reviewDate: string;
	planSummary: string;
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

export interface AssessmentData {
	demographics: Demographics;
	cognitiveStatus: CognitiveStatus;
	behaviouralSymptoms: BehaviouralSymptoms;
	temporalPattern: TemporalPattern;
	triggerIdentification: TriggerIdentification;
	sleepWakeCycle: SleepWakeCycle;
	medicationReview: MedicationReview;
	environmentalAssessment: EnvironmentalAssessment;
	carerImpact: CarerImpact;
	managementPlan: ManagementPlan;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

export interface FiredRule {
	id: string;
	category: string;
	description: string;
	detail: string;
}

export interface AdditionalFlag {
	id: string;
	category: string;
	message: string;
	priority: 'high' | 'medium' | 'low';
}

/** Per-domain NPI breakdown returned by the grader. */
export interface NPIDomainResult {
	key: string;
	label: string;
	score: number;
	frequency: number;
	severity: number;
}

export interface GradingResult {
	cmaiScore: number;
	npiScore: number;
	severity: Severity;
	cmaiAnsweredCount: number;
	npiAnsweredCount: number;
	npiPerDomain: NPIDomainResult[];
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
