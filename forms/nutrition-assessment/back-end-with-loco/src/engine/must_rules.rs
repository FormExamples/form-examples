use super::types::AssessmentData;

/// Malnutrition Universal Screening Tool (MUST) scoring rule. Each rule
/// evaluates a single screening step against the assessment data and returns
/// a per-step score:
///
/// - `MUST-001`: BMI score (0-2)
/// - `MUST-002`: Unplanned weight-loss score (0-2)
/// - `MUST-003`: Acute disease effect score (0 or 2)
///
/// `evaluate` returns `-1` when the step is unanswered (so the grader can
/// distinguish "not answered yet" from "answered with score 0").
pub struct MustRule {
    pub id: &'static str,
    pub category: &'static str,
    pub description: &'static str,
    pub evaluate: fn(&AssessmentData) -> i32,
}

/// All MUST screening rules in canonical order.
///
/// MUST total score interpretation:
/// - 0 -> low risk (well-nourished)
/// - 1 -> medium risk (at risk)
/// - >=2 -> high risk (malnourished)
pub fn all_rules() -> Vec<MustRule> {
    vec![
        MustRule {
            id: "MUST-001",
            category: "BMI Score",
            description: "Body Mass Index (BMI) category.",
            evaluate: |d| match d.nutritional_screening.bmi_category.as_str() {
                ">=20" => 0,
                "18.5-20" => 1,
                "<18.5" => 2,
                _ => -1,
            },
        },
        MustRule {
            id: "MUST-002",
            category: "Weight Loss Score",
            description: "Unplanned weight loss in the past 3-6 months.",
            evaluate: |d| match d.nutritional_screening.weight_loss_category.as_str() {
                "<5" => 0,
                "5-10" => 1,
                ">10" => 2,
                _ => -1,
            },
        },
        MustRule {
            id: "MUST-003",
            category: "Acute Disease Effect Score",
            description:
                "Acutely ill and there has been or is likely to be no nutritional intake for >5 days.",
            evaluate: |d| match d.nutritional_screening.acute_disease.as_str() {
                "none" => 0,
                "acutely-ill-no-intake-5d" => 2,
                _ => -1,
            },
        },
    ]
}
