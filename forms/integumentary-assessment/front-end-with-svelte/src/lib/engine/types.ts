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
	weight: number | null;
	height: number | null;
	bmi: number | null;
}

export interface PresentingSkinConcern {
	chiefComplaint: string;
	onset: 'sudden' | 'acute' | 'subacute' | 'chronic' | '';
	duration: string;
	location: string;
	pain: YesNo;
	painScore: number | null;
	itching: YesNo;
	bleeding: YesNo;
	discharge: YesNo;
	aggravatingFactors: string;
	relievingFactors: string;
	priorTreatment: string;
}

export interface Lesion {
	site: string;
	type: string;
	size: string;
	description: string;
}

export interface SkinInspection {
	colour: 'normal' | 'pale' | 'flushed' | 'jaundiced' | 'cyanotic' | 'mottled' | '';
	moisture: 'normal' | 'dry' | 'very-dry' | 'moist' | 'diaphoretic' | '';
	integrity: 'intact' | 'fragile' | 'breakdown' | 'open-lesions' | '';
	turgor: 'normal' | 'fair' | 'poor' | 'tenting' | '';
	temperature: 'normal' | 'cool' | 'cold' | 'hot' | '';
	lesionTypes: string[];
	lesions: Lesion[];
	additionalNotes: string;
}

export interface HairScalpExamination {
	hairDistribution: 'normal' | 'thinning' | 'patchy' | 'sparse' | 'hirsutism' | '';
	hairTexture: 'normal' | 'fine' | 'coarse' | 'dry' | 'oily' | '';
	alopecia: YesNo;
	alopeciaPattern: string;
	scalpLesions: YesNo;
	scalpFindings: string[];
	scalpNotes: string;
}

export interface NailExamination {
	nailColour: 'normal-pink' | 'pale' | 'cyanotic' | 'yellow' | 'brown' | '';
	nailShape: 'normal' | 'clubbed' | 'spoon' | 'beau-lines' | 'pitted' | '';
	nailCapillaryRefill: 'brisk' | 'normal' | 'sluggish' | 'absent' | '';
	nailFindings: string[];
	nailNotes: string;
}

export interface WoundAssessment {
	woundPresent: YesNo;
	woundLocation: string;
	woundStage:
		| 'stage-i'
		| 'stage-ii'
		| 'stage-iii'
		| 'stage-iv'
		| 'unstageable'
		| 'deep-tissue-injury'
		| 'non-pressure'
		| '';
	woundLength: number | null;
	woundWidth: number | null;
	woundDepth: number | null;
	tissueType: 'granulation' | 'epithelialising' | 'slough' | 'necrotic' | 'eschar' | 'mixed' | '';
	infectionSigns: YesNo;
	moistureBalance: 'dry' | 'balanced' | 'macerated' | '';
	edgeCondition: 'attached' | 'rolled' | 'undermined' | 'callused' | 'macerated' | '';
	exudateAmount: 'none' | 'minimal' | 'moderate' | 'heavy' | '';
	exudateType: 'serous' | 'sanguineous' | 'serosanguineous' | 'purulent' | '';
	woundOdour: 'none' | 'mild' | 'strong' | 'foul' | '';
	woundNotes: string;
}

export interface BradenScale {
	sensoryPerception: number | null;
	moisture: number | null;
	activity: number | null;
	mobility: number | null;
	nutrition: number | null;
	frictionShear: number | null;
}

export interface Photo {
	site: string;
	date: string;
	reference: string;
}

export interface PhotographyDocumentation {
	consentObtained: YesNo;
	photosTaken: YesNo;
	photos: Photo[];
	documentationNotes: string;
}

export interface ClinicalImpressionCarePlan {
	clinicalImpression: string;
	differentialDiagnoses: string;
	carePlan: string;
	dressingRequired: YesNo;
	dressingType: string;
	pressureReliefRequired: YesNo;
	referralRequired: YesNo;
	referralDetails: string;
	followUpDate: string;
	clinicianName: string;
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

export interface AssessmentData {
	demographics: Demographics;
	presentingSkinConcern: PresentingSkinConcern;
	skinInspection: SkinInspection;
	hairScalpExamination: HairScalpExamination;
	nailExamination: NailExamination;
	woundAssessment: WoundAssessment;
	bradenScale: BradenScale;
	photographyDocumentation: PhotographyDocumentation;
	clinicalImpressionCarePlan: ClinicalImpressionCarePlan;
}

// ──────────────────────────────────────────────
// Integumentary grading types
// ──────────────────────────────────────────────

// Braden Scale pressure-ulcer risk levels (lower total score = higher risk).
export type RiskLevel = 'no-risk' | 'mild-risk' | 'moderate-risk' | 'high-risk' | 'very-high-risk';

export interface BradenRule {
	id: string;
	category: string;
	description: string;
	maxScore: number;
	evaluate: (data: AssessmentData) => number;
}

export interface FiredRule {
	id: string;
	category: string;
	description: string;
	score: number;
	maxScore: number;
}

export interface AdditionalFlag {
	id: string;
	category: string;
	message: string;
	priority: 'urgent' | 'high' | 'medium' | 'low';
}

export interface GradingResult {
	bradenScore: number;
	riskLevel: RiskLevel;
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
