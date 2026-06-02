use who_surgical_safety_checklist_loco_crate::engine::flagged_issues::detect_additional_flags;
use who_surgical_safety_checklist_loco_crate::engine::types::*;

fn baseline_case() -> AssessmentData {
    AssessmentData {
        sign_in: SignIn {
            identity_site_procedure_consent: "yes".to_string(),
            site_marked: "not-applicable".to_string(),
            anaesthesia_check_complete: "yes".to_string(),
            pulse_oximeter_on_patient: "yes".to_string(),
            known_allergy: "no".to_string(),
            known_allergy_detail: String::new(),
            difficult_airway_aspiration_risk: "no".to_string(),
            blood_loss_risk: "no".to_string(),
            coordinator_name: "Coordinator".to_string(),
            coordinator_role: "Circulating Nurse".to_string(),
            completed_at: "2026-06-01T08:55".to_string(),
        },
        time_out: TimeOut {
            team_introductions_confirmed: "yes".to_string(),
            patient_procedure_incision_confirmed: "yes".to_string(),
            antibiotic_prophylaxis_within_60min: "yes".to_string(),
            surgeon_critical_steps: "Standard.".to_string(),
            surgeon_case_duration_minutes: Some(60),
            surgeon_anticipated_blood_loss_ml: Some(50),
            anaesthetist_patient_concerns: String::new(),
            nursing_sterility_confirmed: "yes".to_string(),
            nursing_equipment_concerns: String::new(),
            essential_imaging_displayed: "not-applicable".to_string(),
            coordinator_name: "Coordinator".to_string(),
            coordinator_role: "Circulating Nurse".to_string(),
            completed_at: "2026-06-01T09:05".to_string(),
        },
        sign_out: SignOut {
            procedure_name_confirmed: "yes".to_string(),
            counts_confirmed: "yes".to_string(),
            specimens_labelled: "yes".to_string(),
            equipment_problems: String::new(),
            recovery_concerns: String::new(),
            coordinator_name: "Coordinator".to_string(),
            coordinator_role: "Circulating Nurse".to_string(),
            completed_at: "2026-06-01T11:25".to_string(),
        },
        ..AssessmentData::default()
    }
}

#[test]
fn baseline_has_no_flags() {
    let flags = detect_additional_flags(&baseline_case());
    assert!(flags.is_empty(), "baseline should not produce flags: {flags:?}");
}

#[test]
fn count_discrepancy_emits_high_priority_flag() {
    let mut data = baseline_case();
    data.sign_out.counts_confirmed = "no".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-CNT-001" && f.priority == "high"));
}

#[test]
fn known_allergy_emits_high_priority_flag() {
    let mut data = baseline_case();
    data.sign_in.known_allergy = "yes".to_string();
    data.sign_in.known_allergy_detail = "Penicillin (anaphylaxis).".to_string();
    let flags = detect_additional_flags(&data);
    let flag = flags.iter().find(|f| f.id == "FLAG-ALL-001").expect("allergy flag");
    assert_eq!(flag.priority, "high");
    assert!(flag.message.contains("Penicillin"));
}

#[test]
fn difficult_airway_emits_flag() {
    let mut data = baseline_case();
    data.sign_in.difficult_airway_aspiration_risk = "yes-equipment-available".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-AIR-001" && f.priority == "high"));
}

#[test]
fn blood_loss_risk_emits_flag() {
    let mut data = baseline_case();
    data.sign_in.blood_loss_risk = "yes-two-ivs-and-fluids-planned".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-BL-001" && f.priority == "high"));
}

#[test]
fn specimen_label_concern_emits_flag() {
    let mut data = baseline_case();
    data.sign_out.specimens_labelled = "no".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-SPEC-001" && f.priority == "high"));
}

#[test]
fn equipment_problem_emits_medium_flag() {
    let mut data = baseline_case();
    data.sign_out.equipment_problems = "Electrosurgical unit intermittent.".to_string();
    let flags = detect_additional_flags(&data);
    let flag = flags.iter().find(|f| f.id == "FLAG-EQP-001").expect("equipment flag");
    assert_eq!(flag.priority, "medium");
}

#[test]
fn abandoned_case_emits_high_priority_flag() {
    let mut data = baseline_case();
    data.sign_out = SignOut::default();
    data.case_details.abandoned_reason = "Cancelled at induction.".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-ABA-001" && f.priority == "high"));
}

#[test]
fn flags_are_sorted_by_priority() {
    let mut data = baseline_case();
    // One high, one medium, one low.
    data.sign_in.known_allergy = "yes".to_string();
    data.sign_in.known_allergy_detail = "Latex.".to_string();
    data.sign_out.equipment_problems = "Foot pedal sticky.".to_string();
    data.sign_out.recovery_concerns = "Monitor blood pressure closely.".to_string();
    let flags = detect_additional_flags(&data);
    let priorities: Vec<&str> = flags.iter().map(|f| f.priority.as_str()).collect();
    let mut sorted = priorities.clone();
    sorted.sort_by_key(|p| match *p {
        "high" => 0,
        "medium" => 1,
        "low" => 2,
        _ => 3,
    });
    assert_eq!(priorities, sorted);
}
