use substance_abuse_assessment_tera_crate::engine::substance_grader::{calculate_substance_grade, run_rules};
use substance_abuse_assessment_tera_crate::engine::substance_rules::all_rules;
use substance_abuse_assessment_tera_crate::engine::types::*;

fn empty_case() -> AssessmentData {
    AssessmentData::default()
}

#[test]
fn empty_case_is_low_risk() {
    let data = empty_case();
    let result = calculate_substance_grade(&data);
    assert_eq!(result.overall_risk, "low");
    assert_eq!(result.audit_score, 0);
    assert_eq!(result.dast_score, 0);
    assert_eq!(result.audit_risk_category, "low-risk");
    assert_eq!(result.dast_risk_category, "no-problems");
}

#[test]
fn audit_dependence_threshold_is_critical() {
    let mut data = empty_case();
    // AUDIT total = 20 (dependence likely).
    data.alcohol_use_audit.audit_q1_frequency = 4;
    data.alcohol_use_audit.audit_q2_typical_quantity = 4;
    data.alcohol_use_audit.audit_q3_binge_frequency = 4;
    data.alcohol_use_audit.audit_q4_impaired_control = 4;
    data.alcohol_use_audit.audit_q5_failed_expectations = 4;
    let result = calculate_substance_grade(&data);
    assert_eq!(result.audit_score, 20);
    assert_eq!(result.audit_risk_category, "dependence-likely");
    assert_eq!(result.overall_risk, "critical");
    assert!(result.fired_rules.iter().any(|r| r.id == "AUDIT-004"));
    assert!(
        result
            .additional_flags
            .iter()
            .any(|f| f.id == "FLAG-AUDIT-001" && f.priority == "high")
    );
}

#[test]
fn dast_q3_is_inversely_scored() {
    let mut data = empty_case();
    // "no" to Q3 (able to stop) adds 1 point.
    data.drug_use_dast.dast_q3_able_to_stop = "no".to_string();
    let result = calculate_substance_grade(&data);
    assert_eq!(result.dast_score, 1);
    assert_eq!(result.dast_risk_category, "low");
}

#[test]
fn current_suicidal_ideation_fires_mh001_and_flag() {
    let mut data = empty_case();
    data.mental_health_comorbidities.suicidal_ideation_current = "yes".to_string();
    let result = calculate_substance_grade(&data);
    assert!(result.fired_rules.iter().any(|r| r.id == "MH-001"));
    assert!(
        result
            .additional_flags
            .iter()
            .any(|f| f.id == "FLAG-SI-001" && f.priority == "high")
    );
    assert_eq!(result.overall_risk, "critical");
}

#[test]
fn iv_drug_use_is_grade_3() {
    let mut data = empty_case();
    data.substance_use_history.iv_drug_use = "yes".to_string();
    let fired = run_rules(&data);
    let suh001 = fired.iter().find(|r| r.id == "SUH-001").expect("SUH-001 must fire");
    assert_eq!(suh001.grade, 3);
}

#[test]
fn rule_ids_are_unique() {
    let rules = all_rules();
    let mut ids: Vec<&str> = rules.iter().map(|r| r.id).collect();
    ids.sort();
    let before = ids.len();
    ids.dedup();
    assert_eq!(ids.len(), before, "rule IDs must be unique");
}

#[test]
fn liver_cirrhosis_requires_both_fields() {
    let mut data = empty_case();
    data.physical_health_impact.liver_disease = "yes".to_string();
    // Without cirrhosis type, PH-002 should not fire.
    assert!(!run_rules(&data).iter().any(|r| r.id == "PH-002"));
    data.physical_health_impact.liver_disease_type = "cirrhosis".to_string();
    assert!(run_rules(&data).iter().any(|r| r.id == "PH-002"));
}
