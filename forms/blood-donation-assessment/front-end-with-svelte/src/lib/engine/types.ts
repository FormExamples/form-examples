// ──────────────────────────────────────────────
// Core assessment data types
// ──────────────────────────────────────────────

export type YesNo = 'yes' | 'no' | '';
export type Sex = 'male' | 'female' | 'other' | '';
export type DonorType = 'first-time' | 'regular' | 'lapsed' | '';
export type DonationType = 'whole-blood' | 'plasma' | 'platelets' | 'red-cells' | '';

export interface DonorDemographics {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	sex: Sex;
	weight: number | null;
	height: number | null;
	donorType: DonorType;
	lastDonationDate: string;
}

export interface GeneralHealth {
	feelingWellToday: YesNo;
	adequateSleep: YesNo;
	adequateMealAndFluids: YesNo;
	feelingFaintOrUnwell: YesNo;
}

export interface Medication {
	name: string;
	reason: string;
}

export interface MedicalHistory {
	heartOrCirculatoryDisease: YesNo;
	cancer: YesNo;
	bleedingOrClottingDisorder: YesNo;
	diabetesOnInsulin: YesNo;
	epilepsyOrSeizures: YesNo;
	hivPositive: YesNo;
	hepatitisBOrC: YesNo;
	htlv: YesNo;
	cjdFamilyHistory: YesNo;
	receivedPituitaryHormone: YesNo;
	receivedDuraMaterGraft: YesNo;
	currentMedications: Medication[];
}

export interface RecentIllness {
	feverPastTwoWeeks: YesNo;
	infectionPastTwoWeeks: YesNo;
	antibioticsPastSevenDays: YesNo;
	dentalWorkPastWeek: YesNo;
	surgeryPastSixMonths: YesNo;
	covidPositivePastTwentyEightDays: YesNo;
	vaccinationPastFourWeeks: YesNo;
	vaccinationDetails: string;
}

export interface TravelEntry {
	country: string;
	returnDate: string;
	duration: string;
}

export interface TravelHistory {
	recentTravel: TravelEntry[];
	malariaAreaPastTwelveMonths: YesNo;
	westNileVirusAreaPastTwentyEightDays: YesNo;
	ukResidence1980To1996Over12Months: YesNo;
	bloodTransfusionInUk: YesNo;
}

export interface LifestyleRisk {
	ivDrugUseEver: YesNo;
	sexWithIvDrugUser: YesNo;
	sexInExchangePastTwelveMonths: YesNo;
	sexWithNewPartnerPastThreeMonths: YesNo;
	multipleSexualPartnersPastThreeMonths: YesNo;
	tattooOrPiercingPastFourMonths: YesNo;
	acupuncturePastFourMonths: YesNo;
	bodyOrEarPiercingPastFourMonths: YesNo;
	incarceratedPastTwelveMonths: YesNo;
}

export interface PregnancyTransfusion {
	currentlyPregnant: YesNo;
	pregnancyPastSixMonths: YesNo;
	breastfeeding: YesNo;
	receivedTransfusionEver: YesNo;
	lastTransfusionDate: string;
	receivedTransplantEver: YesNo;
}

export interface VitalSigns {
	hemoglobin: number | null;
	systolicBp: number | null;
	diastolicBp: number | null;
	pulseBpm: number | null;
	temperatureCelsius: number | null;
}

export interface InformedConsent {
	understoodInformation: YesNo;
	consentToDonate: YesNo;
	consentToTesting: YesNo;
	consentToContact: YesNo;
}

export interface DonationPlan {
	plannedDonationType: DonationType;
	preferredDonationDate: string;
	session: string;
	notes: string;
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

export interface AssessmentData {
	donorDemographics: DonorDemographics;
	generalHealth: GeneralHealth;
	medicalHistory: MedicalHistory;
	recentIllness: RecentIllness;
	travelHistory: TravelHistory;
	lifestyleRisk: LifestyleRisk;
	pregnancyTransfusion: PregnancyTransfusion;
	vitalSigns: VitalSigns;
	informedConsent: InformedConsent;
	donationPlan: DonationPlan;
}

// ──────────────────────────────────────────────
// Donor grading types (JPAC Donor Selection Guidelines)
// ──────────────────────────────────────────────

export type EligibilityStatus = 'eligible' | 'temporarily-deferred' | 'permanently-deferred';

export interface DSGRule {
	id: string;
	category: string;
	description: string;
	evaluate: (data: AssessmentData) => FiredRule | null;
}

export interface FiredRule {
	id: string;
	category: string;
	description: string;
	status: EligibilityStatus;
	deferralWindow?: string;
}

export interface AdditionalFlag {
	id: string;
	category: string;
	message: string;
	priority: 'urgent' | 'high' | 'medium' | 'low';
}

export interface GradingResult {
	eligibilityStatus: EligibilityStatus;
	deferralWindow: string;
	firedRules: FiredRule[];
	additionalFlags: AdditionalFlag[];
	answeredCount: number;
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
