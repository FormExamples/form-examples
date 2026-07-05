//! Axis C — request completeness.
//!
//! Ported from `front-end-with-svelte/src/lib/engine/completeness-rules.ts`.
//! Completeness is the weighted percentage (0–100, rounded) of mandatory
//! request fields that are present; each missing field emits an audit-trail rule
//! on the `completeness` axis with category `missing-field`.

use super::types::{FiredRule, NeurodiversityAdjustmentRequest};
use super::utils::{any_adjustment, any_condition, any_difficulty};

/// A mandatory request field, used to compute Axis C completeness.
struct FieldCheck {
    rule_id: &'static str,
    label: &'static str,
    weight: i32,
    present: fn(&NeurodiversityAdjustmentRequest) -> bool,
}

/// The mandatory request fields, with the neurodivergent profile, functional
/// difficulties, and requested adjustments weighted highest (total weight = 18).
const FIELDS: &[FieldCheck] = &[
    FieldCheck {
        rule_id: "R-COMPLETE-CONDITIONS",
        label: "neurodivergent profile",
        weight: 3,
        present: any_condition,
    },
    FieldCheck {
        rule_id: "R-COMPLETE-DIFFICULTIES",
        label: "functional difficulties",
        weight: 3,
        present: any_difficulty,
    },
    FieldCheck {
        rule_id: "R-COMPLETE-ADJUSTMENTS",
        label: "requested adjustments",
        weight: 3,
        present: any_adjustment,
    },
    FieldCheck {
        rule_id: "R-COMPLETE-TASKS",
        label: "tasks and situations affected",
        weight: 2,
        present: |r| !r.tasks_situations_affected.trim().is_empty(),
    },
    FieldCheck {
        rule_id: "R-COMPLETE-CONSENT",
        label: "disclosure consent",
        weight: 2,
        present: |r| r.disclosure_consent,
    },
    FieldCheck {
        rule_id: "R-COMPLETE-WORKER-NAME",
        label: "worker name",
        weight: 1,
        present: |r| !r.worker_name.trim().is_empty(),
    },
    FieldCheck {
        rule_id: "R-COMPLETE-JOB-TITLE",
        label: "job title",
        weight: 1,
        present: |r| !r.worker_job_title.trim().is_empty(),
    },
    FieldCheck {
        rule_id: "R-COMPLETE-MANAGER",
        label: "manager / HR contact",
        weight: 1,
        present: |r| !r.manager_name.trim().is_empty(),
    },
    FieldCheck {
        rule_id: "R-COMPLETE-REQUEST-DATE",
        label: "request date",
        weight: 1,
        present: |r| !r.request_date.trim().is_empty(),
    },
    FieldCheck {
        rule_id: "R-COMPLETE-ADJUSTMENTS-DETAIL",
        label: "requested-adjustments detail",
        weight: 1,
        present: |r| !r.adjustments_requested_detail.trim().is_empty(),
    },
];

/// The result of grading axis C.
pub struct Completeness {
    /// The weighted completeness percentage (0–100, rounded).
    pub completeness_percent: i32,
    /// One audit-trail rule for each missing field.
    pub fired_rules: Vec<FiredRule>,
}

/// Grade axis C — request completeness as the weighted percentage of mandatory
/// request fields present, with an audit-trail rule for each missing field.
#[must_use]
pub fn grade_completeness(r: &NeurodiversityAdjustmentRequest) -> Completeness {
    let mut fired_rules: Vec<FiredRule> = Vec::new();
    let total_weight: i32 = FIELDS.iter().map(|f| f.weight).sum();
    let mut present_weight: i32 = 0;

    for field in FIELDS {
        if (field.present)(r) {
            present_weight += field.weight;
        } else {
            fired_rules.push(FiredRule::new(
                field.rule_id,
                "completeness",
                "missing-field",
                &format!("Mandatory field missing: {}.", field.label),
            ));
        }
    }

    // Round-half-up to match JavaScript's Math.round on non-negative values.
    let completeness_percent =
        ((f64::from(present_weight) / f64::from(total_weight)) * 100.0).round() as i32;

    Completeness {
        completeness_percent,
        fired_rules,
    }
}
