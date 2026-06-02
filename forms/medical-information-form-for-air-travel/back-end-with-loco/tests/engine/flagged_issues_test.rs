use chrono::{Duration, Utc};
use medical_information_form_for_air_travel_loco_crate::engine::fitness_grader::evaluate_fitness;
use medical_information_form_for_air_travel_loco_crate::engine::types::*;

fn iso_today_minus(days: i64) -> String {
    let d = Utc::now().date_naive() - Duration::days(days);
    d.format("%Y-%m-%d").to_string()
}

#[test]
fn baseline_has_no_flags() {
    let data = AssessmentData::default();
    let (_band, _fired, flags) = evaluate_fitness(&data);
    assert!(flags.is_empty(), "baseline should not produce flags: {flags:?}");
}

#[test]
fn gas_cavity_emits_high_priority_flag() {
    let mut data = AssessmentData::default();
    data.recent_events.cabin_gas_risk = "intra-ocular-gas".to_string();
    let (_b, _r, flags) = evaluate_fitness(&data);
    assert!(flags.iter().any(|f| f.id == "F-GAS-CAVITY" && f.priority == "high"));
}

#[test]
fn dvt_within_4_weeks_emits_medium_flag() {
    let mut data = AssessmentData::default();
    data.recent_events.recent_dvt_date = iso_today_minus(14);
    let (_b, _r, flags) = evaluate_fitness(&data);
    assert!(flags.iter().any(|f| f.id == "F-DVT" && f.priority == "medium"));
}

#[test]
fn poc_emits_low_priority_flag() {
    let mut data = AssessmentData::default();
    data.inflight_needs.requires_poc = "yes".to_string();
    let (_b, _r, flags) = evaluate_fitness(&data);
    assert!(flags.iter().any(|f| f.id == "F-POC" && f.priority == "low"));
}

#[test]
fn wchc_emits_low_priority_flag() {
    let mut data = AssessmentData::default();
    data.inflight_needs.wheelchair_type = "WCHC".to_string();
    let (_b, _r, flags) = evaluate_fitness(&data);
    assert!(flags.iter().any(|f| f.id == "F-WCHC" && f.priority == "low"));
}

#[test]
fn psychiatric_clearance_emits_medium_flag() {
    let mut data = AssessmentData::default();
    data.reason.reason_psychiatric = "yes".to_string();
    let (_b, _r, flags) = evaluate_fitness(&data);
    assert!(flags.iter().any(|f| f.id == "F-PSYCH" && f.priority == "medium"));
}

#[test]
fn poc_battery_insufficient_emits_high_flag() {
    let mut data = AssessmentData::default();
    data.inflight_needs.requires_poc = "yes".to_string();
    data.inflight_needs.poc_battery_hours = Some(2.0);
    data.trip.sector_duration_minutes = Some(360); // 6h * 1.5 = 9h required
    let (_b, _r, flags) = evaluate_fitness(&data);
    assert!(flags.iter().any(|f| f.id == "F-POC-BATTERY" && f.priority == "high"));
}

#[test]
fn flags_are_sorted_by_priority() {
    let mut data = AssessmentData::default();
    // Mix priorities: low (POC), medium (psychiatric), high (gas cavity).
    data.inflight_needs.requires_poc = "yes".to_string();
    data.reason.reason_psychiatric = "yes".to_string();
    data.recent_events.cabin_gas_risk = "intra-abdominal-gas".to_string();
    let (_b, _r, flags) = evaluate_fitness(&data);
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
