use employee_onboarding_checklist_tera_crate::engine::onboarding_grader::{grade, run_rules};
use employee_onboarding_checklist_tera_crate::engine::onboarding_rules::all_rules;
use employee_onboarding_checklist_tera_crate::engine::types::*;

fn fully_completed() -> AssessmentData {
    AssessmentData {
        demographics: Demographics {
            first_name: "Alice".to_string(),
            last_name: "Smith".to_string(),
            date_of_birth: "1990-04-11".to_string(),
            email: "alice@example.com".to_string(),
            phone: "01234 567890".to_string(),
            job_title: "Staff Nurse".to_string(),
            department: "ICU".to_string(),
            start_date: "2026-07-01".to_string(),
            emergency_contact_name: "Bob Smith".to_string(),
            emergency_contact_phone: "07700 900000".to_string(),
            emergency_contact_relationship: "Spouse".to_string(),
        },
        pre_employment_checks: PreEmploymentChecks {
            dbs_check_status: "cleared".to_string(),
            dbs_certificate_number: "001".to_string(),
            dbs_check_date: "2026-06-01".to_string(),
            dbs_update_service_registered: "yes".to_string(),
            right_to_work_verified: "yes".to_string(),
            right_to_work_document_type: "Passport".to_string(),
            right_to_work_expiry_date: "2030-01-01".to_string(),
            references_received: Some(2),
            references_required: Some(2),
            references_satisfactory: "yes".to_string(),
            identity_verified: "yes".to_string(),
            pre_employment_notes: String::new(),
        },
        occupational_health: OccupationalHealth {
            oh_questionnaire_submitted: "yes".to_string(),
            oh_clearance_received: "yes".to_string(),
            oh_clearance_date: "2026-06-15".to_string(),
            oh_restrictions: "no".to_string(),
            oh_restriction_details: String::new(),
            hepatitis_b_status: "immune".to_string(),
            tb_screening_status: "completed".to_string(),
            immunisation_status: "complete".to_string(),
            fit_to_work: "yes".to_string(),
            occupational_health_notes: String::new(),
        },
        mandatory_training: MandatoryTraining {
            fire_safety_completed: "yes".to_string(),
            fire_safety_date: "2026-06-10".to_string(),
            manual_handling_completed: "yes".to_string(),
            manual_handling_date: "2026-06-10".to_string(),
            infection_control_completed: "yes".to_string(),
            infection_control_date: "2026-06-10".to_string(),
            safeguarding_adults_completed: "yes".to_string(),
            safeguarding_adults_level: "level-2".to_string(),
            safeguarding_children_completed: "yes".to_string(),
            safeguarding_children_level: "level-2".to_string(),
            information_governance_completed: "yes".to_string(),
            information_governance_date: "2026-06-10".to_string(),
            basic_life_support_completed: "yes".to_string(),
            basic_life_support_date: "2026-06-10".to_string(),
            equality_diversity_completed: "yes".to_string(),
            health_safety_completed: "yes".to_string(),
            conflict_resolution_completed: "yes".to_string(),
            mandatory_training_notes: String::new(),
        },
        professional_registration: ProfessionalRegistration {
            registration_required: "yes".to_string(),
            regulatory_body: "nmc".to_string(),
            regulatory_body_other: String::new(),
            registration_number: "12345678".to_string(),
            registration_verified: "yes".to_string(),
            registration_expiry_date: "2030-01-01".to_string(),
            registration_conditions: "no".to_string(),
            registration_condition_details: String::new(),
            revalidation_date: "2029-01-01".to_string(),
            indemnity_insurance: "yes".to_string(),
            professional_registration_notes: String::new(),
        },
        it_systems_access: ITSystemsAccess {
            nhs_smartcard_issued: "yes".to_string(),
            nhs_smartcard_number: "SC-1".to_string(),
            email_account_created: "yes".to_string(),
            network_login_created: "yes".to_string(),
            clinical_system_access: "yes".to_string(),
            clinical_system_name: "EPR".to_string(),
            clinical_system_training_completed: "yes".to_string(),
            rostering_system_access: "yes".to_string(),
            phone_extension: "1234".to_string(),
            bleep_number: "5678".to_string(),
            it_access_notes: String::new(),
        },
        uniform_id_badge: UniformIDBadge {
            uniform_required: "yes".to_string(),
            uniform_ordered: "yes".to_string(),
            uniform_received: "yes".to_string(),
            uniform_size: "M".to_string(),
            id_badge_photo_taken: "yes".to_string(),
            id_badge_issued: "yes".to_string(),
            id_badge_number: "B-1".to_string(),
            access_card_issued: "yes".to_string(),
            access_card_areas: "ICU, Theatre".to_string(),
            locker_allocated: "yes".to_string(),
            locker_number: "L-1".to_string(),
            uniform_id_notes: String::new(),
        },
        induction_programme: InductionProgramme {
            corporate_induction_completed: "yes".to_string(),
            corporate_induction_date: "2026-07-01".to_string(),
            local_induction_completed: "yes".to_string(),
            local_induction_date: "2026-07-02".to_string(),
            department_tour_completed: "yes".to_string(),
            introduced_to_team: "yes".to_string(),
            emergency_procedures_briefed: "yes".to_string(),
            policies_handbook_received: "yes".to_string(),
            buddy_assigned: "yes".to_string(),
            buddy_name: "Bea".to_string(),
            induction_programme_notes: String::new(),
        },
        probation_supervision: ProbationSupervision {
            probation_period_months: Some(6),
            probation_start_date: "2026-07-01".to_string(),
            probation_end_date: "2027-01-01".to_string(),
            line_manager_name: "Cara".to_string(),
            line_manager_email: "cara@example.com".to_string(),
            supervisor_name: "Dave".to_string(),
            supervision_frequency: "monthly".to_string(),
            first_supervision_date: "2026-07-15".to_string(),
            objectives_set: "yes".to_string(),
            appraisal_date_agreed: "yes".to_string(),
            appraisal_date: "2027-01-15".to_string(),
            probation_supervision_notes: String::new(),
        },
        sign_off_compliance: SignOffCompliance {
            confidentiality_agreement_signed: "yes".to_string(),
            code_of_conduct_signed: "yes".to_string(),
            social_media_policy_acknowledged: "yes".to_string(),
            it_acceptable_use_signed: "yes".to_string(),
            gdpr_training_completed: "yes".to_string(),
            duty_of_candour_briefed: "yes".to_string(),
            whistleblowing_policy_briefed: "yes".to_string(),
            employee_signed_off: "yes".to_string(),
            employee_sign_off_date: "2026-07-10".to_string(),
            manager_signed_off: "yes".to_string(),
            manager_sign_off_date: "2026-07-10".to_string(),
            manager_sign_off_name: "Cara".to_string(),
            sign_off_compliance_notes: String::new(),
        },
    }
}

#[test]
fn empty_assessment_is_not_started() {
    let data = AssessmentData::default();
    let result = grade(&data);
    assert_eq!(result.completion_status, "not-started");
    assert_eq!(result.completion_percentage, 0.0);
    assert_eq!(result.items_completed, 0);
    assert_eq!(result.overall_risk, "critical");
}

#[test]
fn fully_completed_is_complete() {
    let data = fully_completed();
    let result = grade(&data);
    assert_eq!(result.completion_status, "complete");
    assert_eq!(result.completion_percentage, 100.0);
    assert_eq!(result.overall_risk, "low");
    assert!(result.fired_rules.is_empty(), "no rules should fire");
}

#[test]
fn dbs_not_started_fires_critical_rule() {
    let mut data = fully_completed();
    data.pre_employment_checks.dbs_check_status = "not-started".to_string();
    let fired = run_rules(&data);
    let rule = fired.iter().find(|r| r.id == "DBS-001").expect("DBS-001 should fire");
    assert_eq!(rule.grade, 4);
}

#[test]
fn registration_required_but_not_verified_fires() {
    let mut data = fully_completed();
    data.professional_registration.registration_verified = "no".to_string();
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "REG-001"));
}

#[test]
fn rule_ids_are_unique() {
    let rules = all_rules();
    let mut ids: Vec<&str> = rules.iter().map(|r| r.id).collect();
    ids.sort();
    let before = ids.len();
    ids.dedup();
    assert_eq!(ids.len(), before, "rule IDs must be unique");
}

#[test]
fn references_incomplete_fires() {
    let mut data = fully_completed();
    data.pre_employment_checks.references_received = Some(1);
    data.pre_employment_checks.references_required = Some(2);
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "REF-002"));
}
