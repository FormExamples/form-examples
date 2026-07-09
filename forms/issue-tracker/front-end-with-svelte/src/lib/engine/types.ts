// Issue Tracker — input and output types for the scoring engine.
//
// Conventions: empty string for unanswered text/enum fields; null for
// unanswered numeric fields. camelCase property names. Field names match
// the SQL column names in `sql/04_create_table_issue_tracker.sql`
// after snake_case → camelCase conversion.

// ──────────────────────────────────────────────
// Step 1: Reporter & metadata
// ──────────────────────────────────────────────

export interface ReporterMetadata {
	reporterName: string;
	reporterEmail: string;
	reporterRole: string;
	reportedAt: string; // ISO 8601
	discoveredAt: string;
	issueCategory: IssueCategory;
	environment: Environment;
	systemName: string;
	component: string;
	customerOrProjectTag: string;
	externalReference: string;
}

// ──────────────────────────────────────────────
// Step 2: Chief Complaint (CC)
// ──────────────────────────────────────────────

export interface ChiefComplaint {
	ccSummary: string;
	ccLongDescription: string;
	ccReportedByName: string;
	ccReportedVia: ReportedVia;
}

// ──────────────────────────────────────────────
// Step 3: Participants (Pt)
// ──────────────────────────────────────────────

export interface Participants {
	ptDiscovererName: string;
	ptAffectedUsersCount: number | null;
	ptAffectedUserGroups: string;
	ptAssignees: string;
	ptStakeholdersToInform: string;
	ptObservers: string;
}

// ──────────────────────────────────────────────
// Step 4: Symptoms (Sx)
// ──────────────────────────────────────────────

export interface Symptoms {
	sxExternalSignals: string;
	sxAlertIds: string;
	sxErrorMessages: string;
	sxScreenshotsUrl: string;
	sxLogsUrl: string;
	sxFirstObservedAt: string;
}

// ──────────────────────────────────────────────
// Step 5: Fractures (Fx)
// ──────────────────────────────────────────────

export interface Fractures {
	fxBrokenComponents: string;
	fxFailedServices: string;
	fxStuckProcesses: string;
	fxHardwareFaults: string;
	fxDataCorruption: 'none' | 'suspected' | 'confirmed' | 'unknown' | '';
}

// ──────────────────────────────────────────────
// Step 6: History (Hx)
// ──────────────────────────────────────────────

export interface History {
	hxRelatedIssues: string;
	hxPriorOccurrences: number | null;
	hxRecentChangeUrl: string;
	hxReferences: string;
	hxTimeline: string;
}

// ──────────────────────────────────────────────
// Step 7: Investigations (Ix)
// ──────────────────────────────────────────────

export interface Investigations {
	ixHypotheses: string;
	ixReproSteps: string;
	ixDiagnosticQueries: string;
	ixTestsRun: string;
	ixBlockingUnknowns: string;
}

// ──────────────────────────────────────────────
// Step 8: Diagnosis (Dx)
// ──────────────────────────────────────────────

export interface Diagnosis {
	dxRootCause: string;
	dxContributingCauses: string;
	dxScope: 'single-instance' | 'single-service' | 'multiple-services' | 'whole-system' | 'organisation-wide' | '';
	dxConfirmed: 'yes' | 'no' | 'partial' | '';
}

// ──────────────────────────────────────────────
// Step 9: Treatments (Tx) and Prognosis (Px)
// ──────────────────────────────────────────────

export interface TreatmentsAndPrognosis {
	txMitigationSteps: string;
	txFixPlan: string;
	txWorkaround: string;
	txRollbackPlan: string;
	txCommunicationPlan: string;
	pxExpectedResolutionAt: string;
	pxResidualRisk: string;
	pxMonitoringPlan: string;
	pxRecurrenceLikelihood: 'very-low' | 'low' | 'moderate' | 'high' | 'very-high' | '';
	pxLessonsLearned: string;
}

// ──────────────────────────────────────────────
// Step 10: Score & sign-off
// ──────────────────────────────────────────────

export interface RawScores {
	scoreByPriorityRank: number | null;
	scoreBySeverityOfImpact: 1 | 2 | 3 | 4 | 5 | null;
	scoreByMagnitudeOfDamage: number | null;
	scoreByHarmGrade: 0 | 1 | 2 | 3 | 4 | null;
	scoreByFailureCondition: FailureCondition;
	scoreByMoscowRequirement: 1 | 2 | 3 | 4 | null;
	scoreByFrequencyPercent: number | null;
}

// ──────────────────────────────────────────────
// Top-level assessment
// ──────────────────────────────────────────────

export interface IssueTrackerAssessment {
	reporter: ReporterMetadata;
	cc: ChiefComplaint;
	pt: Participants;
	sx: Symptoms;
	fx: Fractures;
	hx: History;
	ix: Investigations;
	dx: Diagnosis;
	txpx: TreatmentsAndPrognosis;
	scores: RawScores;
}

// ──────────────────────────────────────────────
// Enumerations
// ──────────────────────────────────────────────

export type IssueCategory =
	| 'software-defect'
	| 'service-outage'
	| 'performance'
	| 'security'
	| 'data-protection'
	| 'clinical-safety'
	| 'workplace-safety'
	| 'medical-device'
	| 'regulatory'
	| 'project-blocker'
	| 'customer-complaint'
	| 'hardware-fault'
	| 'process'
	| 'other'
	| '';

export type Environment = 'dev' | 'test' | 'staging' | 'production' | 'on-prem' | 'field' | '';

export type ReportedVia =
	| 'self'
	| 'colleague'
	| 'customer'
	| 'monitoring-alert'
	| 'ticket'
	| 'phone'
	| 'email'
	| 'chat'
	| 'in-person'
	| 'other'
	| '';

export type FailureCondition = 'A' | 'B' | 'C' | 'D' | 'E' | '';

export type CompositePriority = 'low' | 'moderate' | 'high' | 'critical';

export type Instrument =
	| 'priority'
	| 'severity'
	| 'magnitude'
	| 'harm'
	| 'failure'
	| 'moscow'
	| 'frequency'
	| 'composite';

// ──────────────────────────────────────────────
// Output: per-instrument bands
// ──────────────────────────────────────────────

export type Band = 'low' | 'moderate' | 'high' | 'critical';

export interface FiredRule {
	ruleId: string;
	instrument: Instrument;
	grade: string;
	category: string;
	description: string;
	band: Band;
}

export interface AdditionalFlag {
	flagId: string;
	category: FlagCategory;
	priority: 'low' | 'medium' | 'high';
	description: string;
	suggestedAction: string;
}

export type FlagCategory =
	| 'harm-fatal'
	| 'failure-catastrophic'
	| 'severity-catastrophic'
	| 'magnitude-total-destruction'
	| 'frequency-universal'
	| 'requirement-mandatory'
	| 'regulatory'
	| 'safeguarding'
	| 'data-loss'
	| 'outage'
	| 'security'
	| 'safety'
	| 'other';

export interface GradeResult {
	scoreByPriorityRank: number | null;
	scoreBySeverityOfImpact: 1 | 2 | 3 | 4 | 5 | null;
	scoreByMagnitudeOfDamage: number | null;
	scoreByHarmGrade: 0 | 1 | 2 | 3 | 4 | null;
	scoreByFailureCondition: FailureCondition;
	scoreByMoscowRequirement: 1 | 2 | 3 | 4 | null;
	scoreByFrequencyPercent: number | null;
	compositePriority: CompositePriority;
	firedRules: FiredRule[];
	additionalFlags: AdditionalFlag[];
}
