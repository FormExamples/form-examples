//! Compliance and wellbeing flag detection, independent of the four axes.
//!
//! Ported from `front-end-with-svelte/src/lib/engine/flagged-issues.ts`. Flag
//! categories mirror
//! `sql/07_create_table_neurodiversity_adjustment_request_grade_flag.sql`.
//! Flags are returned sorted high → medium → low priority.

use super::types::{Flag, NeurodiversityAdjustmentRequest};
use super::utils::{any_adjustment, any_difficulty};

fn flag(
    flag_id: &str,
    category: &str,
    priority: &str,
    description: &str,
    suggested_action: &str,
) -> Flag {
    Flag {
        flag_id: flag_id.to_string(),
        category: category.to_string(),
        priority: priority.to_string(),
        description: description.to_string(),
        suggested_action: suggested_action.to_string(),
    }
}

fn priority_order(priority: &str) -> u8 {
    match priority {
        "high" => 0,
        "medium" => 1,
        "low" => 2,
        _ => 3,
    }
}

/// Detect compliance / wellbeing flags independently of the four axes, returned
/// sorted high → medium → low priority. `eligibility_band` and `impact_band` are
/// the already-computed Axis A and Axis B bands (some flags depend on them).
#[must_use]
pub fn detect_flags(
    r: &NeurodiversityAdjustmentRequest,
    eligibility_band: &str,
    impact_band: &str,
) -> Vec<Flag> {
    let mut flags: Vec<Flag> = Vec::new();

    // ─── disability-duty-engaged ───
    if eligibility_band == "likely-covered" {
        flags.push(flag(
            "F-DISABILITY-DUTY-001",
            "disability-duty-engaged",
            "high",
            "The Equality Act 2010 duty to make reasonable adjustments is likely engaged.",
            "Treat as a formal request; arrange a meeting and respond without unreasonable delay.",
        ));
    }

    // ─── burnout-risk ───
    if r.at_risk_of_absence {
        flags.push(flag(
            "F-BURNOUT-RISK-001",
            "burnout-risk",
            "high",
            "Worker at risk of sickness absence or burnout.",
            "Prioritise; consider interim adjustments now.",
        ));
    } else if r.current_impact == "severe" || r.difficulty_burnout_wellbeing {
        flags.push(flag(
            "F-BURNOUT-RISK-001",
            "burnout-risk",
            "medium",
            "Fatigue / burnout or severe impact reported.",
            "Monitor wellbeing; consider adjustments promptly.",
        ));
    }

    // ─── no-consent-to-share ───
    if !r.disclosure_consent {
        flags.push(flag(
            "F-NO-CONSENT-001",
            "no-consent-to-share",
            "medium",
            "Worker has not consented to share details with HR / occupational health.",
            "Handle sensitively; seek explicit consent before sharing.",
        ));
    }

    // ─── missing-adjustments ───
    if !any_adjustment(r) && r.adjustments_requested_detail.trim().is_empty() {
        flags.push(flag(
            "F-MISSING-ADJUSTMENTS-001",
            "missing-adjustments",
            "medium",
            "No specific adjustments requested.",
            "Ask the worker what adjustments would help, or explore options together.",
        ));
    }

    // ─── missing-difficulties ───
    if !any_difficulty(r) {
        flags.push(flag(
            "F-MISSING-DIFFICULTIES-001",
            "missing-difficulties",
            "medium",
            "No functional difficulties identified.",
            "Clarify the tasks and situations where the worker is disadvantaged.",
        ));
    }

    // ─── access-to-work-recommended ───
    if r.adjustment_equipment_technology && !r.access_to_work_involved {
        flags.push(flag(
            "F-ACCESS-TO-WORK-001",
            "access-to-work-recommended",
            "low",
            "Equipment / technology adjustment requested without Access to Work involvement.",
            "Signpost the government Access to Work scheme for funding and assessment.",
        ));
    }

    // ─── occupational-health-recommended ───
    if impact_band == "high-risk" && !r.occupational_health_involved {
        flags.push(flag(
            "F-OCC-HEALTH-001",
            "occupational-health-recommended",
            "medium",
            "High wellbeing risk without occupational-health input.",
            "Consider an occupational-health referral to identify and confirm adjustments.",
        ));
    }

    // Sort: high > medium > low (stable sort preserves insertion order within a band).
    flags.sort_by_key(|f| priority_order(&f.priority));

    flags
}
