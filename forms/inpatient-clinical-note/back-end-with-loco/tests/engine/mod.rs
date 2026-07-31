//! Integration-level tests for the two grading engines.
//!
//! These exercise the public re-exports through realistic notes, and mirror the
//! worked examples in `doc/acuity-rules.md` and the boundaries in
//! `spec/index.md` §4 and §5, so the Rust engine and the two front-end engines
//! stay in agreement.

use inpatient_clinical_note::engine::{
    grade, AcuityBand, CompletenessStatus, InpatientClinicalNote, NoteType, Observations,
};

/// An all-normal observation set: NEWS2 derives to 0.
fn normal_observations() -> Observations {
    Observations {
        respiratory_rate: Some(16),
        oxygen_saturation: Some(97),
        spo2_scale: "scale-1".into(),
        oxygen_delivery: "air".into(),
        systolic_blood_pressure: Some(128),
        pulse_rate: Some(78),
        acvpu: "alert".into(),
        temperature_celsius: Some(36.8),
        news2_total: None,
        news2_trend: String::new(),
    }
}

/// A progress note with all nine base components documented.
fn complete_progress_note() -> InpatientClinicalNote {
    InpatientClinicalNote {
        note_type: Some(NoteType::Progress),
        note_at: "2026-07-31T09:00".into(),
        author_name: "Dr A. Okafor".into(),
        author_grade: "ST4".into(),
        no_interval_events: "yes".into(),
        observations: normal_observations(),
        problem_count: 1,
        no_medication_changes: "yes".into(),
        vte_status: "done".into(),
        clinical_impression: "Resolving pneumonia.".into(),
        plan: "Continue antibiotics.".into(),
        escalation_status: "for-full-escalation".into(),
        ceiling_of_care: "full-active-treatment".into(),
        senior_review_by: "Dr B. Nakamura".into(),
        ..InpatientClinicalNote::default()
    }
}

#[test]
fn all_normal_observations_derive_news2_zero_and_grade_stable() {
    let note = complete_progress_note();
    let g = grade(&note);
    assert_eq!(g.news2_derived_total, Some(0));
    assert_eq!(g.acuity_band, AcuityBand::Stable);
}

#[test]
fn a_complete_progress_note_requires_nine_components_and_grades_complete() {
    let g = grade(&complete_progress_note());
    assert_eq!(g.total_required, 9);
    assert_eq!(g.documented_required, 9);
    assert_eq!(g.status, CompletenessStatus::Complete);
    assert_eq!(g.completeness_percent, 100);
}

#[test]
fn the_same_content_as_an_admission_clerking_requires_eleven_and_grades_partial() {
    let mut note = complete_progress_note();
    note.note_type = Some(NoteType::AdmissionClerking);
    let g = grade(&note);
    assert_eq!(g.total_required, 11);
    assert_eq!(g.documented_required, 9);
    assert_eq!(g.status, CompletenessStatus::Partial);
}

#[test]
fn a_single_parameter_scoring_three_gives_watch_at_a_low_aggregate() {
    // Respiratory rate 26 scores 3; the aggregate is only 3.
    let mut note = complete_progress_note();
    note.observations.respiratory_rate = Some(26);
    let g = grade(&note);
    assert_eq!(g.news2_derived_total, Some(3));
    assert_eq!(g.acuity_band, AcuityBand::Watch);
}

#[test]
fn a_critical_care_referral_outranks_a_modest_news2() {
    let mut note = complete_progress_note();
    note.observations.news2_total = Some(6);
    note.critical_care_referral = "yes".into();
    assert_eq!(grade(&note).acuity_band, AcuityBand::Critical);
}

#[test]
fn news2_nine_or_above_is_critical() {
    let mut note = complete_progress_note();
    note.observations.news2_total = Some(9);
    assert_eq!(grade(&note).acuity_band, AcuityBand::Critical);
}

#[test]
fn an_entered_news2_total_wins_over_the_derived_one_and_both_are_reported() {
    let mut note = complete_progress_note();
    note.observations.news2_total = Some(6);
    let g = grade(&note);
    assert_eq!(g.news2_total, Some(6));
    assert_eq!(g.news2_derived_total, Some(0));
}

#[test]
fn an_empty_note_is_incomplete_at_zero_percent_and_fires_no_acuity_rule() {
    let g = grade(&InpatientClinicalNote::default());
    assert_eq!(g.status, CompletenessStatus::Incomplete);
    assert_eq!(g.completeness_percent, 0);
    assert!(g.fired_rules.iter().all(|r| r.engine != "acuity"));
    assert_eq!(g.acuity_band, AcuityBand::Stable);
}

#[test]
fn a_missing_impression_forces_incomplete_however_much_else_is_filled() {
    let mut note = complete_progress_note();
    note.clinical_impression = String::new();
    assert_eq!(grade(&note).status, CompletenessStatus::Incomplete);
}

#[test]
fn an_override_without_a_reason_is_ignored() {
    let mut note = complete_progress_note();
    note.author_override_acuity = Some(AcuityBand::Critical);
    let g = grade(&note);
    assert!(!g.acuity_overridden);
    assert_eq!(g.acuity_band, AcuityBand::Stable);
}

#[test]
fn an_override_with_a_reason_applies_and_retains_the_computed_band() {
    let mut note = complete_progress_note();
    note.author_override_acuity = Some(AcuityBand::Critical);
    note.author_override_reason = "Clinical concern despite normal observations.".into();
    let g = grade(&note);
    assert!(g.acuity_overridden);
    assert_eq!(g.acuity_band, AcuityBand::Critical);
    assert_eq!(g.computed_acuity_band, AcuityBand::Stable);
}

#[test]
fn a_vte_assessment_not_done_raises_a_high_priority_flag() {
    let mut note = complete_progress_note();
    note.vte_status = "not-done".into();
    assert!(grade(&note)
        .flags
        .iter()
        .any(|f| f.category == "vte-not-assessed"));
}

#[test]
fn an_escalate_band_without_an_escalation_action_raises_a_flag() {
    let mut note = complete_progress_note();
    note.observations.news2_total = Some(8);
    assert!(grade(&note)
        .flags
        .iter()
        .any(|f| f.category == "deteriorating-news2-no-escalation"));
}

#[test]
fn recording_an_escalation_action_clears_that_flag() {
    let mut note = complete_progress_note();
    note.observations.news2_total = Some(8);
    note.escalation_action = "Discussed with the medical registrar at 14:20.".into();
    assert!(!grade(&note)
        .flags
        .iter()
        .any(|f| f.category == "deteriorating-news2-no-escalation"));
}

#[test]
fn a_long_stay_without_an_estimated_discharge_date_raises_a_low_priority_flag() {
    let mut note = complete_progress_note();
    note.admission_at = "2026-07-01T09:00".into();
    note.note_at = "2026-07-31T09:00".into();
    assert!(grade(&note)
        .flags
        .iter()
        .any(|f| f.category == "long-stay-no-discharge-plan"));
}

#[test]
fn an_explicit_negative_counts_as_documented() {
    let note = InpatientClinicalNote {
        no_interval_events: "yes".into(),
        ..InpatientClinicalNote::default()
    };
    let g = grade(&note);
    assert!(g
        .component_statuses
        .iter()
        .any(|c| c.label == "Interval history" && c.present));
}

/// The `as_str()` spellings are what the database columns and both front-end
/// engines use. They must stay identical to the `serde` representation, which
/// is what the JSON API emits — a divergence between the two is invisible until
/// a persisted grade violates a CHECK constraint.
#[test]
fn as_str_matches_the_serde_representation() {
    use inpatient_clinical_note::engine::{ComponentKey, FlagPriority};

    // `serde_json` renders a unit enum variant as a bare JSON string, so the
    // trimmed output is exactly the wire spelling.
    macro_rules! assert_wire {
        ($value:expr) => {{
            let json = serde_json::to_string(&$value).unwrap();
            assert_eq!(
                json.trim_matches('"'),
                $value.as_str(),
                "as_str() and serde disagree for {:?}",
                $value
            );
        }};
    }

    for note_type in [
        NoteType::AdmissionClerking,
        NoteType::Progress,
        NoteType::Consult,
        NoteType::Event,
        NoteType::Procedure,
        NoteType::Handover,
        NoteType::Transfer,
        NoteType::DischargePlanning,
    ] {
        assert_wire!(note_type);
        assert_eq!(NoteType::from_wire(note_type.as_str()), Some(note_type));
    }

    for band in [
        AcuityBand::Stable,
        AcuityBand::Watch,
        AcuityBand::Escalate,
        AcuityBand::Critical,
    ] {
        assert_wire!(band);
        assert_eq!(AcuityBand::from_wire(band.as_str()), Some(band));
    }

    for status in [
        CompletenessStatus::Complete,
        CompletenessStatus::Partial,
        CompletenessStatus::Incomplete,
    ] {
        assert_wire!(status);
    }

    for component in [
        ComponentKey::Header,
        ComponentKey::IntervalHistory,
        ComponentKey::Observations,
        ComponentKey::Examination,
        ComponentKey::Investigations,
        ComponentKey::Problems,
        ComponentKey::Medications,
        ComponentKey::RiskAssessments,
        ComponentKey::Impression,
        ComponentKey::Plan,
        ComponentKey::Escalation,
        ComponentKey::Communication,
    ] {
        assert_wire!(component);
    }

    for priority in [FlagPriority::High, FlagPriority::Medium, FlagPriority::Low] {
        assert_wire!(priority);
    }
}

/// Fired rules carry the kebab-case component vocabulary the
/// `inpatient_clinical_note_grade_rule` CHECK constraint accepts, not the Rust
/// `Debug` spelling.
#[test]
fn fired_rule_components_use_the_schema_vocabulary() {
    const ALLOWED: &[&str] = &[
        "header",
        "interval-history",
        "observations",
        "examination",
        "investigations",
        "problems",
        "medications",
        "risk-assessments",
        "impression",
        "plan",
        "escalation",
        "communication",
        "completeness",
        "acuity",
        "",
    ];

    let g = grade(&complete_progress_note());
    assert!(!g.fired_rules.is_empty());
    for rule in &g.fired_rules {
        assert!(
            ALLOWED.contains(&rule.component.as_str()),
            "component {:?} is not in the schema vocabulary",
            rule.component
        );
    }
}
