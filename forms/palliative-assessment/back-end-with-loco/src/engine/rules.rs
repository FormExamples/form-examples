//! Rules module.

use super::types::AssessmentData;
use super::utils::esas_value;

/// One palliative rule: an ESAS-r item or an ancillary palliative-care
/// indicator. ESAS rules return the patient's 0-10 intensity; ancillary
/// rules return a positive integer if fired, or 0 otherwise.
pub struct PalliativeRule {
    /// ID.
    pub id: &'static str,
    /// Category.
    pub category: &'static str,
    /// Description.
    pub description: &'static str,
    /// Kind.
    pub kind: RuleKind,
    /// Symptom key.
    pub symptom_key: &'static str,
    /// Evaluate.
    pub evaluate: fn(&AssessmentData) -> i32,
}

/// Discriminator: ESAS-r symptom rule, or ancillary palliative rule.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum RuleKind {
    /// Esas.
    Esas,
    /// Ancillary.
    Ancillary,
}

/// All palliative rules — verbatim port of
/// `front-end-form-with-html/js/rules.js`. Rule IDs are stable identifiers
/// and must not change.
pub fn all_rules() -> Vec<PalliativeRule> {
    vec![
        PalliativeRule {
            id: "PALL-ESAS-001",
            category: "Pain",
            description: "Pain intensity (ESAS-r 0-10).",
            kind: RuleKind::Esas,
            symptom_key: "pain",
            evaluate: |d| esas_value(d, "pain"),
        },
        PalliativeRule {
            id: "PALL-ESAS-002",
            category: "Tiredness",
            description: "Tiredness / lack of energy (ESAS-r 0-10).",
            kind: RuleKind::Esas,
            symptom_key: "tiredness",
            evaluate: |d| esas_value(d, "tiredness"),
        },
        PalliativeRule {
            id: "PALL-ESAS-003",
            category: "Drowsiness",
            description: "Drowsiness / feeling sleepy (ESAS-r 0-10).",
            kind: RuleKind::Esas,
            symptom_key: "drowsiness",
            evaluate: |d| esas_value(d, "drowsiness"),
        },
        PalliativeRule {
            id: "PALL-ESAS-004",
            category: "Nausea",
            description: "Nausea (ESAS-r 0-10).",
            kind: RuleKind::Esas,
            symptom_key: "nausea",
            evaluate: |d| esas_value(d, "nausea"),
        },
        PalliativeRule {
            id: "PALL-ESAS-005",
            category: "Lack of Appetite",
            description: "Lack of appetite (ESAS-r 0-10).",
            kind: RuleKind::Esas,
            symptom_key: "lackOfAppetite",
            evaluate: |d| esas_value(d, "lackOfAppetite"),
        },
        PalliativeRule {
            id: "PALL-ESAS-006",
            category: "Shortness of Breath",
            description: "Shortness of breath / dyspnoea (ESAS-r 0-10).",
            kind: RuleKind::Esas,
            symptom_key: "shortnessOfBreath",
            evaluate: |d| esas_value(d, "shortnessOfBreath"),
        },
        PalliativeRule {
            id: "PALL-ESAS-007",
            category: "Depression",
            description: "Depression / feeling sad (ESAS-r 0-10).",
            kind: RuleKind::Esas,
            symptom_key: "depression",
            evaluate: |d| esas_value(d, "depression"),
        },
        PalliativeRule {
            id: "PALL-ESAS-008",
            category: "Anxiety",
            description: "Anxiety / feeling nervous (ESAS-r 0-10).",
            kind: RuleKind::Esas,
            symptom_key: "anxiety",
            evaluate: |d| esas_value(d, "anxiety"),
        },
        PalliativeRule {
            id: "PALL-ESAS-009",
            category: "Wellbeing",
            description: "Overall wellbeing (ESAS-r 0-10; higher = worse).",
            kind: RuleKind::Esas,
            symptom_key: "wellbeing",
            evaluate: |d| esas_value(d, "wellbeing"),
        },
        PalliativeRule {
            id: "PALL-ESAS-010",
            category: "Other Symptom",
            description: "Other symptom (e.g. constipation, sleep, itch) (ESAS-r 0-10).",
            kind: RuleKind::Esas,
            symptom_key: "other",
            evaluate: |d| esas_value(d, "other"),
        },

        // ─── Ancillary palliative-care rules ────────────────────────────
        PalliativeRule {
            id: "PALL-ANC-001",
            category: "Uncontrolled Severe Symptom",
            description: "At least one ESAS-r symptom is severe (>= 7).",
            kind: RuleKind::Ancillary,
            symptom_key: "",
            evaluate: |d| {
                let items = [
                    "pain",
                    "tiredness",
                    "drowsiness",
                    "nausea",
                    "lackOfAppetite",
                    "shortnessOfBreath",
                    "depression",
                    "anxiety",
                    "wellbeing",
                    "other",
                ];
                let mut max = 0;
                for k in items {
                    let v = esas_value(d, k);
                    if v >= 7 && v > max {
                        max = v;
                    }
                }
                max
            },
        },
        PalliativeRule {
            id: "PALL-ANC-002",
            category: "Performance Status",
            description: "PPS or AKPS <= 30 — patient is largely bed-bound.",
            kind: RuleKind::Ancillary,
            symptom_key: "",
            evaluate: |d| {
                let lowest = super::utils::lowest_performance_status(d);
                match lowest {
                    Some(v) if v <= 30 => 1,
                    _ => 0,
                }
            },
        },
        PalliativeRule {
            id: "PALL-ANC-003",
            category: "DNACPR Status",
            description: "No DNACPR documented despite low performance status (PPS/AKPS <= 30).",
            kind: RuleKind::Ancillary,
            symptom_key: "",
            evaluate: |d| {
                let lowest = super::utils::lowest_performance_status(d);
                let trigger = matches!(lowest, Some(v) if v <= 30);
                if !trigger {
                    return 0;
                }
                let dnacpr = &d.goals_of_care_acp.dnacpr_documented;
                if dnacpr == "no" || dnacpr == "unknown" { 1 } else { 0 }
            },
        },
        PalliativeRule {
            id: "PALL-ANC-004",
            category: "Advance Care Planning",
            description: "Missing core ACP documents (no RESPECT form, ADRT, or LPA documented).",
            kind: RuleKind::Ancillary,
            symptom_key: "",
            evaluate: |d| {
                let acp = &d.goals_of_care_acp;
                let has_any = acp.respect_form_completed == "yes"
                    || acp.adrt_completed == "yes"
                    || acp.lpa_health_and_welfare == "yes";
                // Only fire if at least one ACP question has been answered
                // (so we don't shout at someone who hasn't reached the
                // section yet).
                let any_answered = !acp.respect_form_completed.is_empty()
                    || !acp.adrt_completed.is_empty()
                    || !acp.lpa_health_and_welfare.is_empty();
                if any_answered && !has_any { 1 } else { 0 }
            },
        },
        PalliativeRule {
            id: "PALL-ANC-005",
            category: "Carer Burden",
            description: "Primary carer reports overwhelm or high strain.",
            kind: RuleKind::Ancillary,
            symptom_key: "",
            evaluate: |d| {
                match d.carer_family_support.carer_strain_level.as_str() {
                    "overwhelmed" => 2,
                    "high" => 1,
                    _ => 0,
                }
            },
        },
    ]
}
