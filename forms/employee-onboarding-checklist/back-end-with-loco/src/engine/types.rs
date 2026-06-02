use serde::{Deserialize, Serialize};

// Type aliases matching the frontend union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<i32>` with None indicates an unanswered numeric field.
pub type YesNo = String;
pub type CompletionStatus = String;
pub type RiskLevel = String;

/// Step 1 — Demographics.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demographics {
    pub first_name: String,
    pub last_name: String,
    pub date_of_birth: String,
    pub email: String,
    pub phone: String,
    pub job_title: String,
    pub department: String,
    pub start_date: String,
    pub emergency_contact_name: String,
    pub emergency_contact_phone: String,
    pub emergency_contact_relationship: String,
}

/// Step 2 — Pre-Employment Checks.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PreEmploymentChecks {
    pub dbs_check_status: String,
    pub dbs_certificate_number: String,
    pub dbs_check_date: String,
    pub dbs_update_service_registered: YesNo,
    pub right_to_work_verified: YesNo,
    pub right_to_work_document_type: String,
    pub right_to_work_expiry_date: String,
    pub references_received: Option<i32>,
    pub references_required: Option<i32>,
    pub references_satisfactory: YesNo,
    pub identity_verified: YesNo,
    pub pre_employment_notes: String,
}

/// Step 3 — Occupational Health.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OccupationalHealth {
    pub oh_questionnaire_submitted: YesNo,
    pub oh_clearance_received: YesNo,
    pub oh_clearance_date: String,
    pub oh_restrictions: YesNo,
    pub oh_restriction_details: String,
    pub hepatitis_b_status: String,
    pub tb_screening_status: String,
    pub immunisation_status: String,
    pub fit_to_work: YesNo,
    pub occupational_health_notes: String,
}

/// Step 4 — Mandatory Training.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MandatoryTraining {
    pub fire_safety_completed: YesNo,
    pub fire_safety_date: String,
    pub manual_handling_completed: YesNo,
    pub manual_handling_date: String,
    pub infection_control_completed: YesNo,
    pub infection_control_date: String,
    pub safeguarding_adults_completed: YesNo,
    pub safeguarding_adults_level: String,
    pub safeguarding_children_completed: YesNo,
    pub safeguarding_children_level: String,
    pub information_governance_completed: YesNo,
    pub information_governance_date: String,
    pub basic_life_support_completed: YesNo,
    pub basic_life_support_date: String,
    pub equality_diversity_completed: YesNo,
    pub health_safety_completed: YesNo,
    pub conflict_resolution_completed: YesNo,
    pub mandatory_training_notes: String,
}

/// Step 5 — Professional Registration.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProfessionalRegistration {
    pub registration_required: YesNo,
    pub regulatory_body: String,
    pub regulatory_body_other: String,
    pub registration_number: String,
    pub registration_verified: YesNo,
    pub registration_expiry_date: String,
    pub registration_conditions: YesNo,
    pub registration_condition_details: String,
    pub revalidation_date: String,
    pub indemnity_insurance: String,
    pub professional_registration_notes: String,
}

/// Step 6 — IT Systems & Access.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ITSystemsAccess {
    pub nhs_smartcard_issued: YesNo,
    pub nhs_smartcard_number: String,
    pub email_account_created: YesNo,
    pub network_login_created: YesNo,
    pub clinical_system_access: YesNo,
    pub clinical_system_name: String,
    pub clinical_system_training_completed: YesNo,
    pub rostering_system_access: YesNo,
    pub phone_extension: String,
    pub bleep_number: String,
    pub it_access_notes: String,
}

/// Step 7 — Uniform & ID Badge.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UniformIDBadge {
    pub uniform_required: YesNo,
    pub uniform_ordered: YesNo,
    pub uniform_received: YesNo,
    pub uniform_size: String,
    pub id_badge_photo_taken: YesNo,
    pub id_badge_issued: YesNo,
    pub id_badge_number: String,
    pub access_card_issued: YesNo,
    pub access_card_areas: String,
    pub locker_allocated: YesNo,
    pub locker_number: String,
    pub uniform_id_notes: String,
}

/// Step 8 — Induction Programme.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InductionProgramme {
    pub corporate_induction_completed: YesNo,
    pub corporate_induction_date: String,
    pub local_induction_completed: YesNo,
    pub local_induction_date: String,
    pub department_tour_completed: YesNo,
    pub introduced_to_team: YesNo,
    pub emergency_procedures_briefed: YesNo,
    pub policies_handbook_received: YesNo,
    pub buddy_assigned: YesNo,
    pub buddy_name: String,
    pub induction_programme_notes: String,
}

/// Step 9 — Probation & Supervision.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProbationSupervision {
    pub probation_period_months: Option<i32>,
    pub probation_start_date: String,
    pub probation_end_date: String,
    pub line_manager_name: String,
    pub line_manager_email: String,
    pub supervisor_name: String,
    pub supervision_frequency: String,
    pub first_supervision_date: String,
    pub objectives_set: YesNo,
    pub appraisal_date_agreed: YesNo,
    pub appraisal_date: String,
    pub probation_supervision_notes: String,
}

/// Step 10 — Sign-off & Compliance.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SignOffCompliance {
    pub confidentiality_agreement_signed: YesNo,
    pub code_of_conduct_signed: YesNo,
    pub social_media_policy_acknowledged: YesNo,
    pub it_acceptable_use_signed: YesNo,
    pub gdpr_training_completed: YesNo,
    pub duty_of_candour_briefed: YesNo,
    pub whistleblowing_policy_briefed: YesNo,
    pub employee_signed_off: YesNo,
    pub employee_sign_off_date: String,
    pub manager_signed_off: YesNo,
    pub manager_sign_off_date: String,
    pub manager_sign_off_name: String,
    pub sign_off_compliance_notes: String,
}

/// Full Employee Onboarding Checklist record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub demographics: Demographics,
    pub pre_employment_checks: PreEmploymentChecks,
    pub occupational_health: OccupationalHealth,
    pub mandatory_training: MandatoryTraining,
    pub professional_registration: ProfessionalRegistration,
    #[serde(rename = "itSystemsAccess")]
    pub it_systems_access: ITSystemsAccess,
    #[serde(rename = "uniformIDBadge")]
    pub uniform_id_badge: UniformIDBadge,
    pub induction_programme: InductionProgramme,
    pub probation_supervision: ProbationSupervision,
    pub sign_off_compliance: SignOffCompliance,
}

/// A rule that fired during grading.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub category: String,
    pub description: String,
    pub grade: i32,
}

/// A safety flag computed independently of completion (real-time alert).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: String,
}

/// Grading output for an onboarding checklist.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub completion_percentage: f64,
    pub completion_status: CompletionStatus,
    pub overall_risk: RiskLevel,
    pub items_completed: u32,
    pub items_total: u32,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub timestamp: String,
}
