//! UK NHS England FP92A — eligibility rules.
//!
//! Each rule's `evaluate(data)` returns true when the rule *fires*. The
//! rules cover four concerns:
//!
//!   1. EligibleCondition — at least one qualifying condition matches.
//!   2. Disqualifying — diet-only diabetes, temporary disability.
//!   3. Redirect — pregnancy → FW8; age-based exemption; low-income.
//!   4. Completeness — missing required practitioner / patient fields.

use crate::engine::types::{ApplicationData, QualifyingCondition, RuleCategory, RulePriority};

/// True when a string is non-empty after trimming.
pub fn is_filled(value: &str) -> bool {
    !value.trim().is_empty()
}

/// Derive age in whole years from a YYYY-MM-DD birth date relative to today.
/// Returns `None` when the input is missing or unparseable.
pub fn derive_age(birth_date: &str) -> Option<i32> {
    use chrono::Datelike;
    let dob = chrono::NaiveDate::parse_from_str(birth_date.trim(), "%Y-%m-%d").ok()?;
    let today = chrono::Utc::now().date_naive();
    let mut age = today.year() - dob.year();
    // Adjust if today's anniversary has not yet been reached.
    let anniversary =
        chrono::NaiveDate::from_ymd_opt(today.year(), dob.month(), dob.day()).unwrap_or(dob);
    if today < anniversary {
        age -= 1;
    }
    Some(age)
}

/// Look up the patient-declared qualifying condition by code.
pub fn condition_by_code<'a>(
    data: &'a ApplicationData,
    code: &str,
) -> Option<&'a QualifyingCondition> {
    data.conditions
        .iter()
        .find(|c| c.code == code && c.selected == "yes")
}

pub struct ValidationRule {
    pub id: &'static str,
    pub category: RuleCategory,
    pub priority: RulePriority,
    pub description: &'static str,
    pub message: &'static str,
    pub contributing_condition_code: &'static str,
    pub evaluate: fn(&ApplicationData) -> bool,
}

/// The ten NHSBSA qualifying condition codes.
pub const ELIGIBLE_CONDITION_CODES: &[&str] = &[
    "permanent-fistula",
    "hypoadrenalism",
    "diabetes-insipidus-or-hypopituitarism",
    "diabetes-mellitus-not-diet-only",
    "hypoparathyroidism",
    "myasthenia-gravis",
    "myxoedema",
    "epilepsy-on-anticonvulsant",
    "continuing-physical-disability",
    "cancer-or-effects",
];

pub fn fp92a_rules() -> &'static [ValidationRule] {
    &[
        // ─── Eligible-condition rules (one per declared condition) ─────────
        ValidationRule {
            id: "FP92A-EC-PERMANENT-FISTULA",
            category: RuleCategory::EligibleCondition,
            priority: RulePriority::High,
            description: "Patient has a permanent fistula requiring continuous surgical dressing or appliance.",
            message: "Permanent fistula attested by the practitioner — qualifies for FP92A medical exemption.",
            contributing_condition_code: "permanent-fistula",
            evaluate: |d| condition_by_code(d, "permanent-fistula").is_some(),
        },
        ValidationRule {
            id: "FP92A-EC-HYPOADRENALISM",
            category: RuleCategory::EligibleCondition,
            priority: RulePriority::High,
            description: "Hypoadrenalism on substitution therapy (e.g. Addison's disease).",
            message: "Hypoadrenalism on substitution therapy — qualifies for FP92A medical exemption.",
            contributing_condition_code: "hypoadrenalism",
            evaluate: |d| condition_by_code(d, "hypoadrenalism").is_some(),
        },
        ValidationRule {
            id: "FP92A-EC-DIABETES-INSIPIDUS",
            category: RuleCategory::EligibleCondition,
            priority: RulePriority::High,
            description: "Diabetes insipidus or other form of hypopituitarism.",
            message: "Diabetes insipidus / hypopituitarism — qualifies for FP92A medical exemption.",
            contributing_condition_code: "diabetes-insipidus-or-hypopituitarism",
            evaluate: |d| condition_by_code(d, "diabetes-insipidus-or-hypopituitarism").is_some(),
        },
        ValidationRule {
            id: "FP92A-EC-DIABETES-MELLITUS",
            category: RuleCategory::EligibleCondition,
            priority: RulePriority::High,
            description: "Diabetes mellitus (insulin / oral hypoglycaemic, not diet-only).",
            message: "Diabetes mellitus (not diet-only) — qualifies for FP92A medical exemption.",
            contributing_condition_code: "diabetes-mellitus-not-diet-only",
            evaluate: |d| {
                if let Some(c) = condition_by_code(d, "diabetes-mellitus-not-diet-only") {
                    c.diabetes_treatment_mode != "diet-only"
                } else {
                    false
                }
            },
        },
        ValidationRule {
            id: "FP92A-EC-HYPOPARATHYROIDISM",
            category: RuleCategory::EligibleCondition,
            priority: RulePriority::High,
            description: "Hypoparathyroidism.",
            message: "Hypoparathyroidism — qualifies for FP92A medical exemption.",
            contributing_condition_code: "hypoparathyroidism",
            evaluate: |d| condition_by_code(d, "hypoparathyroidism").is_some(),
        },
        ValidationRule {
            id: "FP92A-EC-MYASTHENIA-GRAVIS",
            category: RuleCategory::EligibleCondition,
            priority: RulePriority::High,
            description: "Myasthenia gravis.",
            message: "Myasthenia gravis — qualifies for FP92A medical exemption.",
            contributing_condition_code: "myasthenia-gravis",
            evaluate: |d| condition_by_code(d, "myasthenia-gravis").is_some(),
        },
        ValidationRule {
            id: "FP92A-EC-MYXOEDEMA",
            category: RuleCategory::EligibleCondition,
            priority: RulePriority::High,
            description: "Myxoedema (hypothyroidism) requiring thyroid hormone replacement.",
            message: "Myxoedema on thyroid replacement — qualifies for FP92A medical exemption.",
            contributing_condition_code: "myxoedema",
            evaluate: |d| condition_by_code(d, "myxoedema").is_some(),
        },
        ValidationRule {
            id: "FP92A-EC-EPILEPSY",
            category: RuleCategory::EligibleCondition,
            priority: RulePriority::High,
            description: "Epilepsy requiring continuous anticonvulsive therapy.",
            message: "Epilepsy on continuous anticonvulsant — qualifies for FP92A medical exemption.",
            contributing_condition_code: "epilepsy-on-anticonvulsant",
            evaluate: |d| {
                if let Some(c) = condition_by_code(d, "epilepsy-on-anticonvulsant") {
                    c.continuous_anticonvulsant_therapy != "no"
                } else {
                    false
                }
            },
        },
        ValidationRule {
            id: "FP92A-EC-DISABILITY",
            category: RuleCategory::EligibleCondition,
            priority: RulePriority::High,
            description: "Continuing physical disability — cannot leave home unaided.",
            message: "Continuing physical disability with home-care attestation — qualifies for FP92A medical exemption.",
            contributing_condition_code: "continuing-physical-disability",
            evaluate: |d| {
                if let Some(c) = condition_by_code(d, "continuing-physical-disability") {
                    c.cannot_leave_home_unaided == "yes"
                        && c.disability_expected_to_be_permanent != "no"
                } else {
                    false
                }
            },
        },
        ValidationRule {
            id: "FP92A-EC-CANCER",
            category: RuleCategory::EligibleCondition,
            priority: RulePriority::High,
            description: "Undergoing cancer treatment, or affected by cancer / treatment effects.",
            message: "Cancer or effects of cancer treatment — qualifies for FP92A medical exemption.",
            contributing_condition_code: "cancer-or-effects",
            evaluate: |d| {
                if let Some(c) = condition_by_code(d, "cancer-or-effects") {
                    c.histology_confirmed != "pending"
                } else {
                    false
                }
            },
        },
        // ─── Disqualifying rules ──────────────────────────────────────────
        ValidationRule {
            id: "FP92A-DQ-DIET-ONLY-DIABETES",
            category: RuleCategory::Disqualifying,
            priority: RulePriority::Medium,
            description: "Diet-only diabetes is explicitly excluded from FP92A eligibility.",
            message: "Diet-only diabetes is not eligible for FP92A. Advise the patient that a medical exemption certificate is not available for diet-controlled diabetes.",
            contributing_condition_code: "diabetes-mellitus-not-diet-only",
            evaluate: |d| {
                if let Some(c) = condition_by_code(d, "diabetes-mellitus-not-diet-only") {
                    c.diabetes_treatment_mode == "diet-only"
                } else {
                    false
                }
            },
        },
        ValidationRule {
            id: "FP92A-DQ-TEMPORARY-DISABILITY",
            category: RuleCategory::Disqualifying,
            priority: RulePriority::Medium,
            description: "Temporary disability (e.g. broken leg) is excluded.",
            message: "Temporary disability is not eligible for FP92A — only continuing physical disability qualifies.",
            contributing_condition_code: "continuing-physical-disability",
            evaluate: |d| {
                if let Some(c) = condition_by_code(d, "continuing-physical-disability") {
                    c.disability_expected_to_be_permanent == "no"
                } else {
                    false
                }
            },
        },
        // ─── Redirect rules ───────────────────────────────────────────────
        ValidationRule {
            id: "FP92A-RD-PREGNANCY",
            category: RuleCategory::Redirect,
            priority: RulePriority::High,
            description: "Patient is pregnant or post-partum within 12 months — direct to FW8.",
            message: "Patient is pregnant (or within 12 months post-partum). The FW8 maternity exemption is the correct route — FP92A is not required.",
            contributing_condition_code: "",
            evaluate: |d| {
                d.patient.pregnancy_status == "pregnant"
                    || d.patient.pregnancy_status == "post-partum-within-12-months"
            },
        },
        ValidationRule {
            id: "FP92A-RD-AGE-EXEMPTION",
            category: RuleCategory::Redirect,
            priority: RulePriority::Medium,
            description: "Patient is age-exempt (under 16, 16-18 in full-time education, or 60+).",
            message: "Patient is already eligible for free prescriptions on age grounds — FP92A is not required.",
            contributing_condition_code: "",
            evaluate: |d| {
                match derive_age(&d.patient.birth_date) {
                    Some(age) if age < 16 => true,
                    Some(age) if (16..=18).contains(&age)
                        && d.patient.full_time_education == "yes" => true,
                    Some(age) if age >= 60 => true,
                    _ => false,
                }
            },
        },
        // ─── Completeness rules ───────────────────────────────────────────
        ValidationRule {
            id: "FP92A-CP-PATIENT-NHS-NUMBER",
            category: RuleCategory::Completeness,
            priority: RulePriority::High,
            description: "Patient NHS number must be provided for NHSBSA matching.",
            message: "Patient NHS number is missing. NHSBSA needs the NHS number to match the application to the patient record.",
            contributing_condition_code: "",
            evaluate: |d| !is_filled(&d.patient.united_kingdom_nhs_number),
        },
        ValidationRule {
            id: "FP92A-CP-PATIENT-SURNAME",
            category: RuleCategory::Completeness,
            priority: RulePriority::High,
            description: "Patient surname must be provided.",
            message: "Patient surname is missing.",
            contributing_condition_code: "",
            evaluate: |d| !is_filled(&d.patient.surname),
        },
        ValidationRule {
            id: "FP92A-CP-PATIENT-FORENAMES",
            category: RuleCategory::Completeness,
            priority: RulePriority::High,
            description: "Patient forenames must be provided.",
            message: "Patient forenames are missing.",
            contributing_condition_code: "",
            evaluate: |d| !is_filled(&d.patient.forenames),
        },
        ValidationRule {
            id: "FP92A-CP-PATIENT-BIRTHDATE",
            category: RuleCategory::Completeness,
            priority: RulePriority::High,
            description: "Patient date of birth must be provided.",
            message: "Patient date of birth is missing — required to derive age-based exemption status.",
            contributing_condition_code: "",
            evaluate: |d| !is_filled(&d.patient.birth_date),
        },
        ValidationRule {
            id: "FP92A-CP-PATIENT-ADDRESS",
            category: RuleCategory::Completeness,
            priority: RulePriority::High,
            description: "Patient postal address must be provided.",
            message: "Patient postal address is missing — NHSBSA posts the issued certificate to this address.",
            contributing_condition_code: "",
            evaluate: |d| !is_filled(&d.patient.postal_address_as_full_text),
        },
        ValidationRule {
            id: "FP92A-CP-PRACTITIONER-NAME",
            category: RuleCategory::Completeness,
            priority: RulePriority::High,
            description: "Practitioner name must be provided.",
            message: "Practitioner name is missing.",
            contributing_condition_code: "",
            evaluate: |d| !is_filled(&d.practitioner.name),
        },
        ValidationRule {
            id: "FP92A-CP-PRACTITIONER-REGISTRATION",
            category: RuleCategory::Completeness,
            priority: RulePriority::High,
            description: "Practitioner registration body and number must be provided.",
            message: "Practitioner registration body (GMC / NMC / HCPC / GPhC) and number are required.",
            contributing_condition_code: "",
            evaluate: |d| {
                !is_filled(&d.practitioner.registration_body)
                    || !is_filled(&d.practitioner.registration_number)
            },
        },
        ValidationRule {
            id: "FP92A-CP-PRACTITIONER-PRACTICE",
            category: RuleCategory::Completeness,
            priority: RulePriority::Medium,
            description: "Practitioner practice / surgery name must be provided.",
            message: "Practitioner practice / surgery name is missing.",
            contributing_condition_code: "",
            evaluate: |d| !is_filled(&d.practitioner.practice_name),
        },
        ValidationRule {
            id: "FP92A-CP-NO-CONDITION-SELECTED",
            category: RuleCategory::Completeness,
            priority: RulePriority::Urgent,
            description: "At least one qualifying condition must be selected.",
            message: "No qualifying condition has been selected. FP92A requires at least one of the ten NHSBSA-recognised conditions.",
            contributing_condition_code: "",
            evaluate: |d| {
                !d.conditions.iter().any(|c| c.selected == "yes")
            },
        },
        ValidationRule {
            id: "FP92A-CP-PRACTITIONER-SIGNATURE",
            category: RuleCategory::Completeness,
            priority: RulePriority::Urgent,
            description: "Practitioner must declare the certificate has been signed in ink.",
            message: "Practitioner signature has not been confirmed. NHSBSA only accepts FP92A forms signed in ink by the practitioner.",
            contributing_condition_code: "",
            evaluate: |d| d.declaration.signature_present != "yes",
        },
        ValidationRule {
            id: "FP92A-CP-PRACTITIONER-RECORDS",
            category: RuleCategory::Completeness,
            priority: RulePriority::High,
            description: "Practitioner must attest to having access to the patient's medical records.",
            message: "Practitioner has not attested to having access to the patient's medical records — required by NHSBSA.",
            contributing_condition_code: "",
            evaluate: |d| d.declaration.access_to_medical_records != "yes",
        },
        // ─── Renewal rules ────────────────────────────────────────────────
        ValidationRule {
            id: "FP92A-RN-ACTIVE-CERTIFICATE",
            category: RuleCategory::Renewal,
            priority: RulePriority::Medium,
            description: "An active certificate is already on file for this patient.",
            message: "Patient has reported an active medical exemption certificate. Renewal should be timed to fall within the renewal window (typically the last 30 days of validity).",
            contributing_condition_code: "",
            evaluate: |d| {
                d.existing_exemption.has_existing_certificate == "yes"
                    && d.existing_exemption.application_kind != "renewal"
                    && d.existing_exemption.application_kind != "replacement"
            },
        },
    ]
}
