//! Axis A — Equality Act 2010 eligibility.
//!
//! Ported from `front-end-with-svelte/src/lib/engine/eligibility-rules.ts`.
//! Evaluated top-to-bottom; the first matching rule wins (exactly one Axis-A
//! rule fires). Rule IDs are stable and identical across every front-end and the
//! back-end.

use super::types::{FiredRule, NeurodiversityAdjustmentRequest};
use super::utils::any_condition;

/// The result of grading axis A.
pub struct Eligibility {
    /// The eligibility band (`likely-covered` / `possibly-covered` / `unclear`).
    pub eligibility_band: String,
    /// The audit-trail rules that fired.
    pub fired_rules: Vec<FiredRule>,
}

fn is_material_impact(current_impact: &str) -> bool {
    matches!(current_impact, "moderate" | "high" | "severe")
}

/// Grade axis A — Equality Act 2010 eligibility (the likelihood the duty to make
/// reasonable adjustments applies). First match wins.
#[must_use]
pub fn grade_eligibility(r: &NeurodiversityAdjustmentRequest) -> Eligibility {
    let mut fired_rules: Vec<FiredRule> = Vec::new();

    // 1. Substantial + long-term adverse effect → meets the disability test.
    if r.substantial_long_term_impact {
        fired_rules.push(FiredRule::new(
            "R-ELIG-SUBSTANTIAL-LONG-TERM",
            "eligibility",
            "substantial-long-term",
            "Substantial and long-term adverse effect reported — meets the Equality Act 2010 disability test; the duty to make reasonable adjustments is likely engaged.",
        ));
        return Eligibility {
            eligibility_band: "likely-covered".to_string(),
            fired_rules,
        };
    }

    // 2. Diagnosed neurodivergence with material impact on work.
    if r.diagnosis_status == "diagnosed" && is_material_impact(&r.current_impact) {
        fired_rules.push(FiredRule::new(
            "R-ELIG-DIAGNOSED-IMPACT",
            "eligibility",
            "diagnosed-impact",
            "Diagnosed neurodivergence with material impact on work — likely a disability under the Equality Act 2010.",
        ));
        return Eligibility {
            eligibility_band: "likely-covered".to_string(),
            fired_rules,
        };
    }

    // 3. Neurodivergence with disability self-assessment or high impact.
    if any_condition(r)
        && (r.considers_disability == "yes"
            || matches!(r.current_impact.as_str(), "high" | "severe"))
    {
        fired_rules.push(FiredRule::new(
            "R-ELIG-POSSIBLE",
            "eligibility",
            "possible",
            "Neurodivergence with disability self-assessment or high impact — may amount to a disability; assess the substantial + long-term test.",
        ));
        return Eligibility {
            eligibility_band: "possibly-covered".to_string(),
            fired_rules,
        };
    }

    // 4. Neurodivergence recorded.
    if any_condition(r) {
        fired_rules.push(FiredRule::new(
            "R-ELIG-NEURODIVERGENCE-PRESENT",
            "eligibility",
            "neurodivergence-present",
            "Neurodivergence recorded; being neurodivergent will often amount to a disability under the Equality Act 2010 (ACAS).",
        ));
        return Eligibility {
            eligibility_band: "possibly-covered".to_string(),
            fired_rules,
        };
    }

    // 5. Insufficient information.
    fired_rules.push(FiredRule::new(
        "R-ELIG-UNCLEAR",
        "eligibility",
        "unclear",
        "Insufficient information to judge Equality Act eligibility; clarify the neurodivergent profile and its impact.",
    ));
    Eligibility {
        eligibility_band: "unclear".to_string(),
        fired_rules,
    }
}
