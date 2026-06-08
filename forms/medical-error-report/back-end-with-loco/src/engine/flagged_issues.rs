//! Detection of additional flagged issues.

use super::types::{AdditionalFlag, AssessmentData};

/// Detect medical-error-report safety / governance flags. These are
/// emitted in addition to the grading rules. Priority: high > medium > low.
///
/// Flag IDs are preserved verbatim from the JavaScript front-end engine
/// (`flagged-issues.js`).
pub fn detect_additional_flags(data: &AssessmentData) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    // ─── Patient death (HIGH) ──────────────────────────────────
    if data.patient_outcome.patient_died == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-DEATH-001".to_string(),
            category: "Patient Safety".to_string(),
            message: "Patient death reported - IMMEDIATE INVESTIGATION REQUIRED".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Critical WHO severity (HIGH) ──────────────────────────
    if data.error_classification.who_severity == "critical" {
        flags.push(AdditionalFlag {
            id: "FLAG-CRITICAL-001".to_string(),
            category: "Severity".to_string(),
            message: "WHO Critical severity - death or life-threatening event".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── NCC MERP H or I (HIGH) ────────────────────────────────
    let merp = data.error_classification.ncc_merp_category.as_str();
    if merp == "H" || merp == "I" {
        let detail = if merp == "I" {
            "patient death"
        } else {
            "intervention to sustain life"
        };
        flags.push(AdditionalFlag {
            id: "FLAG-MERP-HIGH-001".to_string(),
            category: "NCC MERP".to_string(),
            message: format!("NCC MERP Category {merp} - {detail}"),
            priority: "high".to_string(),
        });
    }

    // ─── Permanent disability (HIGH) ───────────────────────────
    if data.patient_outcome.permanent_disability == "yes" {
        let detail = if data.patient_outcome.disability_details.trim().is_empty() {
            "details not specified".to_string()
        } else {
            data.patient_outcome.disability_details.trim().to_string()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-DISABILITY-001".to_string(),
            category: "Patient Outcome".to_string(),
            message: format!("Permanent disability: {detail}"),
            priority: "high".to_string(),
        });
    }

    // ─── Duty of candour not completed (HIGH) ──────────────────
    if data.patient_involvement.duty_of_candour_applies == "yes"
        && data.patient_involvement.duty_of_candour_completed == "no"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-DOC-001".to_string(),
            category: "Duty of Candour".to_string(),
            message: "Duty of candour applies but NOT YET COMPLETED - urgent action required"
                .to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Clearly preventable (HIGH) ────────────────────────────
    if data.error_classification.preventability == "clearly-preventable" {
        flags.push(AdditionalFlag {
            id: "FLAG-PREVENT-001".to_string(),
            category: "Preventability".to_string(),
            message: "Error was clearly preventable - systemic review recommended".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Recurrence very likely (HIGH) ─────────────────────────
    if data.error_classification.recurrence_likelihood == "very-likely" {
        flags.push(AdditionalFlag {
            id: "FLAG-RECUR-001".to_string(),
            category: "Recurrence".to_string(),
            message: "Recurrence assessed as very likely - immediate corrective action needed"
                .to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Similar incidents previously (MEDIUM) ─────────────────
    if data.root_cause_analysis.similar_incidents == "yes" {
        let detail = if data
            .root_cause_analysis
            .similar_incidents_details
            .trim()
            .is_empty()
        {
            "details not specified".to_string()
        } else {
            data.root_cause_analysis
                .similar_incidents_details
                .trim()
                .to_string()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-SIMILAR-001".to_string(),
            category: "Root Cause".to_string(),
            message: format!("Similar incidents have occurred previously: {detail}"),
            priority: "medium".to_string(),
        });
    }

    // ─── Medication error (MEDIUM) ─────────────────────────────
    if data.error_classification.error_type == "medication" {
        let stage = if data
            .error_classification
            .medication_error_stage
            .trim()
            .is_empty()
        {
            "unspecified".to_string()
        } else {
            data.error_classification
                .medication_error_stage
                .trim()
                .to_string()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-MED-001".to_string(),
            category: "Error Type".to_string(),
            message: format!("Medication error at {stage} stage"),
            priority: "medium".to_string(),
        });
    }

    // ─── Communication failure (MEDIUM) ────────────────────────
    if data.contributing_factors.communication_failure == "yes" {
        let detail = if data
            .contributing_factors
            .communication_failure_details
            .trim()
            .is_empty()
        {
            "details not specified".to_string()
        } else {
            data.contributing_factors
                .communication_failure_details
                .trim()
                .to_string()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-COMM-001".to_string(),
            category: "Contributing Factors".to_string(),
            message: format!("Communication failure: {detail}"),
            priority: "medium".to_string(),
        });
    }

    // ─── Handover failure (MEDIUM) ─────────────────────────────
    if data.contributing_factors.handover_failure == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-HANDOVER-001".to_string(),
            category: "Contributing Factors".to_string(),
            message: "Handover failure contributed to the error".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Policy not followed (MEDIUM) ──────────────────────────
    if data.contributing_factors.policy_not_followed == "yes" {
        let detail = if data.contributing_factors.policy_details.trim().is_empty() {
            "details not specified".to_string()
        } else {
            data.contributing_factors.policy_details.trim().to_string()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-POLICY-001".to_string(),
            category: "Contributing Factors".to_string(),
            message: format!("Policy/protocol not followed: {detail}"),
            priority: "medium".to_string(),
        });
    }

    // ─── Understaffed (MEDIUM) ─────────────────────────────────
    if data.incident_details.staffing_level == "understaffed" {
        flags.push(AdditionalFlag {
            id: "FLAG-STAFF-001".to_string(),
            category: "Staffing".to_string(),
            message: "Unit was understaffed at time of incident".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Extended hospital stay (MEDIUM) ───────────────────────
    if data.patient_outcome.extended_hospital_stay == "yes" {
        let days = match data.patient_outcome.extra_days {
            Some(n) => n.to_string(),
            None => "?".to_string(),
        };
        flags.push(AdditionalFlag {
            id: "FLAG-STAY-001".to_string(),
            category: "Patient Outcome".to_string(),
            message: format!("Extended hospital stay: {days} extra days"),
            priority: "medium".to_string(),
        });
    }

    // ─── Safeguarding referral (MEDIUM) ────────────────────────
    if data.reporting_followup.safeguarding_referral == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-SAFEGUARD-001".to_string(),
            category: "Reporting".to_string(),
            message: "Safeguarding referral made".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Coroner notification (MEDIUM) ─────────────────────────
    if data.reporting_followup.reported_to_coroner == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-CORONER-001".to_string(),
            category: "Reporting".to_string(),
            message: "Incident reported to coroner".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── RCA pending (MEDIUM) ──────────────────────────────────
    if data.root_cause_analysis.rca_conducted == "pending" {
        flags.push(AdditionalFlag {
            id: "FLAG-RCA-001".to_string(),
            category: "Root Cause".to_string(),
            message: "Root cause analysis pending - schedule investigation".to_string(),
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
