//! Clinical / safety flags raised independently of completeness validation.
//!
//!   - Suicidal-thoughts variant of anxiety/depression → urgent review.
//!   - Schizophrenia / psychosis / delusional / schizoaffective disorder → high.
//!   - Personality disorder + bipolar combination → high (driving fitness).
//!   - Q1 = Yes but no recent contact in 12 months → medium.
//!   - Multiple co-occurring conditions (>=3) → medium.
//!   - Q1 = No → low informational flag.

use crate::engine::types::{AdditionalFlag, AssessmentData, RulePriority};

pub fn detect_additional_flags(data: &AssessmentData) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();
    let c = &data.mental_health_conditions;
    let q1 = data.diagnosis_confirmation.has_mental_health_diagnosis.as_str();

    // ─── Urgent: suicidal thoughts variant ───────────────────
    if q1 == "yes" && c.anxiety_depression_with_impairment == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-MH-URGENT-001".into(),
            category: "Mental Health".into(),
            message:
                "Anxiety or depression with suicidal thoughts or impairment reported - urgent professional review required before DVLA decision.".into(),
            priority: RulePriority::Urgent,
        });
    }

    // ─── High: psychotic spectrum ────────────────────────────
    if q1 == "yes" && c.schizophrenia_or_psychosis == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-MH-HIGH-001".into(),
            category: "Mental Health".into(),
            message:
                "Schizophrenia, psychosis, delusional disorder, or schizoaffective disorder reported - DVLA medical assessor review required.".into(),
            priority: RulePriority::High,
        });
    }

    // ─── High: bipolar + personality combination ─────────────
    if q1 == "yes"
        && c.bipolar_affective_disorder == "yes"
        && c.personality_disorder == "yes"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-MH-HIGH-002".into(),
            category: "Mental Health".into(),
            message:
                "Co-occurring bipolar affective disorder and personality disorder reported - elevated driving-fitness review required.".into(),
            priority: RulePriority::High,
        });
    }

    // ─── Medium: eating disorder ─────────────────────────────
    if q1 == "yes" && c.eating_disorder == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-MH-HIGH-003".into(),
            category: "Mental Health".into(),
            message:
                "Eating disorder reported - clinician review of nutritional and cognitive status recommended.".into(),
            priority: RulePriority::Medium,
        });
    }

    // ─── Medium: bipolar (alone) ─────────────────────────────
    if q1 == "yes"
        && c.bipolar_affective_disorder == "yes"
        && c.personality_disorder != "yes"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-MH-MED-001".into(),
            category: "Mental Health".into(),
            message: "Bipolar affective disorder reported - DVLA driving-fitness review.".into(),
            priority: RulePriority::Medium,
        });
    }

    // ─── Medium: personality disorder (alone) ────────────────
    if q1 == "yes"
        && c.personality_disorder == "yes"
        && c.bipolar_affective_disorder != "yes"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-MH-MED-002".into(),
            category: "Mental Health".into(),
            message: "Personality disorder reported - DVLA driving-fitness review.".into(),
            priority: RulePriority::Medium,
        });
    }

    // ─── Medium: OCD or PTSD ─────────────────────────────────
    if q1 == "yes" && c.ocd_or_ptsd == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-MH-MED-003".into(),
            category: "Mental Health".into(),
            message:
                "OCD or PTSD reported - clinician review of impact on driving concentration recommended.".into(),
            priority: RulePriority::Medium,
        });
    }

    // ─── Medium: no recent contact in 12 months ──────────────
    if q1 == "yes" && data.recent_contact.had_recent_contact == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-CONTACT-MED-001".into(),
            category: "Recent Contact".into(),
            message:
                "Patient reports no contact with healthcare professional in the last 12 months - request a current review before licensing decision.".into(),
            priority: RulePriority::Medium,
        });
    }

    // ─── Medium: 3+ co-occurring conditions ──────────────────
    let condition_count = count_yes(data);
    if q1 == "yes" && condition_count >= 3 {
        flags.push(AdditionalFlag {
            id: "FLAG-MULTI-MED-001".into(),
            category: "Comorbidity".into(),
            message: format!(
                "Patient reports {} co-occurring mental health conditions - comprehensive review required.",
                condition_count
            ),
            priority: RulePriority::Medium,
        });
    }

    // ─── Low: Q1 = No (informational) ────────────────────────
    if q1 == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-NO-DIAGNOSIS-LOW-001".into(),
            category: "Diagnosis".into(),
            message:
                "Patient reports no mental health diagnosis - the rest of the form was not required.".into(),
            priority: RulePriority::Low,
        });
    }

    // ─── High: declaration not confirmed ─────────────────────
    if data.authorisation.declaration_confirmed != "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-AUTH-LOW-001".into(),
            category: "Authorisation".into(),
            message:
                "Declaration not confirmed - submission cannot be processed without authorisation.".into(),
            priority: RulePriority::High,
        });
    }

    flags.sort_by_key(|f| f.priority.order());
    flags
}

pub fn count_yes(data: &AssessmentData) -> u32 {
    let c = &data.mental_health_conditions;
    let mut n = 0u32;
    if c.anxiety_depression_without_impairment == "yes" {
        n += 1;
    }
    if c.anxiety_depression_with_impairment == "yes" {
        n += 1;
    }
    if c.bipolar_affective_disorder == "yes" {
        n += 1;
    }
    if c.eating_disorder == "yes" {
        n += 1;
    }
    if c.ocd_or_ptsd == "yes" {
        n += 1;
    }
    if c.personality_disorder == "yes" {
        n += 1;
    }
    if c.schizophrenia_or_psychosis == "yes" {
        n += 1;
    }
    if c.other == "yes" {
        n += 1;
    }
    n
}
