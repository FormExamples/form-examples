//! Stopbang rules module.

// STOP-BANG OSA screening — 8 yes/no items, sum 0-8.
//
// SB-S  Snoring loudly        (Step 7 social-history)
// SB-T  Tired during day      (Step 7 social-history)
// SB-O  Observed apnea        (Step 7 social-history)
// SB-P  Pressure (HTN)        (Step 3 medical history)
// SB-B  BMI >35               (Step 8 vital signs)
// SB-A  Age >50               (Step 1 DOB)
// SB-N  Neck circumference >40cm (Step 8)
// SB-G  Sex = male            (Step 1)
//
// Score risk mapping: 0-2 = low, 3-4 = medium, 5-8 = high.

use super::types::{AssessmentData, FiredRule, StopbangResult};
use super::utils::calculate_age;

/// Stopbang risk from score.
pub fn stopbang_risk_from_score(score: u32) -> &'static str {
    if score >= 5 {
        "high"
    } else if score >= 3 {
        "medium"
    } else {
        "low"
    }
}

/// Evaluate stopbang.
pub fn evaluate_stopbang(d: &AssessmentData) -> StopbangResult {
    let sh = &d.social_history;
    let mh = &d.medical_history;
    let vs = &d.vital_signs;
    let dem = &d.demographics;
    let mut fired_rules: Vec<FiredRule> = Vec::new();
    let mut score: u32 = 0;

    if sh.snores_loudly == "yes" {
        score += 1;
        fired_rules.push(FiredRule {
            id: "SB-S".to_string(),
            category: "OSA".to_string(),
            description: "Snoring loudly.".to_string(),
            risk_level: "medium".to_string(),
        });
    }
    if sh.tired_during_day == "yes" {
        score += 1;
        fired_rules.push(FiredRule {
            id: "SB-T".to_string(),
            category: "OSA".to_string(),
            description: "Tired or sleepy during the day.".to_string(),
            risk_level: "medium".to_string(),
        });
    }
    if sh.observed_apnea == "yes" {
        score += 1;
        fired_rules.push(FiredRule {
            id: "SB-O".to_string(),
            category: "OSA".to_string(),
            description: "Observed apnea during sleep.".to_string(),
            risk_level: "medium".to_string(),
        });
    }
    if mh.hypertension == "yes" {
        score += 1;
        fired_rules.push(FiredRule {
            id: "SB-P".to_string(),
            category: "OSA".to_string(),
            description: "Hypertension (Pressure).".to_string(),
            risk_level: "medium".to_string(),
        });
    }
    if let Some(bmi) = vs.bmi
        && bmi > 35.0
    {
        score += 1;
        fired_rules.push(FiredRule {
            id: "SB-B".to_string(),
            category: "OSA".to_string(),
            description: format!("BMI {bmi} (>35)."),
            risk_level: "medium".to_string(),
        });
    }
    if let Some(age) = calculate_age(&dem.date_of_birth)
        && age > 50
    {
        score += 1;
        fired_rules.push(FiredRule {
            id: "SB-A".to_string(),
            category: "OSA".to_string(),
            description: format!("Age {age} years (>50)."),
            risk_level: "medium".to_string(),
        });
    }
    if let Some(nc) = vs.neck_circumference
        && nc > 40.0
    {
        score += 1;
        fired_rules.push(FiredRule {
            id: "SB-N".to_string(),
            category: "OSA".to_string(),
            description: format!("Neck circumference {nc} cm (>40cm)."),
            risk_level: "medium".to_string(),
        });
    }
    if dem.sex == "male" {
        score += 1;
        fired_rules.push(FiredRule {
            id: "SB-G".to_string(),
            category: "OSA".to_string(),
            description: "Male sex.".to_string(),
            risk_level: "medium".to_string(),
        });
    }

    StopbangResult {
        score,
        risk_level: stopbang_risk_from_score(score).to_string(),
        fired_rules,
    }
}
