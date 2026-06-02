use lifeguard_certification_checklist_loco_crate::engine::lifeguard_grader::grade;
use lifeguard_certification_checklist_loco_crate::engine::rules::lifeguard_rules;
use lifeguard_certification_checklist_loco_crate::engine::types::*;

/// Build a candidate with every observed competency answered "yes" and all
/// numeric measurements within NPLQ ranges.
fn fully_passing_candidate() -> AssessmentData {
    AssessmentData {
        candidate_details: CandidateDetails {
            first_name: "Alex".to_string(),
            last_name: "Smith".to_string(),
            candidate_id: "C-001".to_string(),
            date_of_birth: "2002-04-11".to_string(),
            venue_type: "pool".to_string(),
            venue_name: "Aquatic Centre".to_string(),
            assessment_type: "initial".to_string(),
            prior_certification_expiry: String::new(),
            session_date: "2026-06-01".to_string(),
            examiner_name: "Examiner Jane".to_string(),
            examiner_licence_number: "RLSS-12345".to_string(),
        },
        physical_fitness_swim: PhysicalFitnessSwim {
            swim50m_time_seconds: Some(48.0),
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
        overall_result_signoff: OverallResultSignoff {
            examiner_outcome: "pass".to_string(),
            strengths: String::new(),
            development_areas: String::new(),
            examiner_notes: String::new(),
            candidate_feedback: String::new(),
            candidate_acknowledged: "yes".to_string(),
        },
    }
}

#[test]
fn empty_assessment_grades_as_fail() {
    let data = AssessmentData::default();
    let result = grade(&data);
    assert_eq!(result.outcome, "fail");
    assert_eq!(result.answered_count, 0);
    assert!(result.critical_failures.is_empty());
    assert!(result.deficiencies.is_empty());
}

#[test]
fn fully_passing_candidate_passes() {
    let data = fully_passing_candidate();
    let result = grade(&data);
    assert_eq!(result.outcome, "pass");
    assert!(result.critical_failures.is_empty());
    assert!(result.deficiencies.is_empty());
}

#[test]
fn missed_50m_time_is_critical_fail() {
    let mut data = fully_passing_candidate();
    data.physical_fitness_swim.swim50m_within_time = "no".to_string();
    let result = grade(&data);
    assert_eq!(result.outcome, "fail");
    assert!(
        result
            .critical_failures
            .iter()
            .any(|r| r.id == "LIFE-PF-50M-TIME")
    );
}

#[test]
fn unconscious_tow_failure_is_critical_fail() {
    let mut data = fully_passing_candidate();
    data.rescue_unconscious.effective_tow_to_safety = "no".to_string();
    let result = grade(&data);
    assert_eq!(result.outcome, "fail");
    assert!(
        result
            .critical_failures
            .iter()
            .any(|r| r.id == "LIFE-RU-TOW")
    );
}

#[test]
fn one_noncritical_deficiency_is_needs_development() {
    let mut data = fully_passing_candidate();
    data.first_aid_oxygen.burns_management = "no".to_string();
    let result = grade(&data);
    assert_eq!(result.outcome, "needs-development");
    assert!(result.critical_failures.is_empty());
    assert_eq!(result.deficiencies.len(), 1);
}

#[test]
fn rule_ids_are_unique() {
    let rules = lifeguard_rules();
    let mut ids: Vec<&str> = rules.iter().map(|r| r.id).collect();
    ids.sort();
    let len_before = ids.len();
    ids.dedup();
    assert_eq!(ids.len(), len_before, "rule IDs must be unique");
}

#[test]
fn critical_rule_ids_present() {
    let rules = lifeguard_rules();
    let critical_ids = [
        "LIFE-PF-50M-TIME",
        "LIFE-SCAN-PATTERN",
        "LIFE-RU-TOW",
        "LIFE-RU-EXTRICATE",
        "LIFE-SP-HEADSPLINT",
        "LIFE-SP-BOARD",
        "LIFE-CPR-COMPRESSIONS",
        "LIFE-CPR-AED-PROMPT",
    ];
    for id in critical_ids {
        let rule = rules
            .iter()
            .find(|r| r.id == id)
            .unwrap_or_else(|| panic!("missing critical rule {id}"));
        assert!(rule.critical, "rule {id} must be critical");
    }
}

#[test]
fn cpr_numeric_out_of_range_derives_no_for_compressions() {
    let mut data = fully_passing_candidate();
    data.cpr_aed.effective_compressions = String::new();
    data.cpr_aed.compression_rate = Some(80.0);
    let result = grade(&data);
    // Numeric below 100/min triggers "no" for the critical compressions rule.
    assert_eq!(result.outcome, "fail");
    assert!(
        result
            .critical_failures
            .iter()
            .any(|r| r.id == "LIFE-CPR-COMPRESSIONS")
    );
}
