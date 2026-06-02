use who_emergency_first_aid_form_loco_crate::engine::cfar_rules::cfar_rules;
use who_emergency_first_aid_form_loco_crate::engine::cfar_validator::validate_cfar;
use who_emergency_first_aid_form_loco_crate::engine::types::*;

fn empty() -> AssessmentData {
    AssessmentData::default()
}

/// Build a fully-completed, minimally valid encounter record.
fn fully_completed_encounter() -> AssessmentData {
    let mut d = AssessmentData::default();
    d.patient_identification.patient_name = "DOE, Jane".to_string();
    d.patient_identification.sex = "female".to_string();
    d.referral_transport.referral_facility.name = "St James's Hospital ED".to_string();
    d.referral_transport.event_date_time = "2026-06-01T08:00".to_string();
    d.referral_transport.departure_date_time = "2026-06-01T08:15".to_string();
    d.situation.medical = true;
    d.situation.pregnant = "no".to_string();
    d.situation.what_happened = "Patient slipped on a wet floor.".to_string();
    d.background.past_medical_and_surgical_history = "None.".to_string();
    d.background.current_medications_or_allergies = "None.".to_string();

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

    d.recommendations.transport_plan = "Transport by ambulance.".to_string();
    d.responder_details.name = "John Smith".to_string();
    d.responder_details.signature = "JS".to_string();
    d.responder_details.contact_information = "+44 7700 900123".to_string();
    d.responder_details.cfar_organization = "Red Cross".to_string();
    d
}

#[test]
fn empty_form_is_incomplete_and_skips_conditional_rules() {
    let data = empty();
    let r = validate_cfar(&data);
    assert!(!r.complete);
    assert!(r.total_required > 0);
    assert_eq!(r.total_satisfied, 0);
    assert_eq!(r.missing.len() as u32, r.total_required);
    assert!(r.missing.iter().any(|m| m.id == "PI-01"));
    // Conditional rules must NOT apply on an empty form.
    assert!(!r.missing.iter().any(|m| m.id == "MB-03"));
    assert!(!r.missing.iter().any(|m| m.id == "RC-02"));
}

#[test]
fn assessment_normal_or_finding_text_satisfies_assessment_rule() {
    let mut data = empty();
    data.major_bleeding.assessment_normal = true;
    data.airway.assessment_normal = true;
    let r = validate_cfar(&data);
    assert!(!r.missing.iter().any(|m| m.id == "MB-01"));
    assert!(!r.missing.iter().any(|m| m.id == "AW-01"));

    let mut data2 = empty();
    data2.major_bleeding.assessment_findings = "Bright red bleeding, left thigh".into();
    data2.airway.assessment_findings = "Audible stridor".into();
    let r2 = validate_cfar(&data2);
    assert!(!r2.missing.iter().any(|m| m.id == "MB-01"));
    assert!(!r2.missing.iter().any(|m| m.id == "AW-01"));

    let mut data3 = empty();
    data3.major_bleeding.interventions.none = true;
    let r3 = validate_cfar(&data3);
    assert!(!r3.missing.iter().any(|m| m.id == "MB-02"));
}

#[test]
fn tourniquet_without_time_fires_mb03() {
    let mut data = empty();
    data.major_bleeding.assessment_findings = "Massive bleeding, right arm".into();
    data.major_bleeding.interventions.tourniquet = true;
    let r = validate_cfar(&data);
    assert!(r.missing.iter().any(|m| m.id == "MB-03"));
}

#[test]
fn other_precaution_without_details_fires_rc02() {
    let mut data = empty();
    data.recommendations.precautions.other = true;
    let r = validate_cfar(&data);
    assert!(r.missing.iter().any(|m| m.id == "RC-02"));
}

#[test]
fn fully_completed_encounter_is_complete() {
    let data = fully_completed_encounter();
    let r = validate_cfar(&data);
    assert!(r.complete, "missing: {:?}", r.missing);
    assert_eq!(r.total_satisfied, r.total_required);
}

#[test]
fn rule_ids_are_unique() {
    let mut ids: Vec<&str> = cfar_rules().iter().map(|r| r.id).collect();
    ids.sort();
    let len_before = ids.len();
    ids.dedup();
    assert_eq!(ids.len(), len_before, "rule IDs must be unique");
}
