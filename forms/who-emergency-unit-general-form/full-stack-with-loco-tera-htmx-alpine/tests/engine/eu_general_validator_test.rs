use who_emergency_unit_general_form_tera_crate::engine::eu_general_validator::validate_eu_general;
use who_emergency_unit_general_form_tera_crate::engine::types::*;

fn empty() -> AssessmentData {
    AssessmentData::default()
}

#[test]
fn empty_form_is_incomplete_and_skips_conditional_rules() {
    let data = empty();
    let r = validate_eu_general(&data);
    assert!(!r.complete);
    assert!(r.total_required > 0);
    assert_eq!(r.total_satisfied, 0);
    // Conditional rules must not fire on an empty form.
    assert!(!r.missing.iter().any(|m| m.id == "PR-08")); // ambulance level
    assert!(!r.missing.iter().any(|m| m.id == "D-02")); // deficit description
    assert!(!r.missing.iter().any(|m| m.id == "DISP-05")); // admit ward
    assert!(!r.missing.iter().any(|m| m.id == "DISP-06")); // transfer to
    assert!(!r.missing.iter().any(|m| m.id == "DISP-07")); // died cause
    // PR-01 (surname) must be in the missing list.
    assert!(r.missing.iter().any(|m| m.id == "PR-01"));
}

#[test]
fn ambulance_arrival_requires_ambulance_level() {
    let mut data = empty();
    data.patient_registration.arrival_mode = "ambulance".into();
    let r = validate_eu_general(&data);
    assert!(r.missing.iter().any(|m| m.id == "PR-08"));

    data.patient_registration.ambulance_level = "advanced".into();
    let r2 = validate_eu_general(&data);
    assert!(!r2.missing.iter().any(|m| m.id == "PR-08"));
}

#[test]
fn admit_disposition_requires_admit_ward() {
    let mut data = empty();
    data.disposition.disposition = "admit".into();
    let r = validate_eu_general(&data);
    assert!(r.missing.iter().any(|m| m.id == "DISP-05"));

    data.disposition.admit_ward = "icu".into();
    let r2 = validate_eu_general(&data);
    assert!(!r2.missing.iter().any(|m| m.id == "DISP-05"));
}

#[test]
fn transfer_requires_transfer_destination() {
    let mut data = empty();
    data.disposition.disposition = "transfer".into();
    let r = validate_eu_general(&data);
    assert!(r.missing.iter().any(|m| m.id == "DISP-06"));

    data.disposition.transfer_to = "Regional Hospital".into();
    let r2 = validate_eu_general(&data);
    assert!(!r2.missing.iter().any(|m| m.id == "DISP-06"));
}

#[test]
fn died_disposition_requires_cause() {
    let mut data = empty();
    data.disposition.disposition = "died".into();
    let r = validate_eu_general(&data);
    assert!(r.missing.iter().any(|m| m.id == "DISP-07"));

    data.disposition.died_cause = "Sepsis".into();
    let r2 = validate_eu_general(&data);
    assert!(!r2.missing.iter().any(|m| m.id == "DISP-07"));
}

#[test]
fn deficit_requires_description() {
    let mut data = empty();
    data.disability.deficit = true;
    let r = validate_eu_general(&data);
    assert!(r.missing.iter().any(|m| m.id == "D-02"));

    data.disability.deficit_description = "Right-sided weakness".into();
    let r2 = validate_eu_general(&data);
    assert!(!r2.missing.iter().any(|m| m.id == "D-02"));
}
