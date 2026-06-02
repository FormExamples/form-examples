use serde::{Deserialize, Serialize};

/// Yes / No / Not-Applicable enum (empty string = unanswered).
pub type YesNoNa = String;
/// Yes / No enum (empty string = unanswered).
pub type YesNo = String;

/// Step 1 — Employee Details.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EmployeeDetails {
    pub first_name: String,
    pub last_name: String,
    pub employee_id: String,
    pub email: String,
    pub job_title: String,
    pub department: String,
    pub line_manager: String,
    pub start_date: String,
    pub last_working_day: String,
    pub reason_for_leaving: String,
    pub reason_for_leaving_other: String,
    pub employee_details_notes: String,
}

/// Step 2 — Exit Interview.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ExitInterview {
    pub interview_offered: YesNo,
    pub interview_completed: YesNo,
    pub interview_date: String,
    pub interviewer_name: String,
    pub feedback_provided: YesNo,
    pub feedback_documented: YesNo,
    pub concerns_raised: YesNo,
    pub concerns_details: String,
    pub exit_interview_notes: String,
}

/// Step 3 — Knowledge Transfer.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct KnowledgeTransfer {
    pub successor_identified: YesNo,
    pub successor_name: String,
    pub handover_document_created: YesNo,
    pub handover_meetings_held: YesNo,
    pub work_in_progress_documented: YesNo,
    pub key_contacts_shared: YesNo,
    pub sop_files_transferred: YesNo,
    pub clinical_caseload_reassigned: YesNo,
    pub knowledge_transfer_notes: String,
}

/// Step 4 — Equipment Return.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EquipmentReturn {
    pub laptop_returned: YesNoNa,
    pub laptop_asset_tag: String,
    pub mobile_phone_returned: YesNoNa,
    pub id_badge_returned: YesNoNa,
    pub keys_returned: YesNoNa,
    pub uniform_returned: YesNoNa,
    pub parking_pass_returned: YesNoNa,
    pub other_equipment_returned: YesNoNa,
    pub other_equipment_description: String,
    pub equipment_return_notes: String,
}

/// Step 5 — Access Revocation.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AccessRevocation {
    pub email_revoked: YesNo,
    pub ehr_epr_revoked: YesNo,
    pub vpn_revoked: YesNo,
    pub active_directory_disabled: YesNo,
    pub building_access_revoked: YesNo,
    pub cloud_apps_revoked: YesNo,
    pub smartcard_deactivated: YesNo,
    pub data_download_audit_performed: YesNo,
    pub unauthorised_download_detected: YesNo,
    pub access_revocation_notes: String,
}

/// Step 6 — Final Payroll & Benefits.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FinalPayrollBenefits {
    pub final_salary_calculated: YesNo,
    pub accrued_holiday_paid: YesNo,
    pub expenses_reimbursed: YesNo,
    pub pension_information_provided: YesNo,
    pub p45_issued: YesNo,
    pub benefits_terminated: YesNo,
    pub payroll_details_confirmed: YesNo,
    pub final_payment_date: String,
    pub final_payroll_notes: String,
}

/// Step 7 — References & Recommendations.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReferencesRecommendations {
    pub reference_consent_given: YesNo,
    pub reference_contact_details_recorded: YesNo,
    pub recommendation_letter_requested: YesNo,
    pub recommendation_letter_provided: YesNo,
    pub reference_policy_explained: YesNo,
    pub references_notes: String,
}

/// Step 8 — Non-Disclosure & Post-Employment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NonDisclosurePostEmployment {
    pub confidentiality_reaffirmed: YesNo,
    pub nda_signed: YesNo,
    pub restrictive_covenants_explained: YesNo,
    pub restrictive_covenants_acknowledged: YesNo,
    pub intellectual_property_assigned: YesNo,
    pub data_returned_or_destroyed: YesNo,
    pub post_employment_obligations_explained: YesNo,
    pub nda_notes: String,
}

/// Step 9 — Forwarding Details.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ForwardingDetails {
    pub forwarding_address_line1: String,
    pub forwarding_address_line2: String,
    pub forwarding_city: String,
    pub forwarding_postcode: String,
    pub forwarding_country: String,
    pub personal_email: String,
    pub personal_phone: String,
    pub forwarding_details_confirmed: YesNo,
    pub forwarding_notes: String,
}

/// Step 10 — Sign-off.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Signoff {
    pub hr_signed_off: YesNo,
    pub hr_sign_off_name: String,
    pub hr_sign_off_date: String,
    pub line_manager_signed_off: YesNo,
    pub line_manager_sign_off_name: String,
    pub line_manager_sign_off_date: String,
    pub it_signed_off: YesNo,
    pub it_sign_off_name: String,
    pub it_sign_off_date: String,
    pub employee_acknowledged: YesNo,
    pub employee_sign_off_date: String,
    pub signoff_notes: String,
}

/// Full Employee Offboarding Checklist assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub employee_details: EmployeeDetails,
    pub exit_interview: ExitInterview,
    pub knowledge_transfer: KnowledgeTransfer,
    pub equipment_return: EquipmentReturn,
    pub access_revocation: AccessRevocation,
    pub final_payroll_benefits: FinalPayrollBenefits,
    pub references_recommendations: ReferencesRecommendations,
    pub non_disclosure_post_employment: NonDisclosurePostEmployment,
    pub forwarding_details: ForwardingDetails,
    pub signoff: Signoff,
}

/// A validation rule that has fired (the item is outstanding).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub category: String,
    pub description: String,
    pub mandatory: bool,
    pub blocker: bool,
}

/// A blocker — a mandatory + blocker rule that has fired.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Blocker {
    pub id: String,
    pub category: String,
    pub description: String,
}

/// A safety / HR / security flag computed independently of the rule engine.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: String,
}

/// Validation engine output for an offboarding checklist.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ValidationResult {
    pub outcome: String,
    pub completion_percent: f64,
    pub blockers: Vec<Blocker>,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub mandatory_total: u32,
    pub mandatory_satisfied: u32,
    pub timestamp: String,
}
