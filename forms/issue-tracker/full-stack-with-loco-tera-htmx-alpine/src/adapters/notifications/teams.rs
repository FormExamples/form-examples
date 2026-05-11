//! Microsoft Teams Adaptive Card renderer.
//!
//! Produces an Adaptive Card 1.5 JSON payload wrapped in the connector
//! card envelope expected by Teams incoming webhooks. The body is a
//! `Container` with a title `TextBlock`, a `FactSet` of scores, and a
//! `Container` per safety flag.

use super::should_notify;
use crate::scoring::types::{CompositePriority, GradeResult, IssueTrackerAssessment};
use serde_json::{json, Value};

pub fn render(
    issue_id: &str,
    cc_summary: &str,
    dashboard_url: &str,
    data: &IssueTrackerAssessment,
    result: &GradeResult,
) -> Option<Value> {
    if !should_notify(result.composite_priority) {
        return None;
    }

    let composite = result.composite_priority.as_str().to_uppercase();
    let colour = colour_for(result.composite_priority);

    let mut body: Vec<Value> = vec![
        json!({
            "type": "TextBlock",
            "size": "Large",
            "weight": "Bolder",
            "color": colour,
            "text": format!("[{composite}] {issue_id}"),
            "wrap": true,
        }),
        json!({
            "type": "TextBlock",
            "weight": "Bolder",
            "text": cc_summary,
            "wrap": true,
        }),
        json!({
            "type": "FactSet",
            "facts": facts(data, result),
        }),
    ];

    if !result.additional_flags.is_empty() {
        body.push(json!({
            "type": "TextBlock",
            "weight": "Bolder",
            "text": format!("Safety flags ({})", result.additional_flags.len()),
            "wrap": true,
            "spacing": "Medium",
        }));
        for f in &result.additional_flags {
            let cat = serde_json::to_value(f.category)
                .ok()
                .and_then(|v| v.as_str().map(str::to_owned))
                .unwrap_or_else(|| "other".into());
            body.push(json!({
                "type": "TextBlock",
                "text": format!("**{cat}** — {}", f.description),
                "wrap": true,
                "spacing": "Small",
            }));
        }
    }

    Some(json!({
        "type": "message",
        "attachments": [{
            "contentType": "application/vnd.microsoft.card.adaptive",
            "content": {
                "type": "AdaptiveCard",
                "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                "version": "1.5",
                "body": body,
                "actions": [{
                    "type": "Action.OpenUrl",
                    "title": "Open in dashboard",
                    "url": dashboard_url,
                }],
            },
        }],
    }))
}

fn colour_for(p: CompositePriority) -> &'static str {
    match p {
        CompositePriority::Critical | CompositePriority::High => "Attention",
        CompositePriority::Moderate => "Warning",
        CompositePriority::Low => "Good",
    }
}

fn facts(data: &IssueTrackerAssessment, result: &GradeResult) -> Vec<Value> {
    let mut facts: Vec<(&str, String)> = vec![];
    facts.push(("System", non_empty(&data.reporter.system_name)));
    facts.push(("Environment", non_empty(&data.reporter.environment)));
    facts.push(("Severity", scalar(result.score_by_severity_of_impact)));
    facts.push(("Harm grade", scalar(result.score_by_harm_grade)));
    facts.push((
        "Failure condition",
        non_empty(result.score_by_failure_condition.as_str()),
    ));
    facts.push((
        "Frequency",
        result
            .score_by_frequency_percent
            .map(|f| format!("{f}%"))
            .unwrap_or_else(|| "—".into()),
    ));
    facts
        .into_iter()
        .map(|(k, v)| json!({"title": k, "value": v}))
        .collect()
}

fn non_empty(s: &str) -> String {
    if s.is_empty() {
        "—".into()
    } else {
        s.into()
    }
}

fn scalar<T: std::fmt::Display>(v: Option<T>) -> String {
    v.map(|x| x.to_string()).unwrap_or_else(|| "—".into())
}
