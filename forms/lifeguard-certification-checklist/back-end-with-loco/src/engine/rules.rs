//! Rules module.

// RLSS UK NPLQ / ILSF Lifeguard Competency Verification rules (declarative).
//
// Each rule maps a single observed competency to a TriState value:
//   "yes" = demonstrated correctly (passes the rule)
//   "no"  = not yet demonstrated (deficiency)
//   "na"  = not assessed in this session (excluded from grading)
//   ""    = examiner has not yet recorded an answer (excluded)
//
// Critical competencies (per RLSS NPLQ): any "no" on a rule with
// critical=true forces an overall Fail.

use super::types::{AssessmentData, TriState};
use super::utils::{compression_depth_in_range, compression_rate_in_range, swim50m_within_target};

/// A declarative lifeguard rule.
pub struct LifeguardRule {
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
    /// Default expectation.
    pub default_expectation: &'static str,
    /// Evaluate.
    pub evaluate: fn(&AssessmentData) -> TriState,
}

/// Normalise an answer to a known TriState, returning "" for any other value.
fn norm(v: &str) -> TriState {
    if v == "yes" || v == "no" || v == "na" {
        v.to_string()
    } else {
        String::new()
    }
}

/// All Lifeguard Certification Checklist rules.
pub fn lifeguard_rules() -> Vec<LifeguardRule> {
    vec![
        // --- Step 2: Physical Fitness & Swim Competency ---
        LifeguardRule {
            id: "LIFE-PF-50M-TIME",
            step: 2,
            category: "Swim Competency",
            label: "Completes 50 m timed swim in 60 seconds or less (NPLQ standard).",
            critical: true,
            default_expectation: "yes",
            evaluate: |d| {
                let explicit = norm(&d.physical_fitness_swim.swim50m_within_time);
                if !explicit.is_empty() {
                    return explicit;
                }
                match d.physical_fitness_swim.swim50m_time_seconds {
                    None => String::new(),
                    Some(_) => {
                        if swim50m_within_target(d.physical_fitness_swim.swim50m_time_seconds) {
                            "yes".to_string()
                        } else {
                            "no".to_string()
                        }
                    }
                }
            },
        },
        LifeguardRule {
            id: "LIFE-PF-DIVE",
            step: 2,
            category: "Swim Competency",
            label: "Sustained surface dive to required depth and recovers an object.",
            critical: false,
            default_expectation: "yes",
            evaluate: |d| norm(&d.physical_fitness_swim.sustained_surface_dive),
        },
        LifeguardRule {
            id: "LIFE-PF-200M",
            step: 2,
            category: "Swim Competency",
            label: "Sustained 200 m swim using mixed strokes (front crawl, breast, back).",
            critical: false,
            default_expectation: "yes",
            evaluate: |d| norm(&d.physical_fitness_swim.swim200m_mixed_strokes),
        },
        LifeguardRule {
            id: "LIFE-PF-TREAD",
            step: 2,
            category: "Swim Competency",
            label: "Treads water for 2 minutes with hands clear of the surface.",
            critical: false,
            default_expectation: "yes",
            evaluate: |d| norm(&d.physical_fitness_swim.tread_water_two_minutes),
        },
        LifeguardRule {
            id: "LIFE-PF-TOW",
            step: 2,
            category: "Swim Competency",
            label: "Tows a casualty 50 m through the water using an approved hold.",
            critical: false,
            default_expectation: "yes",
            evaluate: |d| norm(&d.physical_fitness_swim.tow_casualty50m),
        },
        // --- Step 3: Supervision, Scanning & Zoning ---
        LifeguardRule {
            id: "LIFE-SCAN-ZONE",
            step: 3,
            category: "Supervision",
            label: "Understands and articulates zone of responsibility.",
            critical: false,
            default_expectation: "yes",
            evaluate: |d| norm(&d.supervision_scanning_zoning.understands_zone_of_responsibility),
        },
        LifeguardRule {
            id: "LIFE-SCAN-PATTERN",
            step: 3,
            category: "Scanning",
            label: "Maintains an effective, systematic scanning pattern across the zone.",
            critical: true,
            default_expectation: "yes",
            evaluate: |d| norm(&d.supervision_scanning_zoning.effective_scanning_pattern),
        },
        LifeguardRule {
            id: "LIFE-SCAN-1020",
            step: 3,
            category: "Scanning",
            label: "Applies the 10/20 rule (10 s to recognise, 20 s to reach).",
            critical: false,
            default_expectation: "yes",
            evaluate: |d| norm(&d.supervision_scanning_zoning.ten_twenty_scan_rule),
        },
        LifeguardRule {
            id: "LIFE-SCAN-DISTRESS",
            step: 3,
            category: "Scanning",
            label: "Recognises early signs of a distressed or drowning swimmer.",
            critical: false,
            default_expectation: "yes",
            evaluate: |d| norm(&d.supervision_scanning_zoning.recognises_distressed_swimmer),
        },
        LifeguardRule {
            id: "LIFE-SCAN-ROTATION",
            step: 3,
            category: "Supervision",
            label: "Performs zone rotations safely and at appropriate intervals.",
            critical: false,
            default_expectation: "yes",
            evaluate: |d| norm(&d.supervision_scanning_zoning.appropriate_rotation),
        },
        LifeguardRule {
            id: "LIFE-SCAN-WHISTLE",
            step: 3,
            category: "Supervision",
            label: "Uses whistle and hand signals correctly to communicate with team.",
            critical: false,
            default_expectation: "yes",
            evaluate: |d| norm(&d.supervision_scanning_zoning.uses_whistle_and_signals),
        },
        // --- Step 4: Rescue Scenario, Conscious Casualty ---
        LifeguardRule {
            id: "LIFE-RC-RECOG",
            step: 4,
            category: "Conscious Rescue",
            label: "Recognises the incident and alerts the team without delay.",
            critical: false,
            default_expectation: "yes",
            evaluate: |d| norm(&d.rescue_conscious.recognition_and_alert),
        },
        LifeguardRule {
            id: "LIFE-RC-ENTRY",
            step: 4,
            category: "Conscious Rescue",
            label: "Enters the water without losing sight of the casualty.",
            critical: false,
            default_expectation: "yes",
            evaluate: |d| norm(&d.rescue_conscious.entry_without_loss_of_sight),
        },
        LifeguardRule {
            id: "LIFE-RC-AID",
            step: 4,
            category: "Conscious Rescue",
            label: "Approaches with a floating aid (torpedo buoy, throw bag, etc.).",
            critical: false,
            default_expectation: "yes",
            evaluate: |d| norm(&d.rescue_conscious.approach_with_floating_aid),
        },
        LifeguardRule {
            id: "LIFE-RC-REASSURE",
            step: 4,
            category: "Conscious Rescue",
            label: "Reassures and instructs the casualty during the rescue.",
            critical: false,
            default_expectation: "yes",
            evaluate: |d| norm(&d.rescue_conscious.reassures_casualty),
        },
        LifeguardRule {
            id: "LIFE-RC-TOW",
            step: 4,
            category: "Conscious Rescue",
            label: "Tows the casualty safely to the side of the pool / shore.",
            critical: false,
            default_expectation: "yes",
            evaluate: |d| norm(&d.rescue_conscious.tow_to_safety),
        },
        LifeguardRule {
            id: "LIFE-RC-EXTRICATE",
            step: 4,
            category: "Conscious Rescue",
            label: "Extricates the casualty from the water with appropriate technique.",
            critical: false,
            default_expectation: "yes",
            evaluate: |d| norm(&d.rescue_conscious.extrication_from_water),
        },
        // --- Step 5: Rescue Scenario, Unconscious Casualty ---
        LifeguardRule {
            id: "LIFE-RU-RECOG",
            step: 5,
            category: "Unconscious Rescue",
            label: "Recognises unconscious casualty and activates emergency response.",
            critical: false,
            default_expectation: "yes",
            evaluate: |d| norm(&d.rescue_unconscious.recognition_and_alert),
        },
        LifeguardRule {
            id: "LIFE-RU-ENTRY",
            step: 5,
            category: "Unconscious Rescue",
            label: "Performs safe entry and rapid approach to the casualty.",
            critical: false,
            default_expectation: "yes",
            evaluate: |d| norm(&d.rescue_unconscious.safe_entry_and_approach),
        },
        LifeguardRule {
            id: "LIFE-RU-AIRWAY",
            step: 5,
            category: "Unconscious Rescue",
            label: "Manages the airway in the water (head tilt, mouth clear of water).",
            critical: false,
            default_expectation: "yes",
            evaluate: |d| norm(&d.rescue_unconscious.airway_management_in_water),
        },
        LifeguardRule {
            id: "LIFE-RU-TOW",
            step: 5,
            category: "Unconscious Rescue",
            label: "Effective tow of unconscious casualty to safety, airway protected.",
            critical: true,
            default_expectation: "yes",
            evaluate: |d| norm(&d.rescue_unconscious.effective_tow_to_safety),
        },
        LifeguardRule {
            id: "LIFE-RU-EXTRICATE",
            step: 5,
            category: "Unconscious Rescue",
            label: "Safe extrication of unconscious casualty without injury.",
            critical: true,
            default_expectation: "yes",
            evaluate: |d| norm(&d.rescue_unconscious.safe_extrication),
        },
        LifeguardRule {
            id: "LIFE-RU-HANDOVER",
            step: 5,
            category: "Unconscious Rescue",
            label: "Communicates clear handover signal to colleagues / EMS.",
            critical: false,
            default_expectation: "yes",
            evaluate: |d| norm(&d.rescue_unconscious.handover_handsignal),
        },
        // --- Step 6: Spinal Injury Management ---
        LifeguardRule {
            id: "LIFE-SP-MECH",
            step: 6,
            category: "Spinal Management",
            label: "Recognises mechanism of injury suggesting suspected spinal trauma.",
            critical: false,
            default_expectation: "yes",
            evaluate: |d| norm(&d.spinal_injury_management.recognises_mechanism),
        },
        LifeguardRule {
            id: "LIFE-SP-HEADSPLINT",
            step: 6,
            category: "Spinal Management",
            label: "Applies head-splint hold safely in the water.",
            critical: true,
            default_expectation: "yes",
            evaluate: |d| norm(&d.spinal_injury_management.head_splint_hold),
        },
        LifeguardRule {
            id: "LIFE-SP-INLINE",
            step: 6,
            category: "Spinal Management",
            label: "Maintains in-line stabilisation throughout movement.",
            critical: false,
            default_expectation: "yes",
            evaluate: |d| norm(&d.spinal_injury_management.maintains_inline_stabilisation),
        },
        LifeguardRule {
            id: "LIFE-SP-ROLL",
            step: 6,
            category: "Spinal Management",
            label: "Performs careful in-water roll if face-down (where indicated).",
            critical: false,
            default_expectation: "yes",
            evaluate: |d| norm(&d.spinal_injury_management.careful_roll_if_needed),
        },
        LifeguardRule {
            id: "LIFE-SP-BOARD",
            step: 6,
            category: "Spinal Management",
            label: "Uses spineboard correctly to extricate suspected spinal casualty.",
            critical: true,
            default_expectation: "yes",
            evaluate: |d| norm(&d.spinal_injury_management.use_of_spineboard),
        },
        LifeguardRule {
            id: "LIFE-SP-SECURE",
            step: 6,
            category: "Spinal Management",
            label: "Secures casualty to spineboard with straps and head blocks.",
            critical: false,
            default_expectation: "yes",
            evaluate: |d| norm(&d.spinal_injury_management.secure_casualty_to_board),
        },
        // --- Step 7: CPR & AED ---
        LifeguardRule {
            id: "LIFE-CPR-COMPRESSIONS",
            step: 7,
            category: "CPR & AED",
            label: "Effective compressions to standard rate (100-120/min) and depth (5-6 cm).",
            critical: true,
            default_expectation: "yes",
            evaluate: |d| {
                let explicit = norm(&d.cpr_aed.effective_compressions);
                if !explicit.is_empty() {
                    return explicit;
                }
                let rate = d.cpr_aed.compression_rate;
                let depth = d.cpr_aed.compression_depth;
                if rate.is_none() && depth.is_none() {
                    return String::new();
                }
                let rate_ok = rate.is_none() || compression_rate_in_range(rate);
                let depth_ok = depth.is_none() || compression_depth_in_range(depth);
                if rate_ok && depth_ok {
                    "yes".to_string()
                } else {
                    "no".to_string()
                }
            },
        },
        LifeguardRule {
            id: "LIFE-CPR-VENTILATIONS",
            step: 7,
            category: "CPR & AED",
            label: "Delivers effective ventilations producing visible chest rise.",
            critical: false,
            default_expectation: "yes",
            evaluate: |d| norm(&d.cpr_aed.effective_ventilations),
        },
        LifeguardRule {
            id: "LIFE-CPR-AED-PROMPT",
            step: 7,
            category: "CPR & AED",
            label: "Delivers AED shock promptly without unsafe contact during shock.",
            critical: true,
            default_expectation: "yes",
            evaluate: |d| norm(&d.cpr_aed.aed_delivered_promptly),
        },
        LifeguardRule {
            id: "LIFE-CPR-AED-SAFE",
            step: 7,
            category: "CPR & AED",
            label: "Calls \"all clear\" and verifies no contact before pressing shock.",
            critical: false,
            default_expectation: "yes",
            evaluate: |d| norm(&d.cpr_aed.safe_shock_no_unsafe_contact),
        },
        LifeguardRule {
            id: "LIFE-CPR-QUALITY",
            step: 7,
            category: "CPR & AED",
            label: "Maintains continuous high-quality CPR with minimal interruptions.",
            critical: false,
            default_expectation: "yes",
            evaluate: |d| norm(&d.cpr_aed.continuous_quality_cpr),
        },
        // --- Step 8: First Aid & Oxygen Therapy ---
        LifeguardRule {
            id: "LIFE-FA-BLEEDING",
            step: 8,
            category: "First Aid",
            label: "Controls external bleeding (direct pressure, dressings, elevation).",
            critical: false,
            default_expectation: "yes",
            evaluate: |d| norm(&d.first_aid_oxygen.bleeding_control),
        },
        LifeguardRule {
            id: "LIFE-FA-BURNS",
            step: 8,
            category: "First Aid",
            label: "Manages burns appropriately (cool water, cover, do not break blisters).",
            critical: false,
            default_expectation: "yes",
            evaluate: |d| norm(&d.first_aid_oxygen.burns_management),
        },
        LifeguardRule {
            id: "LIFE-FA-FRACTURE",
            step: 8,
            category: "First Aid",
            label: "Immobilises suspected fractures and supports the limb.",
            critical: false,
            default_expectation: "yes",
            evaluate: |d| norm(&d.first_aid_oxygen.fracture_immobilisation),
        },
        LifeguardRule {
            id: "LIFE-FA-RECOVERY",
            step: 8,
            category: "First Aid",
            label: "Places unresponsive breathing casualty in the recovery position.",
            critical: false,
            default_expectation: "yes",
            evaluate: |d| norm(&d.first_aid_oxygen.recovery_position_use),
        },
        LifeguardRule {
            id: "LIFE-FA-OXYGEN",
            step: 8,
            category: "First Aid",
            label: "Administers oxygen therapy correctly via mask at appropriate flow.",
            critical: false,
            default_expectation: "yes",
            evaluate: |d| norm(&d.first_aid_oxygen.oxygen_therapy_administration),
        },
        LifeguardRule {
            id: "LIFE-FA-MASK",
            step: 8,
            category: "First Aid",
            label: "Uses pocket mask or bag-valve-mask with effective seal.",
            critical: false,
            default_expectation: "yes",
            evaluate: |d| norm(&d.first_aid_oxygen.uses_pocket_mask_or_bvm),
        },
        // --- Step 9: Legal, Regulatory & Incident Reporting ---
        LifeguardRule {
            id: "LIFE-LR-DUTY",
            step: 9,
            category: "Legal & Regulatory",
            label: "Demonstrates understanding of duty of care and lifeguard responsibilities.",
            critical: false,
            default_expectation: "yes",
            evaluate: |d| norm(&d.legal_regulatory_incident.duty_of_care_understood),
        },
        LifeguardRule {
            id: "LIFE-LR-PSWP",
            step: 9,
            category: "Legal & Regulatory",
            label: "Knows venue Pool Safety Operating Procedures (PSOP / NOP / EAP).",
            critical: false,
            default_expectation: "yes",
            evaluate: |d| norm(&d.legal_regulatory_incident.pswp_knowledge),
        },
        LifeguardRule {
            id: "LIFE-LR-EAP",
            step: 9,
            category: "Legal & Regulatory",
            label: "Can correctly invoke the Emergency Action Plan (EAP).",
            critical: false,
            default_expectation: "yes",
            evaluate: |d| norm(&d.legal_regulatory_incident.eap_invocation),
        },
        LifeguardRule {
            id: "LIFE-LR-REPORT",
            step: 9,
            category: "Legal & Regulatory",
            label: "Completes incident report accurately and contemporaneously.",
            critical: false,
            default_expectation: "yes",
            evaluate: |d| norm(&d.legal_regulatory_incident.incident_report_completed),
        },
        LifeguardRule {
            id: "LIFE-LR-RIDDOR",
            step: 9,
            category: "Legal & Regulatory",
            label: "Demonstrates awareness of RIDDOR reportable events.",
            critical: false,
            default_expectation: "yes",
            evaluate: |d| norm(&d.legal_regulatory_incident.riddor_awareness),
        },
        LifeguardRule {
            id: "LIFE-LR-SAFEGUARD",
            step: 9,
            category: "Legal & Regulatory",
            label: "Understands safeguarding obligations for children and adults at risk.",
            critical: false,
            default_expectation: "yes",
            evaluate: |d| norm(&d.legal_regulatory_incident.safeguarding_children_adults),
        },
    ]
}
