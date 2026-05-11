// HSE RIDDOR export adapter tests.

use issue_tracker::adapters::riddor::{
    is_eligible, to_riddor_report, InjuredPersonRole, RiddorIncidentType, RiddorReportExtras,
};
use issue_tracker::{grade_issue, IssueTrackerAssessment, RawScores};

fn workplace_safety_assessment(harm: Option<u8>) -> IssueTrackerAssessment {
    let mut data = IssueTrackerAssessment::default();
    data.reporter.issue_category = "workplace-safety".into();
    data.reporter.system_name = "warehouse-conveyor-3".into();
    data.reporter.component = "drive-motor".into();
    data.reporter.environment = "field".into();
    data.reporter.discovered_at = "2026-05-09T11:20:00Z".into();
    data.reporter.reported_at = "2026-05-09T11:55:00Z".into();
    data.scores = RawScores {
        score_by_harm_grade: harm,
        score_by_severity_of_impact: Some(4),
        score_by_magnitude_of_damage: Some(6),
        ..Default::default()
    };
    data
}

fn extras() -> RiddorReportExtras {
    RiddorReportExtras {
        incident_type: Some(RiddorIncidentType::SpecifiedInjury),
        injured_person_role: Some(InjuredPersonRole::Employee),
        injured_person_age: Some(34),
        injured_person_sex: "f".into(),
        site_address_lines: vec![
            "Warehouse 7".into(),
            "Industrial Estate Road".into(),
            "Manchester".into(),
        ],
        site_postcode: "M17 1AA".into(),
        activity_at_time: "Manual handling at conveyor 3".into(),
        how_it_happened: "Operator caught hand between drive belt and roller after guard fell open."
            .into(),
        injury_or_condition: "Fractured left index finger.".into(),
        days_off_work: Some(14),
        responsible_person_name: "Site Manager".into(),
        responsible_person_position: "Operations Manager".into(),
        responsible_person_contact: "ops@example.co.uk".into(),
    }
}

#[test]
fn workplace_safety_with_harm_is_eligible() {
    let data = workplace_safety_assessment(Some(2));
    assert!(is_eligible(&data));
}

#[test]
fn workplace_safety_with_no_harm_is_not_eligible() {
    let data = workplace_safety_assessment(None);
    assert!(!is_eligible(&data));
}

#[test]
fn workplace_safety_with_harm_zero_is_not_eligible() {
    let data = workplace_safety_assessment(Some(0));
    assert!(!is_eligible(&data));
}

#[test]
fn medical_device_with_harm_is_eligible() {
    let mut data = workplace_safety_assessment(Some(1));
    data.reporter.issue_category = "medical-device".into();
    assert!(is_eligible(&data));
}

#[test]
fn unrelated_issue_is_not_eligible_and_returns_none() {
    let mut data = workplace_safety_assessment(Some(2));
    data.reporter.issue_category = "service-outage".into();
    let result = grade_issue(&data);
    assert!(to_riddor_report("issue-1", "x", &extras(), &data, &result).is_none());
}

#[test]
fn report_has_expected_shape_and_field_population() {
    let data = workplace_safety_assessment(Some(2));
    let result = grade_issue(&data);
    let report = to_riddor_report(
        "issue-99",
        "Hand caught in conveyor drive",
        &extras(),
        &data,
        &result,
    )
    .unwrap();

    assert_eq!(report["schema"], "hse-riddor-f2508-v1");
    assert_eq!(report["incidentId"], "issue-99");
    assert_eq!(report["incidentType"], "specified-injury");
    assert_eq!(report["summary"], "Hand caught in conveyor drive");
    assert_eq!(report["discoveredAt"], "2026-05-09T11:20:00Z");

    let rp = &report["responsiblePerson"];
    assert_eq!(rp["name"], "Site Manager");
    assert_eq!(rp["position"], "Operations Manager");
    assert_eq!(rp["contact"], "ops@example.co.uk");

    let ip = &report["injuredPerson"];
    assert_eq!(ip["role"], "employee");
    assert_eq!(ip["age"], 34);
    assert_eq!(ip["sex"], "f");

    let site = &report["site"];
    assert_eq!(site["addressLines"][0], "Warehouse 7");
    assert_eq!(site["addressLines"][2], "Manchester");
    assert_eq!(site["postcode"], "M17 1AA");
    assert_eq!(site["system"], "warehouse-conveyor-3");
    assert_eq!(site["component"], "drive-motor");
    assert_eq!(site["environment"], "field");

    let circ = &report["circumstances"];
    assert_eq!(circ["activityAtTime"], "Manual handling at conveyor 3");
    assert!(circ["howItHappened"]
        .as_str()
        .unwrap()
        .contains("guard fell open"));
    assert_eq!(circ["injuryOrCondition"], "Fractured left index finger.");
    assert_eq!(circ["daysOffWork"], 14);

    let assessment = &report["assessment"];
    assert_eq!(assessment["harmGrade"], 2);
    assert_eq!(assessment["severityOfImpact"], 4);
    assert_eq!(assessment["compositePriority"], "high");
}

#[test]
fn incident_type_serialises_as_kebab_case() {
    let mut data = workplace_safety_assessment(Some(4));
    data.scores.score_by_severity_of_impact = Some(5);
    let result = grade_issue(&data);

    let mut e = extras();
    e.incident_type = Some(RiddorIncidentType::Death);
    let r = to_riddor_report("d-1", "x", &e, &data, &result).unwrap();
    assert_eq!(r["incidentType"], "death");

    e.incident_type = Some(RiddorIncidentType::OverSevenDayInjury);
    let r = to_riddor_report("d-2", "x", &e, &data, &result).unwrap();
    assert_eq!(r["incidentType"], "over-seven-day-injury");

    e.incident_type = Some(RiddorIncidentType::DangerousOccurrence);
    let r = to_riddor_report("d-3", "x", &e, &data, &result).unwrap();
    assert_eq!(r["incidentType"], "dangerous-occurrence");
}
