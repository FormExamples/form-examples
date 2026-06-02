use endocrinology_assessment_loco_crate::engine::endocrine_grader::calculate_grades;
use endocrinology_assessment_loco_crate::engine::rules::axis_rules;
use endocrinology_assessment_loco_crate::engine::types::*;

#[test]
fn empty_case_is_normal_with_zero_answered() {
    let data = AssessmentData::default();
    let result = calculate_grades(&data);
    assert_eq!(result.overall_status, "normal");
    assert_eq!(result.answered_count, 0);
    assert!(result.fired_rules.is_empty());
}

#[test]
fn tsh_over_10_grades_thyroid_severe() {
    let mut data = AssessmentData::default();
    data.thyroid_axis.tsh = Some(12.0);
    let result = calculate_grades(&data);
    let thyroid = result
        .axis_grades
        .iter()
        .find(|g| g.axis == "Thyroid")
        .expect("thyroid axis grade");
    assert_eq!(thyroid.status, "severe");
    assert_eq!(result.overall_status, "severe");
    assert!(result.fired_rules.iter().any(|r| r.id == "AXIS-THY"));
}

#[test]
fn hba1c_diabetes_range_grades_glucose_mild() {
    let mut data = AssessmentData::default();
    data.glucose_metabolism.hba1c = Some(50.0);
    let result = calculate_grades(&data);
    let g = result
        .axis_grades
        .iter()
        .find(|g| g.axis == "Glucose")
        .expect("glucose axis grade");
    assert_eq!(g.status, "mild");
}

#[test]
fn subclinical_promoted_to_mild_with_symptoms() {
    let mut data = AssessmentData::default();
    data.thyroid_axis.antibodies_positive = "yes".to_string();
    data.presenting_symptoms.palpitations = "yes".to_string();
    let result = calculate_grades(&data);
    let thyroid = result
        .axis_grades
        .iter()
        .find(|g| g.axis == "Thyroid")
        .expect("thyroid axis grade");
    assert_eq!(thyroid.status, "mild");
}

#[test]
fn overall_is_most_severe_axis() {
    let mut data = AssessmentData::default();
    data.thyroid_axis.antibodies_positive = "yes".to_string(); // subclinical
    data.bone_calcium.calcium_corrected = Some(3.2); // severe
    let result = calculate_grades(&data);
    assert_eq!(result.overall_status, "severe");
}

#[test]
fn axis_rule_ids_are_unique() {
    let rules = axis_rules();
    let mut ids: Vec<&str> = rules.iter().map(|r| r.id).collect();
    ids.sort();
    let n = ids.len();
    ids.dedup();
    assert_eq!(ids.len(), n, "axis rule IDs must be unique");
}

#[test]
fn answered_count_matches_non_empty_axes() {
    let mut data = AssessmentData::default();
    data.thyroid_axis.tsh = Some(2.0); // normal
    data.glucose_metabolism.hba1c = Some(40.0); // normal
    let result = calculate_grades(&data);
    // Two axes are non-empty (Thyroid + Glucose), the rest stay "".
    assert_eq!(result.answered_count, 2);
}
