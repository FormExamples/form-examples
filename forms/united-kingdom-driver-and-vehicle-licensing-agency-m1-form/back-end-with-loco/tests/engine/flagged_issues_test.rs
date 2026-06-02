use united_kingdom_driver_and_vehicle_licensing_agency_m1_form_loco_crate::engine::flagged_issues::detect_additional_flags;
use united_kingdom_driver_and_vehicle_licensing_agency_m1_form_loco_crate::engine::types::*;

/// Baseline: Q1=yes, one benign condition, declaration confirmed, recent contact yes.
fn baseline() -> AssessmentData {
    AssessmentData {
        diagnosis_confirmation: DiagnosisConfirmation {
            has_mental_health_diagnosis: "yes".to_string(),
        },
        mental_health_conditions: MentalHealthConditions {
            anxiety_depression_without_impairment: "yes".to_string(),
            ..MentalHealthConditions::default()
        },
        recent_contact: RecentContact {
            had_recent_contact: "yes".to_string(),
            doctor_last_date: "2026-04-01".to_string(),
            ..RecentContact::default()
        },
        authorisation: Authorisation {
            declaration_confirmed: "yes".to_string(),
            ..Authorisation::default()
        },
        ..AssessmentData::default()
    }
}

#[test]
fn baseline_has_no_flags() {
    let flags = detect_additional_flags(&baseline());
    assert!(flags.is_empty(), "baseline should have no flags: {flags:?}");
}

#[test]
fn suicidal_thoughts_variant_emits_urgent_flag() {
    let mut data = baseline();
    data.mental_health_conditions.anxiety_depression_with_impairment = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-MH-URGENT-001" && f.priority == "urgent")
    );
}

#[test]
fn psychotic_spectrum_emits_high_flag() {
    let mut data = baseline();
    data.mental_health_conditions.schizophrenia_or_psychosis = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-MH-HIGH-001" && f.priority == "high")
    );
}

#[test]
fn bipolar_plus_personality_emits_combo_flag() {
    let mut data = baseline();
    data.mental_health_conditions.bipolar_affective_disorder = "yes".to_string();
    data.mental_health_conditions.personality_disorder = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-MH-HIGH-002" && f.priority == "high")
    );
    // The single-condition flags should NOT fire when combined.
    assert!(!flags.iter().any(|f| f.id == "FLAG-MH-MED-001"));
    assert!(!flags.iter().any(|f| f.id == "FLAG-MH-MED-002"));
}

#[test]
fn bipolar_alone_emits_medium_flag() {
    let mut data = baseline();
    data.mental_health_conditions.bipolar_affective_disorder = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-MH-MED-001" && f.priority == "medium")
    );
}

#[test]
fn personality_alone_emits_medium_flag() {
    let mut data = baseline();
    data.mental_health_conditions.personality_disorder = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-MH-MED-002" && f.priority == "medium")
    );
}

#[test]
fn ocd_or_ptsd_emits_medium_flag() {
    let mut data = baseline();
    data.mental_health_conditions.ocd_or_ptsd = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-MH-MED-003" && f.priority == "medium")
    );
}

#[test]
fn no_recent_contact_emits_medium_flag() {
    let mut data = baseline();
    data.recent_contact.had_recent_contact = "no".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-CONTACT-MED-001" && f.priority == "medium")
    );
}

#[test]
fn three_or_more_conditions_emits_comorbidity_flag() {
    let mut data = baseline();
    data.mental_health_conditions.bipolar_affective_disorder = "yes".to_string();
    data.mental_health_conditions.eating_disorder = "yes".to_string();
    // baseline already has anxiety_depression_without_impairment = yes (1)
    // plus bipolar (2), plus eating_disorder (3) => triggers comorbidity flag.
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-MULTI-MED-001" && f.priority == "medium")
    );
}

#[test]
fn q1_no_emits_low_informational_flag() {
    let mut data = baseline();
    data.diagnosis_confirmation.has_mental_health_diagnosis = "no".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-NO-DIAGNOSIS-LOW-001" && f.priority == "low")
    );
}

#[test]
fn declaration_not_confirmed_emits_high_flag() {
    let mut data = baseline();
    data.authorisation.declaration_confirmed = "no".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-AUTH-LOW-001" && f.priority == "high")
    );
}

#[test]
fn flags_are_sorted_by_priority() {
    let mut data = baseline();
    data.mental_health_conditions.anxiety_depression_with_impairment = "yes".to_string();
    data.mental_health_conditions.schizophrenia_or_psychosis = "yes".to_string();
    data.mental_health_conditions.ocd_or_ptsd = "yes".to_string();
    data.authorisation.declaration_confirmed = "no".to_string();
    let flags = detect_additional_flags(&data);
    let priorities: Vec<&str> = flags.iter().map(|f| f.priority.as_str()).collect();
    let mut sorted = priorities.clone();
    sorted.sort_by_key(|p| match *p {
        "urgent" => 0,
        "high" => 1,
        "medium" => 2,
        "low" => 3,
        _ => 99,
    });
    assert_eq!(priorities, sorted);
}
