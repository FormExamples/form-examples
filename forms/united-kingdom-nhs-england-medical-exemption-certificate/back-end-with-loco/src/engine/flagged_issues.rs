//! Clinical / administrative flags raised in addition to the rule-based
//! grading determination.
//!
//! Pure function: no mutation, no side effects.

use crate::engine::fp92a_rules::derive_age;
use crate::engine::types::{AdditionalFlag, ApplicationData, RulePriority};

/// Detect additional flags.
pub fn detect_additional_flags(data: &ApplicationData) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    // ─── High: missing NHS number ─────────────────────────
    if data.patient.united_kingdom_nhs_number.trim().is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-NHS-NUMBER-HIGH-001".into(),
            category: "completeness".into(),
            message:
                "NHS number is missing — NHSBSA cannot match the application to the patient record without it."
                    .into(),
            priority: RulePriority::High,
        });
    }

    // ─── High: missing practitioner signature ─────────────
    if data.declaration.signature_present != "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-SIGNATURE-HIGH-001".into(),
            category: "completeness".into(),
            message:
                "Practitioner signature is missing. NHSBSA only accepts ink-signed original FP92A forms posted to Bridge House."
                    .into(),
            priority: RulePriority::High,
        });
    }

    // ─── Medium: active certificate already exists ────────
    if data.existing_exemption.has_existing_certificate == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-ACTIVE-CERT-MED-001".into(),
            category: "workflow".into(),
            message:
                "Patient reports an active medical exemption certificate. Renewals must fall within the renewal window — check the previous certificate's expiry date."
                    .into(),
            priority: RulePriority::Medium,
        });
    }

    // ─── Medium: pregnancy declared (redirect to FW8) ─────
    if data.patient.pregnancy_status == "pregnant"
        || data.patient.pregnancy_status == "post-partum-within-12-months"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-PREGNANCY-MED-001".into(),
            category: "pregnancy".into(),
            message:
                "Patient is pregnant or within 12 months post-partum. Direct the patient to the FW8 maternity exemption certificate."
                    .into(),
            priority: RulePriority::Medium,
        });
    }

    // ─── Medium: age-based exemption ──────────────────────
    if let Some(age) = derive_age(&data.patient.birth_date) {
        if age < 16 {
            flags.push(AdditionalFlag {
                id: "FLAG-AGE-UNDER-16-MED-001".into(),
                category: "age-exemption".into(),
                message:
                    "Patient is under 16 and already entitled to free NHS prescriptions on age grounds — FP92A is not required."
                        .into(),
                priority: RulePriority::Medium,
            });
        } else if (16..=18).contains(&age) && data.patient.full_time_education == "yes" {
            flags.push(AdditionalFlag {
                id: "FLAG-AGE-16-18-FTE-MED-001".into(),
                category: "age-exemption".into(),
                message:
                    "Patient is 16-18 in full-time education and already age-exempt — FP92A is not required."
                        .into(),
                priority: RulePriority::Medium,
            });
        } else if age >= 60 {
            flags.push(AdditionalFlag {
                id: "FLAG-AGE-60-PLUS-MED-001".into(),
                category: "age-exemption".into(),
                message:
                    "Patient is 60 or over and already entitled to free NHS prescriptions on age grounds — FP92A is not required."
                        .into(),
                priority: RulePriority::Medium,
            });
        }
    }

    // ─── Medium: cancer histology pending ─────────────────
    if data
        .conditions
        .iter()
        .any(|c| c.selected == "yes" && c.code == "cancer-or-effects" && c.histology_confirmed == "pending")
    {
        flags.push(AdditionalFlag {
            id: "FLAG-CANCER-HISTOLOGY-MED-001".into(),
            category: "data-quality".into(),
            message:
                "Cancer diagnosis is pending histology confirmation — eligibility cannot be finalised until histology is reported."
                    .into(),
            priority: RulePriority::Medium,
        });
    }

    // ─── Low: education flag missing for 16-18 cohort ─────
    if let Some(age) = derive_age(&data.patient.birth_date) {
        if (16..=18).contains(&age) && data.patient.full_time_education.is_empty() {
            flags.push(AdditionalFlag {
                id: "FLAG-EDUCATION-STATUS-LOW-001".into(),
                category: "data-quality".into(),
                message:
                    "Patient is 16-18 but full-time education status has not been recorded. Confirm to determine whether age-based exemption applies."
                        .into(),
                priority: RulePriority::Low,
            });
        }
    }

    flags.sort_by_key(|f| f.priority.order());
    flags
}
