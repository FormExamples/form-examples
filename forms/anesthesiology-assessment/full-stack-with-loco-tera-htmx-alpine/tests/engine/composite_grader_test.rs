use anesthesiology_assessment_tera_crate::engine::asa_rules::asa_risk_from_class;
use anesthesiology_assessment_tera_crate::engine::composite_grader::grade;
use anesthesiology_assessment_tera_crate::engine::rcri_rules::{
    rcri_mace_percent, rcri_risk_from_score,
};
use anesthesiology_assessment_tera_crate::engine::stopbang_rules::stopbang_risk_from_score;
use anesthesiology_assessment_tera_crate::engine::types::*;

#[test]
fn empty_assessment_is_low_risk() {
    let data = AssessmentData::default();
    let r = grade(&data);
    assert_eq!(r.overall_risk, "low");
    assert_eq!(r.asa.risk_level, "low");
    assert_eq!(r.airway.risk_level, "low");
    assert_eq!(r.rcri.score, 0);
    assert_eq!(r.stopbang.score, 0);
}

#[test]
fn asa_iv_promotes_overall_to_high() {
    let mut data = AssessmentData::default();
    data.investigations_and_plan.asa_class = "iv".to_string();
    let r = grade(&data);
    assert_eq!(r.asa.risk_level, "high");
    assert_eq!(r.overall_risk, "high");
}

#[test]
fn asa_v_promotes_overall_to_critical() {
    let mut data = AssessmentData::default();
    data.investigations_and_plan.asa_class = "v".to_string();
    let r = grade(&data);
    assert_eq!(r.asa.risk_level, "critical");
    assert_eq!(r.overall_risk, "critical");
}

#[test]
fn asa_risk_mapping() {
    assert_eq!(asa_risk_from_class("i"), "low");
    assert_eq!(asa_risk_from_class("ii"), "low");
    assert_eq!(asa_risk_from_class("iii"), "medium");
    assert_eq!(asa_risk_from_class("iv"), "high");
    assert_eq!(asa_risk_from_class("v"), "critical");
    assert_eq!(asa_risk_from_class("vi"), "critical");
    assert_eq!(asa_risk_from_class(""), "low");
}

#[test]
fn mallampati_iv_is_high_airway_risk() {
    let mut data = AssessmentData::default();
    data.physical_exam.mallampati_class = "iv".to_string();
    let r = grade(&data);
    assert_eq!(r.airway.risk_level, "high");
    assert!(r.airway.fired_rules.iter().any(|f| f.id == "MALL-002"));
}

#[test]
fn difficult_intubation_history_is_high_airway_risk() {
    let mut data = AssessmentData::default();
    data.previous_anaesthesia.difficult_intubation = true;
    let r = grade(&data);
    assert_eq!(r.airway.risk_level, "high");
    assert!(r.airway.fired_rules.iter().any(|f| f.id == "MALL-008"));
}

#[test]
fn two_medium_airway_factors_promote_to_high() {
    let mut data = AssessmentData::default();
    data.physical_exam.mallampati_class = "iii".to_string();
    data.physical_exam.mouth_opening = Some(2.5);
    let r = grade(&data);
    assert_eq!(r.airway.risk_level, "high");
    assert_eq!(r.airway.medium_factors, 2);
}

#[test]
fn rcri_three_criteria_critical() {
    let mut data = AssessmentData::default();
    data.investigations_and_plan.rcri_ischaemic_heart_disease = "yes".to_string();
    data.investigations_and_plan.rcri_congestive_heart_failure = "yes".to_string();
    data.investigations_and_plan.rcri_cerebrovascular_disease = "yes".to_string();
    let r = grade(&data);
    assert_eq!(r.rcri.score, 3);
    assert_eq!(r.rcri.risk_level, "critical");
    assert!((r.rcri.mace_percent - 5.4).abs() < 0.0001);
}

#[test]
fn rcri_high_risk_surgery_counts() {
    let mut data = AssessmentData::default();
    data.planned_surgery.surgery_grade = "major".to_string();
    let r = grade(&data);
    assert_eq!(r.rcri.score, 1);
    assert_eq!(r.rcri.risk_level, "medium");
}

#[test]
fn rcri_risk_mapping() {
    assert_eq!(rcri_risk_from_score(0), "low");
    assert_eq!(rcri_risk_from_score(1), "medium");
    assert_eq!(rcri_risk_from_score(2), "high");
    assert_eq!(rcri_risk_from_score(3), "critical");
    assert_eq!(rcri_risk_from_score(6), "critical");
}

#[test]
fn rcri_mace_percent_mapping() {
    assert!((rcri_mace_percent(0) - 0.4).abs() < 0.0001);
    assert!((rcri_mace_percent(1) - 1.0).abs() < 0.0001);
    assert!((rcri_mace_percent(2) - 2.4).abs() < 0.0001);
    assert!((rcri_mace_percent(3) - 5.4).abs() < 0.0001);
}

#[test]
fn stopbang_five_items_is_high() {
    let mut data = AssessmentData::default();
    data.social_history.snores_loudly = "yes".to_string();
    data.social_history.tired_during_day = "yes".to_string();
    data.social_history.observed_apnea = "yes".to_string();
    data.medical_history.hypertension = "yes".to_string();
    data.vital_signs.bmi = Some(36.0);
    let r = grade(&data);
    assert_eq!(r.stopbang.score, 5);
    assert_eq!(r.stopbang.risk_level, "high");
}

#[test]
fn stopbang_mapping() {
    assert_eq!(stopbang_risk_from_score(0), "low");
    assert_eq!(stopbang_risk_from_score(2), "low");
    assert_eq!(stopbang_risk_from_score(3), "medium");
    assert_eq!(stopbang_risk_from_score(4), "medium");
    assert_eq!(stopbang_risk_from_score(5), "high");
    assert_eq!(stopbang_risk_from_score(8), "high");
}

#[test]
fn worst_risk_wins_for_overall() {
    let mut data = AssessmentData::default();
    // ASA III = medium
    data.investigations_and_plan.asa_class = "iii".to_string();
    // RCRI 3 = critical
    data.investigations_and_plan.rcri_ischaemic_heart_disease = "yes".to_string();
    data.investigations_and_plan.rcri_congestive_heart_failure = "yes".to_string();
    data.investigations_and_plan.rcri_cerebrovascular_disease = "yes".to_string();
    let r = grade(&data);
    assert_eq!(r.overall_risk, "critical");
}
