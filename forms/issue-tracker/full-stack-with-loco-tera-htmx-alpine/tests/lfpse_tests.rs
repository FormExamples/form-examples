// LFPSE FHIR R5 export adapter tests.

use issue_tracker::adapters::lfpse::{is_eligible, to_lfpse_bundle};
use issue_tracker::{grade_issue, FailureCondition, IssueTrackerAssessment, RawScores};

fn clinical_safety_assessment(harm: u8) -> IssueTrackerAssessment {
    let mut data = IssueTrackerAssessment::default();
    data.reporter.issue_category = "clinical-safety".into();
    data.reporter.reported_at = "2026-05-08T08:00:00Z".into();
    data.scores = RawScores {
        score_by_harm_grade: Some(harm),
        score_by_severity_of_impact: Some(5),
        score_by_failure_condition: FailureCondition::A,
        ..Default::default()
    };
    data
}

#[test]
fn non_clinical_issue_is_not_lfpse_eligible() {
    let mut data = IssueTrackerAssessment::default();
    data.reporter.issue_category = "service-outage".into();
    data.scores.score_by_harm_grade = Some(2);
    assert!(!is_eligible(&data));
    let result = grade_issue(&data);
    assert!(to_lfpse_bundle("issue-1", "outage", &data, &result).is_none());
}

#[test]
fn clinical_safety_with_no_harm_is_not_lfpse_eligible() {
    let mut data = clinical_safety_assessment(0);
    data.scores.score_by_harm_grade = Some(0);
    assert!(!is_eligible(&data));
    let result = grade_issue(&data);
    assert!(to_lfpse_bundle("issue-2", "no harm", &data, &result).is_none());
}

#[test]
fn clinical_safety_with_low_harm_is_lfpse_eligible() {
    let data = clinical_safety_assessment(1);
    assert!(is_eligible(&data));
    let result = grade_issue(&data);
    assert!(to_lfpse_bundle("issue-3", "low harm event", &data, &result).is_some());
}

#[test]
fn medical_device_with_harm_is_lfpse_eligible() {
    let mut data = clinical_safety_assessment(2);
    data.reporter.issue_category = "medical-device".into();
    assert!(is_eligible(&data));
}

#[test]
fn lfpse_bundle_has_expected_shape() {
    let data = clinical_safety_assessment(3);
    let result = grade_issue(&data);
    let bundle = to_lfpse_bundle("issue-42", "Pump dosing error", &data, &result).unwrap();

    assert_eq!(bundle["resourceType"], "Bundle");
    assert_eq!(bundle["type"], "collection");
    assert_eq!(bundle["id"], "lfpse-issue-42");
    assert_eq!(bundle["timestamp"], "2026-05-08T08:00:00Z");

    let entries = bundle["entry"].as_array().unwrap();

    // First entry is the ClinicalImpression.
    assert_eq!(
        entries[0]["resource"]["resourceType"], "ClinicalImpression",
        "first entry should be the ClinicalImpression"
    );
    let ci = &entries[0]["resource"];
    assert_eq!(ci["status"], "completed");
    assert_eq!(ci["summary"], "Pump dosing error");
    assert_eq!(
        ci["code"]["coding"][0]["code"], "severe-harm",
        "harm grade 3 should map to severe-harm"
    );
    assert_eq!(
        ci["finding"][0]["itemCodeableConcept"]["coding"][0]["code"],
        "composite-critical"
    );

    // Remaining entries are DetectedIssues, one per fired safety flag.
    let flag_count = result.additional_flags.len();
    assert_eq!(entries.len(), 1 + flag_count);
    for (i, e) in entries.iter().skip(1).enumerate() {
        let r = &e["resource"];
        assert_eq!(r["resourceType"], "DetectedIssue");
        assert_eq!(r["status"], "preliminary");
        assert_eq!(
            r["implicated"][0]["reference"],
            format!("ClinicalImpression/ci-issue-42"),
            "DetectedIssue {i} should reference the ClinicalImpression"
        );
    }
}

#[test]
fn lfpse_severity_mapping() {
    // Severity 5 + harm 4 + failure A + clinical-safety
    // → harm-fatal (high), failure-catastrophic (high), severity-catastrophic (high), regulatory (high)
    let data = clinical_safety_assessment(4);
    let result = grade_issue(&data);
    let bundle = to_lfpse_bundle("issue-99", "Fatal", &data, &result).unwrap();
    let entries = bundle["entry"].as_array().unwrap();

    let mut high_count = 0;
    for e in entries.iter().skip(1) {
        if e["resource"]["severity"] == "high" {
            high_count += 1;
        }
    }
    assert!(
        high_count >= 3,
        "expected at least 3 high-severity DetectedIssue entries (harm-fatal, failure-catastrophic, severity-catastrophic), got {high_count}"
    );

    // Confirm at least one DetectedIssue carries the regulatory category.
    let categories: Vec<String> = entries
        .iter()
        .skip(1)
        .map(|e| e["resource"]["code"]["coding"][0]["code"].as_str().unwrap_or("").to_string())
        .collect();
    assert!(
        categories.contains(&"regulatory".to_string()),
        "expected a regulatory DetectedIssue, got {categories:?}"
    );
    assert!(
        categories.contains(&"harm-fatal".to_string()),
        "expected a harm-fatal DetectedIssue, got {categories:?}"
    );
}
