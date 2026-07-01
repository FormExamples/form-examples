//! Axis A — referral appropriateness.
//!
//! Ported from `front-end-with-svelte/src/lib/engine/appropriateness-rules.ts`.
//! Rule IDs are stable and identical across every front-end and the back-end.

use super::types::{CardiologyRequest, FiredRule};
use super::utils::service_matches_reason;

/// The result of grading axis A.
pub struct Appropriateness {
    /// The appropriateness band.
    pub appropriateness_band: String,
    /// The audit-trail rules that fired.
    pub fired_rules: Vec<FiredRule>,
}

/// Grade axis A — referral appropriateness (a right-service / right-reason
/// check against NICE referral criteria).
#[must_use]
pub fn grade_appropriateness(r: &CardiologyRequest) -> Appropriateness {
    let mut fired_rules: Vec<FiredRule> = Vec::new();

    // No reason supplied → cannot justify a cardiology referral.
    if r.referral_reason.is_empty() {
        fired_rules.push(FiredRule::new(
            "R-APPROP-NO-REASON-01",
            "appropriateness",
            "missing-reason",
            "No primary reason for referral supplied; the referral cannot be judged appropriate.",
        ));
        return Appropriateness {
            appropriateness_band: "usually-not-appropriate".to_string(),
            fired_rules,
        };
    }

    // Non-cardiac / context-light reasons routed to cardiology.
    if r.referral_reason == "hypertension"
        && !r.symptom_chest_pain
        && !r.symptom_breathlessness
    {
        fired_rules.push(FiredRule::new(
            "R-APPROP-LOW-YIELD-01",
            "appropriateness",
            "low-yield",
            "Uncomplicated hypertension without cardiac symptoms is usually managed in primary care, not cardiology.",
        ));
        return Appropriateness {
            appropriateness_band: "usually-not-appropriate".to_string(),
            fired_rules,
        };
    }

    // Recognised cardiac reason with a matching service and a clinical question.
    if service_matches_reason(r) && !r.clinical_question.trim().is_empty() {
        fired_rules.push(FiredRule::new(
            "R-APPROP-MATCH-01",
            "appropriateness",
            "right-service-right-reason",
            "A recognised cardiac reason with a matching requested service and a clinical question; usually appropriate.",
        ));
        return Appropriateness {
            appropriateness_band: "usually-appropriate".to_string(),
            fired_rules,
        };
    }

    // Cardiac reason but the requested service does not match the typical pathway.
    if !service_matches_reason(r) {
        fired_rules.push(FiredRule::new(
            "R-APPROP-SERVICE-MISMATCH-01",
            "appropriateness",
            "service-mismatch",
            "The requested service does not match the typical pathway for the referral reason; may be appropriate but consider redirection.",
        ));
        return Appropriateness {
            appropriateness_band: "may-be-appropriate".to_string(),
            fired_rules,
        };
    }

    // Matching service but no clinical question to vet against.
    fired_rules.push(FiredRule::new(
        "R-APPROP-NO-QUESTION-01",
        "appropriateness",
        "missing-clinical-question",
        "A cardiac reason with a matching service but no specific clinical question; may be appropriate pending clarification.",
    ));
    Appropriateness {
        appropriateness_band: "may-be-appropriate".to_string(),
        fired_rules,
    }
}
