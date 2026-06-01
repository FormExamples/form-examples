use genetics_assessment_tera_crate::engine::genetics_grader::{
    calculate_manchester_score, count_bethesda_met, grade, run_rules,
};
use genetics_assessment_tera_crate::engine::genetics_rules::all_rules;
use genetics_assessment_tera_crate::engine::types::*;

fn empty() -> AssessmentData {
    AssessmentData::default()
}

#[test]
fn empty_assessment_is_low_risk() {
    let data = empty();
    let result = grade(&data);
    assert_eq!(result.risk_level, "low");
    assert_eq!(result.manchester_score, 0);
    assert_eq!(result.bethesda_met, 0);
}

#[test]
fn manchester_score_high_triggers_high_risk() {
    let mut data = empty();
    // 4 * 8 (relative ovarian under 60) = 32
    data.targeted_risk_scoring.manchester.relative_ovarian_under60 = Some(4);
    assert_eq!(calculate_manchester_score(&data), 32);
    let result = grade(&data);
    assert_eq!(result.risk_level, "high");
    assert!(result.fired_rules.iter().any(|r| r.id == "GEN-MAN-003"));
}

#[test]
fn manchester_score_moderate_band_15_19_fires_man001() {
    let mut data = empty();
    // 2 * 8 (relative ovarian under 60) = 16 — band 15..20
    data.targeted_risk_scoring.manchester.relative_ovarian_under60 = Some(2);
    let result = grade(&data);
    assert!(result.fired_rules.iter().any(|r| r.id == "GEN-MAN-001"));
    assert_eq!(result.risk_level, "moderate");
}

#[test]
fn bethesda_two_criteria_fires_high_rule() {
    let mut data = empty();
    data.targeted_risk_scoring.bethesda.crc_under50 = "yes".to_string();
    data.targeted_risk_scoring.bethesda.msi_histology = "yes".to_string();
    assert_eq!(count_bethesda_met(&data), 2);
    let (fired, level) = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "GEN-BET-001"));
    assert!(fired.iter().any(|r| r.id == "GEN-BET-002"));
    assert_eq!(level, "high");
}

#[test]
fn premm5_above_threshold_fires_high() {
    let mut data = empty();
    data.targeted_risk_scoring.premm5.external_premm5_percent = Some(6.5);
    let result = grade(&data);
    assert!(result.fired_rules.iter().any(|r| r.id == "GEN-PREMM5-001"));
    assert_eq!(result.risk_level, "high");
}

#[test]
fn tyrer_cuzick_moderate_band_fires_tc001() {
    let mut data = empty();
    data.targeted_risk_scoring.tyrer_cuzick.external_lifetime_risk = Some(20.0);
    let result = grade(&data);
    assert!(result.fired_rules.iter().any(|r| r.id == "GEN-TC-001"));
    assert_eq!(result.risk_level, "moderate");
}

#[test]
fn tyrer_cuzick_high_band_fires_tc002() {
    let mut data = empty();
    data.targeted_risk_scoring.tyrer_cuzick.external_lifetime_risk = Some(35.0);
    let result = grade(&data);
    assert!(result.fired_rules.iter().any(|r| r.id == "GEN-TC-002"));
    assert_eq!(result.risk_level, "high");
}

#[test]
fn multiple_primaries_in_proband_fires_high() {
    let mut data = empty();
    data.personal_medical_history.multiple_primary_cancers = "yes".to_string();
    let result = grade(&data);
    assert!(result.fired_rules.iter().any(|r| r.id == "GEN-TUM-005"));
    assert_eq!(result.risk_level, "high");
}

#[test]
fn bilateral_breast_in_proband_fires_high() {
    let mut data = empty();
    data.personal_medical_history.cancers.push(ProbandCancer {
        kind: "Breast".to_string(),
        age_at_diagnosis: Some(42),
        bilateral: "yes".to_string(),
        treatment: String::new(),
    });
    let result = grade(&data);
    assert!(result.fired_rules.iter().any(|r| r.id == "GEN-TUM-004"));
    assert_eq!(result.risk_level, "high");
}

#[test]
fn consanguinity_yes_fires_low_rule() {
    let mut data = empty();
    data.consanguinity_ancestry.consanguinity = "yes".to_string();
    let result = grade(&data);
    assert!(result.fired_rules.iter().any(|r| r.id == "GEN-ANC-002"));
}

#[test]
fn ashkenazi_with_family_ovarian_fires_anc001_moderate() {
    let mut data = empty();
    data.consanguinity_ancestry.ashkenazi_jewish = "yes".to_string();
    data.family_pedigree.mother.cancers.push(RelativeCancer {
        kind: "Ovarian".to_string(),
        age_at_diagnosis: Some(55),
    });
    data.family_pedigree.mother.affected_with_cancer = "yes".to_string();
    let result = grade(&data);
    assert!(result.fired_rules.iter().any(|r| r.id == "GEN-ANC-001"));
}

#[test]
fn suspected_syndrome_fires_syn001() {
    let mut data = empty();
    data.presenting_concern.suspected_syndrome = "Li-Fraumeni".to_string();
    let result = grade(&data);
    assert!(result.fired_rules.iter().any(|r| r.id == "GEN-SYN-001"));
    assert_eq!(result.risk_level, "moderate");
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
fn pediatric_cancer_fires_fam_004() {
    let mut data = empty();
    data.family_pedigree.siblings.push(Relative {
        id: "sib-1".to_string(),
        relation: "Sibling".to_string(),
        side: "self".to_string(),
        generation: 3,
        sex: "male".to_string(),
        name: "Sibling".to_string(),
        affected_with_cancer: "yes".to_string(),
        cancers: vec![RelativeCancer {
            kind: "Leukaemia".to_string(),
            age_at_diagnosis: Some(8),
        }],
        deceased: "no".to_string(),
        age_at_death: None,
        cause_of_death: String::new(),
        notes: String::new(),
    });
    let result = grade(&data);
    assert!(result.fired_rules.iter().any(|r| r.id == "GEN-FAM-004"));
    assert_eq!(result.risk_level, "high");
}
