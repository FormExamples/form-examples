use who_acute_referral_form_loco_crate::engine::referral_rules::referral_rules;
use who_acute_referral_form_loco_crate::engine::referral_validator::validate_referral;
use who_acute_referral_form_loco_crate::engine::types::*;

fn empty() -> AssessmentData {
    AssessmentData::default()
}

#[test]
fn empty_form_is_incomplete_and_skips_receipt_side_rules() {
    let data = empty();
    let r = validate_referral(&data);
    assert!(!r.complete);
    assert!(r.total_required > 0);
    assert_eq!(r.total_satisfied, 0);
    assert_eq!(r.missing.len() as u32, r.total_required);
    // PID-01 must be in the missing list.
    assert!(r.missing.iter().any(|m| m.id == "PID-01"));
    // Receipt-side rules must NOT apply on an empty form.
    assert!(!r.missing.iter().any(|m| m.id == "RFR-01"));
    assert!(!r.missing.iter().any(|m| m.id == "RFR-02"));
    assert!(!r.missing.iter().any(|m| m.id == "RFR-03"));
    // REC-02 (Other-precaution details) must NOT apply when not ticked.
    assert!(!r.missing.iter().any(|m| m.id == "REC-02"));
}

#[test]
fn receipt_side_gate_fires_when_arrival_recorded() {
    let mut data = empty();
    data.referral_facility_receipt.patient_arrival_date_time = "2026-04-30T10:00".into();
    let r = validate_referral(&data);
    assert!(r.missing.iter().any(|m| m.id == "RFR-01"));
    assert!(r.missing.iter().any(|m| m.id == "RFR-02"));
    // RFR-03 (arrival time) is satisfied because arrival is filled.
    assert!(!r.missing.iter().any(|m| m.id == "RFR-03"));
}

#[test]
fn rule_ids_are_unique() {
    let rules = referral_rules();
    let mut ids: Vec<&str> = rules.iter().map(|r| r.id).collect();
    ids.sort();
    let len_before = ids.len();
    ids.dedup();
    assert_eq!(ids.len(), len_before, "rule IDs must be unique");
}

#[test]
fn other_precaution_details_required_when_other_ticked() {
    let mut data = empty();
    data.recommendations.precautions.other = true;
    let r = validate_referral(&data);
    assert!(r.missing.iter().any(|m| m.id == "REC-02"));
    // Now provide details and confirm REC-02 is satisfied.
    data.recommendations.precautions.other_details = "Restraint required.".into();
    let r2 = validate_referral(&data);
    assert!(!r2.missing.iter().any(|m| m.id == "REC-02"));
}

#[test]
fn abcde_satisfied_when_normal_and_none_ticked() {
    let mut data = empty();
    data.background.airway.finding_normal = true;
    data.background.airway.intervention_none = true;
    let r = validate_referral(&data);
    assert!(!r.missing.iter().any(|m| m.id == "BG-A"));
}
