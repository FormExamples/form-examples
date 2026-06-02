use super::flagged_issues::detect_additional_flags;
use super::rules::axis_rules;
use super::types::{AssessmentData, AxisGrade, AxisStatus, FiredRule, GradingResult};
use super::utils::max_status;

/// Pure function: grade an endocrinology assessment.
///
/// For each axis, run the corresponding rule. Collect the resulting
/// `AxisGrade`s, derive an overall status as the most-severe axis status,
/// and detect additional clinician-facing flags.
pub fn calculate_grades(data: &AssessmentData) -> GradingResult {
    let mut axis_grades: Vec<AxisGrade> = Vec::new();
    let mut fired_rules: Vec<FiredRule> = Vec::new();
    let mut overall: AxisStatus = String::new();

    for rule in axis_rules() {
        let (status, findings) = (rule.evaluate)(data);
        let rationale = if findings.is_empty() {
            if status == "normal" {
                "Indices within reference range.".to_string()
            } else if status.is_empty() {
                "No data provided.".to_string()
            } else {
                "Status derived from clinical features.".to_string()
            }
        } else {
            findings.join(" ")
        };

        axis_grades.push(AxisGrade {
            axis: rule.axis.to_string(),
            status: status.clone(),
            rationale,
            contributing_findings: findings.clone(),
        });

        if !status.is_empty() {
            overall = max_status(&overall, &status);
            fired_rules.push(FiredRule {
                id: rule.id.to_string(),
                category: rule.axis.to_string(),
                description: rule.description.to_string(),
                status: status.clone(),
            });
        }
    }

    let answered_count = axis_grades.iter().filter(|g| !g.status.is_empty()).count() as u32;
    let overall_status = if overall.is_empty() {
        "normal".to_string()
    } else {
        overall
    };

    let additional_flags = detect_additional_flags(data);
    let timestamp = chrono::Utc::now().to_rfc3339();

    GradingResult {
        axis_grades,
        overall_status,
        answered_count,
        fired_rules,
        additional_flags,
        timestamp,
    }
}
