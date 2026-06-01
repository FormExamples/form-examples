use first_aid_training_checklist_tera_crate::engine::checklist_grader::grade;
use first_aid_training_checklist_tera_crate::engine::flagged_issues::detect_additional_flags;
use first_aid_training_checklist_tera_crate::engine::types::*;

fn baseline() -> AssessmentData {
    // Reuse the fully-demonstrated builder logic inline to keep this test
    // module self-contained.
    let mut d = AssessmentData::default();
    d.scene_assessment_safety = SceneAssessmentSafety {
        scene_safe: "yes".to_string(),
        ppe_applied: "yes".to_string(),
        hazards_identified: "yes".to_string(),
        bystanders_controlled: "yes".to_string(),
    };
    d.primary_survey_drabc = PrimarySurveyDrabc {
        danger_check: "yes".to_string(),
        response_check: "yes".to_string(),
        airway_management: "yes".to_string(),
        breathing_check: "yes".to_string(),
        circulation_assessment: "yes".to_string(),
        recovery_position_when_appropriate: "yes".to_string(),
    };
    d.cpr_aed = CprAed {
        effective_compressions: "yes".to_string(),
        effective_ventilations: "yes".to_string(),
        ratio30to2: "yes".to_string(),
        aed_power_on_promptly: "yes".to_string(),
        aed_pad_placement: "yes".to_string(),
        aed_safe_shock_delivery: "yes".to_string(),
    };
    d.choking_management = ChokingManagement {
        encouraged_coughing: "yes".to_string(),
        five_back_blows: "yes".to_string(),
        five_abdominal_thrusts: "yes".to_string(),
        alternates_until_dislodged: "yes".to_string(),
        unconscious_choking_cpr: "yes".to_string(),
    };
    d.bleeding_wound_care = BleedingWoundCare {
        direct_pressure_applied: "yes".to_string(),
        elevated_and_immobilised: "yes".to_string(),
        applied_dressing_correctly: "yes".to_string(),
        tourniquet_when_indicated: "yes".to_string(),
        haemostatic_dressing_applied: "yes".to_string(),
        treated_for_shock: "yes".to_string(),
    };
    d.burns_scalds = BurnsScalds {
        cooled_for_twenty_minutes: "yes".to_string(),
        removed_jewellery_and_loose_clothing: "yes".to_string(),
        covered_with_cling_film_or_sterile_dressing: "yes".to_string(),
        avoided_creams_or_ice: "yes".to_string(),
        referred_appropriately: "yes".to_string(),
    };
    d.fractures_sprains_spinal = FracturesSprainsSpinal {
        immobilised_injured_limb: "yes".to_string(),
        applied_rice_for_sprains: "yes".to_string(),
        suspected_spinal_manual_support: "yes".to_string(),
        performed_log_roll_with_team: "yes".to_string(),
        avoided_unnecessary_movement: "yes".to_string(),
    };
    d.medical_emergencies = MedicalEmergencies {
        recognised_anaphylaxis: "yes".to_string(),
        administered_epi_pen_safely: "yes".to_string(),
        assisted_asthma_inhaler: "yes".to_string(),
        managed_hypoglycaemia: "yes".to_string(),
        managed_seizure_safely: "yes".to_string(),
        recognised_stroke_fast: "yes".to_string(),
        recognised_chest_pain: "yes".to_string(),
    };
    d.recording_reporting_handover = RecordingReportingHandover {
        accident_book_entry: "yes".to_string(),
        riddor_awareness: "yes".to_string(),
        structured_handoff_sbar: "yes".to_string(),
        confidentiality_maintained: "yes".to_string(),
        examiner_notes: "".to_string(),
        trainee_feedback: "".to_string(),
        debrief_notes: "".to_string(),
    };
    d
}

#[test]
fn baseline_has_no_flags() {
    let data = baseline();
    let g = grade(&data);
    let flags = detect_additional_flags(&data, &g.critical_failures, &g.deficiencies);
    assert!(flags.is_empty(), "baseline should not produce flags: {flags:?}");
}

#[test]
fn critical_failure_emits_high_flag() {
    let mut data = baseline();
    data.primary_survey_drabc.response_check = "no".to_string();
    let g = grade(&data);
    let flags = detect_additional_flags(&data, &g.critical_failures, &g.deficiencies);
    assert!(flags.iter().any(|f| f.id == "FLAG-CRIT-FAW-PS-RESPONSE" && f.priority == "high"));
}

#[test]
fn expired_certification_emits_high_flag() {
    let mut data = baseline();
    data.trainee_details.prior_certification_expiry = "2020-01-01".to_string();
    let g = grade(&data);
    let flags = detect_additional_flags(&data, &g.critical_failures, &g.deficiencies);
    assert!(flags.iter().any(|f| f.id == "FLAG-CERT-EXPIRED" && f.priority == "high"));
}

#[test]
fn single_deficiency_emits_low_improvement_flag() {
    let mut data = baseline();
    data.burns_scalds.referred_appropriately = "no".to_string();
    let g = grade(&data);
    let flags = detect_additional_flags(&data, &g.critical_failures, &g.deficiencies);
    assert!(flags.iter().any(|f| f.id.starts_with("FLAG-IMPROVE-") && f.priority == "low"));
}

#[test]
fn anaphylaxis_recognised_but_unsafe_epipen_emits_medium_flag() {
    let mut data = baseline();
    data.medical_emergencies.recognised_anaphylaxis = "yes".to_string();
    data.medical_emergencies.administered_epi_pen_safely = "no".to_string();
    let g = grade(&data);
    let flags = detect_additional_flags(&data, &g.critical_failures, &g.deficiencies);
    let flag = flags.iter().find(|f| f.id == "FLAG-MED-EPIPEN").expect("epipen flag");
    assert_eq!(flag.priority, "medium");
}

#[test]
fn examiner_notes_emits_low_debrief_flag() {
    let mut data = baseline();
    data.recording_reporting_handover.examiner_notes = "Good technique.".to_string();
    let g = grade(&data);
    let flags = detect_additional_flags(&data, &g.critical_failures, &g.deficiencies);
    assert!(flags.iter().any(|f| f.id == "FLAG-DEBRIEF-EXAMINER" && f.priority == "low"));
}

#[test]
fn flags_are_sorted_by_priority() {
    let mut data = baseline();
    data.primary_survey_drabc.response_check = "no".to_string(); // high (critical)
    data.medical_emergencies.administered_epi_pen_safely = "no".to_string(); // medium
    data.recording_reporting_handover.debrief_notes = "Discussed.".to_string(); // low
    let g = grade(&data);
    let flags = detect_additional_flags(&data, &g.critical_failures, &g.deficiencies);
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
