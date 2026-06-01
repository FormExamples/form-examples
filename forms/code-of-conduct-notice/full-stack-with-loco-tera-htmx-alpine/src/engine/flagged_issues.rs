use super::types::{AdditionalFlag, AssessmentData};

/// Detect compliance-officer-facing flags for the Code of Conduct Notice.
/// Computed independently of completion. Ported 1:1 from
/// `front-end-form-with-html/js/flagged-issues.js`.
///
/// Flag catalogue:
/// - `FLAG-NOACK-001`  — recipient has not ticked the acknowledgement (high)
/// - `FLAG-NAME-001`   — typed name looks too short to be a full name (medium)
/// - `FLAG-CONFIG-001` — required recipient metadata missing (high)
pub fn detect_additional_flags(data: &AssessmentData) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    // ─── Acknowledgement not given ──────────────────────────────────
    if !data.acknowledgement_signature.agreed {
        flags.push(AdditionalFlag {
            id: "FLAG-NOACK-001".to_string(),
            category: "Acknowledgement Not Given".to_string(),
            message: "Recipient has not acknowledged the code of conduct".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Name looks incomplete ──────────────────────────────────────
    let name = data
        .acknowledgement_signature
        .recipient_typed_full_name
        .trim();
    if !name.is_empty() && name.chars().count() < 3 {
        flags.push(AdditionalFlag {
            id: "FLAG-NAME-001".to_string(),
            category: "Incomplete Name".to_string(),
            message: "Recipient typed name appears incomplete — please verify".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Missing recipient metadata ─────────────────────────────────
    let rd = &data.recipient_details;
    let mut missing: Vec<&'static str> = Vec::new();
    if rd.organisation_name.trim().is_empty() {
        missing.push("organisation name");
    }
    if rd.recipient_name.trim().is_empty() {
        missing.push("recipient name");
    }
    if rd.recipient_role.trim().is_empty() {
        missing.push("recipient role");
    }
    if !missing.is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-CONFIG-001".to_string(),
            category: "Incomplete Recipient Details".to_string(),
            message: format!(
                "Recipient details are missing: {}",
                missing.join(", ")
            ),
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
