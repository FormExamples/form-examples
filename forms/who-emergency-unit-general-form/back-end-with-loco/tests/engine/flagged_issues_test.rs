use who_emergency_unit_general_form_loco_crate::engine::flagged_issues::detect_flagged_issues;
use who_emergency_unit_general_form_loco_crate::engine::types::*;

fn empty() -> AssessmentData {
    AssessmentData::default()
}

#[test]
fn empty_form_has_no_flags() {
    let flags = detect_flagged_issues(&empty());
    assert!(flags.is_empty());
}

#[test]
fn dead_on_arrival_flag() {
    let mut data = empty();
    data.chief_complaint_and_vitals.dead_on_arrival = true;
    let flags = detect_flagged_issues(&data);
    assert!(flags
        .iter()
        .any(|f| f.id == "FLAG-DOA" && f.priority == FlagPriority::Urgent));
}

#[test]
fn avpu_unresponsive_without_airway_intervention_flags_urgent() {
    let mut data = empty();
    data.disability.avpu = "U".into();
    let flags = detect_flagged_issues(&data);
    assert!(flags
        .iter()
        .any(|f| f.id == "FLAG-AVPU-U" && f.priority == FlagPriority::Urgent));
    assert!(flags
        .iter()
        .any(|f| f.id == "FLAG-AVPU-AIRWAY" && f.priority == FlagPriority::Urgent));

    data.airway.intervention_bvm = true;
    let flags2 = detect_flagged_issues(&data);
    assert!(!flags2.iter().any(|f| f.id == "FLAG-AVPU-AIRWAY"));
    assert!(flags2.iter().any(|f| f.id == "FLAG-AVPU-U"));
}

#[test]
fn critical_vitals_flag_urgent_issues_and_sort_order_holds() {
    let mut data = empty();
    data.chief_complaint_and_vitals.initial_vitals.spo2 = Some(85.0);
    data.chief_complaint_and_vitals.initial_vitals.bp_systolic = Some(80.0);

    let flags = detect_flagged_issues(&data);
    assert!(flags
        .iter()
        .any(|f| f.id == "FLAG-SPO2-CRIT" && f.priority == FlagPriority::Urgent));
    assert!(flags
        .iter()
        .any(|f| f.id == "FLAG-VIT-SBP-LOW" && f.priority == FlagPriority::High));

    let last_urgent = flags
        .iter()
        .rposition(|f| f.priority == FlagPriority::Urgent)
        .unwrap();
    let first_high = flags
        .iter()
        .position(|f| f.priority == FlagPriority::High)
        .unwrap();
    assert!(last_urgent < first_high);
}

#[test]
fn hypoglycaemia_flag() {
    let mut data = empty();
    data.disability.blood_glucose_mmol = Some(2.5);
    let flags = detect_flagged_issues(&data);
    assert!(flags
        .iter()
        .any(|f| f.id == "FLAG-GLUC-LOW" && f.priority == FlagPriority::Urgent));
}

#[test]
fn discharge_without_plan_emits_low_flag() {
    let mut data = empty();
    data.disposition.disposition = "discharge".into();
    data.disposition.discharge_plan_discussed = "no".into();
    let flags = detect_flagged_issues(&data);
    assert!(flags
        .iter()
        .any(|f| f.id == "FLAG-DISP-NOPLAN" && f.priority == FlagPriority::Low));
}
