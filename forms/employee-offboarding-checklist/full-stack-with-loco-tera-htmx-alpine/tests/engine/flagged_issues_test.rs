use employee_offboarding_checklist_tera_crate::engine::flagged_issues::detect_additional_flags;
use employee_offboarding_checklist_tera_crate::engine::types::*;

fn clean_case() -> AssessmentData {
    AssessmentData {
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
        equipment_return: EquipmentReturn {
            laptop_returned: "yes".to_string(),
            laptop_asset_tag: String::new(),
            mobile_phone_returned: "yes".to_string(),
            id_badge_returned: "yes".to_string(),
            keys_returned: "yes".to_string(),
            uniform_returned: "yes".to_string(),
            parking_pass_returned: "yes".to_string(),
            other_equipment_returned: "na".to_string(),
            other_equipment_description: String::new(),
            equipment_return_notes: String::new(),
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
        knowledge_transfer: KnowledgeTransfer {
            successor_identified: "yes".to_string(),
            successor_name: String::new(),
            handover_document_created: "yes".to_string(),
            handover_meetings_held: "yes".to_string(),
            work_in_progress_documented: "yes".to_string(),
            key_contacts_shared: "yes".to_string(),
            sop_files_transferred: "yes".to_string(),
            clinical_caseload_reassigned: "yes".to_string(),
            knowledge_transfer_notes: String::new(),
        },
        exit_interview: ExitInterview {
            interview_offered: "yes".to_string(),
            interview_completed: "yes".to_string(),
            interview_date: String::new(),
            interviewer_name: String::new(),
            feedback_provided: "yes".to_string(),
            feedback_documented: "yes".to_string(),
            concerns_raised: "no".to_string(),
            concerns_details: String::new(),
            exit_interview_notes: String::new(),
        },
        final_payroll_benefits: FinalPayrollBenefits {
            final_salary_calculated: "yes".to_string(),
            accrued_holiday_paid: "yes".to_string(),
            expenses_reimbursed: "yes".to_string(),
            pension_information_provided: "yes".to_string(),
            p45_issued: "yes".to_string(),
            benefits_terminated: "yes".to_string(),
            payroll_details_confirmed: "yes".to_string(),
            final_payment_date: String::new(),
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
        forwarding_details: ForwardingDetails {
            forwarding_address_line1: "1 The Avenue".to_string(),
            forwarding_address_line2: String::new(),
            forwarding_city: "Bristol".to_string(),
            forwarding_postcode: "BS1 1AA".to_string(),
            forwarding_country: "United Kingdom".to_string(),
            personal_email: String::new(),
            personal_phone: String::new(),
            forwarding_details_confirmed: "yes".to_string(),
            forwarding_notes: String::new(),
        },
        ..AssessmentData::default()
    }
}

#[test]
fn clean_case_has_no_flags() {
    let flags = detect_additional_flags(&clean_case());
    assert!(flags.is_empty(), "clean case should produce no flags: {flags:?}");
}

#[test]
fn unauthorised_download_emits_high_priority_flag() {
    let mut data = clean_case();
    data.access_revocation.unauthorised_download_detected = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-AC-001" && f.priority == "high"));
}

#[test]
fn outstanding_access_emits_high_priority_flag() {
    let mut data = clean_case();
    data.access_revocation.email_revoked = String::new();
    let flags = detect_additional_flags(&data);
    let flag = flags.iter().find(|f| f.id == "FLAG-AC-002").expect("access flag");
    assert_eq!(flag.priority, "high");
    assert!(flag.message.contains("Email"));
}

#[test]
fn no_nda_reaffirmation_emits_flag() {
    let mut data = clean_case();
    data.non_disclosure_post_employment.confidentiality_reaffirmed = String::new();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-NDA-001" && f.priority == "high"));
}

#[test]
fn missing_equipment_emits_high_priority_flag() {
    let mut data = clean_case();
    data.equipment_return.laptop_returned = String::new();
    let flags = detect_additional_flags(&data);
    let flag = flags.iter().find(|f| f.id == "FLAG-EQ-001").expect("equipment flag");
    assert_eq!(flag.priority, "high");
    assert!(flag.message.contains("Laptop"));
}

#[test]
fn forwarding_address_missing_emits_low_flag() {
    let mut data = clean_case();
    data.forwarding_details.forwarding_address_line1 = String::new();
    let flags = detect_additional_flags(&data);
    let flag = flags.iter().find(|f| f.id == "FLAG-FWD-001").expect("forwarding flag");
    assert_eq!(flag.priority, "low");
}

#[test]
fn flags_are_sorted_by_priority() {
    let mut data = clean_case();
    // One high, one medium, one low.
    data.access_revocation.unauthorised_download_detected = "yes".to_string();
    data.exit_interview.interview_completed = "no".to_string();
    data.forwarding_details.forwarding_address_line1 = String::new();
    let flags = detect_additional_flags(&data);
    let priorities: Vec<&str> = flags.iter().map(|f| f.priority.as_str()).collect();
    let mut sorted = priorities.clone();
    sorted.sort_by_key(|p| match *p {
        "high" => 0,
        "medium" => 1,
        "low" => 2,
        _ => 3,
    });
    assert_eq!(priorities, sorted);
}
