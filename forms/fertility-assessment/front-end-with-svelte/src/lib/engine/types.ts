// ──────────────────────────────────────────────
// Core assessment data types
// ──────────────────────────────────────────────

export type YesNo = 'yes' | 'no' | '';
export type Sex = 'female' | 'male' | 'other' | '';
export type CycleRegularity = 'regular' | 'irregular' | 'absent' | '';
export type ConcernLevel = 'low' | 'moderate' | 'high';
export type TobaccoStatus = 'never' | 'former' | 'current' | '';
export type AlcoholLevel = 'none' | 'low' | 'moderate' | 'heavy' | '';
export type CaffeineLevel = 'low' | 'moderate' | 'high' | '';
export type ExerciseFrequency = 'none' | 'low' | 'moderate' | 'high' | '';
export type UltrasoundResult = 'yes-normal' | 'yes-abnormal' | 'no' | '';
export type InvestigationResult = 'normal' | 'abnormal' | '';
export type Recommendation =
	| 'continue-attempts'
	| 'lifestyle-optimisation'
	| 'targeted-treatment'
	| 'specialist-referral'
	| 'art-referral'
	| '';
export type ReferralUrgency = 'routine' | 'soon' | 'urgent' | '';

export interface Demographics {
	patientFirstName: string;
	patientLastName: string;
	patientDateOfBirth: string;
	patientSex: Sex;
	partnerFirstName: string;
	partnerLastName: string;
	partnerDateOfBirth: string;
	partnerSex: Sex;
	relationshipDuration: number | null;
	ethnicity: string;
}

export interface ReproductiveHistory {
	durationTryingMonths: number | null;
	priorPregnancies: number | null;
	priorLiveBirths: number | null;
	priorMiscarriages: number | null;
	priorEctopic: number | null;
	priorTerminations: number | null;
	priorFertilityTreatment: YesNo;
	priorTreatmentDetails: string;
	contraceptionStopped: YesNo;
	contraceptionStoppedDate: string;
}

export interface MenstrualCycle {
	menarcheAge: number | null;
	cycleLengthDays: number | null;
	cycleRegularity: CycleRegularity;
	periodDurationDays: number | null;
	heavyBleeding: YesNo;
	dysmenorrhoea: YesNo;
	intermenstrualBleeding: YesNo;
	lastMenstrualPeriod: string;
	cycleNotes: string;
}

export interface MedicalSurgicalHistory {
	pelvicInflammatoryDisease: YesNo;
	endometriosis: YesNo;
	polycysticOvarySyndrome: YesNo;
	fibroids: YesNo;
	thyroidDisorder: YesNo;
	diabetes: YesNo;
	cancerHistory: YesNo;
	cancerTreatmentDetails: string;
	pelvicSurgery: YesNo;
	pelvicSurgeryDetails: string;
	sexuallyTransmittedInfections: YesNo;
	stiDetails: string;
	otherConditions: string;
}

export interface LifestyleFactors {
	weight: number | null;
	height: number | null;
	bmi: number | null;
	tobaccoStatus: TobaccoStatus;
	cigarettesPerDay: number | null;
	alcoholLevel: AlcoholLevel;
	alcoholUnitsPerWeek: number | null;
	caffeineLevel: CaffeineLevel;
	recreationalDrugs: YesNo;
	recreationalDrugDetails: string;
	exerciseFrequency: ExerciseFrequency;
	occupationalHazards: YesNo;
	occupationalHazardDetails: string;
}

export interface Medication {
	name: string;
	dose: string;
	frequency: string;
}

export interface MedicationsSupplements {
	currentMedications: Medication[];
	folicAcid: YesNo;
	folicAcidDoseMcg: number | null;
	vitaminD: YesNo;
	otherSupplements: string;
}

export interface PartnerSemen {
	partnerAgeYears: number | null;
	partnerSmoking: TobaccoStatus;
	partnerAlcohol: AlcoholLevel;
	partnerOccupationalHazards: string;
	partnerMedicalHistory: string;
	semenAnalysisDone: YesNo;
	semenAnalysisDate: string;
	semenVolumeMl: number | null;
	semenConcentrationMillionPerMl: number | null;
	semenTotalMotilityPercent: number | null;
	semenProgressiveMotilityPercent: number | null;
	semenNormalMorphologyPercent: number | null;
	semenNotes: string;
}

export interface HormoneProfile {
	fsh: number | null;
	lh: number | null;
	amh: number | null;
	oestradiol: number | null;
	tsh: number | null;
	prolactin: number | null;
	testosterone: number | null;
	progesteroneDay21: number | null;
	hormoneTestDate: string;
	hormoneNotes: string;
}

export interface Investigations {
	transvaginalUltrasound: UltrasoundResult;
	antralFollicleCount: number | null;
	hysterosalpingogramDone: YesNo;
	hysterosalpingogramResult: InvestigationResult;
	hysteroscopyDone: YesNo;
	hysteroscopyResult: InvestigationResult;
	laparoscopyDone: YesNo;
	laparoscopyResult: InvestigationResult;
	otherInvestigations: string;
}

export interface ClinicalRecommendation {
	clinicianName: string;
	assessmentDate: string;
	recommendation: Recommendation;
	referralUrgency: ReferralUrgency;
	additionalNotes: string;
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

export interface AssessmentData {
	demographics: Demographics;
	reproductiveHistory: ReproductiveHistory;
	menstrualCycle: MenstrualCycle;
	medicalSurgicalHistory: MedicalSurgicalHistory;
	lifestyleFactors: LifestyleFactors;
	medicationsSupplements: MedicationsSupplements;
	partnerSemen: PartnerSemen;
	hormoneProfile: HormoneProfile;
	investigations: Investigations;
	clinicalRecommendation: ClinicalRecommendation;
}

// ──────────────────────────────────────────────
// Fertility grading types
// ──────────────────────────────────────────────

export type FlagPriority = 'urgent' | 'high' | 'medium' | 'low';

export interface FertilityRule {
	id: string;
	category: string;
	description: string;
	weight: number;
	evaluate: (data: AssessmentData) => boolean;
}

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
	priority: FlagPriority;
}

export interface GradingResult {
	concernScore: number;
	concernLevel: ConcernLevel;
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
