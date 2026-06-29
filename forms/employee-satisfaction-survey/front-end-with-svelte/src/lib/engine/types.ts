// ──────────────────────────────────────────────
// Employee Satisfaction Survey — core data types
// ──────────────────────────────────────────────
//
// The instrument uses 1-5 Likert items grouped into eight graded employment
// domains (workload, management, growth, compensation, culture, environment,
// recognition, overall). Domain means are normalised to a 0-100 scale
// (mean × 20) and averaged into a single composite score. Step 10 also
// collects an eNPS-style 0-10 "would you recommend us as an employer"
// question and a retention-intent dropdown.

/** A 1-5 Likert response, or `null` when unanswered. */
export type LikertValue = 1 | 2 | 3 | 4 | 5 | null;

/** A raw 0-10 employee Net Promoter Score response, or `null` when unanswered. */
export type ENpsValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | null;

/** A normalised 0-100 satisfaction band. */
export type SatisfactionCategory =
	| 'excellent'
	| 'good'
	| 'satisfactory'
	| 'poor'
	| 'very-poor'
	| '';

/** eNPS classification derived from the raw 0-10 recommend score. */
export type ENpsClassification = 'promoter' | 'passive' | 'detractor' | '';

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

export type RetentionIntent =
	| ''
	| 'definitely-stay'
	| 'probably-stay'
	| 'unsure'
	| 'probably-leave-12-months'
	| 'leaving-within-6-months';

export interface Demographics {
	department: Department;
	tenureBand: TenureBand;
	hoursBand: HoursBand;
}

export interface RoleTenure {
	roleLevel: RoleLevel;
	workLocation: WorkLocation;
	rt1: LikertValue;
	rt2: LikertValue;
}

export interface Workload {
	wl1: LikertValue;
	wl2: LikertValue;
	wl3: LikertValue;
	wl4: LikertValue;
	wl5: LikertValue;
}

export interface Management {
	mg1: LikertValue;
	mg2: LikertValue;
	mg3: LikertValue;
	mg4: LikertValue;
	mg5: LikertValue;
}

export interface Growth {
	gr1: LikertValue;
	gr2: LikertValue;
	gr3: LikertValue;
	gr4: LikertValue;
}

export interface Compensation {
	cb1: LikertValue;
	cb2: LikertValue;
	cb3: LikertValue;
	cb4: LikertValue;
}

export interface Culture {
	cu1: LikertValue;
	cu2: LikertValue;
	cu3: LikertValue;
	cu4: LikertValue;
	cu5: LikertValue;
}

export interface Environment {
	en1: LikertValue;
	en2: LikertValue;
	en3: LikertValue;
	en4: LikertValue;
}

export interface Recognition {
	rc1: LikertValue;
	rc2: LikertValue;
	rc3: LikertValue;
	rc4: LikertValue;
}

export interface OverallExperience {
	ov1: LikertValue;
	ov2: LikertValue;
	ov3: LikertValue;
	ov4: LikertValue;
	recommendScore: ENpsValue;
	retentionIntent: RetentionIntent;
	suggestionsForImprovement: string;
	otherComments: string;
}

// ──────────────────────────────────────────────
// Full survey data model
// ──────────────────────────────────────────────

export interface AssessmentData {
	demographics: Demographics;
	roleTenure: RoleTenure;
	workload: Workload;
	management: Management;
	growth: Growth;
	compensation: Compensation;
	culture: Culture;
	environment: Environment;
	recognition: Recognition;
	overall: OverallExperience;
}

/** A graded domain key (the keys that contribute to the composite score). */
export type GradedDomainKey =
	| 'workload'
	| 'management'
	| 'growth'
	| 'compensation'
	| 'culture'
	| 'environment'
	| 'recognition'
	| 'overall';

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

export interface DomainScore {
	/** Mean of the 1-5 answers in this domain (rounded to 2dp), or `null`. */
	mean: number | null;
	/** Normalised 0-100 score (mean × 20, rounded to 1dp), or `null`. */
	score: number | null;
	/** Number of items answered in this domain. */
	answeredCount: number;
	/** Total number of items in this domain. */
	totalCount: number;
	/** Category derived from the 0-100 score. */
	category: SatisfactionCategory;
}

export type DomainScores = Record<GradedDomainKey, DomainScore>;

export interface ENpsResult {
	score: ENpsValue;
	classification: ENpsClassification;
}

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
	compositeScore: number | null;
	category: SatisfactionCategory;
	domainScores: DomainScores;
	eNPS: ENpsResult;
	answeredCount: number;
	totalCount: number;
	firedRules: FiredItem[];
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
