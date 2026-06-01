use who_acute_referral_form_tera_crate::engine::flagged_issues::detect_flagged_issues;
use who_acute_referral_form_tera_crate::engine::types::*;

fn empty() -> AssessmentData {
    AssessmentData::default()
}

#[test]
fn empty_form_has_no_flags() {
    let flags = detect_flagged_issues(&empty());
    assert!(flags.is_empty(), "empty form should not produce flags: {flags:?}");
}

#[test]
fn critical_vital_signs_flag_urgent_issues() {
    let mut data = empty();
    // SpO2 < 90 → urgent flag.
    data.assessment.vital_signs.oxygen_saturation = Some(85.0);
    // GCS ≤ 8 → urgent flag.
    data.assessment.vital_signs.glasgow_coma_scale = Some(7.0);
    // SBP < 90 → high (hypotension) flag.
    data.assessment.vital_signs.systolic_blood_pressure = Some(80.0);

    let flags = detect_flagged_issues(&data);
    assert!(flags
        .iter()
        .any(|f| f.id == "FLAG-VIT-SPO2" && f.priority == FlagPriority::Urgent));
    assert!(flags
        .iter()
        .any(|f| f.id == "FLAG-VIT-GCS" && f.priority == FlagPriority::Urgent));
    assert!(flags
        .iter()
        .any(|f| f.id == "FLAG-VIT-SBP-LOW" && f.priority == FlagPriority::High));
    // Sort order: urgent flags must come before high flags.
    let first_high = flags
        .iter()
        .position(|f| f.priority == FlagPriority::High)
        .unwrap();
    let last_urgent = flags
        .iter()
        .rposition(|f| f.priority == FlagPriority::Urgent)
        .unwrap();
    assert!(last_urgent < first_high);
}

#[test]
fn highly_infectious_disease_is_urgent() {
    let mut data = empty();
    data.recommendations.precautions.highly_infectious_disease = true;
    let flags = detect_flagged_issues(&data);
    assert!(flags
        .iter()
        .any(|f| f.id == "FLAG-INF-001" && f.priority == FlagPriority::Urgent));
}

#[test]
fn aspiration_risk_is_high_priority() {
    let mut data = empty();
    data.recommendations.precautions.aspiration_risk = true;
    let flags = detect_flagged_issues(&data);
    assert!(flags
        .iter()
        .any(|f| f.id == "FLAG-PRC-ASP" && f.priority == FlagPriority::High));
}

#[test]
fn pregnancy_yields_high_priority_flag() {
    let mut data = empty();
    data.situation.pregnant = "yes".into();
    let flags = detect_flagged_issues(&data);
    assert!(flags
        .iter()
        .any(|f| f.id == "FLAG-PREG" && f.priority == FlagPriority::High));
}

#[test]
fn air_or_sea_mode_is_low_priority_flag() {
    let mut data = empty();
    data.facility_and_transport.mode_of_transfer = "air".into();
    let flags = detect_flagged_issues(&data);
    assert!(flags
        .iter()
        .any(|f| f.id == "FLAG-MODE" && f.priority == FlagPriority::Low));
}

#[test]
fn ground_mode_does_not_flag() {
    let mut data = empty();
    data.facility_and_transport.mode_of_transfer = "ground".into();
    let flags = detect_flagged_issues(&data);
    assert!(!flags.iter().any(|f| f.id == "FLAG-MODE"));
}
