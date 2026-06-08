//! Clinical domain module.

use super::types::{AssessmentData, DomainGrade, FiredRule};

/// Clinical result.
pub struct ClinicalResult {
    /// Grade.
    pub grade: DomainGrade,
    /// Rules.
    pub rules: Vec<FiredRule>,
}

/// Grade the Clinical domain from the clinician-rated outcome classification.
///
/// A = Resolved
/// B = Improved
/// C = Unchanged
/// D = Worsened
/// E = Died
/// ''  = No classification entered
pub fn grade_clinical(data: &AssessmentData) -> ClinicalResult {
    let cls = data.clinical_outcome.outcome_classification.as_str();
    let mut rules: Vec<FiredRule> = Vec::new();
    let grade: DomainGrade = match cls {
        "resolved" => {
            rules.push(FiredRule {
                id: "CLIN-001".to_string(),
                domain: "Clinical".to_string(),
                description: "Outcome classified as Resolved".to_string(),
                grade: "A".to_string(),
            });
            "A".to_string()
        }
        "improved" => {
            rules.push(FiredRule {
                id: "CLIN-002".to_string(),
                domain: "Clinical".to_string(),
                description: "Outcome classified as Improved".to_string(),
                grade: "B".to_string(),
            });
            "B".to_string()
        }
        "unchanged" => {
            rules.push(FiredRule {
                id: "CLIN-003".to_string(),
                domain: "Clinical".to_string(),
                description: "Outcome classified as Unchanged".to_string(),
                grade: "C".to_string(),
            });
            "C".to_string()
        }
        "worsened" => {
            rules.push(FiredRule {
                id: "CLIN-004".to_string(),
                domain: "Clinical".to_string(),
                description: "Outcome classified as Worsened".to_string(),
                grade: "D".to_string(),
            });
            "D".to_string()
        }
        "died" => {
            rules.push(FiredRule {
                id: "CLIN-005".to_string(),
                domain: "Clinical".to_string(),
                description: "Outcome classified as Died".to_string(),
                grade: "E".to_string(),
            });
            "E".to_string()
        }
        _ => String::new(),
    };
    ClinicalResult { grade, rules }
}
