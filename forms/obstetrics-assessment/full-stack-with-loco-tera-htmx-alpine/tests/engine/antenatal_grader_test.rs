use obstetrics_assessment_tera_crate::engine::antenatal_grader::{grade, run_rules};
use obstetrics_assessment_tera_crate::engine::ng201_rules::all_rules;
use obstetrics_assessment_tera_crate::engine::types::*;

#[test]
fn empty_assessment_is_low_risk() {
    let data = AssessmentData::default();
    let result = grade(&data);
    assert_eq!(result.risk_level, "low");
    assert_eq!(result.answered_count, 0);
    assert!(result.fired_rules.is_empty());
}

#[test]
fn maternal_age_40_is_high_risk() {
    let mut data = AssessmentData::default();
    data.maternal_demographics.age_at_booking = Some(42);
    let result = grade(&data);
    assert_eq!(result.risk_level, "high");
    assert!(result.fired_rules.iter().any(|r| r.id == "NG201-AGE-001"));
}

#[test]
fn maternal_age_37_is_moderate_risk() {
    let mut data = AssessmentData::default();
    data.maternal_demographics.age_at_booking = Some(37);
    let result = grade(&data);
    assert_eq!(result.risk_level, "moderate");
    assert!(result.fired_rules.iter().any(|r| r.id == "NG201-AGE-002"));
}

#[test]
fn previous_preeclampsia_is_high_risk() {
    let mut data = AssessmentData::default();
    data.obstetric_history.previous_pre_eclampsia = "yes".to_string();
    let result = grade(&data);
    assert_eq!(result.risk_level, "high");
    assert!(result.fired_rules.iter().any(|r| r.id == "NG201-OBS-002"));
}

#[test]
fn cardiac_disease_is_high_risk() {
    let mut data = AssessmentData::default();
    data.medical_history.cardiac_disease = "yes".to_string();
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "NG201-MED-001" && r.risk == "high"));
}

#[test]
fn gad2_threshold_fires_moderate() {
    let mut data = AssessmentData::default();
    data.mental_health_assessment.gad2_q1 = "more-than-half".to_string();
    data.mental_health_assessment.gad2_q2 = "several-days".to_string();
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "NG201-MH-005"));
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
fn answered_count_counts_nonempty_fields() {
    let mut data = AssessmentData::default();
    data.maternal_demographics.first_name = "Jane".to_string();
    data.maternal_demographics.age_at_booking = Some(30);
    data.medical_history.cardiac_disease = "no".to_string();
    let result = grade(&data);
    assert_eq!(result.answered_count, 3);
}
