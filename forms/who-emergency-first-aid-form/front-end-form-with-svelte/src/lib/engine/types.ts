// ──────────────────────────────────────────────
// Core WHO Emergency First Aid form data types
// ──────────────────────────────────────────────

/** Yes / No / Unknown enum used for pregnancy status. */
export type YesNoUnknown = 'yes' | 'no' | 'unknown' | '';

/** Sex assigned for clinical purposes. */
export type Sex = 'male' | 'female' | 'unknown' | '';

// ──────────────────────────────────────────────
// Step 1 — Patient Identification
// ──────────────────────────────────────────────

export interface ContactPerson {
	name: string;
	contactInformation: string;
}

export interface PatientIdentification {
	patientName: string;
	dateOfBirth: string;
	age: number | null;
	sex: Sex;
	patientContactInformation: string;
	contactPerson: ContactPerson;
}

// ──────────────────────────────────────────────
// Step 2 — Referral & Transport
// ──────────────────────────────────────────────

export interface ReferralFacility {
	name: string;
	focalPoint: string;
	phoneNumber: string;
}

export interface AmbulanceService {
	name: string;
	focalPoint: string;
	phoneNumber: string;
}

export interface ReferralTransport {
	referralFacility: ReferralFacility;
	ambulance: AmbulanceService;
	eventDateTime: string;
	departureDateTime: string;
}

// ──────────────────────────────────────────────
// Step 3 — Situation
// ──────────────────────────────────────────────

export interface Situation {
	medical: boolean;
	trauma: boolean;
	pregnant: YesNoUnknown;
	whatHappened: string;
}

// ──────────────────────────────────────────────
// Step 4 — Background
// ──────────────────────────────────────────────

export interface Background {
	pastMedicalAndSurgicalHistory: string;
	currentMedicationsOrAllergies: string;
}

// ──────────────────────────────────────────────
// Step 5 — Major Bleeding (C)
// ──────────────────────────────────────────────

export interface MajorBleedingInterventions {
	directPressure: boolean;
	deepWoundPacking: boolean;
	tourniquet: boolean;
	tourniquetApplicationTime: string;
	uterineMassage: boolean;
	none: boolean;
}

export interface MajorBleeding {
	assessmentNormal: boolean;
	assessmentFindings: string;
	interventions: MajorBleedingInterventions;
}

// ──────────────────────────────────────────────
// Step 6 — Airway (A)
// ──────────────────────────────────────────────

export interface AirwayInterventions {
	neckImmobilization: boolean;
	headTiltChinLift: boolean;
	jawThrust: boolean;
	chokingCare: boolean;
	none: boolean;
}

export interface Airway {
	assessmentNormal: boolean;
	assessmentFindings: string;
	interventions: AirwayInterventions;
}

// ──────────────────────────────────────────────
// Step 7 — Breathing (B)
// ──────────────────────────────────────────────

export interface BreathingInterventions {
	maintainedPositionOfComfort: boolean;
	none: boolean;
}

export interface Breathing {
	assessmentNormal: boolean;
	assessmentFindings: string;
	interventions: BreathingInterventions;
}

// ──────────────────────────────────────────────
// Step 8 — Circulation (C)
// ──────────────────────────────────────────────

export interface CirculationInterventions {
	pelvicBinder: boolean;
	controlMinorBleeding: boolean;
	fractureCare: boolean;
	oralHydration: boolean;
	leftLateralPosition: boolean;
	none: boolean;
}

export interface Circulation {
	assessmentNormal: boolean;
	assessmentFindings: string;
	interventions: CirculationInterventions;
}

// ──────────────────────────────────────────────
// Step 9 — Disability (D)
// ──────────────────────────────────────────────

export interface DisabilityInterventions {
	spinalImmobilisation: boolean;
	glucoseGiven: boolean;
	seizureCare: boolean;
	highTemperatureCare: boolean;
	lowTemperatureCare: boolean;
	none: boolean;
}

export interface Disability {
	assessmentNormal: boolean;
	assessmentFindings: string;
	interventions: DisabilityInterventions;
}

// ──────────────────────────────────────────────
// Step 10 — Exposure / Other (E)
// ──────────────────────────────────────────────

export interface ExposureInterventions {
	recoveryPosition: boolean;
	burnCare: boolean;
	woundCare: boolean;
	drowningCare: boolean;
	snakebiteCare: boolean;
	none: boolean;
}

export interface Exposure {
	assessmentNormal: boolean;
	assessmentFindings: string;
	interventions: ExposureInterventions;
	medicationTakenNone: boolean;
	medicationTakenDetails: string;
}

// ──────────────────────────────────────────────
// Step 11 — Recommendations
// ──────────────────────────────────────────────

export interface Precautions {
	highlyInfectiousDisease: boolean;
	spinalImmobilization: boolean;
	possibleFracture: boolean;
	fallRisk: boolean;
	alteredMentalStatus: boolean;
	other: boolean;
	otherDetails: string;
}

export interface Recommendations {
	transportPlan: string;
	problemsAnticipated: string;
	otherConcerns: string;
	precautions: Precautions;
}

// ──────────────────────────────────────────────
// Step 12 — Responder Details (CFAR)
// ──────────────────────────────────────────────

export interface ResponderDetails {
	name: string;
	signature: string;
	contactInformation: string;
	cfarOrganization: string;
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

export interface AssessmentData {
	patientIdentification: PatientIdentification;
	referralTransport: ReferralTransport;
	situation: Situation;
	background: Background;
	majorBleeding: MajorBleeding;
	airway: Airway;
	breathing: Breathing;
	circulation: Circulation;
	disability: Disability;
	exposure: Exposure;
	recommendations: Recommendations;
	responderDetails: ResponderDetails;
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
	/** True if the rule applies given the conditional logic of the form. */
	applies: (data: AssessmentData) => boolean;
	/** True if the rule is satisfied; false if it has fired (i.e. is incomplete). */
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
