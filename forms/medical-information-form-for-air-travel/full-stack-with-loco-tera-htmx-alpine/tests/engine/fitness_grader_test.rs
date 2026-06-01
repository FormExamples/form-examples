use chrono::{Duration, Utc};
use medical_information_form_for_air_travel_tera_crate::engine::fitness_grader::{
    evaluate_fitness, grade,
};
use medical_information_form_for_air_travel_tera_crate::engine::types::*;

fn iso_today_minus(days: i64) -> String {
    let d = Utc::now().date_naive() - Duration::days(days);
    d.format("%Y-%m-%d").to_string()
}

fn baseline() -> AssessmentData {
    AssessmentData::default()
}

#[test]
fn empty_assessment_is_fit() {
    let data = baseline();
    let result = grade(&data);
    assert_eq!(result.fitness_band, "fit");
    assert!(result.fired_rules.is_empty());
    assert!(result.safety_flags.is_empty());
}

#[test]
fn acute_mi_within_7_days_is_unfit() {
    let mut data = baseline();
    data.cardiovascular.recent_mi_date = iso_today_minus(3);
    let (band, fired, flags) = evaluate_fitness(&data);
    assert_eq!(band, "unfit-to-fly");
    assert!(fired.iter().any(|r| r.id == "R-CARDIAC-MI-7D"));
    assert!(flags.iter().any(|f| f.id == "F-CARDIAC-MI" && f.priority == "high"));
}

#[test]
fn mi_8_to_14_days_requires_review() {
    let mut data = baseline();
    data.cardiovascular.recent_mi_date = iso_today_minus(10);
    let (band, fired, _) = evaluate_fitness(&data);
    assert_eq!(band, "requires-review");
    assert!(fired.iter().any(|r| r.id == "R-CARDIAC-MI-14D"));
}

#[test]
fn pneumothorax_within_14_days_is_unfit() {
    let mut data = baseline();
    data.respiratory.recent_pneumothorax_date = iso_today_minus(7);
    let result = grade(&data);
    assert_eq!(result.fitness_band, "unfit-to-fly");
    assert!(result.fired_rules.iter().any(|r| r.id == "R-PULM-PNEUMOTHORAX-14D"));
    assert!(result.safety_flags.iter().any(|f| f.id == "F-PULM-PNEUMOTHORAX"));
}

#[test]
fn severe_hypoxaemia_is_unfit() {
    let mut data = baseline();
    data.respiratory.resting_spo2_percent = Some(80.0);
    let result = grade(&data);
    assert_eq!(result.fitness_band, "unfit-to-fly");
    assert!(result.fired_rules.iter().any(|r| r.id == "R-PULM-SPO2-LT-85"));
}

#[test]
fn borderline_hypoxaemia_requires_review() {
    let mut data = baseline();
    data.respiratory.resting_spo2_percent = Some(89.0);
    let result = grade(&data);
    assert_eq!(result.fitness_band, "requires-review");
    assert!(result.fired_rules.iter().any(|r| r.id == "R-PULM-SPO2-LT-92"));
}

#[test]
fn scuba_within_24h_is_unfit() {
    let mut data = baseline();
    data.recent_events.scuba_diving_within24h = "yes".to_string();
    let result = grade(&data);
    assert_eq!(result.fitness_band, "unfit-to-fly");
    assert!(result.fired_rules.iter().any(|r| r.id == "R-SCUBA-24H"));
}

#[test]
fn singleton_pregnancy_gt_36_weeks_is_unfit() {
    let mut data = baseline();
    data.pregnancy.is_pregnant = "yes".to_string();
    data.pregnancy.gestation_weeks = Some(38);
    data.pregnancy.pregnancy_type = "singleton".to_string();
    let result = grade(&data);
    assert_eq!(result.fitness_band, "unfit-to-fly");
    assert!(result.fired_rules.iter().any(|r| r.id == "R-PREG-SINGLETON-GT-36"));
}

#[test]
fn singleton_pregnancy_28_36_weeks_requires_review() {
    let mut data = baseline();
    data.pregnancy.is_pregnant = "yes".to_string();
    data.pregnancy.gestation_weeks = Some(30);
    data.pregnancy.pregnancy_type = "singleton".to_string();
    let result = grade(&data);
    assert_eq!(result.fitness_band, "requires-review");
    assert!(result.fired_rules.iter().any(|r| r.id == "R-PREG-SINGLETON-28-36"));
}

#[test]
fn multiple_pregnancy_gt_32_weeks_is_unfit() {
    let mut data = baseline();
    data.pregnancy.is_pregnant = "yes".to_string();
    data.pregnancy.gestation_weeks = Some(34);
    data.pregnancy.pregnancy_type = "twins".to_string();
    let result = grade(&data);
    assert_eq!(result.fitness_band, "unfit-to-fly");
    assert!(result.fired_rules.iter().any(|r| r.id == "R-PREG-MULTIPLE-GT-32"));
}

#[test]
fn severe_anaemia_is_unfit() {
    let mut data = baseline();
    data.medications.haemoglobin_g_per_l = Some(70);
    let result = grade(&data);
    assert_eq!(result.fitness_band, "unfit-to-fly");
    assert!(result.fired_rules.iter().any(|r| r.id == "R-ANAEMIA-SEVERE"));
}

#[test]
fn oxygen_high_flow_requires_review() {
    let mut data = baseline();
    data.inflight_needs.requires_supplemental_oxygen = "yes".to_string();
    data.inflight_needs.oxygen_flow_rate_lpm = Some(5.0);
    let result = grade(&data);
    assert_eq!(result.fitness_band, "requires-review");
    assert!(result.fired_rules.iter().any(|r| r.id == "R-O2-GT-4LPM"));
    assert!(result.safety_flags.iter().any(|f| f.id == "F-O2-HIGH-FLOW"));
}

#[test]
fn oxygen_low_flow_is_fit_with_conditions() {
    let mut data = baseline();
    data.inflight_needs.requires_supplemental_oxygen = "yes".to_string();
    data.inflight_needs.oxygen_flow_rate_lpm = Some(2.0);
    let result = grade(&data);
    assert_eq!(result.fitness_band, "fit-with-conditions");
    assert!(result.fired_rules.iter().any(|r| r.id == "R-O2-LOW-FLOW"));
}

#[test]
fn worst_band_wins() {
    let mut data = baseline();
    // Low band: POC requested
    data.inflight_needs.requires_poc = "yes".to_string();
    // Higher band: communicable infectious
    data.communicable.communicable_disease_status = "infectious".to_string();
    let result = grade(&data);
    assert_eq!(result.fitness_band, "unfit-to-fly");
}

#[test]
fn rule_ids_are_unique() {
    use medical_information_form_for_air_travel_tera_crate::engine::fitness_rules::RULE_IDS;
    let mut ids: Vec<&str> = RULE_IDS.to_vec();
    ids.sort();
    let len_before = ids.len();
    ids.dedup();
    assert_eq!(ids.len(), len_before, "rule IDs must be unique");
}

#[test]
fn flag_ids_are_unique() {
    use medical_information_form_for_air_travel_tera_crate::engine::flagged_issues::FLAG_IDS;
    let mut ids: Vec<&str> = FLAG_IDS.to_vec();
    ids.sort();
    let len_before = ids.len();
    ids.dedup();
    assert_eq!(ids.len(), len_before, "flag IDs must be unique");
}
