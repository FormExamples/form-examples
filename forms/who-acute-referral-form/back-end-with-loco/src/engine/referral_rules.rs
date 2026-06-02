//! WHO Acute Referral Form — completeness rules.
//!
//! The acute referral form is a structured data-collection form, not a scoring
//! instrument. Each rule below identifies a single field that must be completed
//! for the referral to be acceptable. Fields are gated by an `applies()`
//! predicate so the validator only counts a rule when its branch is active for
//! the patient's answers (e.g. "Other precaution" details only required when
//! the "Other" box is ticked, "Receiving provider" details only required once
//! any receipt-side field has been touched).
//!
//! Rule IDs follow the pattern <SECTION>-<NN>; the prefix lets the report group
//! fired rules by section.

use crate::engine::types::AssessmentData;

/// True if a string is non-empty after trimming.
pub fn has_text(s: &str) -> bool {
    !s.trim().is_empty()
}

/// True if a Yes/No/Unknown field has any answer.
pub fn is_yes_no_unknown_answered(value: &str) -> bool {
    value == "yes" || value == "no" || value == "unknown"
}

/// Human-readable label for a section key.
pub fn section_label(section: &str) -> &'static str {
    match section {
        "patientIdentification" => "Patient Identification",
        "facilityAndTransport" => "Facility & Transport",
        "situation" => "Situation",
        "background" => "Background",
        "assessment" => "Assessment",
        "recommendations" => "Recommendations",
        "initiatingProviderSignoff" => "Provider Sign-off",
        "referralFacilityReceipt" => "Referral Facility Receipt",
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

/// True if any receipt-side field has been touched (gates RFR-* rules).
#[allow(dead_code)]
pub fn receipt_started(d: &AssessmentData) -> bool {
    has_text(&d.referral_facility_receipt.patient_arrival_date_time)
        || has_text(&d.referral_facility_receipt.receiving_provider_name)
        || has_text(&d.referral_facility_receipt.receiving_provider_signature)
}

pub fn referral_rules() -> &'static [ValidationRule] {
    &[
        // ─── Step 1 — Patient Identification ─────────────────────
        ValidationRule {
            id: "PID-01",
            section: "patientIdentification",
            description: "Patient last name (family name) is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.patient_identification.patient_last_name),
        },
        ValidationRule {
            id: "PID-02",
            section: "patientIdentification",
            description: "Patient first name (given name) is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.patient_identification.patient_first_name),
        },
        ValidationRule {
            id: "PID-03",
            section: "patientIdentification",
            description: "Patient date of birth is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.patient_identification.date_of_birth),
        },
        ValidationRule {
            id: "PID-04",
            section: "patientIdentification",
            description: "Patient sex (Male / Female / Unknown) is required.",
            applies: |_| true,
            is_satisfied: |d| {
                let s = d.patient_identification.sex.as_str();
                s == "male" || s == "female" || s == "unknown"
            },
        },
        // ─── Step 2 — Facility & Transport ───────────────────────
        ValidationRule {
            id: "FT-01",
            section: "facilityAndTransport",
            description: "Initiating facility name is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.facility_and_transport.initiating_facility.name),
        },
        ValidationRule {
            id: "FT-02",
            section: "facilityAndTransport",
            description: "Initiating facility focal point (contact person) is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.facility_and_transport.initiating_facility.focal_point),
        },
        ValidationRule {
            id: "FT-03",
            section: "facilityAndTransport",
            description: "Initiating facility phone number is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.facility_and_transport.initiating_facility.phone_number),
        },
        ValidationRule {
            id: "FT-04",
            section: "facilityAndTransport",
            description: "Reason for referral is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.facility_and_transport.reason_for_referral),
        },
        ValidationRule {
            id: "FT-05",
            section: "facilityAndTransport",
            description: "Referral facility name is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.facility_and_transport.referral_facility.name),
        },
        ValidationRule {
            id: "FT-06",
            section: "facilityAndTransport",
            description: "Referral facility phone number is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.facility_and_transport.referral_facility.phone_number),
        },
        ValidationRule {
            id: "FT-07",
            section: "facilityAndTransport",
            description: "Date and time of transfer decision is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.facility_and_transport.transfer_decision_date_time),
        },
        ValidationRule {
            id: "FT-08",
            section: "facilityAndTransport",
            description: "Date and time of departure is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.facility_and_transport.departure_date_time),
        },
        ValidationRule {
            id: "FT-09",
            section: "facilityAndTransport",
            description: "Mode of transfer (Ground / Air / Sea) is required.",
            applies: |_| true,
            is_satisfied: |d| {
                let m = d.facility_and_transport.mode_of_transfer.as_str();
                m == "ground" || m == "air" || m == "sea"
            },
        },
        // ─── Step 3 — Situation ──────────────────────────────────
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
            description: "Pregnancy status (Yes / No / Unknown) is required.",
            applies: |_| true,
            is_satisfied: |d| is_yes_no_unknown_answered(&d.situation.pregnant),
        },
        // ─── Step 4 — Background (history + ABCDE) ───────────────
        ValidationRule {
            id: "BG-01",
            section: "background",
            description: "Brief history of present illness is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.background.history_of_present_illness),
        },
        ValidationRule {
            id: "BG-A",
            section: "background",
            description:
                "Airway: a finding (or \"Normal\") and an intervention (or \"None\") must be recorded.",
            applies: |_| true,
            is_satisfied: |d| {
                (d.background.airway.finding_normal
                    || has_text(&d.background.airway.finding_details))
                    && (d.background.airway.intervention_none
                        || has_text(&d.background.airway.intervention_details))
            },
        },
        ValidationRule {
            id: "BG-B",
            section: "background",
            description:
                "Breathing: a finding (or \"Normal\") and an intervention (or \"None\") must be recorded.",
            applies: |_| true,
            is_satisfied: |d| {
                (d.background.breathing.finding_normal
                    || has_text(&d.background.breathing.finding_details))
                    && (d.background.breathing.intervention_none
                        || has_text(&d.background.breathing.intervention_details))
            },
        },
        ValidationRule {
            id: "BG-C",
            section: "background",
            description:
                "Circulation: a finding (or \"Normal\") and an intervention (or \"None\") must be recorded.",
            applies: |_| true,
            is_satisfied: |d| {
                (d.background.circulation.finding_normal
                    || has_text(&d.background.circulation.finding_details))
                    && (d.background.circulation.intervention_none
                        || has_text(&d.background.circulation.intervention_details))
            },
        },
        ValidationRule {
            id: "BG-D",
            section: "background",
            description:
                "Disability (neurologic): a finding (or \"Normal\") and an intervention (or \"None\") must be recorded.",
            applies: |_| true,
            is_satisfied: |d| {
                (d.background.disability.finding_normal
                    || has_text(&d.background.disability.finding_details))
                    && (d.background.disability.intervention_none
                        || has_text(&d.background.disability.intervention_details))
            },
        },
        ValidationRule {
            id: "BG-E",
            section: "background",
            description:
                "Exposure: a finding (or \"Normal\") and an intervention (or \"None\") must be recorded.",
            applies: |_| true,
            is_satisfied: |d| {
                (d.background.exposure.finding_normal
                    || has_text(&d.background.exposure.finding_details))
                    && (d.background.exposure.intervention_none
                        || has_text(&d.background.exposure.intervention_details))
            },
        },
        // ─── Step 5 — Assessment ────────────────────────────────
        ValidationRule {
            id: "ASS-01",
            section: "assessment",
            description:
                "Clinical assessment (description of the patient and need for referral) is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.assessment.clinical_assessment),
        },
        // ─── Step 6 — Recommendations ───────────────────────────
        ValidationRule {
            id: "REC-01",
            section: "recommendations",
            description:
                "Treatment plan during transport (next steps, therapies continued in transit) is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.recommendations.treatment_plan_during_transport),
        },
        ValidationRule {
            id: "REC-02",
            section: "recommendations",
            description:
                "Description of how the \"Other\" precaution applies is required when ticked.",
            applies: |d| d.recommendations.precautions.other,
            is_satisfied: |d| has_text(&d.recommendations.precautions.other_details),
        },
        // ─── Step 7 — Initiating Provider Sign-off ──────────────
        ValidationRule {
            id: "IPS-01",
            section: "initiatingProviderSignoff",
            description: "Initiating facility provider name is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.initiating_provider_signoff.provider_name),
        },
        ValidationRule {
            id: "IPS-02",
            section: "initiatingProviderSignoff",
            description: "Initiating facility provider signature is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.initiating_provider_signoff.signature),
        },
        ValidationRule {
            id: "IPS-03",
            section: "initiatingProviderSignoff",
            description: "Initiating facility provider signature date is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.initiating_provider_signoff.signature_date),
        },
        // ─── Step 8 — Referral Facility Receipt ─────────────────
        // Receipt-side rules only fire once any receipt-side field is touched.
        ValidationRule {
            id: "RFR-01",
            section: "referralFacilityReceipt",
            description: "Receiving provider name is required once any receipt field is filled.",
            applies: |d| {
                has_text(&d.referral_facility_receipt.patient_arrival_date_time)
                    || has_text(&d.referral_facility_receipt.receiving_provider_signature)
            },
            is_satisfied: |d| has_text(&d.referral_facility_receipt.receiving_provider_name),
        },
        ValidationRule {
            id: "RFR-02",
            section: "referralFacilityReceipt",
            description:
                "Receiving provider signature is required once any receipt field is filled.",
            applies: |d| {
                has_text(&d.referral_facility_receipt.patient_arrival_date_time)
                    || has_text(&d.referral_facility_receipt.receiving_provider_name)
            },
            is_satisfied: |d| has_text(&d.referral_facility_receipt.receiving_provider_signature),
        },
        ValidationRule {
            id: "RFR-03",
            section: "referralFacilityReceipt",
            description:
                "Patient arrival date and time is required once any other receipt field is filled.",
            applies: |d| {
                has_text(&d.referral_facility_receipt.receiving_provider_name)
                    || has_text(&d.referral_facility_receipt.receiving_provider_signature)
            },
            is_satisfied: |d| has_text(&d.referral_facility_receipt.patient_arrival_date_time),
        },
    ]
}
