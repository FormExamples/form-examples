use fertility_assessment_loco_crate::engine::flagged_issues::detect_additional_flags;
use fertility_assessment_loco_crate::engine::types::*;

#[test]
fn empty_assessment_still_flags_missing_semen_and_folic_acid() {
    let data = AssessmentData::default();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-SEM-000"));
    assert!(flags.iter().any(|f| f.id == "FLAG-SUPP-001"));
}

#[test]
fn amenorrhoea_raises_high_priority_flag() {
    let mut data = AssessmentData::default();
    data.menstrual_cycle.cycle_regularity = "absent".to_string();
    let flags = detect_additional_flags(&data);
    let f = flags.iter().find(|f| f.id == "FLAG-CYC-001").unwrap();
    assert_eq!(f.priority, "high");
}

#[test]
fn severe_oligozoospermia_is_urgent() {
    let mut data = AssessmentData::default();
    data.partner_semen.semen_analysis_done = "yes".to_string();
    data.partner_semen.semen_concentration_million_per_ml = Some(2.0);
    let flags = detect_additional_flags(&data);
    let f = flags.iter().find(|f| f.id == "FLAG-SEM-001").unwrap();
    assert_eq!(f.priority, "urgent");
}

#[test]
fn flags_sort_urgent_first() {
    let mut data = AssessmentData::default();
    data.partner_semen.semen_analysis_done = "yes".to_string();
    data.partner_semen.semen_concentration_million_per_ml = Some(2.0);
    data.menstrual_cycle.cycle_regularity = "absent".to_string();
    let flags = detect_additional_flags(&data);
    // First flag should be urgent (FLAG-SEM-001).
    let first = flags.first().expect("at least one flag");
    assert_eq!(first.priority, "urgent");
}

#[test]
fn high_bmi_flags_lifestyle() {
    let mut data = AssessmentData::default();
    data.lifestyle_factors.bmi = Some(38.0);
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-BMI-001"));
}

#[test]
fn cancer_history_raises_high_flag() {
    let mut data = AssessmentData::default();
    data.medical_surgical_history.cancer_history = "yes".to_string();
    let flags = detect_additional_flags(&data);
    let f = flags.iter().find(|f| f.id == "FLAG-CAN-001").unwrap();
    assert_eq!(f.priority, "high");
}
