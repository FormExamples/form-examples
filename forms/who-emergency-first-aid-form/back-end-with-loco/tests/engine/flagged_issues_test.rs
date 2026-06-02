use who_emergency_first_aid_form_loco_crate::engine::flagged_issues::detect_flagged_issues;
use who_emergency_first_aid_form_loco_crate::engine::types::*;

fn baseline() -> AssessmentData {
    let mut d = AssessmentData::default();
    d.major_bleeding.assessment_normal = true;
    d.major_bleeding.interventions.none = true;
    d.airway.assessment_normal = true;
    d.airway.interventions.none = true;
    d.breathing.assessment_normal = true;
    d.breathing.interventions.none = true;
    d.circulation.assessment_normal = true;
    d.circulation.interventions.none = true;
    d.disability.assessment_normal = true;
    d.disability.interventions.none = true;
    d.exposure.assessment_normal = true;
    d.exposure.interventions.none = true;
    d.exposure.medication_taken_none = true;
    d
}

#[test]
fn baseline_has_no_flags() {
    let flags = detect_flagged_issues(&baseline());
    assert!(flags.is_empty(), "baseline should not produce flags: {flags:?}");
}

#[test]
fn major_bleeding_without_intervention_is_urgent() {
    let mut d = baseline();
    d.major_bleeding.assessment_normal = false;
    d.major_bleeding.interventions.none = false;
    d.major_bleeding.assessment_findings = "Heavy bleeding from left thigh.".into();
    let flags = detect_flagged_issues(&d);
    assert!(flags
        .iter()
        .any(|f| f.id == "FLAG-MB-001" && f.priority == FlagPriority::Urgent));
}

#[test]
fn tourniquet_without_time_is_urgent() {
    let mut d = baseline();
    d.major_bleeding.assessment_normal = false;
    d.major_bleeding.assessment_findings = "Massive bleeding, right arm".into();
    d.major_bleeding.interventions.none = false;
    d.major_bleeding.interventions.tourniquet = true;
    // tourniquet_application_time intentionally left blank.

    let flags = detect_flagged_issues(&d);
    assert!(flags
        .iter()
        .any(|f| f.id == "FLAG-MB-002" && f.priority == FlagPriority::Urgent));
    assert!(flags
        .iter()
        .any(|f| f.id == "FLAG-MB-003" && f.priority == FlagPriority::High));
}

#[test]
fn pregnancy_yes_emits_high_flag() {
    let mut d = baseline();
    d.situation.pregnant = "yes".into();
    let flags = detect_flagged_issues(&d);
    assert!(flags
        .iter()
        .any(|f| f.id == "FLAG-PR-001" && f.priority == FlagPriority::High));
}

#[test]
fn flags_are_sorted_by_priority() {
    let mut d = baseline();
    // urgent: airway abnormal w/o intervention
    d.airway.assessment_normal = false;
    d.airway.interventions.none = false;
    d.airway.assessment_findings = "Audible stridor".into();
    // high: pregnancy
    d.situation.pregnant = "yes".into();
    // medium: possible fracture
    d.recommendations.precautions.possible_fracture = true;
    // low: glucose given
    d.disability.interventions.glucose_given = true;

    let flags = detect_flagged_issues(&d);
    let priorities: Vec<FlagPriority> = flags.iter().map(|f| f.priority).collect();
    let mut sorted = priorities.clone();
    sorted.sort_by_key(|p| match *p {
        FlagPriority::Urgent => 0u8,
        FlagPriority::High => 1,
        FlagPriority::Medium => 2,
        FlagPriority::Low => 3,
    });
    assert_eq!(priorities, sorted);
}
