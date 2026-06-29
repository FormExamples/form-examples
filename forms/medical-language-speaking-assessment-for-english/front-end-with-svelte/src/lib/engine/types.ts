// ──────────────────────────────────────────────
// Core assessment data types
//
// Models the Occupational English Test (OET) Speaking sub-test (Medicine
// profession): two role-play scenarios assessed against four linguistic
// criteria (0-6 band scale) and five clinical-communication criteria (0-3
// band scale). The engine scales the combined raw band total to the OET
// 0-500 score and derives the letter grade A–E.
// ──────────────────────────────────────────────

/** A linguistic criterion band: OET uses a 0-6 scale; null = not yet rated. */
export type LinguisticBand = 0 | 1 | 2 | 3 | 4 | 5 | 6 | null;
/** A clinical-communication criterion band: 0-3 scale; null = not yet rated. */
export type CommunicationBand = 0 | 1 | 2 | 3 | null;

/** Healthcare profession of the candidate sitting the Medicine sub-test. */
export type Profession =
	| 'medicine'
	| 'nursing'
	| 'dentistry'
	| 'pharmacy'
	| 'physiotherapy'
	| 'other'
	| '';

export type YesNo = 'yes' | 'no' | '';

export interface CandidateDetails {
	candidateNumber: string;
	firstName: string;
	lastName: string;
	dateOfTest: string;
	profession: Profession;
	firstLanguage: string;
	testVenue: string;
	assessorName: string;
}

/** A single role-play scenario (Interview / Clinical explanation). */
export interface RolePlay {
	setting: string;
	patientRole: string;
	candidateTask: string;
	notes: string;
	completed: YesNo;
}

/** The four linguistic criteria, each scored 0-6. */
export interface LinguisticCriteria {
	intelligibility: LinguisticBand;
	fluency: LinguisticBand;
	appropriatenessOfLanguage: LinguisticBand;
	resourcesOfGrammarAndExpression: LinguisticBand;
}

/** The five clinical-communication criteria, each scored 0-3. */
export interface ClinicalCommunication {
	relationshipBuilding: CommunicationBand;
	understandingPatientPerspective: CommunicationBand;
	providingStructure: CommunicationBand;
	informationGathering: CommunicationBand;
	informationGiving: CommunicationBand;
	examinerComments: string;
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

export interface AssessmentData {
	candidateDetails: CandidateDetails;
	rolePlay1: RolePlay;
	rolePlay2: RolePlay;
	linguisticCriteria: LinguisticCriteria;
	clinicalCommunication: ClinicalCommunication;
}

// ──────────────────────────────────────────────
// OET grading types
// ──────────────────────────────────────────────

/** The OET letter grade (Medicine speaking sub-test). */
export type OetGrade = 'A' | 'B' | 'C+' | 'C' | 'D' | 'E';

/** Registration-relevant outcome derived from the grade. */
export type Outcome = 'pass' | 'refer';

export interface OetRule {
	id: string;
	criterion: string;
	description: string;
	/** Severity 1 (minor) – 4 (severe weakness), used for the report Badge. */
	grade: number;
	evaluate: (data: AssessmentData) => boolean;
}

export interface FiredRule {
	id: string;
	criterion: string;
	description: string;
	grade: number;
}

export interface AdditionalFlag {
	id: string;
	category: string;
	message: string;
	priority: 'high' | 'medium' | 'low';
}

export interface GradingResult {
	/** Sum of the four linguistic bands (0-24). */
	linguisticTotal: number;
	linguisticMax: number;
	/** Sum of the five clinical-communication bands (0-15). */
	communicationTotal: number;
	communicationMax: number;
	/** Combined raw band total (0-39). */
	rawTotal: number;
	/** OET 0-500 scaled score. */
	score: number;
	grade: OetGrade;
	outcome: Outcome;
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
