//! Sentry webhook parser.
//!
//! Accepts a Sentry "issue alert" or "event alert" webhook payload and
//! emits a draft `IssueTrackerAssessment`. Maps the Sentry severity
//! `level` to `score_by_severity_of_impact` per:
//!
//! | Sentry level | Severity score |
//! | ------------ | -------------- |
//! | fatal        | 5              |
//! | error        | 4              |
//! | warning      | 3              |
//! | info         | 2              |
//! | debug        | 1              |

use super::WebhookDraft;
use crate::scoring::types::{IssueTrackerAssessment, RawScores};
use serde_json::Value;

const SOURCE: &str = "sentry-webhook";

pub fn parse(payload: &Value) -> Option<WebhookDraft> {
    let event = payload.pointer("/data/event")?;
    let issue = payload.pointer("/data/issue")?;

    let title = issue
        .get("title")
        .and_then(Value::as_str)
        .or_else(|| event.get("title").and_then(Value::as_str))
        .unwrap_or("Sentry alert")
        .to_string();

    let level = event
        .get("level")
        .and_then(Value::as_str)
        .unwrap_or("error");
    let severity = severity_for_level(level);

    let environment = environment_from_tags(event).unwrap_or_default();
    let platform = event
        .get("platform")
        .and_then(Value::as_str)
        .unwrap_or("")
        .to_string();
    let project_slug = payload
        .pointer("/data/project_slug")
        .and_then(Value::as_str)
        .unwrap_or("")
        .to_string();

    let timestamp = event
        .get("timestamp")
        .and_then(timestamp_to_iso)
        .unwrap_or_default();

    let short_id = issue
        .get("shortId")
        .and_then(Value::as_str)
        .unwrap_or("")
        .to_string();
    let permalink = issue
        .get("permalink")
        .and_then(Value::as_str)
        .unwrap_or("")
        .to_string();

    let mut data = IssueTrackerAssessment::default();
    data.reporter.reporter_name = format!("Sentry ({short_id})");
    data.reporter.reporter_role = "monitoring-alert".into();
    data.reporter.issue_category = if level == "fatal" || level == "error" {
        "service-outage".into()
    } else {
        "software-defect".into()
    };
    data.reporter.environment = environment;
    data.reporter.system_name = if !project_slug.is_empty() {
        project_slug
    } else {
        platform
    };
    data.reporter.discovered_at = timestamp.clone();
    data.reporter.reported_at = timestamp;
    data.reporter.external_reference = if !short_id.is_empty() {
        format!("sentry:{short_id}")
    } else {
        format!("sentry:{}", event.get("event_id").and_then(Value::as_str).unwrap_or(""))
    };

    data.scores = RawScores {
        score_by_severity_of_impact: Some(severity),
        ..Default::default()
    };

    Some(WebhookDraft {
        cc_summary: format!("[{SOURCE}] {title}"),
        external_reference: if !permalink.is_empty() {
            permalink
        } else {
            data.reporter.external_reference.clone()
        },
        assessment: data,
    })
}

fn severity_for_level(level: &str) -> u8 {
    match level {
        "fatal" => 5,
        "error" => 4,
        "warning" => 3,
        "info" => 2,
        _ => 1,
    }
}

fn environment_from_tags(event: &Value) -> Option<String> {
    let tags = event.get("tags")?.as_array()?;
    for tag in tags {
        let arr = tag.as_array()?;
        if arr.len() >= 2 {
            let k = arr[0].as_str()?;
            if k == "environment" {
                return arr[1].as_str().map(str::to_string);
            }
        }
    }
    None
}

fn timestamp_to_iso(v: &Value) -> Option<String> {
    // Sentry sends a Unix epoch (float) or ISO-8601 string. Pass through
    // strings; convert numeric to a sentinel ISO marker the caller can
    // post-process — we don't pull chrono into the dependency tree.
    if let Some(s) = v.as_str() {
        return Some(s.to_string());
    }
    if let Some(n) = v.as_f64() {
        return Some(format!("epoch:{n}"));
    }
    None
}
