//! Detection of additional flagged issues.

use super::types::{AdditionalFlag, AssessmentData};
use super::utils::{calculate_audit_score, calculate_dast_score};

/// Detect additional flags that should be highlighted for the clinician,
/// independent of AUDIT/DAST scoring. These are safety-critical alerts.
/// Flag IDs preserved verbatim from the front-end JS (`flagged-issues.js`).
pub fn detect_additional_flags(data: &AssessmentData) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    // ─── Active withdrawal (HIGH) ──────────────────────────────
    if data.withdrawal_assessment.currently_in_withdrawal == "yes" {
        let substance = if data.withdrawal_assessment.withdrawal_substance.is_empty() {
            "substance not specified".to_string()
        } else {
            data.withdrawal_assessment.withdrawal_substance.clone()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-WD-001".to_string(),
            category: "Withdrawal".to_string(),
            message: format!(
                "Active withdrawal from {substance} - IMMEDIATE MEDICAL ASSESSMENT REQUIRED"
            ),
            priority: "high".to_string(),
        });
    }

    // ─── Seizure history (HIGH) ────────────────────────────────
    if data.withdrawal_assessment.seizure_history == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-WD-002".to_string(),
            category: "Withdrawal".to_string(),
            message: "History of withdrawal seizures - HIGH RISK for complicated withdrawal"
                .to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Delirium tremens history (HIGH) ───────────────────────
    if data.withdrawal_assessment.delirium_tremens_history == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-WD-003".to_string(),
            category: "Withdrawal".to_string(),
            message: "History of delirium tremens - INPATIENT DETOX RECOMMENDED".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Current suicidal ideation (HIGH) ──────────────────────
    if data.mental_health_comorbidities.suicidal_ideation_current == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-SI-001".to_string(),
            category: "Suicidality".to_string(),
            message: "CURRENT SUICIDAL IDEATION - URGENT SAFETY ASSESSMENT REQUIRED".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Previous suicide attempts (HIGH) ──────────────────────
    if data.mental_health_comorbidities.previous_suicide_attempts == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-SI-002".to_string(),
            category: "Suicidality".to_string(),
            message: "History of suicide attempts - elevated risk".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Overdose history (HIGH) ───────────────────────────────
    if data.physical_health_impact.overdose_history == "yes" {
        let count = match data.physical_health_impact.overdose_count {
            Some(n) => n.to_string(),
            None => "?".to_string(),
        };
        flags.push(AdditionalFlag {
            id: "FLAG-OD-001".to_string(),
            category: "Overdose".to_string(),
            message: format!(
                "Previous overdose(s): {count} episode(s) - naloxone provision recommended"
            ),
            priority: "high".to_string(),
        });
    }

    // ─── Children safeguarding (HIGH) ──────────────────────────
    if data.social_legal_impact.children_safeguarding_concerns == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-SG-001".to_string(),
            category: "Safeguarding".to_string(),
            message: "CHILDREN SAFEGUARDING CONCERNS - mandatory reporting may apply".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Domestic violence (HIGH) ──────────────────────────────
    if data.social_legal_impact.domestic_violence == "yes" {
        let details = if data.social_legal_impact.domestic_violence_details.is_empty() {
            "details not specified".to_string()
        } else {
            data.social_legal_impact.domestic_violence_details.clone()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-DV-001".to_string(),
            category: "Safeguarding".to_string(),
            message: format!("Domestic violence: {details} - safety planning required"),
            priority: "high".to_string(),
        });
    }

    // ─── Needle sharing (HIGH) ─────────────────────────────────
    if data.substance_use_history.needle_sharing == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-BBV-001".to_string(),
            category: "Blood-Borne Viruses".to_string(),
            message: "Needle sharing reported - BBV screening required (HIV, Hep B, Hep C)"
                .to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── AUDIT dependence likely (HIGH) ────────────────────────
    let audit_score = calculate_audit_score(&data.alcohol_use_audit);
    if audit_score >= 20 {
        flags.push(AdditionalFlag {
            id: "FLAG-AUDIT-001".to_string(),
            category: "Alcohol".to_string(),
            message: format!(
                "AUDIT score {audit_score}/40 - alcohol dependence likely, specialist referral recommended"
            ),
            priority: "high".to_string(),
        });
    }

    // ─── DAST severe (HIGH) ────────────────────────────────────
    let dast_score = calculate_dast_score(&data.drug_use_dast);
    if dast_score >= 9 {
        flags.push(AdditionalFlag {
            id: "FLAG-DAST-001".to_string(),
            category: "Drug".to_string(),
            message: format!(
                "DAST score {dast_score}/10 - severe drug problem, intensive treatment needed"
            ),
            priority: "high".to_string(),
        });
    }

    // ─── IV drug use (MEDIUM) ──────────────────────────────────
    if data.substance_use_history.iv_drug_use == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-IV-001".to_string(),
            category: "Substance History".to_string(),
            message: "Intravenous drug use - BBV screening and harm reduction advice".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Psychosis (MEDIUM) ────────────────────────────────────
    if data.mental_health_comorbidities.psychosis == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-MH-001".to_string(),
            category: "Mental Health".to_string(),
            message: "Psychosis - dual diagnosis assessment recommended".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Liver cirrhosis (MEDIUM) ──────────────────────────────
    if data.physical_health_impact.liver_disease == "yes"
        && data.physical_health_impact.liver_disease_type == "cirrhosis"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-LIVER-001".to_string(),
            category: "Physical Health".to_string(),
            message: "Liver cirrhosis - alcohol abstinence essential, hepatology referral"
                .to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Homelessness (MEDIUM) ─────────────────────────────────
    if data.social_legal_impact.housing_status == "homeless" {
        flags.push(AdditionalFlag {
            id: "FLAG-HOUSING-001".to_string(),
            category: "Social".to_string(),
            message: "Homeless - housing support and assertive outreach recommended".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Self-harm history (MEDIUM) ────────────────────────────
    if data.mental_health_comorbidities.self_harm_history == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-SH-001".to_string(),
            category: "Mental Health".to_string(),
            message: "History of self-harm - risk assessment and monitoring".to_string(),
            priority: "medium".to_string(),
        });
    }

    // Sort: high > medium > low.
    flags.sort_by_key(|f| match f.priority.as_str() {
        "high" => 0,
        "medium" => 1,
        "low" => 2,
        _ => 3,
    });

    flags
}
