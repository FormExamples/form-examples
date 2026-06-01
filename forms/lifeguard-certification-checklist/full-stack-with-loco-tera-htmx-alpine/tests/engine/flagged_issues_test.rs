use lifeguard_certification_checklist_tera_crate::engine::flagged_issues::detect_additional_flags;
use lifeguard_certification_checklist_tera_crate::engine::lifeguard_grader::grade;
use lifeguard_certification_checklist_tera_crate::engine::types::*;

fn baseline_passing_candidate() -> AssessmentData {
    AssessmentData {
        physical_fitness_swim: PhysicalFitnessSwim {
            swim50m_time_seconds: Some(50.0),
            swim50m_within_time: "yes".to_string(),
            surface_dive_depth_metres: Some(2.0),
            sustained_surface_dive: "yes".to_string(),
            swim200m_time_seconds: Some(300.0),
            swim200m_mixed_strokes: "yes".to_string(),
            tread_water_two_minutes: "yes".to_string(),
            tow_casualty50m: "yes".to_string(),
        },
        supervision_scanning_zoning: SupervisionScanningZoning {
            understands_zone_of_responsibility: "yes".to_string(),
            effective_scanning_pattern: "yes".to_string(),
            ten_twenty_scan_rule: "yes".to_string(),
            recognises_distressed_swimmer: "yes".to_string(),
            appropriate_rotation: "yes".to_string(),
            uses_whistle_and_signals: "yes".to_string(),
        },
        rescue_conscious: RescueConscious {
            recognition_and_alert: "yes".to_string(),
            entry_without_loss_of_sight: "yes".to_string(),
            approach_with_floating_aid: "yes".to_string(),
            reassures_casualty: "yes".to_string(),
            tow_to_safety: "yes".to_string(),
            extrication_from_water: "yes".to_string(),
        },
        rescue_unconscious: RescueUnconscious {
            recognition_and_alert: "yes".to_string(),
            safe_entry_and_approach: "yes".to_string(),
            airway_management_in_water: "yes".to_string(),
            effective_tow_to_safety: "yes".to_string(),
            safe_extrication: "yes".to_string(),
            handover_handsignal: "yes".to_string(),
        },
        spinal_injury_management: SpinalInjuryManagement {
            recognises_mechanism: "yes".to_string(),
            head_splint_hold: "yes".to_string(),
            maintains_inline_stabilisation: "yes".to_string(),
            careful_roll_if_needed: "yes".to_string(),
            use_of_spineboard: "yes".to_string(),
            secure_casualty_to_board: "yes".to_string(),
        },
        cpr_aed: CprAed {
            compression_rate: Some(110.0),
            compression_depth: Some(5.5),
            effective_compressions: "yes".to_string(),
            effective_ventilations: "yes".to_string(),
            time_to_first_shock_seconds: Some(45.0),
            aed_delivered_promptly: "yes".to_string(),
            safe_shock_no_unsafe_contact: "yes".to_string(),
            continuous_quality_cpr: "yes".to_string(),
        },
        first_aid_oxygen: FirstAidOxygen {
            bleeding_control: "yes".to_string(),
            burns_management: "yes".to_string(),
            fracture_immobilisation: "yes".to_string(),
            recovery_position_use: "yes".to_string(),
            oxygen_therapy_administration: "yes".to_string(),
            uses_pocket_mask_or_bvm: "yes".to_string(),
        },
        legal_regulatory_incident: LegalRegulatoryIncident {
            duty_of_care_understood: "yes".to_string(),
            pswp_knowledge: "yes".to_string(),
            eap_invocation: "yes".to_string(),
            incident_report_completed: "yes".to_string(),
            riddor_awareness: "yes".to_string(),
            safeguarding_children_adults: "yes".to_string(),
        },
        ..AssessmentData::default()
    }
}

#[test]
fn baseline_has_no_flags() {
    let data = baseline_passing_candidate();
    let flags = detect_additional_flags(&data, &[], &[]);
    assert!(flags.is_empty(), "baseline should not produce flags: {flags:?}");
}

#[test]
fn expired_prior_certification_flagged() {
    let mut data = baseline_passing_candidate();
    data.candidate_details.prior_certification_expiry = "2020-01-01".to_string();
    let flags = detect_additional_flags(&data, &[], &[]);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-CERT-EXPIRED" && f.priority == "high")
    );
}

#[test]
fn slow_50m_swim_emits_high_flag_via_grader() {
    let mut data = baseline_passing_candidate();
    data.physical_fitness_swim.swim50m_time_seconds = Some(75.0);
    data.physical_fitness_swim.swim50m_within_time = String::new();
    let result = grade(&data);
    assert!(
        result
            .additional_flags
            .iter()
            .any(|f| f.id == "FLAG-SWIM-50M-SLOW" && f.priority == "high")
    );
}

#[test]
fn shallow_surface_dive_emits_medium_flag() {
    let mut data = baseline_passing_candidate();
    data.physical_fitness_swim.surface_dive_depth_metres = Some(1.0);
    let flags = detect_additional_flags(&data, &[], &[]);
    let f = flags
        .iter()
        .find(|f| f.id == "FLAG-DIVE-SHALLOW")
        .expect("dive shallow flag");
    assert_eq!(f.priority, "medium");
}

#[test]
fn slow_aed_shock_emits_medium_flag() {
    let mut data = baseline_passing_candidate();
    data.cpr_aed.time_to_first_shock_seconds = Some(120.0);
    let flags = detect_additional_flags(&data, &[], &[]);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-AED-SLOW" && f.priority == "medium")
    );
}

#[test]
fn compression_rate_out_of_range_emits_medium_flag() {
    let mut data = baseline_passing_candidate();
    data.cpr_aed.compression_rate = Some(85.0);
    let flags = detect_additional_flags(&data, &[], &[]);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-CPR-RATE-RANGE" && f.priority == "medium")
    );
}

#[test]
fn examiner_notes_emits_low_flag() {
    let mut data = baseline_passing_candidate();
    data.overall_result_signoff.examiner_notes = "Strong scanning, push faster on compressions.".to_string();
    let flags = detect_additional_flags(&data, &[], &[]);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-DEBRIEF-EXAMINER" && f.priority == "low")
    );
}

#[test]
fn flags_sorted_by_priority() {
    let mut data = baseline_passing_candidate();
    data.candidate_details.prior_certification_expiry = "2020-01-01".to_string();
    data.physical_fitness_swim.surface_dive_depth_metres = Some(1.0);
    data.overall_result_signoff.examiner_notes = "Notes.".to_string();
    let flags = detect_additional_flags(&data, &[], &[]);
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
