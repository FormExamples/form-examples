use otolaryngology_assessment_loco_crate::engine::flagged_issues::detect_additional_flags;
use otolaryngology_assessment_loco_crate::engine::types::*;

#[test]
fn baseline_has_no_flags() {
    let data = AssessmentData::default();
    let flags = detect_additional_flags(&data);
    assert!(flags.is_empty(), "default baseline must not raise flags: {flags:?}");
}

#[test]
fn neck_mass_emits_urgent_flag() {
    let mut data = AssessmentData::default();
    data.oropharyngeal_neck_examination.neck_mass = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-NECK-001" && f.priority == "urgent")
    );
}

#[test]
fn head_neck_cancer_emits_high_priority_flag() {
    let mut data = AssessmentData::default();
    data.past_ent_history.head_neck_cancer = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-HX-001" && f.priority == "high")
    );
}

#[test]
fn perforated_tm_emits_per_side_flag() {
    let mut data = AssessmentData::default();
    data.otoscopy.right.tympanic_membrane = "perforated".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-OTO-PERF-RIGHT"));
}

#[test]
fn sudden_hearing_loss_emits_urgent_audiology_flag() {
    let mut data = AssessmentData::default();
    data.past_ent_history.hearing_loss = "yes".to_string();
    data.history_of_present_illness.onset_type = "sudden".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-AUD-001" && f.priority == "urgent")
    );
}

#[test]
fn large_polyps_emit_per_side_high_priority_flag() {
    let mut data = AssessmentData::default();
    data.anterior_rhinoscopy.left.polyps = "large".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-RHINO-POLYP-LEFT" && f.priority == "high")
    );
}

#[test]
fn asymmetric_tonsils_emit_high_priority_flag() {
    let mut data = AssessmentData::default();
    data.oropharyngeal_neck_examination.tonsils = "asymmetric".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-OROPHX-001" && f.priority == "high")
    );
}

#[test]
fn high_sleep_domain_emits_medium_flag() {
    let mut data = AssessmentData::default();
    data.snot22.difficulty_falling_asleep = Some(3);
    data.snot22.waking_up_at_night = Some(3);
    data.snot22.lack_of_good_nights_sleep = Some(3);
    data.snot22.waking_up_tired = Some(3);
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-SNOT-SLEEP" && f.priority == "medium")
    );
}

#[test]
fn flags_are_sorted_by_priority() {
    let mut data = AssessmentData::default();
    // urgent (neck mass) + high (head/neck cancer) + medium (smoking) + low (alcohol).
    data.oropharyngeal_neck_examination.neck_mass = "yes".to_string();
    data.past_ent_history.head_neck_cancer = "yes".to_string();
    data.past_ent_history.smoking = "yes".to_string();
    data.past_ent_history.alcohol = "yes".to_string();
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
