use united_kingdom_driver_and_vehicle_licensing_agency_b1_form_loco_crate::engine::b1_rules::b1_rules;
use united_kingdom_driver_and_vehicle_licensing_agency_b1_form_loco_crate::engine::b1_validator::validate_b1;
use united_kingdom_driver_and_vehicle_licensing_agency_b1_form_loco_crate::engine::types::*;

fn empty() -> AssessmentData {
    AssessmentData::default()
}

/// Build a fully-populated assessment with the simplest set of answers that
/// satisfies every rule.
fn fully_completed_assessment() -> AssessmentData {
    let mut d = empty();
    d.personal_details.title = "Mr".into();
    d.personal_details.full_name = "John Doe".into();
    d.personal_details.date_of_birth = "1980-01-15".into();
    d.personal_details.address_line1 = "1 High Street".into();
    d.personal_details.postcode = "SW1A 1AA".into();
    d.personal_details.contact_number = "01234 567890".into();

    d.healthcare_professionals.gp.gp_name = "Dr Smith".into();
    d.healthcare_professionals.gp.surgery_name = "Central Surgery".into();
    d.healthcare_professionals.gp.postcode = "SW1A 2BB".into();
    d.healthcare_professionals.gp.date_last_seen = "2026-04-01".into();

    d.condition_history.brain_surgery_not_applicable = true;

    d.treatment_provider.last_seen = "gp".into();
    d.treatment_provider.gp_last_contact_date = "2026-04-01".into();

    d.blackouts.had_blackouts = "no".into();
    d.seizures.had_seizures = "no".into();
    d.medication.no_medication_taken = true;
    d.vp_shunt.had_vp_shunt_or_drain = "no".into();
    d.daily_living.needs_help = "no".into();
    d.double_vision.has_double_vision = "no".into();
    d.eyesight.has_eyesight_problems = "no".into();
    d.vehicle_adaptations.needs_adaptations = "no".into();

    d.authorisation.declaration_accepted = true;
    d.authorisation.name = "John Doe".into();
    d.authorisation.signature_date = "2026-06-01".into();
    d.authorisation.electronic_correspondence_consent = "no".into();
    d
}

#[test]
fn empty_form_is_incomplete() {
    let r = validate_b1(&empty());
    assert!(!r.complete);
    assert!(r.total_required > 0);
    assert_eq!(r.total_satisfied, 0);
    assert!(r.missing.iter().any(|m| m.id == "PD-01"));
    // Q5-01 only applies when Q4=yes & diagnosis=first-ever — not on empty form
    assert!(!r.missing.iter().any(|m| m.id == "Q5-01"));
}

#[test]
fn q4_no_skips_q5_and_q6() {
    let mut d = empty();
    d.seizures.had_seizures = "no".into();
    let r = validate_b1(&d);
    for id in [
        "Q4-02", "Q5-01", "Q6a-01", "Q6g-01", "Q6h-01", "Q6i-01",
        "Q6-EPI-01", "Q6-EPI-02", "Q6-EPI-03",
    ] {
        assert!(!r.missing.iter().any(|m| m.id == id), "rule {id} should not apply");
    }
}

#[test]
fn fully_completed_assessment_is_complete() {
    let r = validate_b1(&fully_completed_assessment());
    assert!(r.complete, "fully completed assessment should be complete, missing: {:?}", r.missing);
}

#[test]
fn epilepsy_declaration_required_when_more_than_one_seizure() {
    let mut d = empty();
    d.seizures.had_seizures = "yes".into();
    d.seizures.diagnosis = "more-than-one-or-epilepsy".into();
    let r = validate_b1(&d);
    assert!(r.missing.iter().any(|m| m.id == "Q6-EPI-01"));
    assert!(r.missing.iter().any(|m| m.id == "Q6-EPI-02"));
    assert!(r.missing.iter().any(|m| m.id == "Q6-EPI-03"));
}

#[test]
fn rule_ids_are_unique() {
    let mut ids: Vec<&str> = b1_rules().iter().map(|r| r.id).collect();
    ids.sort();
    let len_before = ids.len();
    ids.dedup();
    assert_eq!(ids.len(), len_before, "rule IDs must be unique");
}
