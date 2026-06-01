use dyslexia_assessment_tera_crate::engine::flagged_issues::detect_additional_flags;
use dyslexia_assessment_tera_crate::engine::types::*;

fn empty_case() -> AssessmentData {
    AssessmentData::default()
}

#[test]
fn empty_case_has_no_flags() {
    let flags = detect_additional_flags(&empty_case());
    assert!(flags.is_empty(), "empty case should not produce flags");
}

#[test]
fn severe_reading_score_emits_high_priority_flag() {
    let mut data = empty_case();
    data.reading_assessment.reading_fluency_score = Some(50);
    let flags = detect_additional_flags(&data);
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-READ-001")
        .expect("reading fluency flag");
    assert_eq!(flag.priority, "high");
    assert!(flag.message.contains("significantly below average"));
}

#[test]
fn moderate_writing_score_emits_high_priority_flag() {
    let mut data = empty_case();
    data.writing_spelling.spelling_accuracy_score = Some(60);
    let flags = detect_additional_flags(&data);
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-WRIT-001")
        .expect("spelling flag");
    assert_eq!(flag.priority, "high");
    assert!(flag.message.contains("well below average"));
}

#[test]
fn mild_phonological_score_emits_medium_priority_flag() {
    let mut data = empty_case();
    data.phonological_processing.phonological_awareness_score = Some(75);
    let flags = detect_additional_flags(&data);
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-PHON-001")
        .expect("phonological awareness flag");
    assert_eq!(flag.priority, "medium");
    assert!(flag.message.contains("below average"));
}

#[test]
fn hearing_problems_emits_high_priority_flag() {
    let mut data = empty_case();
    data.developmental_history.hearing_problems = "yes".to_string();
    let flags = detect_additional_flags(&data);
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-DEV-001")
        .expect("hearing flag");
    assert_eq!(flag.priority, "high");
}

#[test]
fn vision_problems_emits_high_priority_flag() {
    let mut data = empty_case();
    data.developmental_history.vision_problems = "yes".to_string();
    let flags = detect_additional_flags(&data);
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-DEV-002")
        .expect("vision flag");
    assert_eq!(flag.priority, "high");
}

#[test]
fn family_history_emits_medium_flag() {
    let mut data = empty_case();
    data.developmental_history.family_history_dyslexia = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-DEV-005" && f.priority == "medium")
    );
}

#[test]
fn esl_learner_emits_medium_flag() {
    let mut data = empty_case();
    data.educational_background.esl_learner = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-EDU-001" && f.priority == "medium")
    );
}

#[test]
fn three_school_changes_emits_low_flag() {
    let mut data = empty_case();
    data.educational_background.school_change_count = Some(3);
    let flags = detect_additional_flags(&data);
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-EDU-003")
        .expect("school change flag");
    assert_eq!(flag.priority, "low");
    assert!(flag.message.contains("3 school changes"));
}

#[test]
fn mental_health_concerns_emits_high_flag() {
    let mut data = empty_case();
    data.emotional_behavioural.mental_health_concerns = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-EMOT-004" && f.priority == "high")
    );
}

#[test]
fn no_previous_intervention_and_no_previous_assessments_emits_low_flag() {
    let mut data = empty_case();
    data.previous_support.previous_intervention = "no".to_string();
    data.educational_background.previous_assessments = "no".to_string();
    let flags = detect_additional_flags(&data);
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-SUPP-001")
        .expect("support flag");
    assert_eq!(flag.priority, "low");
}

#[test]
fn flags_are_sorted_by_priority() {
    let mut data = empty_case();
    // One high (mental health), one medium (family history), one low (3 school changes).
    data.emotional_behavioural.mental_health_concerns = "yes".to_string();
    data.developmental_history.family_history_dyslexia = "yes".to_string();
    data.educational_background.school_change_count = Some(3);
    let flags = detect_additional_flags(&data);
    let priorities: Vec<&str> = flags.iter().map(|f| f.priority.as_str()).collect();
    let mut sorted = priorities.clone();
    sorted.sort_by_key(|p| match *p {
        "urgent" => 0,
        "high" => 1,
        "medium" => 2,
        "low" => 3,
        _ => 4,
    });
    assert_eq!(priorities, sorted);
}
