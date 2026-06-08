//! Detection of additional flagged issues.

use super::priority_targets::{days_between, LONG_WAIT_WEEKS};
use super::types::{AdditionalFlag, Card};

const TWO_WEEK_WAIT_DAYS: i64 = 14;
const PRIORITY_1_DAYS: i64 = 7;
const MISSING_APPOINTMENT_DAYS: i64 = 14;

/// Operational and safety flags for a Medical Waiting List Card.
///
/// Flags are computed independently of the Waiting Time Status band.
/// Priority: high → medium → low. The returned vector is sorted by
/// priority.
pub fn detect_additional_flags(card: &Card, today_iso: &str) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();
    let wl = &card.waiting_list;
    let appt = &card.appointment;
    let r = &card.referral;
    let pt = &card.patient;

    let days_waited = days_between(&wl.rtt_clock_start_date, today_iso);
    let days_to_appointment = days_between(today_iso, &appt.appointment_date);

    // ─── HIGH: 52-week long waiter ─────────────────────────────
    if let Some(d) = days_waited {
        if d > (LONG_WAIT_WEEKS as i64) * 7 {
            flags.push(AdditionalFlag {
                flag_id: "F-LONG-WAITER-001".to_string(),
                category: "long-waiter-52-week".to_string(),
                priority: "high".to_string(),
                description: format!(
                    "Patient has waited more than {} weeks. Mandatory long-waiter review required.",
                    LONG_WAIT_WEEKS as i64
                ),
                suggested_action:
                    "Trigger long-waiter harm-review process and contact the patient.".to_string(),
            });
        }
    }

    // ─── HIGH: Priority-1 escalation ───────────────────────────
    let is_p1 = wl.clinical_priority == "P1a" || wl.clinical_priority == "P1b";
    let p1_no_appt = match days_to_appointment {
        None => true,
        Some(d) => d > PRIORITY_1_DAYS,
    };
    if is_p1 && p1_no_appt {
        flags.push(AdditionalFlag {
            flag_id: "F-P1-ESCALATION-001".to_string(),
            category: "priority-1-escalation".to_string(),
            priority: "high".to_string(),
            description: format!(
                "Priority-1 patient ({}) has no appointment within {} days.",
                wl.clinical_priority, PRIORITY_1_DAYS
            ),
            suggested_action: "Escalate to the on-call consultant and booking lead immediately."
                .to_string(),
        });
    }

    // ─── HIGH: Suspected cancer outside 2-week wait ────────────
    let cancer_no_appt = match days_to_appointment {
        None => true,
        Some(d) => d > TWO_WEEK_WAIT_DAYS,
    };
    if r.suspected_cancer == "yes" && cancer_no_appt {
        flags.push(AdditionalFlag {
            flag_id: "F-2WW-CANCER-001".to_string(),
            category: "two-week-wait-cancer".to_string(),
            priority: "high".to_string(),
            description: format!(
                "Suspected-cancer referral has no appointment within {} days.",
                TWO_WEEK_WAIT_DAYS
            ),
            suggested_action:
                "Book a two-week-wait clinic slot or escalate to cancer pathway navigator."
                    .to_string(),
        });
    }

    // ─── MEDIUM: Missing appointment > 14 days after clock start ─
    if appt.appointment_date.is_empty() {
        if let Some(d) = days_waited {
            if d > MISSING_APPOINTMENT_DAYS {
                flags.push(AdditionalFlag {
                    flag_id: "F-MISSING-APPT-001".to_string(),
                    category: "missing-appointment".to_string(),
                    priority: "medium".to_string(),
                    description: format!(
                        "No appointment scheduled more than {} days after RTT clock-start.",
                        MISSING_APPOINTMENT_DAYS
                    ),
                    suggested_action: "Contact the patient and book the next appropriate appointment."
                        .to_string(),
                });
            }
        }
    }

    // ─── MEDIUM: Interpreter required but no booking recorded ───
    if pt.interpreter_required == "yes" && appt.access_notes.trim().is_empty() {
        flags.push(AdditionalFlag {
            flag_id: "F-INTERPRETER-001".to_string(),
            category: "interpreter-required".to_string(),
            priority: "medium".to_string(),
            description:
                "Patient requires an interpreter but no booking is recorded in the appointment access notes."
                    .to_string(),
            suggested_action:
                "Book the interpreter and record the booking reference in the appointment access notes."
                    .to_string(),
        });
    }

    // ─── MEDIUM: Accessibility need not confirmed ──────────────
    if !pt.accessibility_needs.trim().is_empty()
        && !appt.appointment_date.is_empty()
        && appt.access_notes.trim().is_empty()
    {
        flags.push(AdditionalFlag {
            flag_id: "F-ACCESS-UNMET-001".to_string(),
            category: "accessibility-unmet".to_string(),
            priority: "medium".to_string(),
            description:
                "Patient has recorded accessibility needs but the appointment access notes are empty."
                    .to_string(),
            suggested_action:
                "Confirm the appointment location meets the recorded accessibility needs and document in access notes."
                    .to_string(),
        });
    }

    // ─── LOW: No contact details on file ───────────────────────
    let has_contact = !pt.email.trim().is_empty()
        || !pt.phone.trim().is_empty()
        || !pt.postal_address_as_full_text.trim().is_empty();
    if !has_contact {
        flags.push(AdditionalFlag {
            flag_id: "F-NO-CONTACT-001".to_string(),
            category: "contact-details-missing".to_string(),
            priority: "low".to_string(),
            description: "No email, phone, or postal address recorded for the patient.".to_string(),
            suggested_action: "Contact the patient or GP practice to confirm at least one channel."
                .to_string(),
        });
    }

    flags.sort_by_key(|f| match f.priority.as_str() {
        "high" => 0,
        "medium" => 1,
        "low" => 2,
        _ => 3,
    });

    flags
}
