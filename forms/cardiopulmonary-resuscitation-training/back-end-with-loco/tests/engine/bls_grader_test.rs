use cardiopulmonary_resuscitation_training_loco_crate::engine::bls_grader::{grade, run_rules};
use cardiopulmonary_resuscitation_training_loco_crate::engine::bls_rules::all_rules;
use cardiopulmonary_resuscitation_training_loco_crate::engine::types::*;

/// Build a fully-completed assessment with every rule answered "yes".
fn fully_passing_case() -> AssessmentData {
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
fn empty_case_is_fail() {
    let data = AssessmentData::default();
    let result = grade(&data);
    assert_eq!(result.outcome, "fail");
    assert_eq!(result.answered_count, 0);
}

#[test]
fn fully_passing_case_is_pass() {
    let data = fully_passing_case();
    let result = grade(&data);
    assert_eq!(result.outcome, "pass");
    assert_eq!(result.critical_failures.len(), 0);
    assert_eq!(result.non_critical_deficiencies.len(), 0);
}

#[test]
fn critical_action_failure_forces_fail() {
    let mut data = fully_passing_case();
    data.airway_rescue_breaths.visible_chest_rise = "no".to_string();
    let result = grade(&data);
    assert_eq!(result.outcome, "fail");
    assert!(result.critical_failures.iter().any(|r| r.id == "BLS-AB-CHEST-RISE"));
}

#[test]
fn three_non_critical_deficiencies_force_fail() {
    let mut data = fully_passing_case();
    data.scene_safety.ppe_applied = "no".to_string();
    data.scene_safety.hazards_identified = "no".to_string();
    data.responsiveness_breathing.tapped_and_shouted = "no".to_string();
    let result = grade(&data);
    assert_eq!(result.outcome, "fail");
    assert_eq!(result.non_critical_deficiencies.len(), 3);
    assert_eq!(result.critical_failures.len(), 0);
}

#[test]
fn two_non_critical_deficiencies_still_pass() {
    let mut data = fully_passing_case();
    data.scene_safety.ppe_applied = "no".to_string();
    data.scene_safety.hazards_identified = "no".to_string();
    let result = grade(&data);
    assert_eq!(result.outcome, "pass");
    assert_eq!(result.non_critical_deficiencies.len(), 2);
}

#[test]
fn compression_rate_below_range_fires_critical_rule() {
    let mut data = fully_passing_case();
    // Clear explicit tri-state so the engine derives from the numeric.
    data.chest_compressions.compressions_at_correct_rate = String::new();
    data.chest_compressions.compression_rate = Some(80.0);
    let fired = run_rules(&data);
    let rate_rule = fired.iter().find(|r| r.id == "BLS-CC-RATE").unwrap();
    assert_eq!(rate_rule.status, "no");
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
