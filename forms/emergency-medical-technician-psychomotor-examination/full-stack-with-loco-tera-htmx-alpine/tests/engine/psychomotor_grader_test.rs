use emergency_medical_technician_psychomotor_examination_tera_crate::engine::psychomotor_grader::grade;
use emergency_medical_technician_psychomotor_examination_tera_crate::engine::rules::all_rules;
use emergency_medical_technician_psychomotor_examination_tera_crate::engine::types::*;

/// Build a fully passing case: every scored item answered "yes".
fn fully_passing_case() -> AssessmentData {
    AssessmentData {
        candidate_examiner_scenario: CandidateExaminerScenario {
            candidate_first_name: "Jane".to_string(),
            candidate_last_name: "Doe".to_string(),
            candidate_id: "C-001".to_string(),
            attempt: "first-attempt".to_string(),
            examiner_name: "Examiner Smith".to_string(),
            session_date: "2026-06-01".to_string(),
            station_location: "Station 1".to_string(),
            scenario_summary: "Chest pain, 58yo male".to_string(),
            chief_complaint_given: "Chest pain".to_string(),
        },
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
    }
}

#[test]
fn empty_case_is_fail() {
    let data = AssessmentData::default();
    let result = grade(&data);
    assert_eq!(result.outcome, "fail");
    assert_eq!(result.points, 0);
    assert_eq!(result.answered_count, 0);
}

#[test]
fn fully_passing_case_is_pass() {
    let data = fully_passing_case();
    let result = grade(&data);
    assert_eq!(result.outcome, "pass");
    assert_eq!(result.percent.round() as u32, 100);
    assert!(result.critical_failures.is_empty());
}

#[test]
fn critical_failure_forces_fail() {
    let mut data = fully_passing_case();
    data.primary_survey.airway = "no".to_string();
    let result = grade(&data);
    assert_eq!(result.outcome, "fail");
    assert!(
        result
            .critical_failures
            .iter()
            .any(|r| r.id == "EMT-PS-AIRWAY")
    );
}

#[test]
fn non_critical_below_threshold_is_fail() {
    let mut data = fully_passing_case();
    // Flip enough non-critical items to "no" to drop below 80%.
    data.history_secondary_assessment.sample_signs_symptoms = "no".to_string();
    data.history_secondary_assessment.sample_allergies = "no".to_string();
    data.history_secondary_assessment.sample_medications = "no".to_string();
    data.history_secondary_assessment.sample_past_history = "no".to_string();
    data.history_secondary_assessment.sample_last_intake = "no".to_string();
    data.history_secondary_assessment.sample_events = "no".to_string();
    data.history_secondary_assessment.focused_exam = "no".to_string();
    data.history_secondary_assessment.field_impression = "no".to_string();
    data.history_secondary_assessment.interventions = "no".to_string();
    let result = grade(&data);
    assert_eq!(result.outcome, "fail");
    assert!(result.critical_failures.is_empty());
}

#[test]
fn na_items_are_excluded_from_score() {
    let mut data = fully_passing_case();
    // Mark a non-critical item as NA — should not affect percent.
    data.history_secondary_assessment.sample_last_intake = "na".to_string();
    let result = grade(&data);
    assert_eq!(result.outcome, "pass");
    // With one item excluded, max_points should be 1 less than the all-yes case.
    let baseline = grade(&fully_passing_case());
    assert!(result.max_points < baseline.max_points);
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
fn critical_rule_ids_match_registry() {
    let rules = all_rules();
    let critical_ids: Vec<&str> = rules
        .iter()
        .filter(|r| r.critical)
        .map(|r| r.id)
        .collect();
    let expected = [
        "EMT-SS-PPE",
        "EMT-SS-SAFE",
        "EMT-PS-AIRWAY",
        "EMT-PS-BREATHING",
        "EMT-PS-OXYGEN",
        "EMT-PS-CIRCULATION",
        "EMT-PS-TRANSPORT",
        "EMT-RA-FIFTEEN-MIN",
        "EMT-CC-DANGEROUS",
        "EMT-CC-SPINAL",
    ];
    for id in &expected {
        assert!(critical_ids.contains(id), "missing critical id {id}");
    }
}
