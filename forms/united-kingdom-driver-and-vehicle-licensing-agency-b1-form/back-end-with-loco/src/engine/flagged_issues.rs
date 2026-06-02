//! Detects clinically significant or DVLA-significant issues in a B1 form
//! submission. These are independent of pure completeness — for example, the
//! patient may have left a Yes/No unanswered (which the validator already
//! handles), or they may have answered Yes to a high-risk item that requires
//! urgent clinician escalation regardless of completeness.
//!
//! Priorities (urgent → high → medium → low) drive sort order in the report.

use crate::engine::b1_rules::epilepsy_declaration_required;
use crate::engine::types::{AssessmentData, FlagPriority, FlaggedIssue};

pub fn detect_flagged_issues(data: &AssessmentData) -> Vec<FlaggedIssue> {
    let mut flags: Vec<FlaggedIssue> = Vec::new();

    // ─── Epilepsy declaration (urgent if missing) ─────────────
    if epilepsy_declaration_required(data) {
        let decl = &data.seizures.epilepsy_declaration;
        if !decl.declaration_accepted
            || decl.signed_name.trim().is_empty()
            || decl.signature_date.trim().is_empty()
        {
            flags.push(FlaggedIssue {
                id: "FLAG-EPI-001".into(),
                category: "Epilepsy Declaration".into(),
                message:
                    "Epilepsy declaration is required (epilepsy or more than one seizure declared) but is not fully signed."
                        .into(),
                priority: FlagPriority::Urgent,
            });
        }
    }

    // ─── Authorisation (urgent if not accepted) ───────────────
    if !data.authorisation.declaration_accepted {
        flags.push(FlaggedIssue {
            id: "FLAG-AUTH-001".into(),
            category: "Authorisation".into(),
            message:
                "Applicant has not accepted the medical disclosure authorisation - DVLA cannot process the form without it."
                    .into(),
            priority: FlagPriority::Urgent,
        });
    }

    // ─── Driving safety: drowsy medication (high) ─────────────
    if data.medication.makes_drowsy_or_confused == "yes" {
        flags.push(FlaggedIssue {
            id: "FLAG-MED-001".into(),
            category: "Medication".into(),
            message:
                "Patient reports current medication causes drowsiness or confusion when driving."
                    .into(),
            priority: FlagPriority::High,
        });
    }

    // ─── Seizures affecting consciousness (high) ──────────────
    if data.seizures.had_seizures == "yes"
        && data.seizures.diagnosis == "more-than-one-or-epilepsy"
        && data.seizures.multiple.affected_consciousness == "yes"
    {
        flags.push(FlaggedIssue {
            id: "FLAG-SEIZ-001".into(),
            category: "Seizures".into(),
            message: "Seizures have affected level of consciousness.".into(),
            priority: FlagPriority::High,
        });
    }

    // ─── Seizures affecting vehicle control (high) ────────────
    if data.seizures.had_seizures == "yes"
        && data.seizures.diagnosis == "more-than-one-or-epilepsy"
        && data.seizures.multiple.would_have_affected_driving == "yes"
    {
        flags.push(FlaggedIssue {
            id: "FLAG-SEIZ-002".into(),
            category: "Seizures".into(),
            message: "Seizures would have caused difficulty controlling a vehicle.".into(),
            priority: FlagPriority::High,
        });
    }

    // ─── Two or more seizures within 5 years (high) ───────────
    if data.seizures.had_seizures == "yes"
        && data.seizures.multiple.two_or_more_within_five_years == "yes"
    {
        flags.push(FlaggedIssue {
            id: "FLAG-SEIZ-003".into(),
            category: "Seizures".into(),
            message: "Two or more seizures within a 5-year period reported.".into(),
            priority: FlagPriority::High,
        });
    }

    // ─── Uncontrolled double vision (high) ────────────────────
    if data.double_vision.has_double_vision == "yes"
        && data.double_vision.suppressed_or_controlled == "no"
    {
        flags.push(FlaggedIssue {
            id: "FLAG-DIPL-001".into(),
            category: "Double Vision".into(),
            message: "Double vision (diplopia) reported and not suppressed or controlled.".into(),
            priority: FlagPriority::High,
        });
    }

    // ─── Eyesight problems (medium) ───────────────────────────
    if data.eyesight.has_eyesight_problems == "yes" {
        flags.push(FlaggedIssue {
            id: "FLAG-EYE-001".into(),
            category: "Eyesight".into(),
            message: "Eyesight problems caused by the condition reported.".into(),
            priority: FlagPriority::Medium,
        });
    }

    // ─── Blackouts (medium) ───────────────────────────────────
    if data.blackouts.had_blackouts == "yes" {
        flags.push(FlaggedIssue {
            id: "FLAG-BLK-001".into(),
            category: "Blackouts".into(),
            message: "History of blackouts or altered consciousness reported.".into(),
            priority: FlagPriority::Medium,
        });
    }

    // ─── VP shunt (medium) ────────────────────────────────────
    if data.vp_shunt.had_vp_shunt_or_drain == "yes" {
        flags.push(FlaggedIssue {
            id: "FLAG-VPS-001".into(),
            category: "VP Shunt".into(),
            message: "VP shunt or external ventricular drain reported.".into(),
            priority: FlagPriority::Medium,
        });
    }

    // ─── Daily-living assistance (medium) ─────────────────────
    if data.daily_living.needs_help == "yes" {
        flags.push(FlaggedIssue {
            id: "FLAG-DL-001".into(),
            category: "Daily Living".into(),
            message: "Patient needs help from another person with day-to-day living.".into(),
            priority: FlagPriority::Medium,
        });
    }

    // ─── Vehicle adaptations (low) ────────────────────────────
    if data.vehicle_adaptations.needs_adaptations == "yes" {
        flags.push(FlaggedIssue {
            id: "FLAG-VEH-001".into(),
            category: "Vehicle Adaptations".into(),
            message: "Patient requires special controls or automatic transmission.".into(),
            priority: FlagPriority::Low,
        });
    }

    fn order(p: FlagPriority) -> u8 {
        match p {
            FlagPriority::Urgent => 0,
            FlagPriority::High => 1,
            FlagPriority::Medium => 2,
            FlagPriority::Low => 3,
        }
    }
    flags.sort_by_key(|f| order(f.priority));
    flags
}
