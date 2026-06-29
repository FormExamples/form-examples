// ──────────────────────────────────────────────
// Core assessment data types
//
// Clinical genetics assessment: proband demographics, presenting concern,
// personal medical history, a three-generation family pedigree, ancestry,
// targeted risk scoring (Manchester score for BRCA1/2, Revised Bethesda
// criteria for Lynch syndrome, Tyrer-Cuzick (IBIS) for breast cancer and
// PREMM5 for Lynch), prior genetic testing, patient understanding and the
// clinician's recommendation / referral plan.
// ──────────────────────────────────────────────

export type Sex = 'male' | 'female' | 'other' | '';
export type YesNo = 'yes' | 'no' | '';
export type YesNoUnknown = 'yes' | 'no' | 'unknown' | '';
export type RiskLevel = 'low' | 'moderate' | 'high' | '';
export type ReferralUrgency = 'routine' | 'soon' | 'urgent' | '';

export interface ProbandDemographics {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	sex: Sex;
	mrn: string;
	preferredContact: string;
}

export interface PresentingConcern {
	chiefConcern: string;
	referralReason: string;
	referringClinician: string;
	urgency: ReferralUrgency;
	suspectedSyndrome: string;
}

export interface ProbandCancer {
	type: string;
	ageAtDiagnosis: number | null;
	bilateral: YesNo;
	treatment: string;
}

export interface PersonalMedicalHistory {
	personalCancerHistory: YesNo;
	cancers: ProbandCancer[];
	multiplePrimaryCancers: YesNo;
	congenitalAnomalies: YesNo;
	congenitalAnomaliesDetails: string;
	developmentalDelay: YesNo;
	priorRadiation: YesNo;
	otherSignificantHistory: string;
}

/** A cancer record on a single relative. */
export interface RelativeCancer {
	type: string;
	ageAtDiagnosis: number | null;
}

/** One relative on the three-generation pedigree. */
export interface Relative {
	id: string;
	relation: string;
	side: 'maternal' | 'paternal' | 'self' | '';
	generation: 1 | 2 | 3;
	sex: Sex;
	name: string;
	affectedWithCancer: YesNoUnknown;
	cancers: RelativeCancer[];
	deceased: YesNoUnknown;
	ageAtDeath: number | null;
	causeOfDeath: string;
	notes: string;
}

export interface FamilyPedigree {
	maternalGrandmother: Relative;
	maternalGrandfather: Relative;
	paternalGrandmother: Relative;
	paternalGrandfather: Relative;
	mother: Relative;
	father: Relative;
	maternalAuntsUncles: Relative[];
	paternalAuntsUncles: Relative[];
	siblings: Relative[];
	children: Relative[];
	maternalCousins: Relative[];
	paternalCousins: Relative[];
}

export interface ConsanguinityAncestry {
	consanguinity: YesNo;
	consanguinityDetails: string;
	maternalAncestry: string;
	paternalAncestry: string;
	ashkenaziJewish: YesNo;
	sephardicJewish: YesNo;
	foundingPopulation: YesNo;
	foundingPopulationDetails: string;
}

/** Manchester Score (BRCA1/2) per-cancer counts in proband and relatives. */
export interface ManchesterInputs {
	probandFemaleBreastUnder30: number | null;
	probandFemaleBreast30to39: number | null;
	probandFemaleBreast40to49: number | null;
	probandOvarianUnder60: number | null;
	probandMaleBreast: number | null;
	relativeFemaleBreastUnder30: number | null;
	relativeFemaleBreast30to39: number | null;
	relativeFemaleBreast40to49: number | null;
	relativeOvarianUnder60: number | null;
	relativeMaleBreast: number | null;
	relativePancreaticUnder60: number | null;
	relativeProstateUnder60: number | null;
}

/** Revised Bethesda criteria for Lynch syndrome — five binary items. */
export interface BethesdaInputs {
	crcUnder50: YesNo;
	synchronousMetachronous: YesNo;
	msiHistology: YesNo;
	firstDegreeLynchTumour: YesNo;
	multipleRelativesLynch: YesNo;
}

/** Tyrer-Cuzick (IBIS) inputs and externally-calculated risks. */
export interface TyrerCuzickInputs {
	ageYears: number | null;
	ageAtMenarche: number | null;
	parous: YesNo;
	ageAtFirstLiveBirth: number | null;
	menopausal: YesNo;
	ageAtMenopause: number | null;
	heightCm: number | null;
	weightKg: number | null;
	hrtCurrent: YesNo;
	priorBenignBreastDisease: YesNo;
	atypicalHyperplasia: YesNo;
	lcis: YesNo;
	dense: YesNo;
	externalTenYearRisk: number | null;
	externalLifetimeRisk: number | null;
}

/** PREMM5 indicators and an externally-computed PREMM5 percentage. */
export interface PREMM5Inputs {
	probandColorectal: YesNo;
	probandEndometrial: YesNo;
	probandOtherLynchTumour: YesNo;
	youngestProbandAgeAtLynchTumour: number | null;
	firstDegreeWithCRC: number | null;
	firstDegreeWithEndometrial: number | null;
	firstDegreeWithOtherLynch: number | null;
	secondDegreeWithLynch: number | null;
	youngestRelativeAgeAtLynchTumour: number | null;
	externalPREMM5Percent: number | null;
}

export interface TargetedRiskScoring {
	manchester: ManchesterInputs;
	bethesda: BethesdaInputs;
	tyrerCuzick: TyrerCuzickInputs;
	premm5: PREMM5Inputs;
}

export interface PriorTestRecord {
	testName: string;
	laboratory: string;
	testDate: string;
	resultSummary: string;
}

export interface PriorGeneticTesting {
	priorTesting: YesNo;
	priorTests: PriorTestRecord[];
	variantsOfUncertainSignificance: YesNo;
	variantsOfUncertainSignificanceDetails: string;
	familialVariantKnown: YesNo;
	familialVariantDetails: string;
	priorGeneticCounselling: YesNo;
	priorCounsellingNotes: string;
}

export interface PatientUnderstandingConcerns {
	understandingOfReferral: string;
	primaryConcerns: string;
	expectations: string;
	insuranceConcerns: YesNo;
	confidentialityConcerns: YesNo;
	reproductiveImplications: YesNo;
	supportSystem: string;
	consentToTesting: YesNo;
}

export interface RecommendationReferralPlan {
	clinicianAssignedRisk: RiskLevel;
	recommendBRCATesting: YesNo;
	recommendLynchTesting: YesNo;
	recommendPanelTesting: YesNo;
	recommendMMRIHC: YesNo;
	recommendedPanel: string;
	referClinicalGenetics: YesNo;
	referBreastSurveillance: YesNo;
	referColonoscopy: YesNo;
	referPsychologicalSupport: YesNo;
	referralUrgency: ReferralUrgency;
	clinicianSummary: string;
	clinicianName: string;
	clinicianRole: string;
	signatureDate: string;
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

export interface AssessmentData {
	probandDemographics: ProbandDemographics;
	presentingConcern: PresentingConcern;
	personalMedicalHistory: PersonalMedicalHistory;
	familyPedigree: FamilyPedigree;
	consanguinityAncestry: ConsanguinityAncestry;
	targetedRiskScoring: TargetedRiskScoring;
	priorGeneticTesting: PriorGeneticTesting;
	patientUnderstandingConcerns: PatientUnderstandingConcerns;
	recommendationReferralPlan: RecommendationReferralPlan;
}

// ──────────────────────────────────────────────
// Genetics grading types
// ──────────────────────────────────────────────

/** Context derived from the assessment that the rules consume. */
export interface GraderContext {
	manchesterScore: number;
	bethesdaMet: number;
	premm5Score: number | null;
	tyrerCuzickLifetime: number;
	affectedFirstDegree: number;
	earlyOnsetUnder50: number;
	paediatricCancers: number;
	hasMaleBreast: boolean;
	hasOvarian: boolean;
	hasPancreatic: boolean;
	hasBilateralBreast: boolean;
	hasMultiplePrimaries: boolean;
}

export interface GeneticsRule {
	id: string;
	category: string;
	description: string;
	evaluate: (d: AssessmentData, ctx: GraderContext) => RiskLevel;
}

export interface FiredRule {
	id: string;
	category: string;
	description: string;
	severity: RiskLevel;
}

export interface AdditionalFlag {
	id: string;
	category: string;
	message: string;
	priority: 'high' | 'medium' | 'low';
}

export interface GradingResult {
	riskLevel: RiskLevel;
	manchesterScore: number;
	bethesdaMet: number;
	premm5Score: number | null;
	tyrerCuzickLifetime: number;
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
