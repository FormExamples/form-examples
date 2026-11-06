//! Axis C — request completeness.
//!
//! Ported from `front-end-with-svelte/src/lib/engine/completeness-rules.ts`.
//! Completeness is the weighted percentage (0–100, rounded) of mandatory
//! request fields that are present.

use super::types::{CardiologyRequest, FiredRule};

/// A mandatory request field, used to compute Axis C completeness.
struct FieldCheck {
    rule_id: &'static str,
    category: &'static str,
    label: &'static str,
    weight: i32,
    present: fn(&CardiologyRequest) -> bool,
}

/// The mandatory request fields, with the referral reason and clinical question
/// weighted highest (total weight = 14).
const FIELDS: &[FieldCheck] = &[
    FieldCheck {
        rule_id: "R-COMP-REASON-01",
        category: "reason",
        label: "referral reason",
        weight: 3,
        present: |r| !r.referral_reason.is_empty(),
    },
    FieldCheck {
        rule_id: "R-COMP-QUESTION-01",
        category: "clinical-question",
        label: "clinical question",
        weight: 3,
        present: |r| !r.clinical_question.trim().is_empty(),
    },
    FieldCheck {
        rule_id: "R-COMP-SERVICE-01",
        category: "requested-service",
        label: "requested service",
        weight: 2,
        present: |r| !r.requested_service.is_empty(),
    },
    FieldCheck {
        rule_id: "R-COMP-PATIENT-01",
        category: "patient-identification",
        label: "patient identification (NHS number)",
        weight: 2,
        present: |r| !r.nhs_number.trim().is_empty(),
    },
    FieldCheck {
        rule_id: "R-COMP-CLINICIAN-01",
        category: "referring-clinician",
        label: "referring clinician",
        weight: 1,
        present: |r| !r.referring_clinician.trim().is_empty(),
    },
    FieldCheck {
        rule_id: "R-COMP-HISTORY-01",
        category: "relevant-history",
        label: "relevant history",
        weight: 1,
        present: |r| !r.relevant_history.trim().is_empty(),
    },
    FieldCheck {
        rule_id: "R-COMP-ECG-01",
        category: "investigations",
        label: "resting ECG",
        weight: 1,
        present: |r| r.ecg_done,
    },
    FieldCheck {
        rule_id: "R-COMP-CONTACT-01",
        category: "referrer-contact",
        label: "referrer contact details",
        weight: 1,
        present: |r| !r.requester_contact.trim().is_empty(),
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
pub fn grade_completeness(r: &CardiologyRequest) -> Completeness {
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
                field.category,
                &format!("Mandatory field missing: {}.", field.label),
            ));
        }
    }

    // Round-half-up to match JavaScript's Math.round on non-negative values.
    // The value is a 0-100 percentage, so the f64 -> i32 cast cannot truncate.
    #[allow(clippy::cast_possible_truncation)]
    let completeness_percent =
        ((f64::from(present_weight) / f64::from(total_weight)) * 100.0).round() as i32;

    Completeness {
        completeness_percent,
        fired_rules,
    }
}
