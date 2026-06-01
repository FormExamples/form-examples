use super::types::AssessmentData;
use super::utils::{calculate_audit_score, calculate_dast_score};

/// A declarative substance abuse grading rule.
/// Grade scale: 1 = mild finding, 2 = moderate, 3 = significant, 4 = severe/critical.
pub struct SubstanceRule {
    pub id: &'static str,
    pub category: &'static str,
    pub description: &'static str,
    pub grade: u32,
    pub evaluate: fn(&AssessmentData) -> bool,
}

/// All substance abuse grading rules. Each fires when its condition is present.
/// Rule IDs preserved verbatim from the front-end JS (`substance-rules.js`).
pub fn all_rules() -> Vec<SubstanceRule> {
    vec![
        // ─── AUDIT ALCOHOL SCREENING ──────────────────────────────────
        SubstanceRule {
            id: "AUDIT-001",
            category: "Alcohol",
            description: "AUDIT score low risk (0-7)",
            grade: 1,
            evaluate: |d| {
                let s = calculate_audit_score(&d.alcohol_use_audit);
                (1..=7).contains(&s)
            },
        },
        SubstanceRule {
            id: "AUDIT-002",
            category: "Alcohol",
            description: "AUDIT score hazardous (8-15)",
            grade: 2,
            evaluate: |d| {
                let s = calculate_audit_score(&d.alcohol_use_audit);
                (8..=15).contains(&s)
            },
        },
        SubstanceRule {
            id: "AUDIT-003",
            category: "Alcohol",
            description: "AUDIT score harmful (16-19)",
            grade: 3,
            evaluate: |d| {
                let s = calculate_audit_score(&d.alcohol_use_audit);
                (16..=19).contains(&s)
            },
        },
        SubstanceRule {
            id: "AUDIT-004",
            category: "Alcohol",
            description: "AUDIT score dependence likely (20-40)",
            grade: 4,
            evaluate: |d| calculate_audit_score(&d.alcohol_use_audit) >= 20,
        },
        SubstanceRule {
            id: "AUDIT-005",
            category: "Alcohol",
            description: "Morning drinking (AUDIT Q6 elevated)",
            grade: 3,
            evaluate: |d| d.alcohol_use_audit.audit_q6_morning_drinking >= 2,
        },
        SubstanceRule {
            id: "AUDIT-006",
            category: "Alcohol",
            description: "Alcohol-related injury (AUDIT Q9 positive)",
            grade: 3,
            evaluate: |d| d.alcohol_use_audit.audit_q9_injury >= 2,
        },
        // ─── DAST-10 DRUG SCREENING ──────────────────────────────────
        SubstanceRule {
            id: "DAST-001",
            category: "Drug",
            description: "DAST score low level (1-2)",
            grade: 1,
            evaluate: |d| {
                let s = calculate_dast_score(&d.drug_use_dast);
                (1..=2).contains(&s)
            },
        },
        SubstanceRule {
            id: "DAST-002",
            category: "Drug",
            description: "DAST score moderate level (3-5)",
            grade: 2,
            evaluate: |d| {
                let s = calculate_dast_score(&d.drug_use_dast);
                (3..=5).contains(&s)
            },
        },
        SubstanceRule {
            id: "DAST-003",
            category: "Drug",
            description: "DAST score substantial level (6-8)",
            grade: 3,
            evaluate: |d| {
                let s = calculate_dast_score(&d.drug_use_dast);
                (6..=8).contains(&s)
            },
        },
        SubstanceRule {
            id: "DAST-004",
            category: "Drug",
            description: "DAST score severe level (9-10)",
            grade: 4,
            evaluate: |d| calculate_dast_score(&d.drug_use_dast) >= 9,
        },
        SubstanceRule {
            id: "DAST-005",
            category: "Drug",
            description: "Poly-drug use",
            grade: 3,
            evaluate: |d| d.drug_use_dast.dast_q2_poly_drug == "yes",
        },
        SubstanceRule {
            id: "DAST-006",
            category: "Drug",
            description: "Illegal activities to obtain drugs",
            grade: 3,
            evaluate: |d| d.drug_use_dast.dast_q8_illegal_activities == "yes",
        },
        // ─── SUBSTANCE USE HISTORY ──────────────────────────────────
        SubstanceRule {
            id: "SUH-001",
            category: "Substance History",
            description: "Intravenous drug use",
            grade: 3,
            evaluate: |d| d.substance_use_history.iv_drug_use == "yes",
        },
        SubstanceRule {
            id: "SUH-002",
            category: "Substance History",
            description: "Needle sharing",
            grade: 4,
            evaluate: |d| d.substance_use_history.needle_sharing == "yes",
        },
        SubstanceRule {
            id: "SUH-003",
            category: "Substance History",
            description: "Daily substance use",
            grade: 3,
            evaluate: |d| d.substance_use_history.frequency_of_use == "daily",
        },
        SubstanceRule {
            id: "SUH-004",
            category: "Substance History",
            description: "Long-term use (>10 years)",
            grade: 2,
            evaluate: |d| d.substance_use_history.duration_of_use == "greater-10-years",
        },
        SubstanceRule {
            id: "SUH-005",
            category: "Substance History",
            description: "Actively using",
            grade: 2,
            evaluate: |d| d.substance_use_history.current_use_status == "actively-using",
        },
        // ─── WITHDRAWAL ──────────────────────────────────────────────
        SubstanceRule {
            id: "WD-001",
            category: "Withdrawal",
            description: "Currently in withdrawal",
            grade: 4,
            evaluate: |d| d.withdrawal_assessment.currently_in_withdrawal == "yes",
        },
        SubstanceRule {
            id: "WD-002",
            category: "Withdrawal",
            description: "History of withdrawal seizures",
            grade: 4,
            evaluate: |d| d.withdrawal_assessment.seizure_history == "yes",
        },
        SubstanceRule {
            id: "WD-003",
            category: "Withdrawal",
            description: "History of delirium tremens",
            grade: 4,
            evaluate: |d| d.withdrawal_assessment.delirium_tremens_history == "yes",
        },
        SubstanceRule {
            id: "WD-004",
            category: "Withdrawal",
            description: "Hallucinations during withdrawal",
            grade: 4,
            evaluate: |d| d.withdrawal_assessment.hallucinations == "yes",
        },
        SubstanceRule {
            id: "WD-005",
            category: "Withdrawal",
            description: "Severe withdrawal symptoms",
            grade: 4,
            evaluate: |d| d.withdrawal_assessment.withdrawal_severity == "severe",
        },
        // ─── MENTAL HEALTH ──────────────────────────────────────────
        SubstanceRule {
            id: "MH-001",
            category: "Mental Health",
            description: "Current suicidal ideation",
            grade: 4,
            evaluate: |d| d.mental_health_comorbidities.suicidal_ideation_current == "yes",
        },
        SubstanceRule {
            id: "MH-002",
            category: "Mental Health",
            description: "Previous suicide attempts",
            grade: 3,
            evaluate: |d| d.mental_health_comorbidities.previous_suicide_attempts == "yes",
        },
        SubstanceRule {
            id: "MH-003",
            category: "Mental Health",
            description: "Severe depression",
            grade: 3,
            evaluate: |d| {
                d.mental_health_comorbidities.depression == "yes"
                    && d.mental_health_comorbidities.depression_severity == "severe"
            },
        },
        SubstanceRule {
            id: "MH-004",
            category: "Mental Health",
            description: "Psychosis",
            grade: 3,
            evaluate: |d| d.mental_health_comorbidities.psychosis == "yes",
        },
        SubstanceRule {
            id: "MH-005",
            category: "Mental Health",
            description: "Comorbid depression (mild/moderate)",
            grade: 2,
            evaluate: |d| {
                d.mental_health_comorbidities.depression == "yes"
                    && d.mental_health_comorbidities.depression_severity != "severe"
                    && !d.mental_health_comorbidities.depression_severity.is_empty()
            },
        },
        SubstanceRule {
            id: "MH-006",
            category: "Mental Health",
            description: "PTSD",
            grade: 2,
            evaluate: |d| d.mental_health_comorbidities.ptsd == "yes",
        },
        // ─── PHYSICAL HEALTH ────────────────────────────────────────
        SubstanceRule {
            id: "PH-001",
            category: "Physical Health",
            description: "Overdose history",
            grade: 4,
            evaluate: |d| d.physical_health_impact.overdose_history == "yes",
        },
        SubstanceRule {
            id: "PH-002",
            category: "Physical Health",
            description: "Liver cirrhosis",
            grade: 3,
            evaluate: |d| {
                d.physical_health_impact.liver_disease == "yes"
                    && d.physical_health_impact.liver_disease_type == "cirrhosis"
            },
        },
        SubstanceRule {
            id: "PH-003",
            category: "Physical Health",
            description: "HIV positive",
            grade: 2,
            evaluate: |d| d.physical_health_impact.hiv_status == "positive",
        },
        SubstanceRule {
            id: "PH-004",
            category: "Physical Health",
            description: "Hepatitis C positive",
            grade: 2,
            evaluate: |d| d.physical_health_impact.hepatitis_c == "yes",
        },
        // ─── SOCIAL & LEGAL ─────────────────────────────────────────
        SubstanceRule {
            id: "SL-001",
            category: "Social",
            description: "Homeless",
            grade: 3,
            evaluate: |d| d.social_legal_impact.housing_status == "homeless",
        },
        SubstanceRule {
            id: "SL-002",
            category: "Social",
            description: "Children safeguarding concerns",
            grade: 4,
            evaluate: |d| d.social_legal_impact.children_safeguarding_concerns == "yes",
        },
        SubstanceRule {
            id: "SL-003",
            category: "Social",
            description: "Domestic violence involvement",
            grade: 3,
            evaluate: |d| d.social_legal_impact.domestic_violence == "yes",
        },
        SubstanceRule {
            id: "SL-004",
            category: "Social",
            description: "No social support",
            grade: 2,
            evaluate: |d| d.social_legal_impact.social_support == "none",
        },
    ]
}
