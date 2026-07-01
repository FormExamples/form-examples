//! Axis D — triage priority, plus the target timeframe.
//!
//! Ported from `front-end-with-svelte/src/lib/engine/triage-rules.ts`.

use super::types::{CardiologyRequest, FiredRule};
use super::utils::has_red_flag;

/// The result of grading axis D.
pub struct Triage {
    /// The triage tier (`routine` / `urgent` / `emergency`).
    pub triage_tier: String,
    /// The target timeframe implied by the tier.
    pub target_timeframe: String,
    /// The audit-trail rules that fired.
    pub fired_rules: Vec<FiredRule>,
}

/// Grade axis D — triage priority plus the target timeframe. A red flag
/// auto-escalates the tier regardless of the requested urgency (the safety
/// invariant); the referrer's requested urgency can raise but never lower the
/// computed tier. The least-urgent band is chosen only when no rule fires.
#[must_use]
pub fn grade_triage(r: &CardiologyRequest, safety_band: &str) -> Triage {
    let mut fired_rules: Vec<FiredRule> = Vec::new();

    // ─── emergency: red-flag auto-escalation invariant ───
    if r.suspected_acs || r.troponin_status == "elevated" {
        fired_rules.push(FiredRule::new(
            "R-TRIAGE-EMERGENCY-01",
            "triage",
            "suspected-acs",
            "Suspected acute coronary syndrome / elevated troponin auto-escalates triage to emergency regardless of the requested urgency.",
        ));
        return Triage {
            triage_tier: "emergency".to_string(),
            target_timeframe: "immediate (emergency pathway)".to_string(),
            fired_rules,
        };
    }

    // ─── urgent: other red flags and acuity ───
    if has_red_flag(r) {
        fired_rules.push(FiredRule::new(
            "R-TRIAGE-URGENT-01",
            "triage",
            "red-flag",
            "A red flag (exertional syncope or new-onset heart failure) auto-escalates triage to urgent.",
        ));
        return Triage {
            triage_tier: "urgent".to_string(),
            target_timeframe: "within 2 weeks".to_string(),
            fired_rules,
        };
    }

    if safety_band == "red-flag" {
        fired_rules.push(FiredRule::new(
            "R-TRIAGE-URGENT-02",
            "triage",
            "safety-red-flag",
            "Safety axis is red-flag (e.g. typical-angina chest pain); triage urgent.",
        ));
        return Triage {
            triage_tier: "urgent".to_string(),
            target_timeframe: "within 2 weeks".to_string(),
            fired_rules,
        };
    }

    if r.urgency == "emergency" {
        fired_rules.push(FiredRule::new(
            "R-TRIAGE-URGENT-03",
            "triage",
            "requested-emergency",
            "Referrer requested an emergency review without a coded ACS red flag; triage urgent pending vetting.",
        ));
        return Triage {
            triage_tier: "urgent".to_string(),
            target_timeframe: "within 2 weeks".to_string(),
            fired_rules,
        };
    }

    if safety_band == "caution" || r.urgency == "urgent" {
        fired_rules.push(FiredRule::new(
            "R-TRIAGE-URGENT-04",
            "triage",
            "acuity-or-requested-urgent",
            "Acuity signal present or urgent review requested; triage urgent.",
        ));
        return Triage {
            triage_tier: "urgent".to_string(),
            target_timeframe: "within 2 weeks".to_string(),
            fired_rules,
        };
    }

    // ─── routine: least-urgent band, no rule fired ───
    fired_rules.push(FiredRule::new(
        "R-TRIAGE-ROUTINE-01",
        "triage",
        "routine",
        "No escalation rule fired; routine triage.",
    ));
    Triage {
        triage_tier: "routine".to_string(),
        target_timeframe: "within 6 weeks".to_string(),
        fired_rules,
    }
}
