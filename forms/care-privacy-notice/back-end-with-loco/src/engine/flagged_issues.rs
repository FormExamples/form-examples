//! Detection of additional flagged issues.

use super::types::{AdditionalFlag, AssessmentData};

/// Detect Care Privacy Notice additional flags. These are computed
/// independently of rule firing — they alert practice staff to
/// incomplete configuration or missing acknowledgement details.
///
/// Flag catalogue:
///
/// - FLAG-PRACTICE-NAME-001  — practice name missing in config (medium)
/// - FLAG-DPO-001            — Data Protection Officer details missing (medium)
/// - FLAG-ADDRESS-001        — practice address missing (low)
pub fn detect_additional_flags(data: &AssessmentData) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    if data.config.practice_name.trim().is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-PRACTICE-NAME-001".to_string(),
            category: "Practice Configuration".to_string(),
            message: "Practice name has not been configured.".to_string(),
            priority: "medium".to_string(),
        });
    }

    if data.config.dpo_name.trim().is_empty()
        || data.config.dpo_contact_details.trim().is_empty()
    {
        flags.push(AdditionalFlag {
            id: "FLAG-DPO-001".to_string(),
            category: "Data Protection Officer".to_string(),
            message: "Data Protection Officer name or contact details are missing.".to_string(),
            priority: "medium".to_string(),
        });
    }

    if data.config.practice_address.trim().is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-ADDRESS-001".to_string(),
            category: "Practice Configuration".to_string(),
            message: "Practice address has not been configured.".to_string(),
            priority: "low".to_string(),
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
