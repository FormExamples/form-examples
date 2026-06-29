// ──────────────────────────────────────────────
// Core assessment data types — Sports Medicine
// Pre-Participation Physical Evaluation (PPE 5th ed.)
// ──────────────────────────────────────────────

export type Sex = 'male' | 'female' | 'other' | '';
export type YesNo = 'yes' | 'no' | 'unknown' | '';

/**
 * Sport contact level: low (e.g. archery, golf), moderate (e.g. baseball,
 * soccer), high (e.g. football, rugby, MMA, ice hockey).
 */
export type ContactLevel = 'low' | 'moderate' | 'high' | '';

/** PPE clearance decision. */
export type Clearance = 'cleared' | 'conditional' | 'pending' | 'not-cleared' | '';

/** Rule grade: 1=info, 2=conditional, 3=pending, 4=not-cleared. */
export type RuleGrade = 1 | 2 | 3 | 4;

export interface Demographics {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	sex: Sex;
	weight: number | null;
	height: number | null;
	bmi: number | null;
	emergencyContactName: string;
	emergencyContactPhone: string;
}

export interface SportPositionDetails {
	primarySport: string;
	primaryPosition: string;
	contactLevel: ContactLevel;
	secondarySports: string;
	competitiveLevel: 'recreational' | 'school' | 'club' | 'elite' | '';
	hoursPerWeek: number | null;
	previousClearanceIssue: YesNo;
	previousClearanceDetails: string;
}

export interface MedicalHistory {
	chronicIllness: YesNo;
	chronicIllnessDetails: string;
	currentMedications: YesNo;
	currentMedicationDetails: string;
	allergiesKnown: YesNo;
	allergyDetails: string;
	priorSurgery: YesNo;
	priorSurgeryDetails: string;
	hospitalisedLastYear: YesNo;
	asthmaOrExerciseInducedBronchospasm: YesNo;
	diabetes: YesNo;
	sickleCellTraitOrDisease: YesNo;
	heatIllnessHistory: YesNo;
	eatingDisorderHistory: YesNo;
}

export interface FamilyHistory {
	suddenCardiacDeathUnder50: YesNo;
	suddenCardiacDeathRelation: string;
	hypertrophicCardiomyopathy: YesNo;
	marfanSyndrome: YesNo;
	longQTSyndrome: YesNo;
	arrhythmiaOrPacemaker: YesNo;
	unexplainedSeizureOrFainting: YesNo;
}

export interface MenstrualHistoryREDS {
	/** False if sex is not female. */
	applicable: boolean;
	ageAtMenarche: number | null;
	regularPeriods: YesNo;
	amenorrhoeaSixMonths: YesNo;
	cyclesLast12Months: number | null;
	restrictiveEatingPattern: YesNo;
	stressFractureHistory: YesNo;
	lowEnergyAvailabilityConcern: YesNo;
}

export interface CardiovascularScreening {
	chestPainWithExertion: YesNo;
	unexplainedSyncope: YesNo;
	excessiveBreathlessness: YesNo;
	palpitationsOrIrregularBeat: YesNo;
	highBloodPressureDiagnosis: YesNo;
	heartMurmurDetected: YesNo;
	restrictedActivityForHeart: YesNo;
	restingSystolic: number | null;
	restingDiastolic: number | null;
	restingHeartRate: number | null;
}

export interface MusculoskeletalScreening {
	uncorrectedMajorInjury: YesNo;
	majorInjuryDetails: string;
	jointInstability: YesNo;
	jointInstabilityDetails: string;
	ongoingPainOrSwelling: YesNo;
	chronicJointDisease: YesNo;
	useBraceOrAssistiveDevice: YesNo;
	fullRangeOfMotion: YesNo;
	normalStrengthBilateral: YesNo;
}

export interface NeurologicalConcussionBaseline {
	totalConcussions: number | null;
	concussionLastSixMonths: YesNo;
	mostRecentConcussionDate: string;
	ongoingPostConcussiveSymptoms: YesNo;
	historyOfSeizures: YesNo;
	/** Stinger or burner (cervical nerve traction injury). */
	stinger: YesNo;
	historyOfHeadOrNeckSurgery: YesNo;
	baselineHeadachesOrMigraine: YesNo;
}

export interface VisionSkin {
	correctiveLensesWorn: YesNo;
	/** Vision in only one eye. */
	monocularAthlete: YesNo;
	protectiveEyewearAvailable: YesNo;
	activeSkinInfection: YesNo;
	activeSkinInfectionDetails: string;
	herpesGladiatorum: YesNo;
	impetigoOrMRSA: YesNo;
	openWoundsOrLesions: YesNo;
}

export interface ClearanceDecision {
	/** Clinician's draft decision. */
	preferredClearance: Clearance;
	clearanceConditions: string;
	followUpRequired: string;
	clinicianName: string;
	clinicianSignatureDate: string;
	additionalNotes: string;
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

export interface AssessmentData {
	demographics: Demographics;
	sportPositionDetails: SportPositionDetails;
	medicalHistory: MedicalHistory;
	familyHistory: FamilyHistory;
	menstrualHistoryREDS: MenstrualHistoryREDS;
	cardiovascularScreening: CardiovascularScreening;
	musculoskeletalScreening: MusculoskeletalScreening;
	neurologicalConcussionBaseline: NeurologicalConcussionBaseline;
	visionSkin: VisionSkin;
	clearanceDecision: ClearanceDecision;
}

// ──────────────────────────────────────────────
// PPE grading types
// ──────────────────────────────────────────────

export interface PPERule {
	id: string;
	category: string;
	description: string;
	grade: RuleGrade;
	fires: (data: AssessmentData) => boolean;
}

export interface FiredRule {
	id: string;
	category: string;
	description: string;
	grade: RuleGrade;
}

export interface AdditionalFlag {
	id: string;
	category: string;
	message: string;
	priority: 'high' | 'medium' | 'low';
}

export interface GradingResult {
	clearance: Clearance;
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
