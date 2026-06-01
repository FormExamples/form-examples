use chrono::{Duration, NaiveDate};
use medical_waiting_list_card_tera_crate::engine::flagged_issues::detect_additional_flags;
use medical_waiting_list_card_tera_crate::engine::types::*;

fn iso(d: NaiveDate) -> String {
    d.format("%Y-%m-%d").to_string()
}

fn today() -> NaiveDate {
    NaiveDate::from_ymd_opt(2026, 6, 1).unwrap()
}

fn baseline_card() -> Card {
    Card {
        patient: Patient {
            name: "Jane Roe".to_string(),
            email: "jane.roe@example.org".to_string(),
            phone: "020 7946 0100".to_string(),
            postal_address_as_full_text: "1 Example Street, London".to_string(),
            ..Default::default()
        },
        referral: Referral {
            suspected_cancer: "no".to_string(),
            ..Default::default()
        },
        waiting_list: WaitingList {
            clinical_priority: "P4".to_string(),
            rtt_clock_start_date: iso(today() - Duration::days(10)),
            ..Default::default()
        },
        appointment: Appointment {
            appointment_date: iso(today() + Duration::days(21)),
            ..Default::default()
        },
        ..Default::default()
    }
}

#[test]
fn baseline_card_has_no_flags() {
    let card = baseline_card();
    let flags = detect_additional_flags(&card, &iso(today()));
    assert!(flags.is_empty(), "baseline card should be flag-free");
}

#[test]
fn flags_long_waiter_past_52_weeks() {
    let mut card = baseline_card();
    card.waiting_list.rtt_clock_start_date = iso(today() - Duration::days(400));
    let flags = detect_additional_flags(&card, &iso(today()));
    assert!(flags.iter().any(|f| f.flag_id == "F-LONG-WAITER-001"));
}

#[test]
fn flags_p1_without_appointment_within_seven_days() {
    let mut card = baseline_card();
    card.waiting_list.clinical_priority = "P1a".to_string();
    card.appointment.appointment_date = iso(today() + Duration::days(10));
    let flags = detect_additional_flags(&card, &iso(today()));
    assert!(flags.iter().any(|f| f.flag_id == "F-P1-ESCALATION-001"));
}

#[test]
fn flags_suspected_cancer_outside_two_week_wait() {
    let mut card = baseline_card();
    card.referral.suspected_cancer = "yes".to_string();
    card.appointment.appointment_date = iso(today() + Duration::days(20));
    let flags = detect_additional_flags(&card, &iso(today()));
    assert!(flags.iter().any(|f| f.flag_id == "F-2WW-CANCER-001"));
}

#[test]
fn flags_missing_appointment_after_clock_start() {
    let mut card = baseline_card();
    card.appointment.appointment_date = String::new();
    card.waiting_list.rtt_clock_start_date = iso(today() - Duration::days(20));
    let flags = detect_additional_flags(&card, &iso(today()));
    assert!(flags.iter().any(|f| f.flag_id == "F-MISSING-APPT-001"));
}

#[test]
fn flags_interpreter_required_without_access_notes() {
    let mut card = baseline_card();
    card.patient.interpreter_required = "yes".to_string();
    card.appointment.access_notes = String::new();
    let flags = detect_additional_flags(&card, &iso(today()));
    assert!(flags.iter().any(|f| f.flag_id == "F-INTERPRETER-001"));
}

#[test]
fn flags_accessibility_need_without_confirmation() {
    let mut card = baseline_card();
    card.patient.accessibility_needs = "Step-free access required".to_string();
    card.appointment.access_notes = String::new();
    let flags = detect_additional_flags(&card, &iso(today()));
    assert!(flags.iter().any(|f| f.flag_id == "F-ACCESS-UNMET-001"));
}

#[test]
fn flags_missing_contact_details() {
    let mut card = baseline_card();
    card.patient.email = String::new();
    card.patient.phone = String::new();
    card.patient.postal_address_as_full_text = String::new();
    let flags = detect_additional_flags(&card, &iso(today()));
    assert!(flags.iter().any(|f| f.flag_id == "F-NO-CONTACT-001"));
}

#[test]
fn flags_sort_by_priority_high_first() {
    let mut card = baseline_card();
    // Add a high priority flag (long-waiter), a medium (missing
    // appointment), and a low (no contact details).
    card.waiting_list.rtt_clock_start_date = iso(today() - Duration::days(400));
    card.appointment.appointment_date = String::new();
    card.patient.email = String::new();
    card.patient.phone = String::new();
    card.patient.postal_address_as_full_text = String::new();
    let flags = detect_additional_flags(&card, &iso(today()));
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
