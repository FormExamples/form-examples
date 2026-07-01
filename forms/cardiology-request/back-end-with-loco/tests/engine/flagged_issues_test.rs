//! Port of the flag-detection cases in `grader.test.ts`.

use cardiology_request_loco_crate::engine::flagged_issues::detect_flags;
use cardiology_request_loco_crate::engine::types::CardiologyRequest;

fn create_routine_referral() -> CardiologyRequest {
    CardiologyRequest {
        referring_clinician: "Dr Sarah Owen".to_string(),
        requester_contact: "sarah.owen@nhs.net".to_string(),
        nhs_number: "485 777 3456".to_string(),
        requested_service: "rapid-access-chest-pain".to_string(),
        referral_reason: "chest-pain".to_string(),
        clinical_question: "Is this stable angina? Please risk-stratify.".to_string(),
        relevant_history: "Intermittent exertional chest tightness over 3 months.".to_string(),
        symptom_chest_pain: true,
        chest_pain_character: "atypical".to_string(),
        ecg_done: true,
        troponin_status: "normal".to_string(),
        hypertension: true,
        urgency: "routine".to_string(),
        ..CardiologyRequest::default()
    }
}

fn create_acs_referral() -> CardiologyRequest {
    CardiologyRequest {
        chest_pain_character: "typical-angina".to_string(),
        suspected_acs: true,
        troponin_status: "elevated".to_string(),
        ..create_routine_referral()
    }
}

#[test]
fn flags_missing_reason_and_missing_clinical_question() {
    let mut r = create_routine_referral();
    r.referral_reason = String::new();
    r.clinical_question = String::new();
    let flags = detect_flags(&r);
    assert!(flags.iter().any(|f| f.category == "missing-reason"));
    assert!(flags.iter().any(|f| f.category == "missing-clinical-question"));
}

#[test]
fn raises_the_exertional_syncope_flag() {
    let mut r = create_routine_referral();
    r.exertional_syncope = true;
    let flags = detect_flags(&r);
    assert!(flags.iter().any(|f| f.flag_id == "F-EXERTIONAL-SYNCOPE-001"));
}

#[test]
fn sorts_flags_high_medium_low() {
    let mut r = create_acs_referral();
    r.clinical_question = String::new();
    let flags = detect_flags(&r);
    let order = |p: &str| match p {
        "high" => 0,
        "medium" => 1,
        "low" => 2,
        _ => 3,
    };
    let priorities: Vec<i32> = flags.iter().map(|f| order(&f.priority)).collect();
    let mut sorted = priorities.clone();
    sorted.sort_unstable();
    assert_eq!(priorities, sorted);
}

#[test]
fn returns_no_flags_for_a_complete_routine_appropriate_referral() {
    let flags = detect_flags(&create_routine_referral());
    assert_eq!(flags.len(), 0);
}
