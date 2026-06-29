// ──────────────────────────────────────────────
// Meeting record data types
// ──────────────────────────────────────────────

export type MeetingStatus =
	| 'draft'
	| 'scheduled'
	| 'in-progress'
	| 'completed'
	| 'cancelled'
	| '';

export type MeetingCategory =
	| 'stand-up'
	| 'review'
	| 'planning'
	| 'training'
	| 'one-to-one'
	| 'interview'
	| 'governance'
	| 'social'
	| 'other'
	| '';

export type Visibility = 'public' | 'internal' | 'confidential' | 'private' | '';

export type RecurringFrequency =
	| 'none'
	| 'daily'
	| 'weekday'
	| 'weekly'
	| 'monthly'
	| 'quarterly'
	| 'yearly';

export type OverallResult = 'productive' | 'partial' | 'unproductive' | 'cancelled' | '';

export type AgendaStatus = 'planned' | 'discussed' | 'skipped' | 'deferred' | '';

export type ParticipantRole =
	| 'organizer'
	| 'chair'
	| 'required'
	| 'optional'
	| 'observer'
	| 'presenter'
	| 'note-taker'
	| '';

export type ResponseStatus = 'no-response' | 'accepted' | 'declined' | 'tentative' | 'delegated' | '';

export type AttendanceStatus =
	| 'present'
	| 'late'
	| 'absent'
	| 'partial'
	| 'remote'
	| 'unknown'
	| '';

export type ResourceType =
	| 'room'
	| 'equipment'
	| 'document'
	| 'link'
	| 'budget'
	| 'catering'
	| 'interpreter'
	| 'transport'
	| 'other'
	| '';

export type ResourceStatus =
	| 'requested'
	| 'reserved'
	| 'confirmed'
	| 'unavailable'
	| 'cancelled'
	| '';

export type ActionPriority = 'low' | 'medium' | 'high' | 'urgent' | '';

export type ActionStatus = 'open' | 'in-progress' | 'blocked' | 'done' | 'cancelled';

export type OutputKind =
	| 'document'
	| 'decision'
	| 'data'
	| 'recording'
	| 'minutes'
	| 'slides'
	| 'agreement'
	| 'other'
	| '';

export type OutcomeCategory =
	| 'goal-reached'
	| 'risk-identified'
	| 'risk-mitigated'
	| 'alignment-achieved'
	| 'decision'
	| 'blocker-cleared'
	| 'blocker-raised'
	| 'commitment'
	| 'no-outcome'
	| 'other'
	| '';

export type OutcomeImpact = 'low' | 'medium' | 'high' | 'strategic' | '';

export interface Organizer {
	name: string;
	email: string;
	role: string;
	organisation: string;
	team: string;
	timezone: string;
}

export interface MeetingMeta {
	status: MeetingStatus;
	title: string;
	purpose: string;
	longDescription: string;
	category: MeetingCategory;
	visibility: Visibility;
}

export interface Invitation {
	scheduledStartAt: string;
	scheduledEndAt: string;
	timezone: string;
	location: string;
	videoUrl: string;
	phoneNumber: string;
	dialInCode: string;
	joiningInstructions: string;
	calendarUid: string;
}

export interface AgendaItem {
	title: string;
	durationMinutes: number | null;
	presenter: string;
	notes: string;
	status: AgendaStatus;
}

export interface Participant {
	name: string;
	email: string;
	role: ParticipantRole;
	responseStatus: ResponseStatus;
	attendanceStatus: AttendanceStatus;
}

export interface ResourceItem {
	resourceType: ResourceType;
	name: string;
	quantity: number | null;
	costAmount: number | null;
	status: ResourceStatus;
}

export interface Recurrence {
	frequency: RecurringFrequency;
	intervalCount: number | null;
	byDayOfWeek: string;
	byDayOfMonth: string;
	bySetPosition: string;
	byMonthOfYear: string;
	seriesCount: number | null;
	seriesUntil: string;
}

export interface SummaryData {
	summary: string;
	actualStartAt: string;
	actualEndAt: string;
}

export interface ActionItem {
	title: string;
	ownerName: string;
	dueDate: string;
	priority: ActionPriority;
	status: ActionStatus;
}

export interface OutputItem {
	title: string;
	kind: OutputKind;
	url: string;
	ownerName: string;
}

export interface OutcomeItem {
	title: string;
	category: OutcomeCategory;
	impact: OutcomeImpact;
	description: string;
}

export interface ResultsData {
	actionItems: ActionItem[];
	outputs: OutputItem[];
	outcomes: OutcomeItem[];
}

export interface SignOff {
	overallResult: OverallResult;
	additionalNotes: string;
	signedByName: string;
	signedAt: string;
}

// ──────────────────────────────────────────────
// Full meeting record data model
// ──────────────────────────────────────────────

export interface MeetingData {
	organizer: Organizer;
	meta: MeetingMeta;
	invitation: Invitation;
	agenda: AgendaItem[];
	participants: Participant[];
	resources: ResourceItem[];
	recurrence: Recurrence;
	summary: SummaryData;
	results: ResultsData;
	signoff: SignOff;
}

// ──────────────────────────────────────────────
// Validation engine types
// ──────────────────────────────────────────────

/** Overall record health: green (clean), amber (advisory), red (blocking). */
export type Health = 'green' | 'amber' | 'red';

export type CompletionStatus = 'planned' | 'in-progress' | 'complete' | 'incomplete';

/** A rule that fired against the record, with its grade and instrument. */
export interface FiredRule {
	ruleId: string;
	instrument: string;
	grade: 'red' | 'amber';
	category: string;
	description: string;
}

/** A non-blocking flag surfaced for the organiser to fix. */
export interface ValidationFlag {
	flagId: string;
	category: string;
	priority: 'high' | 'medium' | 'low';
	description: string;
	suggestedAction: string;
}

/** The full result of validating a meeting record. */
export interface ValidationResult {
	durationMinutes: number | null;
	participantCount: number;
	acceptedCount: number;
	attendedCount: number;
	agendaItemCount: number;
	actionItemCount: number;
	openActionCount: number;
	outputCount: number;
	outcomeCount: number;
	completionStatus: CompletionStatus;
	overallHealth: Health;
	firedRules: FiredRule[];
	flags: ValidationFlag[];
	timestamp: string;
}

// ──────────────────────────────────────────────
// Step configuration
// ──────────────────────────────────────────────

export interface StepConfig {
	number: number;
	title: string;
	shortTitle: string;
	section: keyof MeetingData;
}
