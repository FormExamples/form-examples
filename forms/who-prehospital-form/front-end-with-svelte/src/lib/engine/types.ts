// ──────────────────────────────────────────────
// Core WHO Prehospital Form (SCF Prehospital) data types
// ──────────────────────────────────────────────

/** Yes / No / Unknown / unanswered tri-state (empty string when unanswered). */
export type YesNoUnknown = 'yes' | 'no' | 'unknown' | '';

/** Yes / No / unanswered tri-state. */
export type YesNo = 'yes' | 'no' | '';

/** Sex at registration. */
export type Sex = 'male' | 'female' | '';

/** WHO prehospital triage category. */
export type TriageCategory = 'red' | 'yellow' | 'green' | '';

/** AVPU rapid consciousness scale. */
export type Avpu = 'A' | 'V' | 'P' | 'U' | '';

/** Scene call type. */
export type SceneCallType = 'scene' | 'inter-facility-transfer' | '';

/** Scene location and type. */
export type SceneLocationType =
	| 'residence'
	| 'school'
	| 'public-building'
	| 'health-facility'
	| 'street'
	| 'other'
	| '';

/** Injury intent. */
export type InjuryIntent = 'intentional' | 'unintentional' | 'self-inflicted' | '';

/** Vehicle type for road traffic incident. */
export type VehicleType = 'car' | 'bike' | 'motorbike' | 'other' | '';

// ──────────────────────────────────────────────
// Step 1 — Caller & Scene
// ──────────────────────────────────────────────

export interface CallerAndScene {
	massCasualty: boolean;
	callerName: string;
	callerPhone: string;
	patientName: string;
	dateOfBirthOrAge: string;
	sex: Sex;
	patientAddress: string;
	occupation: string;
	date: string;
	sceneCallType: SceneCallType;
	runNumber: string;
	sceneLocationType: SceneLocationType;
	sceneLocationOther: string;
	timeCallReceived: string;
	timeEnRouteToScene: string;
	timeArrivedAtScene: string;
	timeTransporting: string;
	timeAtFacility: string;
	timeInService: string;
}

// ──────────────────────────────────────────────
// Step 2 — Chief Complaint & Initial Vitals
// ──────────────────────────────────────────────

export interface InitialVitals {
	time: string;
	hr: number | null;
	rr: number | null;
	bp: string;
	tempC: number | null;
	rbs: number | null;
	spo2: number | null;
	spo2OnOxygen: string;
}

export interface ChiefComplaintAndVitals {
	chiefComplaint: string;
	injury: boolean;
	initialVitals: InitialVitals;
	careInProgressOnArrival: string;
	pregnant: YesNoUnknown;
	painScore: number | null;
}

// ──────────────────────────────────────────────
// Step 3 — High Risk Signs
// ──────────────────────────────────────────────

export interface HighRiskSigns {
	// A/B
	stridor: boolean;
	cyanosis: boolean;
	respiratoryDistress: boolean;
	// C
	poorPerfusion: boolean;
	weakFastPulse: boolean;
	capillaryRefillOver3s: boolean;
	heavyBleeding: boolean;
	childLethargy: boolean;
	childSunkenEyes: boolean;
	childSlowSkinPinch: boolean;
	childPoorDrinking: boolean;
	adultHrUnder50OrOver150: boolean;
	// D
	unresponsive: boolean;
	acuteConvulsions: boolean;
	hypoglycaemia: boolean;
	acuteFocalNeurologicDeficit: boolean;
	alteredMentalStatusWithFeverHypothermiaStiffNeckHeadache: boolean;
	// Other
	highRiskTrauma: boolean;
	threatenedLimb: boolean;
	snakeBite: boolean;
	poisoningIngestionChemicalExposure: boolean;
	violentOrAggressive: boolean;
	tempOver39OrUnder36: boolean;
	acuteTesticularPainOrPriapism: boolean;
	pregnantWithHighRiskFindings: boolean;
	adultSevereChestOrAbdominalPainOrEcgIschaemia: boolean;
	infantUnder8Days: boolean;
	infantUnder2MonthsWithTempOver39OrUnder36: boolean;
}

// ──────────────────────────────────────────────
// Step 4 — Triage
// ──────────────────────────────────────────────

export interface Triage {
	category: TriageCategory;
	triagedFor: string;
}

// ──────────────────────────────────────────────
// Step 5 — Airway (A)
// ──────────────────────────────────────────────

export interface Airway {
	normal: boolean;
	voiceChanges: boolean;
	stridor: boolean;
	oralAirwayBurns: boolean;
	angioedema: boolean;
	obstructedByTongue: boolean;
	obstructedByBlood: boolean;
	obstructedBySecretions: boolean;
	obstructedByVomit: boolean;
	obstructedByForeignBody: boolean;
	interventionRepositioning: boolean;
	interventionSuction: boolean;
	interventionOpa: boolean;
	interventionNpa: boolean;
	interventionLma: boolean;
	interventionBvm: boolean;
	interventionEtt: boolean;
	cSpineNotNeeded: boolean;
	cSpineDone: boolean;
	notes: string;
}

// ──────────────────────────────────────────────
// Step 6 — Breathing (B)
// ──────────────────────────────────────────────

export interface Breathing {
	normal: boolean;
	spontaneousRespiration: YesNo;
	chestRiseShallow: boolean;
	chestRiseRetractions: boolean;
	chestRiseParadoxical: boolean;
	tracheaMidline: boolean;
	tracheaDeviatedLeft: boolean;
	tracheaDeviatedRight: boolean;
	breathSoundsNormal: boolean;
	breathSoundsNotes: string;
	oxygenLitres: number | null;
	oxygenNasalCannula: boolean;
	oxygenFaceMask: boolean;
	oxygenNonRebreather: boolean;
	oxygenBvm: boolean;
	oxygenBipapCpap: boolean;
	oxygenOther: string;
	notes: string;
}

// ──────────────────────────────────────────────
// Step 7 — Circulation (C)
// ──────────────────────────────────────────────

export interface Circulation {
	normal: boolean;
	skinWarm: boolean;
	skinDry: boolean;
	skinPale: boolean;
	skinCyanotic: boolean;
	skinMoist: boolean;
	skinCool: boolean;
	capillaryRefillUnder3: boolean;
	capillaryRefill3OrMore: boolean;
	pulsesWeak: boolean;
	pulsesAsymmetric: boolean;
	jvd: YesNo;
	activeBleedingSite: string;
	bleedingControlledBandage: boolean;
	bleedingControlledTourniquet: boolean;
	bleedingControlledDirectPressure: boolean;
	bleedingControlTime: string;
	accessIvSite: string;
	accessIvSize: string;
	accessIoSite: string;
	accessIoSize: string;
	ivfMls: number | null;
	ivfNs: boolean;
	ivfLr: boolean;
	ivfOther: string;
	pelvisStabilized: boolean;
	femurFractureStabilized: boolean;
	notes: string;
}

// ──────────────────────────────────────────────
// Step 8 — Disability (D)
// ──────────────────────────────────────────────

export interface Disability {
	normal: boolean;
	bloodGlucose: number | null;
	avpu: Avpu;
	gcsEye: number | null;
	gcsVerbal: number | null;
	gcsMotor: number | null;
	movesLeftArm: boolean;
	movesRightArm: boolean;
	movesLeftLeg: boolean;
	movesRightLeg: boolean;
	pupilSizeLeft: number | null;
	pupilSizeRight: number | null;
	pupilReactivityLeft: string;
	pupilReactivityRight: string;
	interventionGlucoseChecked: boolean;
	interventionGlucoseGiven: boolean;
	interventionNaloxoneGiven: boolean;
	notes: string;
}

// ──────────────────────────────────────────────
// Step 9 — Exposure (E)
// ──────────────────────────────────────────────

export interface Exposure {
	normal: boolean;
	exposedCompletely: boolean;
	notes: string;
}

// ──────────────────────────────────────────────
// Step 10 — SAMPLE History
// ──────────────────────────────────────────────

export interface SampleHistory {
	signsSymptoms: string;
	signsSymptomsUnknown: boolean;
	allergies: string;
	allergiesUnknown: boolean;
	medications: string;
	medicationsUnknown: boolean;
	pastMedical: string;
	pastMedicalUnknown: boolean;
	pastSurgeries: string;
	pastSurgeriesUnknown: boolean;
	lastAteHours: number | null;
	lastAteUnknown: boolean;
	events: string;
	eventsUnknown: boolean;
}

// ──────────────────────────────────────────────
// Step 11 — Injury Details
// ──────────────────────────────────────────────

export interface InjuryDetails {
	intent: InjuryIntent;
	mechanismFall: boolean;
	mechanismHitByFallingObject: boolean;
	mechanismStabCut: boolean;
	mechanismGunshot: boolean;
	mechanismSexualAssault: boolean;
	mechanismOtherBluntForce: boolean;
	mechanismSuffocationChokingHanging: boolean;
	mechanismDrowning: boolean;
	mechanismDrowningLifeVest: YesNo;
	mechanismBurnCausedBy: string;
	mechanismPoisoningToxicExposure: boolean;
	mechanismUnknown: boolean;
	mechanismOther: string;
	roadTrafficDriver: boolean;
	roadTrafficPassenger: boolean;
	roadTrafficPedestrian: boolean;
	roadTrafficEjected: boolean;
	roadTrafficExtricated: boolean;
	vehicleType: VehicleType;
	vehicleOther: string;
	safetyAirbag: boolean;
	safetySeatbelt: boolean;
	safetyHelmet: boolean;
	safetyOtherRestraint: string;
}

// ──────────────────────────────────────────────
// Step 12 — Physical Exam
// ──────────────────────────────────────────────

export interface PeEntry {
	normal: boolean;
	notes: string;
}

export interface PhysicalExam {
	general: PeEntry;
	heent: PeEntry;
	respiratory: PeEntry;
	cardiac: PeEntry;
	abdominal: PeEntry;
	pelvisGu: PeEntry;
	neurologic: PeEntry;
	psychiatric: PeEntry;
	musculoskeletal: PeEntry;
	skin: PeEntry;
}

// ──────────────────────────────────────────────
// Step 13 — Additional Interventions
// ──────────────────────────────────────────────

export interface AdditionalInterventions {
	medsBronchodilators: boolean;
	medsEpinephrine: boolean;
	medsAspirin: boolean;
	medsSeizureMedication: boolean;
	medsAnalgesia: boolean;
	medsIvFluidInfusion: boolean;
	medsOther: string;
	procWoundBandaging: boolean;
	procBurnDressing: boolean;
	procSplintingReduction: boolean;
	procPelvicStabilization: boolean;
	procEcg: boolean;
	procOther: string;
}

// ──────────────────────────────────────────────
// Step 14 — Assessment & Plan
// ──────────────────────────────────────────────

export interface AssessmentAndPlan {
	summary: string;
	differential: string;
	presumptiveDiagnoses: string;
}

// ──────────────────────────────────────────────
// Step 15 — Reassessment (up to 3 sets)
// ──────────────────────────────────────────────

export interface Reassessment {
	time: string;
	hr: number | null;
	rr: number | null;
	tempC: number | null;
	spo2: number | null;
	spo2OnOxygen: string;
	rbs: number | null;
	pain: number | null;
	unchanged: boolean;
}

// ──────────────────────────────────────────────
// Step 16 — Disposition
// ──────────────────────────────────────────────

export interface FinalVitals {
	time: string;
	hr: number | null;
	rr: number | null;
	tempC: number | null;
	bp: string;
	spo2: number | null;
	spo2OnOxygen: string;
}

export interface Disposition {
	disposition: string;
	handoverTime: string;
	handoverToName: string;
	handoverToCadre: string;
	handoverToSignature: string;
	finalVitals: FinalVitals;
	planDiscussedWithPatient: YesNo;
	providerName: string;
	providerSignature: string;
	providerSignatureDate: string;
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

export interface AssessmentData {
	callerAndScene: CallerAndScene;
	chiefComplaintAndVitals: ChiefComplaintAndVitals;
	highRiskSigns: HighRiskSigns;
	triage: Triage;
	airway: Airway;
	breathing: Breathing;
	circulation: Circulation;
	disability: Disability;
	exposure: Exposure;
	sampleHistory: SampleHistory;
	injuryDetails: InjuryDetails;
	physicalExam: PhysicalExam;
	additionalInterventions: AdditionalInterventions;
	assessmentAndPlan: AssessmentAndPlan;
	reassessments: Reassessment[];
	disposition: Disposition;
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
// Combined engine result
// ──────────────────────────────────────────────

/**
 * The combined output of the WHO Prehospital Form engine: the completeness
 * validation plus the clinically significant flagged issues, with a few
 * derived summary counts. This is a *status / classification* form (the run
 * sheet carries a RED / YELLOW / GREEN triage category), not a numeric-score
 * instrument, so there is no overall grade — the record is summarised by its
 * completeness status, its triage category, and its highest outstanding flag.
 */
export interface PrehospitalResult {
	validation: ValidationResult;
	flags: FlaggedIssue[];
	/** Whether every applicable required field is answered. */
	complete: boolean;
	/** Count of flags at each priority level. */
	urgentCount: number;
	highCount: number;
	mediumCount: number;
	lowCount: number;
	/** The highest-priority flag present, or null if the record is clear. */
	topPriority: FlagPriority | null;
	/** The WHO triage category recorded on the run sheet. */
	triageCategory: TriageCategory;
	timestamp: string;
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
