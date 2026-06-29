// ──────────────────────────────────────────────
// Core BLS Skills Verification data types
// ──────────────────────────────────────────────

/**
 * Tri-state checklist response.
 *  - 'yes' : skill demonstrated correctly
 *  - 'no'  : skill not yet demonstrated / failed
 *  - 'na'  : item not assessed in this session
 *  - ''    : examiner has not yet recorded an answer
 */
export type TriState = 'yes' | 'no' | 'na' | '';

export type TraineeRole =
	| 'instructor'
	| 'first-responder'
	| 'nurse'
	| 'paramedic'
	| 'physician'
	| 'other'
	| '';

/** Overall pass/fail outcome of the skills verification. */
export type Outcome = 'pass' | 'fail' | '';

export interface TraineeDetails {
	firstName: string;
	lastName: string;
	traineeId: string;
	role: TraineeRole;
	/** ISO date string or ''. */
	priorCertificationExpiry: string;
	sessionDate: string;
	examinerName: string;
}

export interface SceneSafety {
	sceneSafe: TriState;
	ppeApplied: TriState;
	hazardsIdentified: TriState;
	bystandersControlled: TriState;
}

export interface ResponsivenessBreathing {
	tappedAndShouted: TriState;
	checkedBreathing: TriState;
	checkedPulseSimultaneously: TriState;
	timeWithinTenSeconds: TriState;
}

export interface ActivateEmergencyResponse {
	calledEmergencyNumber: TriState;
	statedLocationAndCondition: TriState;
	designatedAedRetriever: TriState;
	usedSpeakerphone: TriState;
}

export interface ChestCompressions {
	/** Per minute. */
	compressionRate: number | null;
	/** Centimetres. */
	compressionDepth: number | null;
	correctHandPosition: TriState;
	fullChestRecoil: TriState;
	minimisedInterruptions: TriState;
	/** Critical action. */
	compressionsAtCorrectRate: TriState;
	/** Critical action. */
	compressionsAtCorrectDepth: TriState;
}

export interface AirwayRescueBreaths {
	headTiltChinLift: TriState;
	effectiveSeal: TriState;
	/** Critical action (effective ventilation). */
	visibleChestRise: TriState;
	oneSecondPerBreath: TriState;
	ratio30to2: TriState;
	avoidedExcessiveVentilation: TriState;
}

export interface AedShockDelivery {
	poweredOnPromptly: TriState;
	correctPadPlacement: TriState;
	clearedDuringAnalysis: TriState;
	/** Critical action (no unsafe contact). */
	deliveredShockSafely: TriState;
	resumedCompressionsImmediately: TriState;
	/** Seconds. */
	timeToFirstShockSeconds: number | null;
}

export interface TeamDynamicsHandoff {
	clearCommunication: TriState;
	closedLoopOrders: TriState;
	appropriateHandoff: TriState;
	debriefParticipated: TriState;
	examinerNotes: string;
	traineeFeedback: string;
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

export interface AssessmentData {
	traineeDetails: TraineeDetails;
	sceneSafety: SceneSafety;
	responsivenessBreathing: ResponsivenessBreathing;
	activateEmergencyResponse: ActivateEmergencyResponse;
	chestCompressions: ChestCompressions;
	airwayRescueBreaths: AirwayRescueBreaths;
	aedShockDelivery: AedShockDelivery;
	teamDynamicsHandoff: TeamDynamicsHandoff;
}

// ──────────────────────────────────────────────
// BLS grading types
// ──────────────────────────────────────────────

export interface BLSRule {
	id: string;
	step: number;
	category: string;
	label: string;
	critical: boolean;
	defaultExpectation: TriState;
	evaluate: (data: AssessmentData) => TriState;
}

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
	nonCriticalDeficiencies: FiredRule[];
	firedRules: FiredRule[];
	additionalFlags: AdditionalFlag[];
	answeredCount: number;
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
