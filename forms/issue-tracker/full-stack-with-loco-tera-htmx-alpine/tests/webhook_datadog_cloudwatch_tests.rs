// Datadog and CloudWatch inbound webhook parser tests.

use issue_tracker::adapters::webhooks::{cloudwatch, datadog};
use serde_json::json;

#[test]
fn datadog_error_triggered_p1_becomes_severity_4_priority_1_outage() {
    let payload = json!({
        "id": 12345,
        "title": "[Triggered] CPU usage > 95%",
        "alert_type": "error",
        "alert_transition": "Triggered",
        "priority": "P1",
        "tags": "env:production,service:checkout-api,host:web-01,team:platform",
        "link": "https://app.datadoghq.com/event/event?id=12345",
        "date": 1715238000,
        "body": "Host web-01 CPU above 95% for 5 minutes."
    });

    let draft = datadog::parse(&payload).expect("datadog parse");
    assert!(draft.cc_summary.starts_with("[datadog-webhook]"));
    assert!(draft.cc_summary.contains("CPU usage > 95%"));
    assert_eq!(
        draft.external_reference,
        "https://app.datadoghq.com/event/event?id=12345"
    );

    let a = &draft.assessment;
    assert_eq!(a.reporter.issue_category, "service-outage");
    assert_eq!(a.reporter.environment, "production");
    assert_eq!(a.reporter.system_name, "checkout-api");
    assert_eq!(a.reporter.external_reference, "datadog:12345");
    assert_eq!(a.scores.score_by_severity_of_impact, Some(4));
    assert_eq!(a.scores.score_by_priority_rank, Some(1));
}

#[test]
fn datadog_warning_recovered_routes_to_process() {
    let payload = json!({
        "id": 999,
        "title": "[Recovered] DB latency normalised",
        "alert_type": "warning",
        "alert_transition": "Recovered",
        "priority": "P3",
        "tags": "env:staging,service:orders-db",
        "date": 1715240000
    });

    let draft = datadog::parse(&payload).unwrap();
    let a = &draft.assessment;
    assert_eq!(a.reporter.issue_category, "process");
    assert_eq!(a.reporter.environment, "staging");
    assert_eq!(a.reporter.system_name, "orders-db");
    assert_eq!(a.scores.score_by_severity_of_impact, Some(3));
    assert_eq!(a.scores.score_by_priority_rank, Some(3));
}

#[test]
fn datadog_falls_back_to_host_when_service_tag_missing() {
    let payload = json!({
        "id": 1,
        "title": "Disk usage high",
        "alert_type": "warning",
        "alert_transition": "Triggered",
        "tags": "env:production,host:db-01,team:dba"
    });
    let draft = datadog::parse(&payload).unwrap();
    assert_eq!(draft.assessment.reporter.system_name, "db-01");
    // No priority tag → priority_rank stays None.
    assert_eq!(draft.assessment.scores.score_by_priority_rank, None);
}

#[test]
fn cloudwatch_alarm_state_becomes_severity_4_outage() {
    let payload = json!({
        "AlarmName": "checkout-api-5xx-high",
        "AlarmDescription": "5xx rate > 1% for 5 minutes",
        "AWSAccountId": "123456789012",
        "NewStateValue": "ALARM",
        "NewStateReason": "Threshold Crossed: 1 datapoint [4.2 (10/05/26 06:30:00)] was greater than the threshold (1.0).",
        "StateChangeTime": "2026-05-10T06:31:00Z",
        "Region": "us-east-2",
        "AlarmArn": "arn:aws:cloudwatch:us-east-2:123456789012:alarm:checkout-api-5xx-high",
        "Trigger": {
            "MetricName": "5xxErrorRate",
            "Namespace": "AWS/ApplicationELB"
        }
    });

    let draft = cloudwatch::parse(&payload).expect("cloudwatch parse");
    assert!(draft.cc_summary.starts_with("[cloudwatch-webhook]"));
    assert!(draft.cc_summary.contains("checkout-api-5xx-high"));
    assert!(draft.cc_summary.contains("5xx rate > 1%"));

    let a = &draft.assessment;
    assert_eq!(a.reporter.issue_category, "service-outage");
    assert_eq!(a.reporter.environment, "production");
    assert_eq!(a.reporter.system_name, "AWS/ApplicationELB/5xxErrorRate");
    assert_eq!(a.reporter.component, "checkout-api-5xx-high");
    assert_eq!(a.reporter.reported_at, "2026-05-10T06:31:00Z");
    assert_eq!(
        a.reporter.external_reference,
        "cloudwatch:arn:aws:cloudwatch:us-east-2:123456789012:alarm:checkout-api-5xx-high"
    );
    assert_eq!(a.scores.score_by_severity_of_impact, Some(4));
}

#[test]
fn cloudwatch_ok_transition_routes_to_process_severity_1() {
    let payload = json!({
        "AlarmName": "checkout-api-5xx-high",
        "NewStateValue": "OK",
        "StateChangeTime": "2026-05-10T07:00:00Z",
        "Region": "us-east-2",
        "Trigger": {
            "MetricName": "5xxErrorRate",
            "Namespace": "AWS/ApplicationELB"
        }
    });
    let draft = cloudwatch::parse(&payload).unwrap();
    let a = &draft.assessment;
    assert_eq!(a.reporter.issue_category, "process");
    assert_eq!(a.scores.score_by_severity_of_impact, Some(1));
}

#[test]
fn cloudwatch_insufficient_data_routes_to_process_severity_2() {
    let payload = json!({
        "AlarmName": "checkout-api-5xx-high",
        "NewStateValue": "INSUFFICIENT_DATA",
        "StateChangeTime": "2026-05-10T07:05:00Z",
        "Region": "us-east-2"
    });
    let draft = cloudwatch::parse(&payload).unwrap();
    let a = &draft.assessment;
    assert_eq!(a.reporter.issue_category, "process");
    assert_eq!(a.scores.score_by_severity_of_impact, Some(2));
}

#[test]
fn cloudwatch_payload_without_alarm_name_returns_none() {
    let payload = json!({"NewStateValue": "ALARM"});
    assert!(cloudwatch::parse(&payload).is_none());
}
