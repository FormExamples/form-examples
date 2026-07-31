//! Safety flags (spec §6).
//!
//! Flags fire independently of BOTH grades: a note can be Complete and still
//! raise a high-priority flag, and an Incomplete note is not automatically
//! unsafe. Flags are never suppressed — a low-priority flag is still rendered.
//! The engine does not decide whether a clinical action was appropriate; it
//! records whether an action the guidance implies was DOCUMENTED.

use super::types::{AcuityBand, FlagPriority, FlaggedIssue, InpatientClinicalNote};

fn flag(
    id: &str,
    category: &str,
    priority: FlagPriority,
    description: String,
    suggested_action: &str,
) -> FlaggedIssue {
    FlaggedIssue {
        id: id.to_owned(),
        category: category.to_owned(),
        priority,
        description,
        suggested_action: suggested_action.to_owned(),
    }
}

/// Length of stay in whole days, or `None` when either timestamp is missing or
/// unparseable.
#[must_use]
pub fn length_of_stay_days(note: &InpatientClinicalNote) -> Option<i64> {
    if note.admission_at.is_empty() || note.note_at.is_empty() {
        return None;
    }
    let parse = |s: &str| {
        chrono::DateTime::parse_from_rfc3339(s)
            .map(|d| d.naive_utc())
            .or_else(|_| chrono::NaiveDateTime::parse_from_str(s, "%Y-%m-%dT%H:%M"))
            .or_else(|_| chrono::NaiveDateTime::parse_from_str(s, "%Y-%m-%dT%H:%M:%S"))
            .ok()
    };
    let a = parse(&note.admission_at)?;
    let n = parse(&note.note_at)?;
    if n < a {
        return None;
    }
    Some((n - a).num_days())
}

/// Detect every safety flag for a note.
#[must_use]
pub fn detect_flagged_issues(
    note: &InpatientClinicalNote,
    acuity_band: AcuityBand,
    documented_required: usize,
    total_required: usize,
) -> Vec<FlaggedIssue> {
    let mut flags = Vec::new();
    let escalating = acuity_band >= AcuityBand::Escalate;

    if escalating && note.escalation_action.trim().is_empty() {
        flags.push(flag(
            "F-DETERIORATING-NO-ESCALATION-001",
            "deteriorating-news2-no-escalation",
            FlagPriority::High,
            format!("The acuity band is {acuity_band:?}, but no escalation action is recorded on this note."),
            "Escalate to the senior on call or the critical-care outreach team, and record the action taken.",
        ));
    }

    if note.sepsis_screen == "positive" {
        let antimicrobial_started = note
            .medications
            .iter()
            .any(|m| m.is_antimicrobial == "yes" && (m.action == "started" || m.action == "switched"));
        if !antimicrobial_started && note.escalation_action.trim().is_empty() {
            flags.push(flag(
                "F-SEPSIS-NO-ACTION-001",
                "sepsis-screen-positive-no-action",
                FlagPriority::High,
                "The sepsis screen is positive, but neither an antimicrobial change nor an escalation action is recorded.".to_owned(),
                "Start the sepsis pathway: senior review, cultures, antimicrobials, fluids, and lactate. Record what was done.",
            ));
        }
    }

    if note.vte_status == "not-done" {
        flags.push(flag(
            "F-VTE-NOT-ASSESSED-001",
            "vte-not-assessed",
            FlagPriority::High,
            "The VTE risk assessment has not been done. NICE NG89 requires one for every inpatient."
                .to_owned(),
            "Complete the VTE risk assessment and prescribe or document prophylaxis.",
        ));
    }

    let unactioned: Vec<&str> = note
        .investigations
        .iter()
        .filter(|r| r.abnormal == "yes" && r.actioned != "yes")
        .map(|r| r.test_name.as_str())
        .collect();
    if !unactioned.is_empty() {
        let named: Vec<&str> = unactioned.iter().copied().filter(|n| !n.is_empty()).collect();
        let description = if named.is_empty() {
            format!(
                "{} abnormal result(s) recorded without an action.",
                unactioned.len()
            )
        } else {
            format!(
                "{} abnormal result(s) not actioned: {}.",
                unactioned.len(),
                named.join(", ")
            )
        };
        flags.push(flag(
            "F-ABNORMAL-NOT-ACTIONED-001",
            "abnormal-result-not-actioned",
            FlagPriority::High,
            description,
            "Review each abnormal result, act on it, and record the action taken.",
        ));
    }

    if note.plan.trim().is_empty() && note.job_count == 0 {
        flags.push(flag(
            "F-NO-PLAN-001",
            "no-plan-documented",
            FlagPriority::High,
            "No plan and no jobs are recorded on this note.".to_owned(),
            "Record the management plan and the outstanding jobs, so the next clinician can safely continue care.",
        ));
    }

    if !note.medications.is_empty() && note.allergy_checked != "yes" {
        flags.push(flag(
            "F-ALLERGY-NOT-CHECKED-001",
            "allergy-not-checked",
            FlagPriority::High,
            "Medication changes are recorded, but the allergy status was not confirmed as checked."
                .to_owned(),
            "Check and record the allergy status before prescribing.",
        ));
    }

    if (escalating || !note.ceiling_of_care.trim().is_empty())
        && note.senior_review_by.trim().is_empty()
    {
        let description = if escalating {
            format!("The acuity band is {acuity_band:?}, but no senior reviewer is named.")
        } else {
            "A ceiling-of-care decision is recorded, but no senior reviewer is named.".to_owned()
        };
        flags.push(flag(
            "F-NO-SENIOR-REVIEW-001",
            "no-senior-review",
            FlagPriority::Medium,
            description,
            "Name the senior who reviewed the patient, or arrange a senior review and record it.",
        ));
    }

    if !note.escalation_status.trim().is_empty() && note.ceiling_of_care.trim().is_empty() {
        flags.push(flag(
            "F-CEILING-UNDOCUMENTED-001",
            "ceiling-of-care-undocumented",
            FlagPriority::Medium,
            "An escalation status is recorded without a corresponding ceiling of care.".to_owned(),
            "Record the agreed ceiling of care, so the out-of-hours team knows the limits of treatment.",
        ));
    }

    if note.antimicrobial_review_status == "overdue" {
        flags.push(flag(
            "F-ANTIMICROBIAL-OVERDUE-001",
            "antimicrobial-review-overdue",
            FlagPriority::Medium,
            "An antimicrobial is in use past its review date (NICE NG15 antimicrobial stewardship)."
                .to_owned(),
            "Review the antimicrobial: stop, switch to oral, or document the reason for continuing and a new review date.",
        ));
    }

    let capacity_dependent =
        note.consent_status == "lacks-capacity" || note.consent_status == "best-interests";
    if capacity_dependent && note.capacity_assessed != "yes" {
        flags.push(flag(
            "F-NO-CAPACITY-ASSESSMENT-001",
            "no-capacity-assessment",
            FlagPriority::Medium,
            "A capacity-dependent decision is recorded without a documented capacity assessment."
                .to_owned(),
            "Carry out and record a mental-capacity assessment under the Mental Capacity Act 2005.",
        ));
    }

    if let Some(los) = length_of_stay_days(note) {
        if los > 7 && note.estimated_discharge_date.trim().is_empty() {
            flags.push(flag(
                "F-LONG-STAY-NO-EDD-001",
                "long-stay-no-discharge-plan",
                FlagPriority::Low,
                format!("Length of stay is {los} days with no estimated discharge date recorded."),
                "Set an estimated date of discharge and record the outstanding blockers to it.",
            ));
        }
    }

    if documented_required < total_required {
        let missing = total_required - documented_required;
        flags.push(flag(
            "F-INCOMPLETE-ENTRY-001",
            "incomplete-entry",
            FlagPriority::Low,
            format!("{missing} of {total_required} required components for this note type are not documented."),
            "Complete the missing components before signing the entry.",
        ));
    }

    flags
}
