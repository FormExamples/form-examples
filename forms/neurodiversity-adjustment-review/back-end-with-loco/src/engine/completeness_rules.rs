//! Axis C — review completeness.
//!
//! Returns the weighted percentage (0–100, rounded) of mandatory review
//! sections that are present, plus an audit-trail rule for each missing
//! section. Weights reflect how central each section is to a valid ACAS
//! reasonable-adjustments review record.

use super::types::{FiredRule, NeurodiversityAdjustmentReview};
use super::utils::any_effectiveness_answered;

struct SectionCheck {
    weight: i32,
    rule_id: &'static str,
    label: &'static str,
    present: fn(&NeurodiversityAdjustmentReview) -> bool,
}

const SECTIONS: &[SectionCheck] = &[
    SectionCheck {
        weight: 3,
        rule_id: "R-COMPLETE-EFFECTIVENESS",
        label: "effectiveness ratings",
        present: any_effectiveness_answered,
    },
    SectionCheck {
        weight: 3,
        rule_id: "R-COMPLETE-WORKER-FEEDBACK",
        label: "worker feedback",
        present: |r| !r.worker_feedback.trim().is_empty(),
    },
    SectionCheck {
        weight: 2,
        rule_id: "R-COMPLETE-SATISFACTION",
        label: "worker satisfaction",
        present: |r| !r.worker_satisfied.is_empty(),
    },
    SectionCheck {
        weight: 2,
        rule_id: "R-COMPLETE-WELLBEING",
        label: "wellbeing change",
        present: |r| !r.wellbeing_change.is_empty(),
    },
    SectionCheck {
        weight: 2,
        rule_id: "R-COMPLETE-NEXT-REVIEW",
        label: "next review date",
        present: |r| !r.next_review_date.trim().is_empty(),
    },
    SectionCheck {
        weight: 1,
        rule_id: "R-COMPLETE-REVIEW-DATE",
        label: "review date",
        present: |r| !r.review_date.trim().is_empty(),
    },
    SectionCheck {
        weight: 1,
        rule_id: "R-COMPLETE-METHOD",
        label: "review method",
        present: |r| !r.review_method.is_empty(),
    },
    SectionCheck {
        weight: 1,
        rule_id: "R-COMPLETE-WORKER-NAME",
        label: "worker name",
        present: |r| !r.worker_name.trim().is_empty(),
    },
    SectionCheck {
        weight: 1,
        rule_id: "R-COMPLETE-MANAGER",
        label: "manager / HR contact",
        present: |r| !r.manager_name.trim().is_empty(),
    },
    SectionCheck {
        weight: 1,
        rule_id: "R-COMPLETE-STATUS",
        label: "review status",
        present: |r| !r.review_status.is_empty(),
    },
];

/// Grade completeness, returning the percent and one fired rule per missing
/// section.
#[must_use]
pub fn grade_completeness(r: &NeurodiversityAdjustmentReview) -> (i32, Vec<FiredRule>) {
    let mut fired_rules: Vec<FiredRule> = Vec::new();
    let mut present_weight = 0_i32;
    let mut total_weight = 0_i32;

    for section in SECTIONS {
        total_weight += section.weight;
        if (section.present)(r) {
            present_weight += section.weight;
        } else {
            fired_rules.push(FiredRule {
                rule_id: section.rule_id.to_string(),
                axis: "completeness".to_string(),
                category: "missing-field".to_string(),
                description: format!("Mandatory review section missing: {}.", section.label),
            });
        }
    }

    let completeness_percent = if total_weight == 0 {
        0
    } else {
        ((f64::from(present_weight) / f64::from(total_weight)) * 100.0).round() as i32
    };
    (completeness_percent, fired_rules)
}
