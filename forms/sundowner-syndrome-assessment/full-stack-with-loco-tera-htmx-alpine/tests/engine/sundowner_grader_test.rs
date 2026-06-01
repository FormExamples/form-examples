use sundowner_syndrome_assessment_tera_crate::engine::sundowner_grader::grade;
use sundowner_syndrome_assessment_tera_crate::engine::types::*;

/// Build a CMAI map with every item explicitly set.
fn cmai_all(score: i32) -> std::collections::BTreeMap<String, i32> {
    let mut m = std::collections::BTreeMap::new();
    for i in 1..=29 {
        m.insert(format!("cmai{:02}", i), score);
    }
    m
}

#[test]
fn empty_assessment_is_mild() {
    let data = AssessmentData::default();
    let result = grade(&data);
    // With no answers, all 29 items count as 1 -> CMAI = 29 -> mild.
    assert_eq!(result.cmai_score, 29);
    assert_eq!(result.severity, "mild");
    assert_eq!(result.cmai_answered_count, 0);
    assert_eq!(result.npi_score, 0);
}

#[test]
fn cmai_all_ones_is_mild() {
    let mut data = AssessmentData::default();
    data.behavioural_symptoms.cmai = cmai_all(1);
    let result = grade(&data);
    assert_eq!(result.cmai_score, 29);
    assert_eq!(result.severity, "mild");
    assert_eq!(result.cmai_answered_count, 29);
}

#[test]
fn cmai_band_moderate() {
    let mut data = AssessmentData::default();
    // All items rated 2 -> total = 58 -> moderate.
    data.behavioural_symptoms.cmai = cmai_all(2);
    let result = grade(&data);
    assert_eq!(result.cmai_score, 58);
    assert_eq!(result.severity, "moderate");
}

#[test]
fn cmai_band_severe() {
    let mut data = AssessmentData::default();
    // All items rated 3 -> total = 87 -> severe.
    data.behavioural_symptoms.cmai = cmai_all(3);
    let result = grade(&data);
    assert_eq!(result.cmai_score, 87);
    assert_eq!(result.severity, "severe");
}

#[test]
fn cmai_band_critical() {
    let mut data = AssessmentData::default();
    // All items rated 5 -> total = 145 -> critical.
    data.behavioural_symptoms.cmai = cmai_all(5);
    let result = grade(&data);
    assert_eq!(result.cmai_score, 145);
    assert_eq!(result.severity, "critical");
}

#[test]
fn cmai_band_rule_always_fires() {
    let data = AssessmentData::default();
    let result = grade(&data);
    assert!(result.fired_rules.iter().any(|r| r.id == "CMAI-BAND"));
    assert!(result.fired_rules.iter().any(|r| r.id == "NPI-TOTAL"));
}

#[test]
fn cmai_daily_rule_fires_for_high_scores() {
    let mut data = AssessmentData::default();
    // Rate item 1 (pacing) and item 7 (hitting) at 5 (daily).
    data.behavioural_symptoms.cmai.insert("cmai01".to_string(), 5);
    data.behavioural_symptoms.cmai.insert("cmai07".to_string(), 6);
    let result = grade(&data);
    assert!(result.fired_rules.iter().any(|r| r.id == "CMAI-DAILY"));
}

#[test]
fn npi_total_summed_correctly() {
    let mut data = AssessmentData::default();
    data.behavioural_symptoms.npi.insert(
        "delusions".to_string(),
        NpiDomainScore { frequency: 3, severity: 2 },
    );
    data.behavioural_symptoms.npi.insert(
        "anxiety".to_string(),
        NpiDomainScore { frequency: 4, severity: 3 },
    );
    let result = grade(&data);
    // delusions 6 + anxiety 12 = 18
    assert_eq!(result.npi_score, 18);
    assert_eq!(result.npi_answered_count, 2);
}

#[test]
fn npi_domains_rule_fires_when_score_ge_4() {
    let mut data = AssessmentData::default();
    data.behavioural_symptoms.npi.insert(
        "agitationAggression".to_string(),
        NpiDomainScore { frequency: 2, severity: 2 },
    );
    let result = grade(&data);
    assert!(result.fired_rules.iter().any(|r| r.id == "NPI-DOMAINS"));
}

#[test]
fn invalid_npi_range_scores_zero() {
    let mut data = AssessmentData::default();
    // Out-of-range values must score 0.
    data.behavioural_symptoms.npi.insert(
        "delusions".to_string(),
        NpiDomainScore { frequency: 5, severity: 4 },
    );
    let result = grade(&data);
    assert_eq!(result.npi_score, 0);
}

#[test]
fn rule_ids_are_unique_per_assessment() {
    let mut data = AssessmentData::default();
    data.behavioural_symptoms.cmai.insert("cmai01".to_string(), 5);
    data.behavioural_symptoms.npi.insert(
        "anxiety".to_string(),
        NpiDomainScore { frequency: 2, severity: 2 },
    );
    let result = grade(&data);
    let mut ids: Vec<&str> = result.fired_rules.iter().map(|r| r.id.as_str()).collect();
    ids.sort();
    let len_before = ids.len();
    ids.dedup();
    assert_eq!(ids.len(), len_before, "fired rule IDs must be unique");
}
