//! Datadog monitor webhook parser.
//!
//! Accepts a Datadog monitor alert payload (the JSON Datadog POSTs when
//! a monitor changes state) and emits a draft `IssueTrackerAssessment`.
//!
//! Mapping:
//!
//! | Datadog `alert_type` | Severity score |
//! | -------------------- | -------------- |
//! | error                | 4              |
//! | warning              | 3              |
//! | info                 | 2              |
//! | success              | 1              |
//!
//! `priority` (`P1`..`P5`) maps directly to `score_by_priority_rank`.
//! `alert_transition` of `Triggered` / `Re-triggered` routes to
//! `service-outage`; `Recovered` to `process`; everything else to
//! `software-defect`.

use super::WebhookDraft;
use crate::scoring::types::{IssueTrackerAssessment, RawScores};
use serde_json::Value;

const SOURCE: &str = "datadog-webhook";

pub fn parse(payload: &Value) -> Option<WebhookDraft> {
    let title = payload
        .get("title")
        .and_then(Value::as_str)
        .unwrap_or("Datadog monitor")
        .to_string();

    let alert_type = payload
        .get("alert_type")
        .and_then(Value::as_str)
        .unwrap_or("error");
    let severity = severity_for_alert_type(alert_type);

    let alert_transition = payload
        .get("alert_transition")
        .and_then(Value::as_str)
        .unwrap_or("");
    let category = category_for_transition(alert_transition);

    let priority_rank = payload
        .get("priority")
        .and_then(Value::as_str)
        .and_then(|s| s.strip_prefix('P'))
        .and_then(|n| n.parse::<i32>().ok());

    let tags = payload
        .get("tags")
        .and_then(Value::as_str)
        .unwrap_or("");
    let env = tag_value(tags, "env").unwrap_or_default();
    let service = tag_value(tags, "service").unwrap_or_default();
    let host = tag_value(tags, "host").unwrap_or_default();

    let monitor_id = payload
        .get("id")
        .and_then(value_to_string)
        .unwrap_or_default();
    let link = payload
        .get("link")
        .and_then(Value::as_str)
        .unwrap_or("")
        .to_string();
    let date = payload
        .get("date")
        .and_then(timestamp_to_iso)
        .unwrap_or_default();

    let mut data = IssueTrackerAssessment::default();
    data.reporter.reporter_name = format!("Datadog ({monitor_id})");
    data.reporter.reporter_role = "monitoring-alert".into();
    data.reporter.issue_category = category.into();
    data.reporter.environment = env;
    data.reporter.system_name = if !service.is_empty() {
        service
    } else {
        host
    };
    data.reporter.discovered_at = date.clone();
    data.reporter.reported_at = date;
    data.reporter.external_reference = format!("datadog:{monitor_id}");

    data.scores = RawScores {
        score_by_severity_of_impact: Some(severity),
        score_by_priority_rank: priority_rank,
        ..Default::default()
    };

    Some(WebhookDraft {
        cc_summary: format!("[{SOURCE}] {title}"),
        external_reference: if !link.is_empty() {
            link
        } else {
            data.reporter.external_reference.clone()
        },
        assessment: data,
    })
}

fn severity_for_alert_type(t: &str) -> u8 {
    match t {
        "error" => 4,
        "warning" => 3,
        "info" => 2,
        "success" => 1,
        _ => 3,
    }
}

fn category_for_transition(t: &str) -> &'static str {
    match t {
        "Triggered" | "Re-triggered" => "service-outage",
        "Recovered" => "process",
        _ => "software-defect",
    }
}

fn tag_value(tags: &str, key: &str) -> Option<String> {
    let prefix = format!("{key}:");
    tags.split(',')
        .map(str::trim)
        .find_map(|t| t.strip_prefix(&prefix).map(str::to_string))
}

fn timestamp_to_iso(v: &Value) -> Option<String> {
    if let Some(s) = v.as_str() {
        return Some(s.to_string());
    }
    if let Some(n) = v.as_i64() {
        return Some(format!("epoch:{n}"));
    }
    if let Some(n) = v.as_f64() {
        return Some(format!("epoch:{n}"));
    }
    None
}

fn value_to_string(v: &Value) -> Option<String> {
    if let Some(s) = v.as_str() {
        return Some(s.to_string());
    }
    if let Some(n) = v.as_i64() {
        return Some(n.to_string());
    }
    None
}
