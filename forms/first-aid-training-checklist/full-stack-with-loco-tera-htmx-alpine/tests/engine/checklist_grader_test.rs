use first_aid_training_checklist_tera_crate::engine::checklist_grader::{grade, run_rules};
use first_aid_training_checklist_tera_crate::engine::checklist_rules::all_rules;
use first_aid_training_checklist_tera_crate::engine::types::*;

/// Build a fully demonstrated assessment with every rule marked `yes`.
fn fully_demonstrated() -> AssessmentData {
    AssessmentData {
        trainee_details: TraineeDetails {
            first_name: "Jane".to_string(),
            last_name: "Doe".to_string(),
            trainee_id: "T-001".to_string(),
            role: "first-aider".to_string(),
            prior_certification_expiry: "".to_string(),
            session_date: "2026-06-01".to_string(),
            examiner_name: "Mr Examiner".to_string(),
            venue: "Training Centre".to_string(),
        },
        scene_assessment_safety: SceneAssessmentSafety {
            scene_safe: "yes".to_string(),
            ppe_applied: "yes".to_string(),
            hazards_identified: "yes".to_string(),
            bystanders_controlled: "yes".to_string(),
        },
        primary_survey_drabc: PrimarySurveyDrabc {
            danger_check: "yes".to_string(),
            response_check: "yes".to_string(),
            airway_management: "yes".to_string(),
            breathing_check: "yes".to_string(),
            circulation_assessment: "yes".to_string(),
            recovery_position_when_appropriate: "yes".to_string(),
        },
        cpr_aed: CprAed {
            effective_compressions: "yes".to_string(),
            effective_ventilations: "yes".to_string(),
            ratio30to2: "yes".to_string(),
            aed_power_on_promptly: "yes".to_string(),
            aed_pad_placement: "yes".to_string(),
            aed_safe_shock_delivery: "yes".to_string(),
        },
        choking_management: ChokingManagement {
            encouraged_coughing: "yes".to_string(),
            five_back_blows: "yes".to_string(),
            five_abdominal_thrusts: "yes".to_string(),
            alternates_until_dislodged: "yes".to_string(),
            unconscious_choking_cpr: "yes".to_string(),
        },
        bleeding_wound_care: BleedingWoundCare {
            direct_pressure_applied: "yes".to_string(),
            elevated_and_immobilised: "yes".to_string(),
            applied_dressing_correctly: "yes".to_string(),
            tourniquet_when_indicated: "yes".to_string(),
            haemostatic_dressing_applied: "yes".to_string(),
            treated_for_shock: "yes".to_string(),
        },
        burns_scalds: BurnsScalds {
            cooled_for_twenty_minutes: "yes".to_string(),
            removed_jewellery_and_loose_clothing: "yes".to_string(),
            covered_with_cling_film_or_sterile_dressing: "yes".to_string(),
            avoided_creams_or_ice: "yes".to_string(),
            referred_appropriately: "yes".to_string(),
        },
        fractures_sprains_spinal: FracturesSprainsSpinal {
            immobilised_injured_limb: "yes".to_string(),
            applied_rice_for_sprains: "yes".to_string(),
            suspected_spinal_manual_support: "yes".to_string(),
            performed_log_roll_with_team: "yes".to_string(),
            avoided_unnecessary_movement: "yes".to_string(),
        },
        medical_emergencies: MedicalEmergencies {
            recognised_anaphylaxis: "yes".to_string(),
            administered_epi_pen_safely: "yes".to_string(),
            assisted_asthma_inhaler: "yes".to_string(),
            managed_hypoglycaemia: "yes".to_string(),
            managed_seizure_safely: "yes".to_string(),
            recognised_stroke_fast: "yes".to_string(),
            recognised_chest_pain: "yes".to_string(),
        },
        recording_reporting_handover: RecordingReportingHandover {
            accident_book_entry: "yes".to_string(),
            riddor_awareness: "yes".to_string(),
            structured_handoff_sbar: "yes".to_string(),
            confidentiality_maintained: "yes".to_string(),
            examiner_notes: "".to_string(),
            trainee_feedback: "".to_string(),
            debrief_notes: "".to_string(),
        },
    }
}

#[test]
fn empty_assessment_outcome_is_fail() {
    let data = AssessmentData::default();
    let result = grade(&data);
    assert_eq!(result.outcome, "fail");
    assert_eq!(result.answered_count, 0);
}

#[test]
fn fully_demonstrated_is_pass() {
    let data = fully_demonstrated();
    let result = grade(&data);
    assert_eq!(result.outcome, "pass");
    assert!(result.critical_failures.is_empty());
    assert!(result.deficiencies.is_empty());
}

#[test]
fn one_critical_no_is_fail() {
    let mut data = fully_demonstrated();
    data.primary_survey_drabc.response_check = "no".to_string();
    let result = grade(&data);
    assert_eq!(result.outcome, "fail");
    assert!(result.critical_failures.iter().any(|r| r.id == "FAW-PS-RESPONSE"));
}

#[test]
fn one_non_critical_no_is_needs_development() {
    let mut data = fully_demonstrated();
    data.burns_scalds.referred_appropriately = "no".to_string();
    let result = grade(&data);
    assert_eq!(result.outcome, "needs-development");
}

#[test]
fn three_non_critical_no_is_fail() {
    let mut data = fully_demonstrated();
    data.burns_scalds.referred_appropriately = "no".to_string();
    data.burns_scalds.avoided_creams_or_ice = "no".to_string();
    data.burns_scalds.cooled_for_twenty_minutes = "no".to_string();
    let result = grade(&data);
    assert_eq!(result.outcome, "fail");
}

#[test]
fn na_does_not_count_as_deficiency() {
    let mut data = fully_demonstrated();
    data.burns_scalds.referred_appropriately = "na".to_string();
    let result = grade(&data);
    assert_eq!(result.outcome, "pass");
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

#[test]
fn run_rules_returns_audit_trail() {
    let data = fully_demonstrated();
    let fired = run_rules(&data);
    assert_eq!(fired.len(), all_rules().len());
    assert!(fired.iter().all(|r| r.status == "yes"));
}
