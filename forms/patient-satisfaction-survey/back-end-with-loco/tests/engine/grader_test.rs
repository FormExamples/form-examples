use patient_satisfaction_survey_loco_crate::engine::grader::{grade, run_rules};
use patient_satisfaction_survey_loco_crate::engine::rules::all_rules;
use patient_satisfaction_survey_loco_crate::engine::types::*;
use patient_satisfaction_survey_loco_crate::engine::utils::{
    categorize_score, normalize_likert_scores,
};

/// Build a fully satisfied case (all Likert items = 5, no concerns).
fn fully_satisfied_case() -> AssessmentData {
    AssessmentData {
        demographics: Demographics {
            first_name: "Jane".to_string(),
            last_name: "Doe".to_string(),
            date_of_birth: "1972-04-11".to_string(),
            sex: "female".to_string(),
            age_range: "55-64".to_string(),
            ethnicity: "White British".to_string(),
            preferred_language: "English".to_string(),
            interpreter_required: "no".to_string(),
        },
        visit_details: VisitDetails {
            visit_date: "2026-06-01".to_string(),
            visit_type: "outpatient".to_string(),
            department: "Cardiology".to_string(),
            hospital_site: "St James's Hospital".to_string(),
            length_of_stay_days: Some(0),
            referral_source: "gp".to_string(),
            is_first_visit: "no".to_string(),
        },
        access_waiting_times: AccessWaitingTimes {
            ease_of_booking: Some(5),
            waiting_time_for_appointment: Some(5),
            waiting_time_on_day: Some(5),
            reception_service: Some(5),
            signage_wayfinding: Some(5),
            parking_transport: Some(5),
            actual_wait_minutes: Some(10),
        },
        communication_information: CommunicationInformation {
            explanation_of_condition: Some(5),
            explanation_of_treatment: Some(5),
            opportunity_to_ask_questions: Some(5),
            listened_to: Some(5),
            informed_about_medication: Some(5),
            written_information_quality: Some(5),
        },
        clinical_care_quality: ClinicalCareQuality {
            confidence_in_clinician: Some(5),
            thoroughness_of_examination: Some(5),
            pain_management: Some(5),
            involvement_in_decisions: Some(5),
            privacy_during_examination: Some(5),
            coordination_of_care: Some(5),
        },
        staff_attitude: StaffAttitude {
            doctor_courtesy: Some(5),
            nurse_courtesy: Some(5),
            reception_courtesy: Some(5),
            respect_for_dignity: Some(5),
            cultural_sensitivity: Some(5),
            emotional_support: Some(5),
        },
        environment_facilities: EnvironmentFacilities {
            cleanliness: Some(5),
            comfort: Some(5),
            noise_levels: Some(5),
            food_quality: Some(5),
            toilet_facilities: Some(5),
            temperature_comfort: Some(5),
        },
        discharge_follow_up: DischargeFollowUp {
            discharge_information: Some(5),
            medication_explanation: Some(5),
            follow_up_arrangements: Some(5),
            knew_who_to_contact: Some(5),
            recovery_information: Some(5),
            care_plan_clarity: Some(5),
        },
        overall_experience: OverallExperience {
            overall_satisfaction: Some(5),
            would_recommend: Some(5),
            met_expectations: Some(5),
            felt_safe: Some(5),
            would_return: Some(5),
            nhs_rating: Some(10),
        },
        comments_suggestions: CommentsSuggestions::default(),
    }
}

#[test]
fn empty_case_is_very_poor() {
    let data = AssessmentData::default();
    let result = grade(&data);
    assert_eq!(result.normalized_score, 0.0);
    assert_eq!(result.satisfaction_category, "very-poor");
}

#[test]
fn fully_satisfied_case_is_excellent() {
    let data = fully_satisfied_case();
    let result = grade(&data);
    assert_eq!(result.normalized_score, 100.0);
    assert_eq!(result.satisfaction_category, "excellent");
    assert!(result.fired_rules.is_empty());
}

#[test]
fn normalize_likert_basic() {
    assert_eq!(normalize_likert_scores(&[Some(1), Some(5)]), Some(60.0));
    assert_eq!(normalize_likert_scores(&[]), None);
    assert_eq!(normalize_likert_scores(&[None]), None);
}

#[test]
fn categorize_score_boundaries() {
    assert_eq!(categorize_score(100.0), "excellent");
    assert_eq!(categorize_score(85.0), "excellent");
    assert_eq!(categorize_score(84.9), "good");
    assert_eq!(categorize_score(70.0), "good");
    assert_eq!(categorize_score(69.9), "satisfactory");
    assert_eq!(categorize_score(50.0), "satisfactory");
    assert_eq!(categorize_score(49.9), "poor");
    assert_eq!(categorize_score(25.0), "poor");
    assert_eq!(categorize_score(24.9), "very-poor");
    assert_eq!(categorize_score(0.0), "very-poor");
}

#[test]
fn complaint_raised_fires_cmt_001() {
    let mut data = fully_satisfied_case();
    data.comments_suggestions.complaint_raised = "yes".to_string();
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "CMT-001" && r.severity == 4));
}

#[test]
fn privacy_concern_fires_cln_004() {
    let mut data = fully_satisfied_case();
    data.clinical_care_quality.privacy_during_examination = Some(1);
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "CLN-004" && r.severity == 4));
}

#[test]
fn excessive_wait_fires_acc_004() {
    let mut data = fully_satisfied_case();
    data.access_waiting_times.actual_wait_minutes = Some(120);
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "ACC-004"));
}

#[test]
fn very_low_nhs_rating_fires_ovr_004() {
    let mut data = fully_satisfied_case();
    data.overall_experience.nhs_rating = Some(2);
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "OVR-004"));
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
fn domain_scores_present_for_answered_domains() {
    let data = fully_satisfied_case();
    let result = grade(&data);
    assert_eq!(result.domain_scores.access, Some(100.0));
    assert_eq!(result.domain_scores.communication, Some(100.0));
    assert_eq!(result.domain_scores.clinical_care, Some(100.0));
    assert_eq!(result.domain_scores.staff, Some(100.0));
    assert_eq!(result.domain_scores.environment, Some(100.0));
    assert_eq!(result.domain_scores.discharge, Some(100.0));
    assert_eq!(result.domain_scores.overall, Some(100.0));
}
