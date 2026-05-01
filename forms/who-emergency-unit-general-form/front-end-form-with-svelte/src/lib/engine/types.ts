// ──────────────────────────────────────────────
// Core WHO Emergency Unit (General) form data types
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

/** Ambulance level when arrival mode is ambulance. */
export type AmbulanceLevel = 'basic' | 'advanced' | '';

/** AVPU scale (Disability). */
export type Avpu = 'A' | 'V' | 'P' | 'U' | '';

/** Triage category labels. */
export type TriageCategory = 'red' | 'orange' | 'yellow' | 'green' | '';

/** Disposition outcome. */
export type Disposition = 'admit' | 'transfer' | 'discharge' | 'died' | '';

/** Admit ward. */
export type AdmitWard = 'ward' | 'icu' | 'ot' | '';

/** Lab result tri-state for Pos / Neg / pending. */
export type LabResult = 'pos' | 'neg' | 'pending' | '';

// ──────────────────────────────────────────────
// Step 1 — Patient Registration
// ──────────────────────────────────────────────

export interface PatientRegistration {
	hospitalRegistrationNumber: string;
	surname: string;
	firstName: string;
	sex: Sex;
	dateOfBirth: string;
	age: number | null;
	ageCategory: AgeCategory;
	weightKg: number | null;
	dateOfArrival: string;
	timeOfArrival: string;
	arrivalMode: ArrivalMode;
	ambulanceLevel: AmbulanceLevel;
	emergencySystemActivationDate: string;
	emergencySystemActivationTime: string;
	emergencySystemDispatchDate: string;
	emergencySystemDispatchTime: string;
	emergencyPersonnelArrivalDate: string;
	emergencyPersonnelArrivalTime: string;
	occupation: string;
	patientResidence: string;
	patientResidenceUnknown: boolean;
	racialAndEthnicIdentity: string;
	racialAndEthnicIdentityUnknown: boolean;
	interpreterRequired: YesNo;
	contactPerson: string;
	contactPhone: string;
	contactRelation: string;
	priorFacilitiesCount: number | null;
	referredFrom: string;
	ambulatory: boolean;
	nonAmbulatory: boolean;
	acute: boolean;
	chronic: boolean;
	dailyActivitiesLimited: YesNo;
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
	triageCategory: TriageCategory;
	initialVitals: InitialVitals;
	providerAssessmentDate: string;
	providerAssessmentTime: string;
	deadOnArrival: boolean;
}

// ──────────────────────────────────────────────
// Step 3 — High Risk Signs
// ──────────────────────────────────────────────

export interface HighRiskSigns {
	abnormalAvpu: boolean;
	abnormalHeartRate: boolean;
	stridorOrVoiceChange: boolean;
	poorPerfusion: boolean;
	abnormalTemperature: boolean;
	lowSpo2: boolean;
	respiratoryDistress: boolean;
	vomitsEverythingOrCannotFeed: boolean;
}

// ──────────────────────────────────────────────
// Step 4 — Airway (A)
// ──────────────────────────────────────────────

export interface Airway {
	normal: boolean;
	angioedema: boolean;
	stridor: boolean;
	voiceChanges: boolean;
	oralAirwayBurns: boolean;
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
	notes: string;
}

// ──────────────────────────────────────────────
// Step 5 — Breathing (B)
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
	oxygenLitres: number | null;
	oxygenNasalCannula: boolean;
	oxygenMask: boolean;
	oxygenNonRebreather: boolean;
	oxygenBvm: boolean;
	oxygenCpapBipap: boolean;
	oxygenVentilator: boolean;
	bronchodilator: boolean;
	chestNeedleLeftSize: string;
	chestNeedleLeftDepth: string;
	chestNeedleRightSize: string;
	chestNeedleRightDepth: string;
	notes: string;
}

// ──────────────────────────────────────────────
// Step 6 — Circulation (C)
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
	capillaryRefillSeconds: number | null;
	pulsesWeak: boolean;
	pulsesAsymmetric: boolean;
	jvd: YesNo;
	accessIvLocation: string;
	accessIvSize: string;
	accessCvlLocation: string;
	accessCvlSize: string;
	accessIoLocation: string;
	accessIoSize: string;
	ivfMls: number | null;
	ivfNs: boolean;
	ivfLr: boolean;
	ivfOther: string;
	bloodOrdered: boolean;
	epinephrineGiven: boolean;
	notes: string;
}

// ──────────────────────────────────────────────
// Step 7 — Disability (D)
// ──────────────────────────────────────────────

export interface Disability {
	normal: boolean;
	avpu: Avpu;
	movesAllExtremities: boolean;
	deficit: boolean;
	deficitDescription: string;
	pupilSizeLeft: number | null;
	pupilSizeRight: number | null;
	pupilReactivityLeft: string;
	pupilReactivityRight: string;
	bloodGlucoseMmol: number | null;
	interventionGlucose: boolean;
	interventionAntiepileptic: boolean;
	interventionNaloxone: boolean;
	interventionOthers: string;
	notes: string;
}

// ──────────────────────────────────────────────
// Step 8 — History of Present Illness
// ──────────────────────────────────────────────

export interface HistoryOfPresentIllness {
	narrative: string;
}

// ──────────────────────────────────────────────
// Step 9 — Review of Systems
// ──────────────────────────────────────────────

export interface RosEntry {
	normal: boolean;
	notes: string;
}

export interface ReviewOfSystems {
	general: RosEntry;
	heent: RosEntry;
	respiratory: RosEntry;
	cardiovascular: RosEntry;
	gastrointestinal: RosEntry;
	pelvisGuRectal: RosEntry;
	femaleReproductive: RosEntry;
	maleReproductive: RosEntry;
	skin: RosEntry;
	musculoskeletal: RosEntry;
	hematologic: RosEntry;
	neurological: RosEntry;
	psychiatric: RosEntry;
	pediatricSpecific: RosEntry;
}

// ──────────────────────────────────────────────
// Step 10 — Past Medical History
// ──────────────────────────────────────────────

export interface PastMedicalHistory {
	historyObtainedFrom: string;
	medications: string;
	medicationsUnknown: boolean;
	allergies: string;
	allergiesUnknown: boolean;
	lastMenstrualCycle: string;
	gravida: number | null;
	para: number | null;
	lmpUnknown: boolean;
	pregnant: YesNo;
	pregnancyReported: boolean;
	pregnancyTestingDone: boolean;
	vaccinationsStatus: 'unknown' | 'no' | 'yes' | '';
	vaccinationsDate: string;
	tobaccoUse: boolean;
	alcoholUse: boolean;
	drugUse: boolean;
	ivDrugUse: boolean;
	substanceUseUnknown: boolean;
	pmhHtn: boolean;
	pmhDm: boolean;
	pmhCopd: boolean;
	pmhPsych: boolean;
	pmhRenalDisease: boolean;
	pmhUnknown: boolean;
	pmhOther: string;
	familyHistory: string;
	familyHistoryUnknown: boolean;
	pastSurgeries: string;
	pastSurgeriesUnknown: boolean;
	safeAtHome: string;
}

// ──────────────────────────────────────────────
// Step 11 — Physical Exam
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
	pelvisGuRectal: PeEntry;
	lymph: PeEntry;
	musculoskeletal: PeEntry;
	skin: PeEntry;
}

// ──────────────────────────────────────────────
// Step 12 — Diagnostics
// ──────────────────────────────────────────────

export interface Cbc {
	wbc: number | null;
	hgb: number | null;
	plt: number | null;
	hct: number | null;
	pending: boolean;
}

export interface Lytes {
	na: number | null;
	cl: number | null;
	bun: number | null;
	k: number | null;
	hco3: number | null;
	cr: number | null;
	glucose: number | null;
	pending: boolean;
}

export interface UrineDip {
	glucose: boolean;
	nitrites: boolean;
	ketones: boolean;
	leukocytes: boolean;
	blood: boolean;
	protein: boolean;
}

export interface Ecg {
	rate: number | null;
	sinusRhythm: YesNo;
	ischemia: YesNo;
	interpretation: string;
}

export interface Diagnostics {
	cbc: Cbc;
	lytes: Lytes;
	upt: LabResult;
	malaria: LabResult;
	hivRapid: LabResult;
	bloodType: string;
	urineDip: UrineDip;
	otherLabsImaging: string;
	ecg: Ecg;
}

// ──────────────────────────────────────────────
// Step 13 — Additional Interventions
// ──────────────────────────────────────────────

export interface MedicationGiven {
	time: string;
	ivfMls: number | null;
	ivfType: string;
	bloodProductsUnits: string;
	opioidAnalgesia: string;
	otherAnalgesia: string;
	sedationParalytics: string;
	antimicrobials: string;
	tetanus: string;
	other: string;
}

export interface ProcedureEntry {
	intubationTime: string;
	intubationOutcome: string;
	chestTubeTime: string;
	chestTubeOutcome: string;
	lumbarPunctureTime: string;
	lumbarPunctureOutcome: string;
	lacerationRepairTime: string;
	lacerationRepairOutcome: string;
	other: string;
}

export interface AdditionalInterventions {
	medications: MedicationGiven;
	procedures: ProcedureEntry;
}

// ──────────────────────────────────────────────
// Step 14 — Assessment & Plan
// ──────────────────────────────────────────────

export interface AssessmentAndPlan {
	narrative: string;
}

// ──────────────────────────────────────────────
// Step 15 — Reassessment
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
// Step 16 — Disposition
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
	diagnosesImpressions: string;
	disposition: Disposition;
	admitWard: AdmitWard;
	dischargePlanDiscussed: YesNo;
	transferTo: string;
	leftWithoutBeingSeen: boolean;
	diedCause: string;
	finalVitals: FinalVitals;
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
	airway: Airway;
	breathing: Breathing;
	circulation: Circulation;
	disability: Disability;
	historyOfPresentIllness: HistoryOfPresentIllness;
	reviewOfSystems: ReviewOfSystems;
	pastMedicalHistory: PastMedicalHistory;
	physicalExam: PhysicalExam;
	diagnostics: Diagnostics;
	additionalInterventions: AdditionalInterventions;
	assessmentAndPlan: AssessmentAndPlan;
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
