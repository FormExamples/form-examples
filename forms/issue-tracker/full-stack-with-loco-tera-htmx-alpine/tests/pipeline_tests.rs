// Integration pipeline tests — exercise the orchestrator across
// representative scenarios.

use issue_tracker::adapters::ico::IcoBreachExtras;
use issue_tracker::adapters::riddor::{
    InjuredPersonRole, RiddorIncidentType, RiddorReportExtras,
};
use issue_tracker::{
    grade_issue, run_integrations, FailureCondition, IssueTrackerAssessment, PipelineExtras,
    RawScores,
};

fn ico_extras() -> IcoBreachExtras {
    IcoBreachExtras {
        controller_name: "Example NHS Trust".into(),
        controller_contact: "dpo@example.nhs.uk".into(),
        likely_consequences: "Account takeover risk.".into(),
        mitigation_measures: "Forced reset; rotated keys.".into(),
        ..Default::default()
    }
}

fn riddor_extras() -> RiddorReportExtras {
    RiddorReportExtras {
        incident_type: Some(RiddorIncidentType::SpecifiedInjury),
        injured_person_role: Some(InjuredPersonRole::Employee),
        responsible_person_name: "Site Manager".into(),
        responsible_person_position: "Operations Manager".into(),
        responsible_person_contact: "ops@example.co.uk".into(),
        ..Default::default()
    }
}

fn extras() -> PipelineExtras {
    PipelineExtras {
        ico: ico_extras(),
        riddor: riddor_extras(),
        ico_breach_long_description: "Detailed breach description.".into(),
    }
}

#[test]
fn low_priority_software_defect_fires_no_outputs() {
    let mut data = IssueTrackerAssessment::default();
    data.reporter.issue_category = "software-defect".into();
    data.scores = RawScores {
        score_by_severity_of_impact: Some(1),
        ..Default::default()
    };
    let result = grade_issue(&data);
    let out = run_integrations(
        "issue-low",
        "Typo in footer",
        "https://example.com/d",
        &extras(),
        &data,
        &result,
    );
    assert_eq!(out.count(), 0);
    assert!(out.lfpse_bundle.is_none());
    assert!(out.ico_breach_report.is_none());
    assert!(out.riddor_report.is_none());
    assert!(out.slack_payload.is_none());
    assert!(out.teams_payload.is_none());
    assert!(out.email_message.is_none());
}

#[test]
fn critical_clinical_safety_fatal_fires_lfpse_plus_all_three_notifications() {
    let mut data = IssueTrackerAssessment::default();
    data.reporter.issue_category = "clinical-safety".into();
    data.reporter.system_name = "ward-9-pumps".into();
    data.reporter.environment = "field".into();
    data.reporter.reported_at = "2026-05-09T08:00:00Z".into();
    data.scores = RawScores {
        score_by_harm_grade: Some(4),
        score_by_severity_of_impact: Some(5),
        score_by_failure_condition: FailureCondition::A,
        ..Default::default()
    };
    let result = grade_issue(&data);
    let out = run_integrations(
        "issue-fatal",
        "Pump dosing error after firmware update",
        "https://example.com/d",
        &extras(),
        &data,
        &result,
    );
    // LFPSE + Slack + Teams + Email = 4 outputs (no ICO, no RIDDOR for this category)
    assert_eq!(out.count(), 4);
    assert!(out.lfpse_bundle.is_some());
    assert!(out.ico_breach_report.is_none());
    assert!(out.riddor_report.is_none());
    assert!(out.slack_payload.is_some());
    assert!(out.teams_payload.is_some());
    assert!(out.email_message.is_some());

    let bundle = out.lfpse_bundle.unwrap();
    assert_eq!(bundle["resourceType"], "Bundle");
    let email = out.email_message.unwrap();
    assert!(email.subject.starts_with("[CRITICAL]"));
    assert!(email.body_text.contains("Pump dosing error"));
}

#[test]
fn data_protection_breach_fires_ico_plus_notifications() {
    let mut data = IssueTrackerAssessment::default();
    data.reporter.issue_category = "data-protection".into();
    data.reporter.system_name = "customer-portal".into();
    data.reporter.environment = "production".into();
    data.scores = RawScores {
        score_by_harm_grade: Some(2),
        score_by_severity_of_impact: Some(4),
        ..Default::default()
    };
    let result = grade_issue(&data);
    let out = run_integrations(
        "issue-breach",
        "Session-token leak in audit log export",
        "https://example.com/d",
        &extras(),
        &data,
        &result,
    );
    // ICO + Slack + Teams + Email = 4 (LFPSE rejects non-clinical, RIDDOR rejects non-workplace)
    assert!(out.lfpse_bundle.is_none());
    assert!(out.ico_breach_report.is_some());
    assert!(out.riddor_report.is_none());
    assert!(out.slack_payload.is_some());
    assert!(out.teams_payload.is_some());
    assert!(out.email_message.is_some());
    assert_eq!(out.count(), 4);

    let report = out.ico_breach_report.unwrap();
    assert_eq!(report["schema"], "ico-personal-data-breach-v1");
    assert_eq!(report["controller"]["name"], "Example NHS Trust");
}

#[test]
fn workplace_safety_injury_fires_riddor_plus_notifications() {
    let mut data = IssueTrackerAssessment::default();
    data.reporter.issue_category = "workplace-safety".into();
    data.reporter.system_name = "warehouse-conveyor-3".into();
    data.scores = RawScores {
        score_by_harm_grade: Some(2),
        score_by_severity_of_impact: Some(4),
        ..Default::default()
    };
    let result = grade_issue(&data);
    let out = run_integrations(
        "issue-injury",
        "Hand caught in conveyor",
        "https://example.com/d",
        &extras(),
        &data,
        &result,
    );
    assert!(out.lfpse_bundle.is_none());
    assert!(out.ico_breach_report.is_none());
    assert!(out.riddor_report.is_some());
    assert!(out.slack_payload.is_some());
    assert!(out.teams_payload.is_some());
    assert!(out.email_message.is_some());
    assert_eq!(out.count(), 4);

    let report = out.riddor_report.unwrap();
    assert_eq!(report["schema"], "hse-riddor-f2508-v1");
    assert_eq!(report["incidentType"], "specified-injury");
}

#[test]
fn medical_device_with_harm_fires_lfpse_and_riddor_simultaneously() {
    // medical-device + harm satisfies both LFPSE (clinical) and RIDDOR
    // (workplace-safety / medical-device) eligibility predicates.
    let mut data = IssueTrackerAssessment::default();
    data.reporter.issue_category = "medical-device".into();
    data.scores = RawScores {
        score_by_harm_grade: Some(3),
        score_by_severity_of_impact: Some(4),
        ..Default::default()
    };
    let result = grade_issue(&data);
    let out = run_integrations(
        "issue-md",
        "Device malfunction caused severe harm",
        "https://example.com/d",
        &extras(),
        &data,
        &result,
    );
    assert!(out.lfpse_bundle.is_some());
    assert!(out.riddor_report.is_some());
    assert!(out.slack_payload.is_some());
    assert!(out.teams_payload.is_some());
    assert!(out.email_message.is_some());
    // No ICO (not data-protection / security).
    assert!(out.ico_breach_report.is_none());
    assert_eq!(out.count(), 5);
}

#[test]
fn moderate_priority_skips_notifications_but_eligible_regulators_still_fire() {
    // service-outage + moderate composite: should_notify is false, so
    // no Slack/Teams/email; but LFPSE/ICO/RIDDOR are not eligible
    // anyway → 0 outputs.
    let mut data = IssueTrackerAssessment::default();
    data.reporter.issue_category = "service-outage".into();
    data.scores = RawScores {
        score_by_severity_of_impact: Some(3),
        ..Default::default()
    };
    let result = grade_issue(&data);
    let out = run_integrations("x", "x", "https://example.com/d", &extras(), &data, &result);
    assert_eq!(out.count(), 0);
}
