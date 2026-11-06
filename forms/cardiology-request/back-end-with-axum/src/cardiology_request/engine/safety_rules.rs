//! Axis B — safety / red-flag.
//!
//! Ported from `front-end-with-svelte/src/lib/engine/safety-rules.ts`.

use super::types::{CardiologyRequest, FiredRule};
use super::utils::{has_red_flag, has_typical_angina};

/// The result of grading axis B.
pub struct Safety {
    /// The safety band (`ok` / `caution` / `red-flag`).
    pub safety_band: String,
    /// The audit-trail rules that fired.
    pub fired_rules: Vec<FiredRule>,
}

/// Grade axis B — safety / red-flag, on the escalation ladder
/// `ok → caution → red-flag`. The least-alarming band is chosen only when no
/// rule fires.
#[must_use]
pub fn grade_safety(r: &CardiologyRequest) -> Safety {
    let mut fired_rules: Vec<FiredRule> = Vec::new();

    // ─── red-flag ───
    if r.suspected_acs {
        fired_rules.push(FiredRule::new(
            "R-SAFETY-ACS-01",
            "safety",
            "suspected-acs",
            "Suspected acute coronary syndrome; emergency pathway warranted, not a routine cardiology referral.",
        ));
    }
    if r.exertional_syncope {
        fired_rules.push(FiredRule::new(
            "R-SAFETY-EXERTIONAL-SYNCOPE-01",
            "safety",
            "exertional-syncope",
            "Exertional syncope; possible structural or arrhythmic cause requiring urgent assessment.",
        ));
    }
    if r.new_onset_heart_failure {
        fired_rules.push(FiredRule::new(
            "R-SAFETY-NEW-HF-01",
            "safety",
            "new-onset-heart-failure",
            "New-onset heart failure; warrants urgent assessment per NICE NG106.",
        ));
    }
    if r.troponin_status == "elevated" {
        fired_rules.push(FiredRule::new(
            "R-SAFETY-TROPONIN-01",
            "safety",
            "elevated-troponin",
            "Elevated troponin recorded; treat as an acute coronary presentation.",
        ));
    }
    if has_typical_angina(r) {
        fired_rules.push(FiredRule::new(
            "R-SAFETY-TYPICAL-ANGINA-01",
            "safety",
            "red-flag-chest-pain",
            "Typical-angina chest pain; vet for urgent rather than routine review.",
        ));
    }

    if has_red_flag(r) || r.troponin_status == "elevated" || has_typical_angina(r) {
        return Safety {
            safety_band: "red-flag".to_string(),
            fired_rules,
        };
    }

    // ─── caution ───
    let caution_signals = r.bnp_status == "elevated"
        || r.nyha_class == "iii"
        || r.nyha_class == "iv"
        || r.symptom_syncope
        || r.symptom_palpitations;

    if caution_signals {
        fired_rules.push(FiredRule::new(
            "R-SAFETY-CAUTION-01",
            "safety",
            "acuity-signal",
            "Softer acuity signal present (elevated BNP, NYHA III–IV, syncope, or palpitations); manage with caution.",
        ));
        return Safety {
            safety_band: "caution".to_string(),
            fired_rules,
        };
    }

    // ─── ok: least-alarming band, no rule fired ───
    fired_rules.push(FiredRule::new(
        "R-SAFETY-OK-01",
        "safety",
        "no-red-flag",
        "No red flag or acuity signal; safety band OK.",
    ));
    Safety {
        safety_band: "ok".to_string(),
        fired_rules,
    }
}
