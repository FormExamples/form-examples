use audio_vestibular_assessment_tera_crate::engine::audio_vestibular_grader::grade;
use audio_vestibular_assessment_tera_crate::engine::types::*;

fn ear(v: f64) -> EarThresholds {
    EarThresholds {
        hz500: Some(v),
        hz1000: Some(v),
        hz2000: Some(v),
        hz4000: Some(v),
    }
}

#[test]
fn sudden_hearing_loss_is_urgent_flag() {
    let mut data = AssessmentData::default();
    data.presenting_symptoms.hearing_loss = "yes".to_string();
    data.presenting_symptoms.hearing_loss_onset = "sudden".to_string();
    let res = grade(&data);
    assert!(
        res.additional_flags
            .iter()
            .any(|f| f.id == "FLAG-RED-001" && f.priority == "urgent")
    );
}

#[test]
fn neurological_symptoms_emit_urgent_flag() {
    let mut data = AssessmentData::default();
    data.presenting_symptoms.neurological_symptoms = "yes".to_string();
    let res = grade(&data);
    assert!(
        res.additional_flags
            .iter()
            .any(|f| f.id == "FLAG-RED-002" && f.priority == "urgent")
    );
}

#[test]
fn asymmetric_pta_emits_high_flag() {
    let mut data = AssessmentData::default();
    data.pure_tone_audiometry.right_ear.air_conduction = ear(10.0);
    data.pure_tone_audiometry.left_ear.air_conduction = ear(35.0);
    let res = grade(&data);
    assert!(
        res.additional_flags
            .iter()
            .any(|f| f.id == "FLAG-PTA-001" && f.priority == "high")
    );
}

#[test]
fn profound_hearing_loss_recommends_cochlear_implant() {
    let mut data = AssessmentData::default();
    data.pure_tone_audiometry.right_ear.air_conduction = ear(90.0);
    data.pure_tone_audiometry.left_ear.air_conduction = ear(90.0);
    let res = grade(&data);
    assert_eq!(res.hearing_loss_grade, "profound");
    assert!(
        res.additional_flags
            .iter()
            .any(|f| f.id == "FLAG-PTA-002" && f.priority == "high")
    );
}

#[test]
fn poor_word_recognition_emits_high_flag() {
    let mut data = AssessmentData::default();
    data.speech_audiometry.right_word_recognition_percent = Some(40.0);
    let res = grade(&data);
    assert!(
        res.additional_flags
            .iter()
            .any(|f| f.id == "FLAG-SPEECH-R-001" && f.priority == "high")
    );
}

#[test]
fn type_b_tympanogram_emits_medium_flag() {
    let mut data = AssessmentData::default();
    data.tympanometry_acoustic_reflexes.right_tympanogram = "B".to_string();
    let res = grade(&data);
    assert!(
        res.additional_flags
            .iter()
            .any(|f| f.id == "FLAG-TYMP-R-001" && f.priority == "medium")
    );
}

#[test]
fn positive_dix_hallpike_flags_bppv() {
    let mut data = AssessmentData::default();
    data.vestibular_screening.dix_hallpike = "positive-right".to_string();
    let res = grade(&data);
    assert!(res.additional_flags.iter().any(|f| f.id == "FLAG-VEST-001"));
}

#[test]
fn multiple_falls_emit_high_flag() {
    let mut data = AssessmentData::default();
    data.presenting_symptoms.falls = "yes".to_string();
    data.presenting_symptoms.falls_last_year_count = Some(3);
    let res = grade(&data);
    assert!(
        res.additional_flags
            .iter()
            .any(|f| f.id == "FLAG-FALL-001" && f.priority == "high")
    );
}

#[test]
fn meniere_triad_emits_medium_flag() {
    let mut data = AssessmentData::default();
    data.presenting_symptoms.hearing_loss_onset = "fluctuating".to_string();
    data.presenting_symptoms.vertigo = "yes".to_string();
    data.presenting_symptoms.tinnitus = "yes".to_string();
    let res = grade(&data);
    assert!(res.additional_flags.iter().any(|f| f.id == "FLAG-MEN-001"));
}

#[test]
fn flags_are_sorted_by_priority() {
    let mut data = AssessmentData::default();
    // urgent
    data.presenting_symptoms.hearing_loss = "yes".to_string();
    data.presenting_symptoms.hearing_loss_onset = "sudden".to_string();
    // high (asymmetry)
    data.pure_tone_audiometry.right_ear.air_conduction = ear(10.0);
    data.pure_tone_audiometry.left_ear.air_conduction = ear(35.0);
    // medium (BPPV)
    data.vestibular_screening.dix_hallpike = "positive-left".to_string();
    // low (tinnitus)
    data.presenting_symptoms.tinnitus = "yes".to_string();
    let res = grade(&data);
    let priorities: Vec<&str> = res
        .additional_flags
        .iter()
        .map(|f| f.priority.as_str())
        .collect();
    let mut sorted = priorities.clone();
    sorted.sort_by_key(|p| match *p {
        "urgent" => 0,
        "high" => 1,
        "medium" => 2,
        "low" => 3,
        _ => 4,
    });
    assert_eq!(priorities, sorted);
}
