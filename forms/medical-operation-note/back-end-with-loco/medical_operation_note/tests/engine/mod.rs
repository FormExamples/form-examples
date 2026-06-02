//! Integration-level smoke tests for the composite grading engine.
//!
//! These complement the in-crate `#[cfg(test)]` modules in
//! `src/engine/*.rs` by exercising the public re-exports through realistic
//! `OperationNote` fixtures.

use medical_operation_note::engine::{self, ClavienDindo, CompositeRisk, FlagPriority, OperationNote};

fn baseline() -> OperationNote {
    OperationNote {
        swab_count_agreed: true,
        needle_count_agreed: true,
        instrument_count_agreed: true,
        estimated_blood_loss_ml: Some(75),
        anaesthetic_event: "none".into(),
        ..OperationNote::default()
    }
}

#[test]
fn routine_case_produces_no_flags_no_rules() {
    let g = engine::grade(&baseline());
    assert_eq!(g.composite_risk, CompositeRisk::Routine);
    assert!(g.fired_rules.is_empty());
    assert!(g.additional_flags.is_empty());
}

#[test]
fn major_haemorrhage_drives_high_risk_and_flag() {
    let mut n = baseline();
    n.estimated_blood_loss_ml = Some(2200);
    let g = engine::grade(&n);
    assert_eq!(g.composite_risk, CompositeRisk::HighRisk);
    assert!(g.additional_flags.iter().any(|f| f.flag_id == "massive-haemorrhage"));
}

#[test]
fn never_event_drives_critical() {
    let mut n = baseline();
    n.never_event_flagged = true;
    n.never_event_kind = "wrong-side".into();
    let g = engine::grade(&n);
    assert_eq!(g.composite_risk, CompositeRisk::Critical);
    let high_flags: Vec<_> = g.additional_flags.iter()
        .filter(|f| matches!(f.priority, FlagPriority::High))
        .collect();
    assert!(!high_flags.is_empty());
}

#[test]
fn worst_band_wins_even_with_lower_co_findings() {
    let mut n = baseline();
    n.estimated_blood_loss_ml = Some(900);            // Complicated
    n.worst_clavien_dindo = Some(ClavienDindo::IIIa); // High-risk
    n.retained_foreign_body = true;                   // Critical
    let g = engine::grade(&n);
    assert_eq!(g.composite_risk, CompositeRisk::Critical);
}

#[test]
fn counts_agreed_flag_is_high_priority() {
    let mut n = baseline();
    n.instrument_count_agreed = false;
    let g = engine::grade(&n);
    assert!(!g.counts_agreed);
    assert_eq!(g.composite_risk, CompositeRisk::HighRisk);
    assert!(g.additional_flags.iter().any(|f| f.flag_id == "incorrect-count"));
}
