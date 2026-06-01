use who_prehospital_form_tera_crate::engine::flagged_issues::detect_flagged_issues;
use who_prehospital_form_tera_crate::engine::types::*;

fn baseline() -> AssessmentData {
    let mut d = AssessmentData::default();
    d.chief_complaint_and_vitals.initial_vitals.hr = Some(80.0);
    d.chief_complaint_and_vitals.initial_vitals.rr = Some(16.0);
    d.chief_complaint_and_vitals.initial_vitals.bp = "120/80".into();
    d.chief_complaint_and_vitals.initial_vitals.spo2 = Some(98.0);
    d.chief_complaint_and_vitals.initial_vitals.temp_c = Some(37.0);
    d.disability.avpu = "A".into();
    d
}

#[test]
fn baseline_has_no_flags() {
    let flags = detect_flagged_issues(&baseline());
    assert!(flags.is_empty(), "baseline should have no flags: {flags:?}");
}

#[test]
fn mass_casualty_emits_urgent_flag() {
    let mut data = baseline();
    data.caller_and_scene.mass_casualty = true;
    let flags = detect_flagged_issues(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-MASS-CASUALTY" && f.priority == FlagPriority::Urgent)
    );
}

#[test]
fn avpu_u_emits_urgent_flag() {
    let mut data = baseline();
    data.disability.avpu = "U".into();
    let flags = detect_flagged_issues(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-AVPU-U" && f.priority == FlagPriority::Urgent)
    );
}

#[test]
fn gcs_under_8_without_airway_intervention_flags_urgent() {
    let mut data = baseline();
    data.disability.gcs_eye = Some(1.0);
    data.disability.gcs_verbal = Some(1.0);
    data.disability.gcs_motor = Some(4.0); // total = 6
    let flags = detect_flagged_issues(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-GCS-AIRWAY" && f.priority == FlagPriority::Urgent)
    );

    // With airway intervention, GCS-AIRWAY clears, GCS-LOW fires.
    data.airway.intervention_bvm = true;
    let flags2 = detect_flagged_issues(&data);
    assert!(!flags2.iter().any(|f| f.id == "FLAG-GCS-AIRWAY"));
    assert!(flags2.iter().any(|f| f.id == "FLAG-GCS-LOW"));
}

#[test]
fn critical_spo2_emits_urgent_flag() {
    let mut data = baseline();
    data.chief_complaint_and_vitals.initial_vitals.spo2 = Some(85.0);
    let flags = detect_flagged_issues(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-SPO2-CRIT" && f.priority == FlagPriority::Urgent)
    );
}

#[test]
fn hypotension_without_iv_access_emits_high_flag() {
    let mut data = baseline();
    data.chief_complaint_and_vitals.initial_vitals.bp = "80/50".into();
    let flags = detect_flagged_issues(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-HYPO-NOIV" && f.priority == FlagPriority::High)
    );
}

#[test]
fn flags_are_sorted_urgent_first() {
    let mut data = baseline();
    data.disability.avpu = "U".into();
    data.chief_complaint_and_vitals.pregnant = "yes".into();
    let flags = detect_flagged_issues(&data);
    let priorities: Vec<FlagPriority> = flags.iter().map(|f| f.priority).collect();
    let mut sorted = priorities.clone();
    sorted.sort_by_key(|p| match p {
        FlagPriority::Urgent => 0u8,
        FlagPriority::High => 1,
        FlagPriority::Medium => 2,
        FlagPriority::Low => 3,
    });
    assert_eq!(priorities, sorted);
}
