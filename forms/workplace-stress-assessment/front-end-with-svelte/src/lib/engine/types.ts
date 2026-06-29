// ──────────────────────────────────────────────
// Workplace Stress Assessment — data + grading types
//
// UK HSE Management Standards Indicator Tool (35 items, 1-5 Likert scale)
// across seven organisational domains. Each domain mean (after reverse-coding
// negatively-worded items) is benchmarked against HSE percentile cut-offs to
// produce a concern category; the worst domain category is the overall risk.
// ──────────────────────────────────────────────

/** A single Likert response, 1-5, or `null` when unanswered. */
export type LikertValue = 1 | 2 | 3 | 4 | 5 | null;

/** Concern category for a domain (or overall). `''` = not yet determined. */
export type RiskLevel = 'low' | 'moderate' | 'high' | 'very-high' | '';

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

/** The seven HSE domain keys, in canonical order. */
export type DomainKey =
	| 'demands'
	| 'control'
	| 'managerSupport'
	| 'peerSupport'
	| 'relationships'
	| 'role'
	| 'change';

export interface Demographics {
	department: Department;
	tenureBand: TenureBand;
	hoursBand: HoursBand;
}

export interface Demands {
	dem1: LikertValue;
	dem2: LikertValue;
	dem3: LikertValue;
	dem4: LikertValue;
	dem5: LikertValue;
	dem6: LikertValue;
	dem7: LikertValue;
	dem8: LikertValue;
}

export interface Control {
	ctrl1: LikertValue;
	ctrl2: LikertValue;
	ctrl3: LikertValue;
	ctrl4: LikertValue;
	ctrl5: LikertValue;
	ctrl6: LikertValue;
}

export interface ManagerSupport {
	ms1: LikertValue;
	ms2: LikertValue;
	ms3: LikertValue;
	ms4: LikertValue;
	ms5: LikertValue;
}

export interface PeerSupport {
	ps1: LikertValue;
	ps2: LikertValue;
	ps3: LikertValue;
	ps4: LikertValue;
}

export interface Relationships {
	rel1: LikertValue;
	rel2: LikertValue;
	rel3: LikertValue;
	rel4: LikertValue;
}

export interface Role {
	role1: LikertValue;
	role2: LikertValue;
	role3: LikertValue;
	role4: LikertValue;
	role5: LikertValue;
}

export interface Change {
	chg1: LikertValue;
	chg2: LikertValue;
	chg3: LikertValue;
}

export interface AdditionalComments {
	mostStressfulAspect: string;
	suggestionsForImprovement: string;
	otherComments: string;
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

export interface AssessmentData {
	demographics: Demographics;
	demands: Demands;
	control: Control;
	managerSupport: ManagerSupport;
	peerSupport: PeerSupport;
	relationships: Relationships;
	role: Role;
	change: Change;
	additionalComments: AdditionalComments;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

export interface DomainResult {
	/** Mean of all answered, reverse-coded items in the domain (1.00-5.00). */
	mean: number | null;
	/** Items answered in this domain. */
	answeredCount: number;
	/** Total items in this domain. */
	totalCount: number;
	/** Concern category derived from the mean against HSE benchmarks. */
	category: RiskLevel;
}

export type DomainResults = Record<DomainKey, DomainResult>;

/** Per-item audit-trail entry for an answered item. */
export interface FiredItem {
	id: string;
	domain: DomainKey;
	label: string;
	rawValue: number;
	effectiveValue: number;
	reverseScored: boolean;
}

export interface AdditionalFlag {
	id: string;
	category: string;
	message: string;
	priority: 'high' | 'medium' | 'low';
}

export interface GradingResult {
	domains: DomainResults;
	/** Worst (highest concern) of the seven domain categories. */
	overallRisk: RiskLevel;
	/** Total items answered across all domains (max 35). */
	answeredCount: number;
	/** Per-item audit trail. */
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
