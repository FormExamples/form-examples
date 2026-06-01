use who_surgical_safety_checklist_tera_crate::engine::checklist_grader::{grade, run_rules};
use who_surgical_safety_checklist_tera_crate::engine::checklist_rules::all_rules;
use who_surgical_safety_checklist_tera_crate::engine::types::*;

/// Build a completed checklist with every item answered "yes" / safe and a
/// coordinator sign-off for each phase.
fn fully_completed_case() -> AssessmentData {
    AssessmentData {
        case_details: CaseDetails {
            patient_name: "Jane Doe".to_string(),
            patient_date_of_birth: "1972-04-11".to_string(),
            patient_sex: "female".to_string(),
            patient_nhs_number: "943 476 5919".to_string(),
            patient_medical_record_number: "MRN-001".to_string(),
            patient_weight_as_kg: Some(72.0),
            surgeon_name: "Mr Alex Smith".to_string(),
            anaesthetist_name: "Dr Priya Patel".to_string(),
            lead_nurse_name: "Sister Mary Jones".to_string(),
            site_name: "St James's Hospital".to_string(),
            operating_room: "OR 4".to_string(),
            case_date: "2026-06-01".to_string(),
            case_start_at: "2026-06-01T09:00".to_string(),
            case_end_at: "2026-06-01T11:30".to_string(),
            planned_procedure: "Laparoscopic cholecystectomy".to_string(),
            surgical_specialty: "General Surgery".to_string(),
            urgency: "elective".to_string(),
            laterality: "na".to_string(),
            is_paediatric: "no".to_string(),
            abandoned_reason: String::new(),
        },
        sign_in: SignIn {
            identity_site_procedure_consent: "yes".to_string(),
            site_marked: "not-applicable".to_string(),
            anaesthesia_check_complete: "yes".to_string(),
            pulse_oximeter_on_patient: "yes".to_string(),
            known_allergy: "no".to_string(),
            known_allergy_detail: String::new(),
            difficult_airway_aspiration_risk: "no".to_string(),
            blood_loss_risk: "no".to_string(),
            coordinator_name: "Sister Mary Jones".to_string(),
            coordinator_role: "Circulating Nurse".to_string(),
            completed_at: "2026-06-01T08:55".to_string(),
        },
        time_out: TimeOut {
            team_introductions_confirmed: "yes".to_string(),
            patient_procedure_incision_confirmed: "yes".to_string(),
            antibiotic_prophylaxis_within_60min: "yes".to_string(),
            surgeon_critical_steps: "Standard four-port laparoscopic technique.".to_string(),
            surgeon_case_duration_minutes: Some(120),
            surgeon_anticipated_blood_loss_ml: Some(50),
            anaesthetist_patient_concerns: "No concerns.".to_string(),
            nursing_sterility_confirmed: "yes".to_string(),
            nursing_equipment_concerns: String::new(),
            essential_imaging_displayed: "not-applicable".to_string(),
            coordinator_name: "Sister Mary Jones".to_string(),
            coordinator_role: "Circulating Nurse".to_string(),
            completed_at: "2026-06-01T09:05".to_string(),
        },
        sign_out: SignOut {
            procedure_name_confirmed: "yes".to_string(),
            counts_confirmed: "yes".to_string(),
            specimens_labelled: "yes".to_string(),
            equipment_problems: String::new(),
            recovery_concerns: String::new(),
            coordinator_name: "Sister Mary Jones".to_string(),
            coordinator_role: "Circulating Nurse".to_string(),
            completed_at: "2026-06-01T11:25".to_string(),
        },
        team_members: vec![
            TeamMember {
                name: "Mr Alex Smith".to_string(),
                role: "surgeon".to_string(),
                introduced_during_time_out: "yes".to_string(),
                notes: String::new(),
            },
            TeamMember {
                name: "Dr Priya Patel".to_string(),
                role: "anaesthetist".to_string(),
                introduced_during_time_out: "yes".to_string(),
                notes: String::new(),
            },
        ],
    }
}

#[test]
fn empty_case_is_not_started() {
    let data = AssessmentData::default();
    let result = grade(&data);
    assert_eq!(result.checklist_status, "not-started");
    assert_eq!(result.overall_percent, 0);
    assert_eq!(result.sign_in_progress.answered, 0);
    assert_eq!(result.time_out_progress.answered, 0);
    assert_eq!(result.sign_out_progress.answered, 0);
}

#[test]
fn fully_completed_case_is_complete() {
    let data = fully_completed_case();
    let result = grade(&data);
    assert_eq!(result.checklist_status, "complete");
    assert_eq!(result.overall_percent, 100);
    assert!(result.sign_in_progress.signed_off);
    assert!(result.time_out_progress.signed_off);
    assert!(result.sign_out_progress.signed_off);
}

#[test]
fn count_discrepancy_yields_complete_with_concerns() {
    let mut data = fully_completed_case();
    data.sign_out.counts_confirmed = "no".to_string();
    let result = grade(&data);
    assert_eq!(result.checklist_status, "complete-with-concerns");
    assert!(
        result
            .additional_flags
            .iter()
            .any(|f| f.id == "FLAG-CNT-001" && f.priority == "high")
    );
}

#[test]
fn allergy_yes_without_detail_fires_rule() {
    let mut data = fully_completed_case();
    data.sign_in.known_allergy = "yes".to_string();
    data.sign_in.known_allergy_detail = String::new();
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "SI-05b"));
}

#[test]
fn abandoned_case_has_abandoned_status() {
    let mut data = fully_completed_case();
    data.sign_out = SignOut::default();
    data.case_details.abandoned_reason = "Patient developed atrial fibrillation pre-induction; case postponed.".to_string();
    let result = grade(&data);
    assert_eq!(result.checklist_status, "abandoned");
}

#[test]
fn rule_ids_are_unique() {
    let rules = all_rules();
    let mut ids: Vec<&str> = rules.iter().map(|r| r.id).collect();
    ids.sort();
    let len_before = ids.len();
    ids.dedup();
    assert_eq!(ids.len(), len_before, "rule IDs must be unique");
}

#[test]
fn sign_in_complete_status() {
    let mut data = fully_completed_case();
    // Wipe Time Out + Sign Out.
    data.time_out = TimeOut::default();
    data.sign_out = SignOut::default();
    let result = grade(&data);
    assert_eq!(result.checklist_status, "sign-in-complete");
    assert!(result.sign_in_progress.signed_off);
    assert!(!result.time_out_progress.signed_off);
}

#[test]
fn time_out_complete_status() {
    let mut data = fully_completed_case();
    data.sign_out = SignOut::default();
    let result = grade(&data);
    assert_eq!(result.checklist_status, "time-out-complete");
    assert!(result.time_out_progress.signed_off);
    assert!(!result.sign_out_progress.signed_off);
}
