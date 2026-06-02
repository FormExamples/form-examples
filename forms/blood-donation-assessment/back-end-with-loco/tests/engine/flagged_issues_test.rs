use blood_donation_assessment_loco_crate::engine::flagged_issues::detect_additional_flags;
use blood_donation_assessment_loco_crate::engine::types::*;

fn baseline_donor() -> AssessmentData {
    AssessmentData {
        donor_demographics: DonorDemographics {
            date_of_birth: "1990-01-01".to_string(),
            sex: "male".to_string(),
            weight: Some(80.0),
            donor_type: "regular".to_string(),
            ..DonorDemographics::default()
        },
        general_health: GeneralHealth {
            feeling_well_today: "yes".to_string(),
            adequate_sleep: "yes".to_string(),
            adequate_meal_and_fluids: "yes".to_string(),
            feeling_faint_or_unwell: "no".to_string(),
        },
        informed_consent: InformedConsent {
            understood_information: "yes".to_string(),
            consent_to_donate: "yes".to_string(),
            consent_to_testing: "yes".to_string(),
            consent_to_contact: "yes".to_string(),
        },
        vital_signs: VitalSigns {
            hemoglobin: Some(14.5),
            systolic_bp: Some(120),
            diastolic_bp: Some(75),
            pulse_bpm: Some(70),
            temperature_celsius: Some(36.6),
        },
        ..AssessmentData::default()
    }
}

#[test]
fn baseline_has_no_flags() {
    let flags = detect_additional_flags(&baseline_donor());
    assert!(flags.is_empty(), "baseline should not produce flags: {flags:?}");
}

#[test]
fn feeling_faint_is_urgent() {
    let mut data = baseline_donor();
    data.general_health.feeling_faint_or_unwell = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-HEALTH-001" && f.priority == "urgent")
    );
}

#[test]
fn known_tti_is_urgent_flag() {
    let mut data = baseline_donor();
    data.medical_history.hiv_positive = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-MED-INF-001" && f.priority == "urgent")
    );
}

#[test]
fn low_haemoglobin_is_high_priority() {
    let mut data = baseline_donor();
    data.vital_signs.hemoglobin = Some(11.0);
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-VITAL-HB-001" && f.priority == "high")
    );
}

#[test]
fn borderline_haemoglobin_is_low_priority() {
    let mut data = baseline_donor();
    data.vital_signs.hemoglobin = Some(13.7);
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-VITAL-HB-002" && f.priority == "low")
    );
}

#[test]
fn flags_are_sorted_by_priority() {
    let mut data = baseline_donor();
    // urgent
    data.informed_consent.consent_to_testing = "no".to_string();
    // high
    data.medical_history.cancer = "yes".to_string();
    // medium
    data.medical_history.diabetes_on_insulin = "yes".to_string();
    // low
    data.vital_signs.hemoglobin = Some(13.7);
    let flags = detect_additional_flags(&data);
    let priorities: Vec<&str> = flags.iter().map(|f| f.priority.as_str()).collect();
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

#[test]
fn pregnancy_is_urgent() {
    let mut data = baseline_donor();
    data.pregnancy_transfusion.currently_pregnant = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-PREG-001" && f.priority == "urgent")
    );
}

#[test]
fn travel_transfusion_in_uk_is_urgent() {
    let mut data = baseline_donor();
    data.travel_history.blood_transfusion_in_uk = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-TRAVEL-TX-001" && f.priority == "urgent")
    );
}
