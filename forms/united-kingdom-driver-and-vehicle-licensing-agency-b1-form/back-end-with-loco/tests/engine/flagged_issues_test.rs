use united_kingdom_driver_and_vehicle_licensing_agency_b1_form_loco_crate::engine::flagged_issues::detect_flagged_issues;
use united_kingdom_driver_and_vehicle_licensing_agency_b1_form_loco_crate::engine::types::*;

fn baseline() -> AssessmentData {
    let mut d = AssessmentData::default();
    d.authorisation.declaration_accepted = true;
    d
}

#[test]
fn baseline_has_no_urgent_flags() {
    let flags = detect_flagged_issues(&baseline());
    assert!(!flags.iter().any(|f| f.id == "FLAG-EPI-001"));
    assert!(!flags.iter().any(|f| f.id == "FLAG-AUTH-001"));
}

#[test]
fn unsigned_authorisation_emits_urgent_flag() {
    let mut d = baseline();
    d.authorisation.declaration_accepted = false;
    let flags = detect_flagged_issues(&d);
    assert!(flags
        .iter()
        .any(|f| f.id == "FLAG-AUTH-001" && f.priority == FlagPriority::Urgent));
}

#[test]
fn epilepsy_without_signed_declaration_emits_urgent_flag() {
    let mut d = baseline();
    d.seizures.had_seizures = "yes".into();
    d.seizures.diagnosis = "more-than-one-or-epilepsy".into();
    let flags = detect_flagged_issues(&d);
    assert!(flags
        .iter()
        .any(|f| f.id == "FLAG-EPI-001" && f.priority == FlagPriority::Urgent));
}

#[test]
fn drowsy_medication_emits_high_flag() {
    let mut d = baseline();
    d.medication.makes_drowsy_or_confused = "yes".into();
    let flags = detect_flagged_issues(&d);
    assert!(flags
        .iter()
        .any(|f| f.id == "FLAG-MED-001" && f.priority == FlagPriority::High));
}

#[test]
fn two_or_more_seizures_in_five_years_emits_high_flag() {
    let mut d = baseline();
    d.seizures.had_seizures = "yes".into();
    d.seizures.multiple.two_or_more_within_five_years = "yes".into();
    let flags = detect_flagged_issues(&d);
    assert!(flags
        .iter()
        .any(|f| f.id == "FLAG-SEIZ-003" && f.priority == FlagPriority::High));
}

#[test]
fn uncontrolled_double_vision_emits_high_flag() {
    let mut d = baseline();
    d.double_vision.has_double_vision = "yes".into();
    d.double_vision.suppressed_or_controlled = "no".into();
    let flags = detect_flagged_issues(&d);
    assert!(flags
        .iter()
        .any(|f| f.id == "FLAG-DIPL-001" && f.priority == FlagPriority::High));
}

#[test]
fn flags_sorted_by_priority() {
    let mut d = baseline();
    d.authorisation.declaration_accepted = false; // urgent
    d.medication.makes_drowsy_or_confused = "yes".into(); // high
    d.blackouts.had_blackouts = "yes".into(); // medium
    d.vehicle_adaptations.needs_adaptations = "yes".into(); // low
    let flags = detect_flagged_issues(&d);
    let priorities: Vec<&FlagPriority> = flags.iter().map(|f| &f.priority).collect();
    let mut sorted = priorities.clone();
    sorted.sort_by_key(|p| match p {
        FlagPriority::Urgent => 0,
        FlagPriority::High => 1,
        FlagPriority::Medium => 2,
        FlagPriority::Low => 3,
    });
    assert_eq!(priorities, sorted);
}
