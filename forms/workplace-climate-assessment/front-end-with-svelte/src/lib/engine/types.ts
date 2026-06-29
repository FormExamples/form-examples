// ──────────────────────────────────────────────
// Workplace Climate Assessment — core data types
// ──────────────────────────────────────────────
//
// The instrument uses 1-5 Likert items grouped into eight graded
// organisational domains (leadership, psychSafety, inclusion, communication,
// collaboration, recognition, wellbeing, career). Domain means are normalised
// to a 0-100 scale (mean × 20) and averaged into a single composite Workplace
// Climate Index. Step 1 (demographics) captures broad anonymised banding only
// and is NOT graded into the composite. Step 10 (overall) collects three
// Likert items, a recommend-as-place-to-work choice, and free-text feedback;
// its Likert items are reported but are NOT folded into the composite.

/** A 1-5 Likert response (or null when unanswered). */
export type LikertValue = 1 | 2 | 3 | 4 | 5 | null;

/** Climate category derived from a 0-100 score (or '' when unscored). */
export type ClimateCategory =
	| 'thriving'
	| 'healthy'
	| 'developing'
	| 'strained'
	| 'critical'
	| '';

export type Department =
	| ''
	| 'operations'
	| 'engineering'
	| 'sales-marketing'
	| 'customer-service'
	| 'finance'
	| 'human-resources'
	| 'administration'
	| 'clinical'
	| 'research'
	| 'leadership'
	| 'other';

export type TenureBand =
	| ''
	| 'less-than-1-year'
	| '1-to-3-years'
	| '3-to-5-years'
	| '5-to-10-years'
	| 'more-than-10-years';

export type HoursBand =
	| ''
	| 'part-time-under-20'
	| 'part-time-20-to-34'
	| 'full-time-35-to-44'
	| 'long-hours-45-plus';

export type RoleLevel =
	| ''
	| 'individual-contributor'
	| 'team-lead'
	| 'manager'
	| 'senior-manager'
	| 'director-or-above';

export type WorkLocation = '' | 'on-site' | 'hybrid' | 'remote';

export type RecommendChoice =
	| ''
	| 'definitely'
	| 'probably'
	| 'unsure'
	| 'probably-not'
	| 'definitely-not';

export interface Demographics {
	department: Department;
	tenureBand: TenureBand;
	hoursBand: HoursBand;
	roleLevel: RoleLevel;
	workLocation: WorkLocation;
}

export interface Leadership {
	ld1: LikertValue;
	ld2: LikertValue;
	ld3: LikertValue;
	ld4: LikertValue;
	ld5: LikertValue;
}

export interface PsychSafety {
	ps1: LikertValue;
	ps2: LikertValue;
	ps3: LikertValue;
	ps4: LikertValue;
	ps5: LikertValue;
}

export interface Inclusion {
	in1: LikertValue;
	in2: LikertValue;
	in3: LikertValue;
	in4: LikertValue;
	in5: LikertValue;
}

export interface Communication {
	co1: LikertValue;
	co2: LikertValue;
	co3: LikertValue;
	co4: LikertValue;
}

export interface Collaboration {
	cl1: LikertValue;
	cl2: LikertValue;
	cl3: LikertValue;
	cl4: LikertValue;
}

export interface Recognition {
	re1: LikertValue;
	re2: LikertValue;
	re3: LikertValue;
	re4: LikertValue;
}

export interface Wellbeing {
	we1: LikertValue;
	we2: LikertValue;
	we3: LikertValue;
	we4: LikertValue;
	we5: LikertValue;
}

export interface Career {
	ca1: LikertValue;
	ca2: LikertValue;
	ca3: LikertValue;
	ca4: LikertValue;
}

export interface OverallClimate {
	oc1: LikertValue;
	oc2: LikertValue;
	oc3: LikertValue;
	recommendAsPlaceToWork: RecommendChoice;
	biggestStrength: string;
	biggestImprovement: string;
	otherComments: string;
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

export interface AssessmentData {
	demographics: Demographics;
	leadership: Leadership;
	psychSafety: PsychSafety;
	inclusion: Inclusion;
	communication: Communication;
	collaboration: Collaboration;
	recognition: Recognition;
	wellbeing: Wellbeing;
	career: Career;
	overall: OverallClimate;
}

/** Keys of the eight graded domains, in canonical display order. */
export type GradedDomainKey =
	| 'leadership'
	| 'psychSafety'
	| 'inclusion'
	| 'communication'
	| 'collaboration'
	| 'recognition'
	| 'wellbeing'
	| 'career';

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

export interface DomainScore {
	/** Mean of 1-5 answers in this domain. */
	mean: number | null;
	/** Normalised 0-100 score (mean × 20). */
	score: number | null;
	/** Items answered in this domain. */
	answeredCount: number;
	/** Total items in this domain. */
	totalCount: number;
	/** Category derived from the 0-100 score. */
	category: ClimateCategory;
}

export type DomainScores = Record<GradedDomainKey, DomainScore>;

export interface FiredItem {
	id: string;
	domain: string;
	label: string;
	rawValue: number;
}

export interface AdditionalFlag {
	id: string;
	category: string;
	message: string;
	priority: 'high' | 'medium' | 'low';
}

export interface GradingResult {
	/** 0-100 composite climate index. */
	compositeScore: number | null;
	/** Composite category. */
	category: ClimateCategory;
	domainScores: DomainScores;
	/** Total graded Likert items answered. */
	answeredCount: number;
	/** Total graded Likert items. */
	totalCount: number;
	firedRules: FiredItem[];
	additionalFlags: AdditionalFlag[];
	timestamp: string;
}

// ──────────────────────────────────────────────
// Survey item / domain registry types
// ──────────────────────────────────────────────

export interface SurveyItem {
	id: string;
	domain: string;
	label: string;
	scaleMin: 1;
	scaleMax: 5;
}

export interface DomainMeta {
	key: string;
	title: string;
	stepNumber: number;
	graded: boolean;
	description: string;
}

export interface LikertOption {
	value: number;
	label: string;
}

export interface ChoiceOption {
	value: string;
	label: string;
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
