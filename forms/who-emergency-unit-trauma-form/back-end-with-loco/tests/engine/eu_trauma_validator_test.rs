use who_emergency_unit_trauma_form_loco_crate::engine::eu_trauma_validator::validate_eu_trauma;
use who_emergency_unit_trauma_form_loco_crate::engine::flagged_issues::detect_flagged_issues;
use who_emergency_unit_trauma_form_loco_crate::engine::types::*;

fn empty() -> AssessmentData {
    AssessmentData::default()
}

#[test]
fn empty_form_is_incomplete_and_skips_conditional_rules() {
    let data = empty();
    let r = validate_eu_trauma(&data);
    assert!(!r.complete);
    // Empty form has 0 satisfied; total_required equals number of
    // unconditional rules (every rule with `applies = |_| true`).
    assert!(r.total_required > 0);
    assert_eq!(r.total_satisfied, 0);
    // Conditional rules must not fire on an empty form (no triage,
    // no DOA, no admit/transfer/died, etc.).
    assert!(!r.missing.iter().any(|m| m.id == "A-02"));     // RED spine stabilization
    assert!(!r.missing.iter().any(|m| m.id == "D-02"));     // RED GCS
    assert!(!r.missing.iter().any(|m| m.id == "CV-08"));    // DOA time of death
    assert!(!r.missing.iter().any(|m| m.id == "DISP-05"));  // admit ward
    assert!(!r.missing.iter().any(|m| m.id == "DISP-06"));  // transfer to
    assert!(!r.missing.iter().any(|m| m.id == "DISP-07"));  // died cause
    // Vital signs rules should be required when not DOA.
    assert!(r.missing.iter().any(|m| m.id == "CV-04"));
    // PR-01 (surname) must be in the missing list.
    assert!(r.missing.iter().any(|m| m.id == "PR-01"));
}

#[test]
fn red_triage_ratchet_requires_spine_stabilization_and_gcs() {
    let mut data = empty();
    data.triage.category = "red".into();
    let r = validate_eu_trauma(&data);
    assert!(r.missing.iter().any(|m| m.id == "A-02"));
    assert!(r.missing.iter().any(|m| m.id == "D-02"));

    data.airway.spine_stabilized = "in-eu".into();
    let r2 = validate_eu_trauma(&data);
    assert!(!r2.missing.iter().any(|m| m.id == "A-02"));
    assert!(r2.missing.iter().any(|m| m.id == "D-02"));

    data.disability.gcs_qualified = true;
    let r3 = validate_eu_trauma(&data);
    assert!(!r3.missing.iter().any(|m| m.id == "D-02"));

    data.triage.category = "yellow".into();
    data.airway.spine_stabilized = "".into();
    data.disability.gcs_qualified = false;
    let r4 = validate_eu_trauma(&data);
    assert!(!r4.missing.iter().any(|m| m.id == "A-02"));
    assert!(!r4.missing.iter().any(|m| m.id == "D-02"));

    // RED triage + AVPU=U raises the urgent neuro flag.
    data.triage.category = "red".into();
    data.disability.avpu = "U".into();
    let flags = detect_flagged_issues(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-AVPU-U" && f.priority == FlagPriority::Urgent)
    );
}

#[test]
fn dead_on_arrival_waives_vitals_but_requires_time_of_death() {
    let mut data = empty();
    data.chief_complaint_and_vitals.dead_on_arrival = true;
    let r = validate_eu_trauma(&data);
    assert!(!r.missing.iter().any(|m| m.id == "CV-04"));
    assert!(!r.missing.iter().any(|m| m.id == "CV-05"));
    assert!(!r.missing.iter().any(|m| m.id == "CV-06"));
    assert!(!r.missing.iter().any(|m| m.id == "CV-07"));
    assert!(r.missing.iter().any(|m| m.id == "CV-08"));

    data.chief_complaint_and_vitals.time_of_death = "14:32".into();
    let r2 = validate_eu_trauma(&data);
    assert!(!r2.missing.iter().any(|m| m.id == "CV-08"));

    let flags = detect_flagged_issues(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-DOA" && f.priority == FlagPriority::Urgent)
    );
}

#[test]
fn died_disposition_requires_died_cause_and_flags_mortality() {
    let mut data = empty();
    data.disposition.disposition = "died".into();
    let r = validate_eu_trauma(&data);
    assert!(r.missing.iter().any(|m| m.id == "DISP-07"));

    data.disposition.died_cause = "Massive haemorrhage".into();
    let r2 = validate_eu_trauma(&data);
    assert!(!r2.missing.iter().any(|m| m.id == "DISP-07"));

    let flags = detect_flagged_issues(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-DISPO-DIED" && f.priority == FlagPriority::Urgent)
    );
}

#[test]
fn rule_ids_are_unique() {
    use who_emergency_unit_trauma_form_loco_crate::engine::eu_trauma_rules::eu_trauma_rules;
    let rules = eu_trauma_rules();
    let mut ids: Vec<&str> = rules.iter().map(|r| r.id).collect();
    ids.sort();
    let len_before = ids.len();
    ids.dedup();
    assert_eq!(ids.len(), len_before, "rule IDs must be unique");
}
