//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Yes / No / Not-Applicable enum (empty string = unanswered).
pub type YesNoNa = String;
/// Yes / No enum (empty string = unanswered).
pub type YesNo = String;

/// Step 1 — Employee Details.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EmployeeDetails {
    /// First name.
    pub first_name: String,
    /// Last name.
    pub last_name: String,
    /// Employee ID.
    pub employee_id: String,
    /// Email.
    pub email: String,
    /// Job title.
    pub job_title: String,
    /// Department.
    pub department: String,
    /// Line manager.
    pub line_manager: String,
    /// Start date.
    pub start_date: String,
    /// Last working day.
    pub last_working_day: String,
    /// Reason for leaving.
    pub reason_for_leaving: String,
    /// Reason for leaving other.
    pub reason_for_leaving_other: String,
    /// Employee details notes.
    pub employee_details_notes: String,
}

/// Step 2 — Exit Interview.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ExitInterview {
    /// Interview offered.
    pub interview_offered: YesNo,
    /// Interview completed.
    pub interview_completed: YesNo,
    /// Interview date.
    pub interview_date: String,
    /// Interviewer name.
    pub interviewer_name: String,
    /// Feedback provided.
    pub feedback_provided: YesNo,
    /// Feedback documented.
    pub feedback_documented: YesNo,
    /// Concerns raised.
    pub concerns_raised: YesNo,
    /// Concerns details.
    pub concerns_details: String,
    /// Exit interview notes.
    pub exit_interview_notes: String,
}

/// Step 3 — Knowledge Transfer.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct KnowledgeTransfer {
    /// Successor identified.
    pub successor_identified: YesNo,
    /// Successor name.
    pub successor_name: String,
    /// Handover document created.
    pub handover_document_created: YesNo,
    /// Handover meetings held.
    pub handover_meetings_held: YesNo,
    /// Work in progress documented.
    pub work_in_progress_documented: YesNo,
    /// Key contacts shared.
    pub key_contacts_shared: YesNo,
    /// Sop files transferred.
    pub sop_files_transferred: YesNo,
    /// Clinical caseload reassigned.
    pub clinical_caseload_reassigned: YesNo,
    /// Knowledge transfer notes.
    pub knowledge_transfer_notes: String,
}

/// Step 4 — Equipment Return.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EquipmentReturn {
    /// Laptop returned.
    pub laptop_returned: YesNoNa,
    /// Laptop asset tag.
    pub laptop_asset_tag: String,
    /// Mobile phone returned.
    pub mobile_phone_returned: YesNoNa,
    /// ID badge returned.
    pub id_badge_returned: YesNoNa,
    /// Keys returned.
    pub keys_returned: YesNoNa,
    /// Uniform returned.
    pub uniform_returned: YesNoNa,
    /// Parking pass returned.
    pub parking_pass_returned: YesNoNa,
    /// Other equipment returned.
    pub other_equipment_returned: YesNoNa,
    /// Other equipment description.
    pub other_equipment_description: String,
    /// Equipment return notes.
    pub equipment_return_notes: String,
}

/// Step 5 — Access Revocation.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AccessRevocation {
    /// Email revoked.
    pub email_revoked: YesNo,
    /// Ehr epr revoked.
    pub ehr_epr_revoked: YesNo,
    /// Vpn revoked.
    pub vpn_revoked: YesNo,
    /// Active directory disabled.
    pub active_directory_disabled: YesNo,
    /// Building access revoked.
    pub building_access_revoked: YesNo,
    /// Cloud apps revoked.
    pub cloud_apps_revoked: YesNo,
    /// Smartcard deactivated.
    pub smartcard_deactivated: YesNo,
    /// Data download audit performed.
    pub data_download_audit_performed: YesNo,
    /// Unauthorised download detected.
    pub unauthorised_download_detected: YesNo,
    /// Access revocation notes.
    pub access_revocation_notes: String,
}

/// Step 6 — Final Payroll & Benefits.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FinalPayrollBenefits {
    /// Final salary calculated.
    pub final_salary_calculated: YesNo,
    /// Accrued holiday paid.
    pub accrued_holiday_paid: YesNo,
    /// Expenses reimbursed.
    pub expenses_reimbursed: YesNo,
    /// Pension information provided.
    pub pension_information_provided: YesNo,
    /// P45 issued.
    pub p45_issued: YesNo,
    /// Benefits terminated.
    pub benefits_terminated: YesNo,
    /// Payroll details confirmed.
    pub payroll_details_confirmed: YesNo,
    /// Final payment date.
    pub final_payment_date: String,
    /// Final payroll notes.
    pub final_payroll_notes: String,
}

/// Step 7 — References & Recommendations.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReferencesRecommendations {
    /// Reference consent given.
    pub reference_consent_given: YesNo,
    /// Reference contact details recorded.
    pub reference_contact_details_recorded: YesNo,
    /// Recommendation letter requested.
    pub recommendation_letter_requested: YesNo,
    /// Recommendation letter provided.
    pub recommendation_letter_provided: YesNo,
    /// Reference policy explained.
    pub reference_policy_explained: YesNo,
    /// References notes.
    pub references_notes: String,
}

/// Step 8 — Non-Disclosure & Post-Employment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NonDisclosurePostEmployment {
    /// Confidentiality reaffirmed.
    pub confidentiality_reaffirmed: YesNo,
    /// Nda signed.
    pub nda_signed: YesNo,
    /// Restrictive covenants explained.
    pub restrictive_covenants_explained: YesNo,
    /// Restrictive covenants acknowledged.
    pub restrictive_covenants_acknowledged: YesNo,
    /// Intellectual property assigned.
    pub intellectual_property_assigned: YesNo,
    /// Data returned or destroyed.
    pub data_returned_or_destroyed: YesNo,
    /// Post employment obligations explained.
    pub post_employment_obligations_explained: YesNo,
    /// Nda notes.
    pub nda_notes: String,
}

/// Step 9 — Forwarding Details.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ForwardingDetails {
    /// Forwarding address line1.
    pub forwarding_address_line1: String,
    /// Forwarding address line2.
    pub forwarding_address_line2: String,
    /// Forwarding city.
    pub forwarding_city: String,
    /// Forwarding postcode.
    pub forwarding_postcode: String,
    /// Forwarding country.
    pub forwarding_country: String,
    /// Personal email.
    pub personal_email: String,
    /// Personal phone.
    pub personal_phone: String,
    /// Forwarding details confirmed.
    pub forwarding_details_confirmed: YesNo,
    /// Forwarding notes.
    pub forwarding_notes: String,
}

/// Step 10 — Sign-off.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Signoff {
    /// HR signed off.
    pub hr_signed_off: YesNo,
    /// HR sign off name.
    pub hr_sign_off_name: String,
    /// HR sign off date.
    pub hr_sign_off_date: String,
    /// Line manager signed off.
    pub line_manager_signed_off: YesNo,
    /// Line manager sign off name.
    pub line_manager_sign_off_name: String,
    /// Line manager sign off date.
    pub line_manager_sign_off_date: String,
    /// It signed off.
    pub it_signed_off: YesNo,
    /// It sign off name.
    pub it_sign_off_name: String,
    /// It sign off date.
    pub it_sign_off_date: String,
    /// Employee acknowledged.
    pub employee_acknowledged: YesNo,
    /// Employee sign off date.
    pub employee_sign_off_date: String,
    /// Signoff notes.
    pub signoff_notes: String,
}

/// Full Employee Offboarding Checklist assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Employee details.
    pub employee_details: EmployeeDetails,
    /// Exit interview.
    pub exit_interview: ExitInterview,
    /// Knowledge transfer.
    pub knowledge_transfer: KnowledgeTransfer,
    /// Equipment return.
    pub equipment_return: EquipmentReturn,
    /// Access revocation.
    pub access_revocation: AccessRevocation,
    /// Final payroll benefits.
    pub final_payroll_benefits: FinalPayrollBenefits,
    /// References recommendations.
    pub references_recommendations: ReferencesRecommendations,
    /// Non disclosure post employment.
    pub non_disclosure_post_employment: NonDisclosurePostEmployment,
    /// Forwarding details.
    pub forwarding_details: ForwardingDetails,
    /// Signoff.
    pub signoff: Signoff,
}

/// A validation rule that has fired (the item is outstanding).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Description.
    pub description: String,
    /// Mandatory.
    pub mandatory: bool,
    /// Blocker.
    pub blocker: bool,
}

/// A blocker — a mandatory + blocker rule that has fired.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Blocker {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Description.
    pub description: String,
}

/// A safety / HR / security flag computed independently of the rule engine.
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

/// Validation engine output for an offboarding checklist.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ValidationResult {
    /// Outcome.
    pub outcome: String,
    /// Completion percent.
    pub completion_percent: f64,
    /// Blockers.
    pub blockers: Vec<Blocker>,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Mandatory total.
    pub mandatory_total: u32,
    /// Mandatory satisfied.
    pub mandatory_satisfied: u32,
    /// Timestamp.
    pub timestamp: String,
}
