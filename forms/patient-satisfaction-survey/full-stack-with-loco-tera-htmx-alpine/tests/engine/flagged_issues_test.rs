use patient_satisfaction_survey_tera_crate::engine::flagged_issues::detect_additional_flags;
use patient_satisfaction_survey_tera_crate::engine::types::*;

fn baseline_case() -> AssessmentData {
    AssessmentData {
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
        ..AssessmentData::default()
    }
}

#[test]
fn baseline_has_no_flags() {
    let flags = detect_additional_flags(&baseline_case());
    assert!(flags.is_empty(), "baseline should not produce flags: {flags:?}");
}

#[test]
fn felt_unsafe_emits_safety_flag() {
    let mut data = baseline_case();
    data.overall_experience.felt_safe = Some(1);
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-SAFETY-001" && f.priority == "high")
    );
}

#[test]
fn complaint_raised_emits_complaint_flag() {
    let mut data = baseline_case();
    data.comments_suggestions.complaint_raised = "yes".to_string();
    data.comments_suggestions.complaint_details = "Long wait in A&E.".to_string();
    let flags = detect_additional_flags(&data);
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-COMPLAINT-001")
        .expect("complaint flag");
    assert_eq!(flag.priority, "high");
    assert!(flag.message.contains("Long wait"));
}

#[test]
fn privacy_concern_emits_high_priority_flag() {
    let mut data = baseline_case();
    data.clinical_care_quality.privacy_during_examination = Some(1);
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-PRIVACY-001" && f.priority == "high")
    );
}

#[test]
fn dignity_concern_emits_flag() {
    let mut data = baseline_case();
    data.staff_attitude.respect_for_dignity = Some(2);
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-DIGNITY-001" && f.priority == "high")
    );
}

#[test]
fn would_not_recommend_emits_flag() {
    let mut data = baseline_case();
    data.overall_experience.would_recommend = Some(1);
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-RECOMMEND-001" && f.priority == "high")
    );
}

#[test]
fn low_nhs_rating_emits_medium_flag() {
    let mut data = baseline_case();
    data.overall_experience.nhs_rating = Some(3);
    let flags = detect_additional_flags(&data);
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-NHSRATING-001")
        .expect("nhs flag");
    assert_eq!(flag.priority, "medium");
}

#[test]
fn excessive_wait_emits_medium_flag() {
    let mut data = baseline_case();
    data.access_waiting_times.actual_wait_minutes = Some(120);
    let flags = detect_additional_flags(&data);
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-WAIT-001")
        .expect("wait flag");
    assert_eq!(flag.priority, "medium");
}

#[test]
fn staff_praise_emits_low_priority_flag() {
    let mut data = baseline_case();
    data.comments_suggestions.specific_staff_praise =
        "Nurse Mary was kind and thorough.".to_string();
    let flags = detect_additional_flags(&data);
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-PRAISE-001")
        .expect("praise flag");
    assert_eq!(flag.priority, "low");
}

#[test]
fn flags_are_sorted_by_priority() {
    let mut data = baseline_case();
    // One high, one medium, one low.
    data.overall_experience.would_recommend = Some(1);
    data.access_waiting_times.actual_wait_minutes = Some(120);
    data.comments_suggestions.specific_staff_praise = "Praise.".to_string();
    let flags = detect_additional_flags(&data);
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
