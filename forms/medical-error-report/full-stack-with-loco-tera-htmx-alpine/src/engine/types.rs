use serde::{Deserialize, Serialize};

// Type aliases matching the front-end union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<i32>` / `Option<f64>` with None indicates an unanswered numeric field.
pub type YesNo = String;
pub type WhoSeverity = String;
pub type NccMerpCategory = String;
pub type RiskLevel = String;

/// Step 1 — Demographics (reporter and facility).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demographics {
    pub reporter_first_name: String,
    pub reporter_last_name: String,
    pub reporter_role: String,
    pub reporter_department: String,
    pub reporter_contact_phone: String,
    pub reporter_contact_email: String,
    pub facility_name: String,
    pub facility_ward: String,
    pub report_date: String,
    pub anonymous_report: YesNo,
}

/// Step 2 — Incident Details.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct IncidentDetails {
    pub incident_date: String,
    pub incident_time: String,
    pub discovery_date: String,
    pub discovery_time: String,
    pub location_type: String,
    pub location_details: String,
    pub incident_summary: String,
    pub incident_witnessed: YesNo,
    pub witness_details: String,
    pub shift_type: String,
    pub staffing_level: String,
}

/// Step 3 — Patient Involvement.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PatientInvolvement {
    pub patient_involved: YesNo,
    pub patient_first_name: String,
    pub patient_last_name: String,
    pub patient_nhs_number: String,
    pub patient_date_of_birth: String,
    pub patient_sex: String,
    pub patient_age_at_incident: Option<i32>,
    pub patient_informed: YesNo,
    pub patient_informed_date: String,
    pub patient_informed_by: String,
    pub duty_of_candour_applies: YesNo,
    pub duty_of_candour_completed: YesNo,
}

/// Step 4 — Error Classification.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ErrorClassification {
    pub error_type: String,
    pub error_type_details: String,
    pub medication_error_stage: String,
    pub who_severity: WhoSeverity,
    pub ncc_merp_category: NccMerpCategory,
    pub preventability: String,
    pub recurrence_likelihood: String,
}

/// Step 5 — Contributing Factors.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ContributingFactors {
    pub staff_fatigue: YesNo,
    pub inadequate_training: YesNo,
    pub communication_failure: YesNo,
    pub communication_failure_details: String,
    pub handover_failure: YesNo,
    pub equipment_failure: YesNo,
    pub equipment_failure_details: String,
    pub environmental_factors: YesNo,
    pub environmental_details: String,
    pub policy_not_followed: YesNo,
    pub policy_details: String,
    pub workload_pressure: YesNo,
    pub patient_factors: YesNo,
    pub patient_factors_details: String,
    pub other_factors: String,
}

/// Step 6 — Immediate Actions Taken.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ImmediateActions {
    pub patient_assessed: String,
    pub treatment_provided: String,
    pub treatment_details: String,
    pub error_contained: YesNo,
    pub containment_details: String,
    pub senior_staff_notified: YesNo,
    pub senior_staff_name: String,
    pub senior_staff_role: String,
    pub risk_team_notified: YesNo,
    pub additional_monitoring: YesNo,
    pub monitoring_details: String,
    pub immediate_actions_summary: String,
}

/// Step 7 — Patient Outcome.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PatientOutcome {
    pub harm_reached_patient: YesNo,
    pub harm_level: String,
    pub harm_description: String,
    pub additional_treatment_required: YesNo,
    pub additional_treatment_details: String,
    pub extended_hospital_stay: YesNo,
    pub extra_days: Option<i32>,
    pub readmission_required: YesNo,
    pub permanent_disability: YesNo,
    pub disability_details: String,
    pub patient_died: YesNo,
    pub death_date: String,
    pub outcome_notes: String,
}

/// Step 8 — Root Cause Analysis.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RootCauseAnalysis {
    pub rca_conducted: String,
    pub rca_date: String,
    pub rca_lead: String,
    pub rca_team_members: String,
    pub root_cause_category: String,
    pub root_cause_description: String,
    pub five_whys_analysis: String,
    pub fishbone_factors: String,
    pub system_vulnerabilities: String,
    pub similar_incidents: String,
    pub similar_incidents_details: String,
    pub rca_findings_summary: String,
}

/// Step 9 — Corrective Actions.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CorrectiveActions {
    pub immediate_corrective_actions: String,
    pub long_term_corrective_actions: String,
    pub policy_change_required: YesNo,
    pub policy_change_details: String,
    pub training_required: YesNo,
    pub training_details: String,
    pub equipment_change_required: YesNo,
    pub equipment_change_details: String,
    pub process_redesign_required: YesNo,
    pub process_redesign_details: String,
    pub responsible_person: String,
    pub target_completion_date: String,
    pub actions_status: String,
}

/// Step 10 — Reporting & Follow-up.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReportingFollowup {
    pub internal_reference: String,
    pub reported_to_datix: YesNo,
    pub datix_reference: String,
    pub reported_to_nrls: YesNo,
    pub nrls_reference: String,
    pub reported_to_cqc: YesNo,
    pub reported_to_hsib: YesNo,
    pub reported_to_coroner: YesNo,
    pub safeguarding_referral: YesNo,
    pub lessons_learned: String,
    pub shared_with_team: YesNo,
    pub follow_up_review_date: String,
    pub follow_up_reviewer: String,
    pub final_status: String,
    pub closure_date: String,
}

/// Full medical-error-report case record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub demographics: Demographics,
    pub incident_details: IncidentDetails,
    pub patient_involvement: PatientInvolvement,
    pub error_classification: ErrorClassification,
    pub contributing_factors: ContributingFactors,
    pub immediate_actions: ImmediateActions,
    pub patient_outcome: PatientOutcome,
    pub root_cause_analysis: RootCauseAnalysis,
    pub corrective_actions: CorrectiveActions,
    pub reporting_followup: ReportingFollowup,
}

/// A grading rule that fired (i.e. its condition matched the report data).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub category: String,
    pub description: String,
    pub grade: i32,
}

/// A safety / governance flag emitted in addition to the grading rules.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: String,
}

/// Grading output for a medical-error-report case.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub who_severity: WhoSeverity,
    pub ncc_merp_category: NccMerpCategory,
    pub overall_risk: RiskLevel,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub timestamp: String,
}
