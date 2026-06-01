use endometriosis_assessment_tera_crate::engine::flagged_issues::detect_additional_flags;
use endometriosis_assessment_tera_crate::engine::types::*;

#[test]
fn empty_assessment_has_no_flags() {
    let data = AssessmentData::default();
    let flags = detect_additional_flags(&data);
    assert!(flags.is_empty());
}

#[test]
fn bowel_obstruction_emits_high_priority_flag() {
    let mut data = AssessmentData::default();
    data.gastrointestinal_symptoms.bowel_obstruction_symptoms = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-BOWEL-001" && f.priority == "high")
    );
}

#[test]
fn urinary_obstruction_emits_high_priority_flag() {
    let mut data = AssessmentData::default();
    data.urinary_symptoms.urinary_obstruction_symptoms = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-URIN-001" && f.priority == "high")
    );
}

#[test]
fn severe_pelvic_pain_emits_high_priority_flag() {
    let mut data = AssessmentData::default();
    data.pain_assessment.has_pelvic_pain = "yes".to_string();
    data.pain_assessment.pelvic_pain_severity = Some(9);
    let flags = detect_additional_flags(&data);
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-PAIN-001")
        .expect("pain flag");
    assert_eq!(flag.priority, "high");
    assert!(flag.message.contains("9/10"));
}

#[test]
fn constant_pain_emits_flag() {
    let mut data = AssessmentData::default();
    data.pain_assessment.has_pelvic_pain = "yes".to_string();
    data.pain_assessment.pelvic_pain_timing = "constant".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-PAIN-002" && f.priority == "high")
    );
}

#[test]
fn low_amh_emits_high_priority_flag() {
    let mut data = AssessmentData::default();
    data.fertility_assessment.amh_level = Some(3.0);
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-FERT-002" && f.priority == "high")
    );
}

#[test]
fn current_opioids_emits_high_priority_flag() {
    let mut data = AssessmentData::default();
    data.previous_treatments.opioids_current = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-TX-001" && f.priority == "high")
    );
}

#[test]
fn cyclical_rectal_bleeding_emits_medium_flag() {
    let mut data = AssessmentData::default();
    data.gastrointestinal_symptoms.rectal_bleeding = "yes".to_string();
    data.gastrointestinal_symptoms.rectal_bleeding_cyclical = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-BOWEL-002" && f.priority == "medium")
    );
}

#[test]
fn deep_dyspareunia_emits_medium_flag() {
    let mut data = AssessmentData::default();
    data.pain_assessment.dyspareunia = "deep".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-PAIN-003" && f.priority == "medium")
    );
}

#[test]
fn flags_are_sorted_by_priority() {
    let mut data = AssessmentData::default();
    data.gastrointestinal_symptoms.bowel_obstruction_symptoms = "yes".to_string(); // high
    data.pain_assessment.dyspareunia = "deep".to_string(); // medium
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
