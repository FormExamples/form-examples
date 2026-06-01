use medical_error_report_tera_crate::engine::error_grader::{calculate_error_grade, run_rules};
use medical_error_report_tera_crate::engine::error_rules::all_rules;
use medical_error_report_tera_crate::engine::types::*;

#[test]
fn empty_assessment_is_low_risk() {
    let data = AssessmentData::default();
    let result = calculate_error_grade(&data);
    assert_eq!(result.overall_risk, "low");
    assert!(result.fired_rules.is_empty());
    assert!(result.additional_flags.is_empty());
}

#[test]
fn critical_severity_yields_critical_risk() {
    let mut data = AssessmentData::default();
    data.error_classification.who_severity = "critical".to_string();
    let result = calculate_error_grade(&data);
    assert_eq!(result.overall_risk, "critical");
    assert!(result.fired_rules.iter().any(|r| r.id == "SEV-005"));
}

#[test]
fn merp_g_yields_high_risk() {
    let mut data = AssessmentData::default();
    data.error_classification.ncc_merp_category = "G".to_string();
    let result = calculate_error_grade(&data);
    assert_eq!(result.overall_risk, "high");
    assert!(result.fired_rules.iter().any(|r| r.id == "MERP-003"));
}

#[test]
fn merp_i_yields_critical_risk_and_flag() {
    let mut data = AssessmentData::default();
    data.error_classification.ncc_merp_category = "I".to_string();
    let result = calculate_error_grade(&data);
    assert_eq!(result.overall_risk, "critical");
    assert!(result.fired_rules.iter().any(|r| r.id == "MERP-005"));
    assert!(
        result
            .additional_flags
            .iter()
            .any(|f| f.id == "FLAG-MERP-HIGH-001")
    );
}

#[test]
fn patient_died_fires_outcome_rule() {
    let mut data = AssessmentData::default();
    data.patient_outcome.patient_died = "yes".to_string();
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "OUT-001" && r.grade == 5));
}

#[test]
fn three_contributing_factors_fires_cf001() {
    let mut data = AssessmentData::default();
    data.contributing_factors.staff_fatigue = "yes".to_string();
    data.contributing_factors.communication_failure = "yes".to_string();
    data.contributing_factors.workload_pressure = "yes".to_string();
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "CF-001"));
}

#[test]
fn duty_of_candour_applies_not_completed_fires_doc_rule() {
    let mut data = AssessmentData::default();
    data.patient_involvement.duty_of_candour_applies = "yes".to_string();
    data.patient_involvement.duty_of_candour_completed = "no".to_string();
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "DOC-001"));
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
