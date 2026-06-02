use endometriosis_assessment_loco_crate::engine::endo_grader::{grade, run_rules};
use endometriosis_assessment_loco_crate::engine::endo_rules::all_rules;
use endometriosis_assessment_loco_crate::engine::types::*;

#[test]
fn empty_assessment_is_mild() {
    let data = AssessmentData::default();
    let result = grade(&data);
    assert_eq!(result.overall_severity, "mild");
    assert_eq!(result.asrm_stage, None);
    assert_eq!(result.asrm_points, 0);
    assert!(result.fired_rules.is_empty());
}

#[test]
fn severe_pelvic_pain_fires_pain_001_and_is_critical() {
    let mut data = AssessmentData::default();
    data.pain_assessment.has_pelvic_pain = "yes".to_string();
    data.pain_assessment.pelvic_pain_severity = Some(9);
    let result = grade(&data);
    assert!(result.fired_rules.iter().any(|r| r.id == "PAIN-001"));
    assert_eq!(result.overall_severity, "critical");
}

#[test]
fn bowel_obstruction_fires_gi_001_and_is_critical() {
    let mut data = AssessmentData::default();
    data.gastrointestinal_symptoms.bowel_obstruction_symptoms = "yes".to_string();
    let result = grade(&data);
    assert!(result.fired_rules.iter().any(|r| r.id == "GI-001"));
    assert_eq!(result.overall_severity, "critical");
    // Bowel-obstruction adds the +10 organ-involvement bonus.
    assert!(result.asrm_points >= 16 + 10);
}

#[test]
fn surgical_stage_iv_yields_stage_4() {
    let mut data = AssessmentData::default();
    data.surgical_history.asrm_stage_at_surgery = "IV".to_string();
    let result = grade(&data);
    assert_eq!(result.asrm_stage, Some(4));
    assert_eq!(result.overall_severity, "critical");
}

#[test]
fn surgical_stage_iii_yields_stage_3() {
    let mut data = AssessmentData::default();
    data.surgical_history.asrm_stage_at_surgery = "III".to_string();
    let result = grade(&data);
    assert_eq!(result.asrm_stage, Some(3));
}

#[test]
fn infertility_fires_fert_001() {
    let mut data = AssessmentData::default();
    data.fertility_assessment.trying_to_conceive = "yes".to_string();
    data.fertility_assessment.duration_trying_months = Some(18);
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "FERT-001"));
}

#[test]
fn low_amh_fires_fert_003() {
    let mut data = AssessmentData::default();
    data.fertility_assessment.amh_level = Some(3.0);
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "FERT-003"));
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
fn cyclical_dyschezia_fires_pain_006() {
    let mut data = AssessmentData::default();
    data.pain_assessment.dyschezia = "yes".to_string();
    data.pain_assessment.dyschezia_cyclical = "yes".to_string();
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "PAIN-006"));
    // PAIN-005 also fires because dyschezia=yes is grade 2.
    assert!(fired.iter().any(|r| r.id == "PAIN-005"));
}

#[test]
fn unable_to_work_fires_qol_002_and_is_critical() {
    let mut data = AssessmentData::default();
    data.quality_of_life.work_impact = "unable-to-work".to_string();
    let result = grade(&data);
    assert!(result.fired_rules.iter().any(|r| r.id == "QOL-002"));
    assert_eq!(result.overall_severity, "critical");
}
