// ──────────────────────────────────────────────
// Core assessment data types — clinical Welsh-language (Cymraeg) speaking
// assessment (NHS Wales "More Than Just Words"; CEFR-mapped, OET-style bands).
// ──────────────────────────────────────────────

/** OET-style grade band, CEFR-mapped. Empty string = not yet graded. */
export type OETGrade = 'A' | 'B' | 'C+' | 'C' | 'D' | 'E' | '';

/** Years-of-experience bucket. */
export type YearsBucket = '0-2' | '3-5' | '6-10' | '11+' | '';

/** How safety-critical the role-play scenario is. */
export type SafetyCriticality = 'low' | 'standard' | 'high' | '';

export interface CandidateDetails {
	candidateId: string;
	candidateName: string;
	examinerName: string;
	testCentre: string;
	testDate: string;
	/** Always 'medicine' for this form. */
	profession: string;
	firstLanguage: string;
	countryOfTraining: string;
	yearsOfExperience: YearsBucket;
}

export interface RolePlayContext {
	scenarioTitle: string;
	scenarioSummary: string;
	patientRole: string;
	setting: string;
	safetyCriticality: SafetyCriticality;
	examinerNotes: string;
}

/** Linguistic ratings are 0-6 per criterion, captured per role-play. */
export interface LinguisticRating {
	fluency: number | null;
	grammar: number | null;
	pronunciation: number | null;
	clinicalAppropriateness: number | null;
}

/** Clinical communication indicators are rated 0-3 across the assessment. */
export interface ClinicalIndicators {
	relationshipBuilding: number | null;
	understandingPatientPerspective: number | null;
	providingStructure: number | null;
	informationGathering: number | null;
	informationGiving: number | null;
	examinerNotes: string;
}

/** The full assessment data model. */
export interface AssessmentData {
	candidate: CandidateDetails;
	rolePlay1: RolePlayContext;
	rolePlay2: RolePlayContext;
	linguisticRolePlay1: LinguisticRating;
	linguisticRolePlay2: LinguisticRating;
	clinicalIndicators: ClinicalIndicators;
}

// ──────────────────────────────────────────────
// Criterion registry types
// ──────────────────────────────────────────────

export type CriterionDomain = 'linguistic' | 'clinical';

/** A field name on LinguisticRating. */
export type LinguisticField = keyof Omit<LinguisticRating, never>;
/** A field name on ClinicalIndicators (excluding the free-text notes). */
export type ClinicalField = Exclude<keyof ClinicalIndicators, 'examinerNotes'>;

export interface Anchor {
	value: number;
	label: string;
	description: string;
}

export interface Criterion {
	id: string;
	domain: CriterionDomain;
	label: string;
	description: string;
	maxScore: number;
	/** Property name on LinguisticRating or ClinicalIndicators. */
	dataField: string;
}

export interface CriterionWithAnchors extends Criterion {
	anchors: Anchor[];
}

// ──────────────────────────────────────────────
// Grading result types
// ──────────────────────────────────────────────

export interface CriterionScore {
	id: string;
	domain: CriterionDomain;
	label: string;
	maxScore: number;
	rolePlay1Score: number | null;
	rolePlay2Score: number | null;
	meanScore: number | null;
}

export interface FiredRule {
	id: string;
	category: string;
	description: string;
	score: number;
}

export interface AdditionalFlag {
	id: string;
	category: string;
	message: string;
	priority: 'high' | 'medium' | 'low';
}

export interface GradingResult {
	/** 0-24 (mean across role-plays, summed over the 4 linguistic criteria). */
	linguisticTotal: number;
	/** 0-15 (summed over the 5 clinical indicators). */
	clinicalTotal: number;
	/** 0-39 (linguistic + clinical). */
	rawTotal: number;
	/** 0-500 scaled score. */
	scaledScore: number;
	grade: OETGrade;
	perCriterionScores: CriterionScore[];
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
