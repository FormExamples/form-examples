//! Detection of additional flagged issues.

use super::types::{AdditionalFlag, AssessmentData};

/// Detect Patient Satisfaction Survey flagged issues. Independent of
/// rule-based scoring; raises safety, complaint, dignity, and
/// service-quality alerts. Priority: high > medium > low.
///
/// Flag catalogue (mirrors `js/flagged-issues.js`):
///
/// - FLAG-SAFETY-001    — Felt-safe rating <= 2 (HIGH)
/// - FLAG-COMPLAINT-001 — Formal complaint raised (HIGH)
/// - FLAG-PRIVACY-001   — Privacy during examination == 1 (HIGH)
/// - FLAG-DIGNITY-001   — Respect for dignity <= 2 (HIGH)
/// - FLAG-RECOMMEND-001 — Would not recommend (<= 2) (HIGH)
/// - FLAG-NHSRATING-001 — NHS rating <= 3 (MEDIUM)
/// - FLAG-WAIT-001      — Excessive wait > 60 min (MEDIUM)
/// - FLAG-PAIN-001      — Poor pain management (<= 2) (MEDIUM)
/// - FLAG-CLEAN-001     — Poor cleanliness (<= 2) (MEDIUM)
/// - FLAG-CULTURAL-001  — Cultural sensitivity concern (<= 2) (MEDIUM)
/// - FLAG-CONTACT-001   — Did not know who to contact (<= 2) (MEDIUM)
/// - FLAG-LISTENED-001  — Did not feel listened to (<= 2) (MEDIUM)
/// - FLAG-PRAISE-001    — Specific staff praise (positive) (LOW)
pub fn detect_additional_flags(data: &AssessmentData) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    // ─── Safety concern - did not feel safe (HIGH) ──────────
    if let Some(v) = data.overall_experience.felt_safe {
        if v <= 2 {
            flags.push(AdditionalFlag {
                id: "FLAG-SAFETY-001".to_string(),
                category: "Safety".to_string(),
                message: format!(
                    "Patient did not feel safe during visit (rated {v}/5) - IMMEDIATE REVIEW REQUIRED"
                ),
                priority: "high".to_string(),
            });
        }
    }

    // ─── Formal complaint raised (HIGH) ─────────────────────
    if data.comments_suggestions.complaint_raised == "yes" {
        let detail = if data.comments_suggestions.complaint_details.trim().is_empty() {
            "details not specified".to_string()
        } else {
            data.comments_suggestions.complaint_details.clone()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-COMPLAINT-001".to_string(),
            category: "Complaint".to_string(),
            message: format!("Formal complaint raised: {detail}"),
            priority: "high".to_string(),
        });
    }

    // ─── Privacy concern (HIGH) ─────────────────────────────
    if matches!(data.clinical_care_quality.privacy_during_examination, Some(1)) {
        flags.push(AdditionalFlag {
            id: "FLAG-PRIVACY-001".to_string(),
            category: "Clinical Care".to_string(),
            message:
                "Very poor privacy during examination (rated 1/5) - CLINICAL GOVERNANCE REVIEW"
                    .to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Dignity concern (HIGH) ─────────────────────────────
    if let Some(v) = data.staff_attitude.respect_for_dignity {
        if v <= 2 {
            flags.push(AdditionalFlag {
                id: "FLAG-DIGNITY-001".to_string(),
                category: "Staff".to_string(),
                message: format!("Lack of respect for dignity reported (rated {v}/5)"),
                priority: "high".to_string(),
            });
        }
    }

    // ─── Would not recommend (HIGH) ─────────────────────────
    if let Some(v) = data.overall_experience.would_recommend {
        if v <= 2 {
            flags.push(AdditionalFlag {
                id: "FLAG-RECOMMEND-001".to_string(),
                category: "Overall".to_string(),
                message: format!(
                    "Patient would not recommend this service (rated {v}/5)"
                ),
                priority: "high".to_string(),
            });
        }
    }

    // ─── Very low NHS rating (MEDIUM) ───────────────────────
    if let Some(v) = data.overall_experience.nhs_rating {
        if v <= 3 {
            flags.push(AdditionalFlag {
                id: "FLAG-NHSRATING-001".to_string(),
                category: "Overall".to_string(),
                message: format!("Very low NHS rating ({v}/10)"),
                priority: "medium".to_string(),
            });
        }
    }

    // ─── Excessive wait (MEDIUM) ────────────────────────────
    if let Some(v) = data.access_waiting_times.actual_wait_minutes {
        if v > 60 {
            flags.push(AdditionalFlag {
                id: "FLAG-WAIT-001".to_string(),
                category: "Access".to_string(),
                message: format!("Excessive on-day waiting time ({v} minutes)"),
                priority: "medium".to_string(),
            });
        }
    }

    // ─── Poor pain management (MEDIUM) ──────────────────────
    if let Some(v) = data.clinical_care_quality.pain_management {
        if v <= 2 {
            flags.push(AdditionalFlag {
                id: "FLAG-PAIN-001".to_string(),
                category: "Clinical Care".to_string(),
                message: format!("Poor pain management reported (rated {v}/5)"),
                priority: "medium".to_string(),
            });
        }
    }

    // ─── Poor cleanliness (MEDIUM) ──────────────────────────
    if let Some(v) = data.environment_facilities.cleanliness {
        if v <= 2 {
            flags.push(AdditionalFlag {
                id: "FLAG-CLEAN-001".to_string(),
                category: "Environment".to_string(),
                message: format!("Poor cleanliness reported (rated {v}/5)"),
                priority: "medium".to_string(),
            });
        }
    }

    // ─── Cultural sensitivity concern (MEDIUM) ──────────────
    if let Some(v) = data.staff_attitude.cultural_sensitivity {
        if v <= 2 {
            flags.push(AdditionalFlag {
                id: "FLAG-CULTURAL-001".to_string(),
                category: "Staff".to_string(),
                message: format!("Cultural sensitivity concern (rated {v}/5)"),
                priority: "medium".to_string(),
            });
        }
    }

    // ─── Did not know who to contact (MEDIUM) ───────────────
    if let Some(v) = data.discharge_follow_up.knew_who_to_contact {
        if v <= 2 {
            flags.push(AdditionalFlag {
                id: "FLAG-CONTACT-001".to_string(),
                category: "Discharge".to_string(),
                message: format!(
                    "Patient did not know who to contact after discharge (rated {v}/5)"
                ),
                priority: "medium".to_string(),
            });
        }
    }

    // ─── Not listened to (MEDIUM) ───────────────────────────
    if let Some(v) = data.communication_information.listened_to {
        if v <= 2 {
            flags.push(AdditionalFlag {
                id: "FLAG-LISTENED-001".to_string(),
                category: "Communication".to_string(),
                message: format!("Patient did not feel listened to (rated {v}/5)"),
                priority: "medium".to_string(),
            });
        }
    }

    // ─── Specific staff praise (LOW - positive) ─────────────
    if !data.comments_suggestions.specific_staff_praise.trim().is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-PRAISE-001".to_string(),
            category: "Positive Feedback".to_string(),
            message: format!(
                "Staff praised: {}",
                data.comments_suggestions.specific_staff_praise
            ),
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
