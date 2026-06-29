// ──────────────────────────────────────────────
// Core assessment data types
// ──────────────────────────────────────────────
//
// UK NHS-aligned pre-operative anaesthesiology assessment. The data model
// mirrors the validated HTML reference engine and feeds four scoring
// instruments — ASA Physical Status, Mallampati / airway difficulty, the
// Revised Cardiac Risk Index (RCRI / Lee Index), and STOP-BANG (OSA
// screening) — which the composite grader promotes to a single perioperative
// risk level.

export type Sex = 'male' | 'female' | 'other' | '';
export type YesNo = 'yes' | 'no' | '';
export type YesNoUnknown = 'yes' | 'no' | 'unknown' | '';
export type SurgeryGrade = 'minor' | 'intermediate' | 'major' | 'complex' | '';
export type AnaesthesiaType = 'general' | 'regional' | 'sedation' | 'local' | 'combined' | '';
export type MedicationRoute = 'oral' | 'iv' | 'sc' | 'im' | 'inhaled' | 'topical' | 'other' | '';
export type AllergyType = 'drug' | 'latex' | 'food' | 'environmental' | '';
export type AllergySeverity = 'mild' | 'moderate' | 'severe' | 'anaphylaxis' | '';
export type PrevAnaesthesiaType = 'general' | 'regional' | 'sedation' | 'local' | 'unknown' | '';
export type SmokingStatus = 'current' | 'ex' | 'never' | '';
export type ExerciseTolerance = 'gt-4-mets' | 'le-4-mets' | 'unknown' | '';
export type PregnancyStatus = 'not-pregnant' | 'pregnant' | 'not-applicable' | '';
export type MallampatiClass = 'i' | 'ii' | 'iii' | 'iv' | '';
export type NeckMobility = 'full' | 'limited' | 'fixed' | '';
export type JawProtrusion = 'normal' | 'limited' | '';
export type HeartSounds = 'normal' | 'murmur' | 'irregular' | 'added-sounds' | '';
export type PeripheralEdema = 'none' | 'mild' | 'moderate' | 'severe' | '';
export type JVP = 'normal' | 'raised' | '';
export type BreathSounds = 'normal' | 'wheeze' | 'crackles' | 'reduced' | '';
export type InvestigationStatus = 'not-required' | 'ordered' | 'normal' | 'abnormal' | '';
export type AsaClass = 'i' | 'ii' | 'iii' | 'iv' | 'v' | 'vi' | '';
export type AirwayPlan = 'facemask' | 'lma' | 'ett' | 'awake-fibreoptic' | 'other' | '';
export type PostOpDestination = 'ward' | 'hdu' | 'icu' | '';

/** Overall perioperative risk band. */
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Demographics {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	sex: Sex;
	nhsNumber: string;
	addressLine1: string;
	addressLine2: string;
	city: string;
	postcode: string;
	phone: string;
	email: string;
	emergencyName: string;
	emergencyPhone: string;
	emergencyRelationship: string;
	gpName: string;
	gpPractice: string;
	gpPhone: string;
}

export interface PlannedSurgery {
	procedureName: string;
	surgeonName: string;
	surgeryDate: string;
	surgeryGrade: SurgeryGrade;
	proposedAnaesthesia: AnaesthesiaType;
}

export interface MedicalHistory {
	// Cardiovascular
	hypertension: YesNo;
	ischaemicHeartDisease: YesNo;
	heartFailure: YesNo;
	valvularDisease: YesNo;
	arrhythmia: YesNo;
	peripheralVascularDisease: YesNo;
	dvtPe: YesNo;
	// Respiratory
	asthma: YesNo;
	copd: YesNo;
	sleepApnea: YesNo;
	recentUrti: YesNo;
	// Neurological
	epilepsy: YesNo;
	strokeTia: YesNo;
	neuromuscularDisease: YesNo;
	// Endocrine
	diabetesType1: YesNo;
	diabetesType2: YesNo;
	thyroidDisease: YesNo;
	adrenalInsufficiency: YesNo;
	// Renal
	chronicKidneyDisease: YesNo;
	dialysis: YesNo;
	// Hepatic
	liverDisease: YesNo;
	jaundice: YesNo;
	cirrhosis: YesNo;
	// Haematologic
	anaemia: YesNo;
	bleedingDisorder: YesNo;
	clottingDisorder: YesNo;
	// Gastrointestinal
	gord: YesNo;
	pepticUlcer: YesNo;
	// Musculoskeletal
	rheumatoidArthritis: YesNo;
	limitedMobility: YesNo;
	// Psychiatric
	anxiety: YesNo;
	depression: YesNo;
	otherPsychiatric: YesNo;
	otherDetails: string;
}

export interface Medication {
	name: string;
	dose: string;
	frequency: string;
	route: MedicationRoute;
}

export interface Medications {
	list: Medication[];
	onAnticoagulants: YesNo;
	onAntiplatelets: YesNo;
	onInsulin: YesNo;
	onSteroids: YesNo;
	onMaois: YesNo;
}

export interface Allergy {
	allergen: string;
	type: AllergyType;
	reaction: string;
	severity: AllergySeverity;
}

export interface Allergies {
	list: Allergy[];
	latexAllergy: YesNo;
}

export interface PreviousOperation {
	procedureName: string;
	year: number | null;
	anaesthesiaType: PrevAnaesthesiaType;
}

export interface PreviousAnaesthesia {
	operations: PreviousOperation[];
	difficultIntubation: boolean;
	ponv: boolean;
	awareness: boolean;
	slowRecovery: boolean;
	allergicReaction: boolean;
	otherComplication: boolean;
	otherComplicationDetails: string;
	malignantHyperthermia: YesNoUnknown;
	familyAnaestheticComplications: YesNoUnknown;
	familyAnaestheticDetails: string;
}

export interface SocialHistory {
	smoking: SmokingStatus;
	packYears: number | null;
	alcoholUnitsPerWeek: number | null;
	recreationalDrugUse: YesNo;
	recreationalDrugDetails: string;
	canClimbTwoFlights: YesNo;
	exerciseTolerance: ExerciseTolerance;
	occupation: string;
	pregnancyStatus: PregnancyStatus;
	// STOP-BANG subjective items
	snoresLoudly: YesNo;
	tiredDuringDay: YesNo;
	observedApnea: YesNo;
}

export interface VitalSigns {
	systolicBp: number | null;
	diastolicBp: number | null;
	heartRate: number | null;
	respiratoryRate: number | null;
	spo2: number | null;
	temperature: number | null;
	height: number | null;
	weight: number | null;
	bmi: number | null;
	neckCircumference: number | null;
}

export interface PhysicalExam {
	mallampatiClass: MallampatiClass;
	mouthOpening: number | null;
	thyromentalDistance: number | null;
	neckMobility: NeckMobility;
	dentitionIntact: boolean;
	dentitionDentures: boolean;
	dentitionLooseTeeth: boolean;
	dentitionCrowns: boolean;
	dentitionProminentIncisors: boolean;
	jawProtrusion: JawProtrusion;
	heartSounds: HeartSounds;
	peripheralEdema: PeripheralEdema;
	jvp: JVP;
	breathSounds: BreathSounds;
	accessoryMuscleUse: YesNo;
}

export interface InvestigationsAndPlan {
	fbcStatus: InvestigationStatus;
	fbcNotes: string;
	ueStatus: InvestigationStatus;
	ueNotes: string;
	lftsStatus: InvestigationStatus;
	lftsNotes: string;
	coagStatus: InvestigationStatus;
	coagNotes: string;
	hba1cStatus: InvestigationStatus;
	hba1cNotes: string;
	ecgStatus: InvestigationStatus;
	ecgNotes: string;
	cxrStatus: InvestigationStatus;
	cxrNotes: string;
	echoStatus: InvestigationStatus;
	echoNotes: string;
	otherInvestigation: string;
	otherInvestigationStatus: InvestigationStatus;
	// RCRI clinician confirmations (criteria 2, 3, 4, 6)
	rcriIschaemicHeartDisease: YesNo;
	rcriCongestiveHeartFailure: YesNo;
	rcriCerebrovascularDisease: YesNo;
	rcriHighCreatinine: YesNo;
	// ASA classification
	asaClass: AsaClass;
	emergencyCase: YesNo;
	// Anaesthetic plan
	proposedTechnique: AnaesthesiaType;
	airwayPlan: AirwayPlan;
	postOpDestination: PostOpDestination;
	specialRequirements: string;
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

export interface AssessmentData {
	demographics: Demographics;
	plannedSurgery: PlannedSurgery;
	medicalHistory: MedicalHistory;
	medications: Medications;
	allergies: Allergies;
	previousAnaesthesia: PreviousAnaesthesia;
	socialHistory: SocialHistory;
	vitalSigns: VitalSigns;
	physicalExam: PhysicalExam;
	investigationsAndPlan: InvestigationsAndPlan;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single rule that fired during scoring, carrying its own risk band. */
export interface FiredRule {
	id: string;
	category: string;
	description: string;
	riskLevel: RiskLevel;
}

/** Result of the ASA Physical Status sub-grader. */
export interface AsaResult {
	class: AsaClass;
	emergency: boolean;
	riskLevel: RiskLevel;
	firedRules: FiredRule[];
}

/** Result of the Mallampati / airway-difficulty sub-grader. */
export interface AirwayResult {
	mallampatiClass: MallampatiClass;
	mediumFactors: number;
	riskLevel: RiskLevel;
	firedRules: FiredRule[];
}

/** Result of the Revised Cardiac Risk Index (Lee) sub-grader. */
export interface RcriResult {
	score: number;
	macePercent: number;
	riskLevel: RiskLevel;
	firedRules: FiredRule[];
}

/** Result of the STOP-BANG OSA screening sub-grader. */
export interface StopbangResult {
	score: number;
	riskLevel: RiskLevel;
	firedRules: FiredRule[];
}

/** A safety-critical clinician-facing flag, independent of the four scores. */
export interface AdditionalFlag {
	id: string;
	category: string;
	message: string;
	priority: 'urgent' | 'high' | 'medium' | 'low';
}

/** Composite grading output consumed by the wizard, report, and dashboard. */
export interface GradingResult {
	asa: AsaResult;
	airway: AirwayResult;
	rcri: RcriResult;
	stopbang: StopbangResult;
	overallRisk: RiskLevel;
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
