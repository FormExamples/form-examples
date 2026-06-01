use super::flagged_issues::detect_additional_flags;
use super::priority_targets::{days_between, today_iso};
use super::types::{Card, GradingResult};
use super::waiting_time_rules::calculate_waiting_time;

/// Calculate the full Waiting Time Status for a card.
///
/// Combines the band classifier with the additional-flag detector and
/// the "days to next appointment" projection. Pure: no side effects, no
/// I/O.
pub fn calculate_waiting_time_status(card: &Card, today_iso_override: Option<&str>) -> GradingResult {
    let today = today_iso_override
        .map(str::to_string)
        .unwrap_or_else(today_iso);
    let wt = calculate_waiting_time(card, &today);
    let additional_flags = detect_additional_flags(card, &today);
    let days_to_appointment = days_between(&today, &card.appointment.appointment_date);

    GradingResult {
        waiting_time_status: wt.band,
        clinical_priority: card.waiting_list.clinical_priority.clone(),
        target_wait_weeks: wt.target_wait_weeks,
        days_waited: wt.days_waited,
        weeks_waited: wt.weeks_waited,
        days_to_target: wt.days_to_target,
        days_to_breach: wt.days_to_breach,
        days_to_appointment,
        fired_rules: wt.fired_rules,
        additional_flags,
        grader_notes: String::new(),
        timestamp: chrono::Utc::now().to_rfc3339(),
    }
}
