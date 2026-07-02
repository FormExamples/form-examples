// ──────────────────────────────────────────────
// Core data model (Child Safeguarding Referral).
//
// A structured referral to children's social care when a professional believes
// a child may be at risk of harm. camelCase property names mirror the
// snake_case SQL columns in `sql/04_create_table_child_safeguarding_referral.sql`
// (the referrer identity and core child demographics — which the SQL model keeps
// in the `clinician` and `patient` tables — are carried here on the referral
// object as the front-end contract in spec §3).
//
// Unlike a scored assessment, this is a documentation-completeness and
// risk-classification instrument: the engine grades a referral's completeness
// (`complete` / `partial` / `incomplete`) with a completeness percentage,
// classifies its urgency (`emergency` / `urgent` / `standard`), records which
// grading rules fired, and raises safeguarding flags. There is no numeric
// clinical score.
// ──────────────────────────────────────────────

export type YesNo = 'yes' | 'no' | '';
export type YesNoUnknown = 'yes' | 'no' | 'unknown' | '';
export type ChildSex = 'female' | 'male' | 'other' | 'unknown' | '';
export type PrimaryCategory = 'physical' | 'emotional' | 'sexual' | 'neglect' | '';
export type ConsentStatus = 'given' | 'refused' | 'not-sought' | '';
export type SharingBasis =
	| 'risk-of-serious-harm'
	| 'seeking-consent-increases-risk'
	| 'not-applicable'
	| '';
export type Status = 'complete' | 'partial' | 'incomplete';
export type Urgency = 'emergency' | 'urgent' | 'standard';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — referrer details. Identity of the professional making the referral. */
export interface Referrer {
	referrerName: string;
	referrerRole: string;
	referrerOrganisation: string;
	referrerPhone: string;
	referrerEmail: string;
	/** ISO datetime-local string; '' when unset. */
	referredAt: string;
	relationshipToChild: string;
}

/** Step 2 — child details. */
export interface Child {
	childName: string;
	/** ISO date string; '' when unset. */
	childDateOfBirth: string;
	/** Years; fallback when the date of birth is unknown; null when unset. */
	childAge: number | null;
	childSex: ChildSex;
	childAddress: string;
	childSetting: string;
	childReference: string;
	childEthnicity: string;
	childFirstLanguage: string;
	childDisability: string;
}

/** Step 3 — family and household. */
export interface Family {
	carers: string;
	householdMembers: string;
	otherChildren: string;
	professionalsInvolved: string;
}

/** Step 4 — the concern. */
export interface Concern {
	concernDescription: string;
	concernOnset: string;
	childDisclosed: YesNo;
	referrerObservations: string;
}

/** Step 5 — category of abuse. */
export interface Category {
	primaryCategory: PrimaryCategory;
	additionalCategories: string;
	presentingEvidence: string;
}

/** Step 6 — immediate risk and safety. */
export interface Risk {
	immediateDanger: YesNo;
	childWhereabouts: string;
	whoWithChild: string;
	allegedPersonInContact: YesNoUnknown;
	otherChildrenAtRisk: YesNoUnknown;
}

/** Step 7 — consent and information sharing. */
export interface Consent {
	consentSought: YesNo;
	consentStatus: ConsentStatus;
	sharingBasisWithoutConsent: SharingBasis;
	familyAware: YesNo;
	unsafeToInformReason: string;
}

/** Step 8 — who else is informed. */
export interface Informed {
	agenciesContacted: string;
	strategyDiscussionHeld: YesNo;
	previousSafeguardingHistory: string;
}

/** Step 9 — requested action and summary. */
export interface Action {
	requestedAction: string;
	referrerDeclaration: YesNo;
	notes: string;
}

/** The full Child Safeguarding Referral data model. */
export interface AssessmentData {
	referrer: Referrer;
	child: Child;
	family: Family;
	concern: Concern;
	category: Category;
	risk: Risk;
	consent: Consent;
	informed: Informed;
	action: Action;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single mandatory-rule row (mirrors the grade_rule SQL table). */
export interface FiredRule {
	/** Stable rule id, e.g. R-REFERRER-01. */
	id: string;
	/** Short rule key. */
	rule: string;
	satisfied: boolean;
	category: string;
	description: string;
}

/** A duty-team-facing safeguarding flag (mirrors the grade_flag table). */
export interface FlaggedIssue {
	id: string;
	category: string;
	priority: Priority;
	description: string;
	suggestedAction: string;
}

/** A completeness field-slot: contributes to the completeness percentage. */
export interface FieldSlot {
	key: string;
	/** Populated? */
	present: (r: AssessmentData) => boolean;
	/** Counted in the denominator? (defaults to always). */
	applies?: (r: AssessmentData) => boolean;
}

/** A mandatory completeness / validity rule. */
export interface SafeguardingRule {
	id: string;
	rule: string;
	category: string;
	description: string;
	evaluate: (r: AssessmentData) => boolean;
}

/** The full grading result for one referral. */
export interface GradingResult {
	status: Status;
	urgency: Urgency;
	/** 0..100. */
	completenessPercent: number;
	/** Completeness slots populated. */
	presentCount: number;
	/** Completeness slots that apply. */
	applicableCount: number;
	/** Mandatory rules satisfied. */
	satisfiedCount: number;
	/** Total mandatory rules. */
	mandatoryCount: number;
	firedRules: FiredRule[];
	flaggedIssues: FlaggedIssue[];
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
