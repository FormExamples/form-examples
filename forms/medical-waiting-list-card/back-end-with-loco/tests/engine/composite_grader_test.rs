use chrono::{Duration, NaiveDate};
use medical_waiting_list_card_loco_crate::engine::composite_grader::calculate_waiting_time_status;
use medical_waiting_list_card_loco_crate::engine::priority_targets::target_wait_weeks;
use medical_waiting_list_card_loco_crate::engine::types::*;
use medical_waiting_list_card_loco_crate::engine::waiting_time_rules::calculate_waiting_time;

fn iso(d: NaiveDate) -> String {
    d.format("%Y-%m-%d").to_string()
}

fn today() -> NaiveDate {
    NaiveDate::from_ymd_opt(2026, 6, 1).unwrap()
}

fn card_with(priority: &str, days_ago: i64) -> Card {
    Card {
        waiting_list: WaitingList {
            specialty: "cardiology".to_string(),
            procedure_description: "Outpatient cardiology review".to_string(),
            clinical_priority: priority.to_string(),
            rtt_clock_start_date: iso(today() - Duration::days(days_ago)),
            ..Default::default()
        },
        ..Default::default()
    }
}

#[test]
fn empty_card_returns_blank_band() {
    let card = Card::default();
    let r = calculate_waiting_time(&card, &iso(today()));
    assert_eq!(r.band, "");
    assert!(r.fired_rules.is_empty());
}

#[test]
fn within_target_for_recent_p4_referral() {
    let card = card_with("P4", 10);
    let r = calculate_waiting_time(&card, &iso(today()));
    assert_eq!(r.band, "within-target");
    assert!(r.fired_rules.iter().any(|rule| rule.rule_id == "R-WTS-WITHIN-001"));
}

#[test]
fn approaching_breach_within_4_weeks_of_rtt() {
    // 18 weeks = 126 days; approaching at <= 28 days remaining ⇒ ≥ 98
    // days waited.
    let card = card_with("P4", 100);
    let r = calculate_waiting_time(&card, &iso(today()));
    assert_eq!(r.band, "approaching-breach");
    assert!(r.fired_rules.iter().any(|rule| rule.rule_id == "R-WTS-APPROACH-001"));
}

#[test]
fn breached_when_past_priority_target() {
    // P2 target is 4 weeks = 28 days; 35 days waited ⇒ past target.
    let card = card_with("P2", 35);
    let r = calculate_waiting_time(&card, &iso(today()));
    assert_eq!(r.band, "breached");
    assert!(r.fired_rules.iter().any(|rule| rule.rule_id == "R-WTS-TARGET-001"));
}

#[test]
fn breached_when_past_18_week_rtt_standard() {
    // 18 weeks = 126 days. 150 days exceeds RTT but not yet long wait.
    let card = card_with("P5", 150);
    let r = calculate_waiting_time(&card, &iso(today()));
    assert_eq!(r.band, "breached");
    assert!(r.fired_rules.iter().any(|rule| rule.rule_id == "R-WTS-RTT-001"));
}

#[test]
fn long_wait_when_more_than_52_weeks() {
    // 52 weeks = 364 days. 400 days ⇒ long wait.
    let card = card_with("P3", 400);
    let r = calculate_waiting_time(&card, &iso(today()));
    assert_eq!(r.band, "long-wait");
    assert!(r.fired_rules.iter().any(|rule| rule.rule_id == "R-LW-52WK-001"));
}

#[test]
fn p6_short_circuits_to_within_target() {
    let card = card_with("P6", 200);
    let r = calculate_waiting_time(&card, &iso(today()));
    assert_eq!(r.band, "within-target");
    assert_eq!(r.target_wait_weeks, None);
    assert!(r.fired_rules.iter().any(|rule| rule.rule_id == "R-WTS-P6-001"));
}

#[test]
fn composite_grader_emits_days_to_appointment() {
    let mut card = card_with("P4", 10);
    card.appointment.appointment_date = iso(today() + Duration::days(14));
    let g = calculate_waiting_time_status(&card, Some(&iso(today())));
    assert_eq!(g.days_to_appointment, Some(14));
    assert_eq!(g.waiting_time_status, "within-target");
}

#[test]
fn priority_target_weeks_match_nhs_framework() {
    assert_eq!(target_wait_weeks("P2"), Some(4.0));
    assert_eq!(target_wait_weeks("P3"), Some(12.0));
    assert_eq!(target_wait_weeks("P4"), Some(18.0));
    assert_eq!(target_wait_weeks("P5"), Some(26.0));
    assert_eq!(target_wait_weeks("P6"), None);
    assert_eq!(target_wait_weeks(""), None);
}

#[test]
fn grader_preserves_clinical_priority_in_result() {
    let card = card_with("P3", 30);
    let g = calculate_waiting_time_status(&card, Some(&iso(today())));
    assert_eq!(g.clinical_priority, "P3");
}
