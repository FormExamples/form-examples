//! Detection of additional flagged issues.

use super::types::{AdditionalFlag, AssessmentData};

/// Detect information-governance flags surfaced on the report. Ported
/// 1:1 from `flagged-issues.js`. Flag IDs are preserved verbatim.
///
/// - FLAG-NOACK-001         — acknowledgement checkbox not ticked
/// - FLAG-TYPE1-OPTOUT-001  — Type 1 opt-out elected
/// - FLAG-NATIONAL-OPTOUT-001 — NHS National Data Opt-Out elected
/// - FLAG-NAME-001          — typed name looks incomplete (< 3 chars)
/// - FLAG-CONFIG-001        — missing recipient organisation / name
pub fn detect_additional_flags(data: &AssessmentData) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();
    let ack = &data.acknowledgement_signature;

    // ─── Acknowledgement not given ────────────────────────
    if !ack.agreed {
        flags.push(AdditionalFlag {
            id: "FLAG-NOACK-001".to_string(),
            category: "Acknowledgement Not Given".to_string(),
            message: "Recipient has not acknowledged the research and planning privacy notice".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Type 1 opt-out elected ───────────────────────────
    if ack.type1_opt_out == "opt-out" {
        flags.push(AdditionalFlag {
            id: "FLAG-TYPE1-OPTOUT-001".to_string(),
            category: "Type 1 Opt-Out".to_string(),
            message: "Recipient has elected Type 1 opt-out — confidential patient information must not be shared from this practice for purposes beyond direct care".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── National Data Opt-Out elected ────────────────────
    if ack.national_data_opt_out == "opt-out" {
        flags.push(AdditionalFlag {
            id: "FLAG-NATIONAL-OPTOUT-001".to_string(),
            category: "National Data Opt-Out".to_string(),
            message: "Recipient has elected the NHS National Data Opt-Out — data must not be used for research and planning across the wider NHS".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Name looks incomplete ────────────────────────────
    let name = ack.recipient_typed_full_name.trim();
    if !name.is_empty() && name.chars().count() < 3 {
        flags.push(AdditionalFlag {
            id: "FLAG-NAME-001".to_string(),
            category: "Incomplete Name".to_string(),
            message: "Recipient typed name appears incomplete — please verify".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Missing recipient metadata ───────────────────────
    let rd = &data.recipient_details;
    let mut missing_fields: Vec<&str> = Vec::new();
    if rd.organisation_name.trim().is_empty() {
        missing_fields.push("organisation name");
    }
    if rd.recipient_name.trim().is_empty() {
        missing_fields.push("recipient name");
    }
    if !missing_fields.is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-CONFIG-001".to_string(),
            category: "Incomplete Recipient Details".to_string(),
            message: format!("Recipient details are missing: {}", missing_fields.join(", ")),
            priority: "high".to_string(),
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
