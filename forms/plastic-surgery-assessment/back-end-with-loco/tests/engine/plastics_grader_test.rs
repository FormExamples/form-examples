use plastic_surgery_assessment_loco_crate::engine::plastics_grader::{grade, run_rules};
use plastic_surgery_assessment_loco_crate::engine::plastics_rules::all_rules;
use plastic_surgery_assessment_loco_crate::engine::types::*;

#[test]
fn empty_case_is_low_risk() {
    let data = AssessmentData::default();
    let result = grade(&data);
    assert_eq!(result.overall_risk, "low");
    assert_eq!(result.asa_class, None);
    assert_eq!(result.wound_class, None);
    assert_eq!(result.complexity_score, None);
}

#[test]
fn asa_iv_yields_critical_risk() {
    let mut data = AssessmentData::default();
    data.anaesthetic_risk.asa_class = "4".to_string();
    let result = grade(&data);
    assert_eq!(result.asa_class, Some(4));
    assert_eq!(result.overall_risk, "critical");
}

#[test]
fn dirty_wound_yields_critical_risk() {
    let mut data = AssessmentData::default();
    data.wound_tissue_assessment.wound_classification = "dirty".to_string();
    let result = grade(&data);
    assert_eq!(result.wound_class, Some(4));
    assert_eq!(result.overall_risk, "critical");
}

#[test]
fn complexity_four_yields_critical_risk() {
    let mut data = AssessmentData::default();
    data.procedure_planning_consent.procedure_complexity = "4".to_string();
    let result = grade(&data);
    assert_eq!(result.complexity_score, Some(4));
    assert_eq!(result.overall_risk, "critical");
}

#[test]
fn asa_iii_fires_asa003() {
    let mut data = AssessmentData::default();
    data.anaesthetic_risk.asa_class = "3".to_string();
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "ASA-003"));
}

#[test]
fn uncontrolled_diabetes_fires_cm002() {
    let mut data = AssessmentData::default();
    data.medical_surgical_history.diabetes = "type-2".to_string();
    data.medical_surgical_history.diabetes_controlled = "no".to_string();
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "CM-002"));
}

#[test]
fn emergency_referral_fires_rf001_and_high_grade() {
    let mut data = AssessmentData::default();
    data.reason_for_referral.urgency = "emergency".to_string();
    let result = grade(&data);
    assert!(result.fired_rules.iter().any(|r| r.id == "RF-001" && r.grade == 4));
    // Grade 4 from a rule alone elevates overall risk to critical.
    assert_eq!(result.overall_risk, "critical");
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
fn bmi_threshold_fires_ag002() {
    let mut data = AssessmentData::default();
    data.demographics.bmi = Some(36.5);
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "AG-002"));
}

#[test]
fn free_flap_fires_cx005() {
    let mut data = AssessmentData::default();
    data.procedure_planning_consent.flap_type = "free".to_string();
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "CX-005"));
}
