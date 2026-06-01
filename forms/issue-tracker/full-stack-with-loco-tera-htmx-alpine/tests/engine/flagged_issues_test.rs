use issue_tracker_tera_crate::engine::flagged_issues::compute_flags;
use issue_tracker_tera_crate::engine::types::*;

fn empty_data() -> AssessmentData {
    AssessmentData::default()
}

#[test]
fn empty_data_produces_no_flags() {
    let flags = compute_flags(&empty_data());
    assert!(flags.is_empty(), "expected zero flags: {flags:?}");
}

#[test]
fn harm_grade_4_emits_fatal_flag() {
    let mut data = empty_data();
    data.scores.score_by_harm_grade = Some(4);
    let flags = compute_flags(&data);
    let f = flags
        .iter()
        .find(|f| f.flag_id == "F-HARM-FATAL-001")
        .expect("harm-fatal flag");
    assert_eq!(f.priority, "high");
    assert_eq!(f.category, "harm-fatal");
}

#[test]
fn failure_condition_a_emits_catastrophic_flag() {
    let mut data = empty_data();
    data.scores.score_by_failure_condition = "A".to_string();
    let flags = compute_flags(&data);
    assert!(flags.iter().any(|f| f.flag_id == "F-FAILURE-A-001"));
}

#[test]
fn severity_5_emits_catastrophic_flag() {
    let mut data = empty_data();
    data.scores.score_by_severity_of_impact = Some(5);
    let flags = compute_flags(&data);
    assert!(flags.iter().any(|f| f.flag_id == "F-SEVERITY-5-001"));
}

#[test]
fn magnitude_10_emits_total_destruction_flag() {
    let mut data = empty_data();
    data.scores.score_by_magnitude_of_damage = Some(10);
    let flags = compute_flags(&data);
    assert!(flags.iter().any(|f| f.flag_id == "F-MAGNITUDE-10-001"));
}

#[test]
fn frequency_95_emits_universal_flag() {
    let mut data = empty_data();
    data.scores.score_by_frequency_percent = Some(95.0);
    let flags = compute_flags(&data);
    assert!(flags.iter().any(|f| f.flag_id == "F-FREQUENCY-95-001"));
}

#[test]
fn frequency_94_does_not_emit_universal_flag() {
    let mut data = empty_data();
    data.scores.score_by_frequency_percent = Some(94.0);
    let flags = compute_flags(&data);
    assert!(!flags.iter().any(|f| f.flag_id == "F-FREQUENCY-95-001"));
}

#[test]
fn moscow_1_emits_mandatory_flag_medium_priority() {
    let mut data = empty_data();
    data.scores.score_by_moscow_requirement = Some(1);
    let flags = compute_flags(&data);
    let f = flags
        .iter()
        .find(|f| f.flag_id == "F-MOSCOW-MUST-001")
        .expect("moscow-must flag");
    assert_eq!(f.priority, "medium");
}

#[test]
fn regulatory_category_with_harm_2_emits_regulatory_flag() {
    let mut data = empty_data();
    data.reporter.issue_category = "clinical-safety".to_string();
    data.scores.score_by_harm_grade = Some(2);
    let flags = compute_flags(&data);
    assert!(flags.iter().any(|f| f.flag_id == "F-REGULATORY-001"));
}

#[test]
fn non_regulatory_category_does_not_emit_regulatory_flag_even_with_high_harm() {
    let mut data = empty_data();
    data.reporter.issue_category = "performance".to_string();
    data.scores.score_by_harm_grade = Some(3);
    let flags = compute_flags(&data);
    assert!(!flags.iter().any(|f| f.flag_id == "F-REGULATORY-001"));
}
