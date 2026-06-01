use super::types::TriState;

/// Display label for the overall pass/needs-development/fail outcome.
pub fn outcome_label(outcome: &str) -> String {
    match outcome {
        "pass" => "Pass".to_string(),
        "needs-development" => "Needs Development".to_string(),
        "fail" => "Fail".to_string(),
        _ => "".to_string(),
    }
}

/// CSS class hint for the outcome badge.
pub fn outcome_class(outcome: &str) -> String {
    match outcome {
        "pass" => "outcome-pass".to_string(),
        "needs-development" => "outcome-needs-development".to_string(),
        "fail" => "outcome-fail".to_string(),
        _ => "".to_string(),
    }
}

/// Friendly label for a TriState response.
pub fn tri_state_label(status: &str) -> String {
    match status {
        "yes" => "Demonstrated".to_string(),
        "no" => "Not yet".to_string(),
        "na" => "Not assessed".to_string(),
        _ => "—".to_string(),
    }
}

/// Normalise an incoming TriState string ("yes" / "no" / "na" / "" else "").
pub fn normalise_tri(v: &str) -> TriState {
    match v {
        "yes" | "no" | "na" => v.to_string(),
        _ => String::new(),
    }
}

/// HSE / St John critical-skill rule IDs (any "no" forces overall Fail).
pub const CRITICAL_RULE_IDS: &[&str] = &[
    "FAW-PS-RESPONSE",
    "FAW-CPR-COMPRESSIONS",
    "FAW-CPR-VENTILATIONS",
    "FAW-AED-SAFE-SHOCK",
    "FAW-CHOKE-UNCONSCIOUS",
    "FAW-BLEED-PRESSURE",
    "FAW-BLEED-TOURNIQUET",
    "FAW-MED-ANAPHYLAXIS",
];
