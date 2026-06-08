//! Detection of additional flagged issues.

use super::types::{AdditionalFlag, AssessmentData};
use super::utils::{is_date_past, is_date_within_months};

/// Detect onboarding safety flags. Independent of the rule engine and
/// completion percentage. Sorted high > medium > low.
///
/// Ported 1-to-1 from `flagged-issues.js`.
pub fn detect_additional_flags(data: &AssessmentData) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    // ─── DBS not cleared (HIGH) ─────────────────────────────────
    if data.pre_employment_checks.dbs_check_status == "not-started"
        || data.pre_employment_checks.dbs_check_status.is_empty()
    {
        flags.push(AdditionalFlag {
            id: "FLAG-DBS-001".to_string(),
            category: "Pre-Employment".to_string(),
            message: "DBS check not started - EMPLOYEE MUST NOT START CLINICAL DUTIES"
                .to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Right to work not verified (HIGH) ──────────────────────
    if data.pre_employment_checks.right_to_work_verified == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-RTW-001".to_string(),
            category: "Pre-Employment".to_string(),
            message: "Right to work not verified - EMPLOYMENT CANNOT COMMENCE".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Right to work expiry imminent (HIGH/MEDIUM) ────────────
    let rtw_expiry = &data.pre_employment_checks.right_to_work_expiry_date;
    if !rtw_expiry.is_empty() && is_date_within_months(rtw_expiry, 3) {
        let priority = if is_date_past(rtw_expiry) {
            "high"
        } else {
            "medium"
        };
        flags.push(AdditionalFlag {
            id: "FLAG-RTW-002".to_string(),
            category: "Pre-Employment".to_string(),
            message: format!("Right to work expires {rtw_expiry} - renewal required"),
            priority: priority.to_string(),
        });
    }

    // ─── OH clearance not received (HIGH) ───────────────────────
    if data.occupational_health.oh_clearance_received == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-OH-001".to_string(),
            category: "Occupational Health".to_string(),
            message: "Occupational health clearance not received - employee may not commence patient-facing duties".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Not fit to work (HIGH) ─────────────────────────────────
    if data.occupational_health.fit_to_work == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-OH-002".to_string(),
            category: "Occupational Health".to_string(),
            message: "Employee declared NOT fit to work - CANNOT START".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── OH restrictions (MEDIUM) ───────────────────────────────
    if data.occupational_health.oh_restrictions == "yes" {
        let details = if data
            .occupational_health
            .oh_restriction_details
            .trim()
            .is_empty()
        {
            "details not specified".to_string()
        } else {
            data.occupational_health.oh_restriction_details.clone()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-OH-003".to_string(),
            category: "Occupational Health".to_string(),
            message: format!("Occupational health restrictions: {details}"),
            priority: "medium".to_string(),
        });
    }

    // ─── Professional registration not verified (HIGH) ──────────
    if data.professional_registration.registration_required == "yes"
        && data.professional_registration.registration_verified != "yes"
    {
        let body = if data
            .professional_registration
            .regulatory_body
            .trim()
            .is_empty()
        {
            "body not specified".to_string()
        } else {
            data.professional_registration.regulatory_body.clone()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-REG-001".to_string(),
            category: "Professional Registration".to_string(),
            message: format!(
                "Professional registration not verified ({body}) - MUST NOT PRACTISE"
            ),
            priority: "high".to_string(),
        });
    }

    // ─── Registration expiry (HIGH) ─────────────────────────────
    let reg_expiry = &data.professional_registration.registration_expiry_date;
    if !reg_expiry.is_empty() && is_date_past(reg_expiry) {
        flags.push(AdditionalFlag {
            id: "FLAG-REG-002".to_string(),
            category: "Professional Registration".to_string(),
            message: format!("Professional registration EXPIRED on {reg_expiry}"),
            priority: "high".to_string(),
        });
    }

    // ─── Registration conditions (MEDIUM) ───────────────────────
    if data.professional_registration.registration_conditions == "yes" {
        let details = if data
            .professional_registration
            .registration_condition_details
            .trim()
            .is_empty()
        {
            "details not specified".to_string()
        } else {
            data.professional_registration
                .registration_condition_details
                .clone()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-REG-003".to_string(),
            category: "Professional Registration".to_string(),
            message: format!("Registration has conditions: {details}"),
            priority: "medium".to_string(),
        });
    }

    // ─── Mandatory training incomplete (MEDIUM/HIGH) ────────────
    let training_items: [(&str, &str); 6] = [
        (
            data.mandatory_training.fire_safety_completed.as_str(),
            "Fire Safety",
        ),
        (
            data.mandatory_training
                .infection_control_completed
                .as_str(),
            "Infection Control",
        ),
        (
            data.mandatory_training
                .safeguarding_adults_completed
                .as_str(),
            "Safeguarding Adults",
        ),
        (
            data.mandatory_training
                .safeguarding_children_completed
                .as_str(),
            "Safeguarding Children",
        ),
        (
            data.mandatory_training
                .basic_life_support_completed
                .as_str(),
            "Basic Life Support",
        ),
        (
            data.mandatory_training
                .information_governance_completed
                .as_str(),
            "Information Governance",
        ),
    ];
    let incomplete: Vec<&str> = training_items
        .iter()
        .filter(|(field, _)| *field == "no")
        .map(|(_, name)| *name)
        .collect();
    if !incomplete.is_empty() {
        let priority = if incomplete.len() >= 3 { "high" } else { "medium" };
        flags.push(AdditionalFlag {
            id: "FLAG-TR-001".to_string(),
            category: "Mandatory Training".to_string(),
            message: format!(
                "{} mandatory training module(s) not completed: {}",
                incomplete.len(),
                incomplete.join(", ")
            ),
            priority: priority.to_string(),
        });
    }

    // ─── ID badge not issued (MEDIUM) ───────────────────────────
    if data.uniform_id_badge.id_badge_issued == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-UID-001".to_string(),
            category: "Uniform & ID".to_string(),
            message: "ID badge not yet issued".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── No manager sign-off (MEDIUM) ───────────────────────────
    if data.sign_off_compliance.manager_signed_off == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-SO-001".to_string(),
            category: "Sign-off".to_string(),
            message: "Manager sign-off not yet obtained".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Confidentiality agreement not signed (MEDIUM) ──────────
    if data.sign_off_compliance.confidentiality_agreement_signed == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-SO-002".to_string(),
            category: "Sign-off".to_string(),
            message: "Confidentiality agreement not signed".to_string(),
            priority: "medium".to_string(),
        });
    }

    // Sort: high > medium > low
    flags.sort_by_key(|f| match f.priority.as_str() {
        "high" => 0,
        "medium" => 1,
        "low" => 2,
        _ => 3,
    });

    flags
}
