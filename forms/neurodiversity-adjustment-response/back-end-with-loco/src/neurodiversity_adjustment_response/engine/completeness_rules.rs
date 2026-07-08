//! Axis C — response completeness.
//!
//! Returns the weighted percentage (0–100, rounded) of mandatory response
//! sections that are present, plus an audit-trail rule for each missing
//! section. Weights reflect how central each section is to a valid ACAS
//! reasonable-adjustment confirmation-and-review record.

use super::types::{FiredRule, NeurodiversityAdjustmentResponse};

struct SectionCheck {
    weight: i32,
    rule_id: &'static str,
    label: &'static str,
    present: fn(&NeurodiversityAdjustmentResponse) -> bool,
}

const SECTIONS: &[SectionCheck] = &[
    SectionCheck {
        weight: 3,
        rule_id: "R-COMPLETE-DECISION",
        label: "overall decision",
        present: |r| !r.overall_decision.is_empty(),
    },
    SectionCheck {
        weight: 3,
        rule_id: "R-COMPLETE-RATIONALE",
        label: "decision rationale",
        present: |r| !r.decision_rationale.trim().is_empty(),
    },
    SectionCheck {
        weight: 2,
        rule_id: "R-COMPLETE-AGREED-DETAIL",
        label: "agreed-adjustments detail",
        present: |r| {
            !r.agreed_adjustments_detail.trim().is_empty() || r.overall_decision == "declined"
        },
    },
    SectionCheck {
        weight: 2,
        rule_id: "R-COMPLETE-REVIEW",
        label: "review arrangements",
        present: |r| r.review_scheduled && !r.review_date.trim().is_empty(),
    },
    SectionCheck {
        weight: 1,
        rule_id: "R-COMPLETE-CONTACT",
        label: "point of contact",
        present: |r| !r.point_of_contact.trim().is_empty(),
    },
    SectionCheck {
        weight: 1,
        rule_id: "R-COMPLETE-EFFECTIVE-DATE",
        label: "effective date",
        present: |r| !r.effective_date.trim().is_empty(),
    },
    SectionCheck {
        weight: 1,
        rule_id: "R-COMPLETE-RESPONDED-DATE",
        label: "responded date",
        present: |r| !r.responded_date.trim().is_empty(),
    },
    SectionCheck {
        weight: 1,
        rule_id: "R-COMPLETE-RESPONSIBILITIES",
        label: "responsibilities",
        present: |r| !r.responsibilities_detail.trim().is_empty(),
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
];

/// Grade completeness, returning the percent and one fired rule per missing
/// section.
#[must_use]
pub fn grade_completeness(r: &NeurodiversityAdjustmentResponse) -> (i32, Vec<FiredRule>) {
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
                description: format!("Mandatory response section missing: {}.", section.label),
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
