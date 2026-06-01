use employee_offboarding_checklist_tera_crate::engine::checklist_validator::{run_rules, validate};
use employee_offboarding_checklist_tera_crate::engine::types::*;
use employee_offboarding_checklist_tera_crate::engine::validation_rules::all_rules;

/// Build a fully-completed offboarding assessment where every rule is
/// satisfied.
fn fully_completed_case() -> AssessmentData {
    AssessmentData {
        employee_details: EmployeeDetails {
            first_name: "Jane".to_string(),
            last_name: "Doe".to_string(),
            employee_id: "EMP-001".to_string(),
            email: "jane.doe@example.org".to_string(),
            job_title: "Senior Nurse".to_string(),
            department: "Cardiology".to_string(),
            line_manager: "Mary Smith".to_string(),
            start_date: "2018-01-15".to_string(),
            last_working_day: "2026-05-31".to_string(),
            reason_for_leaving: "resignation".to_string(),
            reason_for_leaving_other: String::new(),
            employee_details_notes: String::new(),
        },
        exit_interview: ExitInterview {
            interview_offered: "yes".to_string(),
            interview_completed: "yes".to_string(),
            interview_date: "2026-05-28".to_string(),
            interviewer_name: "HR Officer".to_string(),
            feedback_provided: "yes".to_string(),
            feedback_documented: "yes".to_string(),
            concerns_raised: "no".to_string(),
            concerns_details: String::new(),
            exit_interview_notes: String::new(),
        },
        knowledge_transfer: KnowledgeTransfer {
            successor_identified: "yes".to_string(),
            successor_name: "John Apprentice".to_string(),
            handover_document_created: "yes".to_string(),
            handover_meetings_held: "yes".to_string(),
            work_in_progress_documented: "yes".to_string(),
            key_contacts_shared: "yes".to_string(),
            sop_files_transferred: "yes".to_string(),
            clinical_caseload_reassigned: "yes".to_string(),
            knowledge_transfer_notes: String::new(),
        },
        equipment_return: EquipmentReturn {
            laptop_returned: "yes".to_string(),
            laptop_asset_tag: "LAP-100".to_string(),
            mobile_phone_returned: "yes".to_string(),
            id_badge_returned: "yes".to_string(),
            keys_returned: "yes".to_string(),
            uniform_returned: "yes".to_string(),
            parking_pass_returned: "yes".to_string(),
            other_equipment_returned: "na".to_string(),
            other_equipment_description: String::new(),
            equipment_return_notes: String::new(),
        },
        access_revocation: AccessRevocation {
            email_revoked: "yes".to_string(),
            ehr_epr_revoked: "yes".to_string(),
            vpn_revoked: "yes".to_string(),
            active_directory_disabled: "yes".to_string(),
            building_access_revoked: "yes".to_string(),
            cloud_apps_revoked: "yes".to_string(),
            smartcard_deactivated: "yes".to_string(),
            data_download_audit_performed: "yes".to_string(),
            unauthorised_download_detected: "no".to_string(),
            access_revocation_notes: String::new(),
        },
        final_payroll_benefits: FinalPayrollBenefits {
            final_salary_calculated: "yes".to_string(),
            accrued_holiday_paid: "yes".to_string(),
            expenses_reimbursed: "yes".to_string(),
            pension_information_provided: "yes".to_string(),
            p45_issued: "yes".to_string(),
            benefits_terminated: "yes".to_string(),
            payroll_details_confirmed: "yes".to_string(),
            final_payment_date: "2026-06-15".to_string(),
            final_payroll_notes: String::new(),
        },
        references_recommendations: ReferencesRecommendations {
            reference_consent_given: "yes".to_string(),
            reference_contact_details_recorded: "yes".to_string(),
            recommendation_letter_requested: "no".to_string(),
            recommendation_letter_provided: "no".to_string(),
            reference_policy_explained: "yes".to_string(),
            references_notes: String::new(),
        },
        non_disclosure_post_employment: NonDisclosurePostEmployment {
            confidentiality_reaffirmed: "yes".to_string(),
            nda_signed: "yes".to_string(),
            restrictive_covenants_explained: "yes".to_string(),
            restrictive_covenants_acknowledged: "yes".to_string(),
            intellectual_property_assigned: "yes".to_string(),
            data_returned_or_destroyed: "yes".to_string(),
            post_employment_obligations_explained: "yes".to_string(),
            nda_notes: String::new(),
        },
        forwarding_details: ForwardingDetails {
            forwarding_address_line1: "1 The Avenue".to_string(),
            forwarding_address_line2: String::new(),
            forwarding_city: "Bristol".to_string(),
            forwarding_postcode: "BS1 1AA".to_string(),
            forwarding_country: "United Kingdom".to_string(),
            personal_email: "jane@personal.example".to_string(),
            personal_phone: "07700 900000".to_string(),
            forwarding_details_confirmed: "yes".to_string(),
            forwarding_notes: String::new(),
        },
        signoff: Signoff {
            hr_signed_off: "yes".to_string(),
            hr_sign_off_name: "HR Officer".to_string(),
            hr_sign_off_date: "2026-05-31".to_string(),
            line_manager_signed_off: "yes".to_string(),
            line_manager_sign_off_name: "Mary Smith".to_string(),
            line_manager_sign_off_date: "2026-05-31".to_string(),
            it_signed_off: "yes".to_string(),
            it_sign_off_name: "IT Manager".to_string(),
            it_sign_off_date: "2026-05-31".to_string(),
            employee_acknowledged: "yes".to_string(),
            employee_sign_off_date: "2026-05-31".to_string(),
            signoff_notes: String::new(),
        },
    }
}

#[test]
fn empty_case_is_incomplete() {
    let data = AssessmentData::default();
    let result = validate(&data);
    assert_eq!(result.outcome, "incomplete");
    assert!(!result.blockers.is_empty());
}

#[test]
fn fully_completed_case_is_complete() {
    let data = fully_completed_case();
    let result = validate(&data);
    assert_eq!(result.outcome, "complete");
    assert_eq!(result.completion_percent, 100.0);
    assert!(result.blockers.is_empty());
    assert!(result.fired_rules.is_empty());
}

#[test]
fn missing_laptop_yields_incomplete_with_blocker() {
    let mut data = fully_completed_case();
    data.equipment_return.laptop_returned = String::new();
    let result = validate(&data);
    assert_eq!(result.outcome, "incomplete");
    assert!(result.blockers.iter().any(|b| b.id == "EQ-001"));
}

#[test]
fn missing_non_mandatory_yields_partial() {
    let mut data = fully_completed_case();
    // SO-004 (employee_acknowledged) is non-mandatory; firing it should
    // demote outcome from complete to partial.
    data.signoff.employee_acknowledged = String::new();
    let result = validate(&data);
    assert_eq!(result.outcome, "partial");
    assert!(result.fired_rules.iter().any(|r| r.id == "SO-004"));
}

#[test]
fn rule_ids_are_unique() {
    let rules = all_rules();
    let mut ids: Vec<&str> = rules.iter().map(|r| r.id).collect();
    ids.sort();
    let len_before = ids.len();
    ids.dedup();
    assert_eq!(ids.len(), len_before, "rule IDs must be unique");
}

#[test]
fn run_rules_returns_only_fired() {
    let data = fully_completed_case();
    let fired = run_rules(&data);
    assert!(fired.is_empty(), "fully completed case should have no fired rules");
}
