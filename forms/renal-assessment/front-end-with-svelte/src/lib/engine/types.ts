// ──────────────────────────────────────────────
// Core assessment data types
// ──────────────────────────────────────────────

export type YesNo = 'yes' | 'no' | '';
export type Sex = 'male' | 'female' | 'other' | '';
export type SmokingStatus = 'current' | 'ex' | 'never' | '';

/** KDIGO composite risk level (GFR × Albuminuria heatmap). */
export type RiskLevel = 'low' | 'moderate' | 'high' | 'very-high' | 'unknown';
/** KDIGO GFR category (G1–G5). */
export type GfrCategory = 'G1' | 'G2' | 'G3a' | 'G3b' | 'G4' | 'G5' | '';
/** KDIGO albuminuria category (A1–A3). */
export type AlbuminuriaCategory = 'A1' | 'A2' | 'A3' | '';

export interface Demographics {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	sex: Sex;
	ethnicity: string;
	age: number | null;
	weight: number | null;
	height: number | null;
	bmi: number | null;
}

export interface PresentingSymptoms {
	fatigue: YesNo;
	edema: YesNo;
	foamyUrine: YesNo;
	nocturia: YesNo;
	hematuria: YesNo;
	flankPain: YesNo;
	reducedUrineOutput: YesNo;
	pruritus: YesNo;
	nauseaVomiting: YesNo;
	appetiteLoss: YesNo;
	dyspnea: YesNo;
	confusion: YesNo;
	symptomDuration: string;
	otherSymptoms: string;
}

export interface CKDRiskFactors {
	hypertension: YesNo;
	diabetes: YesNo;
	diabetesType: string;
	cardiovascularDisease: YesNo;
	familyHistoryCkd: YesNo;
	familyHistoryPolycysticKidney: YesNo;
	priorAki: YesNo;
	kidneyStones: YesNo;
	recurrentUti: YesNo;
	autoimmuneDisease: YesNo;
	autoimmuneDetails: string;
	nephrotoxicDrugs: YesNo;
	nephrotoxicDrugDetails: string;
	nsaidUse: YesNo;
	smoking: SmokingStatus;
	obesity: YesNo;
}

export interface PhysicalExamination {
	systolicBp: number | null;
	diastolicBp: number | null;
	heartRate: number | null;
	peripheralEdema: YesNo;
	pulmonaryEdema: YesNo;
	jvdElevated: YesNo;
	pallor: YesNo;
	uremicSkin: YesNo;
	flankTenderness: YesNo;
	palpableKidneys: YesNo;
	bladderDistension: YesNo;
	examNotes: string;
}

export interface BloodTests {
	serumCreatinine: number | null;
	egfr: number | null;
	bun: number | null;
	sodium: number | null;
	potassium: number | null;
	chloride: number | null;
	bicarbonate: number | null;
	calcium: number | null;
	phosphate: number | null;
	magnesium: number | null;
	albumin: number | null;
	hemoglobin: number | null;
	hba1c: number | null;
	pth: number | null;
	vitaminD: number | null;
	testDate: string;
}

export interface UrineTests {
	acr: number | null;
	pcr: number | null;
	dipstickProtein: string;
	dipstickBlood: string;
	dipstickGlucose: string;
	dipstickLeukocytes: string;
	dipstickNitrites: string;
	microscopyCasts: YesNo;
	castType: string;
	testDate: string;
}

export interface ImagingBiopsy {
	renalUltrasoundDone: YesNo;
	ultrasoundFindings: string;
	rightKidneyLengthMm: number | null;
	leftKidneyLengthMm: number | null;
	cysts: YesNo;
	hydronephrosis: YesNo;
	stones: YesNo;
	ctOrMri: YesNo;
	ctMriFindings: string;
	biopsyDone: YesNo;
	biopsyResult: string;
	biopsyDate: string;
}

export interface Medication {
	name: string;
	dose: string;
	frequency: string;
}

export interface MedicationReview {
	currentMedications: Medication[];
	aceiArb: YesNo;
	sglt2Inhibitor: YesNo;
	diuretic: YesNo;
	statin: YesNo;
	phosphateBinder: YesNo;
	erythropoietinAgent: YesNo;
	doseAdjustmentsNeeded: YesNo;
	doseAdjustmentDetails: string;
	contrastImagingPlanned: YesNo;
	medicationNotes: string;
}

export interface ClinicalImpression {
	gfrCategory: GfrCategory;
	albuminuriaCategory: AlbuminuriaCategory;
	suspectedEtiology: string;
	aksuperimposedOnCkd: YesNo;
	nephrologyReferral: YesNo;
	referralUrgency: string;
	dialysisDiscussionNeeded: YesNo;
	transplantCandidate: YesNo;
	managementPlan: string;
	followUpInterval: string;
	clinicianNotes: string;
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

export interface AssessmentData {
	demographics: Demographics;
	presentingSymptoms: PresentingSymptoms;
	ckdRiskFactors: CKDRiskFactors;
	physicalExamination: PhysicalExamination;
	bloodTests: BloodTests;
	urineTests: UrineTests;
	imagingBiopsy: ImagingBiopsy;
	medicationReview: MedicationReview;
	clinicalImpression: ClinicalImpression;
}

// ──────────────────────────────────────────────
// KDIGO grading types
// ──────────────────────────────────────────────

export interface KdigoRule {
	id: string;
	category: string;
	description: string;
	evaluate: (data: AssessmentData) => string;
}

export interface FiredRule {
	id: string;
	category: string;
	description: string;
	value: string;
}

export interface AdditionalFlag {
	id: string;
	category: string;
	message: string;
	priority: 'urgent' | 'high' | 'medium' | 'low';
}

export interface GradingResult {
	gfrCategory: GfrCategory;
	albuminuriaCategory: AlbuminuriaCategory;
	riskLevel: RiskLevel;
	egfr: number | null;
	acr: number | null;
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
