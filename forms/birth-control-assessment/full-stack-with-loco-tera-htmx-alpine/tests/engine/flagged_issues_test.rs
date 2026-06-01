use birth_control_assessment_tera_crate::engine::flagged_issues::detect_additional_flags;
use birth_control_assessment_tera_crate::engine::types::*;

fn baseline_patient() -> AssessmentData {
    AssessmentData {
        demographics: Demographics {
            date_of_birth: "1995-03-15".to_string(),
            sex: "female".to_string(),
            bmi: Some(23.9),
            ..Default::default()
        },
        medical_history: MedicalHistory {
            migraine: "no".to_string(),
            breast_cancer: "no".to_string(),
            liver_disease: "no".to_string(),
            sle: "no".to_string(),
            diabetes: "no".to_string(),
            sti: "no".to_string(),
            ..Default::default()
        },
        cardiovascular_risk: CardiovascularRisk {
            systolic_bp: Some(120),
            diastolic_bp: Some(75),
            ischaemic_heart_disease: "no".to_string(),
            stroke_history: "no".to_string(),
            ..Default::default()
        },
        thromboembolism_risk: ThromboembolismRisk {
            previous_dvt: "no".to_string(),
            previous_pe: "no".to_string(),
            known_thrombophilia: "no".to_string(),
            ..Default::default()
        },
        current_medications: CurrentMedications {
            enzyme_inducing_drugs: "no".to_string(),
            herbal_remedies: "no".to_string(),
            drug_allergies: "no".to_string(),
            ..Default::default()
        },
        lifestyle_assessment: LifestyleAssessment {
            smoking: "never".to_string(),
            ..Default::default()
        },
        contraceptive_preferences: ContraceptivePreferences {
            breastfeeding: "no".to_string(),
            ..Default::default()
        },
        ..Default::default()
    }
}

#[test]
fn baseline_has_no_flags() {
    let flags = detect_additional_flags(&baseline_patient());
    assert!(flags.is_empty(), "baseline should not produce flags: {flags:?}");
}

#[test]
fn previous_dvt_emits_high_priority_flag() {
    let mut data = baseline_patient();
    data.thromboembolism_risk.previous_dvt = "yes".to_string();
    data.thromboembolism_risk.dvt_details = "DVT right leg 2023".to_string();
    let flags = detect_additional_flags(&data);
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-DVT-001")
        .expect("DVT flag");
    assert_eq!(flag.priority, "high");
    assert!(flag.message.contains("DVT right leg 2023"));
}

#[test]
fn migraine_with_aura_emits_high_priority_flag() {
    let mut data = baseline_patient();
    data.medical_history.migraine = "yes".to_string();
    data.medical_history.migraine_with_aura = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags
        .iter()
        .any(|f| f.id == "FLAG-MIGRAINE-001" && f.priority == "high"));
}

#[test]
fn current_breast_cancer_emits_high_priority_flag() {
    let mut data = baseline_patient();
    data.medical_history.breast_cancer = "current".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags
        .iter()
        .any(|f| f.id == "FLAG-BRCA-001" && f.priority == "high"));
}

#[test]
fn severe_hypertension_emits_high_priority_flag() {
    let mut data = baseline_patient();
    data.cardiovascular_risk.systolic_bp = Some(170);
    data.cardiovascular_risk.diastolic_bp = Some(105);
    let flags = detect_additional_flags(&data);
    assert!(flags
        .iter()
        .any(|f| f.id == "FLAG-BP-001" && f.priority == "high"));
}

#[test]
fn enzyme_inducing_drugs_emits_medium_priority_flag() {
    let mut data = baseline_patient();
    data.current_medications.enzyme_inducing_drugs = "yes".to_string();
    data.current_medications.enzyme_inducing_details = "Carbamazepine".to_string();
    let flags = detect_additional_flags(&data);
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-ENZYME-001")
        .expect("enzyme flag");
    assert_eq!(flag.priority, "medium");
}

#[test]
fn breastfeeding_under_6_weeks_emits_high_priority_flag() {
    let mut data = baseline_patient();
    data.contraceptive_preferences.breastfeeding = "yes".to_string();
    data.contraceptive_preferences.postpartum_weeks = Some(3);
    let flags = detect_additional_flags(&data);
    assert!(flags
        .iter()
        .any(|f| f.id == "FLAG-BF-001" && f.priority == "high"));
}

#[test]
fn flags_are_sorted_by_priority() {
    let mut data = baseline_patient();
    data.thromboembolism_risk.previous_dvt = "yes".to_string();
    data.current_medications.enzyme_inducing_drugs = "yes".to_string();
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
