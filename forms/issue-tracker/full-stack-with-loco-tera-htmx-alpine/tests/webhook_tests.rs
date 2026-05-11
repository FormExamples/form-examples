// Inbound webhook parser tests for Sentry and PagerDuty.

use issue_tracker::adapters::webhooks::{pagerduty, sentry};
use serde_json::json;

#[test]
fn sentry_fatal_event_becomes_severity_5_outage_draft() {
    let payload = json!({
        "id": "wh-1",
        "data": {
            "project_slug": "checkout-api",
            "event": {
                "event_id": "abc123",
                "title": "TypeError: Cannot read properties of undefined",
                "level": "fatal",
                "platform": "node",
                "timestamp": "2026-05-09T14:00:00Z",
                "tags": [
                    ["environment", "production"],
                    ["browser", "Firefox"]
                ]
            },
            "issue": {
                "shortId": "CHECKOUT-API-42",
                "permalink": "https://sentry.io/checkout-api/issues/42/",
                "title": "TypeError on /api/cart"
            }
        }
    });

    let draft = sentry::parse(&payload).expect("sentry parse");
    assert!(draft.cc_summary.contains("TypeError on /api/cart"));
    assert!(draft.cc_summary.starts_with("[sentry-webhook]"));
    assert_eq!(
        draft.external_reference,
        "https://sentry.io/checkout-api/issues/42/"
    );

    let a = &draft.assessment;
    assert_eq!(a.reporter.issue_category, "service-outage");
    assert_eq!(a.reporter.environment, "production");
    assert_eq!(a.reporter.system_name, "checkout-api");
    assert_eq!(a.reporter.reported_at, "2026-05-09T14:00:00Z");
    assert_eq!(a.reporter.external_reference, "sentry:CHECKOUT-API-42");
    assert_eq!(a.scores.score_by_severity_of_impact, Some(5));
}

#[test]
fn sentry_warning_event_falls_back_to_software_defect() {
    let payload = json!({
        "data": {
            "event": {
                "event_id": "warn-1",
                "title": "Slow query",
                "level": "warning",
                "platform": "rust",
                "timestamp": "2026-05-09T14:01:00Z",
                "tags": []
            },
            "issue": { "shortId": "X-1", "title": "Slow query" }
        }
    });
    let draft = sentry::parse(&payload).unwrap();
    assert_eq!(draft.assessment.reporter.issue_category, "software-defect");
    assert_eq!(draft.assessment.scores.score_by_severity_of_impact, Some(3));
}

#[test]
fn sentry_payload_without_event_returns_none() {
    let payload = json!({"data": {"issue": {"shortId": "X-1"}}});
    assert!(sentry::parse(&payload).is_none());
}

#[test]
fn pagerduty_high_urgency_trigger_becomes_severity_4_outage_priority_2() {
    let payload = json!({
        "event": {
            "id": "evt-1",
            "event_type": "incident.triggered",
            "occurred_at": "2026-05-09T15:30:00Z",
            "data": {
                "type": "incident",
                "id": "PXYZ123",
                "summary": "Region us-east-2 unreachable",
                "title": "Region us-east-2 unreachable",
                "status": "triggered",
                "urgency": "high",
                "service": { "summary": "edge-router" },
                "html_url": "https://example.pagerduty.com/incidents/PXYZ123"
            }
        }
    });

    let draft = pagerduty::parse(&payload).expect("pagerduty parse");
    assert!(draft.cc_summary.starts_with("[pagerduty-webhook]"));
    assert!(draft.cc_summary.contains("Region us-east-2 unreachable"));
    assert_eq!(
        draft.external_reference,
        "https://example.pagerduty.com/incidents/PXYZ123"
    );

    let a = &draft.assessment;
    assert_eq!(a.reporter.issue_category, "service-outage");
    assert_eq!(a.reporter.environment, "production");
    assert_eq!(a.reporter.system_name, "edge-router");
    assert_eq!(a.reporter.reported_at, "2026-05-09T15:30:00Z");
    assert_eq!(a.reporter.external_reference, "pagerduty:PXYZ123");
    assert_eq!(a.scores.score_by_severity_of_impact, Some(4));
    assert_eq!(a.scores.score_by_priority_rank, Some(2));
}

#[test]
fn pagerduty_low_urgency_acknowledgement_becomes_process_severity_2() {
    let payload = json!({
        "event": {
            "id": "evt-2",
            "event_type": "incident.acknowledged",
            "occurred_at": "2026-05-09T15:35:00Z",
            "data": {
                "type": "incident",
                "id": "PXYZ124",
                "summary": "Followup needed on dashboard CSV export",
                "title": "Followup needed on dashboard CSV export",
                "status": "acknowledged",
                "urgency": "low",
                "service": { "name": "reports-ui" }
            }
        }
    });

    let draft = pagerduty::parse(&payload).unwrap();
    let a = &draft.assessment;
    assert_eq!(a.reporter.issue_category, "process");
    assert_eq!(a.scores.score_by_severity_of_impact, Some(2));
    assert_eq!(a.scores.score_by_priority_rank, Some(4));
    // No html_url means external_reference falls back to the pagerduty: scheme.
    assert_eq!(draft.external_reference, "pagerduty:PXYZ124");
}

#[test]
fn pagerduty_payload_without_event_returns_none() {
    let payload = json!({"foo": "bar"});
    assert!(pagerduty::parse(&payload).is_none());
}
