// ICO personal-data-breach export adapter tests.

use issue_tracker::adapters::ico::{is_eligible, to_ico_breach_report, IcoBreachExtras};
use issue_tracker::{grade_issue, IssueTrackerAssessment, RawScores};

fn data_protection_assessment(harm: Option<u8>) -> IssueTrackerAssessment {
    let mut data = IssueTrackerAssessment::default();
    data.reporter.issue_category = "data-protection".into();
    data.reporter.system_name = "customer-portal".into();
    data.reporter.component = "session-store".into();
    data.reporter.environment = "production".into();
    data.reporter.discovered_at = "2026-05-08T07:00:00Z".into();
    data.reporter.reported_at = "2026-05-08T07:30:00Z".into();
    data.scores = RawScores {
        score_by_harm_grade: harm,
        score_by_severity_of_impact: Some(4),
        score_by_magnitude_of_damage: Some(7),
        ..Default::default()
    };
    data
}

fn extras() -> IcoBreachExtras {
    IcoBreachExtras {
        data_subject_categories: vec!["customers".into(), "employees".into()],
        data_subjects_approximate_count: Some(12_500),
        personal_data_categories: vec!["names".into(), "email-addresses".into(), "session-tokens".into()],
        personal_data_records_approximate_count: Some(50_000),
        likely_consequences: "Account takeover risk for affected accounts.".into(),
        mitigation_measures: "Forced password reset; revoked all live sessions; rotated signing key.".into(),
        controller_name: "Example NHS Trust".into(),
        controller_contact: "dpo@example.nhs.uk".into(),
        data_protection_officer_name: "DPO Name".into(),
        data_protection_officer_contact: "dpo@example.nhs.uk".into(),
        cross_border: false,
    }
}

#[test]
fn data_protection_issue_is_eligible() {
    let data = data_protection_assessment(Some(2));
    assert!(is_eligible(&data));
}

#[test]
fn security_issue_with_harm_is_eligible() {
    let mut data = data_protection_assessment(Some(2));
    data.reporter.issue_category = "security".into();
    assert!(is_eligible(&data));
}

#[test]
fn security_issue_with_no_harm_is_not_eligible() {
    let mut data = data_protection_assessment(None);
    data.reporter.issue_category = "security".into();
    assert!(!is_eligible(&data));
}

#[test]
fn unrelated_issue_category_is_not_eligible() {
    let mut data = data_protection_assessment(Some(2));
    data.reporter.issue_category = "performance".into();
    assert!(!is_eligible(&data));
    let result = grade_issue(&data);
    assert!(to_ico_breach_report("issue-1", "x", "y", &extras(), &data, &result).is_none());
}

#[test]
fn report_has_expected_shape_and_field_population() {
    let data = data_protection_assessment(Some(2));
    let result = grade_issue(&data);
    let report = to_ico_breach_report(
        "issue-77",
        "Session-token leak in audit log export",
        "An audit log export job emitted unredacted session tokens to a public S3 bucket for ~14 minutes before being noticed by a customer-success engineer. All affected sessions were revoked and the bucket was made private.",
        &extras(),
        &data,
        &result,
    )
    .unwrap();

    assert_eq!(report["schema"], "ico-personal-data-breach-v1");
    assert_eq!(report["incidentId"], "issue-77");
    assert_eq!(report["discoveredAt"], "2026-05-08T07:00:00Z");
    assert_eq!(report["reportedAt"], "2026-05-08T07:30:00Z");

    assert_eq!(report["controller"]["name"], "Example NHS Trust");
    assert_eq!(report["controller"]["contact"], "dpo@example.nhs.uk");
    assert_eq!(
        report["dataProtectionOfficer"]["contact"],
        "dpo@example.nhs.uk"
    );

    let breach = &report["breach"];
    assert_eq!(breach["summary"], "Session-token leak in audit log export");
    assert_eq!(breach["category"], "data-protection");
    assert_eq!(breach["system"], "customer-portal");
    assert_eq!(breach["component"], "session-store");
    assert_eq!(breach["environment"], "production");
    assert_eq!(breach["crossBorder"], false);
    assert_eq!(breach["dataSubjectsApproximateCount"], 12_500);
    assert_eq!(breach["personalDataRecordsApproximateCount"], 50_000);
    assert_eq!(breach["dataSubjectCategories"][0], "customers");
    assert_eq!(breach["dataSubjectCategories"][1], "employees");
    assert_eq!(
        breach["personalDataCategories"][2],
        "session-tokens"
    );
    assert!(breach["likelyConsequences"]
        .as_str()
        .unwrap()
        .contains("Account takeover"));
    assert!(breach["mitigationMeasures"]
        .as_str()
        .unwrap()
        .contains("Forced password reset"));

    let assessment = &report["assessment"];
    assert_eq!(assessment["harmGrade"], 2);
    assert_eq!(assessment["severityOfImpact"], 4);
    assert_eq!(assessment["magnitudeOfDamage"], 7);
    // composite is the worst across all instruments — severity 4 → high
    assert_eq!(assessment["compositePriority"], "high");
}

#[test]
fn report_filters_to_high_or_medium_priority_flags_only() {
    // Severity 5 + harm 2 + clinical-safety would emit high-priority flags.
    let mut data = data_protection_assessment(Some(2));
    data.scores.score_by_severity_of_impact = Some(5);
    let result = grade_issue(&data);
    let report =
        to_ico_breach_report("issue-1", "x", "y", &extras(), &data, &result).unwrap();
    let flags = report["assessment"]["regulatoryFlags"].as_array().unwrap();

    // Every flag in the report has priority "high" or "medium" (low is excluded).
    for flag in flags {
        let p = flag["priority"].as_str().unwrap();
        assert!(p == "high" || p == "medium", "unexpected priority: {p}");
    }

    // severity-catastrophic must be present (severity 5).
    let categories: Vec<&str> = flags
        .iter()
        .map(|f| f["category"].as_str().unwrap())
        .collect();
    assert!(
        categories.contains(&"severity-catastrophic"),
        "expected severity-catastrophic in {categories:?}"
    );
}
