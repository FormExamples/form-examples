// ──────────────────────────────────────────────
// Core assessment data types
// ──────────────────────────────────────────────
//
// The Workplace Safety Assessment is a UK HSE-aligned workplace safety audit
// for healthcare settings. Each checklist item is captured as a Yes / No / N/A
// response (`''` = unanswered); free-text observations default to `''`; numeric
// fields default to `null`.

/** Yes / No / N/A checklist answer (`''` = unanswered). */
export type YesNoNA = 'yes' | 'no' | 'na' | '';

/** Overall audit outcome. */
export type Outcome = 'compliant' | 'minor' | 'major' | 'critical';

/** Finding severity grade (1 = compliant control … 4 = critical finding). */
export type SeverityGrade = 1 | 2 | 3 | 4;

/** Flag priority for the auditor-facing flagged-issues list. */
export type FlagPriority = 'urgent' | 'high' | 'medium' | 'low';

/** Action-plan item priority. */
export type ActionPriority = 'critical' | 'major' | 'minor' | '';

/** Section 1 — Demographics & site details. */
export interface SiteDetails {
	auditorName: string;
	auditorRole: string;
	auditDate: string;
	siteName: string;
	siteAddress: string;
	departmentArea: string;
	siteManager: string;
	previousAuditDate: string;
	previousFindingsClosed: YesNoNA;
}

/** Section 2 — PPE & hazard controls. */
export interface PPEHazardControls {
	ppeAvailable: YesNoNA;
	ppeCorrectlyUsed: YesNoNA;
	ppeStockMaintained: YesNoNA;
	hazardSignageVisible: YesNoNA;
	signageLegible: YesNoNA;
	housekeepingSatisfactory: YesNoNA;
	slipTripHazardsControlled: YesNoNA;
	observations: string;
}

/** Section 3 — Chemical & biological hazards. */
export interface ChemicalBiologicalHazards {
	coshhRegisterPresent: YesNoNA;
	sdsAvailable: YesNoNA;
	chemicalsLabelledCorrectly: YesNoNA;
	chemicalsStoredSecurely: YesNoNA;
	spillKitsAvailable: YesNoNA;
	untreatedSpillsObserved: YesNoNA;
	sharpsContainersInDate: YesNoNA;
	clinicalWasteSegregated: YesNoNA;
	biologicalRiskAssessmentCurrent: YesNoNA;
	observations: string;
}

/** Section 4 — Electrical safety. */
export interface ElectricalSafety {
	patTestingInDate: YesNoNA;
	fixedWiringTestInDate: YesNoNA;
	damagedEquipmentObserved: YesNoNA;
	overloadedSocketsObserved: YesNoNA;
	extensionLeadsManagedSafely: YesNoNA;
	consumerUnitAccessible: YesNoNA;
	observations: string;
}

/** Section 5 — Fire safety & emergency egress. */
export interface FireSafety {
	fireRiskAssessmentCurrent: YesNoNA;
	fireExtinguishersServiced: YesNoNA;
	fireExtinguishersAccessible: YesNoNA;
	fireAlarmTestedWeekly: YesNoNA;
	emergencyEgressClear: YesNoNA;
	emergencyLightingFunctional: YesNoNA;
	fireDoorsHeldOpenIllegally: YesNoNA;
	assemblyPointSignposted: YesNoNA;
	observations: string;
}

/** Section 6 — Ergonomics & manual handling. */
export interface ErgonomicsManualHandling {
	manualHandlingAssessmentCurrent: YesNoNA;
	liftingAidsAvailable: YesNoNA;
	dseAssessmentsCompleted: YesNoNA;
	workstationsAdjustable: YesNoNA;
	repetitiveStrainConcerns: YesNoNA;
	patientHandlingPlansInPlace: YesNoNA;
	observations: string;
}

/** Section 7 — Emergency procedures. */
export interface EmergencyProcedures {
	evacuationProcedurePosted: YesNoNA;
	firstAidKitsStocked: YesNoNA;
	firstAiderRosterCurrent: YesNoNA;
	aedAvailable: YesNoNA;
	aedServiceInDate: YesNoNA;
	emergencyContactsDisplayed: YesNoNA;
	drillConductedLast12Months: YesNoNA;
	observations: string;
}

/** Section 8 — Training & competence. */
export interface TrainingCompetence {
	mandatoryTrainingUpToDate: YesNoNA;
	fireMarshalsTrained: YesNoNA;
	manualHandlingTrainingCurrent: YesNoNA;
	infectionControlTrainingCurrent: YesNoNA;
	trainingRecordsAccessible: YesNoNA;
	inductionForNewStartersCompleted: YesNoNA;
	observations: string;
}

/** Section 9 — Incident reporting & near misses. */
export interface IncidentReporting {
	incidentReportingSystemUsed: YesNoNA;
	riddorReportableIncidentsReported: YesNoNA;
	nearMissReportingActive: YesNoNA;
	incidentsLast12Months: number | null;
	nearMissesLast12Months: number | null;
	lessonsLearnedShared: YesNoNA;
	actionsFromIncidentsTracked: YesNoNA;
	observations: string;
}

/** A single action-plan item. */
export interface ActionPlanItem {
	description: string;
	owner: string;
	dueDate: string;
	priority: ActionPriority;
}

/** Section 10 — Sign-off & action plan. */
export interface SignoffActionPlan {
	actionItems: ActionPlanItem[];
	overallSummary: string;
	auditorSignature: string;
	signoffDate: string;
	debriefDelivered: YesNoNA;
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

export interface AssessmentData {
	siteDetails: SiteDetails;
	ppeHazardControls: PPEHazardControls;
	chemicalBiologicalHazards: ChemicalBiologicalHazards;
	electricalSafety: ElectricalSafety;
	fireSafety: FireSafety;
	ergonomicsManualHandling: ErgonomicsManualHandling;
	emergencyProcedures: EmergencyProcedures;
	trainingCompetence: TrainingCompetence;
	incidentReporting: IncidentReporting;
	signoffActionPlan: SignoffActionPlan;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A declarative scoring rule for one checklist item. */
export interface SafetyRule {
	id: string;
	category: string;
	description: string;
	severity: SeverityGrade;
	/** Returns 0 (unanswered), 1 (control in place), or the rule severity (finding). */
	evaluate: (data: AssessmentData) => number;
}

/** A rule that contributed to the audit result. */
export interface FiredRule {
	id: string;
	category: string;
	description: string;
	grade: SeverityGrade;
}

/** Per-category tally of findings. */
export interface CategoryFindings {
	category: string;
	compliant: number;
	minor: number;
	major: number;
	critical: number;
	total: number;
}

/** An auditor-facing flag raised independently of the headline grade. */
export interface AdditionalFlag {
	id: string;
	category: string;
	message: string;
	priority: FlagPriority;
}

/** The full result of grading an assessment. */
export interface GradingResult {
	outcome: Outcome;
	findingsByCategory: Record<string, CategoryFindings>;
	firedRules: FiredRule[];
	additionalFlags: AdditionalFlag[];
	answeredCount: number;
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
