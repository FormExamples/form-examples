//! Clavien dindo grader module.

use super::clavien_dindo_rules::rule_by_grade;
use super::flagged_issues::detect_additional_flags;
use super::types::{AssessmentData, ClavienDindoGradeKey, FiredRule, GradingResult};
use super::utils::grade_order;

/// Pure function: grade a post-operative report using the Clavien-Dindo
/// classification. Returns the overall (worst) grade, the count of graded
/// complications, the per-complication audit trail, and the safety flags.
pub fn grade(data: &AssessmentData) -> GradingResult {
    let timestamp = chrono::Utc::now().to_rfc3339();
    let (overall_grade, complication_count, fired_rules) = calculate_clavien_dindo(data);
    let additional_flags = detect_additional_flags(data);

    GradingResult {
        overall_grade,
        complication_count,
        fired_rules,
        additional_flags,
        timestamp,
    }
}

/// Evaluate complications and return `(overallGrade, complicationCount, firedRules)`.
///
/// Rules (mirror of `clavien-dindo-grader.js`):
/// - If the user explicitly recorded `complicationsOccurred = 'no'`, OR has
///   not added any complications at all and `complicationsOccurred = 'no'`,
///   the overall grade is `grade-0` (no complication).
/// - Otherwise, the overall grade is the worst grade across all entered
///   complications (using the canonical Clavien-Dindo ordering).
/// - Unanswered grade fields are skipped; if all complications are
///   unanswered, the overall grade is `grade-0`.
pub fn calculate_clavien_dindo(
    data: &AssessmentData,
) -> (ClavienDindoGradeKey, u32, Vec<FiredRule>) {
    let mut fired_rules: Vec<FiredRule> = Vec::new();
    let complications = &data.complications_assessment.complications;
    let mut worst_order: i32 = 0;
    let mut worst_grade: ClavienDindoGradeKey = "grade-0".to_string();
    let mut graded: u32 = 0;

    for (i, c) in complications.iter().enumerate() {
        if c.grade.is_empty() {
            continue;
        }
        let order = grade_order(&c.grade);
        if order < 0 {
            continue;
        }
        graded += 1;
        let category = if c.description.trim().is_empty() {
            "(complication not described)".to_string()
        } else {
            c.description.clone()
        };
        let description = rule_by_grade(&c.grade)
            .map(|r| r.description.to_string())
            .unwrap_or_default();
        fired_rules.push(FiredRule {
            id: format!("CD-{}", i + 1),
            category,
            description,
            grade: c.grade.clone(),
        });
        if order > worst_order {
            worst_order = order;
            worst_grade = c.grade.clone();
        }
    }

    // If user explicitly said "no complications" we record Grade 0.
    if data.complications_assessment.complications_occurred == "no" && graded == 0 {
        worst_grade = "grade-0".to_string();
    }

    // If the form hasn't been touched at all, default to Grade 0.
    if graded == 0 && data.complications_assessment.complications_occurred != "yes" {
        worst_grade = "grade-0".to_string();
    }

    (worst_grade, graded, fired_rules)
}
