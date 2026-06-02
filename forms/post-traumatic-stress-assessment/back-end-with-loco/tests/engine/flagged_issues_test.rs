use post_traumatic_stress_assessment_loco_crate::engine::flagged_issues::detect_additional_flags;
use post_traumatic_stress_assessment_loco_crate::engine::types::*;

fn baseline() -> AssessmentData {
    AssessmentData {
        trauma_event: TraumaEvent {
            event_description: "Specified Criterion A event.".to_string(),
            event_date: "2025-06-01".to_string(),
            is_ongoing: false,
        },
        ..AssessmentData::default()
    }
}

#[test]
fn baseline_emits_only_assessment_incomplete_flag() {
    let data = baseline();
    let flags = detect_additional_flags(&data, 0, false, 0);
    // Zero items answered -> FLAG-NOT-ASSESSED-001 should be present.
    assert!(flags.iter().any(|f| f.id == "FLAG-NOT-ASSESSED-001"));
}

#[test]
fn item16_high_emits_selfharm_flag() {
    let mut data = baseline();
    data.cluster_e_arousal_reactivity
        .item16_reckless_or_self_destructive = Some(3);
    let flags = detect_additional_flags(&data, 3, false, 1);
    let f = flags
        .iter()
        .find(|f| f.id == "FLAG-SELFHARM-001")
        .expect("selfharm flag");
    assert_eq!(f.priority, "urgent");
}

#[test]
fn items_3_and_8_high_emit_dissociation_flag() {
    let mut data = baseline();
    data.cluster_b_intrusion.item3_feeling_reliving = Some(3);
    data.cluster_d_negative_alterations
        .item8_trouble_remembering_important_parts = Some(3);
    let flags = detect_additional_flags(&data, 6, false, 2);
    assert!(flags.iter().any(|f| f.id == "FLAG-DISSOCIATION-001" && f.priority == "high"));
}

#[test]
fn probable_dsm5_emits_structured_interview_flag() {
    let data = baseline();
    let flags = detect_additional_flags(&data, 40, true, 20);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-STRUCTURED-INTERVIEW-001" && f.priority == "medium")
    );
}

#[test]
fn total_over_38_emits_severe_flag() {
    let data = baseline();
    let flags = detect_additional_flags(&data, 50, false, 20);
    assert!(flags.iter().any(|f| f.id == "FLAG-SEVERE-001" && f.priority == "high"));
}

#[test]
fn partial_completion_emits_not_assessed_002() {
    let data = baseline();
    let flags = detect_additional_flags(&data, 10, false, 5);
    assert!(flags.iter().any(|f| f.id == "FLAG-NOT-ASSESSED-002"));
}

#[test]
fn missing_trauma_emits_unspecified_flag() {
    let mut data = baseline();
    data.trauma_event.event_description = String::new();
    let flags = detect_additional_flags(&data, 0, false, 20);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-TRAUMA-UNSPECIFIED-001" && f.priority == "medium")
    );
}

#[test]
fn ongoing_trauma_emits_high_flag() {
    let mut data = baseline();
    data.trauma_event.is_ongoing = true;
    let flags = detect_additional_flags(&data, 0, false, 20);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-TRAUMA-ONGOING-001" && f.priority == "high")
    );
}

#[test]
fn flags_are_sorted_by_priority() {
    let mut data = baseline();
    data.cluster_e_arousal_reactivity
        .item16_reckless_or_self_destructive = Some(4);
    data.trauma_event.is_ongoing = true;
    let flags = detect_additional_flags(&data, 50, true, 20);
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
