use genetics_assessment_tera_crate::engine::flagged_issues::detect_additional_flags;
use genetics_assessment_tera_crate::engine::types::*;

fn empty() -> AssessmentData {
    AssessmentData::default()
}

#[test]
fn baseline_empty_has_only_low_priority_counselling_flag() {
    // Empty assessment fires FLAG-COUN-001 (no prior counselling recorded)
    // but no high/medium flags.
    let flags = detect_additional_flags(&empty());
    let high_count = flags.iter().filter(|f| f.priority == "high").count();
    assert_eq!(high_count, 0);
}

#[test]
fn manchester_15_emits_high_priority_brca_flag() {
    let mut data = empty();
    data.targeted_risk_scoring.manchester.relative_ovarian_under60 = Some(2); // = 16
    let flags = detect_additional_flags(&data);
    let flag = flags.iter().find(|f| f.id == "FLAG-BRCA-001").expect("BRCA flag");
    assert_eq!(flag.priority, "high");
}

#[test]
fn bethesda_one_emits_high_priority_lynch_flag() {
    let mut data = empty();
    data.targeted_risk_scoring.bethesda.crc_under50 = "yes".to_string();
    let flags = detect_additional_flags(&data);
    let flag = flags.iter().find(|f| f.id == "FLAG-LYNCH-001").expect("lynch flag");
    assert_eq!(flag.priority, "high");
}

#[test]
fn premm5_above_5_emits_lynch_high_flag() {
    let mut data = empty();
    data.targeted_risk_scoring.premm5.external_premm5_percent = Some(7.0);
    let flags = detect_additional_flags(&data);
    assert!(flags
        .iter()
        .any(|f| f.id == "FLAG-LYNCH-002" && f.priority == "high"));
}

#[test]
fn tyrer_cuzick_high_emits_tc001_high() {
    let mut data = empty();
    data.targeted_risk_scoring.tyrer_cuzick.external_lifetime_risk = Some(31.0);
    let flags = detect_additional_flags(&data);
    assert!(flags
        .iter()
        .any(|f| f.id == "FLAG-TC-001" && f.priority == "high"));
}

#[test]
fn tyrer_cuzick_moderate_emits_tc002_medium() {
    let mut data = empty();
    data.targeted_risk_scoring.tyrer_cuzick.external_lifetime_risk = Some(18.0);
    let flags = detect_additional_flags(&data);
    assert!(flags
        .iter()
        .any(|f| f.id == "FLAG-TC-002" && f.priority == "medium"));
}

#[test]
fn multiple_primary_cancers_emits_high_flag() {
    let mut data = empty();
    data.personal_medical_history.multiple_primary_cancers = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags
        .iter()
        .any(|f| f.id == "FLAG-MPRIM-001" && f.priority == "high"));
}

#[test]
fn familial_variant_known_emits_high_flag() {
    let mut data = empty();
    data.prior_genetic_testing.familial_variant_known = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags
        .iter()
        .any(|f| f.id == "FLAG-FAM-VAR-001" && f.priority == "high"));
}

#[test]
fn ashkenazi_yes_emits_anc001_medium() {
    let mut data = empty();
    data.consanguinity_ancestry.ashkenazi_jewish = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags
        .iter()
        .any(|f| f.id == "FLAG-ANC-001" && f.priority == "medium"));
}

#[test]
fn consanguinity_emits_cons001_medium() {
    let mut data = empty();
    data.consanguinity_ancestry.consanguinity = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags
        .iter()
        .any(|f| f.id == "FLAG-CONS-001" && f.priority == "medium"));
}

#[test]
fn flags_are_sorted_by_priority() {
    let mut data = empty();
    data.targeted_risk_scoring.bethesda.crc_under50 = "yes".to_string(); // high
    data.consanguinity_ancestry.ashkenazi_jewish = "yes".to_string(); // medium
    data.patient_understanding_concerns.reproductive_implications = "yes".to_string(); // low
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
