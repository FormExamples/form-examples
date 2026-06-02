use otolaryngology_assessment_loco_crate::engine::snot22_grader::{classify_snot22_score, grade};
use otolaryngology_assessment_loco_crate::engine::snot22_rules::all_rules;
use otolaryngology_assessment_loco_crate::engine::types::*;

#[test]
fn empty_case_is_mild_with_zero_score() {
    let data = AssessmentData::default();
    let result = grade(&data);
    assert_eq!(result.total_score, 0);
    assert_eq!(result.answered_count, 0);
    assert_eq!(result.severity_level, "mild");
}

#[test]
fn classify_bands_match_specification() {
    assert_eq!(classify_snot22_score(0), "mild");
    assert_eq!(classify_snot22_score(7), "mild");
    assert_eq!(classify_snot22_score(8), "moderate");
    assert_eq!(classify_snot22_score(19), "moderate");
    assert_eq!(classify_snot22_score(20), "severe");
    assert_eq!(classify_snot22_score(110), "severe");
}

#[test]
fn answered_items_contribute_to_total() {
    let mut data = AssessmentData::default();
    data.snot22.need_to_blow_nose = Some(5);
    data.snot22.sneezing = Some(3);
    data.snot22.runny_nose = Some(2);
    let result = grade(&data);
    assert_eq!(result.total_score, 10);
    assert_eq!(result.answered_count, 3);
    assert_eq!(result.severity_level, "moderate");
}

#[test]
fn severe_band_when_total_at_or_above_twenty() {
    let mut data = AssessmentData::default();
    // 22 items * 1 = 22 -> severe.
    data.snot22.need_to_blow_nose = Some(1);
    data.snot22.sneezing = Some(1);
    data.snot22.runny_nose = Some(1);
    data.snot22.nasal_blockage = Some(1);
    data.snot22.loss_of_smell_taste = Some(1);
    data.snot22.coughing = Some(1);
    data.snot22.post_nasal_discharge = Some(1);
    data.snot22.thick_nasal_discharge = Some(1);
    data.snot22.ear_fullness = Some(1);
    data.snot22.dizziness = Some(1);
    data.snot22.ear_pain = Some(1);
    data.snot22.facial_pain_pressure = Some(1);
    data.snot22.difficulty_falling_asleep = Some(1);
    data.snot22.waking_up_at_night = Some(1);
    data.snot22.lack_of_good_nights_sleep = Some(1);
    data.snot22.waking_up_tired = Some(1);
    data.snot22.fatigue = Some(1);
    data.snot22.reduced_productivity = Some(1);
    data.snot22.reduced_concentration = Some(1);
    data.snot22.frustrated_restless_irritable = Some(1);
    data.snot22.sad = Some(1);
    data.snot22.embarrassed = Some(1);
    let result = grade(&data);
    assert_eq!(result.total_score, 22);
    assert_eq!(result.answered_count, 22);
    assert_eq!(result.severity_level, "severe");
}

#[test]
fn rule_count_is_22_and_ids_unique() {
    let rules = all_rules();
    assert_eq!(rules.len(), 22, "SNOT-22 should have exactly 22 rules");
    let mut ids: Vec<&str> = rules.iter().map(|r| r.id).collect();
    ids.sort();
    let before = ids.len();
    ids.dedup();
    assert_eq!(ids.len(), before, "SNOT-22 rule IDs must be unique");
    // Spot-check the canonical first and last IDs.
    let ids2: Vec<&str> = all_rules().iter().map(|r| r.id).collect();
    assert!(ids2.contains(&"SNOT22-001"));
    assert!(ids2.contains(&"SNOT22-022"));
}
