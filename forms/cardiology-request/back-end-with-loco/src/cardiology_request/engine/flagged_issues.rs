//! Safety-critical flag detection, independent of the four axes.
//!
//! Ported from `front-end-with-svelte/src/lib/engine/flagged-issues.ts`. Flag
//! categories mirror `sql/07_create_table_cardiology_request_grade_flag.sql`.
//! Flags are returned sorted high → medium → low priority.

use super::types::{CardiologyRequest, Flag};
use super::utils::has_typical_angina;

fn flag(
    flag_id: &str,
    category: &str,
    priority: &str,
    description: &str,
    suggested_action: &str,
) -> Flag {
    Flag {
        flag_id: flag_id.to_string(),
        category: category.to_string(),
        priority: priority.to_string(),
        description: description.to_string(),
        suggested_action: suggested_action.to_string(),
    }
}

fn priority_order(priority: &str) -> u8 {
    match priority {
        "high" => 0,
        "medium" => 1,
        "low" => 2,
        _ => 3,
    }
}

/// Detect safety-critical flags independently of the four axes, returned sorted
/// high → medium → low priority.
#[must_use]
pub fn detect_flags(r: &CardiologyRequest) -> Vec<Flag> {
    let mut flags: Vec<Flag> = Vec::new();

    // ─── suspected-acs ───
    if r.suspected_acs || r.troponin_status == "elevated" {
        flags.push(flag(
            "F-SUSPECTED-ACS-001",
            "suspected-acs",
            "high",
            "Suspected acute coronary syndrome (or elevated troponin) is present.",
            "Divert to the emergency ACS pathway now; do not wait for a routine cardiology clinic.",
        ));
    }

    // ─── exertional-syncope ───
    if r.exertional_syncope {
        flags.push(flag(
            "F-EXERTIONAL-SYNCOPE-001",
            "exertional-syncope",
            "high",
            "Exertional syncope is reported.",
            "Arrange urgent assessment for a structural or arrhythmic cause; advise driving / activity precautions.",
        ));
    }

    // ─── new-onset-heart-failure ───
    if r.new_onset_heart_failure {
        flags.push(flag(
            "F-NEW-ONSET-HF-001",
            "new-onset-heart-failure",
            "high",
            "New-onset heart failure is reported.",
            "Arrange urgent assessment per NICE NG106; check BNP / NT-proBNP and arrange echocardiography.",
        ));
    }

    // ─── red-flag-chest-pain ───
    if has_typical_angina(r) && !r.suspected_acs {
        flags.push(flag(
            "F-RED-FLAG-CHEST-PAIN-001",
            "red-flag-chest-pain",
            "medium",
            "Typical-angina chest pain is reported without a coded ACS red flag.",
            "Vet for urgent rapid-access chest-pain review rather than a routine clinic.",
        ));
    }

    // ─── missing-reason ───
    if r.referral_reason.is_empty() {
        flags.push(flag(
            "F-MISSING-REASON-001",
            "missing-reason",
            "medium",
            "No primary reason for referral was supplied.",
            "Query the referrer for the primary reason before the referral can be vetted.",
        ));
    }

    // ─── missing-clinical-question ───
    if r.clinical_question.trim().is_empty() {
        flags.push(flag(
            "F-MISSING-CLINICAL-QUESTION-001",
            "missing-clinical-question",
            "low",
            "No specific clinical question was supplied.",
            "Ask the referrer for the specific question the cardiology team should answer.",
        ));
    }

    // ─── other: ECG abnormality with no ECG actually performed ───
    if r.referral_reason == "abnormal-ecg" && !r.ecg_done {
        flags.push(flag(
            "F-OTHER-001",
            "other",
            "low",
            "Referral reason is an abnormal ECG but no resting ECG is recorded as performed.",
            "Attach the ECG or its findings to support vetting.",
        ));
    }

    // Sort: high > medium > low (stable sort preserves insertion order within a band).
    flags.sort_by_key(|f| priority_order(&f.priority));

    flags
}
