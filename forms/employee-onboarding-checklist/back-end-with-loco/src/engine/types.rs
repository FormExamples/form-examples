//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

// Type aliases matching the frontend union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<i32>` with None indicates an unanswered numeric field.
/// Yes no.
pub type YesNo = String;
/// Completion status.
pub type CompletionStatus = String;
/// Risk level.
pub type RiskLevel = String;

/// Step 1 — Demographics.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demographics {
    /// First name.
    pub first_name: String,
    /// Last name.
    pub last_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Email.
    pub email: String,
    /// Phone.
    pub phone: String,
    /// Job title.
    pub job_title: String,
    /// Department.
    pub department: String,
    /// Start date.
    pub start_date: String,
    /// Emergency contact name.
    pub emergency_contact_name: String,
    /// Emergency contact phone.
    pub emergency_contact_phone: String,
    /// Emergency contact relationship.
    pub emergency_contact_relationship: String,
}

/// Step 2 — Pre-Employment Checks.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PreEmploymentChecks {
    /// Dbs check status.
    pub dbs_check_status: String,
    /// Dbs certificate number.
    pub dbs_certificate_number: String,
    /// Dbs check date.
    pub dbs_check_date: String,
    /// Dbs update service registered.
    pub dbs_update_service_registered: YesNo,
    /// Right to work verified.
    pub right_to_work_verified: YesNo,
    /// Right to work document type.
    pub right_to_work_document_type: String,
    /// Right to work expiry date.
    pub right_to_work_expiry_date: String,
    /// References received.
    pub references_received: Option<i32>,
    /// References required.
    pub references_required: Option<i32>,
    /// References satisfactory.
    pub references_satisfactory: YesNo,
    /// Identity verified.
    pub identity_verified: YesNo,
    /// Pre employment notes.
    pub pre_employment_notes: String,
}

/// Step 3 — Occupational Health.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OccupationalHealth {
    /// Oh questionnaire submitted.
    pub oh_questionnaire_submitted: YesNo,
    /// Oh clearance received.
    pub oh_clearance_received: YesNo,
    /// Oh clearance date.
    pub oh_clearance_date: String,
    /// Oh restrictions.
    pub oh_restrictions: YesNo,
    /// Oh restriction details.
    pub oh_restriction_details: String,
    /// Hepatitis b status.
    pub hepatitis_b_status: String,
    /// Tb screening status.
    pub tb_screening_status: String,
    /// Immunisation status.
    pub immunisation_status: String,
    /// Fit to work.
    pub fit_to_work: YesNo,
    /// Occupational health notes.
    pub occupational_health_notes: String,
}

/// Step 4 — Mandatory Training.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MandatoryTraining {
    /// Fire safety completed.
    pub fire_safety_completed: YesNo,
    /// Fire safety date.
    pub fire_safety_date: String,
    /// Manual handling completed.
    pub manual_handling_completed: YesNo,
    /// Manual handling date.
    pub manual_handling_date: String,
    /// Infection control completed.
    pub infection_control_completed: YesNo,
    /// Infection control date.
    pub infection_control_date: String,
    /// Safeguarding adults completed.
    pub safeguarding_adults_completed: YesNo,
    /// Safeguarding adults level.
    pub safeguarding_adults_level: String,
    /// Safeguarding children completed.
    pub safeguarding_children_completed: YesNo,
    /// Safeguarding children level.
    pub safeguarding_children_level: String,
    /// Information governance completed.
    pub information_governance_completed: YesNo,
    /// Information governance date.
    pub information_governance_date: String,
    /// Basic life support completed.
    pub basic_life_support_completed: YesNo,
    /// Basic life support date.
    pub basic_life_support_date: String,
    /// Equality diversity completed.
    pub equality_diversity_completed: YesNo,
    /// Health safety completed.
    pub health_safety_completed: YesNo,
    /// Conflict resolution completed.
    pub conflict_resolution_completed: YesNo,
    /// Mandatory training notes.
    pub mandatory_training_notes: String,
}

/// Step 5 — Professional Registration.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProfessionalRegistration {
    /// Registration required.
    pub registration_required: YesNo,
    /// Regulatory body.
    pub regulatory_body: String,
    /// Regulatory body other.
    pub regulatory_body_other: String,
    /// Registration number.
    pub registration_number: String,
    /// Registration verified.
    pub registration_verified: YesNo,
    /// Registration expiry date.
    pub registration_expiry_date: String,
    /// Registration conditions.
    pub registration_conditions: YesNo,
    /// Registration condition details.
    pub registration_condition_details: String,
    /// Revalidation date.
    pub revalidation_date: String,
    /// Indemnity insurance.
    pub indemnity_insurance: String,
    /// Professional registration notes.
    pub professional_registration_notes: String,
}

/// Step 6 — IT Systems & Access.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ITSystemsAccess {
    /// NHS smartcard issued.
    pub nhs_smartcard_issued: YesNo,
    /// NHS smartcard number.
    pub nhs_smartcard_number: String,
    /// Email account created.
    pub email_account_created: YesNo,
    /// Network login created.
    pub network_login_created: YesNo,
    /// Clinical system access.
    pub clinical_system_access: YesNo,
    /// Clinical system name.
    pub clinical_system_name: String,
    /// Clinical system training completed.
    pub clinical_system_training_completed: YesNo,
    /// Rostering system access.
    pub rostering_system_access: YesNo,
    /// Phone extension.
    pub phone_extension: String,
    /// Bleep number.
    pub bleep_number: String,
    /// It access notes.
    pub it_access_notes: String,
}

/// Step 7 — Uniform & ID Badge.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UniformIDBadge {
    /// Uniform required.
    pub uniform_required: YesNo,
    /// Uniform ordered.
    pub uniform_ordered: YesNo,
    /// Uniform received.
    pub uniform_received: YesNo,
    /// Uniform size.
    pub uniform_size: String,
    /// ID badge photo taken.
    pub id_badge_photo_taken: YesNo,
    /// ID badge issued.
    pub id_badge_issued: YesNo,
    /// ID badge number.
    pub id_badge_number: String,
    /// Access card issued.
    pub access_card_issued: YesNo,
    /// Access card areas.
    pub access_card_areas: String,
    /// Locker allocated.
    pub locker_allocated: YesNo,
    /// Locker number.
    pub locker_number: String,
    /// Uniform ID notes.
    pub uniform_id_notes: String,
}

/// Step 8 — Induction Programme.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InductionProgramme {
    /// Corporate induction completed.
    pub corporate_induction_completed: YesNo,
    /// Corporate induction date.
    pub corporate_induction_date: String,
    /// Local induction completed.
    pub local_induction_completed: YesNo,
    /// Local induction date.
    pub local_induction_date: String,
    /// Department tour completed.
    pub department_tour_completed: YesNo,
    /// Introduced to team.
    pub introduced_to_team: YesNo,
    /// Emergency procedures briefed.
    pub emergency_procedures_briefed: YesNo,
    /// Policies handbook received.
    pub policies_handbook_received: YesNo,
    /// Buddy assigned.
    pub buddy_assigned: YesNo,
    /// Buddy name.
    pub buddy_name: String,
    /// Induction programme notes.
    pub induction_programme_notes: String,
}

/// Step 9 — Probation & Supervision.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProbationSupervision {
    /// Probation period months.
    pub probation_period_months: Option<i32>,
    /// Probation start date.
    pub probation_start_date: String,
    /// Probation end date.
    pub probation_end_date: String,
    /// Line manager name.
    pub line_manager_name: String,
    /// Line manager email.
    pub line_manager_email: String,
    /// Supervisor name.
    pub supervisor_name: String,
    /// Supervision frequency.
    pub supervision_frequency: String,
    /// First supervision date.
    pub first_supervision_date: String,
    /// Objectives set.
    pub objectives_set: YesNo,
    /// Appraisal date agreed.
    pub appraisal_date_agreed: YesNo,
    /// Appraisal date.
    pub appraisal_date: String,
    /// Probation supervision notes.
    pub probation_supervision_notes: String,
}

/// Step 10 — Sign-off & Compliance.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SignOffCompliance {
    /// Confidentiality agreement signed.
    pub confidentiality_agreement_signed: YesNo,
    /// Code of conduct signed.
    pub code_of_conduct_signed: YesNo,
    /// Social media policy acknowledged.
    pub social_media_policy_acknowledged: YesNo,
    /// It acceptable use signed.
    pub it_acceptable_use_signed: YesNo,
    /// Gdpr training completed.
    pub gdpr_training_completed: YesNo,
    /// Duty of candour briefed.
    pub duty_of_candour_briefed: YesNo,
    /// Whistleblowing policy briefed.
    pub whistleblowing_policy_briefed: YesNo,
    /// Employee signed off.
    pub employee_signed_off: YesNo,
    /// Employee sign off date.
    pub employee_sign_off_date: String,
    /// Manager signed off.
    pub manager_signed_off: YesNo,
    /// Manager sign off date.
    pub manager_sign_off_date: String,
    /// Manager sign off name.
    pub manager_sign_off_name: String,
    /// Sign off compliance notes.
    pub sign_off_compliance_notes: String,
}

/// Full Employee Onboarding Checklist record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Demographics.
    pub demographics: Demographics,
    /// Pre employment checks.
    pub pre_employment_checks: PreEmploymentChecks,
    /// Occupational health.
    pub occupational_health: OccupationalHealth,
    /// Mandatory training.
    pub mandatory_training: MandatoryTraining,
    /// Professional registration.
    pub professional_registration: ProfessionalRegistration,
    /// It systems access.
    #[serde(rename = "itSystemsAccess")]
    pub it_systems_access: ITSystemsAccess,
    /// Uniform ID badge.
    #[serde(rename = "uniformIDBadge")]
    pub uniform_id_badge: UniformIDBadge,
    /// Induction programme.
    pub induction_programme: InductionProgramme,
    /// Probation supervision.
    pub probation_supervision: ProbationSupervision,
    /// Sign off compliance.
    pub sign_off_compliance: SignOffCompliance,
}

/// A rule that fired during grading.
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

/// A safety flag computed independently of completion (real-time alert).
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

/// Grading output for an onboarding checklist.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Completion percentage.
    pub completion_percentage: f64,
    /// Completion status.
    pub completion_status: CompletionStatus,
    /// Overall risk.
    pub overall_risk: RiskLevel,
    /// Items completed.
    pub items_completed: u32,
    /// Items total.
    pub items_total: u32,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
