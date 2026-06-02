use audio_vestibular_assessment_loco_crate::engine::audio_vestibular_grader::{
    calculate_dhi, calculate_pure_tone_audiometry, grade,
};
use audio_vestibular_assessment_loco_crate::engine::audio_vestibular_rules::{
    calculate_pta_from_thresholds, classify_dhi_handicap, classify_hearing_loss_grade,
    dhi_answer_score,
};
use audio_vestibular_assessment_loco_crate::engine::types::*;

fn ear(hz500: f64, hz1000: f64, hz2000: f64, hz4000: f64) -> EarThresholds {
    EarThresholds {
        hz500: Some(hz500),
        hz1000: Some(hz1000),
        hz2000: Some(hz2000),
        hz4000: Some(hz4000),
    }
}

#[test]
fn empty_assessment_is_unknown_grade() {
    let data = AssessmentData::default();
    let result = grade(&data);
    assert_eq!(result.hearing_loss_grade, "unknown");
    assert_eq!(result.dhi_total, 0);
    assert_eq!(result.dhi_handicap_level, "no-handicap");
    assert!(result.right_pta.is_none());
    assert!(result.left_pta.is_none());
    assert!(result.better_ear_pta.is_none());
}

#[test]
fn pta_from_thresholds_averages_four_freqs() {
    let pta = calculate_pta_from_thresholds(&ear(10.0, 20.0, 30.0, 40.0));
    assert_eq!(pta, Some(25.0));
}

#[test]
fn pta_with_missing_thresholds_returns_none() {
    let pta = calculate_pta_from_thresholds(&EarThresholds::default());
    assert!(pta.is_none());
}

#[test]
fn classify_grade_boundaries() {
    assert_eq!(classify_hearing_loss_grade(Some(15.0)), "normal");
    assert_eq!(classify_hearing_loss_grade(Some(20.0)), "mild");
    assert_eq!(classify_hearing_loss_grade(Some(34.9)), "mild");
    assert_eq!(classify_hearing_loss_grade(Some(35.0)), "moderate");
    assert_eq!(classify_hearing_loss_grade(Some(50.0)), "moderately-severe");
    assert_eq!(classify_hearing_loss_grade(Some(65.0)), "severe");
    assert_eq!(classify_hearing_loss_grade(Some(80.0)), "profound");
    assert_eq!(classify_hearing_loss_grade(None), "unknown");
}

#[test]
fn pure_tone_calculation_picks_better_ear() {
    let mut data = AssessmentData::default();
    data.pure_tone_audiometry.right_ear.air_conduction = ear(40.0, 40.0, 40.0, 40.0);
    data.pure_tone_audiometry.left_ear.air_conduction = ear(20.0, 20.0, 20.0, 20.0);
    let pta = calculate_pure_tone_audiometry(&data);
    assert_eq!(pta.right_pta, Some(40.0));
    assert_eq!(pta.left_pta, Some(20.0));
    assert_eq!(pta.better_ear_pta, Some(20.0));
    assert_eq!(pta.asymmetry, Some(20.0));
    assert_eq!(pta.hearing_loss_grade, "mild");
}

#[test]
fn dhi_answer_score_values() {
    assert_eq!(dhi_answer_score("yes"), 4);
    assert_eq!(dhi_answer_score("sometimes"), 2);
    assert_eq!(dhi_answer_score("no"), 0);
    assert_eq!(dhi_answer_score(""), 0);
}

#[test]
fn classify_dhi_handicap_boundaries() {
    assert_eq!(classify_dhi_handicap(0), "no-handicap");
    assert_eq!(classify_dhi_handicap(16), "no-handicap");
    assert_eq!(classify_dhi_handicap(18), "mild");
    assert_eq!(classify_dhi_handicap(36), "mild");
    assert_eq!(classify_dhi_handicap(38), "moderate");
    assert_eq!(classify_dhi_handicap(52), "moderate");
    assert_eq!(classify_dhi_handicap(54), "severe");
    assert_eq!(classify_dhi_handicap(100), "severe");
}

#[test]
fn dhi_all_yes_is_maximum() {
    let mut data = AssessmentData::default();
    let dhi = &mut data.dizziness_handicap_inventory;
    dhi.q1 = "yes".to_string();
    dhi.q2 = "yes".to_string();
    dhi.q3 = "yes".to_string();
    dhi.q4 = "yes".to_string();
    dhi.q5 = "yes".to_string();
    dhi.q6 = "yes".to_string();
    dhi.q7 = "yes".to_string();
    dhi.q8 = "yes".to_string();
    dhi.q9 = "yes".to_string();
    dhi.q10 = "yes".to_string();
    dhi.q11 = "yes".to_string();
    dhi.q12 = "yes".to_string();
    dhi.q13 = "yes".to_string();
    dhi.q14 = "yes".to_string();
    dhi.q15 = "yes".to_string();
    dhi.q16 = "yes".to_string();
    dhi.q17 = "yes".to_string();
    dhi.q18 = "yes".to_string();
    dhi.q19 = "yes".to_string();
    dhi.q20 = "yes".to_string();
    dhi.q21 = "yes".to_string();
    dhi.q22 = "yes".to_string();
    dhi.q23 = "yes".to_string();
    dhi.q24 = "yes".to_string();
    dhi.q25 = "yes".to_string();
    let res = calculate_dhi(&data);
    assert_eq!(res.total, 100);
    assert_eq!(res.answered_count, 25);
    assert_eq!(res.handicap_level, "severe");
    // 7 functional × 4 = 28
    assert_eq!(res.functional, 28);
    // 9 emotional × 4 = 36
    assert_eq!(res.emotional, 36);
    // 9 physical × 4 = 36
    assert_eq!(res.physical, 36);
}

#[test]
fn grade_combines_pta_and_dhi() {
    let mut data = AssessmentData::default();
    data.pure_tone_audiometry.right_ear.air_conduction = ear(70.0, 75.0, 80.0, 85.0);
    data.pure_tone_audiometry.left_ear.air_conduction = ear(70.0, 75.0, 80.0, 85.0);
    let dhi = &mut data.dizziness_handicap_inventory;
    dhi.q1 = "yes".to_string();
    dhi.q11 = "yes".to_string();
    let res = grade(&data);
    assert_eq!(res.hearing_loss_grade, "severe");
    assert_eq!(res.dhi_total, 8);
    assert_eq!(res.dhi_handicap_level, "no-handicap");
}
