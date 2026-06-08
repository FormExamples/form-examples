//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

// Type aliases matching the front-end union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<i32>` / `Option<f64>` with None indicates an unanswered numeric field.
/// Yes no.
pub type YesNo = String;
/// Who severity.
pub type WhoSeverity = String;
/// Ncc merp category.
pub type NccMerpCategory = String;
/// Risk level.
pub type RiskLevel = String;

/// Step 1 — Demographics (reporter and facility).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demographics {
    /// Reporter first name.
    pub reporter_first_name: String,
    /// Reporter last name.
    pub reporter_last_name: String,
    /// Reporter role.
    pub reporter_role: String,
    /// Reporter department.
    pub reporter_department: String,
    /// Reporter contact phone.
    pub reporter_contact_phone: String,
    /// Reporter contact email.
    pub reporter_contact_email: String,
    /// Facility name.
    pub facility_name: String,
    /// Facility ward.
    pub facility_ward: String,
    /// Report date.
    pub report_date: String,
    /// Anonymous report.
    pub anonymous_report: YesNo,
}

/// Step 2 — Incident Details.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct IncidentDetails {
    /// Incident date.
    pub incident_date: String,
    /// Incident time.
    pub incident_time: String,
    /// Discovery date.
    pub discovery_date: String,
    /// Discovery time.
    pub discovery_time: String,
    /// Location type.
    pub location_type: String,
    /// Location details.
    pub location_details: String,
    /// Incident summary.
    pub incident_summary: String,
    /// Incident witnessed.
    pub incident_witnessed: YesNo,
    /// Witness details.
    pub witness_details: String,
    /// Shift type.
    pub shift_type: String,
    /// Staffing level.
    pub staffing_level: String,
}

/// Step 3 — Patient Involvement.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PatientInvolvement {
    /// Patient involved.
    pub patient_involved: YesNo,
    /// Patient first name.
    pub patient_first_name: String,
    /// Patient last name.
    pub patient_last_name: String,
    /// Patient NHS number.
    pub patient_nhs_number: String,
    /// Patient date of birth.
    pub patient_date_of_birth: String,
    /// Patient sex.
    pub patient_sex: String,
    /// Patient age at incident.
    pub patient_age_at_incident: Option<i32>,
    /// Patient informed.
    pub patient_informed: YesNo,
    /// Patient informed date.
    pub patient_informed_date: String,
    /// Patient informed by.
    pub patient_informed_by: String,
    /// Duty of candour applies.
    pub duty_of_candour_applies: YesNo,
    /// Duty of candour completed.
    pub duty_of_candour_completed: YesNo,
}

/// Step 4 — Error Classification.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ErrorClassification {
    /// Error type.
    pub error_type: String,
    /// Error type details.
    pub error_type_details: String,
    /// Medication error stage.
    pub medication_error_stage: String,
    /// Who severity.
    pub who_severity: WhoSeverity,
    /// Ncc merp category.
    pub ncc_merp_category: NccMerpCategory,
    /// Preventability.
    pub preventability: String,
    /// Recurrence likelihood.
    pub recurrence_likelihood: String,
}

/// Step 5 — Contributing Factors.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ContributingFactors {
    /// Staff fatigue.
    pub staff_fatigue: YesNo,
    /// Inadequate training.
    pub inadequate_training: YesNo,
    /// Communication failure.
    pub communication_failure: YesNo,
    /// Communication failure details.
    pub communication_failure_details: String,
    /// Handover failure.
    pub handover_failure: YesNo,
    /// Equipment failure.
    pub equipment_failure: YesNo,
    /// Equipment failure details.
    pub equipment_failure_details: String,
    /// Environmental factors.
    pub environmental_factors: YesNo,
    /// Environmental details.
    pub environmental_details: String,
    /// Policy not followed.
    pub policy_not_followed: YesNo,
    /// Policy details.
    pub policy_details: String,
    /// Workload pressure.
    pub workload_pressure: YesNo,
    /// Patient factors.
    pub patient_factors: YesNo,
    /// Patient factors details.
    pub patient_factors_details: String,
    /// Other factors.
    pub other_factors: String,
}

/// Step 6 — Immediate Actions Taken.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ImmediateActions {
    /// Patient assessed.
    pub patient_assessed: String,
    /// Treatment provided.
    pub treatment_provided: String,
    /// Treatment details.
    pub treatment_details: String,
    /// Error contained.
    pub error_contained: YesNo,
    /// Containment details.
    pub containment_details: String,
    /// Senior staff notified.
    pub senior_staff_notified: YesNo,
    /// Senior staff name.
    pub senior_staff_name: String,
    /// Senior staff role.
    pub senior_staff_role: String,
    /// Risk team notified.
    pub risk_team_notified: YesNo,
    /// Additional monitoring.
    pub additional_monitoring: YesNo,
    /// Monitoring details.
    pub monitoring_details: String,
    /// Immediate actions summary.
    pub immediate_actions_summary: String,
}

/// Step 7 — Patient Outcome.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PatientOutcome {
    /// Harm reached patient.
    pub harm_reached_patient: YesNo,
    /// Harm level.
    pub harm_level: String,
    /// Harm description.
    pub harm_description: String,
    /// Additional treatment required.
    pub additional_treatment_required: YesNo,
    /// Additional treatment details.
    pub additional_treatment_details: String,
    /// Extended hospital stay.
    pub extended_hospital_stay: YesNo,
    /// Extra days.
    pub extra_days: Option<i32>,
    /// Readmission required.
    pub readmission_required: YesNo,
    /// Permanent disability.
    pub permanent_disability: YesNo,
    /// Disability details.
    pub disability_details: String,
    /// Patient died.
    pub patient_died: YesNo,
    /// Death date.
    pub death_date: String,
    /// Outcome notes.
    pub outcome_notes: String,
}

/// Step 8 — Root Cause Analysis.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RootCauseAnalysis {
    /// Rca conducted.
    pub rca_conducted: String,
    /// Rca date.
    pub rca_date: String,
    /// Rca lead.
    pub rca_lead: String,
    /// Rca team members.
    pub rca_team_members: String,
    /// Root cause category.
    pub root_cause_category: String,
    /// Root cause description.
    pub root_cause_description: String,
    /// Five whys analysis.
    pub five_whys_analysis: String,
    /// Fishbone factors.
    pub fishbone_factors: String,
    /// System vulnerabilities.
    pub system_vulnerabilities: String,
    /// Similar incidents.
    pub similar_incidents: String,
    /// Similar incidents details.
    pub similar_incidents_details: String,
    /// Rca findings summary.
    pub rca_findings_summary: String,
}

/// Step 9 — Corrective Actions.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CorrectiveActions {
    /// Immediate corrective actions.
    pub immediate_corrective_actions: String,
    /// Long term corrective actions.
    pub long_term_corrective_actions: String,
    /// Policy change required.
    pub policy_change_required: YesNo,
    /// Policy change details.
    pub policy_change_details: String,
    /// Training required.
    pub training_required: YesNo,
    /// Training details.
    pub training_details: String,
    /// Equipment change required.
    pub equipment_change_required: YesNo,
    /// Equipment change details.
    pub equipment_change_details: String,
    /// Process redesign required.
    pub process_redesign_required: YesNo,
    /// Process redesign details.
    pub process_redesign_details: String,
    /// Responsible person.
    pub responsible_person: String,
    /// Target completion date.
    pub target_completion_date: String,
    /// Actions status.
    pub actions_status: String,
}

/// Step 10 — Reporting & Follow-up.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReportingFollowup {
    /// Internal reference.
    pub internal_reference: String,
    /// Reported to datix.
    pub reported_to_datix: YesNo,
    /// Datix reference.
    pub datix_reference: String,
    /// Reported to nrls.
    pub reported_to_nrls: YesNo,
    /// Nrls reference.
    pub nrls_reference: String,
    /// Reported to cqc.
    pub reported_to_cqc: YesNo,
    /// Reported to hsib.
    pub reported_to_hsib: YesNo,
    /// Reported to coroner.
    pub reported_to_coroner: YesNo,
    /// Safeguarding referral.
    pub safeguarding_referral: YesNo,
    /// Lessons learned.
    pub lessons_learned: String,
    /// Shared with team.
    pub shared_with_team: YesNo,
    /// Follow up review date.
    pub follow_up_review_date: String,
    /// Follow up reviewer.
    pub follow_up_reviewer: String,
    /// Final status.
    pub final_status: String,
    /// Closure date.
    pub closure_date: String,
}

/// Full medical-error-report case record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Demographics.
    pub demographics: Demographics,
    /// Incident details.
    pub incident_details: IncidentDetails,
    /// Patient involvement.
    pub patient_involvement: PatientInvolvement,
    /// Error classification.
    pub error_classification: ErrorClassification,
    /// Contributing factors.
    pub contributing_factors: ContributingFactors,
    /// Immediate actions.
    pub immediate_actions: ImmediateActions,
    /// Patient outcome.
    pub patient_outcome: PatientOutcome,
    /// Root cause analysis.
    pub root_cause_analysis: RootCauseAnalysis,
    /// Corrective actions.
    pub corrective_actions: CorrectiveActions,
    /// Reporting followup.
    pub reporting_followup: ReportingFollowup,
}

/// A grading rule that fired (i.e. its condition matched the report data).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Description.
    pub description: String,
    /// Grade.
    pub grade: i32,
}

/// A safety / governance flag emitted in addition to the grading rules.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Message.
    pub message: String,
    /// Priority.
    pub priority: String,
}

/// Grading output for a medical-error-report case.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Who severity.
    pub who_severity: WhoSeverity,
    /// Ncc merp category.
    pub ncc_merp_category: NccMerpCategory,
    /// Overall risk.
    pub overall_risk: RiskLevel,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
