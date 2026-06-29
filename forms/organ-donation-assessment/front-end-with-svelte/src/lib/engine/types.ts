// ──────────────────────────────────────────────
// Core assessment data types
// ──────────────────────────────────────────────

export type YesNo = 'yes' | 'no' | '';
export type Sex = 'male' | 'female' | 'other' | '';
export type DonorType = 'living' | 'deceased' | '';
export type ScreenResult = 'negative' | 'positive' | 'pending' | '';
export type CompatibilityResult = 'compatible' | 'incompatible' | 'pending' | '';
export type NormalAbnormal = 'normal' | 'abnormal' | 'pending' | '';

/** Final donor eligibility classification. */
export type Eligibility = 'suitable' | 'conditionally-suitable' | 'unsuitable';
/** Donor risk classification. */
export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

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

export interface DonorTypeRegistration {
	donorType: DonorType;
	registeredOnDonorRegister: YesNo;
	registryName: string;
	registrationDate: string;
	recipientRelationship: string;
	recipientName: string;
	previousDonation: YesNo;
	previousDonationDetails: string;
	intendedOrgans: string;
}

export interface MedicalHistory {
	hasMalignancy: YesNo;
	malignancyDetails: string;
	hasCnsMalignancy: YesNo;
	hasAutoimmuneDisease: YesNo;
	autoimmuneDetails: string;
	hasDiabetes: YesNo;
	diabetesDetails: string;
	hasHypertension: YesNo;
	hypertensionDetails: string;
	hasCardiovascularDisease: YesNo;
	cardiovascularDetails: string;
	hasActiveInfection: YesNo;
	activeInfectionDetails: string;
	hasUncontrolledSepsis: YesNo;
	hasCjdRisk: YesNo;
	cjdDetails: string;
	ivDrugUseHistory: YesNo;
	currentMedications: string;
	previousSurgery: YesNo;
	surgeryDetails: string;
}

export interface OrganFunction {
	creatinine: number | null;
	egfr: number | null;
	kidneyImaging: NormalAbnormal;
	kidneyNotes: string;
	alt: number | null;
	ast: number | null;
	bilirubin: number | null;
	liverImaging: NormalAbnormal;
	liverNotes: string;
	ejectionFraction: number | null;
	echocardiogram: NormalAbnormal;
	cardiacNotes: string;
	pao2Fio2Ratio: number | null;
	chestImaging: NormalAbnormal;
	pulmonaryNotes: string;
	fastingGlucose: number | null;
	hba1c: number | null;
	pancreaticNotes: string;
	severeOrganFailure: YesNo;
	severeOrganFailureDetails: string;
}

export interface InfectiousDiseaseScreening {
	hivStatus: ScreenResult;
	hbsAg: ScreenResult;
	hbcAb: ScreenResult;
	hcvAb: ScreenResult;
	htlvStatus: ScreenResult;
	cmvStatus: ScreenResult;
	ebvStatus: ScreenResult;
	syphilisScreen: ScreenResult;
	toxoplasmaStatus: ScreenResult;
	tuberculosisScreen: ScreenResult;
	recentTravel: YesNo;
	travelDetails: string;
	recentInfection: YesNo;
	infectionDetails: string;
}

export interface ImmunologicalAssessment {
	donorBloodGroup: string;
	recipientBloodGroup: string;
	aboCompatibility: CompatibilityResult;
	hlaA: string;
	hlaB: string;
	hlaC: string;
	hlaDr: string;
	hlaDq: string;
	hlaDp: string;
	hlaMatchLevel: string;
	crossmatchResult: CompatibilityResult;
	pra: number | null;
	donorSpecificAntibodies: YesNo;
	dsaDetails: string;
}

export interface SurgicalAssessment {
	asaGrade: 'I' | 'II' | 'III' | 'IV' | 'V' | '';
	previousAnaesthetic: YesNo;
	anaestheticComplications: YesNo;
	complicationDetails: string;
	mallampatiScore: 'I' | 'II' | 'III' | 'IV' | '';
	airwayConcerns: YesNo;
	airwayDetails: string;
	surgicalFitness: NormalAbnormal;
	surgicalFitnessNotes: string;
	plannedProcedure: string;
	smokingStatus: 'current' | 'ex' | 'never' | '';
	alcoholUse: 'none' | 'occasional' | 'moderate' | 'heavy' | '';
}

export interface PsychologicalAssessment {
	mentalCapacityConfirmed: YesNo;
	understandsProcedure: YesNo;
	understandsRisks: YesNo;
	voluntaryDecision: YesNo;
	coercionConcerns: YesNo;
	coercionDetails: string;
	ambivalence: YesNo;
	ambivalenceDetails: string;
	anxietyAboutProcedure: 'none' | 'mild' | 'moderate' | 'severe' | '';
	previousPsychologicalIssues: YesNo;
	psychologicalIssueDetails: string;
	supportNetwork: YesNo;
	willingToProceed: YesNo;
}

export interface EthicalLegalRequirements {
	htaAct2004Compliant: YesNo;
	independentAssessorReview: YesNo;
	independentAssessorName: string;
	independentAssessorDate: string;
	informedConsentGiven: YesNo;
	consentFormSigned: YesNo;
	consentDate: string;
	witnessName: string;
	witnessRole: string;
	informationLeafletProvided: YesNo;
	questionsAnswered: YesNo;
	financialRewardCheck: YesNo;
	ethicsCommitteeApproval: YesNo;
	ethicsApprovalReference: string;
}

export interface EligibilityAllocation {
	eligibilityDecision: Eligibility | '';
	eligibilityConditions: string;
	deferralReason: string;
	deferralDuration: 'temporary' | 'permanent' | '';
	allocatedOrgans: string;
	intendedRecipientCentre: string;
	assessorName: string;
	assessorRole: string;
	assessmentDate: string;
	additionalNotes: string;
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

export interface AssessmentData {
	demographics: Demographics;
	donorTypeRegistration: DonorTypeRegistration;
	medicalHistory: MedicalHistory;
	organFunction: OrganFunction;
	infectiousDiseaseScreening: InfectiousDiseaseScreening;
	immunologicalAssessment: ImmunologicalAssessment;
	surgicalAssessment: SurgicalAssessment;
	psychologicalAssessment: PsychologicalAssessment;
	ethicalLegalRequirements: EthicalLegalRequirements;
	eligibilityAllocation: EligibilityAllocation;
}

// ──────────────────────────────────────────────
// Donor grading types
// ──────────────────────────────────────────────

export interface DonorRule {
	id: string;
	category: string;
	description: string;
	grade: number;
	evaluate: (data: AssessmentData) => boolean;
}

export interface FiredRule {
	id: string;
	category: string;
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
	eligibility: Eligibility;
	suggestedEligibility: Eligibility;
	riskLevel: RiskLevel;
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
	livingDonorOnly?: boolean;
}
