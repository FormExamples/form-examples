use super::types::{AdditionalFlag, AssessmentData};

/// Detect Legal Requirements Privacy Notice acknowledgment flags. These are
/// computed independently of completion — they alert reviewers to items that
/// require explicit attention. Priority: high > medium > low.
///
/// Flag catalogue:
///
/// - FLAG-ACK-NOT-CONFIRMED  — acknowledgment confirmation checkbox not ticked
/// - FLAG-ACK-MISSING-NAME   — acknowledgment full-name field empty
/// - FLAG-ACK-MISSING-DATE   — acknowledgment date field empty
pub fn detect_additional_flags(data: &AssessmentData) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    // ─── HIGH PRIORITY ─────────────────────────────────────────────

    if !data.acknowledgment.confirmed {
        flags.push(AdditionalFlag {
            id: "FLAG-ACK-NOT-CONFIRMED".to_string(),
            category: "Confirmation".to_string(),
            message:
                "Patient has NOT confirmed they have read and understood the privacy notice"
                    .to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── MEDIUM PRIORITY ────────────────────────────────────────────

    if data.acknowledgment.full_name.trim().is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-ACK-MISSING-NAME".to_string(),
            category: "Identity".to_string(),
            message: "Acknowledgment is missing the patient's full name".to_string(),
            priority: "medium".to_string(),
        });
    }

    if data.acknowledgment.acknowledged_date.trim().is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-ACK-MISSING-DATE".to_string(),
            category: "Date".to_string(),
            message: "Acknowledgment is missing the acknowledged date".to_string(),
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
