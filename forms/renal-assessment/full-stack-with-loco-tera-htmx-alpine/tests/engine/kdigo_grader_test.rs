use renal_assessment_tera_crate::engine::kdigo_grader::{grade, run_rules};
use renal_assessment_tera_crate::engine::kdigo_rules::all_rules;
use renal_assessment_tera_crate::engine::types::*;
use renal_assessment_tera_crate::engine::utils::{
    classify_albuminuria_category, classify_gfr_category, kdigo_composite_risk,
};

/// Build an assessment with sufficient data to land in KDIGO G3a A2 (moderate
/// eGFR, moderate albuminuria → composite "high" risk).
fn moderate_ckd_case() -> AssessmentData {
    AssessmentData {
        demographics: Demographics {
            first_name: "Test".to_string(),
            last_name: "Patient".to_string(),
            date_of_birth: "1960-01-01".to_string(),
            sex: "male".to_string(),
            age: Some(65),
            ..Demographics::default()
        },
        blood_tests: BloodTests {
            egfr: Some(50.0),
            ..BloodTests::default()
        },
        urine_tests: UrineTests {
            acr: Some(15.0),
            ..UrineTests::default()
        },
        ..AssessmentData::default()
    }
}

#[test]
fn empty_case_grades_unknown_risk() {
    let data = AssessmentData::default();
    let result = grade(&data);
    assert_eq!(result.risk_level, "unknown");
    assert_eq!(result.gfr_category, "");
    assert_eq!(result.albuminuria_category, "");
}

#[test]
fn moderate_ckd_grades_high_risk() {
    let data = moderate_ckd_case();
    let result = grade(&data);
    assert_eq!(result.gfr_category, "G3a");
    assert_eq!(result.albuminuria_category, "A2");
    assert_eq!(result.risk_level, "high");
    assert_eq!(result.egfr, Some(50.0));
    assert_eq!(result.acr, Some(15.0));
}

#[test]
fn kidney_failure_grades_very_high_risk() {
    let mut data = moderate_ckd_case();
    data.blood_tests.egfr = Some(10.0);
    data.urine_tests.acr = Some(100.0);
    let result = grade(&data);
    assert_eq!(result.gfr_category, "G5");
    assert_eq!(result.albuminuria_category, "A3");
    assert_eq!(result.risk_level, "very-high");
}

#[test]
fn fired_rules_emit_all_three_when_data_complete() {
    let data = moderate_ckd_case();
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "KDIGO-001"));
    assert!(fired.iter().any(|r| r.id == "KDIGO-002"));
    assert!(fired.iter().any(|r| r.id == "KDIGO-003"));
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
fn classify_gfr_boundaries() {
    assert_eq!(classify_gfr_category(Some(90.0)), "G1");
    assert_eq!(classify_gfr_category(Some(89.9)), "G2");
    assert_eq!(classify_gfr_category(Some(60.0)), "G2");
    assert_eq!(classify_gfr_category(Some(59.9)), "G3a");
    assert_eq!(classify_gfr_category(Some(45.0)), "G3a");
    assert_eq!(classify_gfr_category(Some(44.9)), "G3b");
    assert_eq!(classify_gfr_category(Some(30.0)), "G3b");
    assert_eq!(classify_gfr_category(Some(15.0)), "G4");
    assert_eq!(classify_gfr_category(Some(14.9)), "G5");
    assert_eq!(classify_gfr_category(None), "");
}

#[test]
fn classify_albuminuria_boundaries() {
    assert_eq!(classify_albuminuria_category(Some(2.9)), "A1");
    assert_eq!(classify_albuminuria_category(Some(3.0)), "A2");
    assert_eq!(classify_albuminuria_category(Some(30.0)), "A2");
    assert_eq!(classify_albuminuria_category(Some(30.1)), "A3");
    assert_eq!(classify_albuminuria_category(None), "");
}

#[test]
fn composite_heatmap_corners() {
    assert_eq!(kdigo_composite_risk("G1", "A1"), "low");
    assert_eq!(kdigo_composite_risk("G2", "A2"), "moderate");
    assert_eq!(kdigo_composite_risk("G1", "A3"), "high");
    assert_eq!(kdigo_composite_risk("G3b", "A1"), "high");
    assert_eq!(kdigo_composite_risk("G4", "A1"), "very-high");
    assert_eq!(kdigo_composite_risk("G5", "A3"), "very-high");
    assert_eq!(kdigo_composite_risk("", "A1"), "unknown");
    assert_eq!(kdigo_composite_risk("G1", ""), "unknown");
}

#[test]
fn clinical_impression_override_takes_precedence() {
    let mut data = moderate_ckd_case();
    data.clinical_impression.gfr_category = "G4".to_string();
    data.clinical_impression.albuminuria_category = "A3".to_string();
    let result = grade(&data);
    assert_eq!(result.gfr_category, "G4");
    assert_eq!(result.albuminuria_category, "A3");
    assert_eq!(result.risk_level, "very-high");
}
