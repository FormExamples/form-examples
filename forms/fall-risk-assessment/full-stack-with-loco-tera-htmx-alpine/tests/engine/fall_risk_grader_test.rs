use fall_risk_assessment_tera_crate::engine::fall_risk_grader::{classify_mfs_score, grade};
use fall_risk_assessment_tera_crate::engine::types::*;

/// Build an assessment with all six MFS items answered to safe values
/// (each score = 0) and no ancillary risk factors.
fn safe_baseline() -> AssessmentData {
    AssessmentData {
        demographics: Demographics {
            first_name: "Jane".to_string(),
            last_name: "Doe".to_string(),
            date_of_birth: "1948-04-11".to_string(),
            sex: "female".to_string(),
            age: Some(78),
            care_setting: "inpatient".to_string(),
            primary_diagnosis: "Community-acquired pneumonia".to_string(),
        },
        mfs: MorseFallScale {
            history_of_falling: Some(0),
            secondary_diagnosis: Some(0),
            ambulatory_aid: Some(0),
            iv_or_heparin_lock: Some(0),
            gait_transferring: Some(0),
            mental_status: Some(0),
        },
        ..AssessmentData::default()
    }
}

#[test]
fn empty_assessment_is_low_with_zero_score() {
    let data = AssessmentData::default();
    let result = grade(&data);
    assert_eq!(result.mfs_score, 0);
    assert_eq!(result.severity, "low");
    assert_eq!(result.answered_count, 0);
    assert!(!result.critical_override);
}

#[test]
fn classify_cutoffs() {
    assert_eq!(classify_mfs_score(0), "low");
    assert_eq!(classify_mfs_score(24), "low");
    assert_eq!(classify_mfs_score(25), "moderate");
    assert_eq!(classify_mfs_score(44), "moderate");
    assert_eq!(classify_mfs_score(45), "high");
    assert_eq!(classify_mfs_score(100), "high");
}

#[test]
fn safe_baseline_grades_low() {
    let data = safe_baseline();
    let result = grade(&data);
    assert_eq!(result.mfs_score, 0);
    assert_eq!(result.severity, "low");
    assert_eq!(result.answered_count, 6);
    assert_eq!(result.fired_rules.len(), 6);
}

#[test]
fn moderate_score_grades_moderate() {
    let mut data = safe_baseline();
    data.mfs.history_of_falling = Some(25);
    let result = grade(&data);
    assert_eq!(result.mfs_score, 25);
    assert_eq!(result.severity, "moderate");
}

#[test]
fn high_score_grades_high() {
    let mut data = safe_baseline();
    data.mfs.history_of_falling = Some(25);
    data.mfs.ambulatory_aid = Some(30);
    let result = grade(&data);
    assert_eq!(result.mfs_score, 55);
    assert_eq!(result.severity, "high");
}

#[test]
fn mfs_75_triggers_critical_override() {
    let mut data = safe_baseline();
    data.mfs.history_of_falling = Some(25);
    data.mfs.secondary_diagnosis = Some(15);
    data.mfs.ambulatory_aid = Some(15);
    data.mfs.iv_or_heparin_lock = Some(20);
    let result = grade(&data);
    assert_eq!(result.mfs_score, 75);
    assert_eq!(result.severity, "critical");
    assert!(result.critical_override);
    assert!(result.critical_reasons.iter().any(|r| r.contains("MFS 75")));
}

#[test]
fn recurrent_falls_with_injury_triggers_critical() {
    let mut data = safe_baseline();
    data.fall_history.recurrent_falls_with_injury = "yes".to_string();
    let result = grade(&data);
    assert_eq!(result.severity, "critical");
    assert!(
        result
            .critical_reasons
            .iter()
            .any(|r| r == "Recurrent falls with injury")
    );
}

#[test]
fn anticoagulation_triggers_critical() {
    let mut data = safe_baseline();
    data.medication_review.anticoagulants = "yes".to_string();
    let result = grade(&data);
    assert_eq!(result.severity, "critical");
    assert!(
        result
            .critical_reasons
            .iter()
            .any(|r| r == "Anticoagulated patient")
    );
}

#[test]
fn fired_rule_ids_are_mfs_ids() {
    let data = safe_baseline();
    let result = grade(&data);
    let ids: Vec<&str> = result.fired_rules.iter().map(|r| r.id.as_str()).collect();
    assert!(ids.contains(&"MFS-001"));
    assert!(ids.contains(&"MFS-002"));
    assert!(ids.contains(&"MFS-003"));
    assert!(ids.contains(&"MFS-004"));
    assert!(ids.contains(&"MFS-005"));
    assert!(ids.contains(&"MFS-006"));
}
