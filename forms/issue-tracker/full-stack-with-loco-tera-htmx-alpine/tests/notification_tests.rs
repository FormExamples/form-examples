// Outbound notification renderer tests for Slack, MS Teams, and email.

use issue_tracker::adapters::notifications::{email, slack, teams};
use issue_tracker::{
    grade_issue, FailureCondition, IssueTrackerAssessment, RawScores,
};

fn critical_assessment() -> IssueTrackerAssessment {
    let mut data = IssueTrackerAssessment::default();
    data.reporter.system_name = "edge-router".into();
    data.reporter.environment = "production".into();
    data.reporter.issue_category = "service-outage".into();
    data.scores = RawScores {
        score_by_severity_of_impact: Some(5),
        score_by_magnitude_of_damage: Some(9),
        score_by_failure_condition: FailureCondition::A,
        score_by_frequency_percent: Some(100.0),
        ..Default::default()
    };
    data
}

fn low_assessment() -> IssueTrackerAssessment {
    let mut data = IssueTrackerAssessment::default();
    data.reporter.system_name = "marketing-site".into();
    data.scores = RawScores {
        score_by_severity_of_impact: Some(1),
        ..Default::default()
    };
    data
}

#[test]
fn slack_renders_for_critical_priority() {
    let data = critical_assessment();
    let result = grade_issue(&data);
    let payload = slack::render(
        "ISSUE-99",
        "Region us-east-2 unreachable",
        "https://example.com/dashboard?id=ISSUE-99",
        &data,
        &result,
    )
    .unwrap();
    let blocks = payload["blocks"].as_array().unwrap();
    // header + cc + fields + flags + actions = 5
    assert_eq!(blocks.len(), 5);
    assert_eq!(blocks[0]["type"], "header");
    assert!(blocks[0]["text"]["text"]
        .as_str()
        .unwrap()
        .contains("[CRITICAL] ISSUE-99"));
    let action_btn = &blocks[4]["elements"][0];
    assert_eq!(action_btn["url"], "https://example.com/dashboard?id=ISSUE-99");
    assert_eq!(action_btn["style"], "danger");
    // Top-level fallback text matches the headline.
    assert!(payload["text"]
        .as_str()
        .unwrap()
        .starts_with("[CRITICAL] ISSUE-99"));
}

#[test]
fn slack_skips_low_and_moderate_priority() {
    let data = low_assessment();
    let result = grade_issue(&data);
    assert!(slack::render("X", "x", "u", &data, &result).is_none());
}

#[test]
fn teams_renders_adaptive_card_for_high_priority() {
    let mut data = critical_assessment();
    data.scores.score_by_severity_of_impact = Some(4); // composite = high
    data.scores.score_by_failure_condition = FailureCondition::None;
    data.scores.score_by_frequency_percent = None;
    data.scores.score_by_magnitude_of_damage = None;
    let result = grade_issue(&data);

    let payload = teams::render(
        "ISSUE-44",
        "Login endpoint returning 500",
        "https://example.com/dashboard?id=ISSUE-44",
        &data,
        &result,
    )
    .unwrap();

    assert_eq!(payload["type"], "message");
    let card = &payload["attachments"][0]["content"];
    assert_eq!(card["type"], "AdaptiveCard");
    assert_eq!(card["version"], "1.5");
    let body = card["body"].as_array().unwrap();
    // title + cc + factset (3 mandatory) + (no flag block since severity 4 alone fires only severity?)
    assert!(body.len() >= 3);
    assert_eq!(body[0]["color"], "Attention");
    assert_eq!(card["actions"][0]["url"], "https://example.com/dashboard?id=ISSUE-44");
}

#[test]
fn teams_skips_low_priority() {
    let data = low_assessment();
    let result = grade_issue(&data);
    assert!(teams::render("X", "x", "u", &data, &result).is_none());
}

#[test]
fn email_renders_subject_and_bodies_for_critical() {
    let data = critical_assessment();
    let result = grade_issue(&data);
    let msg = email::render(
        "ISSUE-99",
        "Region us-east-2 unreachable",
        "https://example.com/dashboard?id=ISSUE-99",
        &data,
        &result,
    )
    .unwrap();

    assert_eq!(
        msg.subject,
        "[CRITICAL] [ISSUE-99] Region us-east-2 unreachable"
    );
    assert!(msg.body_text.contains("composite priority CRITICAL"));
    assert!(msg.body_text.contains("System:      edge-router"));
    assert!(msg.body_text.contains("Environment: production"));
    assert!(msg.body_text.contains("Safety flags"));
    assert!(msg.body_text.contains("Open in dashboard: https://example.com/dashboard?id=ISSUE-99"));

    assert!(msg.body_html.contains("CRITICAL"));
    assert!(msg.body_html.contains("edge-router"));
    assert!(msg.body_html.contains("href=\"https://example.com/dashboard?id=ISSUE-99\""));
}

#[test]
fn email_html_escapes_user_supplied_text() {
    let mut data = critical_assessment();
    data.reporter.system_name = "<script>alert('xss')</script>".into();
    let result = grade_issue(&data);
    let msg = email::render("ISSUE-1", "trouble", "https://e.com/d", &data, &result).unwrap();
    assert!(!msg.body_html.contains("<script>alert"));
    assert!(msg.body_html.contains("&lt;script&gt;alert"));
}

#[test]
fn email_skips_low_priority() {
    let data = low_assessment();
    let result = grade_issue(&data);
    assert!(email::render("X", "x", "u", &data, &result).is_none());
}
