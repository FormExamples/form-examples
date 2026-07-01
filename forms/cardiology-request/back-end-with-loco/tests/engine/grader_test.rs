//! Port of `front-end-with-svelte/src/lib/engine/grader.test.ts`.
//!
//! These assert engine parity with the SvelteKit/TypeScript source of truth:
//! identical bands, rule IDs, thresholds, and the auto-escalation invariant.

use cardiology_request_loco_crate::engine::calculate_grade;
use cardiology_request_loco_crate::engine::types::CardiologyRequest;

/// A fully-completed, routine appropriate referral fixture.
fn create_routine_referral() -> CardiologyRequest {
    CardiologyRequest {
        referring_clinician: "Dr Sarah Owen".to_string(),
        referrer_role: "GP".to_string(),
        registration_body: "GMC".to_string(),
        registration_number: "7012345".to_string(),
        supervising_consultant: String::new(),
        requester_contact: "sarah.owen@nhs.net".to_string(),
        referral_date: "2026-06-10".to_string(),
        nhs_number: "485 777 3456".to_string(),
        patient_name: "Margaret Hughes".to_string(),
        date_of_birth: "1958-03-14".to_string(),
        status: "submitted".to_string(),
        site_name: "Headington Medical Practice".to_string(),
        setting: "community".to_string(),
        requested_by_date: String::new(),
        requested_service: "rapid-access-chest-pain".to_string(),
        referral_reason: "chest-pain".to_string(),
        clinical_question: "Is this stable angina? Please risk-stratify.".to_string(),
        relevant_history: "Intermittent exertional chest tightness over 3 months.".to_string(),
        symptom_chest_pain: true,
        chest_pain_character: "atypical".to_string(),
        symptom_breathlessness: false,
        nyha_class: String::new(),
        symptom_palpitations: false,
        symptom_syncope: false,
        symptom_oedema: false,
        suspected_acs: false,
        exertional_syncope: false,
        new_onset_heart_failure: false,
        ecg_done: true,
        ecg_findings: "Sinus rhythm, no acute ST changes.".to_string(),
        troponin_status: "normal".to_string(),
        bnp_status: String::new(),
        known_coronary_artery_disease: false,
        previous_mi: false,
        heart_failure: false,
        valve_disease: false,
        arrhythmia: false,
        hypertension: true,
        diabetes: false,
        current_medications: "Amlodipine 5 mg OD.".to_string(),
        urgency: "routine".to_string(),
        notes: String::new(),
    }
}

/// An urgent referral: new-onset heart failure with elevated BNP, NYHA III.
fn create_heart_failure_referral() -> CardiologyRequest {
    CardiologyRequest {
        patient_name: "Derek Mensah".to_string(),
        requested_service: "heart-failure".to_string(),
        referral_reason: "heart-failure-symptoms".to_string(),
        clinical_question: "New breathlessness with raised BNP — assess for heart failure."
            .to_string(),
        symptom_chest_pain: false,
        chest_pain_character: String::new(),
        symptom_breathlessness: true,
        nyha_class: "iii".to_string(),
        symptom_oedema: true,
        new_onset_heart_failure: true,
        troponin_status: "normal".to_string(),
        bnp_status: "elevated".to_string(),
        urgency: "urgent".to_string(),
        ..create_routine_referral()
    }
}

/// An emergency referral: suspected ACS with elevated troponin.
fn create_acs_referral() -> CardiologyRequest {
    CardiologyRequest {
        patient_name: "Anthony Brooks".to_string(),
        requested_service: "general-cardiology".to_string(),
        referral_reason: "chest-pain".to_string(),
        clinical_question: "Central crushing chest pain with rising troponin — review urgently."
            .to_string(),
        symptom_chest_pain: true,
        chest_pain_character: "typical-angina".to_string(),
        suspected_acs: true,
        troponin_status: "elevated".to_string(),
        known_coronary_artery_disease: true,
        previous_mi: true,
        urgency: "emergency".to_string(),
        ..create_routine_referral()
    }
}

#[test]
fn grades_a_complete_appropriate_routine_referral_as_accept_routine() {
    let g = calculate_grade(&create_routine_referral());
    assert_eq!(g.appropriateness_band, "usually-appropriate");
    assert_eq!(g.safety_band, "ok");
    assert_eq!(g.completeness_percent, 100);
    assert_eq!(g.triage_tier, "routine");
    assert_eq!(g.recommendation, "accept");
    assert_eq!(g.flags.len(), 0);
    assert!(g.fired_rules.iter().any(|r| r.rule_id == "R-APPROP-MATCH-01"));
    assert!(g.fired_rules.iter().any(|r| r.rule_id == "R-TRIAGE-ROUTINE-01"));
}

#[test]
fn auto_escalates_suspected_acs_to_red_flag_emergency() {
    let g = calculate_grade(&create_acs_referral());
    assert_eq!(g.safety_band, "red-flag");
    assert_eq!(g.triage_tier, "emergency");
    assert_eq!(g.target_timeframe, "immediate (emergency pathway)");
    // Emergency referrals are accepted onto the acute pathway.
    assert_eq!(g.recommendation, "accept");
    assert!(g.fired_rules.iter().any(|r| r.rule_id == "R-TRIAGE-EMERGENCY-01"));
    assert!(g.fired_rules.iter().any(|r| r.rule_id == "R-SAFETY-ACS-01"));
    assert!(g.flags.iter().any(|f| f.category == "suspected-acs"));
}

#[test]
fn escalates_new_onset_heart_failure_to_red_flag_urgent() {
    let g = calculate_grade(&create_heart_failure_referral());
    assert_eq!(g.safety_band, "red-flag");
    assert_eq!(g.triage_tier, "urgent");
    assert!(g.fired_rules.iter().any(|r| r.rule_id == "R-SAFETY-NEW-HF-01"));
    assert!(g.fired_rules.iter().any(|r| r.rule_id == "R-TRIAGE-URGENT-01"));
    assert!(g.flags.iter().any(|f| f.category == "new-onset-heart-failure"));
}

#[test]
fn treats_typical_angina_chest_pain_as_red_flag_urgent() {
    let mut r = create_routine_referral();
    r.chest_pain_character = "typical-angina".to_string();
    let g = calculate_grade(&r);
    assert_eq!(g.safety_band, "red-flag");
    assert_eq!(g.triage_tier, "urgent");
    assert!(g.fired_rules.iter().any(|r| r.rule_id == "R-SAFETY-TYPICAL-ANGINA-01"));
}

#[test]
fn marks_uncomplicated_hypertension_as_usually_not_appropriate_reject() {
    let mut r = create_routine_referral();
    r.requested_service = "general-cardiology".to_string();
    r.referral_reason = "hypertension".to_string();
    r.symptom_chest_pain = false;
    r.chest_pain_character = String::new();
    r.symptom_breathlessness = false;
    let g = calculate_grade(&r);
    assert_eq!(g.appropriateness_band, "usually-not-appropriate");
    assert_eq!(g.safety_band, "ok");
    assert_eq!(g.recommendation, "reject");
    assert!(g.fired_rules.iter().any(|r| r.rule_id == "R-APPROP-LOW-YIELD-01"));
}

#[test]
fn flags_a_service_mismatch_as_may_be_appropriate() {
    let mut r = create_routine_referral();
    r.requested_service = "valve-clinic".to_string();
    r.referral_reason = "chest-pain".to_string();
    let g = calculate_grade(&r);
    assert_eq!(g.appropriateness_band, "may-be-appropriate");
    assert!(g.fired_rules.iter().any(|r| r.rule_id == "R-APPROP-SERVICE-MISMATCH-01"));
}

#[test]
fn computes_weighted_partial_completeness() {
    let mut r = create_routine_referral();
    r.referral_reason = String::new();
    r.clinical_question = String::new();
    let g = calculate_grade(&r);
    // referral reason (3) + clinical question (3) of 14 total weight missing → 8/14 ≈ 57%.
    assert_eq!(g.completeness_percent, 57);
    assert!(g.fired_rules.iter().any(|r| r.rule_id == "R-COMP-REASON-01"));
    assert!(g.fired_rules.iter().any(|r| r.rule_id == "R-COMP-QUESTION-01"));
}

#[test]
fn produces_stable_unique_rule_ids() {
    let g = calculate_grade(&create_acs_referral());
    let mut ids: Vec<&str> = g.fired_rules.iter().map(|r| r.rule_id.as_str()).collect();
    let len = ids.len();
    ids.sort_unstable();
    ids.dedup();
    assert_eq!(ids.len(), len);
}
