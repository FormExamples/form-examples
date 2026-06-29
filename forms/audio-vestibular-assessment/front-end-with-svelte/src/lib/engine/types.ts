// ──────────────────────────────────────────────
// Core assessment data types
// ──────────────────────────────────────────────
//
// Audio-Vestibular Assessment — combined audiology and vestibular (balance)
// evaluation. Nine sections; two independent scoring instruments:
//
//   1. WHO pure-tone audiometry hearing-loss grade (better-ear 4-frequency PTA).
//   2. Dizziness Handicap Inventory (DHI) — 25-item self-report instrument.
//
// Conventions:
//   - Empty string '' for unanswered text / enum fields.
//   - null for unanswered numeric fields.
//   - DHI items take 'yes' (4 pts), 'sometimes' (2 pts), 'no' (0 pts), or ''.

export type Sex = 'male' | 'female' | 'other' | '';
export type YesNo = 'yes' | 'no' | '';
export type Side = 'right' | 'left' | 'both' | '';
export type DhiAnswer = 'yes' | 'sometimes' | 'no' | '';

export type HearingLossGrade =
	| 'normal'
	| 'mild'
	| 'moderate'
	| 'moderately-severe'
	| 'severe'
	| 'profound'
	| 'unknown';

export type DhiHandicapLevel = 'no-handicap' | 'mild' | 'moderate' | 'severe';

export interface Demographics {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	sex: Sex;
	assessmentDate: string;
}

export interface PresentingSymptoms {
	hearingLoss: YesNo;
	hearingLossSide: Side;
	hearingLossOnset: 'sudden' | 'gradual' | 'fluctuating' | '';
	hearingLossDurationMonths: number | null;
	tinnitus: YesNo;
	tinnitusSide: Side;
	otalgia: YesNo;
	otorrhea: YesNo;
	auralFullness: YesNo;
	vertigo: YesNo;
	vertigoCharacter: 'spinning' | 'rocking' | 'lightheaded' | 'imbalance' | '';
	vertigoEpisodeDurationSeconds: number | null;
	vertigoFrequencyPerWeek: number | null;
	imbalance: YesNo;
	falls: YesNo;
	fallsLastYearCount: number | null;
	headacheMigraine: YesNo;
	neurologicalSymptoms: YesNo;
	otherSymptoms: string;
}

export type CanalStatus = 'clear' | 'wax' | 'debris' | 'edema' | 'otorrhea' | '';
export type TympanicMembrane =
	| 'intact'
	| 'retracted'
	| 'bulging'
	| 'perforation'
	| 'effusion'
	| 'tube'
	| 'scarred'
	| '';

export interface OtoscopicEar {
	canalStatus: CanalStatus;
	tympanicMembrane: TympanicMembrane;
}

export interface OtoscopicExamination {
	rightEar: OtoscopicEar;
	leftEar: OtoscopicEar;
	notes: string;
}

export interface EarThresholds {
	hz500: number | null;
	hz1000: number | null;
	hz2000: number | null;
	hz4000: number | null;
}

export interface PtaEar {
	airConduction: EarThresholds;
	boneConduction: EarThresholds;
	pureToneAverage: number | null;
}

export interface PureToneAudiometry {
	rightEar: PtaEar;
	leftEar: PtaEar;
	betterEarPureToneAverage: number | null;
	asymmetryDb: number | null;
	audiometryNotes: string;
}

export interface SpeechAudiometry {
	rightSrtDb: number | null;
	leftSrtDb: number | null;
	rightWordRecognitionPercent: number | null;
	leftWordRecognitionPercent: number | null;
	speechAudiometryNotes: string;
}

export type Tympanogram = 'A' | 'As' | 'Ad' | 'B' | 'C' | '';
export type AcousticReflexes = 'present' | 'absent' | 'partial' | '';

export interface TympanometryAcousticReflexes {
	rightTympanogram: Tympanogram;
	leftTympanogram: Tympanogram;
	rightAcousticReflexes: AcousticReflexes;
	leftAcousticReflexes: AcousticReflexes;
	notes: string;
}

export interface VestibularScreening {
	headImpulseTest: 'normal' | 'abnormal-right' | 'abnormal-left' | 'not-done' | '';
	dixHallpike: 'negative' | 'positive-right' | 'positive-left' | 'bilateral' | 'not-done' | '';
	rombergTest: 'normal' | 'abnormal' | 'unable' | '';
	tandemGait: 'normal' | 'abnormal' | 'unable' | '';
	nystagmus: 'none' | 'spontaneous' | 'gaze-evoked' | 'positional' | '';
	fukudaSteppingTest: 'normal' | 'rotation-right' | 'rotation-left' | 'not-done' | '';
	notes: string;
}

/** The 25 DHI items, keyed `q1`…`q25`. */
export type DizzinessHandicapInventory = Record<string, DhiAnswer>;

export interface ClinicalImpressionReferral {
	provisionalDiagnosis: string;
	hearingAidCandidate: 'yes' | 'no' | 'already-fitted' | '';
	vestibularRehabIndicated: YesNo;
	ent_referral: YesNo;
	neurologyReferral: YesNo;
	imagingRequested: 'mri' | 'ct' | 'none' | '';
	followUpWeeks: number | null;
	additionalNotes: string;
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

export interface AssessmentData {
	demographics: Demographics;
	presentingSymptoms: PresentingSymptoms;
	otoscopicExamination: OtoscopicExamination;
	pureToneAudiometry: PureToneAudiometry;
	speechAudiometry: SpeechAudiometry;
	tympanometryAcousticReflexes: TympanometryAcousticReflexes;
	vestibularScreening: VestibularScreening;
	dizzinessHandicapInventory: DizzinessHandicapInventory;
	clinicalImpressionReferral: ClinicalImpressionReferral;
}

// ──────────────────────────────────────────────
// DHI item registry
// ──────────────────────────────────────────────

export type DhiSubscale = 'F' | 'E' | 'P';

export interface DhiItem {
	num: number;
	subscale: DhiSubscale;
	text: string;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

export interface DhiFiredItem {
	id: string;
	num: number;
	subscale: DhiSubscale;
	text: string;
	answer: DhiAnswer;
	score: number;
}

export interface AdditionalFlag {
	id: string;
	category: string;
	message: string;
	priority: 'urgent' | 'high' | 'medium' | 'low';
}

export interface GradingResult {
	// Pure-tone audiometry
	rightPta: number | null;
	leftPta: number | null;
	betterEarPta: number | null;
	asymmetry: number | null;
	hearingLossGrade: HearingLossGrade;
	rightHearingLossGrade: HearingLossGrade;
	leftHearingLossGrade: HearingLossGrade;
	// Dizziness Handicap Inventory
	dhiTotal: number;
	dhiAnsweredCount: number;
	dhiFunctional: number;
	dhiEmotional: number;
	dhiPhysical: number;
	dhiHandicapLevel: DhiHandicapLevel;
	dhiFiredItems: DhiFiredItem[];
	// Flags
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
