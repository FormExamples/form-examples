use plastic_surgery_assessment_loco_crate::engine::flagged_issues::detect_additional_flags;
use plastic_surgery_assessment_loco_crate::engine::types::*;

#[test]
fn empty_case_has_no_flags() {
    let flags = detect_additional_flags(&AssessmentData::default());
    assert!(flags.is_empty(), "empty case should not produce flags: {flags:?}");
}

#[test]
fn emergency_referral_emits_high_flag() {
    let mut data = AssessmentData::default();
    data.reason_for_referral.urgency = "emergency".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-EMERG-001" && f.priority == "high"));
}

#[test]
fn body_dysmorphic_concern_emits_high_flag() {
    let mut data = AssessmentData::default();
    data.psychological_assessment.body_dysmorphic_concern = "yes".to_string();
    data.psychological_assessment.body_dysmorphic_details = "Excessive focus on nose shape".to_string();
    let flags = detect_additional_flags(&data);
    let flag = flags.iter().find(|f| f.id == "FLAG-BDD-001").expect("BDD flag");
    assert_eq!(flag.priority, "high");
    assert!(flag.message.contains("Excessive focus on nose shape"));
}

#[test]
fn difficult_airway_emits_high_flag() {
    let mut data = AssessmentData::default();
    data.anaesthetic_risk.difficult_airway = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-AIRWAY-001" && f.priority == "high"));
}

#[test]
fn malignant_hyperthermia_emits_high_flag() {
    let mut data = AssessmentData::default();
    data.anaesthetic_risk.malignant_hyperthermia_risk = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-MH-001" && f.priority == "high"));
}

#[test]
fn asa_v_emits_high_flag() {
    let mut data = AssessmentData::default();
    data.anaesthetic_risk.asa_class = "5".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-ASA-001" && f.priority == "high"));
}

#[test]
fn dirty_wound_emits_high_flag() {
    let mut data = AssessmentData::default();
    data.wound_tissue_assessment.wound_classification = "dirty".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-WOUND-001" && f.priority == "high"));
}

#[test]
fn anaphylaxis_allergy_emits_high_flag() {
    let mut data = AssessmentData::default();
    data.medications_allergies.allergies.push(Allergy {
        allergen: "Penicillin".to_string(),
        reaction: "Throat swelling".to_string(),
        severity: "anaphylaxis".to_string(),
    });
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-ALLERGY-ANAPH-0" && f.priority == "high")
    );
}

#[test]
fn latex_allergy_emits_medium_flag() {
    let mut data = AssessmentData::default();
    data.medications_allergies.latex_allergy = "yes".to_string();
    let flags = detect_additional_flags(&data);
    let flag = flags.iter().find(|f| f.id == "FLAG-LATEX-001").expect("latex flag");
    assert_eq!(flag.priority, "medium");
}

#[test]
fn high_vte_risk_emits_medium_flag() {
    let mut data = AssessmentData::default();
    data.procedure_planning_consent.vte_risk = "high".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-VTE-001" && f.priority == "medium"));
}

#[test]
fn flags_are_sorted_by_priority() {
    let mut data = AssessmentData::default();
    // High: emergency referral; Medium: latex allergy.
    data.reason_for_referral.urgency = "emergency".to_string();
    data.medications_allergies.latex_allergy = "yes".to_string();
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
