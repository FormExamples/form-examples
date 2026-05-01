//! DVLA M1 form — validation rules.
//!
//! Each rule's `evaluate(data)` returns true when the rule *fires* (i.e. a
//! problem is detected). Rules cover three concerns:
//!
//!   1. **Completeness** — required fields must be answered for the active
//!      branch. If Q1 = No, the form stops, so downstream rules are skipped.
//!   2. **Consistency** — Q2 conditions must include `otherDetails` text when
//!      `other = yes`; Q3 dates must be supplied when `hadRecentContact = yes`.
//!   3. **Safety** — selecting the "anxiety/depression with suicidal thoughts"
//!      variant elevates the report to urgent professional review.
//!
//! Pure functions: no side effects.

use crate::engine::types::{is_filled, AssessmentData, RuleCategory, RulePriority};

pub struct ValidationRule {
    pub id: &'static str,
    pub category: RuleCategory,
    pub priority: RulePriority,
    pub description: &'static str,
    pub message: &'static str,
    pub evaluate: fn(&AssessmentData) -> bool,
}

pub fn m1_rules() -> &'static [ValidationRule] {
    &[
        // ─── Part A — Personal details ────────────────────────────
        ValidationRule {
            id: "M1-PD-001",
            category: RuleCategory::Completeness,
            priority: RulePriority::Medium,
            description: "Personal full name must be provided.",
            message: "Full name is missing in Part A (Personal Details).",
            evaluate: |d| !is_filled(&d.personal_details.full_name),
        },
        ValidationRule {
            id: "M1-PD-002",
            category: RuleCategory::Completeness,
            priority: RulePriority::Medium,
            description: "Personal date of birth must be provided.",
            message: "Date of birth is missing in Part A (Personal Details).",
            evaluate: |d| !is_filled(&d.personal_details.date_of_birth),
        },
        ValidationRule {
            id: "M1-PD-003",
            category: RuleCategory::Completeness,
            priority: RulePriority::Medium,
            description: "Personal address must be provided.",
            message: "Address is missing in Part A (Personal Details).",
            evaluate: |d| !is_filled(&d.personal_details.address),
        },
        ValidationRule {
            id: "M1-PD-004",
            category: RuleCategory::Completeness,
            priority: RulePriority::Medium,
            description: "Personal postcode must be provided.",
            message: "Postcode is missing in Part A (Personal Details).",
            evaluate: |d| !is_filled(&d.personal_details.postcode),
        },
        ValidationRule {
            id: "M1-PD-005",
            category: RuleCategory::Completeness,
            priority: RulePriority::Low,
            description: "A contact number is recommended.",
            message: "Contact number is missing in Part A.",
            evaluate: |d| !is_filled(&d.personal_details.contact_number),
        },
        // ─── Part B — Healthcare professionals ────────────────────
        ValidationRule {
            id: "M1-HCP-001",
            category: RuleCategory::Completeness,
            priority: RulePriority::Medium,
            description: "GP name should be provided when a diagnosis is reported.",
            message: "GP name is missing in Part B (GP Details).",
            evaluate: |d| {
                d.diagnosis_confirmation.has_mental_health_diagnosis == "yes"
                    && !is_filled(&d.healthcare_professionals.gp.gp_name)
            },
        },
        ValidationRule {
            id: "M1-HCP-002",
            category: RuleCategory::Completeness,
            priority: RulePriority::Low,
            description: "GP surgery name should be provided when a diagnosis is reported.",
            message: "GP surgery name is missing in Part B.",
            evaluate: |d| {
                d.diagnosis_confirmation.has_mental_health_diagnosis == "yes"
                    && !is_filled(&d.healthcare_professionals.gp.surgery_name)
            },
        },
        ValidationRule {
            id: "M1-HCP-003",
            category: RuleCategory::Completeness,
            priority: RulePriority::Low,
            description: "GP date last seen should be provided when a diagnosis is reported.",
            message: "GP date last seen for this condition is missing in Part B.",
            evaluate: |d| {
                d.diagnosis_confirmation.has_mental_health_diagnosis == "yes"
                    && !is_filled(&d.healthcare_professionals.gp.date_last_seen)
            },
        },
        // ─── Q1 — Diagnosis confirmation ─────────────────────────
        ValidationRule {
            id: "M1-Q1-001",
            category: RuleCategory::Completeness,
            priority: RulePriority::High,
            description: "Q1 (diagnosis confirmation) must be answered.",
            message:
                "Question 1 (have you been diagnosed with a mental health condition) is unanswered.",
            evaluate: |d| d.diagnosis_confirmation.has_mental_health_diagnosis.is_empty(),
        },
        // ─── Q2 — Mental health conditions ────────────────────────
        ValidationRule {
            id: "M1-Q2-001",
            category: RuleCategory::Completeness,
            priority: RulePriority::High,
            description: "Q2 must list at least one condition when Q1 = Yes.",
            message:
                "Question 2 has no condition marked Yes. At least one condition is required when Q1 = Yes.",
            evaluate: |d| {
                if d.diagnosis_confirmation.has_mental_health_diagnosis != "yes" {
                    return false;
                }
                let c = &d.mental_health_conditions;
                let any = c.anxiety_depression_without_impairment == "yes"
                    || c.anxiety_depression_with_impairment == "yes"
                    || c.bipolar_affective_disorder == "yes"
                    || c.eating_disorder == "yes"
                    || c.ocd_or_ptsd == "yes"
                    || c.personality_disorder == "yes"
                    || c.schizophrenia_or_psychosis == "yes"
                    || c.other == "yes";
                !any
            },
        },
        ValidationRule {
            id: "M1-Q2-002",
            category: RuleCategory::Consistency,
            priority: RulePriority::Medium,
            description: "Q2 \"Other\" requires free-text details.",
            message:
                "Question 2 marked \"Other\" as Yes but no details were supplied. Please describe the other condition.",
            evaluate: |d| {
                d.mental_health_conditions.other == "yes"
                    && !is_filled(&d.mental_health_conditions.other_details)
            },
        },
        // ─── Q3 — Recent contact ──────────────────────────────────
        ValidationRule {
            id: "M1-Q3-001",
            category: RuleCategory::Completeness,
            priority: RulePriority::High,
            description: "Q3 (recent contact) must be answered when Q1 = Yes.",
            message: "Question 3 (recent healthcare professional contact) is unanswered.",
            evaluate: |d| {
                d.diagnosis_confirmation.has_mental_health_diagnosis == "yes"
                    && d.recent_contact.had_recent_contact.is_empty()
            },
        },
        ValidationRule {
            id: "M1-Q3-002",
            category: RuleCategory::Consistency,
            priority: RulePriority::Medium,
            description: "Q3 = Yes requires at least one date of contact.",
            message:
                "Question 3 marked Yes but no last-contact date was provided for Doctor, Consultant, or Community psychiatric nurse.",
            evaluate: |d| {
                if d.recent_contact.had_recent_contact != "yes" {
                    return false;
                }
                let r = &d.recent_contact;
                !is_filled(&r.doctor_last_date)
                    && !is_filled(&r.consultant_last_date)
                    && !is_filled(&r.community_psychiatric_nurse_last_date)
            },
        },
        // ─── Authorisation ────────────────────────────────────────
        ValidationRule {
            id: "M1-AUTH-001",
            category: RuleCategory::Declaration,
            priority: RulePriority::High,
            description: "Declaration must be confirmed.",
            message:
                "Applicant's declaration was not confirmed. The form cannot be submitted without authorising medical disclosure.",
            evaluate: |d| d.authorisation.declaration_confirmed != "yes",
        },
        ValidationRule {
            id: "M1-AUTH-002",
            category: RuleCategory::Completeness,
            priority: RulePriority::Medium,
            description: "Signatory name must be provided.",
            message: "Signatory name is missing on the authorisation page.",
            evaluate: |d| !is_filled(&d.authorisation.signatory_name),
        },
        ValidationRule {
            id: "M1-AUTH-003",
            category: RuleCategory::Completeness,
            priority: RulePriority::Medium,
            description: "Signature date must be provided.",
            message: "Signature date is missing on the authorisation page.",
            evaluate: |d| !is_filled(&d.authorisation.signature_date),
        },
    ]
}
