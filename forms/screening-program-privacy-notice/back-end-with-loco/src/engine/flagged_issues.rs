use super::types::{AdditionalFlag, AssessmentData};

/// Detect Screening Program Privacy Notice safety / privacy flags. These are
/// computed independently of acknowledgment completion — they alert the
/// practice to items that require explicit attention regardless of whether
/// the patient has signed. Priority: high > medium > low.
///
/// Flag catalogue:
///
/// - FLAG-CONFIRM-001 — Patient has NOT confirmed the privacy notice
/// - FLAG-NAME-001    — Patient has NOT provided a full-name signature
/// - FLAG-DATE-001    — Patient has NOT provided an acknowledged date
/// - FLAG-GDPR-001    — Practice GDPR basis is unset (must be "consent" or "research")
/// - FLAG-DPO-001     — Practice DPO contact details unset or placeholder
/// - FLAG-PRACTICE-001 — Practice name unset or placeholder
pub fn detect_additional_flags(data: &AssessmentData) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    // ─── HIGH PRIORITY ─────────────────────────────────────────────

    if !data.acknowledgment.confirmed {
        flags.push(AdditionalFlag {
            id: "FLAG-CONFIRM-001".to_string(),
            category: "Confirmation".to_string(),
            message: "Patient has NOT ticked the confirmation checkbox for the privacy notice"
                .to_string(),
            priority: "high".to_string(),
        });
    }

    if data.acknowledgment.full_name.trim().is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-NAME-001".to_string(),
            category: "Signature".to_string(),
            message: "Patient has NOT supplied a full-name signature".to_string(),
            priority: "high".to_string(),
        });
    }

    if data.acknowledgment.acknowledged_date.trim().is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-DATE-001".to_string(),
            category: "Date".to_string(),
            message: "Patient has NOT supplied an acknowledged date".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── MEDIUM PRIORITY ────────────────────────────────────────────

    let basis = data.practice_config.gdpr_basis.trim();
    if basis != "consent" && basis != "research" {
        flags.push(AdditionalFlag {
            id: "FLAG-GDPR-001".to_string(),
            category: "Legal Basis".to_string(),
            message: "Practice GDPR basis is unset — must be \"consent\" (9(2)(a)) or \"research\" (9(2)(j))"
                .to_string(),
            priority: "medium".to_string(),
        });
    }

    let dpo = data.practice_config.data_protection_officer.trim();
    if dpo.is_empty() || dpo.starts_with('[') {
        flags.push(AdditionalFlag {
            id: "FLAG-DPO-001".to_string(),
            category: "DPO".to_string(),
            message: "Practice Data Protection Officer contact details are unset or placeholder"
                .to_string(),
            priority: "medium".to_string(),
        });
    }

    let practice = data.practice_config.practice_name.trim();
    if practice.is_empty() || practice.starts_with('[') {
        flags.push(AdditionalFlag {
            id: "FLAG-PRACTICE-001".to_string(),
            category: "Practice".to_string(),
            message: "Practice name is unset or placeholder".to_string(),
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
