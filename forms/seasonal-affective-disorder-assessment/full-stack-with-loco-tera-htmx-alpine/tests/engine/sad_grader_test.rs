use seasonal_affective_disorder_assessment_tera_crate::engine::sad_grader::grade;
use seasonal_affective_disorder_assessment_tera_crate::engine::types::*;

/// A baseline data set with SPAQ items at 0 and PHQ-9 items at 0 (all answered).
fn answered_minimum() -> AssessmentData {
    AssessmentData {
        current_mood: CurrentMood {
            phq9: Phq9Items {
                q1: Some(0),
                q2: Some(0),
                q3: Some(0),
                q4: Some(0),
                q5: Some(0),
                q6: Some(0),
                q7: Some(0),
                q8: Some(0),
                q9: Some(0),
            },
            difficulty_level: "not-difficult".to_string(),
        },
        sleep_energy: SleepEnergy {
            spaq: SpaqSleep {
                sleep_length: Some(0),
                energy_level: Some(0),
            },
            ..Default::default()
        },
        appetite_weight: AppetiteWeight {
            spaq: SpaqAppetite {
                appetite: Some(0),
                weight: Some(0),
            },
            ..Default::default()
        },
        social_occupational: SocialOccupational {
            spaq: SpaqSocial {
                mood: Some(0),
                social_activity: Some(0),
            },
            ..Default::default()
        },
        ..Default::default()
    }
}

#[test]
fn empty_assessment_is_no_sad() {
    let data = AssessmentData::default();
    let result = grade(&data);
    assert_eq!(result.spaq_score, 0);
    assert_eq!(result.phq9_score, 0);
    assert_eq!(result.spaq_band, "no-sad");
    assert_eq!(result.phq9_band, "minimal");
    assert_eq!(result.combined_severity, "no-sad");
    assert!(result.fired_rules.is_empty(), "no items answered => no fired rules");
}

#[test]
fn baseline_zero_scores_are_no_sad() {
    let data = answered_minimum();
    let result = grade(&data);
    assert_eq!(result.spaq_score, 0);
    assert_eq!(result.phq9_score, 0);
    assert_eq!(result.spaq_band, "no-sad");
    assert_eq!(result.phq9_band, "minimal");
    assert_eq!(result.combined_severity, "no-sad");
    // 6 SPAQ + 9 PHQ-9 items answered.
    assert_eq!(result.fired_rules.len(), 15);
}

#[test]
fn sad_likely_band_classification() {
    let mut data = answered_minimum();
    // SPAQ total = 11+ → "sad-likely".
    data.sleep_energy.spaq.sleep_length = Some(2);
    data.sleep_energy.spaq.energy_level = Some(2);
    data.appetite_weight.spaq.appetite = Some(2);
    data.appetite_weight.spaq.weight = Some(2);
    data.social_occupational.spaq.mood = Some(2);
    data.social_occupational.spaq.social_activity = Some(2);
    let result = grade(&data);
    assert_eq!(result.spaq_score, 12);
    assert_eq!(result.spaq_band, "sad-likely");
}

#[test]
fn subsyndromal_band_classification() {
    let mut data = answered_minimum();
    // SPAQ total = 9 → "subsyndromal".
    data.sleep_energy.spaq.sleep_length = Some(2);
    data.sleep_energy.spaq.energy_level = Some(2);
    data.appetite_weight.spaq.appetite = Some(2);
    data.appetite_weight.spaq.weight = Some(2);
    data.social_occupational.spaq.mood = Some(1);
    data.social_occupational.spaq.social_activity = Some(0);
    let result = grade(&data);
    assert_eq!(result.spaq_score, 9);
    assert_eq!(result.spaq_band, "subsyndromal");
}

#[test]
fn phq9_severe_band_and_critical_combined() {
    let mut data = answered_minimum();
    data.current_mood.phq9.q1 = Some(3);
    data.current_mood.phq9.q2 = Some(3);
    data.current_mood.phq9.q3 = Some(3);
    data.current_mood.phq9.q4 = Some(3);
    data.current_mood.phq9.q5 = Some(3);
    data.current_mood.phq9.q6 = Some(3);
    data.current_mood.phq9.q7 = Some(3);
    data.current_mood.phq9.q8 = Some(2);
    data.current_mood.phq9.q9 = Some(0); // q9=0 isolates phq9_score path
    let result = grade(&data);
    assert_eq!(result.phq9_score, 23);
    assert_eq!(result.phq9_band, "severe");
    // PHQ-9 total >= 20 OR PHQ-9 band 'severe' alone → "critical" by the
    // first rule (phq9_score >= 20).
    assert_eq!(result.combined_severity, "critical");
}

#[test]
fn suicidal_ideation_yields_critical_severity() {
    let mut data = answered_minimum();
    data.risk_assessment.suicidal_ideation = "yes".to_string();
    let result = grade(&data);
    assert_eq!(result.combined_severity, "critical");
    assert!(result.additional_flags.iter().any(|f| f.id == "FLAG-RISK-001"));
}

#[test]
fn phq9_q9_positive_yields_critical_severity() {
    let mut data = answered_minimum();
    data.current_mood.phq9.q9 = Some(1);
    let result = grade(&data);
    assert_eq!(result.combined_severity, "critical");
    assert!(result.additional_flags.iter().any(|f| f.id == "FLAG-PHQ9-Q9"));
}

#[test]
fn mild_severity_path_via_phq9_mild() {
    let mut data = answered_minimum();
    // PHQ-9 total 5 → "mild".
    data.current_mood.phq9.q1 = Some(2);
    data.current_mood.phq9.q2 = Some(2);
    data.current_mood.phq9.q3 = Some(1);
    let result = grade(&data);
    assert_eq!(result.phq9_score, 5);
    assert_eq!(result.phq9_band, "mild");
    assert_eq!(result.combined_severity, "mild");
}

#[test]
fn moderate_severity_path_via_phq9_moderate() {
    let mut data = answered_minimum();
    // PHQ-9 total 10 → "moderate".
    data.current_mood.phq9.q1 = Some(2);
    data.current_mood.phq9.q2 = Some(2);
    data.current_mood.phq9.q3 = Some(2);
    data.current_mood.phq9.q4 = Some(2);
    data.current_mood.phq9.q5 = Some(2);
    let result = grade(&data);
    assert_eq!(result.phq9_score, 10);
    assert_eq!(result.phq9_band, "moderate");
    assert_eq!(result.combined_severity, "moderate");
}

#[test]
fn rule_ids_are_unique() {
    let data = answered_minimum();
    let result = grade(&data);
    let mut ids: Vec<&str> = result.fired_rules.iter().map(|r| r.id.as_str()).collect();
    ids.sort();
    let len_before = ids.len();
    ids.dedup();
    assert_eq!(ids.len(), len_before, "rule IDs must be unique");
}

#[test]
fn fired_rules_carry_score_value() {
    let mut data = answered_minimum();
    data.sleep_energy.spaq.sleep_length = Some(3);
    let result = grade(&data);
    let r = result
        .fired_rules
        .iter()
        .find(|r| r.id == "SPAQ-001")
        .expect("SPAQ-001 must fire");
    assert_eq!(r.score, 3);
}
