// Bulk-import parser tests for GitHub Issues and Jira Cloud.

use issue_tracker::adapters::imports::{github, jira};
use serde_json::json;

#[test]
fn github_open_bug_with_p1_label_becomes_software_defect_priority_2() {
    let payload = json!({
        "number": 42,
        "title": "Login fails with 500 on Firefox",
        "state": "open",
        "html_url": "https://github.com/example/web-app/issues/42",
        "created_at": "2026-05-08T09:00:00Z",
        "labels": [
            {"name": "bug"},
            {"name": "p1"},
            {"name": "browser:firefox"}
        ],
        "assignees": [
            {"login": "alice"},
            {"login": "bob"}
        ]
    });

    let d = github::parse(&payload).expect("github parse");
    assert_eq!(d.source, "github");
    assert!(d.cc_summary.starts_with("[github]"));
    assert!(d.cc_summary.contains("Login fails with 500"));
    assert_eq!(d.external_reference, "https://github.com/example/web-app/issues/42");

    let a = &d.assessment;
    assert_eq!(a.reporter.issue_category, "software-defect");
    assert_eq!(a.reporter.system_name, "example/web-app");
    assert_eq!(a.reporter.component, "alice, bob");
    assert_eq!(a.reporter.reported_at, "2026-05-08T09:00:00Z");
    assert_eq!(a.reporter.external_reference, "github:example/web-app#42");
    assert_eq!(a.scores.score_by_priority_rank, Some(2));
}

#[test]
fn github_security_label_takes_precedence_over_default() {
    let payload = json!({
        "number": 7,
        "title": "Auth bypass via header injection",
        "state": "open",
        "html_url": "https://github.com/example/auth-svc/issues/7",
        "labels": [
            {"name": "security"},
            {"name": "p0"}
        ],
        "created_at": "2026-05-08T10:00:00Z"
    });
    let d = github::parse(&payload).unwrap();
    assert_eq!(d.assessment.reporter.issue_category, "security");
    assert_eq!(d.assessment.scores.score_by_priority_rank, Some(1));
}

#[test]
fn github_unlabelled_issue_falls_back_to_software_defect() {
    let payload = json!({
        "number": 1,
        "title": "Typo in README",
        "state": "open",
        "html_url": "https://github.com/example/repo/issues/1",
        "labels": [],
        "created_at": "2026-05-08T10:00:00Z"
    });
    let d = github::parse(&payload).unwrap();
    assert_eq!(d.assessment.reporter.issue_category, "software-defect");
    assert_eq!(d.assessment.scores.score_by_priority_rank, None);
}

#[test]
fn github_uses_repository_full_name_when_present() {
    let payload = json!({
        "number": 99,
        "title": "Latency spike",
        "state": "open",
        "html_url": "https://github.com/different/url/issues/99",
        "repository": {"full_name": "canonical/owner-repo"},
        "labels": [{"name": "performance"}],
        "created_at": "2026-05-08T10:00:00Z"
    });
    let d = github::parse(&payload).unwrap();
    assert_eq!(d.assessment.reporter.system_name, "canonical/owner-repo");
    assert_eq!(d.assessment.reporter.issue_category, "performance");
}

#[test]
fn jira_blocker_bug_becomes_software_defect_priority_1() {
    let payload = json!({
        "key": "PROJ-123",
        "self": "https://example.atlassian.net/rest/api/3/issue/PROJ-123",
        "fields": {
            "summary": "Database connection pool exhaustion under load",
            "issuetype": {"name": "Bug"},
            "priority": {"name": "Blocker"},
            "project": {"key": "PROJ"},
            "assignee": {"displayName": "Carol Smith"},
            "created": "2026-05-08T11:00:00.000+0000",
            "environment": "production"
        }
    });

    let d = jira::parse(&payload).expect("jira parse");
    assert_eq!(d.source, "jira");
    assert!(d.cc_summary.starts_with("[jira:PROJ-123]"));
    assert_eq!(
        d.external_reference,
        "https://example.atlassian.net/rest/api/3/issue/PROJ-123"
    );

    let a = &d.assessment;
    assert_eq!(a.reporter.issue_category, "software-defect");
    assert_eq!(a.reporter.system_name, "PROJ");
    assert_eq!(a.reporter.environment, "production");
    assert_eq!(a.reporter.component, "Carol Smith");
    assert_eq!(a.reporter.external_reference, "jira:PROJ-123");
    assert_eq!(a.scores.score_by_priority_rank, Some(1));
}

#[test]
fn jira_incident_routes_to_service_outage_with_low_priority() {
    let payload = json!({
        "key": "INC-9",
        "fields": {
            "summary": "Customer reports intermittent timeouts",
            "issuetype": {"name": "Incident"},
            "priority": {"name": "Low"},
            "project": {"key": "INC"},
            "created": "2026-05-08T11:30:00.000+0000"
        }
    });
    let d = jira::parse(&payload).unwrap();
    assert_eq!(d.assessment.reporter.issue_category, "service-outage");
    assert_eq!(d.assessment.scores.score_by_priority_rank, Some(4));
}

#[test]
fn jira_story_routes_to_process() {
    let payload = json!({
        "key": "X-1",
        "fields": {
            "summary": "Add export-to-CSV button",
            "issuetype": {"name": "Story"},
            "priority": {"name": "Medium"},
            "project": {"key": "X"},
            "created": "2026-05-08T12:00:00.000+0000"
        }
    });
    let d = jira::parse(&payload).unwrap();
    assert_eq!(d.assessment.reporter.issue_category, "process");
    assert_eq!(d.assessment.scores.score_by_priority_rank, Some(3));
}

#[test]
fn jira_payload_without_key_returns_none() {
    let payload = json!({"fields": {"summary": "x"}});
    assert!(jira::parse(&payload).is_none());
}
