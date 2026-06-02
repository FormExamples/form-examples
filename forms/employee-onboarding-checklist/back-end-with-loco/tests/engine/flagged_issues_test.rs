use employee_onboarding_checklist_loco_crate::engine::flagged_issues::detect_additional_flags;
use employee_onboarding_checklist_loco_crate::engine::types::*;

fn baseline() -> AssessmentData {
    AssessmentData {
        pre_employment_checks: PreEmploymentChecks {
            dbs_check_status: "cleared".to_string(),
            right_to_work_verified: "yes".to_string(),
            references_satisfactory: "yes".to_string(),
            identity_verified: "yes".to_string(),
            ..PreEmploymentChecks::default()
        },
        occupational_health: OccupationalHealth {
            oh_clearance_received: "yes".to_string(),
            fit_to_work: "yes".to_string(),
            immunisation_status: "complete".to_string(),
            ..OccupationalHealth::default()
        },
        mandatory_training: MandatoryTraining {
            fire_safety_completed: "yes".to_string(),
            infection_control_completed: "yes".to_string(),
            safeguarding_adults_completed: "yes".to_string(),
            safeguarding_children_completed: "yes".to_string(),
            basic_life_support_completed: "yes".to_string(),
            information_governance_completed: "yes".to_string(),
            ..MandatoryTraining::default()
        },
        professional_registration: ProfessionalRegistration {
            registration_required: "no".to_string(),
            ..ProfessionalRegistration::default()
        },
        uniform_id_badge: UniformIDBadge {
            id_badge_issued: "yes".to_string(),
            ..UniformIDBadge::default()
        },
        sign_off_compliance: SignOffCompliance {
            confidentiality_agreement_signed: "yes".to_string(),
            manager_signed_off: "yes".to_string(),
            ..SignOffCompliance::default()
        },
        ..AssessmentData::default()
    }
}

#[test]
fn baseline_has_no_flags() {
    let flags = detect_additional_flags(&baseline());
    assert!(flags.is_empty(), "baseline should not produce flags: {flags:?}");
}

#[test]
fn dbs_not_started_is_high_priority() {
    let mut data = baseline();
    data.pre_employment_checks.dbs_check_status = "not-started".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-DBS-001" && f.priority == "high")
    );
}

#[test]
fn right_to_work_not_verified_is_high() {
    let mut data = baseline();
    data.pre_employment_checks.right_to_work_verified = "no".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-RTW-001" && f.priority == "high"));
}

#[test]
fn not_fit_to_work_is_high() {
    let mut data = baseline();
    data.occupational_health.fit_to_work = "no".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-OH-002" && f.priority == "high"));
}

#[test]
fn registration_not_verified_is_high() {
    let mut data = baseline();
    data.professional_registration.registration_required = "yes".to_string();
    data.professional_registration.registration_verified = "no".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-REG-001" && f.priority == "high"));
}

#[test]
fn flags_are_sorted_by_priority() {
    let mut data = baseline();
    data.pre_employment_checks.dbs_check_status = "not-started".to_string();
    data.uniform_id_badge.id_badge_issued = "no".to_string();
    data.sign_off_compliance.manager_signed_off = "no".to_string();
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
