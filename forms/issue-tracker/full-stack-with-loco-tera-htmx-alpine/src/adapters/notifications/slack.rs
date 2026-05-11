//! Slack Block Kit renderer.
//!
//! Produces a JSON payload compatible with the Slack Web API
//! `chat.postMessage` and incoming-webhook endpoints. Uses the modern
//! Block Kit format (header / section / actions blocks) rather than
//! legacy attachments.

use super::should_notify;
use crate::scoring::types::{CompositePriority, GradeResult, IssueTrackerAssessment};
use serde_json::{json, Value};

const ICONS: &[(&str, &str)] = &[
    ("low", ":large_green_circle:"),
    ("moderate", ":large_yellow_circle:"),
    ("high", ":large_orange_circle:"),
    ("critical", ":red_circle:"),
];

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

    let icon = icon_for(result.composite_priority);
    let composite = result.composite_priority.as_str().to_uppercase();

    let mut blocks: Vec<Value> = vec![
        json!({
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": format!("{icon} [{composite}] {issue_id}"),
            },
        }),
        json!({
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": format!("*{cc_summary}*"),
            },
        }),
        json!({
            "type": "section",
            "fields": fields_block(data, result),
        }),
    ];

    if !result.additional_flags.is_empty() {
        let lines: Vec<String> = result
            .additional_flags
            .iter()
            .map(|f| {
                let cat = serde_json::to_value(f.category)
                    .ok()
                    .and_then(|v| v.as_str().map(str::to_owned))
                    .unwrap_or_else(|| "other".into());
                format!("• *{cat}* — {desc}", desc = f.description)
            })
            .collect();
        blocks.push(json!({
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": format!("*Safety flags ({count}):*\n{body}",
                                count = result.additional_flags.len(),
                                body = lines.join("\n")),
            },
        }));
    }

    blocks.push(json!({
        "type": "actions",
        "elements": [{
            "type": "button",
            "text": {"type": "plain_text", "text": "Open in dashboard"},
            "url": dashboard_url,
            "style": if matches!(result.composite_priority, CompositePriority::Critical) { "danger" } else { "primary" },
        }],
    }));

    Some(json!({
        "text": format!("[{composite}] {issue_id} — {cc_summary}"),
        "blocks": blocks,
    }))
}

fn icon_for(p: CompositePriority) -> &'static str {
    ICONS
        .iter()
        .find(|(k, _)| *k == p.as_str())
        .map(|(_, v)| *v)
        .unwrap_or(":white_circle:")
}

fn fields_block(data: &IssueTrackerAssessment, result: &GradeResult) -> Vec<Value> {
    let mut out = Vec::<Value>::new();
    let mut push_pair = |label: &str, value: String| {
        out.push(json!({"type": "mrkdwn", "text": format!("*{label}*\n{value}")}));
    };
    push_pair(
        "System",
        if data.reporter.system_name.is_empty() {
            "—".into()
        } else {
            data.reporter.system_name.clone()
        },
    );
    push_pair(
        "Environment",
        if data.reporter.environment.is_empty() {
            "—".into()
        } else {
            data.reporter.environment.clone()
        },
    );
    push_pair("Severity", scalar(result.score_by_severity_of_impact));
    push_pair("Harm", scalar(result.score_by_harm_grade));
    push_pair(
        "Failure",
        if result.score_by_failure_condition.as_str().is_empty() {
            "—".into()
        } else {
            result.score_by_failure_condition.as_str().into()
        },
    );
    push_pair(
        "Frequency",
        result
            .score_by_frequency_percent
            .map(|f| format!("{f}%"))
            .unwrap_or_else(|| "—".into()),
    );
    out
}

fn scalar<T: std::fmt::Display>(v: Option<T>) -> String {
    v.map(|x| x.to_string()).unwrap_or_else(|| "—".into())
}
