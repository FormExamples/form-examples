use emergency_medical_technician_psychomotor_examination_loco_crate::engine::psychomotor_grader::grade;
use emergency_medical_technician_psychomotor_examination_loco_crate::engine::types::*;

fn fully_passing_case() -> AssessmentData {
    AssessmentData {
        scene_size_up: SceneSizeUp {
            ppe_precautions: "yes".to_string(),
            scene_safe: "yes".to_string(),
            mechanism_or_nature: "yes".to_string(),
            number_of_patients: "yes".to_string(),
            additional_resources: "yes".to_string(),
            considers_cspine: "yes".to_string(),
        },
        primary_survey: PrimarySurvey {
            general_impression: "yes".to_string(),
            mental_status: "yes".to_string(),
            airway: "yes".to_string(),
            breathing: "yes".to_string(),
            oxygen_therapy: "yes".to_string(),
            circulation: "yes".to_string(),
            transport_priority: "yes".to_string(),
        },
        history_secondary_assessment: HistorySecondaryAssessment {
            chief_complaint: "yes".to_string(),
            history_onset_opqrst: "yes".to_string(),
            sample_signs_symptoms: "yes".to_string(),
            sample_allergies: "yes".to_string(),
            sample_medications: "yes".to_string(),
            sample_past_history: "yes".to_string(),
            sample_last_intake: "yes".to_string(),
            sample_events: "yes".to_string(),
            focused_exam: "yes".to_string(),
            baseline_vitals_bp: "yes".to_string(),
            baseline_vitals_pulse: "yes".to_string(),
            baseline_vitals_respirations: "yes".to_string(),
            field_impression: "yes".to_string(),
            interventions: "yes".to_string(),
        },
        reassessment: Reassessment {
            repeats_mental_status: "yes".to_string(),
            repeats_airway: "yes".to_string(),
            repeats_breathing: "yes".to_string(),
            repeats_circulation: "yes".to_string(),
            repeats_vitals: "yes".to_string(),
            repeats_focused_exam: "yes".to_string(),
            evaluates_interventions: "yes".to_string(),
            transport_interventions: "yes".to_string(),
            fifteen_minute_call: "yes".to_string(),
        },
        critical_criteria_review: CriticalCriteriaReview {
            dangerous_intervention: "yes".to_string(),
            spinal_protection: "yes".to_string(),
            examiner_notes: String::new(),
            debrief_notes: String::new(),
        },
        ..AssessmentData::default()
    }
}

#[test]
fn passing_case_has_no_high_flags() {
    let result = grade(&fully_passing_case());
    let has_high = result.additional_flags.iter().any(|f| f.priority == "high");
    assert!(!has_high, "fully passing case should have no high flags");
}

#[test]
fn critical_failure_emits_high_priority_flag() {
    let mut data = fully_passing_case();
    data.primary_survey.airway = "no".to_string();
    let result = grade(&data);
    assert!(
        result
            .additional_flags
            .iter()
            .any(|f| f.id == "FLAG-CRIT-EMT-PS-AIRWAY" && f.priority == "high")
    );
}

#[test]
fn missing_general_impression_emits_high_flag() {
    let mut data = fully_passing_case();
    data.primary_survey.general_impression = "no".to_string();
    let result = grade(&data);
    assert!(
        result
            .additional_flags
            .iter()
            .any(|f| f.id == "FLAG-PS-IMPRESSION" && f.priority == "high")
    );
}

#[test]
fn examiner_notes_emits_low_flag() {
    let mut data = fully_passing_case();
    data.critical_criteria_review.examiner_notes = "Slow on the OPQRST".to_string();
    let result = grade(&data);
    assert!(
        result
            .additional_flags
            .iter()
            .any(|f| f.id == "FLAG-NOTE-EXAMINER" && f.priority == "low")
    );
}

#[test]
fn flags_sorted_by_priority() {
    let mut data = fully_passing_case();
    // Inject one high (critical fail), one medium (below threshold), one low (notes).
    data.primary_survey.airway = "no".to_string();
    data.critical_criteria_review.examiner_notes = "Debrief".to_string();
    let result = grade(&data);
    let priorities: Vec<&str> = result.additional_flags.iter().map(|f| f.priority.as_str()).collect();
    let mut sorted = priorities.clone();
    sorted.sort_by_key(|p| match *p {
        "high" => 0,
        "medium" => 1,
        "low" => 2,
        _ => 3,
    });
    assert_eq!(priorities, sorted);
}
