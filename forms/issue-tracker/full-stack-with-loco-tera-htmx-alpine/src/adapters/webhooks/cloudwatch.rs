//! AWS CloudWatch alarm parser.
//!
//! Accepts the JSON shape CloudWatch sends when an alarm changes state
//! (the inner alarm payload — when delivered via SNS the caller must
//! un-wrap the `Message` field first). CloudWatch alarms do not carry
//! a `tags` array in this payload, so environment defaults to
//! `production`; the caller can override after parsing if needed.
//!
//! Mapping:
//!
//! | CloudWatch `NewStateValue` | Severity | Category        |
//! | -------------------------- | -------- | --------------- |
//! | ALARM                      | 4        | service-outage  |
//! | INSUFFICIENT_DATA          | 2        | process         |
//! | OK                         | 1        | process         |

use super::WebhookDraft;
use crate::scoring::types::{IssueTrackerAssessment, RawScores};
use serde_json::Value;

const SOURCE: &str = "cloudwatch-webhook";

pub fn parse(payload: &Value) -> Option<WebhookDraft> {
    let alarm_name = payload.get("AlarmName").and_then(Value::as_str)?.to_string();
    let alarm_description = payload
        .get("AlarmDescription")
        .and_then(Value::as_str)
        .unwrap_or("")
        .to_string();
    let new_state = payload
        .get("NewStateValue")
        .and_then(Value::as_str)
        .unwrap_or("ALARM");
    let new_state_reason = payload
        .get("NewStateReason")
        .and_then(Value::as_str)
        .unwrap_or("")
        .to_string();
    let region = payload
        .get("Region")
        .and_then(Value::as_str)
        .unwrap_or("")
        .to_string();
    let state_change_time = payload
        .get("StateChangeTime")
        .and_then(Value::as_str)
        .unwrap_or("")
        .to_string();
    let alarm_arn = payload
        .get("AlarmArn")
        .and_then(Value::as_str)
        .unwrap_or("")
        .to_string();
    let metric = payload
        .pointer("/Trigger/MetricName")
        .and_then(Value::as_str)
        .unwrap_or("")
        .to_string();
    let namespace = payload
        .pointer("/Trigger/Namespace")
        .and_then(Value::as_str)
        .unwrap_or("")
        .to_string();

    let severity = severity_for_state(new_state);
    let category = category_for_state(new_state);

    let title = if !alarm_description.is_empty() {
        format!("{alarm_name}: {alarm_description}")
    } else if !new_state_reason.is_empty() {
        format!("{alarm_name} — {new_state_reason}")
    } else {
        alarm_name.clone()
    };

    let system_name = if !namespace.is_empty() && !metric.is_empty() {
        format!("{namespace}/{metric}")
    } else if !namespace.is_empty() {
        namespace
    } else {
        alarm_name.clone()
    };

    let mut data = IssueTrackerAssessment::default();
    data.reporter.reporter_name = format!("CloudWatch ({region})");
    data.reporter.reporter_role = "monitoring-alert".into();
    data.reporter.issue_category = category.into();
    // CloudWatch is most commonly wired to production; callers can
    // override on triage.
    data.reporter.environment = "production".into();
    data.reporter.system_name = system_name;
    data.reporter.component = alarm_name.clone();
    data.reporter.discovered_at = state_change_time.clone();
    data.reporter.reported_at = state_change_time;
    data.reporter.external_reference = if !alarm_arn.is_empty() {
        format!("cloudwatch:{alarm_arn}")
    } else {
        format!("cloudwatch:{alarm_name}")
    };

    data.scores = RawScores {
        score_by_severity_of_impact: Some(severity),
        ..Default::default()
    };

    Some(WebhookDraft {
        cc_summary: format!("[{SOURCE}] {title}"),
        external_reference: data.reporter.external_reference.clone(),
        assessment: data,
    })
}

fn severity_for_state(state: &str) -> u8 {
    match state {
        "ALARM" => 4,
        "INSUFFICIENT_DATA" => 2,
        "OK" => 1,
        _ => 3,
    }
}

fn category_for_state(state: &str) -> &'static str {
    match state {
        "ALARM" => "service-outage",
        _ => "process",
    }
}
