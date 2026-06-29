// ──────────────────────────────────────────────
// Core assessment data types
// ──────────────────────────────────────────────

export type YesNo = 'yes' | 'no' | '';
export type Sex = 'male' | 'female' | 'other' | '';
export type SmokingStatus = 'current' | 'ex' | 'never' | '';

/**
 * Per-axis endocrine disturbance status.
 *   normal      – clinical and biochemical indices within reference range
 *   subclinical – biochemical abnormality without symptoms
 *   mild / moderate / severe – progressive symptomatic disturbance
 *   ''          – not assessed (no relevant data provided)
 */
export type AxisStatus = 'normal' | 'subclinical' | 'mild' | 'moderate' | 'severe' | '';

export interface Demographics {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	sex: Sex;
	weight: number | null;
	height: number | null;
	bmi: number | null;
	ethnicity: string;
}

export interface PresentingSymptoms {
	fatigue: YesNo;
	weightChange: YesNo;
	weightChangeDirection: string;
	heatIntolerance: YesNo;
	coldIntolerance: YesNo;
	palpitations: YesNo;
	tremor: YesNo;
	sweating: YesNo;
	polyuria: YesNo;
	polydipsia: YesNo;
	mood: YesNo;
	skinChanges: YesNo;
	hairChanges: YesNo;
	symptomDuration: string;
	otherSymptoms: string;
}

export interface ThyroidAxis {
	tsh: number | null;
	ft4: number | null;
	ft3: number | null;
	antibodiesPositive: YesNo;
	goitre: YesNo;
	familyHistoryThyroid: YesNo;
	thyroidNotes: string;
}

export interface AdrenalAxis {
	morningCortisol: number | null;
	acth: number | null;
	aldosterone: number | null;
	renin: number | null;
	hyperpigmentation: YesNo;
	cushingoidFeatures: YesNo;
	posturalHypotension: YesNo;
	adrenalNotes: string;
}

export interface GlucoseMetabolism {
	hba1c: number | null;
	fastingGlucose: number | null;
	randomGlucose: number | null;
	knownDiabetes: YesNo;
	diabetesType: string;
	hypoglycaemiaEpisodes: YesNo;
	glucoseNotes: string;
}

export interface ReproductiveAxis {
	fsh: number | null;
	lh: number | null;
	testosterone: number | null;
	oestradiol: number | null;
	menstrualIrregularity: YesNo;
	infertility: YesNo;
	libidoChange: YesNo;
	galactorrhoea: YesNo;
	reproductiveNotes: string;
}

export interface PituitaryFunction {
	prolactin: number | null;
	igf1: number | null;
	growthHormone: number | null;
	headaches: YesNo;
	visualDisturbance: YesNo;
	acromegalicFeatures: YesNo;
	pituitaryImagingDone: YesNo;
	pituitaryImagingFindings: string;
	pituitaryNotes: string;
}

export interface BoneCalcium {
	pth: number | null;
	vitaminD: number | null;
	calciumCorrected: number | null;
	phosphate: number | null;
	fragilityFracture: YesNo;
	bonePain: YesNo;
	dexaScanDone: YesNo;
	dexaResult: string;
	boneNotes: string;
}

export interface Medication {
	name: string;
	dose: string;
	frequency: string;
}

export interface MedicationsLifestyle {
	currentMedications: Medication[];
	steroidUse: YesNo;
	steroidDetails: string;
	hormoneTherapy: YesNo;
	hormoneTherapyDetails: string;
	smoking: SmokingStatus;
	alcoholUnits: string;
	exerciseLevel: string;
	dietPattern: string;
	familyHistoryEndocrine: string;
}

export interface ClinicalImpression {
	workingDiagnosis: string;
	differentialDiagnoses: string;
	investigationsRequested: string;
	managementPlan: string;
	followUpPlan: string;
	referralRequired: YesNo;
	referralSpecialty: string;
	clinicianNotes: string;
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

export interface AssessmentData {
	demographics: Demographics;
	presentingSymptoms: PresentingSymptoms;
	thyroidAxis: ThyroidAxis;
	adrenalAxis: AdrenalAxis;
	glucoseMetabolism: GlucoseMetabolism;
	reproductiveAxis: ReproductiveAxis;
	pituitaryFunction: PituitaryFunction;
	boneCalcium: BoneCalcium;
	medicationsLifestyle: MedicationsLifestyle;
	clinicalImpression: ClinicalImpression;
}

// ──────────────────────────────────────────────
// Endocrinology grading types
// ──────────────────────────────────────────────

export interface AxisGrade {
	axis: string;
	status: AxisStatus;
	rationale: string;
	contributingFindings: string[];
}

export interface AxisRule {
	id: string;
	axis: string;
	description: string;
	evaluate: (data: AssessmentData) => { status: AxisStatus; findings: string[] };
}

export interface FiredRule {
	id: string;
	category: string;
	description: string;
	status: AxisStatus;
}

export interface AdditionalFlag {
	id: string;
	category: string;
	message: string;
	priority: 'urgent' | 'high' | 'medium' | 'low';
}

export interface GradingResult {
	axisGrades: AxisGrade[];
	overallStatus: AxisStatus;
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
