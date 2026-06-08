//! Detection of additional flagged issues.

use super::types::{AdditionalFlag, AssessmentData};
use super::utils::{count_conditions, priority_order};

/// Detect clinical / safety flags raised independently of completeness
/// validation. Flag IDs are stable identifiers preserved verbatim from the
/// front-end source.
///
/// Catalogue:
/// - FLAG-MH-URGENT-001 — suicidal-thoughts variant (urgent)
/// - FLAG-MH-HIGH-001   — schizophrenia/psychosis/delusional/schizoaffective (high)
/// - FLAG-MH-HIGH-002   — co-occurring bipolar + personality disorder (high)
/// - FLAG-MH-HIGH-003   — eating disorder (medium; ID retained for parity)
/// - FLAG-MH-MED-001    — bipolar alone (medium)
/// - FLAG-MH-MED-002    — personality disorder alone (medium)
/// - FLAG-MH-MED-003    — OCD or PTSD (medium)
/// - FLAG-CONTACT-MED-001 — no recent contact in 12 months (medium)
/// - FLAG-MULTI-MED-001 — 3+ co-occurring conditions (medium)
/// - FLAG-NO-DIAGNOSIS-LOW-001 — Q1 = No (low)
/// - FLAG-AUTH-LOW-001  — declaration not confirmed (high)
pub fn detect_additional_flags(data: &AssessmentData) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();
    let c = &data.mental_health_conditions;
    let q1 = &data.diagnosis_confirmation.has_mental_health_diagnosis;

    // ─── Urgent: suicidal thoughts variant ───────────────────────
    if q1 == "yes" && c.anxiety_depression_with_impairment == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-MH-URGENT-001".to_string(),
            category: "Mental Health".to_string(),
            message: "Anxiety or depression with suicidal thoughts or impairment reported - urgent professional review required before DVLA decision.".to_string(),
            priority: "urgent".to_string(),
        });
    }

    // ─── High: psychotic spectrum ────────────────────────────────
    if q1 == "yes" && c.schizophrenia_or_psychosis == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-MH-HIGH-001".to_string(),
            category: "Mental Health".to_string(),
            message: "Schizophrenia, psychosis, delusional disorder, or schizoaffective disorder reported - DVLA medical assessor review required.".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── High: bipolar + personality combination ─────────────────
    if q1 == "yes"
        && c.bipolar_affective_disorder == "yes"
        && c.personality_disorder == "yes"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-MH-HIGH-002".to_string(),
            category: "Mental Health".to_string(),
            message: "Co-occurring bipolar affective disorder and personality disorder reported - elevated driving-fitness review required.".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Medium: eating disorder (ID retained: FLAG-MH-HIGH-003) ──
    if q1 == "yes" && c.eating_disorder == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-MH-HIGH-003".to_string(),
            category: "Mental Health".to_string(),
            message: "Eating disorder reported - clinician review of nutritional and cognitive status recommended.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Medium: bipolar (alone) ─────────────────────────────────
    if q1 == "yes"
        && c.bipolar_affective_disorder == "yes"
        && c.personality_disorder != "yes"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-MH-MED-001".to_string(),
            category: "Mental Health".to_string(),
            message: "Bipolar affective disorder reported - DVLA driving-fitness review.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Medium: personality disorder (alone) ────────────────────
    if q1 == "yes"
        && c.personality_disorder == "yes"
        && c.bipolar_affective_disorder != "yes"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-MH-MED-002".to_string(),
            category: "Mental Health".to_string(),
            message: "Personality disorder reported - DVLA driving-fitness review.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Medium: OCD or PTSD ─────────────────────────────────────
    if q1 == "yes" && c.ocd_or_ptsd == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-MH-MED-003".to_string(),
            category: "Mental Health".to_string(),
            message: "OCD or PTSD reported - clinician review of impact on driving concentration recommended.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Medium: no recent contact in 12 months ──────────────────
    if q1 == "yes" && data.recent_contact.had_recent_contact == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-CONTACT-MED-001".to_string(),
            category: "Recent Contact".to_string(),
            message: "Patient reports no contact with healthcare professional in the last 12 months - request a current review before licensing decision.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Medium: 3+ co-occurring conditions ──────────────────────
    let condition_count = count_conditions(data);
    if q1 == "yes" && condition_count >= 3 {
        flags.push(AdditionalFlag {
            id: "FLAG-MULTI-MED-001".to_string(),
            category: "Comorbidity".to_string(),
            message: format!(
                "Patient reports {condition_count} co-occurring mental health conditions - comprehensive review required."
            ),
            priority: "medium".to_string(),
        });
    }

    // ─── Low: Q1 = No (informational) ────────────────────────────
    if q1 == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-NO-DIAGNOSIS-LOW-001".to_string(),
            category: "Diagnosis".to_string(),
            message: "Patient reports no mental health diagnosis - the rest of the form was not required.".to_string(),
            priority: "low".to_string(),
        });
    }

    // ─── High: declaration not confirmed ─────────────────────────
    if data.authorisation.declaration_confirmed != "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-AUTH-LOW-001".to_string(),
            category: "Authorisation".to_string(),
            message: "Declaration not confirmed - submission cannot be processed without authorisation.".to_string(),
            priority: "high".to_string(),
        });
    }

    flags.sort_by_key(|f| priority_order(&f.priority));
    flags
}
