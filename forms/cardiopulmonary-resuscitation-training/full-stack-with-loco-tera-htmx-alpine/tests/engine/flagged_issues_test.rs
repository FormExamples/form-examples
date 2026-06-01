use cardiopulmonary_resuscitation_training_tera_crate::engine::bls_grader::grade;
use cardiopulmonary_resuscitation_training_tera_crate::engine::types::*;

fn passing_case() -> AssessmentData {
    AssessmentData {
        trainee_details: TraineeDetails {
            first_name: "Sam".to_string(),
            last_name: "Carter".to_string(),
            trainee_id: "BLS-001".to_string(),
            role: "nurse".to_string(),
            prior_certification_expiry: "2099-12-31".to_string(),
            session_date: "2026-06-01".to_string(),
            examiner_name: "Dr Lee".to_string(),
        },
        scene_safety: SceneSafety {
            scene_safe: "yes".to_string(),
            ppe_applied: "yes".to_string(),
            hazards_identified: "yes".to_string(),
            bystanders_controlled: "yes".to_string(),
        },
        responsiveness_breathing: ResponsivenessBreathing {
            tapped_and_shouted: "yes".to_string(),
            checked_breathing: "yes".to_string(),
            checked_pulse_simultaneously: "yes".to_string(),
            time_within_ten_seconds: "yes".to_string(),
        },
        activate_emergency_response: ActivateEmergencyResponse {
            called_emergency_number: "yes".to_string(),
            stated_location_and_condition: "yes".to_string(),
            designated_aed_retriever: "yes".to_string(),
            used_speakerphone: "yes".to_string(),
        },
        chest_compressions: ChestCompressions {
            compression_rate: Some(110.0),
            compression_depth: Some(5.5),
            correct_hand_position: "yes".to_string(),
            full_chest_recoil: "yes".to_string(),
            minimised_interruptions: "yes".to_string(),
            compressions_at_correct_rate: "yes".to_string(),
            compressions_at_correct_depth: "yes".to_string(),
        },
        airway_rescue_breaths: AirwayRescueBreaths {
            head_tilt_chin_lift: "yes".to_string(),
            effective_seal: "yes".to_string(),
            visible_chest_rise: "yes".to_string(),
            one_second_per_breath: "yes".to_string(),
            ratio30to2: "yes".to_string(),
            avoided_excessive_ventilation: "yes".to_string(),
        },
        aed_shock_delivery: AedShockDelivery {
            powered_on_promptly: "yes".to_string(),
            correct_pad_placement: "yes".to_string(),
            cleared_during_analysis: "yes".to_string(),
            delivered_shock_safely: "yes".to_string(),
            resumed_compressions_immediately: "yes".to_string(),
            time_to_first_shock_seconds: Some(45.0),
        },
        team_dynamics_handoff: TeamDynamicsHandoff {
            clear_communication: "yes".to_string(),
            closed_loop_orders: "yes".to_string(),
            appropriate_handoff: "yes".to_string(),
            debrief_participated: "yes".to_string(),
            examiner_notes: String::new(),
            trainee_feedback: String::new(),
        },
    }
}

#[test]
fn passing_case_has_no_flags() {
    let flags = grade(&passing_case()).additional_flags;
    assert!(flags.is_empty(), "passing case should not produce flags: {flags:?}");
}

#[test]
fn critical_failure_emits_high_priority_flag() {
    let mut data = passing_case();
    data.aed_shock_delivery.delivered_shock_safely = "no".to_string();
    let flags = grade(&data).additional_flags;
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-CRIT-BLS-AED-SAFE-SHOCK" && f.priority == "high")
    );
}

#[test]
fn expired_certification_emits_high_priority_flag() {
    let mut data = passing_case();
    data.trainee_details.prior_certification_expiry = "2000-01-01".to_string();
    let flags = grade(&data).additional_flags;
    assert!(flags.iter().any(|f| f.id == "FLAG-CERT-EXPIRED" && f.priority == "high"));
}

#[test]
fn out_of_range_rate_emits_medium_flag() {
    let mut data = passing_case();
    data.chest_compressions.compression_rate = Some(80.0);
    // Keep explicit "yes" so it does not also fire the critical-action rule.
    let flags = grade(&data).additional_flags;
    assert!(flags.iter().any(|f| f.id == "FLAG-CC-RATE-RANGE" && f.priority == "medium"));
}

#[test]
fn slow_aed_shock_emits_medium_flag() {
    let mut data = passing_case();
    data.aed_shock_delivery.time_to_first_shock_seconds = Some(120.0);
    let flags = grade(&data).additional_flags;
    assert!(flags.iter().any(|f| f.id == "FLAG-AED-SLOW" && f.priority == "medium"));
}

#[test]
fn examiner_notes_emit_low_flag() {
    let mut data = passing_case();
    data.team_dynamics_handoff.examiner_notes = "Coach to push harder.".to_string();
    let flags = grade(&data).additional_flags;
    assert!(flags.iter().any(|f| f.id == "FLAG-DEBRIEF-EXAMINER" && f.priority == "low"));
}

#[test]
fn flags_are_sorted_by_priority() {
    let mut data = passing_case();
    data.trainee_details.prior_certification_expiry = "2000-01-01".to_string(); // high
    data.aed_shock_delivery.time_to_first_shock_seconds = Some(120.0); // medium
    data.team_dynamics_handoff.examiner_notes = "Note".to_string(); // low
    let flags = grade(&data).additional_flags;
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
