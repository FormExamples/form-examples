//! Compliance / risk flag detection, independent of the four axes.
//!
//! Flag categories mirror
//! `sql/07_create_table_neurodiversity_adjustment_review_grade_flag.sql`.
//! Flags are returned sorted high → medium → low priority. The
//! `adjustments-not-working` flag (`F-ADJUSTMENTS-NOT-WORKING-001`) is the
//! highest-priority operational signal — an agreed adjustment is no longer
//! working and must be acted on promptly.

use super::types::{Flag, NeurodiversityAdjustmentReview};
use super::utils::any_not_working;

fn priority_order(priority: &str) -> u8 {
    match priority {
        "high" => 0,
        "medium" => 1,
        _ => 2,
    }
}

/// Detect compliance / risk flags for a review, given the already-computed
/// completeness percent.
#[must_use]
pub fn detect_flags(
    r: &NeurodiversityAdjustmentReview,
    completeness_percent: i32,
) -> Vec<Flag> {
    let mut flags: Vec<Flag> = Vec::new();

    // ─── adjustments-not-working ───
    if any_not_working(r) {
        flags.push(Flag {
            flag_id: "F-ADJUSTMENTS-NOT-WORKING-001".to_string(),
            category: "adjustments-not-working".to_string(),
            priority: "high".to_string(),
            description: "An agreed adjustment is no longer working.".to_string(),
            suggested_action:
                "Act promptly; update the adjustment or consider an occupational-health re-referral."
                    .to_string(),
        });
    }

    // ─── worker-dissatisfied ───
    if r.worker_satisfied == "no" {
        flags.push(Flag {
            flag_id: "F-WORKER-DISSATISFIED-001".to_string(),
            category: "worker-dissatisfied".to_string(),
            priority: "high".to_string(),
            description: "The worker is not satisfied the adjustments meet their needs."
                .to_string(),
            suggested_action: "Explore what would work with the worker.".to_string(),
        });
    } else if r.worker_satisfied == "partially" {
        flags.push(Flag {
            flag_id: "F-WORKER-DISSATISFIED-001".to_string(),
            category: "worker-dissatisfied".to_string(),
            priority: "medium".to_string(),
            description: "The worker is only partially satisfied.".to_string(),
            suggested_action: "Explore improvements with the worker.".to_string(),
        });
    }

    // ─── wellbeing-declined ───
    if r.wellbeing_change == "worse" {
        flags.push(Flag {
            flag_id: "F-WELLBEING-DECLINED-001".to_string(),
            category: "wellbeing-declined".to_string(),
            priority: "high".to_string(),
            description: "The worker's wellbeing has worsened since the adjustments.".to_string(),
            suggested_action: "Review the adjustments and consider occupational-health input."
                .to_string(),
        });
    }

    // ─── changes-outstanding ───
    if r.changes_needed && r.changes_detail.trim().is_empty() {
        flags.push(Flag {
            flag_id: "F-CHANGES-OUTSTANDING-001".to_string(),
            category: "changes-outstanding".to_string(),
            priority: "medium".to_string(),
            description: "Changes are needed but not yet detailed.".to_string(),
            suggested_action: "Record and action the required changes.".to_string(),
        });
    }

    // ─── no-next-review ───
    if r.next_review_date.trim().is_empty() {
        flags.push(Flag {
            flag_id: "F-NO-NEXT-REVIEW-001".to_string(),
            category: "no-next-review".to_string(),
            priority: "medium".to_string(),
            description: "No next review date has been set.".to_string(),
            suggested_action: "Schedule the next review.".to_string(),
        });
    }

    // ─── escalation ───
    if r.escalated {
        flags.push(Flag {
            flag_id: "F-ESCALATION-001".to_string(),
            category: "escalation".to_string(),
            priority: "high".to_string(),
            description: "The matter has been escalated.".to_string(),
            suggested_action: "Follow the escalation / grievance procedure.".to_string(),
        });
    }

    // ─── incomplete-review ───
    if completeness_percent < 60 {
        flags.push(Flag {
            flag_id: "F-INCOMPLETE-REVIEW-001".to_string(),
            category: "incomplete-review".to_string(),
            priority: "medium".to_string(),
            description: "Mandatory review sections are missing.".to_string(),
            suggested_action:
                "Complete the effectiveness ratings, worker feedback, and next review date."
                    .to_string(),
        });
    }

    // Sort: high > medium > low (stable, preserves insertion order within a tier).
    flags.sort_by_key(|f| priority_order(&f.priority));

    flags
}
