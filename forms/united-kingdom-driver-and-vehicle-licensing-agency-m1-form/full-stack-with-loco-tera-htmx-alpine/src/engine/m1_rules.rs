use super::types::AssessmentData;
use super::utils::is_filled;

/// A declarative validation rule. `evaluate(d)` returns true when the rule
/// fires (a problem is detected for the assessment).
///
/// Ported 1:1 from `front-end-form-with-html/js/m1-rules.js`.
pub struct M1Rule {
    pub id: &'static str,
    pub category: &'static str,
    pub priority: &'static str,
    pub description: &'static str,
    pub message: &'static str,
    pub evaluate: fn(&AssessmentData) -> bool,
}

/// All DVLA M1 validation rules. Rule IDs are stable identifiers preserved
/// verbatim from the front-end source.
pub fn all_rules() -> Vec<M1Rule> {
    vec![
        // ─── Part A — Personal details ──────────────────────────────
        M1Rule {
            id: "M1-PD-001",
            category: "completeness",
            priority: "medium",
            description: "Personal full name must be provided.",
            message: "Full name is missing in Part A (Personal Details).",
            evaluate: |d| !is_filled(&d.personal_details.full_name),
        },
        M1Rule {
            id: "M1-PD-002",
            category: "completeness",
            priority: "medium",
            description: "Personal date of birth must be provided.",
            message: "Date of birth is missing in Part A (Personal Details).",
            evaluate: |d| !is_filled(&d.personal_details.date_of_birth),
        },
        M1Rule {
            id: "M1-PD-003",
            category: "completeness",
            priority: "medium",
            description: "Personal address must be provided.",
            message: "Address is missing in Part A (Personal Details).",
            evaluate: |d| !is_filled(&d.personal_details.address),
        },
        M1Rule {
            id: "M1-PD-004",
            category: "completeness",
            priority: "medium",
            description: "Personal postcode must be provided.",
            message: "Postcode is missing in Part A (Personal Details).",
            evaluate: |d| !is_filled(&d.personal_details.postcode),
        },
        M1Rule {
            id: "M1-PD-005",
            category: "completeness",
            priority: "low",
            description: "A contact number is recommended.",
            message: "Contact number is missing in Part A.",
            evaluate: |d| !is_filled(&d.personal_details.contact_number),
        },
        // ─── Part B — Healthcare professionals ──────────────────────
        M1Rule {
            id: "M1-HCP-001",
            category: "completeness",
            priority: "medium",
            description: "GP name should be provided when a diagnosis is reported.",
            message: "GP name is missing in Part B (GP Details).",
            evaluate: |d| {
                d.diagnosis_confirmation.has_mental_health_diagnosis == "yes"
                    && !is_filled(&d.healthcare_professionals.gp.gp_name)
            },
        },
        M1Rule {
            id: "M1-HCP-002",
            category: "completeness",
            priority: "low",
            description: "GP surgery name should be provided when a diagnosis is reported.",
            message: "GP surgery name is missing in Part B.",
            evaluate: |d| {
                d.diagnosis_confirmation.has_mental_health_diagnosis == "yes"
                    && !is_filled(&d.healthcare_professionals.gp.surgery_name)
            },
        },
        M1Rule {
            id: "M1-HCP-003",
            category: "completeness",
            priority: "low",
            description: "GP date last seen should be provided when a diagnosis is reported.",
            message: "GP date last seen for this condition is missing in Part B.",
            evaluate: |d| {
                d.diagnosis_confirmation.has_mental_health_diagnosis == "yes"
                    && !is_filled(&d.healthcare_professionals.gp.date_last_seen)
            },
        },
        // ─── Q1 — Diagnosis confirmation ────────────────────────────
        M1Rule {
            id: "M1-Q1-001",
            category: "completeness",
            priority: "high",
            description: "Q1 (diagnosis confirmation) must be answered.",
            message: "Question 1 (have you been diagnosed with a mental health condition) is unanswered.",
            evaluate: |d| d.diagnosis_confirmation.has_mental_health_diagnosis.is_empty(),
        },
        // ─── Q2 — Mental health conditions ──────────────────────────
        M1Rule {
            id: "M1-Q2-001",
            category: "completeness",
            priority: "high",
            description: "Q2 must list at least one condition when Q1 = Yes.",
            message: "Question 2 has no condition marked Yes. At least one condition is required when Q1 = Yes.",
            evaluate: |d| {
                if d.diagnosis_confirmation.has_mental_health_diagnosis != "yes" {
                    return false;
                }
                let c = &d.mental_health_conditions;
                let any_selected = c.anxiety_depression_without_impairment == "yes"
                    || c.anxiety_depression_with_impairment == "yes"
                    || c.bipolar_affective_disorder == "yes"
                    || c.eating_disorder == "yes"
                    || c.ocd_or_ptsd == "yes"
                    || c.personality_disorder == "yes"
                    || c.schizophrenia_or_psychosis == "yes"
                    || c.other == "yes";
                !any_selected
            },
        },
        M1Rule {
            id: "M1-Q2-002",
            category: "consistency",
            priority: "medium",
            description: "Q2 \"Other\" requires free-text details.",
            message: "Question 2 marked \"Other\" as Yes but no details were supplied. Please describe the other condition.",
            evaluate: |d| {
                d.mental_health_conditions.other == "yes"
                    && !is_filled(&d.mental_health_conditions.other_details)
            },
        },
        // ─── Q3 — Recent contact ────────────────────────────────────
        M1Rule {
            id: "M1-Q3-001",
            category: "completeness",
            priority: "high",
            description: "Q3 (recent contact) must be answered when Q1 = Yes.",
            message: "Question 3 (recent healthcare professional contact) is unanswered.",
            evaluate: |d| {
                d.diagnosis_confirmation.has_mental_health_diagnosis == "yes"
                    && d.recent_contact.had_recent_contact.is_empty()
            },
        },
        M1Rule {
            id: "M1-Q3-002",
            category: "consistency",
            priority: "medium",
            description: "Q3 = Yes requires at least one date of contact.",
            message: "Question 3 marked Yes but no last-contact date was provided for Doctor, Consultant, or Community psychiatric nurse.",
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
        // ─── Authorisation ──────────────────────────────────────────
        M1Rule {
            id: "M1-AUTH-001",
            category: "declaration",
            priority: "high",
            description: "Declaration must be confirmed.",
            message: "Applicant's declaration was not confirmed. The form cannot be submitted without authorising medical disclosure.",
            evaluate: |d| d.authorisation.declaration_confirmed != "yes",
        },
        M1Rule {
            id: "M1-AUTH-002",
            category: "completeness",
            priority: "medium",
            description: "Signatory name must be provided.",
            message: "Signatory name is missing on the authorisation page.",
            evaluate: |d| !is_filled(&d.authorisation.signatory_name),
        },
        M1Rule {
            id: "M1-AUTH-003",
            category: "completeness",
            priority: "medium",
            description: "Signature date must be provided.",
            message: "Signature date is missing on the authorisation page.",
            evaluate: |d| !is_filled(&d.authorisation.signature_date),
        },
    ]
}
