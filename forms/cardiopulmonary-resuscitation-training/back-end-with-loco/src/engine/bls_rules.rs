//! Bls rules module.

use super::types::{AssessmentData, TriState};
use super::utils::{compression_depth_in_range, compression_rate_in_range};

/// A declarative BLS Skills Verification rule. Each rule evaluates to a
/// `TriState`: `'yes'` (passes), `'no'` (deficiency), `'na'` (not assessed),
/// or `''` (examiner has not yet recorded an answer).
pub struct BlsRule {
    /// ID.
    pub id: &'static str,
    /// Step.
    pub step: u32,
    /// Category.
    pub category: &'static str,
    /// Label.
    pub label: &'static str,
    /// Critical.
    pub critical: bool,
    /// Evaluate.
    pub evaluate: fn(&AssessmentData) -> TriState,
}

fn normalize(v: &str) -> String {
    match v {
        "yes" | "no" | "na" => v.to_string(),
        _ => String::new(),
    }
}

/// All BLS Skills Verification rules, mirroring the JS canonical engine.
pub fn all_rules() -> Vec<BlsRule> {
    vec![
        // ─── Step 2: Scene Safety & Initial Assessment ───────────────────
        BlsRule {
            id: "BLS-SS-SAFE",
            step: 2,
            category: "Scene Safety",
            label: "Confirms the scene is safe before approaching the casualty.",
            critical: false,
            evaluate: |d| normalize(&d.scene_safety.scene_safe),
        },
        BlsRule {
            id: "BLS-SS-PPE",
            step: 2,
            category: "Scene Safety",
            label: "Applies appropriate personal protective equipment (PPE).",
            critical: false,
            evaluate: |d| normalize(&d.scene_safety.ppe_applied),
        },
        BlsRule {
            id: "BLS-SS-HAZARDS",
            step: 2,
            category: "Scene Safety",
            label: "Identifies and mitigates environmental hazards.",
            critical: false,
            evaluate: |d| normalize(&d.scene_safety.hazards_identified),
        },
        BlsRule {
            id: "BLS-SS-BYSTANDERS",
            step: 2,
            category: "Scene Safety",
            label: "Manages bystanders so they do not impede care.",
            critical: false,
            evaluate: |d| normalize(&d.scene_safety.bystanders_controlled),
        },
        // ─── Step 3: Responsiveness & Breathing Check ────────────────────
        BlsRule {
            id: "BLS-RB-TAP",
            step: 3,
            category: "Responsiveness",
            label: "Taps shoulders and shouts \"Are you OK?\" to assess responsiveness.",
            critical: false,
            evaluate: |d| normalize(&d.responsiveness_breathing.tapped_and_shouted),
        },
        BlsRule {
            id: "BLS-RB-BREATH",
            step: 3,
            category: "Breathing Check",
            label: "Checks for absent or abnormal breathing (look at chest).",
            critical: false,
            evaluate: |d| normalize(&d.responsiveness_breathing.checked_breathing),
        },
        BlsRule {
            id: "BLS-RB-PULSE",
            step: 3,
            category: "Breathing Check",
            label: "Checks carotid pulse simultaneously with breathing check.",
            critical: false,
            evaluate: |d| normalize(&d.responsiveness_breathing.checked_pulse_simultaneously),
        },
        BlsRule {
            id: "BLS-RB-TIME",
            step: 3,
            category: "Breathing Check",
            label: "Completes pulse and breathing check in 10 seconds or less.",
            critical: false,
            evaluate: |d| normalize(&d.responsiveness_breathing.time_within_ten_seconds),
        },
        // ─── Step 4: Activate Emergency Response ─────────────────────────
        BlsRule {
            id: "BLS-ER-CALL",
            step: 4,
            category: "Emergency Response",
            label: "Activates emergency response (calls 999 / 2222 in hospital).",
            critical: false,
            evaluate: |d| normalize(&d.activate_emergency_response.called_emergency_number),
        },
        BlsRule {
            id: "BLS-ER-INFO",
            step: 4,
            category: "Emergency Response",
            label: "States location and casualty condition clearly.",
            critical: false,
            evaluate: |d| normalize(&d.activate_emergency_response.stated_location_and_condition),
        },
        BlsRule {
            id: "BLS-ER-AED",
            step: 4,
            category: "Emergency Response",
            label: "Designates a specific bystander to retrieve the AED.",
            critical: false,
            evaluate: |d| normalize(&d.activate_emergency_response.designated_aed_retriever),
        },
        BlsRule {
            id: "BLS-ER-SPEAKER",
            step: 4,
            category: "Emergency Response",
            label: "Uses speakerphone to keep both hands free for care.",
            critical: false,
            evaluate: |d| normalize(&d.activate_emergency_response.used_speakerphone),
        },
        // ─── Step 5: Chest Compressions ──────────────────────────────────
        BlsRule {
            id: "BLS-CC-HAND",
            step: 5,
            category: "Chest Compressions",
            label: "Correct hand position (centre of chest, lower half of sternum).",
            critical: false,
            evaluate: |d| normalize(&d.chest_compressions.correct_hand_position),
        },
        BlsRule {
            id: "BLS-CC-RECOIL",
            step: 5,
            category: "Chest Compressions",
            label: "Allows full chest recoil between compressions.",
            critical: false,
            evaluate: |d| normalize(&d.chest_compressions.full_chest_recoil),
        },
        BlsRule {
            id: "BLS-CC-INTERRUPT",
            step: 5,
            category: "Chest Compressions",
            label: "Minimises interruptions in chest compressions (<10 s).",
            critical: false,
            evaluate: |d| normalize(&d.chest_compressions.minimised_interruptions),
        },
        BlsRule {
            id: "BLS-CC-RATE",
            step: 5,
            category: "Chest Compressions",
            label: "Compressions delivered at AHA rate of 100-120 per minute.",
            critical: true,
            evaluate: |d| {
                let explicit = normalize(&d.chest_compressions.compressions_at_correct_rate);
                if !explicit.is_empty() {
                    return explicit;
                }
                match d.chest_compressions.compression_rate {
                    Some(rate) => {
                        if compression_rate_in_range(rate) {
                            "yes".to_string()
                        } else {
                            "no".to_string()
                        }
                    }
                    None => String::new(),
                }
            },
        },
        BlsRule {
            id: "BLS-CC-DEPTH",
            step: 5,
            category: "Chest Compressions",
            label: "Compressions delivered to AHA depth of 5-6 cm for an adult.",
            critical: true,
            evaluate: |d| {
                let explicit = normalize(&d.chest_compressions.compressions_at_correct_depth);
                if !explicit.is_empty() {
                    return explicit;
                }
                match d.chest_compressions.compression_depth {
                    Some(depth) => {
                        if compression_depth_in_range(depth) {
                            "yes".to_string()
                        } else {
                            "no".to_string()
                        }
                    }
                    None => String::new(),
                }
            },
        },
        // ─── Step 6: Airway & Rescue Breaths ─────────────────────────────
        BlsRule {
            id: "BLS-AB-AIRWAY",
            step: 6,
            category: "Airway & Breaths",
            label: "Opens airway with head tilt-chin lift (or jaw thrust if trauma).",
            critical: false,
            evaluate: |d| normalize(&d.airway_rescue_breaths.head_tilt_chin_lift),
        },
        BlsRule {
            id: "BLS-AB-SEAL",
            step: 6,
            category: "Airway & Breaths",
            label: "Achieves an effective seal on mask or pocket-mask device.",
            critical: false,
            evaluate: |d| normalize(&d.airway_rescue_breaths.effective_seal),
        },
        BlsRule {
            id: "BLS-AB-CHEST-RISE",
            step: 6,
            category: "Airway & Breaths",
            label: "Each ventilation produces visible chest rise (effective breath).",
            critical: true,
            evaluate: |d| normalize(&d.airway_rescue_breaths.visible_chest_rise),
        },
        BlsRule {
            id: "BLS-AB-DURATION",
            step: 6,
            category: "Airway & Breaths",
            label: "Delivers each breath over approximately 1 second.",
            critical: false,
            evaluate: |d| normalize(&d.airway_rescue_breaths.one_second_per_breath),
        },
        BlsRule {
            id: "BLS-AB-RATIO",
            step: 6,
            category: "Airway & Breaths",
            label: "Maintains a 30:2 compression-to-ventilation ratio.",
            critical: false,
            evaluate: |d| normalize(&d.airway_rescue_breaths.ratio30to2),
        },
        BlsRule {
            id: "BLS-AB-NOEXCESS",
            step: 6,
            category: "Airway & Breaths",
            label: "Avoids excessive ventilation (volume and rate).",
            critical: false,
            evaluate: |d| normalize(&d.airway_rescue_breaths.avoided_excessive_ventilation),
        },
        // ─── Step 7: AED Use & Shock Delivery ────────────────────────────
        BlsRule {
            id: "BLS-AED-POWER",
            step: 7,
            category: "AED Use",
            label: "Powers on the AED as soon as it is available.",
            critical: false,
            evaluate: |d| normalize(&d.aed_shock_delivery.powered_on_promptly),
        },
        BlsRule {
            id: "BLS-AED-PADS",
            step: 7,
            category: "AED Use",
            label: "Places pads in correct anterolateral position on bare chest.",
            critical: false,
            evaluate: |d| normalize(&d.aed_shock_delivery.correct_pad_placement),
        },
        BlsRule {
            id: "BLS-AED-CLEAR-ANALYSIS",
            step: 7,
            category: "AED Use",
            label: "Ensures everyone is clear during rhythm analysis.",
            critical: false,
            evaluate: |d| normalize(&d.aed_shock_delivery.cleared_during_analysis),
        },
        BlsRule {
            id: "BLS-AED-SAFE-SHOCK",
            step: 7,
            category: "AED Use",
            label: "Delivers shock with verbal \"I\u{2019}m clear, you\u{2019}re clear, everyone clear\" and no unsafe contact.",
            critical: true,
            evaluate: |d| normalize(&d.aed_shock_delivery.delivered_shock_safely),
        },
        BlsRule {
            id: "BLS-AED-RESUME",
            step: 7,
            category: "AED Use",
            label: "Resumes chest compressions immediately after shock.",
            critical: false,
            evaluate: |d| normalize(&d.aed_shock_delivery.resumed_compressions_immediately),
        },
        // ─── Step 8: Team Dynamics, Handoff & Feedback ───────────────────
        BlsRule {
            id: "BLS-TD-COMM",
            step: 8,
            category: "Team Dynamics",
            label: "Uses clear, calm communication with the team.",
            critical: false,
            evaluate: |d| normalize(&d.team_dynamics_handoff.clear_communication),
        },
        BlsRule {
            id: "BLS-TD-CLOSED-LOOP",
            step: 8,
            category: "Team Dynamics",
            label: "Uses closed-loop communication for orders and tasks.",
            critical: false,
            evaluate: |d| normalize(&d.team_dynamics_handoff.closed_loop_orders),
        },
        BlsRule {
            id: "BLS-TD-HANDOFF",
            step: 8,
            category: "Team Dynamics",
            label: "Provides a structured handoff to incoming providers (SBAR).",
            critical: false,
            evaluate: |d| normalize(&d.team_dynamics_handoff.appropriate_handoff),
        },
        BlsRule {
            id: "BLS-TD-DEBRIEF",
            step: 8,
            category: "Team Dynamics",
            label: "Participates constructively in the post-event debrief.",
            critical: false,
            evaluate: |d| normalize(&d.team_dynamics_handoff.debrief_participated),
        },
    ]
}
