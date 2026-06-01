use super::types::{AdaptiveFunctioning, AssessmentData, SupportLevel};

/// One scoring rule for an adaptive-functioning item.
///
/// Each of the 10 adaptive-functioning items maps a single 4-option
/// `SupportLevel` response to a numeric score (0-3):
///
///   0 → independent
///   1 → some support
///   2 → significant support
///   3 → full support
///
/// Severity is derived from the mean across the *answered* items, so
/// partial completion is still meaningful.
pub struct LdRule {
    pub id: &'static str,
    pub category: &'static str,
    pub description: &'static str,
    pub field: fn(&AdaptiveFunctioning) -> &SupportLevel,
}

/// Convert a SupportLevel to its 0-3 numeric weight (returns None for blank).
pub fn level_score(level: &str) -> Option<i32> {
    match level {
        "independent" => Some(0),
        "some-support" => Some(1),
        "significant-support" => Some(2),
        "full-support" => Some(3),
        _ => None,
    }
}

/// All adaptive-functioning rules (rule IDs preserved verbatim from frontend).
pub fn all_rules() -> Vec<LdRule> {
    vec![
        LdRule {
            id: "LD-CON-001",
            category: "Conceptual",
            description: "Language and vocabulary",
            field: |a| &a.conceptual_language,
        },
        LdRule {
            id: "LD-CON-002",
            category: "Conceptual",
            description: "Reading and writing",
            field: |a| &a.conceptual_reading_writing,
        },
        LdRule {
            id: "LD-CON-003",
            category: "Conceptual",
            description: "Money, time and number concepts",
            field: |a| &a.conceptual_money_time,
        },
        LdRule {
            id: "LD-SOC-001",
            category: "Social",
            description: "Friendships and relationships",
            field: |a| &a.social_friendships,
        },
        LdRule {
            id: "LD-SOC-002",
            category: "Social",
            description: "Empathy and social judgement",
            field: |a| &a.social_empathy,
        },
        LdRule {
            id: "LD-SOC-003",
            category: "Social",
            description: "Social communication",
            field: |a| &a.social_communication,
        },
        LdRule {
            id: "LD-PRA-001",
            category: "Practical",
            description: "Personal self-care (washing, dressing, eating)",
            field: |a| &a.practical_self_care,
        },
        LdRule {
            id: "LD-PRA-002",
            category: "Practical",
            description: "Home living (cooking, cleaning, household tasks)",
            field: |a| &a.practical_home_living,
        },
        LdRule {
            id: "LD-PRA-003",
            category: "Practical",
            description: "Community use (shopping, transport, money)",
            field: |a| &a.practical_community,
        },
        LdRule {
            id: "LD-PRA-004",
            category: "Practical",
            description: "Work or school skills",
            field: |a| &a.practical_work_school,
        },
    ]
}

/// Evaluate a single rule against the data. Returns `Some(score)` when the
/// item has been answered with a valid SupportLevel; `None` otherwise.
pub fn evaluate(rule: &LdRule, data: &AssessmentData) -> Option<i32> {
    let v = (rule.field)(&data.adaptive_functioning);
    level_score(v.as_str())
}
