use organ_donation_assessment_loco_crate::engine::flagged_issues::detect_additional_flags;
use organ_donation_assessment_loco_crate::engine::types::*;

fn baseline_case() -> AssessmentData {
    AssessmentData {
        demographics: Demographics {
            date_of_birth: "1990-01-01".to_string(),
            ..Demographics::default()
        },
        donor_type_registration: DonorTypeRegistration {
            donor_type: "deceased".to_string(),
            ..DonorTypeRegistration::default()
        },
        ..AssessmentData::default()
    }
}

#[test]
fn baseline_has_no_flags() {
    let flags = detect_additional_flags(&baseline_case());
    assert!(flags.is_empty(), "baseline should not produce flags: {flags:?}");
}

#[test]
fn hiv_positive_emits_high_priority_flag() {
    let mut data = baseline_case();
    data.infectious_disease_screening.hiv_status = "positive".to_string();
    let flags = detect_additional_flags(&data);
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-ID-hivStatus")
        .expect("FLAG-ID-hivStatus must fire");
    assert_eq!(flag.priority, "high");
}

#[test]
fn hbs_ag_positive_emits_flag() {
    let mut data = baseline_case();
    data.infectious_disease_screening.hbs_ag = "positive".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-ID-hbsAg" && f.priority == "high"));
}

#[test]
fn abo_incompatibility_emits_high_priority_flag() {
    let mut data = baseline_case();
    data.immunological_assessment.abo_compatibility = "incompatible".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-IM-001" && f.priority == "high"));
}

#[test]
fn malignancy_non_cns_emits_high_priority_flag() {
    let mut data = baseline_case();
    data.medical_history.has_malignancy = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-MH-001" && f.priority == "high"));
}

#[test]
fn living_coercion_concerns_emit_high_priority_flag() {
    let mut data = baseline_case();
    data.donor_type_registration.donor_type = "living".to_string();
    data.psychological_assessment.coercion_concerns = "yes".to_string();
    data.psychological_assessment.coercion_details = "Family pressure".to_string();
    let flags = detect_additional_flags(&data);
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-PS-001")
        .expect("FLAG-PS-001 must fire");
    assert_eq!(flag.priority, "high");
    assert!(flag.message.contains("Family pressure"));
}

#[test]
fn deceased_donor_skips_psychological_flags() {
    let mut data = baseline_case();
    data.psychological_assessment.coercion_concerns = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(!flags.iter().any(|f| f.id == "FLAG-PS-001"));
}

#[test]
fn bmi_35_emits_medium_flag() {
    let mut data = baseline_case();
    data.demographics.bmi = Some(36.0);
    let flags = detect_additional_flags(&data);
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-DM-004")
        .expect("FLAG-DM-004 must fire");
    assert_eq!(flag.priority, "medium");
}

#[test]
fn assessor_unsuitable_decision_emits_flag() {
    let mut data = baseline_case();
    data.eligibility_allocation.eligibility_decision = "unsuitable".to_string();
    data.eligibility_allocation.deferral_reason = "Active infection".to_string();
    data.eligibility_allocation.deferral_duration = "temporary".to_string();
    let flags = detect_additional_flags(&data);
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-EA-001")
        .expect("FLAG-EA-001 must fire");
    assert_eq!(flag.priority, "high");
}

#[test]
fn flags_are_sorted_by_priority() {
    let mut data = baseline_case();
    data.medical_history.has_malignancy = "yes".to_string();          // high
    data.medical_history.has_diabetes = "yes".to_string();             // medium
    data.medical_history.has_hypertension = "yes".to_string();         // low
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
