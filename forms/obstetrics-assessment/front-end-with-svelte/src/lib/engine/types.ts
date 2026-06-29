// ──────────────────────────────────────────────
// Core assessment data types
//
// The instrument modelled here is the NICE NG201 Antenatal Risk Assessment,
// stratifying pregnancies into Low / Moderate / High risk to allocate the
// appropriate care pathway (midwifery-led, obstetrician-led, or
// multidisciplinary consultant-led care).
// ──────────────────────────────────────────────

export type YesNo = 'yes' | 'no' | '';
export type RiskLevel = 'low' | 'moderate' | 'high';

export interface MaternalDemographics {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	ageAtBooking: number | null;
	ethnicity: string;
	weight: number | null;
	height: number | null;
	bmi: number | null;
	occupation: string;
	partnerStatus: string;
}

export interface ObstetricHistory {
	gravidity: number | null;
	parity: number | null;
	previousMiscarriages: number | null;
	previousTerminations: number | null;
	previousStillbirths: number | null;
	previousNeonatalDeaths: number | null;
	previousPretermBirth: YesNo;
	previousPreEclampsia: YesNo;
	previousGestationalDiabetes: YesNo;
	previousCaesarean: YesNo;
	previousCaesareanCount: number | null;
	previousShoulderDystocia: YesNo;
	previousPostpartumHaemorrhage: YesNo;
	previousLargeBaby: YesNo;
	previousSmallBaby: YesNo;
	previousCongenitalAnomaly: YesNo;
	obstetricNotes: string;
}

export interface MedicalHistory {
	chronicHypertension: YesNo;
	cardiacDisease: YesNo;
	preExistingDiabetes: YesNo;
	thyroidDisease: YesNo;
	renalDisease: YesNo;
	epilepsy: YesNo;
	asthma: YesNo;
	autoimmuneDisease: YesNo;
	hivPositive: YesNo;
	hepatitis: YesNo;
	previousVte: YesNo;
	thrombophilia: YesNo;
	mentalHealthHistory: YesNo;
	bariatricSurgery: YesNo;
	otherMedicalConditions: string;
	currentMedications: string;
}

export interface CurrentPregnancy {
	lastMenstrualPeriod: string;
	estimatedDueDate: string;
	datingScanDate: string;
	gestationWeeks: number | null;
	gestationDays: number | null;
	multiplePregnancy: YesNo;
	chorionicity: 'dcda' | 'mcda' | 'mcma' | 'unknown' | '';
	ivfConception: YesNo;
	folicAcidPreconception: YesNo;
	firstAntenatalContact: YesNo;
	bookingDate: string;
}

export interface LifestyleSocialFactors {
	smokingStatus: 'never' | 'ex' | 'current' | '';
	cigarettesPerDay: number | null;
	alcoholUse: 'none' | 'occasional' | 'regular' | '';
	substanceUse: 'none' | 'occasional' | 'regular' | '';
	domesticAbuse: YesNo;
	safeguardingConcerns: YesNo;
	housingInsecurity: YesNo;
	financialDifficulty: YesNo;
	requiresInterpreter: YesNo;
	interpreterLanguage: string;
	asylumOrRefugee: YesNo;
	femaleGenitalMutilation: YesNo;
	socialNotes: string;
}

export interface ScreeningResults {
	combinedTestResult: 'lower-chance' | 'higher-chance' | 'declined' | 'pending' | '';
	combinedTestRisk: string;
	anomalyScanCompleted: YesNo;
	anomalyScanFindings: 'normal' | 'soft-marker' | 'abnormal' | '';
	gttResult: 'normal' | 'gdm-confirmed' | 'declined' | 'pending' | 'not-indicated' | '';
	gttFasting: number | null;
	gttTwoHour: number | null;
	bloodGroup: 'O' | 'A' | 'B' | 'AB' | '';
	rhesusStatus: 'positive' | 'negative' | '';
	antibodyScreenPositive: YesNo;
	infectionScreenAbnormal: YesNo;
	infectionScreenDetails: string;
	haemoglobin: string;
	screeningNotes: string;
}

export interface MentalHealthAssessment {
	whooley1: YesNo;
	whooley2: YesNo;
	gad2Q1: 'not-at-all' | 'several-days' | 'more-than-half' | 'nearly-every-day' | '';
	gad2Q2: 'not-at-all' | 'several-days' | 'more-than-half' | 'nearly-every-day' | '';
	previousPostnatalDepression: YesNo;
	previousSevereMentalIllness: YesNo;
	currentlyOnPsychotropicMeds: YesNo;
	selfHarmIdeation: YesNo;
	mentalHealthNotes: string;
}

export interface FetalAssessment {
	fundalHeight: number | null;
	fetalLie: 'longitudinal' | 'transverse' | 'oblique' | 'unstable' | '';
	fetalPresentation: 'cephalic' | 'breech' | 'shoulder' | 'unknown' | '';
	engaged: YesNo;
	fetalMovementsReported: 'normal' | 'increased' | 'reduced' | 'absent' | 'not-yet-felt' | '';
	fetalHeartRate: number | null;
	reducedFetalMovements: YesNo;
	growthConcern: YesNo;
	growthConcernDetails: string;
	fetalNotes: string;
}

export interface BirthPreferences {
	preferredBirthSetting: 'home' | 'midwife-led-unit' | 'obstetric-unit' | 'undecided' | '';
	preferredAnalgesia: 'none' | 'gas-air' | 'pethidine' | 'epidural' | 'undecided' | '';
	birthPartnerPlanned: YesNo;
	birthPlanCompleted: YesNo;
	feedingChoiceBreast: YesNo;
	feedingChoiceFormula: YesNo;
	vbacRequested: YesNo;
	birthPreferenceNotes: string;
}

export interface CarePlanFollowup {
	recommendedCarePathway:
		| 'midwifery-led'
		| 'shared-care'
		| 'consultant-led'
		| 'multidisciplinary'
		| '';
	consultantReferralRequired: YesNo;
	mentalHealthReferralRequired: YesNo;
	safeguardingReferralRequired: YesNo;
	aspirinProphylaxisIndicated: YesNo;
	vteProphylaxisIndicated: YesNo;
	nextAppointmentDate: string;
	carePlanNotes: string;
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

export interface AssessmentData {
	maternalDemographics: MaternalDemographics;
	obstetricHistory: ObstetricHistory;
	medicalHistory: MedicalHistory;
	currentPregnancy: CurrentPregnancy;
	lifestyleSocialFactors: LifestyleSocialFactors;
	screeningResults: ScreeningResults;
	mentalHealthAssessment: MentalHealthAssessment;
	fetalAssessment: FetalAssessment;
	birthPreferences: BirthPreferences;
	carePlanFollowup: CarePlanFollowup;
}

// ──────────────────────────────────────────────
// NG201 antenatal grading types
// ──────────────────────────────────────────────

export interface NG201Rule {
	id: string;
	category: string;
	description: string;
	evaluate: (data: AssessmentData) => RiskLevel | null;
}

export interface FiredRule {
	id: string;
	category: string;
	description: string;
	risk: RiskLevel;
}

export interface AdditionalFlag {
	id: string;
	category: string;
	message: string;
	priority: 'urgent' | 'high' | 'medium' | 'low';
}

export interface GradingResult {
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
