use who_emergency_unit_trauma_form_tera_crate::engine::flagged_issues::detect_flagged_issues;
use who_emergency_unit_trauma_form_tera_crate::engine::types::*;

fn empty() -> AssessmentData {
    AssessmentData::default()
}

#[test]
fn empty_form_has_no_flags() {
    let flags = detect_flagged_issues(&empty());
    assert!(flags.is_empty(), "no flags expected on empty form: {flags:?}");
}

#[test]
fn low_gcs_emits_urgent_flag() {
    let mut data = empty();
    data.disability.gcs_total = Some(6.0);
    let flags = detect_flagged_issues(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-GCS-LOW" && f.priority == FlagPriority::Urgent)
    );
}

#[test]
fn moderate_gcs_emits_high_flag() {
    let mut data = empty();
    data.disability.gcs_total = Some(11.0);
    let flags = detect_flagged_issues(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-GCS-MOD" && f.priority == FlagPriority::High)
    );
}

#[test]
fn critical_spo2_emits_urgent_flag() {
    let mut data = empty();
    data.chief_complaint_and_vitals.initial_vitals.spo2 = Some(85.0);
    let flags = detect_flagged_issues(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-SPO2-CRIT" && f.priority == FlagPriority::Urgent)
    );
}

#[test]
fn stridor_red_sign_is_urgent() {
    let mut data = empty();
    data.high_risk_signs.red_stridor = true;
    let flags = detect_flagged_issues(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-STRIDOR" && f.priority == FlagPriority::Urgent)
    );
}

#[test]
fn fast_peritoneum_free_fluid_is_urgent() {
    let mut data = empty();
    data.exposure_and_fast.fast_peritoneum = "free-fluid".into();
    let flags = detect_flagged_issues(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-FAST-PERIT" && f.priority == FlagPriority::Urgent)
    );
}

#[test]
fn unstable_pelvis_is_urgent() {
    let mut data = empty();
    data.circulation.unstable_pelvis = "yes".into();
    let flags = detect_flagged_issues(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-UNSTABLE-PELVIS" && f.priority == FlagPriority::Urgent)
    );
}

#[test]
fn flags_are_sorted_by_priority() {
    let mut data = empty();
    // Mix of priorities:
    data.disability.gcs_total = Some(6.0); // urgent
    data.high_risk_signs.trauma_polytrauma = true; // high
    data.patient_registration.iv_drug_use = true; // medium
    let flags = detect_flagged_issues(&data);
    let priorities: Vec<FlagPriority> = flags.iter().map(|f| f.priority).collect();
    let mut sorted = priorities.clone();
    sorted.sort_by_key(|p| match p {
        FlagPriority::Urgent => 0,
        FlagPriority::High => 1,
        FlagPriority::Medium => 2,
        FlagPriority::Low => 3,
    });
    assert_eq!(priorities, sorted);
}
