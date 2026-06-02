use super::types::{AdditionalFlag, AssessmentData};

/// Detect HR / security / contract priority flags. Independent of the
/// rule engine; raises alerts about safety-, security-, and
/// contract-critical offboarding items.
///
/// Priority bands:
///   high   — Access not revoked, equipment not returned, no NDA
///            reaffirmation, unauthorised data download detected.
///   medium — Knowledge transfer incomplete, no exit interview, payroll
///            details outstanding.
///   low    — Forwarding address missing, references undeclined.
pub fn detect_additional_flags(data: &AssessmentData) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    // ─── Unauthorised data download (HIGH) ──────────────────────
    if data.access_revocation.unauthorised_download_detected == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-AC-001".to_string(),
            category: "Access Revocation".to_string(),
            message: "Unauthorised data download detected during offboarding audit - escalate to data protection officer".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Access not revoked (HIGH) ──────────────────────────────
    let access_items: Vec<(&str, &str)> = vec![
        (&data.access_revocation.email_revoked, "Email"),
        (&data.access_revocation.ehr_epr_revoked, "EHR / EPR"),
        (&data.access_revocation.vpn_revoked, "VPN"),
        (
            &data.access_revocation.active_directory_disabled,
            "Active Directory",
        ),
        (&data.access_revocation.building_access_revoked, "Building access"),
        (&data.access_revocation.cloud_apps_revoked, "Cloud apps"),
    ];
    let outstanding_access: Vec<&str> = access_items
        .iter()
        .filter(|(v, _)| *v != "yes")
        .map(|(_, n)| *n)
        .collect();
    if !outstanding_access.is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-AC-002".to_string(),
            category: "Access Revocation".to_string(),
            message: format!(
                "{} access channel(s) not yet revoked: {} - SECURITY RISK",
                outstanding_access.len(),
                outstanding_access.join(", ")
            ),
            priority: "high".to_string(),
        });
    }

    // ─── Data download audit not performed (HIGH) ───────────────
    if data.access_revocation.data_download_audit_performed != "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-AC-003".to_string(),
            category: "Access Revocation".to_string(),
            message: "Data download / export audit not performed before access revocation"
                .to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Equipment not returned (HIGH) ──────────────────────────
    let equip_items: Vec<(&str, &str)> = vec![
        (&data.equipment_return.laptop_returned, "Laptop"),
        (&data.equipment_return.mobile_phone_returned, "Mobile phone"),
        (&data.equipment_return.id_badge_returned, "ID badge"),
        (&data.equipment_return.keys_returned, "Keys"),
    ];
    let outstanding_equip: Vec<&str> = equip_items
        .iter()
        .filter(|(v, _)| *v != "yes" && *v != "na")
        .map(|(_, n)| *n)
        .collect();
    if !outstanding_equip.is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-EQ-001".to_string(),
            category: "Equipment Return".to_string(),
            message: format!(
                "{} item(s) of equipment not returned: {}",
                outstanding_equip.len(),
                outstanding_equip.join(", ")
            ),
            priority: "high".to_string(),
        });
    }

    // ─── No NDA reaffirmation (HIGH) ────────────────────────────
    if data.non_disclosure_post_employment.confidentiality_reaffirmed != "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-NDA-001".to_string(),
            category: "Non-Disclosure & Post-Employment".to_string(),
            message: "Confidentiality / NDA not reaffirmed - patient data and trade secrets at risk".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Data not returned/destroyed (HIGH) ─────────────────────
    if data.non_disclosure_post_employment.data_returned_or_destroyed != "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-NDA-002".to_string(),
            category: "Non-Disclosure & Post-Employment".to_string(),
            message: "Organisational data not yet returned or destroyed".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Knowledge transfer incomplete (MEDIUM) ─────────────────
    let kt_items: Vec<&str> = vec![
        &data.knowledge_transfer.successor_identified,
        &data.knowledge_transfer.handover_document_created,
        &data.knowledge_transfer.work_in_progress_documented,
        &data.knowledge_transfer.clinical_caseload_reassigned,
    ];
    let kt_outstanding = kt_items.iter().filter(|v| **v != "yes").count();
    if kt_outstanding > 0 {
        flags.push(AdditionalFlag {
            id: "FLAG-KT-001".to_string(),
            category: "Knowledge Transfer".to_string(),
            message: format!(
                "Knowledge transfer incomplete ({} item(s) outstanding) - service continuity at risk",
                kt_outstanding
            ),
            priority: "medium".to_string(),
        });
    }

    // ─── No exit interview (MEDIUM) ─────────────────────────────
    if data.exit_interview.interview_completed != "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-EXI-001".to_string(),
            category: "Exit Interview".to_string(),
            message: "Exit interview not completed - feedback opportunity missed".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Payroll details outstanding (MEDIUM) ───────────────────
    let pay_items: Vec<&str> = vec![
        &data.final_payroll_benefits.final_salary_calculated,
        &data.final_payroll_benefits.accrued_holiday_paid,
        &data.final_payroll_benefits.p45_issued,
    ];
    let pay_outstanding = pay_items.iter().filter(|v| **v != "yes").count();
    if pay_outstanding > 0 {
        flags.push(AdditionalFlag {
            id: "FLAG-PAY-001".to_string(),
            category: "Final Payroll & Benefits".to_string(),
            message: format!(
                "Payroll items outstanding ({}) - final salary, holiday pay, or P45 not yet issued",
                pay_outstanding
            ),
            priority: "medium".to_string(),
        });
    }

    // ─── Forwarding address missing (LOW) ───────────────────────
    if data.forwarding_details.forwarding_address_line1.trim().is_empty()
        || data.forwarding_details.forwarding_postcode.trim().is_empty()
    {
        flags.push(AdditionalFlag {
            id: "FLAG-FWD-001".to_string(),
            category: "Forwarding Details".to_string(),
            message: "Forwarding address not recorded - P60 / future correspondence may not reach employee".to_string(),
            priority: "low".to_string(),
        });
    }

    // ─── References position not declared (LOW) ─────────────────
    if data.references_recommendations.reference_consent_given.is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-REF-001".to_string(),
            category: "References & Recommendations".to_string(),
            message: "Employee position on references not declared (consent neither given nor declined)".to_string(),
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
