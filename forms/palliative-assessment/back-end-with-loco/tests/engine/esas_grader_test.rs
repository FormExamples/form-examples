use palliative_assessment_loco_crate::engine::esas_grader::grade;
use palliative_assessment_loco_crate::engine::rules::all_rules;
use palliative_assessment_loco_crate::engine::types::*;

/// A baseline assessment with all ten ESAS-r items set to 0 (none).
fn baseline_case() -> AssessmentData {
    AssessmentData {
        esasr_symptoms: EsasrSymptoms {
            pain: Some(0),
            tiredness: Some(0),
            drowsiness: Some(0),
            nausea: Some(0),
            lack_of_appetite: Some(0),
            shortness_of_breath: Some(0),
            depression: Some(0),
            anxiety: Some(0),
            wellbeing: Some(0),
            other: Some(0),
            other_label: String::new(),
            symptom_notes: String::new(),
        },
        ..AssessmentData::default()
    }
}

#[test]
fn empty_assessment_has_total_zero_and_no_answered_items() {
    let data = AssessmentData::default();
    let result = grade(&data);
    assert_eq!(result.esas_total, 0);
    assert_eq!(result.answered_count, 0);
    assert_eq!(result.severity_band, "none");
}

#[test]
fn baseline_zero_assessment_classifies_as_none() {
    let data = baseline_case();
    let result = grade(&data);
    assert_eq!(result.esas_total, 0);
    assert_eq!(result.answered_count, 10);
    assert_eq!(result.severity_band, "none");
}

#[test]
fn moderate_total_classifies_as_moderate() {
    let mut data = baseline_case();
    data.esasr_symptoms.pain = Some(5);
    data.esasr_symptoms.tiredness = Some(5);
    data.esasr_symptoms.shortness_of_breath = Some(5);
    data.esasr_symptoms.depression = Some(5);
    data.esasr_symptoms.anxiety = Some(5);
    data.esasr_symptoms.wellbeing = Some(6);
    data.esasr_symptoms.other = Some(5);
    let result = grade(&data);
    // 5+5+5+5+5+6+5 + zeroes = 36 -> moderate (31-60)
    assert_eq!(result.esas_total, 36);
    assert_eq!(result.severity_band, "moderate");
}

#[test]
fn severe_pain_yields_individual_flag() {
    let mut data = baseline_case();
    data.esasr_symptoms.pain = Some(9);
    let result = grade(&data);
    assert!(
        result
            .individual_flags
            .iter()
            .any(|f| f.symptom_key == "pain" && f.score == 9),
        "expected individual flag for pain"
    );
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
fn ancillary_low_performance_status_fires() {
    let mut data = baseline_case();
    data.performance_status.pps_score = Some(20);
    let result = grade(&data);
    assert!(result.fired_rules.iter().any(|r| r.id == "PALL-ANC-002"));
}

#[test]
fn ancillary_carer_overwhelmed_fires_with_score_two() {
    let mut data = baseline_case();
    data.carer_family_support.carer_strain_level = "overwhelmed".to_string();
    let result = grade(&data);
    let r = result
        .fired_rules
        .iter()
        .find(|r| r.id == "PALL-ANC-005")
        .expect("carer-burden rule");
    assert_eq!(r.score, 2);
}

#[test]
fn unanswered_esas_items_are_excluded_from_total() {
    let mut data = baseline_case();
    // Wipe pain, tiredness; remaining 8 items contribute.
    data.esasr_symptoms.pain = None;
    data.esasr_symptoms.tiredness = None;
    data.esasr_symptoms.depression = Some(4);
    let result = grade(&data);
    assert_eq!(result.answered_count, 8);
    assert_eq!(result.esas_total, 4);
}
