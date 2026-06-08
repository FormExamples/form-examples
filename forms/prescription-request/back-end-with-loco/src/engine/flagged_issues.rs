//! Detection of additional flagged issues.

use super::types::{AdditionalFlag, AssessmentData};

/// Detect additional flags for clinician review, independent of the overall
/// priority level. Ports `front-end-form-with-html/js/flagged-issues.js`.
///
/// Flag catalogue:
/// - FLAG-EMERG-INCOMPLETE — emergency request with missing contact info
/// - FLAG-NOSUB-001 — no substitutions permitted at all
/// - FLAG-MED-001 — medication name not provided
/// - FLAG-DOSE-001 — dosage not specified
/// - FLAG-CLIN-001 — clinician NHS employee number missing
/// - FLAG-PAT-001 — patient NHS number missing
/// - FLAG-INSTR-001 — treatment instructions not provided
/// - FLAG-REFILL-001 — refill request with no request date
pub fn detect_additional_flags(data: &AssessmentData) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    // ─── Emergency with incomplete contact info ───────────
    if data.request_type.is_emergency == "yes"
        && (data.clinician_information.phone.trim().is_empty()
            || data.patient_information.phone.trim().is_empty())
    {
        flags.push(AdditionalFlag {
            id: "FLAG-EMERG-INCOMPLETE".to_string(),
            category: "Emergency".to_string(),
            message:
                "Emergency request with incomplete contact details - verify urgently"
                    .to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── No substitutions allowed ─────────────────────────
    if data.substitution_options.allow_brand_substitution == "no"
        && data.substitution_options.allow_generic_substitution == "no"
        && data.substitution_options.allow_dosage_adjustment == "no"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-NOSUB-001".to_string(),
            category: "Substitution".to_string(),
            message: "No substitutions permitted - exact medication required".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Missing medication name ──────────────────────────
    if data.prescription_details.medication_name.trim().is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-MED-001".to_string(),
            category: "Completeness".to_string(),
            message: "Medication name not provided".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Missing dosage ───────────────────────────────────
    if data.prescription_details.dosage.trim().is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-DOSE-001".to_string(),
            category: "Completeness".to_string(),
            message: "Dosage not specified".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Missing clinician ID ────────────────────────────
    if data
        .clinician_information
        .nhs_employee_number
        .trim()
        .is_empty()
    {
        flags.push(AdditionalFlag {
            id: "FLAG-CLIN-001".to_string(),
            category: "Administrative".to_string(),
            message: "Clinician NHS employee number not provided".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Missing patient ID ──────────────────────────────
    if data.patient_information.nhs_number.trim().is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-PAT-001".to_string(),
            category: "Administrative".to_string(),
            message: "Patient NHS number not provided".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Missing treatment instructions ───────────────────
    if data
        .prescription_details
        .treatment_instructions
        .trim()
        .is_empty()
    {
        flags.push(AdditionalFlag {
            id: "FLAG-INSTR-001".to_string(),
            category: "Completeness".to_string(),
            message: "Treatment instructions not provided".to_string(),
            priority: "low".to_string(),
        });
    }

    // ─── Refill without date ──────────────────────────────
    if data.request_type.is_new_prescription == "no"
        && data.prescription_details.request_date.is_empty()
    {
        flags.push(AdditionalFlag {
            id: "FLAG-REFILL-001".to_string(),
            category: "Completeness".to_string(),
            message: "Refill request without a request date".to_string(),
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
