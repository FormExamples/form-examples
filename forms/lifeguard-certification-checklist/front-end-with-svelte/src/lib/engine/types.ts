// ──────────────────────────────────────────────
// Core assessment data types
//
// Lifeguard Certification Checklist (RLSS UK NPLQ / ILSF-aligned Competency
// Verification). Each observed competency is recorded as a tri-state value and
// the engine grades the candidate Pass / Needs Development / Fail.
// ──────────────────────────────────────────────

/**
 * Tri-state checklist response.
 *  - 'yes' : skill demonstrated correctly
 *  - 'no'  : skill not yet demonstrated / failed
 *  - 'na'  : item not assessed in this session
 *  - ''    : examiner has not yet recorded an answer
 */
export type TriState = 'yes' | 'no' | 'na' | '';

export type VenueType =
	| 'pool'
	| 'beach'
	| 'inland-water'
	| 'water-park'
	| 'leisure'
	| 'other'
	| '';

export type AssessmentType =
	| 'initial'
	| 'requalification'
	| 'cross-over'
	| 'in-service'
	| 'other'
	| '';

export type Outcome = 'pass' | 'needs-development' | 'fail' | '';

export interface CandidateDetails {
	firstName: string;
	lastName: string;
	candidateId: string;
	dateOfBirth: string;
	venueType: VenueType;
	venueName: string;
	assessmentType: AssessmentType;
	priorCertificationExpiry: string;
	sessionDate: string;
	examinerName: string;
	examinerLicenceNumber: string;
}

export interface PhysicalFitnessSwim {
	swim50mTimeSeconds: number | null;
	swim50mWithinTime: TriState;
	surfaceDiveDepthMetres: number | null;
	sustainedSurfaceDive: TriState;
	swim200mTimeSeconds: number | null;
	swim200mMixedStrokes: TriState;
	treadWaterTwoMinutes: TriState;
	towCasualty50m: TriState;
}

export interface SupervisionScanningZoning {
	understandsZoneOfResponsibility: TriState;
	effectiveScanningPattern: TriState;
	tenTwentyScanRule: TriState;
	recognisesDistressedSwimmer: TriState;
	appropriateRotation: TriState;
	usesWhistleAndSignals: TriState;
}

export interface RescueConscious {
	recognitionAndAlert: TriState;
	entryWithoutLossOfSight: TriState;
	approachWithFloatingAid: TriState;
	reassuresCasualty: TriState;
	towToSafety: TriState;
	extricationFromWater: TriState;
}

export interface RescueUnconscious {
	recognitionAndAlert: TriState;
	safeEntryAndApproach: TriState;
	airwayManagementInWater: TriState;
	effectiveTowToSafety: TriState;
	safeExtrication: TriState;
	handoverHandsignal: TriState;
}

export interface SpinalInjuryManagement {
	recognisesMechanism: TriState;
	headSplintHold: TriState;
	maintainsInlineStabilisation: TriState;
	carefulRollIfNeeded: TriState;
	useOfSpineboard: TriState;
	secureCasualtyToBoard: TriState;
}

export interface CprAed {
	compressionRate: number | null;
	compressionDepth: number | null;
	effectiveCompressions: TriState;
	effectiveVentilations: TriState;
	timeToFirstShockSeconds: number | null;
	aedDeliveredPromptly: TriState;
	safeShockNoUnsafeContact: TriState;
	continuousQualityCpr: TriState;
}

export interface FirstAidOxygen {
	bleedingControl: TriState;
	burnsManagement: TriState;
	fractureImmobilisation: TriState;
	recoveryPositionUse: TriState;
	oxygenTherapyAdministration: TriState;
	usesPocketMaskOrBVM: TriState;
}

export interface LegalRegulatoryIncident {
	dutyOfCareUnderstood: TriState;
	pswpKnowledge: TriState;
	eapInvocation: TriState;
	incidentReportCompleted: TriState;
	riddorAwareness: TriState;
	safeguardingChildrenAdults: TriState;
}

export interface OverallResultSignoff {
	examinerOutcome: Outcome;
	strengths: string;
	developmentAreas: string;
	examinerNotes: string;
	candidateFeedback: string;
	candidateAcknowledged: TriState;
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

export interface AssessmentData {
	candidateDetails: CandidateDetails;
	physicalFitnessSwim: PhysicalFitnessSwim;
	supervisionScanningZoning: SupervisionScanningZoning;
	rescueConscious: RescueConscious;
	rescueUnconscious: RescueUnconscious;
	spinalInjuryManagement: SpinalInjuryManagement;
	cprAed: CprAed;
	firstAidOxygen: FirstAidOxygen;
	legalRegulatoryIncident: LegalRegulatoryIncident;
	overallResultSignoff: OverallResultSignoff;
}

// ──────────────────────────────────────────────
// Lifeguard grading types
// ──────────────────────────────────────────────

export interface LifeguardRule {
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
	deficiencies: FiredRule[];
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
