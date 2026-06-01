use super::endo_rules::all_rules;
use super::flagged_issues::detect_additional_flags;
use super::types::{AssessmentData, FiredRule, GradingResult};
use super::utils::calculate_ehp30_total;

/// Pure function: grade an endometriosis assessment. Returns a
/// [`GradingResult`] containing ASRM stage, ASRM points, EHP-30 score,
/// overall severity, fired rules, and safety flags.
pub fn grade(data: &AssessmentData) -> GradingResult {
    let timestamp = chrono::Utc::now().to_rfc3339();
    let fired_rules = run_rules(data);
    let additional_flags = detect_additional_flags(data);

    let asrm_stage = derive_asrm_stage(data, &fired_rules);
    let asrm_points = calculate_asrm_points(&fired_rules, data);
    let ehp30_score = calculate_ehp30_total(
        data.quality_of_life.pain_domain_score,
        data.quality_of_life.control_powerlessness_score,
        data.quality_of_life.emotional_wellbeing_score,
        data.quality_of_life.social_support_score,
        data.quality_of_life.self_image_score,
    );
    let overall_severity = derive_overall_severity(&fired_rules, asrm_stage, ehp30_score);

    GradingResult {
        asrm_stage,
        asrm_points,
        ehp30_score,
        overall_severity,
        fired_rules,
        additional_flags,
        timestamp,
    }
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

/// Derive ASRM Stage from surgical history or symptom burden.
pub fn derive_asrm_stage(data: &AssessmentData, fired_rules: &[FiredRule]) -> Option<i32> {
    let surgical_stage = data.surgical_history.asrm_stage_at_surgery.as_str();
    match surgical_stage {
        "I" => return Some(1),
        "II" => return Some(2),
        "III" => return Some(3),
        "IV" => return Some(4),
        _ => {}
    }

    let max_grade = fired_rules.iter().map(|r| r.grade).max().unwrap_or(0);
    let total_grade: i32 = fired_rules.iter().map(|r| r.grade).sum();

    if max_grade >= 4 || total_grade > 40 {
        return Some(4);
    }
    if max_grade >= 3 || total_grade > 15 {
        return Some(3);
    }
    if max_grade >= 2 || total_grade > 5 {
        return Some(2);
    }
    if !fired_rules.is_empty() {
        return Some(1);
    }
    None
}

/// Approximate ASRM points from fired rules + organ involvement extras.
pub fn calculate_asrm_points(fired_rules: &[FiredRule], data: &AssessmentData) -> i32 {
    let mut points = 0;
    for rule in fired_rules {
        points += match rule.grade {
            1 => 1,
            2 => 4,
            3 => 8,
            4 => 16,
            _ => 0,
        };
    }
    if data.gastrointestinal_symptoms.bowel_obstruction_symptoms == "yes" {
        points += 10;
    }
    if data.urinary_symptoms.urinary_obstruction_symptoms == "yes" {
        points += 10;
    }
    if data.surgical_history.endometrioma_drained == "yes" {
        points += 5;
    }
    points
}

/// Overall severity from rules, ASRM stage, and EHP-30 score.
pub fn derive_overall_severity(
    fired_rules: &[FiredRule],
    asrm_stage: Option<i32>,
    ehp30_score: Option<i32>,
) -> String {
    let max_grade = fired_rules.iter().map(|r| r.grade).max().unwrap_or(0);
    if max_grade >= 4 || asrm_stage == Some(4) {
        return "critical".to_string();
    }
    if max_grade >= 3
        || asrm_stage == Some(3)
        || ehp30_score.map(|n| n > 75).unwrap_or(false)
    {
        return "severe".to_string();
    }
    if max_grade >= 2
        || asrm_stage == Some(2)
        || ehp30_score.map(|n| n > 50).unwrap_or(false)
    {
        return "moderate".to_string();
    }
    "mild".to_string()
}
