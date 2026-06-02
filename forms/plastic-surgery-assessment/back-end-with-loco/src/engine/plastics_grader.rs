use super::flagged_issues::detect_additional_flags;
use super::plastics_rules::all_rules;
use super::types::{AssessmentData, FiredRule, GradingResult, RiskLevel};

/// Derive ASA class (1..=5) from clinician input.
fn derive_asa_class(data: &AssessmentData) -> Option<i32> {
    match data.anaesthetic_risk.asa_class.as_str() {
        "1" => Some(1),
        "2" => Some(2),
        "3" => Some(3),
        "4" => Some(4),
        "5" => Some(5),
        _ => None,
    }
}

/// Derive wound class (1..=4) from clinician input.
fn derive_wound_class(data: &AssessmentData) -> Option<i32> {
    match data.wound_tissue_assessment.wound_classification.as_str() {
        "clean" => Some(1),
        "clean-contaminated" => Some(2),
        "contaminated" => Some(3),
        "dirty" => Some(4),
        _ => None,
    }
}

/// Derive surgical complexity score (1..=4) from clinician input.
fn derive_complexity_score(data: &AssessmentData) -> Option<i32> {
    match data
        .procedure_planning_consent
        .procedure_complexity
        .as_str()
    {
        "1" => Some(1),
        "2" => Some(2),
        "3" => Some(3),
        "4" => Some(4),
        _ => None,
    }
}

/// Reduce fired rules + classifications to an overall risk level.
fn derive_overall_risk(
    fired_rules: &[FiredRule],
    asa_class: Option<i32>,
    wound_class: Option<i32>,
    complexity_score: Option<i32>,
) -> RiskLevel {
    let max_grade = fired_rules.iter().map(|r| r.grade).max().unwrap_or(0);

    if max_grade >= 4
        || asa_class.map(|v| v >= 4).unwrap_or(false)
        || wound_class == Some(4)
        || complexity_score == Some(4)
    {
        return "critical".to_string();
    }
    if max_grade >= 3
        || asa_class == Some(3)
        || wound_class == Some(3)
        || complexity_score == Some(3)
    {
        return "high".to_string();
    }
    if max_grade >= 2
        || asa_class == Some(2)
        || wound_class == Some(2)
        || complexity_score == Some(2)
    {
        return "moderate".to_string();
    }
    "low".to_string()
}

/// Evaluate every rule against the data, returning the rules that fired.
pub fn run_rules(data: &AssessmentData) -> Vec<FiredRule> {
    let mut out = Vec::new();
    for rule in all_rules() {
        if (rule.evaluate)(data) {
            out.push(FiredRule {
                id: rule.id.to_string(),
                category: rule.category.to_string(),
                description: rule.description.to_string(),
                grade: rule.grade,
            });
        }
    }
    out
}

/// Pure function: grades a Plastic Surgery Assessment.
pub fn grade(data: &AssessmentData) -> GradingResult {
    let timestamp = chrono::Utc::now().to_rfc3339();
    let fired_rules = run_rules(data);
    let additional_flags = detect_additional_flags(data);

    let asa_class = derive_asa_class(data);
    let wound_class = derive_wound_class(data);
    let complexity_score = derive_complexity_score(data);
    let overall_risk =
        derive_overall_risk(&fired_rules, asa_class, wound_class, complexity_score);

    GradingResult {
        asa_class,
        wound_class,
        complexity_score,
        overall_risk,
        fired_rules,
        additional_flags,
        timestamp,
    }
}
