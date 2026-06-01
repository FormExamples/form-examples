use serde::{Deserialize, Serialize};

use crate::engine::types::{AssessmentData, GradingResult};
use crate::models::_entities::assessments::Model;

/// A single row in the issue-tracker dashboard.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CaseRow {
    pub id: String,
    pub reported_at: String,
    pub reporter_name: String,
    pub issue_category: String,
    pub environment: String,
    pub system_name: String,
    pub cc_summary: String,
    pub composite_priority: String,
    pub score_by_priority_rank: Option<i32>,
    pub score_by_severity_of_impact: Option<i32>,
    pub score_by_harm_grade: Option<i32>,
    pub score_by_failure_condition: String,
    pub high_priority_flag_count: u32,
}

impl CaseRow {
    /// Build a CaseRow from an issue model that has a completed grading result.
    pub fn from_model(m: &Model) -> Option<Self> {
        let data: AssessmentData = serde_json::from_value(m.data.clone()).ok()?;
        let result: GradingResult = m
            .result
            .as_ref()
            .and_then(|v| serde_json::from_value(v.clone()).ok())?;

        let high_priority_flag_count = result
            .additional_flags
            .iter()
            .filter(|f| f.priority == "high")
            .count() as u32;

        Some(Self {
            id: m.id.to_string(),
            reported_at: data.reporter.reported_at,
            reporter_name: data.reporter.reporter_name,
            issue_category: data.reporter.issue_category,
            environment: data.reporter.environment,
            system_name: data.reporter.system_name,
            cc_summary: data.cc.cc_summary,
            composite_priority: result.composite_priority,
            score_by_priority_rank: result.score_by_priority_rank,
            score_by_severity_of_impact: result.score_by_severity_of_impact,
            score_by_harm_grade: result.score_by_harm_grade,
            score_by_failure_condition: result.score_by_failure_condition,
            high_priority_flag_count,
        })
    }
}
