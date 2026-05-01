//! UK MAT B1 maternity certificate — validation rules.
//!
//! Each rule's `evaluate(data)` returns true when the rule *fires* (i.e. a
//! problem is detected). Ported from the TypeScript engine in
//! `front-end-form-with-svelte/src/lib/engine/mat-b1-rules.ts`.
//!
//! Rules cover four concerns:
//!
//!   1. Completeness — required fields for the active branch.
//!   2. Consistency — Part A / Part B mutual exclusion, duplicate marker.
//!   3. Timing — DWP guidance: not more than 20 weeks before EWC.
//!   4. Declaration — completed in ink, valid NMC registration for midwives.

use crate::engine::types::{AssessmentData, RuleCategory, RulePriority};

/// Whole weeks between two YYYY-MM-DD dates (later - earlier). `None` when
/// either input is missing or unparseable.
pub fn weeks_between(earlier: &str, later: &str) -> Option<i64> {
    if earlier.trim().is_empty() || later.trim().is_empty() {
        return None;
    }
    let a = chrono::NaiveDate::parse_from_str(earlier.trim(), "%Y-%m-%d").ok()?;
    let b = chrono::NaiveDate::parse_from_str(later.trim(), "%Y-%m-%d").ok()?;
    let days = (b - a).num_days();
    Some(days.div_euclid(7))
}

/// True when a string is non-empty after trimming.
pub fn is_filled(value: &str) -> bool {
    !value.trim().is_empty()
}

/// True when `expiry` precedes `issued` (strict). Both must parse as
/// YYYY-MM-DD; otherwise returns false.
pub fn nmc_expired_before(expiry: &str, issued: &str) -> bool {
    let Some(e) = chrono::NaiveDate::parse_from_str(expiry.trim(), "%Y-%m-%d").ok() else {
        return false;
    };
    let Some(i) = chrono::NaiveDate::parse_from_str(issued.trim(), "%Y-%m-%d").ok() else {
        return false;
    };
    e < i
}

pub struct ValidationRule {
    pub id: &'static str,
    pub category: RuleCategory,
    pub priority: RulePriority,
    pub description: &'static str,
    pub message: &'static str,
    pub evaluate: fn(&AssessmentData) -> bool,
}

pub fn mat_b1_rules() -> &'static [ValidationRule] {
    &[
        // ─── Patient identification ──────────────────────────
        ValidationRule {
            id: "MATB1-PT-001",
            category: RuleCategory::Completeness,
            priority: RulePriority::High,
            description: "Patient name must be provided on the front page.",
            message: "Patient's name is missing on the front page (above Part A).",
            evaluate: |d| !is_filled(&d.patient_identification.patient_name),
        },
        // ─── Certificate type selection ──────────────────────
        ValidationRule {
            id: "MATB1-CERT-001",
            category: RuleCategory::Completeness,
            priority: RulePriority::High,
            description:
                "Either Part A (pre-confinement) or Part B (post-confinement) must be selected.",
            message:
                "Certificate type is not selected. Choose Part A (pre-confinement) or Part B (post-confinement) - they are mutually exclusive.",
            evaluate: |d| d.certificate_type.is_empty(),
        },
        // ─── Part A — Pre-confinement ────────────────────────
        ValidationRule {
            id: "MATB1-A-001",
            category: RuleCategory::Completeness,
            priority: RulePriority::High,
            description: "Part A: expected date of confinement must be provided.",
            message:
                "Part A: expected date of confinement (EWC) is missing. The EWC is required for SMP and Maternity Allowance entitlement.",
            evaluate: |d| {
                d.certificate_type == "pre"
                    && !is_filled(&d.pre_confinement.expected_date_of_confinement)
            },
        },
        ValidationRule {
            id: "MATB1-A-002",
            category: RuleCategory::Completeness,
            priority: RulePriority::Medium,
            description: "Part A: examination date must be provided.",
            message: "Part A: examination date is missing.",
            evaluate: |d| {
                d.certificate_type == "pre" && !is_filled(&d.pre_confinement.examination_date)
            },
        },
        ValidationRule {
            id: "MATB1-A-003",
            category: RuleCategory::Timing,
            priority: RulePriority::High,
            description:
                "Part A: certificate must not be issued more than 20 weeks before the EWC.",
            message:
                "Part A: examination date is more than 20 weeks before the expected date of confinement. DWP guidance prohibits issuing a MAT B1 this early.",
            evaluate: |d| {
                if d.certificate_type != "pre" {
                    return false;
                }
                match weeks_between(
                    &d.pre_confinement.examination_date,
                    &d.pre_confinement.expected_date_of_confinement,
                ) {
                    Some(w) => w > 20,
                    None => false,
                }
            },
        },
        ValidationRule {
            id: "MATB1-A-004",
            category: RuleCategory::Consistency,
            priority: RulePriority::Medium,
            description: "Part A: examination date should not be after the EWC.",
            message:
                "Part A: examination date is after the expected date of confinement. Use Part B (post-confinement) once the baby has been born.",
            evaluate: |d| {
                if d.certificate_type != "pre" {
                    return false;
                }
                match weeks_between(
                    &d.pre_confinement.examination_date,
                    &d.pre_confinement.expected_date_of_confinement,
                ) {
                    Some(w) => w < 0,
                    None => false,
                }
            },
        },
        // ─── Part B — Post-confinement ───────────────────────
        ValidationRule {
            id: "MATB1-B-001",
            category: RuleCategory::Completeness,
            priority: RulePriority::High,
            description: "Part B: baby's actual date of birth must be provided.",
            message: "Part B: baby's actual date of birth is missing.",
            evaluate: |d| {
                d.certificate_type == "post"
                    && !is_filled(&d.post_confinement.actual_date_of_birth)
            },
        },
        ValidationRule {
            id: "MATB1-B-002",
            category: RuleCategory::Completeness,
            priority: RulePriority::High,
            description: "Part B: expected date of confinement must be provided.",
            message:
                "Part B: expected date of confinement is missing. Entitlement still depends on the EWC even when the certificate is issued post-birth.",
            evaluate: |d| {
                d.certificate_type == "post"
                    && !is_filled(&d.post_confinement.expected_date_of_confinement)
            },
        },
        ValidationRule {
            id: "MATB1-B-003",
            category: RuleCategory::Consistency,
            priority: RulePriority::Medium,
            description:
                "Part B: actual date of birth should not be earlier than 16 weeks before the EWC (extreme prematurity sanity check).",
            message:
                "Part B: actual date of birth is more than 16 weeks before the expected date of confinement - please double-check both dates.",
            evaluate: |d| {
                if d.certificate_type != "post" {
                    return false;
                }
                match weeks_between(
                    &d.post_confinement.actual_date_of_birth,
                    &d.post_confinement.expected_date_of_confinement,
                ) {
                    Some(w) => w > 16,
                    None => false,
                }
            },
        },
        // ─── Issuer type selection ───────────────────────────
        ValidationRule {
            id: "MATB1-ISS-001",
            category: RuleCategory::Completeness,
            priority: RulePriority::High,
            description: "Issuer type (doctor or registered midwife) must be selected.",
            message:
                "Issuer type is not selected. The MAT B1 must be signed by either a doctor or a registered midwife.",
            evaluate: |d| d.issuer.issuer_type.is_empty(),
        },
        // ─── Doctor issuer ───────────────────────────────────
        ValidationRule {
            id: "MATB1-DR-001",
            category: RuleCategory::Completeness,
            priority: RulePriority::High,
            description: "Doctor: doctor's name must be provided.",
            message: "Doctor: doctor's name is missing on the issuer details.",
            evaluate: |d| {
                d.issuer.issuer_type == "doctor" && !is_filled(&d.issuer.doctor.doctor_name)
            },
        },
        ValidationRule {
            id: "MATB1-DR-002",
            category: RuleCategory::Completeness,
            priority: RulePriority::Medium,
            description: "Doctor: practice name must be provided.",
            message: "Doctor: practice name is missing.",
            evaluate: |d| {
                d.issuer.issuer_type == "doctor" && !is_filled(&d.issuer.doctor.practice_name)
            },
        },
        ValidationRule {
            id: "MATB1-DR-003",
            category: RuleCategory::Completeness,
            priority: RulePriority::Medium,
            description: "Doctor: practice address must be provided.",
            message: "Doctor: practice address is missing.",
            evaluate: |d| {
                d.issuer.issuer_type == "doctor"
                    && !is_filled(&d.issuer.doctor.practice_address)
            },
        },
        ValidationRule {
            id: "MATB1-DR-004",
            category: RuleCategory::Declaration,
            priority: RulePriority::High,
            description: "Doctor: name-and-address stamp must be applied.",
            message:
                "Doctor: name-and-address stamp has not been confirmed as applied. DWP guidance requires the official stamp on every MAT B1.",
            evaluate: |d| {
                d.issuer.issuer_type == "doctor" && d.issuer.doctor.stamp_applied != "yes"
            },
        },
        // ─── Midwife issuer ──────────────────────────────────
        ValidationRule {
            id: "MATB1-MW-001",
            category: RuleCategory::Completeness,
            priority: RulePriority::High,
            description: "Midwife: midwife's name must be provided.",
            message: "Midwife: midwife's name is missing.",
            evaluate: |d| {
                d.issuer.issuer_type == "midwife" && !is_filled(&d.issuer.midwife.midwife_name)
            },
        },
        ValidationRule {
            id: "MATB1-MW-002",
            category: RuleCategory::Completeness,
            priority: RulePriority::High,
            description: "Midwife: NMC personal identification number (PIN) must be provided.",
            message:
                "Midwife: NMC personal identification number (PIN) is missing. Required by DWP for all midwife-issued MAT B1 forms.",
            evaluate: |d| {
                d.issuer.issuer_type == "midwife" && !is_filled(&d.issuer.midwife.nmc_pin)
            },
        },
        ValidationRule {
            id: "MATB1-MW-003",
            category: RuleCategory::Completeness,
            priority: RulePriority::High,
            description: "Midwife: NMC registration expiry date must be provided.",
            message: "Midwife: NMC registration expiry date is missing.",
            evaluate: |d| {
                d.issuer.issuer_type == "midwife"
                    && !is_filled(&d.issuer.midwife.nmc_expiry_date)
            },
        },
        ValidationRule {
            id: "MATB1-MW-004",
            category: RuleCategory::Declaration,
            priority: RulePriority::High,
            description: "Midwife: NMC registration must not have expired on the issue date.",
            message:
                "Midwife: NMC registration expired before the issue date. A MAT B1 cannot be signed by a midwife with lapsed NMC registration.",
            evaluate: |d| {
                if d.issuer.issuer_type != "midwife" {
                    return false;
                }
                if !is_filled(&d.issuer.midwife.nmc_expiry_date)
                    || !is_filled(&d.issuer.issue_date)
                {
                    return false;
                }
                nmc_expired_before(&d.issuer.midwife.nmc_expiry_date, &d.issuer.issue_date)
            },
        },
        // ─── Certificate-level rules ─────────────────────────
        ValidationRule {
            id: "MATB1-DOC-001",
            category: RuleCategory::Completeness,
            priority: RulePriority::Urgent,
            description: "Unique certificate number must be recorded.",
            message:
                "Unique certificate number is missing. Every MAT B1 must use an officially supplied form bearing a unique certificate number.",
            evaluate: |d| !is_filled(&d.issuer.certificate_number),
        },
        ValidationRule {
            id: "MATB1-DOC-002",
            category: RuleCategory::Completeness,
            priority: RulePriority::High,
            description: "Issue date must be recorded.",
            message: "Issue date (the date the certificate is signed) is missing.",
            evaluate: |d| !is_filled(&d.issuer.issue_date),
        },
        ValidationRule {
            id: "MATB1-DOC-003",
            category: RuleCategory::Declaration,
            priority: RulePriority::Medium,
            description: "Certificate must be confirmed completed in ink.",
            message:
                "Confirmation that the certificate has been completed in ink is missing. DWP guidance requires ink (not pencil).",
            evaluate: |d| d.issuer.completed_in_ink != "yes",
        },
        ValidationRule {
            id: "MATB1-DUP-001",
            category: RuleCategory::Consistency,
            priority: RulePriority::Medium,
            description:
                "Duplicate marker must be applied when the certificate is a duplicate.",
            message:
                "Duplicate certificate is not marked \"DUPLICATE\". Replacements for lost or incomplete originals must carry the DUPLICATE marker.",
            evaluate: |d| {
                d.issuer.is_duplicate == "yes" && d.issuer.duplicate_marker_applied != "yes"
            },
        },
    ]
}
