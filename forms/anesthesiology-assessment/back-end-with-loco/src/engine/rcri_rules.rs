// Revised Cardiac Risk Index (Lee Index) — 6 criteria, each worth 1 point.
//
// RCRI-001  High-risk surgery (auto from surgery grade major or complex)
// RCRI-002  History of ischaemic heart disease (clinician-confirmed)
// RCRI-003  History of congestive heart failure (clinician-confirmed)
// RCRI-004  History of cerebrovascular disease — stroke or TIA
// RCRI-005  Insulin-dependent diabetes (auto from medication flag)
// RCRI-006  Pre-op serum creatinine >177 µmol/L (>2 mg/dL)
//
// Score risk mapping: 0 = low, 1 = medium, 2 = high, >=3 = critical.
// MACE risk per published Lee Index: 0=0.4%, 1=1.0%, 2=2.4%, >=3=5.4%.

use super::types::{AssessmentData, FiredRule, RcriResult};

pub fn rcri_risk_from_score(score: u32) -> &'static str {
    if score >= 3 {
        "critical"
    } else if score == 2 {
        "high"
    } else if score == 1 {
        "medium"
    } else {
        "low"
    }
}

pub fn rcri_mace_percent(score: u32) -> f64 {
    if score >= 3 {
        5.4
    } else if score == 2 {
        2.4
    } else if score == 1 {
        1.0
    } else {
        0.4
    }
}

pub fn evaluate_rcri(d: &AssessmentData) -> RcriResult {
    let grade = &d.planned_surgery.surgery_grade;
    let ip = &d.investigations_and_plan;
    let meds = &d.medications;
    let mut fired_rules: Vec<FiredRule> = Vec::new();
    let mut score: u32 = 0;

    if grade == "major" || grade == "complex" {
        score += 1;
        fired_rules.push(FiredRule {
            id: "RCRI-001".to_string(),
            category: "Cardiac".to_string(),
            description: format!("High-risk surgery ({grade})."),
            risk_level: "medium".to_string(),
        });
    }
    if ip.rcri_ischaemic_heart_disease == "yes" {
        score += 1;
        fired_rules.push(FiredRule {
            id: "RCRI-002".to_string(),
            category: "Cardiac".to_string(),
            description: "History of ischaemic heart disease.".to_string(),
            risk_level: "medium".to_string(),
        });
    }
    if ip.rcri_congestive_heart_failure == "yes" {
        score += 1;
        fired_rules.push(FiredRule {
            id: "RCRI-003".to_string(),
            category: "Cardiac".to_string(),
            description: "History of congestive heart failure.".to_string(),
            risk_level: "medium".to_string(),
        });
    }
    if ip.rcri_cerebrovascular_disease == "yes" {
        score += 1;
        fired_rules.push(FiredRule {
            id: "RCRI-004".to_string(),
            category: "Cardiac".to_string(),
            description: "History of cerebrovascular disease (stroke / TIA).".to_string(),
            risk_level: "medium".to_string(),
        });
    }
    if meds.on_insulin == "yes" {
        score += 1;
        fired_rules.push(FiredRule {
            id: "RCRI-005".to_string(),
            category: "Cardiac".to_string(),
            description: "Insulin-dependent diabetes.".to_string(),
            risk_level: "medium".to_string(),
        });
    }
    if ip.rcri_high_creatinine == "yes" {
        score += 1;
        fired_rules.push(FiredRule {
            id: "RCRI-006".to_string(),
            category: "Cardiac".to_string(),
            description: "Serum creatinine >177 µmol/L (>2 mg/dL).".to_string(),
            risk_level: "medium".to_string(),
        });
    }

    RcriResult {
        score,
        mace_percent: rcri_mace_percent(score),
        risk_level: rcri_risk_from_score(score).to_string(),
        fired_rules,
    }
}
