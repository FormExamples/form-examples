use anesthesiology_assessment_tera_crate::engine::flagged_issues::detect_additional_flags;
use anesthesiology_assessment_tera_crate::engine::types::*;

#[test]
fn baseline_has_no_flags() {
    let data = AssessmentData::default();
    let flags = detect_additional_flags(&data);
    assert!(flags.is_empty(), "baseline should not produce flags: {flags:?}");
}

#[test]
fn latex_allergy_emits_high_flag() {
    let mut data = AssessmentData::default();
    data.allergies.latex_allergy = "yes".to_string();
    let flags = detect_additional_flags(&data);
    let flag = flags.iter().find(|f| f.id == "FLAG-LATEX").expect("latex flag");
    assert_eq!(flag.priority, "high");
}

#[test]
fn anaphylaxis_in_allergy_list_is_urgent() {
    let mut data = AssessmentData::default();
    data.allergies.list.push(Allergy {
        allergen: "Penicillin".to_string(),
        allergy_type: "drug".to_string(),
        reaction: "rash".to_string(),
        severity: "anaphylaxis".to_string(),
    });
    let flags = detect_additional_flags(&data);
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-ANAPH-0")
        .expect("anaphylaxis flag");
    assert_eq!(flag.priority, "urgent");
    assert!(flag.message.contains("Penicillin"));
}

#[test]
fn three_or_more_allergies_emit_multi_flag() {
    let mut data = AssessmentData::default();
    for i in 0..3 {
        data.allergies.list.push(Allergy {
            allergen: format!("Allergen-{i}"),
            severity: "mild".to_string(),
            ..Allergy::default()
        });
    }
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-MULTI-ALLERGY"));
}

#[test]
fn malignant_hyperthermia_personal_emits_flag() {
    let mut data = AssessmentData::default();
    data.previous_anaesthesia.malignant_hyperthermia = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-MH" && f.priority == "high"));
}

#[test]
fn anticoagulants_emit_high_flag() {
    let mut data = AssessmentData::default();
    data.medications.on_anticoagulants = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-ANTICOAG" && f.priority == "high"));
}

#[test]
fn maois_emit_high_flag() {
    let mut data = AssessmentData::default();
    data.medications.on_maois = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-MAOI" && f.priority == "high"));
}

#[test]
fn difficult_airway_history_emits_flag() {
    let mut data = AssessmentData::default();
    data.previous_anaesthesia.difficult_intubation = true;
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-DIFF-AIRWAY" && f.priority == "high"));
}

#[test]
fn gord_emits_medium_flag() {
    let mut data = AssessmentData::default();
    data.medical_history.gord = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-GORD" && f.priority == "medium"));
}

#[test]
fn pregnancy_emits_high_flag() {
    let mut data = AssessmentData::default();
    data.social_history.pregnancy_status = "pregnant".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-PREGNANT" && f.priority == "high"));
}

#[test]
fn uncontrolled_hypertension_emits_flag() {
    let mut data = AssessmentData::default();
    data.vital_signs.systolic_bp = Some(190);
    data.vital_signs.diastolic_bp = Some(95);
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-HYPERTENSION" && f.priority == "high"));
}

#[test]
fn hypoxia_emits_flag() {
    let mut data = AssessmentData::default();
    data.vital_signs.spo2 = Some(90);
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-HYPOXIA" && f.priority == "high"));
}

#[test]
fn morbid_obesity_emits_medium_flag() {
    let mut data = AssessmentData::default();
    data.vital_signs.bmi = Some(45.0);
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-MORBID-OBESITY" && f.priority == "medium"));
}

#[test]
fn obesity_emits_low_flag() {
    let mut data = AssessmentData::default();
    data.vital_signs.bmi = Some(36.0);
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-OBESITY" && f.priority == "low"));
}

#[test]
fn flags_sorted_urgent_first() {
    let mut data = AssessmentData::default();
    // urgent + high + medium + low all together
    data.allergies.list.push(Allergy {
        allergen: "Peanut".to_string(),
        severity: "anaphylaxis".to_string(),
        ..Allergy::default()
    });
    data.medications.on_anticoagulants = "yes".to_string();
    data.medical_history.gord = "yes".to_string();
    data.social_history.smoking = "current".to_string();
    let flags = detect_additional_flags(&data);
    let priorities: Vec<&str> = flags.iter().map(|f| f.priority.as_str()).collect();
    let order = |p: &str| match p {
        "urgent" => 0,
        "high" => 1,
        "medium" => 2,
        "low" => 3,
        _ => 4,
    };
    for w in priorities.windows(2) {
        assert!(order(w[0]) <= order(w[1]), "flags not sorted: {priorities:?}");
    }
}
