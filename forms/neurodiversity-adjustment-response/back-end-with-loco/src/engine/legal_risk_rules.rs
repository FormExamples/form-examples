//! Axis B — legal / discrimination risk (reasonableness).
//!
//! Risk ladder `ok < caution < high-risk`. Every rule whose condition holds is
//! collected into the audit trail; the band is the highest-ranked one among the
//! rules that fired. If no rule fires, the response is `ok` and `R-LEGAL-OK`
//! is emitted.
//!
//! Declining adjustments for a worker likely covered by the Equality Act 2010
//! without an adequate reasonableness justification or any alternative is the
//! principal driver of `high-risk`.

use super::types::{FiredRule, LegalRiskBand, NeurodiversityAdjustmentResponse};
use super::utils::{any_agreed, decline_justified, has_alternative};

fn band_rank(band: &str) -> u8 {
    match band {
        "high-risk" => 2,
        "caution" => 1,
        _ => 0,
    }
}

/// Grade the legal / discrimination-risk band, returning the band plus every
/// rule that fired.
#[must_use]
pub fn grade_legal_risk(
    r: &NeurodiversityAdjustmentResponse,
) -> (LegalRiskBand, Vec<FiredRule>) {
    let mut fired_rules: Vec<FiredRule> = Vec::new();
    let mut band = "ok".to_string();

    let declined = r.overall_decision == "declined";
    let rationale_empty = r.decision_rationale.trim().is_empty();
    let justified = decline_justified(r);
    let alternative = has_alternative(r);
    let agreed = any_agreed(r);

    let fire = |band_ref: &mut String, rule_band: &str, rule_id: &str, category: &str, description: &str, list: &mut Vec<FiredRule>| {
        if band_rank(rule_band) > band_rank(band_ref) {
            *band_ref = rule_band.to_string();
        }
        list.push(FiredRule {
            rule_id: rule_id.to_string(),
            axis: "legal-risk".to_string(),
            category: category.to_string(),
            description: description.to_string(),
        });
    };

    if declined && rationale_empty {
        fire(
            &mut band,
            "high-risk",
            "R-LEGAL-DECLINE-NO-RATIONALE",
            "decline-no-rationale",
            "Adjustments declined with no rationale recorded — high failure-to-make-reasonable-adjustments risk.",
            &mut fired_rules,
        );
    }

    if declined && !justified && !alternative && !agreed {
        fire(
            &mut band,
            "high-risk",
            "R-LEGAL-DECLINE-NO-ALTERNATIVE",
            "decline-no-alternative",
            "Adjustments declined without a reasonableness justification or any alternative offered.",
            &mut fired_rules,
        );
    }

    if r.escalated && declined {
        fire(
            &mut band,
            "high-risk",
            "R-LEGAL-ESCALATED-DECLINE",
            "escalated-decline",
            "Declined adjustment has been escalated — treat as a live discrimination-risk dispute.",
            &mut fired_rules,
        );
    }

    if declined && justified {
        fire(
            &mut band,
            "caution",
            "R-LEGAL-DECLINE-JUSTIFIED",
            "decline-justified",
            "Adjustments declined but a reasonableness justification is recorded — retain evidence.",
            &mut fired_rules,
        );
    }

    if r.overall_decision == "partially-agreed" && !alternative && r.decline_reason_category.is_empty() {
        fire(
            &mut band,
            "caution",
            "R-LEGAL-PARTIAL-UNEXPLAINED",
            "partial-unexplained",
            "Only part of the request agreed with no explanation for the remainder.",
            &mut fired_rules,
        );
    }

    if r.escalated {
        fire(
            &mut band,
            "caution",
            "R-LEGAL-ESCALATED",
            "escalated",
            "Matter escalated (dispute / grievance / appeal).",
            &mut fired_rules,
        );
    }

    if fired_rules.is_empty() {
        fired_rules.push(FiredRule {
            rule_id: "R-LEGAL-OK".to_string(),
            axis: "legal-risk".to_string(),
            category: "ok".to_string(),
            description: "No elevated discrimination risk detected.".to_string(),
        });
    }

    (band, fired_rules)
}
