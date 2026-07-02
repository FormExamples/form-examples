// ──────────────────────────────────────────────
// Core assessment data types (Learning Disability Annual Health Check)
//
// The annual health check is a DOCUMENTATION and COMPLETENESS instrument, not a
// numeric-score form: the engine counts the required components carried out
// completely, reports a completeness percentage, confirms the Health Action Plan
// was produced and shared, classifies the check as Complete or Incomplete, and —
// independently — raises clinical flags (STOMP, no Health Action Plan, dysphagia
// risk, and so on). It never sums a total. camelCase property names mirror the
// snake_case SQL columns in
// `sql/04_create_table_learning_disability_annual_health_check.sql`.
// ──────────────────────────────────────────────

export type ClinicianRole =
	| 'gp'
	| 'practice-nurse'
	| 'healthcare-assistant'
	| 'ld-team'
	| 'other'
	| '';
export type YesNo = 'yes' | 'no' | '';
export type YesNoNa = 'yes' | 'no' | 'not-applicable' | '';
export type AgeBand = '14-17' | '18-24' | '25-44' | '45-64' | '65+' | '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';
export type LdRegisterStatus = 'on-register' | 'not-on-register' | 'newly-added' | '';

export type CompletenessStatus = 'complete' | 'incomplete';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — check context. */
export interface Context {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	/** ISO date string; '' when unset. */
	checkedOn: string;
	practiceName: string;
	easyReadInvitationSent: YesNo;
	preCheckDone: YesNo;
}

/** Step 2 — person identification. */
export interface Identification {
	personIdentifier: string;
	ageBand: AgeBand;
	sex: Sex;
	ldRegisterStatus: LdRegisterStatus;
	mainCarer: string;
}

/** Step 3 — reasonable adjustments and communication. */
export interface Adjustments {
	communicationNeeds: string;
	reasonableAdjustmentsRecorded: YesNo;
	healthPassport: YesNoNa;
	consentCapacityNote: string;
}

/** Step 4 — physical health. Twelve sub-components share one free-text action field. */
export interface Physical {
	weightBmiStatus: 'recorded' | 'declined' | 'not-recorded' | '';
	bmi: number | null;
	bloodPressureStatus: 'normal' | 'raised' | 'recorded' | 'not-recorded' | '';
	epilepsyStatus: 'reviewed' | 'not-applicable' | 'not-reviewed' | '';
	constipationStatus: 'none' | 'present' | 'not-assessed' | '';
	dysphagiaStatus: 'none' | 'present' | 'not-assessed' | '';
	continenceStatus: 'ok' | 'issue' | 'not-assessed' | '';
	mobilityFallsStatus: 'ok' | 'issue' | 'not-assessed' | '';
	dentalStatus: 'ok' | 'issue' | 'not-assessed' | '';
	visionStatus: 'ok' | 'issue' | 'not-assessed' | '';
	hearingStatus: 'ok' | 'issue' | 'not-assessed' | '';
	footHealthStatus: 'ok' | 'issue' | 'not-assessed' | '';
	skinStatus: 'ok' | 'issue' | 'not-assessed' | '';
	physicalHealthActions: string;
}

/** Step 5 — screening and immunisation uptake. */
export interface Screening {
	cancerScreeningStatus: 'up-to-date' | 'declined' | 'not-eligible' | 'not-recorded' | '';
	otherScreeningStatus: 'up-to-date' | 'declined' | 'not-eligible' | 'not-recorded' | '';
	immunisationStatus: 'up-to-date' | 'declined' | 'not-recorded' | '';
}

/** Step 6 — medication review including STOMP. */
export interface Medication {
	medicationReconciled: YesNo;
	psychotropicPrescribed: YesNo;
	psychotropicIndication: string;
	/** ISO date string; '' when unset. */
	psychotropicLastReviewed: string;
	stompDiscussed: YesNoNa;
	medicationSideEffects: string;
}

/** Step 7 — mental health and behaviour. */
export interface Mental {
	mentalHealthStatus: 'ok' | 'concern' | 'not-assessed' | '';
	behaviourStatus: 'none' | 'challenging' | 'not-assessed' | '';
	behaviourTriggers: string;
}

/** Step 8 — syndrome-specific checks. */
export interface Syndrome {
	syndromeSpecificStatus: 'done' | 'not-applicable' | 'not-done' | '';
}

/** Step 9 — carer and social. */
export interface Carer {
	carerNeedsStatus: 'assessed' | 'no-carer' | 'not-assessed' | '';
	socialCircumstances: string;
}

/** Step 10 — Health Action Plan. */
export interface Plan {
	healthActionPlanProduced: YesNo;
	healthActionPlanShared: YesNo;
	healthActionPlanActions: string;
	clinicianNote: string;
}

/** The full annual-health-check data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	adjustments: Adjustments;
	physical: Physical;
	screening: Screening;
	medication: Medication;
	mental: Mental;
	syndrome: Syndrome;
	carer: Carer;
	plan: Plan;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** Per-required-component completeness status row. */
export interface ComponentStatus {
	/** Stable component key, e.g. dysphagia. */
	id: string;
	/** adjustments | physical | screening | medication | mental | syndrome | carer */
	group: string;
	/** Human-readable component name. */
	label: string;
	/** True when the component was carried out completely. */
	completed: boolean;
}

/** A single evaluated / derived rule row (mirrors the grade_rule SQL table). */
export interface FiredRule {
	/** Stable rule id, e.g. R-COMPONENT-DYSPHAGIA. */
	id: string;
	/** component key | completeness | health-action-plan */
	component: string;
	category: string;
	description: string;
}

/** A clinician-facing flag (mirrors the grade_flag SQL table). */
export interface FlaggedIssue {
	id: string;
	/** stomp | no-health-action-plan | dysphagia-risk | ... */
	category: string;
	priority: Priority;
	description: string;
	suggestedAction: string;
}

/** A required-component rule: completed when the component carries a recorded value. */
export interface ComponentRule {
	id: string;
	/** Stable component key. */
	component: string;
	/** adjustments | physical | screening | medication | mental | syndrome | carer */
	group: string;
	category: string;
	/** Human-readable component name. */
	label: string;
	description: string;
	completed: (data: AssessmentData) => boolean;
}

/** The full completeness result for one annual health check. */
export interface GradingResult {
	status: CompletenessStatus;
	/** 0..100. */
	completenessPercent: number;
	healthActionPlanComplete: boolean;
	componentStatuses: ComponentStatus[];
	firedRules: FiredRule[];
	flags: FlaggedIssue[];
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
