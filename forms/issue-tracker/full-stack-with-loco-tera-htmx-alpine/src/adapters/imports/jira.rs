//! Jira Cloud Issue import parser.
//!
//! Accepts the JSON shape returned by `GET /rest/api/3/issue/{key}`.
//! Uses `fields.priority.name` for priority rank (Highest..Lowest →
//! 1..5) and `fields.issuetype.name` for issue category.
//!
//! Issue type mapping (case-insensitive):
//!
//! | Jira issue type        | Issue category    |
//! | ---------------------- | ----------------- |
//! | bug, defect            | software-defect   |
//! | incident, outage       | service-outage    |
//! | security, vulnerability| security          |
//! | task, story, epic      | process           |
//! | improvement            | process           |
//! | change                 | process           |
//! | (anything else)        | software-defect   |

use super::ImportDraft;
use crate::scoring::types::{IssueTrackerAssessment, RawScores};
use serde_json::Value;

const SOURCE: &str = "jira";

pub fn parse(payload: &Value) -> Option<ImportDraft> {
    let key = payload.get("key").and_then(Value::as_str)?.to_string();
    let fields = payload.get("fields")?;
    let summary = fields
        .get("summary")
        .and_then(Value::as_str)
        .unwrap_or("(no summary)")
        .to_string();
    let issue_type = fields
        .pointer("/issuetype/name")
        .and_then(Value::as_str)
        .unwrap_or("")
        .to_lowercase();
    let priority = fields.pointer("/priority/name").and_then(Value::as_str);
    let project_key = fields
        .pointer("/project/key")
        .and_then(Value::as_str)
        .unwrap_or("")
        .to_string();
    let assignee = fields
        .pointer("/assignee/displayName")
        .and_then(Value::as_str)
        .unwrap_or("")
        .to_string();
    let created = fields
        .get("created")
        .and_then(Value::as_str)
        .unwrap_or("")
        .to_string();
    let environment = fields
        .pointer("/environment")
        .and_then(Value::as_str)
        .unwrap_or("")
        .to_string();
    let self_url = payload
        .get("self")
        .and_then(Value::as_str)
        .unwrap_or("")
        .to_string();

    let category = category_for_issue_type(&issue_type);
    let priority_rank = priority.and_then(priority_rank_for_jira);

    let mut data = IssueTrackerAssessment::default();
    data.reporter.reporter_name = "Jira import".into();
    data.reporter.reporter_role = "other".into();
    data.reporter.issue_category = category.into();
    data.reporter.environment = environment;
    data.reporter.system_name = project_key.clone();
    data.reporter.component = assignee;
    data.reporter.discovered_at = created.clone();
    data.reporter.reported_at = created;
    data.reporter.external_reference = format!("jira:{key}");

    data.scores = RawScores {
        score_by_priority_rank: priority_rank,
        ..Default::default()
    };

    let external = if !self_url.is_empty() {
        self_url
    } else {
        data.reporter.external_reference.clone()
    };

    Some(ImportDraft {
        cc_summary: format!("[jira:{key}] {summary}"),
        external_reference: external,
        source: SOURCE,
        assessment: data,
    })
}

fn category_for_issue_type(t: &str) -> &'static str {
    match t {
        "bug" | "defect" => "software-defect",
        "incident" | "outage" => "service-outage",
        "security" | "vulnerability" => "security",
        "task" | "story" | "epic" | "improvement" | "change" | "sub-task" => "process",
        _ => "software-defect",
    }
}

fn priority_rank_for_jira(name: &str) -> Option<i32> {
    match name.to_lowercase().as_str() {
        "highest" | "blocker" | "p0" => Some(1),
        "high" | "critical" | "p1" => Some(2),
        "medium" | "major" | "p2" => Some(3),
        "low" | "minor" | "p3" => Some(4),
        "lowest" | "trivial" | "p4" | "p5" => Some(5),
        _ => None,
    }
}
