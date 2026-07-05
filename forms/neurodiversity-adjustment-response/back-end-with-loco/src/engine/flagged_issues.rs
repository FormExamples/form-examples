//! Compliance / risk flag detection, independent of the four axes.
//!
//! Flag categories mirror
//! `sql/07_create_table_neurodiversity_adjustment_response_grade_flag.sql`.
//! Flags are returned sorted high → medium → low priority. The
//! `discrimination-risk` flag (`F-DISCRIMINATION-RISK-001`) is the highest-
//! priority signal of a failure-to-make-reasonable-adjustments claim and is
//! raised whenever the legal-risk axis reaches `high-risk`.

use super::types::{Flag, LegalRiskBand, NeurodiversityAdjustmentResponse};
use super::utils::{any_agreed, whole_days_between};

fn priority_order(priority: &str) -> u8 {
    match priority {
        "high" => 0,
        "medium" => 1,
        _ => 2,
    }
}

/// Detect compliance / risk flags for a response, given the already-computed
/// legal-risk band and completeness percent.
#[must_use]
pub fn detect_flags(
    r: &NeurodiversityAdjustmentResponse,
    legal_risk_band: &LegalRiskBand,
    completeness_percent: i32,
) -> Vec<Flag> {
    let mut flags: Vec<Flag> = Vec::new();

    // ─── discrimination-risk (auto-raised with a high-risk legal band) ───
    if legal_risk_band == "high-risk" {
        flags.push(Flag {
            flag_id: "F-DISCRIMINATION-RISK-001".to_string(),
            category: "discrimination-risk".to_string(),
            priority: "high".to_string(),
            description:
                "Adjustments declined for a worker likely covered by the Equality Act 2010 without adequate justification or alternatives."
                    .to_string(),
            suggested_action:
                "Reconsider the decision, or record a reasonableness justification and offer alternatives before finalising."
                    .to_string(),
        });
    }

    // ─── grievance-escalation ───
    if r.escalated {
        flags.push(Flag {
            flag_id: "F-GRIEVANCE-001".to_string(),
            category: "grievance-escalation".to_string(),
            priority: "high".to_string(),
            description: "Matter escalated (dispute / grievance / appeal).".to_string(),
            suggested_action: "Engage HR and follow the grievance / appeal procedure.".to_string(),
        });
    }

    // ─── undue-delay: > 20 days between assessment and response ───
    if let Some(days) = whole_days_between(&r.assessed_date, &r.responded_date) {
        if days > 20 {
            flags.push(Flag {
                flag_id: "F-UNDUE-DELAY-001".to_string(),
                category: "undue-delay".to_string(),
                priority: "medium".to_string(),
                description: "More than 20 working days between assessment and response."
                    .to_string(),
                suggested_action:
                    "The Equality Act duty is to act without unreasonable delay; expedite."
                        .to_string(),
            });
        }
    }

    // ─── no-review-scheduled ───
    if any_agreed(r) && !r.review_scheduled {
        flags.push(Flag {
            flag_id: "F-NO-REVIEW-001".to_string(),
            category: "no-review-scheduled".to_string(),
            priority: "medium".to_string(),
            description: "Adjustments agreed but no review date set.".to_string(),
            suggested_action: "Schedule a review to check the adjustments are working.".to_string(),
        });
    }

    // ─── no-trial-defined ───
    if r.trial_period && r.trial_period_weeks.unwrap_or(0) == 0 {
        flags.push(Flag {
            flag_id: "F-NO-TRIAL-001".to_string(),
            category: "no-trial-defined".to_string(),
            priority: "low".to_string(),
            description: "Trial adjustments without a defined trial period.".to_string(),
            suggested_action: "Set a trial length and a review date.".to_string(),
        });
    }

    // ─── missing-rationale: a non-agreed decision recorded with no rationale ───
    if !r.overall_decision.is_empty()
        && r.overall_decision != "agreed"
        && r.decision_rationale.trim().is_empty()
    {
        flags.push(Flag {
            flag_id: "F-MISSING-RATIONALE-001".to_string(),
            category: "missing-rationale".to_string(),
            priority: if r.overall_decision == "declined" {
                "high"
            } else {
                "medium"
            }
            .to_string(),
            description: "A decision was recorded without a rationale.".to_string(),
            suggested_action:
                "Record why the decision was reached, especially where anything was declined."
                    .to_string(),
        });
    }

    // ─── incomplete-response ───
    if completeness_percent < 60 {
        flags.push(Flag {
            flag_id: "F-INCOMPLETE-001".to_string(),
            category: "incomplete-response".to_string(),
            priority: "medium".to_string(),
            description: "Mandatory response sections are missing.".to_string(),
            suggested_action:
                "Complete the decision, rationale, review arrangements, and point of contact."
                    .to_string(),
        });
    }

    // Sort: high > medium > low (stable, preserves insertion order within a tier).
    flags.sort_by_key(|f| priority_order(&f.priority));

    flags
}
