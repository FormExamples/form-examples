//! GitHub Issues import parser.
//!
//! Accepts the JSON shape returned by `GET /repos/{owner}/{repo}/issues/{n}`
//! (REST API v3 / 2022-11-28). Maps GitHub labels to issue categories
//! and uses `state` (`open`/`closed`) for the lifecycle.
//!
//! Label mapping (case-insensitive, first match wins):
//!
//! | GitHub label                       | Issue category    |
//! | ---------------------------------- | ----------------- |
//! | `bug`, `defect`                    | software-defect   |
//! | `security`, `vulnerability`        | security          |
//! | `performance`                      | performance       |
//! | `outage`                           | service-outage    |
//! | `enhancement`, `feature`           | process           |
//! | `documentation`, `docs`            | process           |
//! | (none of the above)                | software-defect   |

use super::ImportDraft;
use crate::scoring::types::{IssueTrackerAssessment, RawScores};
use serde_json::Value;

const SOURCE: &str = "github";

pub fn parse(payload: &Value) -> Option<ImportDraft> {
    let title = payload
        .get("title")
        .and_then(Value::as_str)
        .unwrap_or("(no title)")
        .to_string();
    let number = payload.get("number").and_then(Value::as_i64);
    let html_url = payload
        .get("html_url")
        .and_then(Value::as_str)
        .unwrap_or("")
        .to_string();
    let state = payload
        .get("state")
        .and_then(Value::as_str)
        .unwrap_or("open");
    let created_at = payload
        .get("created_at")
        .and_then(Value::as_str)
        .unwrap_or("")
        .to_string();
    let assignees = payload
        .get("assignees")
        .and_then(Value::as_array)
        .map(|arr| {
            arr.iter()
                .filter_map(|a| a.get("login").and_then(Value::as_str))
                .collect::<Vec<_>>()
                .join(", ")
        })
        .unwrap_or_default();

    // Repository name: prefer `repository.full_name`; fall back to
    // parsing the html_url path (`https://github.com/owner/repo/issues/N`).
    let repo = payload
        .pointer("/repository/full_name")
        .and_then(Value::as_str)
        .map(str::to_string)
        .or_else(|| repo_from_url(&html_url))
        .unwrap_or_default();

    let labels: Vec<String> = payload
        .get("labels")
        .and_then(Value::as_array)
        .map(|arr| {
            arr.iter()
                .filter_map(|l| l.get("name").and_then(Value::as_str))
                .map(|s| s.to_lowercase())
                .collect()
        })
        .unwrap_or_default();

    let category = category_for_labels(&labels);
    let status = if state == "closed" { "closed" } else { "open" };
    let external_ref = match number {
        Some(n) => format!("github:{repo}#{n}"),
        None => format!("github:{html_url}"),
    };

    let mut data = IssueTrackerAssessment::default();
    data.reporter.reporter_name = "GitHub import".into();
    data.reporter.reporter_role = "other".into();
    data.reporter.issue_category = category.into();
    data.reporter.environment = "".into();
    data.reporter.system_name = repo;
    data.reporter.discovered_at = created_at.clone();
    data.reporter.reported_at = created_at;
    data.reporter.external_reference = external_ref.clone();
    data.reporter.component = assignees;

    data.scores = RawScores {
        score_by_priority_rank: priority_for_labels(&labels),
        ..Default::default()
    };

    let _ = status; // status currently passed via separate channel by the importer

    Some(ImportDraft {
        cc_summary: format!("[github] {title}"),
        external_reference: if !html_url.is_empty() {
            html_url
        } else {
            external_ref
        },
        source: SOURCE,
        assessment: data,
    })
}

fn category_for_labels(labels: &[String]) -> &'static str {
    for l in labels {
        match l.as_str() {
            "bug" | "defect" => return "software-defect",
            "security" | "vulnerability" => return "security",
            "performance" => return "performance",
            "outage" => return "service-outage",
            "enhancement" | "feature" => return "process",
            "documentation" | "docs" => return "process",
            _ => {}
        }
    }
    "software-defect"
}

fn priority_for_labels(labels: &[String]) -> Option<i32> {
    for l in labels {
        match l.as_str() {
            "p0" | "priority:0" | "priority/0" => return Some(1),
            "p1" | "priority:1" | "priority/1" => return Some(2),
            "p2" | "priority:2" | "priority/2" => return Some(3),
            "p3" | "priority:3" | "priority/3" => return Some(4),
            _ => {}
        }
    }
    None
}

fn repo_from_url(url: &str) -> Option<String> {
    let prefix = "https://github.com/";
    let rest = url.strip_prefix(prefix)?;
    let mut parts = rest.split('/');
    let owner = parts.next()?;
    let repo = parts.next()?;
    if owner.is_empty() || repo.is_empty() {
        return None;
    }
    Some(format!("{owner}/{repo}"))
}
