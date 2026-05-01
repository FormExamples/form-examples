// ──────────────────────────────────────────────
// Core WHO Emergency Unit (Trauma) form data types
// ──────────────────────────────────────────────

/** Yes / No / unanswered tri-state (empty string when unanswered). */
export type YesNo = 'yes' | 'no' | '';

/** Sex at registration. */
export type Sex = 'male' | 'female' | 'other' | '';

/** Age category bucket. */
export type AgeCategory = 'infant' | 'child' | 'adult' | '';

/** Mode of arrival. */
export type ArrivalMode =
	| 'ambulance'
	| 'car-private'
	| 'car-taxi'
	| 'motor-2-3-private'
	| 'motor-2-3-taxi'
	| 'public-transport'
	| 'walk'
	| 'other'
	| '';

/** AVPU scale (Disability). */
export type Avpu = 'A' | 'V' | 'P' | 'U' | '';

/** Triage category labels for trauma form (RED / YELLOW / GREEN). */
export type TriageCategory = 'red' | 'yellow' | 'green' | '';

/** Disposition outcome. */
export type Disposition = 'admit' | 'transfer' | 'discharge' | 'died' | '';

/** Admit ward. */
export type AdmitWard = 'ward' | 'icu' | 'ot' | '';

/** Spine stabilisation status. */
export type SpineStabilized = 'before-arrival' | 'in-eu' | 'not-needed' | '';

/** Pelvis stabilisation status. */
export type PelvisStabilized = 'yes' | 'not-indicated' | '';

/** Prehospital care provider. */
export type PrehospitalCareProvider = 'none' | 'layperson' | 'healthcare-professional' | '';

/** Loss of consciousness duration band. */
export type LossOfConsciousnessDuration = 'under-5min' | '5-29min' | '30min-24hr' | 'none' | '';

/** Intent of injury. */
export type IntentOfInjury =
	| 'unintentional'
	| 'intentional-self-harm'
	| 'intentional-assault'
	| 'legal-political-war'
	| 'unknown'
	| '';

/** Substance use within 6 hours of injury. */
export type SubstanceUseStatus = 'unknown' | 'none' | 'reported' | 'evidence' | '';

/** Pregnancy answered status. */
export type PregnantStatus = 'yes' | 'no' | '';

/** Vaccination status. */
export type VaccinationsStatus = 'unknown' | 'no' | 'yes' | '';

/** Road traffic role of patient. */
export type RoadRole = 'driver' | 'passenger' | 'pedestrian' | '';

/** FAST peritoneum result. */
export type FastPeritoneum = 'negative' | 'indeterminate' | 'free-fluid' | '';

/** FAST chest base result. */
export type FastChest = 'negative' | 'indeterminate' | 'pneumothorax' | 'pleural-fluid' | 'pericardial-effusion' | '';

/** Side L/R/bilateral indicator. */
export type Laterality = 'left' | 'right' | 'bilateral' | '';

// ──────────────────────────────────────────────
// Step 1 — Patient Registration
// ──────────────────────────────────────────────

export interface PatientRegistration {
	hospitalRegistrationNumber: string;
	surname: string;
	firstName: string;
	dateOfBirth: string;
	age: number | null;
	ageCategory: AgeCategory;
	sex: Sex;
	racialAndEthnicIdentity: string;
	racialAndEthnicIdentityUnknown: boolean;
	interpreterRequired: YesNo;
	occupation: string;
	contactPerson: string;
	contactPhone: string;
	contactRelation: string;
	dateOfArrival: string;
	timeOfArrival: string;
	arrivalMode: ArrivalMode;
	patientResidence: string;
	patientResidenceUnknown: boolean;
	injuryLocation: string;
	injuryLocationUnknown: boolean;
	priorFacilitiesCount: number | null;
	referredFrom: string;
	safeAtHome: YesNo;
	weightKg: number | null;
	vaccinationsStatus: VaccinationsStatus;
	vaccinationsDate: string;
	pregnant: PregnantStatus;
	pregnancyReported: boolean;
	pregnancyTestingDone: boolean;
	lastMenstrualCycle: string;
	gravida: number | null;
	para: number | null;
	lmpUnknown: boolean;
	tobaccoUse: boolean;
	alcoholUse: boolean;
	drugUse: boolean;
	ivDrugUse: boolean;
	substanceUseUnknown: boolean;
}

// ──────────────────────────────────────────────
// Step 2 — Chief Complaint & Vitals
// ──────────────────────────────────────────────

export interface InitialVitals {
	time: string;
	tempC: number | null;
	bpSystolic: number | null;
	bpDiastolic: number | null;
	pulse: number | null;
	respiratoryRate: number | null;
	spo2: number | null;
	spo2OnOxygen: string;
	painScore: number | null;
}

export interface ChiefComplaintAndVitals {
	chiefComplaint: string;
	allergies: string;
	allergiesUnknown: boolean;
	initialVitals: InitialVitals;
	deadOnArrival: boolean;
	timeOfDeath: string;
}

// ──────────────────────────────────────────────
// Step 3 — High Risk Signs (Red Signs + Trauma Indicators)
// ──────────────────────────────────────────────

export interface HighRiskSigns {
	// A/B
	redStridor: boolean;
	redCyanosis: boolean;
	redRespiratoryDistress: boolean;
	// C
	redPoorPerfusion: boolean;
	redWeakFastPulse: boolean;
	redCapRefillOver3: boolean;
	redHeavyBleeding: boolean;
	redAdultHrAbnormal: boolean;
	redChildLethargy: boolean;
	redChildSunkenEyes: boolean;
	redChildSlowSkinPinch: boolean;
	redChildPoorDrinking: boolean;
	// D
	redUnresponsive: boolean;
	redAcuteConvulsions: boolean;
	redHypoglycaemia: boolean;
	redAcuteFocalNeuroDeficit: boolean;
	redAlteredMentalStatusWithFeverEtc: boolean;
	// Other
	redThreatenedLimb: boolean;
	redSnakeBite: boolean;
	redPoisoningChemicalExposure: boolean;
	redViolentOrAggressive: boolean;
	redAcuteTesticularPainOrPriapism: boolean;
	redAdultSevereChestOrAbdoPain: boolean;
	redPregnantWithHighRiskFindings: boolean;
	redInfantUnder8Days: boolean;
	redInfantUnder2MonthsAbnormalTemp: boolean;
	// General trauma
	traumaFallTwiceHeight: boolean;
	traumaAllPenetrating: boolean;
	traumaPenetratingDistalUncontrolledBleeding: boolean;
	traumaCrushInjury: boolean;
	traumaPolytrauma: boolean;
	traumaBleedingDisorderOrAnticoag: boolean;
	traumaPregnant: boolean;
	// Road traffic
	rtHighSpeedCrash: boolean;
	rtPedestrianOrCyclistHit: boolean;
	rtOtherInVehicleDied: boolean;
	rtNoSeatbelt: boolean;
	rtTrappedOrThrown: boolean;
	rtDeadOnArrival: boolean;
}

// ──────────────────────────────────────────────
// Step 4 — Triage
// ──────────────────────────────────────────────

export interface Triage {
	category: TriageCategory;
	triagedFor: string;
	providerAssessmentDate: string;
	providerAssessmentTime: string;
}

// ──────────────────────────────────────────────
// Step 5 — Airway (A)
// ──────────────────────────────────────────────

export interface Airway {
	normal: boolean;
	swelling: boolean;
	stridor: boolean;
	voiceChanges: boolean;
	burns: boolean;
	obstructedByTongue: boolean;
	obstructedByBlood: boolean;
	obstructedBySecretion: boolean;
	obstructedByVomit: boolean;
	obstructedByForeignBody: boolean;
	interventionRepositioning: boolean;
	interventionSuction: boolean;
	interventionOpa: boolean;
	interventionNpa: boolean;
	interventionLma: boolean;
	interventionBvm: boolean;
	interventionEtt: boolean;
	spineStabilized: SpineStabilized;
	notes: string;
}

// ──────────────────────────────────────────────
// Step 6 — Breathing (B)
// ──────────────────────────────────────────────

export interface Breathing {
	normal: boolean;
	spontaneousRespiratoryRate: number | null;
	chestRiseShallow: boolean;
	chestRiseRetractions: boolean;
	chestRiseParadoxical: boolean;
	tracheaMidline: boolean;
	tracheaDeviatedLeft: boolean;
	tracheaDeviatedRight: boolean;
	breathSoundsLeft: string;
	breathSoundsRight: string;
	cyanosis: boolean;
	oxygenLitres: number | null;
	oxygenNasalCannula: boolean;
	oxygenMask: boolean;
	oxygenNonRebreather: boolean;
	oxygenBvm: boolean;
	oxygenCpapBipap: boolean;
	oxygenVentilator: boolean;
	chestTubeLeftSize: string;
	chestTubeLeftDepth: string;
	chestTubeRightSize: string;
	chestTubeRightDepth: string;
	notes: string;
}

// ──────────────────────────────────────────────
// Step 7 — Circulation (C)
// ──────────────────────────────────────────────

export interface Circulation {
	normal: boolean;
	skinWarm: boolean;
	skinDry: boolean;
	skinCool: boolean;
	skinMoist: boolean;
	skinPale: boolean;
	capillaryRefillUnder3: boolean;
	capillaryRefillSeconds: number | null;
	pulsesWeak: boolean;
	pulsesAsymmetric: boolean;
	jvd: YesNo;
	unstablePelvis: YesNo;
	bleedingControlDirectPressure: boolean;
	bleedingControlBandage: boolean;
	bleedingControlTourniquet: boolean;
	accessIvLocation: string;
	accessIvSize: string;
	accessCentralLocation: string;
	accessCentralSize: string;
	accessIoLocation: string;
	accessIoSize: string;
	accessLine2Location: string;
	accessLine2Size: string;
	ivfMls: number | null;
	ivfNs: boolean;
	ivfLr: boolean;
	ivfOther: string;
	bloodOrdered: boolean;
	bloodGiven: boolean;
	bloodTypeAmount: string;
	pelvisStabilized: PelvisStabilized;
	notes: string;
}

// ──────────────────────────────────────────────
// Step 8 — Disability (D)
// ──────────────────────────────────────────────

export interface Disability {
	normal: boolean;
	avpu: Avpu;
	gcsTotal: number | null;
	gcsEye: number | null;
	gcsVerbal: number | null;
	gcsMotor: number | null;
	gcsQualified: boolean;
	movesRue: boolean;
	movesLue: boolean;
	movesRle: boolean;
	movesLle: boolean;
	pupilSizeLeft: number | null;
	pupilSizeRight: number | null;
	pupilReactivityLeft: string;
	pupilReactivityRight: string;
	bloodGlucose: number | null;
	interventionGlucose: boolean;
	interventionAntidote: boolean;
	interventionAntiepileptic: boolean;
	interventionRaiseHeadOfBed: boolean;
	interventionOther: string;
	notes: string;
}

// ──────────────────────────────────────────────
// Step 9 — Exposure (E) & FAST (F)
// ──────────────────────────────────────────────

export interface ExposureAndFast {
	exposedCompletely: boolean;
	exposureNotes: string;
	fastNormal: boolean;
	fastNotIndicated: boolean;
	fastNotAvailable: boolean;
	fastPeritoneum: FastPeritoneum;
	fastChest: FastChest;
	fastChestPneumothoraxSide: Laterality;
	fastChestPleuralFluidSide: Laterality;
	fastNotes: string;
}

// ──────────────────────────────────────────────
// Step 10 — Injury History
// ──────────────────────────────────────────────

export interface InjuryHistory {
	placeOfInjury: string;
	placeOfInjuryUnknown: boolean;
	activityAtTimeOfInjury: string;
	activityAtTimeOfInjuryUnknown: boolean;
	mechRoadTrafficIncident: boolean;
	mechRoadRole: RoadRole;
	mechPatientVehicle: string;
	mechImpactedWith: string;
	mechAirbag: boolean;
	mechSeatbelt: boolean;
	mechHelmet: boolean;
	mechExtricated: boolean;
	mechEjected: boolean;
	mechFallFrom: string;
	mechHitByFallingObject: boolean;
	mechStabCut: boolean;
	mechGunshot: boolean;
	mechSexualAssault: boolean;
	mechOtherBluntForce: boolean;
	mechSuffocationChokingHanging: boolean;
	mechDrowning: boolean;
	mechDrowningLifeVest: YesNo;
	mechBurnCausedBy: string;
	mechPoisoningToxicExposure: boolean;
	mechUnknown: boolean;
	firstCareSought: string;
	prehospitalCareProvider: PrehospitalCareProvider;
	prehospitalCareGiven: string;
	dateOfInjury: string;
	timeOfInjury: string;
	lossOfConsciousnessDuration: LossOfConsciousnessDuration;
	headTrauma: boolean;
	neckTrauma: boolean;
	otherTraumaDetails: string;
	intent: IntentOfInjury;
	assaultedBy: string;
	hoursSinceLastMeal: number | null;
	hoursSinceLastMealUnknown: boolean;
	substanceUseStatus: SubstanceUseStatus;
	substanceAlcohol: boolean;
	substanceOther: string;
}

// ──────────────────────────────────────────────
// Step 11 — Past Histories
// ──────────────────────────────────────────────

export interface PastHistories {
	pmhNone: boolean;
	pmhUnknown: boolean;
	pmhHtn: boolean;
	pmhDm: boolean;
	pmhCopd: boolean;
	pmhPsych: boolean;
	pmhRenalDisease: boolean;
	pmhOther: string;
	medicationsNone: boolean;
	medicationsUnknown: boolean;
	medications: string;
	pastSurgeriesNone: boolean;
	pastSurgeriesUnknown: boolean;
	pastSurgeries: string;
	familyHistoryNone: boolean;
	familyHistoryUnknown: boolean;
	familyHistory: string;
}

// ──────────────────────────────────────────────
// Step 12 — Physical Exam (11 systems)
// ──────────────────────────────────────────────

export interface PeEntry {
	normal: boolean;
	notes: string;
}

export interface PhysicalExam {
	general: PeEntry;
	neuroPsych: PeEntry;
	heent: PeEntry;
	neck: PeEntry;
	respiratory: PeEntry;
	cardiac: PeEntry;
	abdominal: PeEntry;
	pelvis: PeEntry;
	guRectal: PeEntry;
	musculoskeletal: PeEntry;
	skin: PeEntry;
	areaOfInjuryDetail: string;
}

// ──────────────────────────────────────────────
// Step 13 — Assessment & Plan
// ──────────────────────────────────────────────

export interface AssessmentAndPlan {
	narrative: string;
}

// ──────────────────────────────────────────────
// Step 14 — Diagnostics (labs + imaging)
// ──────────────────────────────────────────────

export interface LabEntry {
	ordered: boolean;
	result: string;
}

export interface ImagingEntry {
	ordered: boolean;
	result: string;
}

export interface Diagnostics {
	labHgb: LabEntry;
	labBloodType: LabEntry;
	labChemistry: LabEntry;
	labHepatic: LabEntry;
	labUpt: LabEntry;
	labOther: LabEntry;
	imgChestRadiograph: ImagingEntry;
	imgPelvicRadiograph: ImagingEntry;
	imgHeadCt: ImagingEntry;
	imgCspine: ImagingEntry;
	imgChestAbdomenCt: ImagingEntry;
	imgExtremityRadiograph: ImagingEntry;
	imgOther: ImagingEntry;
}

// ──────────────────────────────────────────────
// Step 15 — Medications & Procedures (timed)
// ──────────────────────────────────────────────

export interface MedicationEntry {
	medicationAndDose: string;
	timeGiven: string;
	initials: string;
}

export interface ProcedureEntry {
	procedure: string;
	timeGiven: string;
	initials: string;
}

export interface MedicationsAndProcedures {
	ivfMls: number | null;
	ivfType: string;
	bloodUnits: string;
	analgesia: string;
	antimicrobials: string;
	tetanus: string;
	medications: MedicationEntry[];
	procIntubation: boolean;
	procThoracostomy: boolean;
	procSplintingReduction: boolean;
	procLacerationRepair: boolean;
	procOther: string;
	procedures: ProcedureEntry[];
}

// ──────────────────────────────────────────────
// Step 16 — Reassessment
// ──────────────────────────────────────────────

export interface Reassessment {
	time: string;
	tempC: number | null;
	pulse: number | null;
	bpSystolic: number | null;
	bpDiastolic: number | null;
	respiratoryRate: number | null;
	spo2: number | null;
	spo2OnOxygen: string;
	conditionSame: boolean;
	conditionChanges: string;
}

// ──────────────────────────────────────────────
// Step 17 — Disposition
// ──────────────────────────────────────────────

export interface FinalVitals {
	tempC: number | null;
	pulse: number | null;
	bpSystolic: number | null;
	bpDiastolic: number | null;
	respiratoryRate: number | null;
	spo2: number | null;
	spo2OnOxygen: string;
}

export interface DispositionData {
	checklistCompleted: YesNo;
	edDepartureDate: string;
	edDepartureTime: string;
	finalVitals: FinalVitals;
	diagnosesImpressions: string;
	disposition: Disposition;
	admitWard: AdmitWard;
	transferTo: string;
	dischargePlanDiscussed: YesNo;
	leftWithoutBeingSeen: boolean;
	diedCause: string;
	acceptingProvider: string;
	emergencyUnitProvider: string;
	signature: string;
	signatureDate: string;
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

export interface AssessmentData {
	patientRegistration: PatientRegistration;
	chiefComplaintAndVitals: ChiefComplaintAndVitals;
	highRiskSigns: HighRiskSigns;
	triage: Triage;
	airway: Airway;
	breathing: Breathing;
	circulation: Circulation;
	disability: Disability;
	exposureAndFast: ExposureAndFast;
	injuryHistory: InjuryHistory;
	pastHistories: PastHistories;
	physicalExam: PhysicalExam;
	assessmentAndPlan: AssessmentAndPlan;
	diagnostics: Diagnostics;
	medicationsAndProcedures: MedicationsAndProcedures;
	reassessment: Reassessment;
	disposition: DispositionData;
}

// ──────────────────────────────────────────────
// Validation engine types
// ──────────────────────────────────────────────

/** Section keys referenced by validation rules. */
export type SectionKey = keyof AssessmentData;

/** A single validation rule that may fire against the assessment data. */
export interface ValidationRule {
	id: string;
	section: SectionKey;
	description: string;
	applies: (data: AssessmentData) => boolean;
	isSatisfied: (data: AssessmentData) => boolean;
}

/** A rule that has fired (the field is required but unanswered). */
export interface FiredRule {
	id: string;
	section: SectionKey;
	description: string;
}

/** Per-section completeness summary. */
export interface SectionCompleteness {
	section: SectionKey;
	required: number;
	satisfied: number;
	missing: FiredRule[];
}

/** Result of running the completeness validator. */
export interface ValidationResult {
	complete: boolean;
	totalRequired: number;
	totalSatisfied: number;
	sections: SectionCompleteness[];
	missing: FiredRule[];
}

/** Priority for clinician-relevant flags. */
export type FlagPriority = 'urgent' | 'high' | 'medium' | 'low';

export interface FlaggedIssue {
	id: string;
	category: string;
	message: string;
	priority: FlagPriority;
}

// ──────────────────────────────────────────────
// Step configuration
// ──────────────────────────────────────────────

export interface StepConfig {
	number: number;
	title: string;
	shortTitle: string;
	section: SectionKey;
}
