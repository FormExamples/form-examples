use fertility_assessment_loco_crate::engine::fertility_grader::{
    classify_concern_score, grade, run_rules,
};
use fertility_assessment_loco_crate::engine::fertility_rules::all_rules;
use fertility_assessment_loco_crate::engine::types::*;

#[test]
fn empty_assessment_is_low_concern() {
    let data = AssessmentData::default();
    let result = grade(&data);
    assert_eq!(result.concern_level, "low");
    assert_eq!(result.concern_score, 0);
    assert!(result.fired_rules.is_empty());
}

#[test]
fn classify_concern_score_thresholds() {
    assert_eq!(classify_concern_score(0), "low");
    assert_eq!(classify_concern_score(2), "low");
    assert_eq!(classify_concern_score(3), "moderate");
    assert_eq!(classify_concern_score(6), "moderate");
    assert_eq!(classify_concern_score(7), "high");
    assert_eq!(classify_concern_score(20), "high");
}

#[test]
fn amenorrhoea_fires_cycle_002_rule() {
    let mut data = AssessmentData::default();
    data.menstrual_cycle.cycle_regularity = "absent".to_string();
    let (_score, fired) = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "FERT-CYC-002"));
}

#[test]
fn low_amh_fires_ovarian_reserve_rule() {
    let mut data = AssessmentData::default();
    data.hormone_profile.amh = Some(4.0);
    let (_score, fired) = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "FERT-OR-001"));
}

#[test]
fn severe_oligozoospermia_fires_both_rules() {
    let mut data = AssessmentData::default();
    data.partner_semen.semen_analysis_done = "yes".to_string();
    data.partner_semen.semen_concentration_million_per_ml = Some(3.0);
    let (_score, fired) = run_rules(&data);
    // Both FERT-SEM-002 (<16) and FERT-SEM-006 (<5) fire.
    assert!(fired.iter().any(|r| r.id == "FERT-SEM-002"));
    assert!(fired.iter().any(|r| r.id == "FERT-SEM-006"));
}

#[test]
fn abnormal_hsg_fires_tubal_rule() {
    let mut data = AssessmentData::default();
    data.investigations.hysterosalpingogram_done = "yes".to_string();
    data.investigations.hysterosalpingogram_result = "abnormal".to_string();
    let (_score, fired) = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "FERT-TUB-001"));
}

#[test]
fn pcos_fires_pelvic_rule() {
    let mut data = AssessmentData::default();
    data.medical_surgical_history.polycystic_ovary_syndrome = "yes".to_string();
    let (_score, fired) = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "FERT-PEL-003"));
}

#[test]
fn rule_ids_are_unique() {
    let rules = all_rules();
    let mut ids: Vec<&str> = rules.iter().map(|r| r.id).collect();
    ids.sort();
    let len_before = ids.len();
    ids.dedup();
    assert_eq!(ids.len(), len_before, "fertility rule IDs must be unique");
}

#[test]
fn high_concern_when_many_high_weight_rules_fire() {
    let mut data = AssessmentData::default();
    // Trigger AMH < 5.4 (weight 3) + amenorrhoea (weight 3) + abnormal HSG (weight 3) = 9 → high.
    data.hormone_profile.amh = Some(3.0);
    data.menstrual_cycle.cycle_regularity = "absent".to_string();
    data.investigations.hysterosalpingogram_done = "yes".to_string();
    data.investigations.hysterosalpingogram_result = "abnormal".to_string();
    let result = grade(&data);
    assert_eq!(result.concern_level, "high");
    assert!(result.concern_score >= 7);
}
