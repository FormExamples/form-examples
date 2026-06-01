use chrono::Datelike;
use organ_donation_assessment_tera_crate::engine::donation_grader::{evaluate_rules, grade, run_rules};
use organ_donation_assessment_tera_crate::engine::donation_rules::all_rules;
use organ_donation_assessment_tera_crate::engine::types::*;

/// Baseline "ideal donor" case: deceased donor with no penalties.
fn baseline_ideal_donor() -> AssessmentData {
    AssessmentData {
        demographics: Demographics {
            first_name: "Jane".to_string(),
            last_name: "Doe".to_string(),
            date_of_birth: "1990-01-01".to_string(),
            sex: "female".to_string(),
            weight: Some(70.0),
            height: Some(170.0),
            bmi: Some(24.2),
            ethnicity: "White British".to_string(),
        },
        donor_type_registration: DonorTypeRegistration {
            donor_type: "deceased".to_string(),
            ..DonorTypeRegistration::default()
        },
        ..AssessmentData::default()
    }
}

#[test]
fn empty_case_grades_as_suitable_low() {
    let data = AssessmentData::default();
    let result = grade(&data);
    assert_eq!(result.suggested_eligibility, "suitable");
    assert_eq!(result.risk_level, "low");
}

#[test]
fn baseline_ideal_donor_is_suitable_low() {
    let data = baseline_ideal_donor();
    let result = grade(&data);
    assert_eq!(result.suggested_eligibility, "suitable");
    assert_eq!(result.risk_level, "low");
}

#[test]
fn hiv_positive_yields_unsuitable_critical() {
    let mut data = baseline_ideal_donor();
    data.infectious_disease_screening.hiv_status = "positive".to_string();
    let result = grade(&data);
    assert_eq!(result.suggested_eligibility, "unsuitable");
    assert_eq!(result.risk_level, "critical");
    assert!(result.fired_rules.iter().any(|r| r.id == "ID-001"));
}

#[test]
fn abo_incompatibility_yields_unsuitable_critical() {
    let mut data = baseline_ideal_donor();
    data.immunological_assessment.abo_compatibility = "incompatible".to_string();
    let result = grade(&data);
    assert_eq!(result.suggested_eligibility, "unsuitable");
    assert_eq!(result.risk_level, "critical");
    assert!(result.fired_rules.iter().any(|r| r.id == "IM-001"));
}

#[test]
fn diabetes_yields_conditionally_suitable_moderate() {
    let mut data = baseline_ideal_donor();
    data.medical_history.has_diabetes = "yes".to_string();
    let result = grade(&data);
    assert_eq!(result.suggested_eligibility, "conditionally-suitable");
    assert_eq!(result.risk_level, "moderate");
    assert!(result.fired_rules.iter().any(|r| r.id == "MH-006"));
}

#[test]
fn egfr_50_yields_conditionally_suitable_high() {
    let mut data = baseline_ideal_donor();
    data.organ_function.egfr = Some(50.0);
    let result = grade(&data);
    assert_eq!(result.suggested_eligibility, "conditionally-suitable");
    assert_eq!(result.risk_level, "high");
    assert!(result.fired_rules.iter().any(|r| r.id == "OF-002"));
}

#[test]
fn asa_grade_i_is_positive_marker_does_not_lower_grade() {
    let mut data = baseline_ideal_donor();
    data.surgical_assessment.asa_grade = "I".to_string();
    let result = grade(&data);
    // SU-001 (ASA-I) is excluded from penalty counting.
    assert_eq!(result.suggested_eligibility, "suitable");
    assert_eq!(result.risk_level, "low");
    assert!(result.fired_rules.iter().any(|r| r.id == "SU-001"));
}

#[test]
fn living_minor_yields_unsuitable_critical() {
    let mut data = baseline_ideal_donor();
    data.donor_type_registration.donor_type = "living".to_string();
    let today = chrono::Utc::now().date_naive();
    let dob = format!("{}-01-01", today.year() - 10);
    data.demographics.date_of_birth = dob;
    let result = grade(&data);
    assert_eq!(result.suggested_eligibility, "unsuitable");
    assert!(result.fired_rules.iter().any(|r| r.id == "DM-003"));
}

#[test]
fn assessor_decision_overrides_eligibility_but_keeps_risk_level() {
    let mut data = baseline_ideal_donor();
    data.medical_history.has_diabetes = "yes".to_string();
    data.eligibility_allocation.eligibility_decision = "unsuitable".to_string();
    let result = grade(&data);
    // Engine-suggested is conditionally-suitable, but assessor overrides.
    assert_eq!(result.suggested_eligibility, "conditionally-suitable");
    assert_eq!(result.eligibility, "unsuitable");
    // Risk level reflects engine grading.
    assert_eq!(result.risk_level, "moderate");
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
fn evaluate_and_run_rules_agree() {
    let data = baseline_ideal_donor();
    let a = evaluate_rules(&data);
    let b = run_rules(&data);
    assert_eq!(a.len(), b.len());
}
