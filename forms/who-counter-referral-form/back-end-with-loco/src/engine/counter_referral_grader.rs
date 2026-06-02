//! WHO Counter-Referral Form grader. Combines completeness validation and
//! clinical flagged-issue detection into a single [`GradingResult`].

use super::counter_referral_validator::validate_counter_referral;
use super::flagged_issues::detect_flagged_issues;
use super::types::{AssessmentData, FlagPriority, GradingResult};

/// Pure function: grades a WHO Counter-Referral Form submission.
pub fn grade(data: &AssessmentData) -> GradingResult {
    let timestamp = chrono::Utc::now().to_rfc3339();
    let validation = validate_counter_referral(data);
    let flagged_issues = detect_flagged_issues(data);

    let overall_percent = if validation.total_required == 0 {
        0
    } else {
        ((validation.total_satisfied as f64 / validation.total_required as f64) * 100.0).round()
            as u32
    };

    let form_status = if validation.complete {
        let any_urgent = flagged_issues
            .iter()
            .any(|f| f.priority == FlagPriority::Urgent);
        if any_urgent {
            "complete-with-concerns".to_string()
        } else {
            "complete".to_string()
        }
    } else if validation.total_satisfied == 0 {
        "not-started".to_string()
    } else {
        "in-progress".to_string()
    };

    GradingResult {
        validation,
        flagged_issues,
        overall_percent,
        form_status,
        timestamp,
    }
}
