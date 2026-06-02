use who_prehospital_form_loco_crate::engine::prehospital_validator::validate_prehospital;
use who_prehospital_form_loco_crate::engine::types::*;

fn empty() -> AssessmentData {
    AssessmentData::default()
}

/// Build a baseline run sheet with every always-on rule satisfied.
fn baseline_complete_case() -> AssessmentData {
    let mut d = empty();
    d.caller_and_scene.patient_name = "Jane Doe".into();
    d.caller_and_scene.sex = "female".into();
    d.caller_and_scene.date_of_birth_or_age = "1972-04-11".into();
    d.caller_and_scene.date = "2026-06-01".into();
    d.caller_and_scene.scene_call_type = "scene".into();
    d.caller_and_scene.scene_location_type = "residence".into();
    d.caller_and_scene.time_call_received = "09:00".into();
    d.caller_and_scene.time_arrived_at_scene = "09:08".into();

    d.chief_complaint_and_vitals.chief_complaint = "Chest pain".into();
    d.chief_complaint_and_vitals.initial_vitals.time = "09:10".into();
    d.chief_complaint_and_vitals.initial_vitals.hr = Some(80.0);
    d.chief_complaint_and_vitals.initial_vitals.rr = Some(16.0);
    d.chief_complaint_and_vitals.initial_vitals.bp = "120/80".into();
    d.chief_complaint_and_vitals.initial_vitals.spo2 = Some(98.0);

    d.triage.category = "green".into();
    d.airway.normal = true;
    d.breathing.normal = true;
    d.circulation.normal = true;
    d.disability.avpu = "A".into();

    d.sample_history.allergies_unknown = true;
    d.sample_history.medications_unknown = true;
    d.sample_history.past_medical_unknown = true;
    d.sample_history.events_unknown = true;

    d.assessment_and_plan.summary = "Stable.".into();
    d.assessment_and_plan.presumptive_diagnoses = "Musculoskeletal chest pain.".into();

    d.disposition.disposition = "Transport to ED.".into();
    d.disposition.handover_time = "09:35".into();
    d.disposition.handover_to_name = "Dr Smith".into();
    d.disposition.provider_name = "Medic A".into();
    d.disposition.provider_signature = "MA".into();
    d.disposition.provider_signature_date = "2026-06-01".into();

    d
}

#[test]
fn empty_case_is_incomplete() {
    let data = empty();
    let r = validate_prehospital(&data);
    assert!(!r.complete);
    assert_eq!(r.total_satisfied, 0);
}

#[test]
fn fully_completed_case_is_complete() {
    let data = baseline_complete_case();
    let r = validate_prehospital(&data);
    assert!(
        r.complete,
        "expected complete run sheet but missing: {:?}",
        r.missing.iter().map(|m| &m.id).collect::<Vec<_>>()
    );
    assert_eq!(r.total_satisfied, r.total_required);
}

#[test]
fn red_triage_raises_required_count() {
    let mut data = baseline_complete_case();
    data.triage.category = "red".into();
    // Force airway-not-normal so A-02 applies.
    data.airway.normal = false;
    data.airway.stridor = true; // A-01 still satisfied (stridor counts as a finding)

    let r = validate_prehospital(&data);
    // A-02, C-03, D-02 newly apply.
    assert!(r.missing.iter().any(|m| m.id == "A-02"));
    assert!(r.missing.iter().any(|m| m.id == "C-03"));
    assert!(r.missing.iter().any(|m| m.id == "D-02"));
}

#[test]
fn injury_flag_requires_intent_and_mechanism() {
    let mut data = baseline_complete_case();
    data.chief_complaint_and_vitals.injury = true;
    let r = validate_prehospital(&data);
    assert!(r.missing.iter().any(|m| m.id == "INJ-01"));
    assert!(r.missing.iter().any(|m| m.id == "INJ-02"));

    data.injury_details.intent = "unintentional".into();
    data.injury_details.mechanism_fall = true;
    let r = validate_prehospital(&data);
    assert!(!r.missing.iter().any(|m| m.id == "INJ-01"));
    assert!(!r.missing.iter().any(|m| m.id == "INJ-02"));
}

#[test]
fn reassessments_capped_at_three() {
    let mut data = baseline_complete_case();
    data.reassessments = vec![
        Reassessment::default(),
        Reassessment::default(),
        Reassessment::default(),
        Reassessment::default(),
    ];
    let r = validate_prehospital(&data);
    assert!(r.missing.iter().any(|m| m.id == "RA-01"));
}
