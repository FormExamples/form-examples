use super::types::{AdditionalFlag, AssessmentData};

/// Detect clinician-facing IPS flags. These are computed independently of
/// completeness grading — they alert the clinician to high-criticality
/// allergies, missing identifiers, draft signoff, missing cross-border
/// consent, and other cross-border-care risks.
///
/// Flag IDs are preserved verbatim from the front-end JS engine.
/// Priority order: urgent > high > medium > low.
pub fn detect_additional_flags(data: &AssessmentData) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    // ─── Allergy alerts ───────────────────────────────────────
    for (i, a) in data.allergies_intolerances.iter().enumerate() {
        if a.severity == "severe" || a.criticality == "high" {
            let mut message = format!(
                "High-criticality allergy: {}",
                if a.substance.trim().is_empty() {
                    "(substance not specified)".to_string()
                } else {
                    a.substance.clone()
                }
            );
            if !a.reaction.trim().is_empty() {
                message.push_str(&format!(" — reaction: {}", a.reaction));
            }
            message.push('.');
            flags.push(AdditionalFlag {
                id: format!("FLAG-ALLERGY-HIGH-{i}"),
                category: "Allergy".to_string(),
                message,
                priority: "urgent".to_string(),
            });
        }
    }

    // ─── Patient identification ───────────────────────────────
    let p = &data.patient_demographics;
    let has_name = !p.given_name.trim().is_empty() && !p.family_name.trim().is_empty();
    if !has_name {
        flags.push(AdditionalFlag {
            id: "FLAG-PT-001".to_string(),
            category: "Patient Demographics".to_string(),
            message: "Patient name missing — IPS cannot be issued without identifying details."
                .to_string(),
            priority: "high".to_string(),
        });
    }
    if p.date_of_birth.trim().is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-PT-002".to_string(),
            category: "Patient Demographics".to_string(),
            message: "Date of birth missing — required for unambiguous patient identification."
                .to_string(),
            priority: "high".to_string(),
        });
    }
    if p.national_identifier.trim().is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-PT-003".to_string(),
            category: "Patient Demographics".to_string(),
            message: "No national identifier recorded — recommended for cross-border matching."
                .to_string(),
            priority: "medium".to_string(),
        });
    }
    if p.country.trim().is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-PT-004".to_string(),
            category: "Patient Demographics".to_string(),
            message: "Patient country missing — recommended for cross-border IPS exchange."
                .to_string(),
            priority: "low".to_string(),
        });
    }
    if p.preferred_language.trim().is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-PT-005".to_string(),
            category: "Patient Demographics".to_string(),
            message: "Preferred language not recorded — affects cross-border communication."
                .to_string(),
            priority: "low".to_string(),
        });
    }

    // ─── Authoring clinician / signoff ────────────────────────
    let c = &data.authoring_clinician;
    if c.authoring_status == "draft" {
        flags.push(AdditionalFlag {
            id: "FLAG-AUTH-001".to_string(),
            category: "Authoring".to_string(),
            message: "Authoring status is \"draft\" — finalise before exchange.".to_string(),
            priority: "medium".to_string(),
        });
    } else if c.authoring_status.is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-AUTH-002".to_string(),
            category: "Authoring".to_string(),
            message: "Authoring status not set — IPS is unsigned.".to_string(),
            priority: "high".to_string(),
        });
    }
    if c.authoring_status == "final" && c.signoff_date.trim().is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-AUTH-003".to_string(),
            category: "Authoring".to_string(),
            message: "Final IPS missing signoff date.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Empty mandatory clinical sections ────────────────────
    if data.problem_list.is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-CLIN-001".to_string(),
            category: "Problem List".to_string(),
            message: "No problems recorded — confirm \"no known problems\" or add entries."
                .to_string(),
            priority: "high".to_string(),
        });
    }
    if data.medication_summary.is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-CLIN-002".to_string(),
            category: "Medications".to_string(),
            message: "No medications recorded — confirm \"no current medications\" or add entries."
                .to_string(),
            priority: "high".to_string(),
        });
    }
    if data.allergies_intolerances.is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-CLIN-003".to_string(),
            category: "Allergies".to_string(),
            message: "No allergies recorded — IPS requires either entries or an explicit \"no known allergies\" marker.".to_string(),
            priority: "high".to_string(),
        });
    }
    if data.immunisations.is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-CLIN-004".to_string(),
            category: "Immunisations".to_string(),
            message: "No immunisations recorded — confirm history is unknown or add entries."
                .to_string(),
            priority: "medium".to_string(),
        });
    }
    if data.procedures.is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-CLIN-005".to_string(),
            category: "Procedures".to_string(),
            message: "No procedures recorded — confirm absence of relevant history.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if data.results_investigations.is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-CLIN-006".to_string(),
            category: "Results".to_string(),
            message: "No results or investigations recorded.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Cross-border consent ─────────────────────────────────
    if data.advance_directives.consent_to_share_eu == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-CONSENT-001".to_string(),
            category: "Consent".to_string(),
            message: "Patient has NOT consented to cross-border IPS sharing — do not export."
                .to_string(),
            priority: "urgent".to_string(),
        });
    } else if data.advance_directives.consent_to_share_eu.is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-CONSENT-002".to_string(),
            category: "Consent".to_string(),
            message: "Cross-border sharing consent not recorded.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Advance directives ───────────────────────────────────
    if data.advance_directives.dnr_in_place == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-AD-001".to_string(),
            category: "Advance Directives".to_string(),
            message: "DNR (Do Not Resuscitate) order in place.".to_string(),
            priority: "high".to_string(),
        });
    }
    if data.advance_directives.living_will_in_place == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-AD-002".to_string(),
            category: "Advance Directives".to_string(),
            message: "Living will / advance decision in place — review before urgent intervention."
                .to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Implanted devices ────────────────────────────────────
    if !data.medical_devices.is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-DEVICE-001".to_string(),
            category: "Medical Devices".to_string(),
            message: format!(
                "{} medical device(s)/implant(s) recorded — relevant for imaging and surgery.",
                data.medical_devices.len()
            ),
            priority: "medium".to_string(),
        });
    }

    // ─── Data-quality cross-checks ────────────────────────────
    for (i, m) in data.medication_summary.iter().enumerate() {
        if !m.name.trim().is_empty() && m.dose.trim().is_empty() {
            flags.push(AdditionalFlag {
                id: format!("FLAG-DQ-MED-{i}"),
                category: "Data Quality".to_string(),
                message: format!("Medication \"{}\" missing dose information.", m.name),
                priority: "low".to_string(),
            });
        }
    }
    for (i, pr) in data.problem_list.iter().enumerate() {
        if !pr.description.trim().is_empty() && pr.icd10_code.trim().is_empty() {
            flags.push(AdditionalFlag {
                id: format!("FLAG-DQ-PROB-{i}"),
                category: "Data Quality".to_string(),
                message: format!("Problem \"{}\" missing ICD-10 code.", pr.description),
                priority: "low".to_string(),
            });
        }
    }

    // Sort: urgent > high > medium > low
    flags.sort_by_key(|f| match f.priority.as_str() {
        "urgent" => 0,
        "high" => 1,
        "medium" => 2,
        "low" => 3,
        _ => 4,
    });

    flags
}
