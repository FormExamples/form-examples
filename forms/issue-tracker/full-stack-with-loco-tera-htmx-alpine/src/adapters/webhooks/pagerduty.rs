//! PagerDuty webhook v3 parser.
//!
//! Accepts a PagerDuty incident webhook (`event.event_type` of
//! `incident.triggered`, `incident.acknowledged`, etc.) and emits a
//! draft `IssueTrackerAssessment`. Maps PagerDuty `urgency` to
//! `score_by_severity_of_impact`:
//!
//! | PagerDuty urgency | Severity score |
//! | ----------------- | -------------- |
//! | high              | 4              |
//! | low               | 2              |
//!
//! `incident.triggered` events are categorised as `service-outage`;
//! `incident.acknowledged` and `incident.resolved` are status updates
//! and pass through with their original urgency mapping.

use super::WebhookDraft;
use crate::scoring::types::{IssueTrackerAssessment, RawScores};
use serde_json::Value;

const SOURCE: &str = "pagerduty-webhook";

pub fn parse(payload: &Value) -> Option<WebhookDraft> {
    let event = payload.get("event")?;
    let event_type = event.get("event_type").and_then(Value::as_str).unwrap_or("");
    let occurred_at = event
        .get("occurred_at")
        .and_then(Value::as_str)
        .unwrap_or("")
        .to_string();
    let incident = event.get("data")?;

    let title = incident
        .get("title")
        .and_then(Value::as_str)
        .or_else(|| incident.get("summary").and_then(Value::as_str))
        .unwrap_or("PagerDuty incident")
        .to_string();

    let urgency = incident
        .get("urgency")
        .and_then(Value::as_str)
        .unwrap_or("low");
    let severity = severity_for_urgency(urgency);

    let service_name = incident
        .pointer("/service/summary")
        .or_else(|| incident.pointer("/service/name"))
        .and_then(Value::as_str)
        .unwrap_or("")
        .to_string();

    let incident_id = incident
        .get("id")
        .and_then(Value::as_str)
        .unwrap_or("")
        .to_string();
    let html_url = incident
        .get("html_url")
        .and_then(Value::as_str)
        .unwrap_or("")
        .to_string();

    let category = if event_type == "incident.triggered" {
        "service-outage"
    } else {
        "process"
    };

    let mut data = IssueTrackerAssessment::default();
    data.reporter.reporter_name = format!("PagerDuty ({incident_id})");
    data.reporter.reporter_role = "monitoring-alert".into();
    data.reporter.issue_category = category.into();
    // PagerDuty doesn't carry an environment field; default to production
    // because PD is most commonly wired to production paging.
    data.reporter.environment = "production".into();
    data.reporter.system_name = service_name;
    data.reporter.discovered_at = occurred_at.clone();
    data.reporter.reported_at = occurred_at;
    data.reporter.external_reference = format!("pagerduty:{incident_id}");

    data.scores = RawScores {
        score_by_severity_of_impact: Some(severity),
        // High-urgency PagerDuty incidents are by default at least
        // priority rank 2; users can adjust on triage.
        score_by_priority_rank: Some(if urgency == "high" { 2 } else { 4 }),
        ..Default::default()
    };

    Some(WebhookDraft {
        cc_summary: format!("[{SOURCE}] {title}"),
        external_reference: if !html_url.is_empty() {
            html_url
        } else {
            data.reporter.external_reference.clone()
        },
        assessment: data,
    })
}

fn severity_for_urgency(urgency: &str) -> u8 {
    match urgency {
        "high" => 4,
        _ => 2,
    }
}
