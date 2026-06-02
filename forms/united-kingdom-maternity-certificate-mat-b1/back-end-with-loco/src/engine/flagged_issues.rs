//! Clinical / administrative flags raised in addition to the rule-based
//! completeness checks.
//!
//!   - Missing certificate number → urgent (cannot be filed by DWP).
//!   - Issued > 20 weeks before EWC → high (DWP will reject).
//!   - Midwife with expired NMC registration on issue date → high.
//!   - Duplicate not marked "DUPLICATE" → medium.
//!   - Examination after EWC on Part A → medium (use Part B instead).
//!   - Both Part A and Part B partially populated → medium.
//!   - Issue date in the future → low (data quality).
//!
//! Pure function: no mutation, no side effects.

use crate::engine::mat_b1_rules::{nmc_expired_before, weeks_between};
use crate::engine::types::{AdditionalFlag, AssessmentData, RulePriority};

pub fn detect_additional_flags(data: &AssessmentData) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    // ─── Urgent: missing certificate number ───────────────
    if data.issuer.certificate_number.trim().is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-CERT-NUMBER-URGENT-001".into(),
            category: "Certificate".into(),
            message:
                "Unique certificate number is missing - the DWP cannot accept a MAT B1 without an official pre-printed certificate number."
                    .into(),
            priority: RulePriority::Urgent,
        });
    }

    // ─── High: issued > 20 weeks before EWC ───────────────
    if data.certificate_type == "pre" {
        if let Some(weeks) = weeks_between(
            &data.pre_confinement.examination_date,
            &data.pre_confinement.expected_date_of_confinement,
        ) {
            if weeks > 20 {
                flags.push(AdditionalFlag {
                    id: "FLAG-EWC-WINDOW-HIGH-001".into(),
                    category: "Timing".into(),
                    message: format!(
                        "Certificate is being issued {weeks} weeks before the expected date of confinement. DWP guidance prohibits issuing a MAT B1 more than 20 weeks before the EWC."
                    ),
                    priority: RulePriority::High,
                });
            }
        }
    }

    // ─── High: midwife with expired NMC registration ──────
    if data.issuer.issuer_type == "midwife"
        && !data.issuer.midwife.nmc_expiry_date.trim().is_empty()
        && !data.issuer.issue_date.trim().is_empty()
        && nmc_expired_before(&data.issuer.midwife.nmc_expiry_date, &data.issuer.issue_date)
    {
        flags.push(AdditionalFlag {
            id: "FLAG-NMC-EXPIRY-HIGH-001".into(),
            category: "Issuer".into(),
            message:
                "Midwife's NMC registration has expired before the certificate issue date. A midwife cannot issue a MAT B1 with lapsed NMC registration."
                    .into(),
            priority: RulePriority::High,
        });
    }

    // ─── Medium: duplicate not marked "DUPLICATE" ─────────
    if data.issuer.is_duplicate == "yes" && data.issuer.duplicate_marker_applied != "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-DUPLICATE-MED-001".into(),
            category: "Duplicate".into(),
            message:
                "Replacement (duplicate) certificate is not marked \"DUPLICATE\". DWP guidance requires the marker on all replacement certificates."
                    .into(),
            priority: RulePriority::Medium,
        });
    }

    // ─── Medium: Part A examination date after EWC ────────
    if data.certificate_type == "pre" {
        if let Some(weeks) = weeks_between(
            &data.pre_confinement.examination_date,
            &data.pre_confinement.expected_date_of_confinement,
        ) {
            if weeks < 0 {
                flags.push(AdditionalFlag {
                    id: "FLAG-PART-A-AFTER-EWC-MED-001".into(),
                    category: "Timing".into(),
                    message:
                        "Part A examination date is after the expected date of confinement. If the baby has been born, switch to Part B (post-confinement)."
                            .into(),
                    priority: RulePriority::Medium,
                });
            }
        }
    }

    // ─── Medium: both Part A and Part B partially populated
    let part_a_started = !data
        .pre_confinement
        .expected_date_of_confinement
        .trim()
        .is_empty()
        || !data.pre_confinement.examination_date.trim().is_empty();
    let part_b_started = !data.post_confinement.actual_date_of_birth.trim().is_empty()
        || !data
            .post_confinement
            .expected_date_of_confinement
            .trim()
            .is_empty();
    if part_a_started && part_b_started {
        flags.push(AdditionalFlag {
            id: "FLAG-PARTS-CONFLICT-MED-001".into(),
            category: "Consistency".into(),
            message:
                "Both Part A and Part B contain data. The MAT B1 form is mutually exclusive - select only one certificate type."
                    .into(),
            priority: RulePriority::Medium,
        });
    }

    // ─── Low: issue date in the future ────────────────────
    if !data.issuer.issue_date.trim().is_empty() {
        if let Ok(issued) =
            chrono::NaiveDate::parse_from_str(data.issuer.issue_date.trim(), "%Y-%m-%d")
        {
            let today = chrono::Utc::now().date_naive();
            if issued > today {
                flags.push(AdditionalFlag {
                    id: "FLAG-FUTURE-ISSUE-LOW-001".into(),
                    category: "Data quality".into(),
                    message:
                        "Issue date is in the future. The MAT B1 should be dated the day it is signed."
                            .into(),
                    priority: RulePriority::Low,
                });
            }
        }
    }

    flags.sort_by_key(|f| f.priority.order());
    flags
}
