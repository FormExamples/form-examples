// ──────────────────────────────────────────────
// Core assessment data types (Zarit Burden Interview, ZBI)
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_zarit_burden_interview.sql`.
//
// Item responses store the RAW 0..4 frequency rating (0 = Never … 4 = Nearly
// always), or `null` when unanswered. There is NO reverse-scoring — a higher
// rating always means greater perceived burden. The grader
// (`zarit-grader.ts`) sums the answered ratings over the active item set (all
// 22 for ZBI-22, or the 12-item short-form subset for ZBI-12).
// ──────────────────────────────────────────────

export type PractitionerRole =
	| 'clinician'
	| 'nurse'
	| 'social-care'
	| 'carer-support'
	| 'other'
	| '';
export type CareSetting =
	| 'memory-service'
	| 'community'
	| 'general-practice'
	| 'social-care'
	| 'other'
	| '';
/** Which item set is scored. */
export type InstrumentForm = 'zbi22' | 'zbi12';
export type CarerRelationship =
	| 'spouse-partner'
	| 'adult-child'
	| 'other-relative'
	| 'friend'
	| 'other'
	| '';
export type CarerCoResident = 'yes' | 'no' | '';
export type RecipientCondition = 'dementia' | 'chronic-illness' | 'disability' | 'other' | '';
export type Band =
	| 'little-or-none'
	| 'mild-to-moderate'
	| 'moderate-to-severe'
	| 'severe'
	| 'lower'
	| 'high';
export type Priority = 'urgent' | 'high' | 'medium' | 'low';

/** Step 1 — assessment context. */
export interface Context {
	practitionerName: string;
	practitionerRole: PractitionerRole;
	/** ISO-ish datetime-local string; '' when unset. */
	assessedAt: string;
	careSetting: CareSetting;
	/** Which item set is scored. */
	instrumentForm: InstrumentForm;
}

/** Step 2 — carer (the person completing the questionnaire). */
export interface Carer {
	carerIdentifier: string;
	carerRelationship: CarerRelationship;
	carerCoResident: CarerCoResident;
	/** Approximate hours of care per week; null when unset. */
	careHoursPerWeek: number | null;
}

/** Step 3 — care recipient. */
export interface Recipient {
	recipientIdentifier: string;
	recipientCondition: RecipientCondition;
}

/**
 * Step 4 — the twenty-two item ratings. Each value is the RAW 0..4 frequency
 * rating, or null when unanswered.
 */
export interface Items {
	item1: number | null;
	item2: number | null;
	item3: number | null;
	item4: number | null;
	item5: number | null;
	item6: number | null;
	item7: number | null;
	item8: number | null;
	item9: number | null;
	item10: number | null;
	item11: number | null;
	item12: number | null;
	item13: number | null;
	item14: number | null;
	item15: number | null;
	item16: number | null;
	item17: number | null;
	item18: number | null;
	item19: number | null;
	item20: number | null;
	item21: number | null;
	item22: number | null;
}

/** Step 5 — clinician free-text note. */
export interface Note {
	clinicalNote: string;
}

/** The full ZBI assessment data model. */
export interface AssessmentData {
	context: Context;
	carer: Carer;
	recipient: Recipient;
	items: Items;
	note: Note;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single scored/derived audit row (mirrors the grade_rule SQL table). */
export interface FiredItem {
	/** Stable rule id, e.g. R-ITEM-22-SCORE. */
	id: string;
	/** item | total | band */
	parameter: string;
	/** Points contributed (0..4), where applicable. */
	points: number;
	category: string;
	description: string;
}

/** A clinician-facing safety flag (mirrors the grade_flag SQL table). */
export interface FlaggedIssue {
	id: string;
	category: string;
	priority: Priority;
	description: string;
	suggestedAction: string;
}

/** A single ZBI item definition. */
export interface ZaritItem {
	/** 1..22 */
	number: number;
	/** State key: 'item1' .. 'item22'. */
	field: keyof Items;
	/** The item statement. */
	statement: string;
	/** True when the item is part of the ZBI-12 short-form subset. */
	shortForm: boolean;
	/** True for the global burden item (item 22). */
	global: boolean;
}

/** The full grading result for one assessment. */
export interface GradingResult {
	/** Twenty-two entries, each 0..4 or null (missing → excluded from the total). */
	itemRatings: (number | null)[];
	/** 0..88 (ZBI-22) or 0..48 (ZBI-12). */
	totalScore: number;
	maxScore: 88 | 48;
	burdenBand: Band;
	firedItems: FiredItem[];
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
