use issue_tracker_tera_crate::engine::composite_grader::grade;
use issue_tracker_tera_crate::engine::types::*;

fn empty_data() -> AssessmentData {
    AssessmentData::default()
}

#[test]
fn all_null_scores_collapse_to_low_composite() {
    let result = grade(&empty_data());
    assert_eq!(result.composite_priority, "low");
    // Only the composite "R-COMPOSITE-LOW" rule should fire when every
    // input is null.
    assert!(
        result
            .fired_rules
            .iter()
            .any(|r| r.rule_id == "R-COMPOSITE-LOW")
    );
}

#[test]
fn priority_rank_1_yields_critical_composite() {
    let mut data = empty_data();
    data.scores.score_by_priority_rank = Some(1);
    let result = grade(&data);
    assert_eq!(result.composite_priority, "critical");
    assert!(
        result
            .fired_rules
            .iter()
            .any(|r| r.rule_id == "R-PRIORITY-1" && r.band == "critical")
    );
    assert!(
        result
            .fired_rules
            .iter()
            .any(|r| r.rule_id == "R-COMPOSITE-CRITICAL")
    );
}

#[test]
fn severity_5_drives_critical_composite() {
    let mut data = empty_data();
    data.scores.score_by_severity_of_impact = Some(5);
    let result = grade(&data);
    assert_eq!(result.composite_priority, "critical");
    assert!(
        result
            .fired_rules
            .iter()
            .any(|r| r.rule_id == "R-SEVERITY-5")
    );
}

#[test]
fn magnitude_10_drives_critical_composite() {
    let mut data = empty_data();
    data.scores.score_by_magnitude_of_damage = Some(10);
    let result = grade(&data);
    assert_eq!(result.composite_priority, "critical");
    assert!(
        result
            .fired_rules
            .iter()
            .any(|r| r.rule_id == "R-MAGNITUDE-10")
    );
}

#[test]
fn harm_grade_4_drives_critical_composite() {
    let mut data = empty_data();
    data.scores.score_by_harm_grade = Some(4);
    let result = grade(&data);
    assert_eq!(result.composite_priority, "critical");
    assert!(
        result
            .fired_rules
            .iter()
            .any(|r| r.rule_id == "R-HARM-4")
    );
}

#[test]
fn failure_condition_a_drives_critical_composite() {
    let mut data = empty_data();
    data.scores.score_by_failure_condition = "A".to_string();
    let result = grade(&data);
    assert_eq!(result.composite_priority, "critical");
    assert!(
        result
            .fired_rules
            .iter()
            .any(|r| r.rule_id == "R-FAILURE-A")
    );
}

#[test]
fn moscow_1_drives_high_composite() {
    let mut data = empty_data();
    data.scores.score_by_moscow_requirement = Some(1);
    let result = grade(&data);
    assert_eq!(result.composite_priority, "high");
    assert!(
        result
            .fired_rules
            .iter()
            .any(|r| r.rule_id == "R-MOSCOW-1" && r.band == "high")
    );
}

#[test]
fn frequency_100_drives_critical_composite() {
    let mut data = empty_data();
    data.scores.score_by_frequency_percent = Some(100.0);
    let result = grade(&data);
    assert_eq!(result.composite_priority, "critical");
    // R-FREQUENCY-{round(f)} == "R-FREQUENCY-100"
    assert!(
        result
            .fired_rules
            .iter()
            .any(|r| r.rule_id == "R-FREQUENCY-100")
    );
}

#[test]
fn worst_band_wins_under_max_grade() {
    let mut data = empty_data();
    // priority=4 (low), severity=4 (high), magnitude=2 (low),
    // harm=2 (high), failure=D (low), moscow=3 (low), freq=5 (moderate).
    // The composite should be the worst — "high".
    data.scores.score_by_priority_rank = Some(4);
    data.scores.score_by_severity_of_impact = Some(4);
    data.scores.score_by_magnitude_of_damage = Some(2);
    data.scores.score_by_harm_grade = Some(2);
    data.scores.score_by_failure_condition = "D".to_string();
    data.scores.score_by_moscow_requirement = Some(3);
    data.scores.score_by_frequency_percent = Some(5.0);
    let result = grade(&data);
    assert_eq!(result.composite_priority, "high");
}

#[test]
fn integer_frequency_emits_no_decimal_in_grade_string() {
    let mut data = empty_data();
    data.scores.score_by_frequency_percent = Some(42.0);
    let result = grade(&data);
    let rule = result
        .fired_rules
        .iter()
        .find(|r| r.instrument == "frequency")
        .expect("frequency rule");
    assert_eq!(rule.grade, "42%");
}

#[test]
fn fractional_frequency_keeps_two_decimal_places() {
    let mut data = empty_data();
    data.scores.score_by_frequency_percent = Some(12.5);
    let result = grade(&data);
    let rule = result
        .fired_rules
        .iter()
        .find(|r| r.instrument == "frequency")
        .expect("frequency rule");
    assert_eq!(rule.grade, "12.50%");
}
