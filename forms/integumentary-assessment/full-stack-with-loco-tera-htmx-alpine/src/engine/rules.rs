use super::types::AssessmentData;

/// A Braden Scale subscale rule. The `evaluate` function returns the
/// subscale score (0 when unanswered) for the corresponding column on
/// `AssessmentData::braden_scale`.
///
///   BRADEN-001  Sensory Perception   1-4
///   BRADEN-002  Moisture             1-4
///   BRADEN-003  Activity             1-4
///   BRADEN-004  Mobility             1-4
///   BRADEN-005  Nutrition            1-4
///   BRADEN-006  Friction and Shear   1-3
pub struct BradenRule {
    pub id: &'static str,
    pub category: &'static str,
    pub description: &'static str,
    pub max_score: i32,
    pub evaluate: fn(&AssessmentData) -> i32,
}

fn opt(v: Option<i32>) -> i32 {
    v.unwrap_or(0)
}

/// All Braden Scale subscale rules. Lower total score = higher pressure-ulcer risk.
pub fn all_rules() -> Vec<BradenRule> {
    vec![
        BradenRule {
            id: "BRADEN-001",
            category: "Sensory Perception",
            description: "Ability to respond meaningfully to pressure-related discomfort.",
            max_score: 4,
            evaluate: |d| opt(d.braden_scale.sensory_perception),
        },
        BradenRule {
            id: "BRADEN-002",
            category: "Moisture",
            description: "Degree to which skin is exposed to moisture.",
            max_score: 4,
            evaluate: |d| opt(d.braden_scale.moisture),
        },
        BradenRule {
            id: "BRADEN-003",
            category: "Activity",
            description: "Degree of physical activity.",
            max_score: 4,
            evaluate: |d| opt(d.braden_scale.activity),
        },
        BradenRule {
            id: "BRADEN-004",
            category: "Mobility",
            description: "Ability to change and control body position.",
            max_score: 4,
            evaluate: |d| opt(d.braden_scale.mobility),
        },
        BradenRule {
            id: "BRADEN-005",
            category: "Nutrition",
            description: "Usual food intake pattern.",
            max_score: 4,
            evaluate: |d| opt(d.braden_scale.nutrition),
        },
        BradenRule {
            id: "BRADEN-006",
            category: "Friction and Shear",
            description: "Friction & shear during repositioning and transfers.",
            max_score: 3,
            evaluate: |d| opt(d.braden_scale.friction_shear),
        },
    ]
}
