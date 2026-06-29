// ──────────────────────────────────────────────
// Core checklist data types — First Aid at Work (FAW) competency assessment
// ──────────────────────────────────────────────

/**
 * Tri-state checklist response.
 *  - 'yes' : skill demonstrated correctly (passes the rule)
 *  - 'no'  : skill not yet demonstrated / failed (deficiency)
 *  - 'na'  : item not assessed in this session (excluded from grading)
 *  - ''    : examiner has not yet recorded an answer (excluded)
 */
export type TriState = 'yes' | 'no' | 'na' | '';

/** Workplace role / cohort of the trainee under assessment. */
export type TraineeRole =
	| 'first-aider'
	| 'workplace-first-aider'
	| 'instructor-candidate'
	| 'security-officer'
	| 'lifeguard'
	| 'teacher'
	| 'volunteer'
	| 'other'
	| '';

/** Overall HSE First Aid at Work outcome. */
export type Outcome = 'pass' | 'needs-development' | 'fail' | '';

export interface TraineeDetails {
	firstName: string;
	lastName: string;
	traineeId: string;
	role: TraineeRole;
	priorCertificationExpiry: string;
	sessionDate: string;
	examinerName: string;
	venue: string;
}

export interface SceneAssessmentSafety {
	sceneSafe: TriState;
	ppeApplied: TriState;
	hazardsIdentified: TriState;
	bystandersControlled: TriState;
}

export interface PrimarySurveyDRABC {
	dangerCheck: TriState;
	responseCheck: TriState;
	airwayManagement: TriState;
	breathingCheck: TriState;
	circulationAssessment: TriState;
	recoveryPositionWhenAppropriate: TriState;
}

export interface CprAed {
	effectiveCompressions: TriState;
	effectiveVentilations: TriState;
	ratio30to2: TriState;
	aedPowerOnPromptly: TriState;
	aedPadPlacement: TriState;
	aedSafeShockDelivery: TriState;
}

export interface ChokingManagement {
	encouragedCoughing: TriState;
	fiveBackBlows: TriState;
	fiveAbdominalThrusts: TriState;
	alternatesUntilDislodged: TriState;
	unconsciousChokingCpr: TriState;
}

export interface BleedingWoundCare {
	directPressureApplied: TriState;
	elevatedAndImmobilised: TriState;
	appliedDressingCorrectly: TriState;
	tourniquetWhenIndicated: TriState;
	haemostaticDressingApplied: TriState;
	treatedForShock: TriState;
}

export interface BurnsScalds {
	cooledForTwentyMinutes: TriState;
	removedJewelleryAndLooseClothing: TriState;
	coveredWithClingFilmOrSterileDressing: TriState;
	avoidedCreamsOrIce: TriState;
	referredAppropriately: TriState;
}

export interface FracturesSprainsSpinal {
	immobilisedInjuredLimb: TriState;
	appliedRiceForSprains: TriState;
	suspectedSpinalManualSupport: TriState;
	performedLogRollWithTeam: TriState;
	avoidedUnnecessaryMovement: TriState;
}

export interface MedicalEmergencies {
	recognisedAnaphylaxis: TriState;
	administeredEpiPenSafely: TriState;
	assistedAsthmaInhaler: TriState;
	managedHypoglycaemia: TriState;
	managedSeizureSafely: TriState;
	recognisedStrokeFAST: TriState;
	recognisedChestPain: TriState;
}

export interface RecordingReportingHandover {
	accidentBookEntry: TriState;
	riddorAwareness: TriState;
	structuredHandoffSbar: TriState;
	confidentialityMaintained: TriState;
	examinerNotes: string;
	traineeFeedback: string;
	debriefNotes: string;
}

// ──────────────────────────────────────────────
// Full checklist data model
// ──────────────────────────────────────────────

export interface AssessmentData {
	traineeDetails: TraineeDetails;
	sceneAssessmentSafety: SceneAssessmentSafety;
	primarySurveyDRABC: PrimarySurveyDRABC;
	cprAed: CprAed;
	chokingManagement: ChokingManagement;
	bleedingWoundCare: BleedingWoundCare;
	burnsScalds: BurnsScalds;
	fracturesSprainsSpinal: FracturesSprainsSpinal;
	medicalEmergencies: MedicalEmergencies;
	recordingReportingHandover: RecordingReportingHandover;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A declarative competency rule mapping one observed skill to a tri-state. */
export interface FawRule {
	id: string;
	step: number;
	category: string;
	label: string;
	critical: boolean;
	evaluate: (data: AssessmentData) => TriState;
}

/** A rule after evaluation, carrying the recorded tri-state status. */
export interface FiredRule {
	id: string;
	step: number;
	category: string;
	description: string;
	critical: boolean;
	status: TriState;
}

export interface AdditionalFlag {
	id: string;
	category: string;
	message: string;
	priority: 'high' | 'medium' | 'low';
}

export interface GradingResult {
	outcome: Outcome;
	criticalFailures: FiredRule[];
	deficiencies: FiredRule[];
	firedRules: FiredRule[];
	additionalFlags: AdditionalFlag[];
	answeredCount: number;
	passedCount: number;
	totalRules: number;
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
