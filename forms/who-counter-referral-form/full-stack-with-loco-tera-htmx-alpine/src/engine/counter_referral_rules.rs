//! WHO Counter-Referral Form — completeness rules.
//!
//! The counter-referral form is a structured data-collection document, not a
//! scoring instrument. Each rule below identifies a single field that must be
//! completed for the discharge back to the primary care facility to be safe
//! and actionable. Conditional follow-ups (e.g. patient/family informed →
//! "explain" text) are gated by the `applies` predicate so the validator
//! only counts a rule when the conditional branch is active.
//!
//! Rule IDs follow the pattern <SECTION>-<NN>; the prefix lets the report
//! group fired rules by section.

use crate::engine::types::AssessmentData;

/// True if a string is non-empty after trimming.
pub fn has_text(s: &str) -> bool {
    !s.trim().is_empty()
}

/// True if a Yes/No field has been answered (either yes or no).
pub fn is_yes_no_answered(value: &str) -> bool {
    value == "yes" || value == "no"
}

/// True if any one of the recommendations status flags is set.
pub fn has_any_status_flag(data: &AssessmentData) -> bool {
    let f = &data.recommendations.status_flags;
    f.cognitive_impairment
        || f.carer_dependent
        || f.spinal_precautions
        || f.weight_bearing_restrictions
        || f.palliative_care
}

/// Human-readable label for a section key.
pub fn section_label(section: &str) -> &'static str {
    match section {
        "patientIdentification" => "Patient Identification",
        "facilityDetails" => "Facility Details",
        "situation" => "Situation",
        "background" => "Background",
        "assessment" => "Assessment",
        "recommendations" => "Recommendations",
        "providerSignOff" => "Provider Sign-off",
        _ => "",
    }
}

pub struct ValidationRule {
    pub id: &'static str,
    pub section: &'static str,
    pub description: &'static str,
    pub applies: fn(&AssessmentData) -> bool,
    pub is_satisfied: fn(&AssessmentData) -> bool,
}

pub fn counter_referral_rules() -> &'static [ValidationRule] {
    &[
        // ─── Step 1 — Patient Identification ────────────────────
        ValidationRule {
            id: "PID-01",
            section: "patientIdentification",
            description: "Patient name (LAST, First) is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.patient_identification.patient_name),
        },
        ValidationRule {
            id: "PID-02",
            section: "patientIdentification",
            description: "Date of birth is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.patient_identification.date_of_birth),
        },
        ValidationRule {
            id: "PID-03",
            section: "patientIdentification",
            description: "Sex (Male, Female, or Unknown) is required.",
            applies: |_| true,
            is_satisfied: |d| {
                let s = d.patient_identification.sex.as_str();
                s == "male" || s == "female" || s == "unknown"
            },
        },
        ValidationRule {
            id: "PID-04",
            section: "patientIdentification",
            description: "Patient contact information is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.patient_identification.patient_contact),
        },
        ValidationRule {
            id: "PID-05",
            section: "patientIdentification",
            description: "Emergency contact person name is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.patient_identification.emergency_contact.name),
        },
        ValidationRule {
            id: "PID-06",
            section: "patientIdentification",
            description: "Emergency contact information is required.",
            applies: |_| true,
            is_satisfied: |d| {
                has_text(&d.patient_identification.emergency_contact.contact_information)
            },
        },
        // ─── Step 2 — Facility Details ──────────────────────────
        ValidationRule {
            id: "FAC-01",
            section: "facilityDetails",
            description: "Initiating facility name is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.facility_details.initiating_facility.name),
        },
        ValidationRule {
            id: "FAC-02",
            section: "facilityDetails",
            description: "Initiating facility focal point is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.facility_details.initiating_facility.focal_point),
        },
        ValidationRule {
            id: "FAC-03",
            section: "facilityDetails",
            description: "Initiating facility phone number is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.facility_details.initiating_facility.phone_number),
        },
        ValidationRule {
            id: "FAC-04",
            section: "facilityDetails",
            description: "Date of original referral is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.facility_details.referral_date),
        },
        ValidationRule {
            id: "FAC-05",
            section: "facilityDetails",
            description: "Reason for original referral is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.facility_details.referral_reason),
        },
        ValidationRule {
            id: "FAC-06",
            section: "facilityDetails",
            description: "Acuity (Acute or Non-acute) is required.",
            applies: |_| true,
            is_satisfied: |d| {
                d.facility_details.acuity == "acute" || d.facility_details.acuity == "non-acute"
            },
        },
        ValidationRule {
            id: "FAC-07",
            section: "facilityDetails",
            description: "Referral facility name is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.facility_details.referral_facility.name),
        },
        ValidationRule {
            id: "FAC-08",
            section: "facilityDetails",
            description: "Referral facility focal point is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.facility_details.referral_facility.focal_point),
        },
        ValidationRule {
            id: "FAC-09",
            section: "facilityDetails",
            description: "Referral facility phone number is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.facility_details.referral_facility.phone_number),
        },
        ValidationRule {
            id: "FAC-10",
            section: "facilityDetails",
            description:
                "At least one communication channel (primary care provider or initiating facility) must be ticked.",
            applies: |_| true,
            is_satisfied: |d| {
                d.facility_details
                    .communication
                    .discussed_with_primary_care_provider
                    || d.facility_details
                        .communication
                        .discussed_with_initiating_facility
            },
        },
        ValidationRule {
            id: "FAC-11",
            section: "facilityDetails",
            description: "Time frame for primary care follow-up with patient is required.",
            applies: |_| true,
            is_satisfied: |d| {
                let t = d.facility_details.follow_up_timeframe.as_str();
                t == "urgent-within-24-hours"
                    || t == "2-to-6-days"
                    || t == "1-to-2-weeks"
                    || t == "more-than-2-weeks"
            },
        },
        // ─── Step 3 — Situation ─────────────────────────────────
        ValidationRule {
            id: "SIT-01",
            section: "situation",
            description: "Chief complaint is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.situation.chief_complaint),
        },
        ValidationRule {
            id: "SIT-02",
            section: "situation",
            description: "Primary diagnosis is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.situation.primary_diagnosis),
        },
        ValidationRule {
            id: "SIT-03",
            section: "situation",
            description: "Pregnancy status (Yes, No, or Unknown) is required.",
            applies: |_| true,
            is_satisfied: |d| {
                let p = d.situation.pregnant.as_str();
                p == "yes" || p == "no" || p == "unknown"
            },
        },
        ValidationRule {
            id: "SIT-04",
            section: "situation",
            description: "Treatments initiated description is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.situation.treatments_initiated),
        },
        // ─── Step 4 — Background ────────────────────────────────
        ValidationRule {
            id: "BG-01",
            section: "background",
            description: "Brief history of present illness is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.background.history_of_present_illness),
        },
        ValidationRule {
            id: "BG-02",
            section: "background",
            description: "Relevant past medical history is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.background.past_medical_history),
        },
        // ─── Step 5 — Assessment ────────────────────────────────
        ValidationRule {
            id: "ASS-01",
            section: "assessment",
            description: "Final diagnoses / problem list is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.assessment.final_diagnoses),
        },
        ValidationRule {
            id: "ASS-02",
            section: "assessment",
            description: "Prognosis and goals of care are required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.assessment.prognosis_and_goals_of_care),
        },
        ValidationRule {
            id: "ASS-03",
            section: "assessment",
            description: "Patient/family informed of diagnosis (Yes or No) is required.",
            applies: |_| true,
            is_satisfied: |d| is_yes_no_answered(&d.assessment.patient_family_informed),
        },
        ValidationRule {
            id: "ASS-04",
            section: "assessment",
            description:
                "Explanation of how patient/family were informed is required when answered Yes.",
            applies: |d| d.assessment.patient_family_informed == "yes",
            is_satisfied: |d| has_text(&d.assessment.informed_explanation),
        },
        // ─── Step 6 — Recommendations ───────────────────────────
        ValidationRule {
            id: "REC-01",
            section: "recommendations",
            description: "Next steps in follow-up plan are required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.recommendations.follow_up_plan),
        },
        ValidationRule {
            id: "REC-02",
            section: "recommendations",
            description: "Follow-up arrangements (when, where, with whom) are required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.recommendations.follow_up_arrangements),
        },
        ValidationRule {
            id: "REC-03",
            section: "recommendations",
            description: "Instructions if patient's condition deteriorates are required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.recommendations.deterioration_instructions),
        },
        ValidationRule {
            id: "REC-04",
            section: "recommendations",
            description: "Contact name for follow-up questions is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.recommendations.contact_name),
        },
        ValidationRule {
            id: "REC-05",
            section: "recommendations",
            description: "Contact information for follow-up questions is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.recommendations.contact_information),
        },
        // ─── Step 7 — Provider Sign-off ─────────────────────────
        ValidationRule {
            id: "SIGN-01",
            section: "providerSignOff",
            description: "Referral facility provider name is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.provider_sign_off.provider_name),
        },
        ValidationRule {
            id: "SIGN-02",
            section: "providerSignOff",
            description: "Referral facility provider signature is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.provider_sign_off.signature),
        },
        ValidationRule {
            id: "SIGN-03",
            section: "providerSignOff",
            description: "Signature date is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.provider_sign_off.signature_date),
        },
    ]
}
