use palliative_assessment_tera_crate::engine::flagged_issues::detect_additional_flags;
use palliative_assessment_tera_crate::engine::types::*;

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
fn baseline_has_no_flags() {
    let flags = detect_additional_flags(&baseline_case());
    assert!(flags.is_empty(), "baseline should not produce flags: {flags:?}");
}

#[test]
fn severe_pain_emits_high_priority_flag() {
    let mut data = baseline_case();
    data.esasr_symptoms.pain = Some(8);
    let flags = detect_additional_flags(&data);
    assert!(flags
        .iter()
        .any(|f| f.id == "FLAG-PALL-PAIN" && f.priority == "high"));
}

#[test]
fn severe_dyspnoea_emits_high_priority_flag() {
    let mut data = baseline_case();
    data.esasr_symptoms.shortness_of_breath = Some(9);
    let flags = detect_additional_flags(&data);
    assert!(flags
        .iter()
        .any(|f| f.id == "FLAG-PALL-DYSPNOEA" && f.priority == "high"));
}

#[test]
fn severe_psych_emits_combined_flag() {
    let mut data = baseline_case();
    data.esasr_symptoms.depression = Some(8);
    data.esasr_symptoms.anxiety = Some(7);
    let flags = detect_additional_flags(&data);
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-PALL-PSYCH")
        .expect("psych flag");
    assert_eq!(flag.priority, "high");
    assert!(flag.message.contains("depression 8/10"));
    assert!(flag.message.contains("anxiety 7/10"));
}

#[test]
fn no_dnacpr_at_low_performance_status_emits_flag() {
    let mut data = baseline_case();
    data.performance_status.pps_score = Some(20);
    data.goals_of_care_acp.dnacpr_documented = "no".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags
        .iter()
        .any(|f| f.id == "FLAG-PALL-DNACPR" && f.priority == "high"));
}

#[test]
fn carer_overwhelmed_emits_high_priority_flag() {
    let mut data = baseline_case();
    data.carer_family_support.carer_strain_level = "overwhelmed".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags
        .iter()
        .any(|f| f.id == "FLAG-PALL-CARER-OVERWHELM" && f.priority == "high"));
}

#[test]
fn moderate_symptoms_emit_medium_flags() {
    let mut data = baseline_case();
    data.esasr_symptoms.pain = Some(5);
    let flags = detect_additional_flags(&data);
    assert!(flags
        .iter()
        .any(|f| f.id == "FLAG-PALL-MOD-pain" && f.priority == "medium"));
}

#[test]
fn mild_symptoms_emit_low_flags() {
    let mut data = baseline_case();
    data.esasr_symptoms.pain = Some(2);
    let flags = detect_additional_flags(&data);
    assert!(flags
        .iter()
        .any(|f| f.id == "FLAG-PALL-MILD-pain" && f.priority == "low"));
}

#[test]
fn missing_acp_emits_medium_flag() {
    let mut data = baseline_case();
    data.goals_of_care_acp.respect_form_completed = "no".to_string();
    data.goals_of_care_acp.adrt_completed = "no".to_string();
    data.goals_of_care_acp.lpa_health_and_welfare = "no".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags
        .iter()
        .any(|f| f.id == "FLAG-PALL-ACP" && f.priority == "medium"));
}

#[test]
fn flags_sorted_high_then_medium_then_low() {
    let mut data = baseline_case();
    data.esasr_symptoms.pain = Some(9); // high
    data.esasr_symptoms.nausea = Some(5); // medium
    data.esasr_symptoms.tiredness = Some(2); // low
    let flags = detect_additional_flags(&data);
    let priorities: Vec<&str> = flags.iter().map(|f| f.priority.as_str()).collect();
    let mut sorted = priorities.clone();
    sorted.sort_by_key(|p| match *p {
        "high" => 0,
        "medium" => 1,
        "low" => 2,
        _ => 3,
    });
    assert_eq!(priorities, sorted);
}
