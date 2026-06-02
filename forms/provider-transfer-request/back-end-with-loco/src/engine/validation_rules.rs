use super::types::AssessmentData;
use super::utils::{acknowledgement_started, has_text, is_yes_no_unknown_answered};

/// A declarative completeness rule. `applies` decides whether the rule
/// participates in the validator for this data (used for conditional rules
/// like the escort-detail and acknowledgement-side rules). `is_satisfied`
/// returns true when the field has been answered correctly.
pub struct ValidationRule {
    pub id: &'static str,
    pub section: &'static str,
    pub description: &'static str,
    pub mandatory: bool,
    pub applies: fn(&AssessmentData) -> bool,
    pub is_satisfied: fn(&AssessmentData) -> bool,
}

/// All Provider Transfer Request validation rules, in source order. Rule IDs
/// are preserved verbatim from the JavaScript reference engine.
pub fn all_rules() -> Vec<ValidationRule> {
    vec![
        // --- Step 1 — Requesting Provider Details -----------------------
        ValidationRule {
            id: "REQ-01",
            section: "requestingProvider",
            description: "Requesting clinician name is required.",
            mandatory: true,
            applies: |_| true,
            is_satisfied: |d| has_text(&d.requesting_provider.clinician_name),
        },
        ValidationRule {
            id: "REQ-02",
            section: "requestingProvider",
            description: "Requesting clinician role is required.",
            mandatory: true,
            applies: |_| true,
            is_satisfied: |d| has_text(&d.requesting_provider.clinician_role),
        },
        ValidationRule {
            id: "REQ-03",
            section: "requestingProvider",
            description: "Requesting organisation is required.",
            mandatory: true,
            applies: |_| true,
            is_satisfied: |d| has_text(&d.requesting_provider.organisation),
        },
        ValidationRule {
            id: "REQ-04",
            section: "requestingProvider",
            description: "Requesting clinician contact phone is required.",
            mandatory: true,
            applies: |_| true,
            is_satisfied: |d| has_text(&d.requesting_provider.phone),
        },
        ValidationRule {
            id: "REQ-05",
            section: "requestingProvider",
            description: "Requesting clinician ward/unit (recommended).",
            mandatory: false,
            applies: |_| true,
            is_satisfied: |d| has_text(&d.requesting_provider.ward),
        },
        ValidationRule {
            id: "REQ-06",
            section: "requestingProvider",
            description: "Requesting clinician email (recommended).",
            mandatory: false,
            applies: |_| true,
            is_satisfied: |d| has_text(&d.requesting_provider.email),
        },
        // --- Step 2 — Receiving Provider Details ------------------------
        ValidationRule {
            id: "RCV-01",
            section: "receivingProvider",
            description: "Receiving clinician name is required.",
            mandatory: true,
            applies: |_| true,
            is_satisfied: |d| has_text(&d.receiving_provider.clinician_name),
        },
        ValidationRule {
            id: "RCV-02",
            section: "receivingProvider",
            description: "Receiving clinician role is required.",
            mandatory: true,
            applies: |_| true,
            is_satisfied: |d| has_text(&d.receiving_provider.clinician_role),
        },
        ValidationRule {
            id: "RCV-03",
            section: "receivingProvider",
            description: "Receiving organisation is required.",
            mandatory: true,
            applies: |_| true,
            is_satisfied: |d| has_text(&d.receiving_provider.organisation),
        },
        ValidationRule {
            id: "RCV-04",
            section: "receivingProvider",
            description: "Receiving clinician contact phone is required.",
            mandatory: true,
            applies: |_| true,
            is_satisfied: |d| has_text(&d.receiving_provider.phone),
        },
        ValidationRule {
            id: "RCV-05",
            section: "receivingProvider",
            description: "Receiving clinician ward/unit (recommended).",
            mandatory: false,
            applies: |_| true,
            is_satisfied: |d| has_text(&d.receiving_provider.ward),
        },
        // --- Step 3 — Patient Demographics ------------------------------
        ValidationRule {
            id: "PAT-01",
            section: "patientDemographics",
            description: "Patient first name is required.",
            mandatory: true,
            applies: |_| true,
            is_satisfied: |d| has_text(&d.patient_demographics.first_name),
        },
        ValidationRule {
            id: "PAT-02",
            section: "patientDemographics",
            description: "Patient last name is required.",
            mandatory: true,
            applies: |_| true,
            is_satisfied: |d| has_text(&d.patient_demographics.last_name),
        },
        ValidationRule {
            id: "PAT-03",
            section: "patientDemographics",
            description: "Patient date of birth is required.",
            mandatory: true,
            applies: |_| true,
            is_satisfied: |d| has_text(&d.patient_demographics.date_of_birth),
        },
        ValidationRule {
            id: "PAT-04",
            section: "patientDemographics",
            description: "Patient sex is required.",
            mandatory: true,
            applies: |_| true,
            is_satisfied: |d| {
                let s = d.patient_demographics.sex.as_str();
                matches!(s, "male" | "female" | "other" | "unknown")
            },
        },
        ValidationRule {
            id: "PAT-05",
            section: "patientDemographics",
            description: "NHS number or hospital number is required.",
            mandatory: true,
            applies: |_| true,
            is_satisfied: |d| {
                has_text(&d.patient_demographics.nhs_number)
                    || has_text(&d.patient_demographics.hospital_number)
            },
        },
        ValidationRule {
            id: "PAT-06",
            section: "patientDemographics",
            description: "Next of kin contact (recommended).",
            mandatory: false,
            applies: |_| true,
            is_satisfied: |d| {
                has_text(&d.patient_demographics.next_of_kin_name)
                    || has_text(&d.patient_demographics.next_of_kin_phone)
            },
        },
        // --- Step 4 — Situation -----------------------------------------
        ValidationRule {
            id: "SIT-01",
            section: "situation",
            description: "Reason for transfer is required.",
            mandatory: true,
            applies: |_| true,
            is_satisfied: |d| has_text(&d.situation.reason_for_transfer),
        },
        ValidationRule {
            id: "SIT-02",
            section: "situation",
            description: "Primary diagnosis is required.",
            mandatory: true,
            applies: |_| true,
            is_satisfied: |d| has_text(&d.situation.primary_diagnosis),
        },
        ValidationRule {
            id: "SIT-03",
            section: "situation",
            description: "Transfer urgency (routine / urgent / emergent) is required.",
            mandatory: true,
            applies: |_| true,
            is_satisfied: |d| {
                matches!(d.situation.urgency.as_str(), "routine" | "urgent" | "emergent")
            },
        },
        ValidationRule {
            id: "SIT-04",
            section: "situation",
            description: "Transfer type is required.",
            mandatory: true,
            applies: |_| true,
            is_satisfied: |d| {
                matches!(
                    d.situation.transfer_type.as_str(),
                    "ward-to-ward" | "inter-hospital" | "inter-organisation" | "community"
                )
            },
        },
        ValidationRule {
            id: "SIT-05",
            section: "situation",
            description: "Requested transfer date/time (recommended).",
            mandatory: false,
            applies: |_| true,
            is_satisfied: |d| has_text(&d.situation.requested_date_time),
        },
        // --- Step 5 — Background ----------------------------------------
        ValidationRule {
            id: "BG-01",
            section: "background",
            description: "Presenting complaint is required.",
            mandatory: true,
            applies: |_| true,
            is_satisfied: |d| has_text(&d.background.presenting_complaint),
        },
        ValidationRule {
            id: "BG-02",
            section: "background",
            description: "Relevant history of current admission is required.",
            mandatory: true,
            applies: |_| true,
            is_satisfied: |d| has_text(&d.background.relevant_history),
        },
        ValidationRule {
            id: "BG-03",
            section: "background",
            description: "Past medical history (recommended).",
            mandatory: false,
            applies: |_| true,
            is_satisfied: |d| has_text(&d.background.past_medical_history),
        },
        ValidationRule {
            id: "BG-04",
            section: "background",
            description: "Current medications are required.",
            mandatory: true,
            applies: |_| true,
            is_satisfied: |d| has_text(&d.background.current_medications),
        },
        ValidationRule {
            id: "BG-05",
            section: "background",
            description: "Allergies / adverse reactions are required (record \"NKDA\" if none).",
            mandatory: true,
            applies: |_| true,
            is_satisfied: |d| has_text(&d.background.allergies),
        },
        ValidationRule {
            id: "BG-06",
            section: "background",
            description: "Recent investigations / results (recommended).",
            mandatory: false,
            applies: |_| true,
            is_satisfied: |d| has_text(&d.background.recent_investigations),
        },
        ValidationRule {
            id: "BG-07",
            section: "background",
            description: "Infection / colonisation status is required.",
            mandatory: true,
            applies: |_| true,
            is_satisfied: |d| has_text(&d.background.infection_status),
        },
        // --- Step 6 — Assessment ----------------------------------------
        ValidationRule {
            id: "ASS-01",
            section: "assessment",
            description: "Current clinical status (free-text summary) is required.",
            mandatory: true,
            applies: |_| true,
            is_satisfied: |d| has_text(&d.assessment.current_clinical_status),
        },
        ValidationRule {
            id: "ASS-02",
            section: "assessment",
            description: "Conscious level (awake / drowsy / unresponsive) is required.",
            mandatory: true,
            applies: |_| true,
            is_satisfied: |d| {
                matches!(
                    d.assessment.conscious_level.as_str(),
                    "awake" | "drowsy" | "unresponsive"
                )
            },
        },
        ValidationRule {
            id: "ASS-03",
            section: "assessment",
            description: "Clinically stable for transfer (Yes / No / Unknown) is required.",
            mandatory: true,
            applies: |_| true,
            is_satisfied: |d| is_yes_no_unknown_answered(&d.assessment.clinically_stable),
        },
        ValidationRule {
            id: "ASS-04",
            section: "assessment",
            description: "Stability notes are required when patient is not clinically stable.",
            mandatory: true,
            applies: |d| d.assessment.clinically_stable == "no",
            is_satisfied: |d| has_text(&d.assessment.stability_notes),
        },
        ValidationRule {
            id: "ASS-05",
            section: "assessment",
            description: "Latest set of vital signs (recommended).",
            mandatory: false,
            applies: |_| true,
            is_satisfied: |d| {
                let v = &d.assessment.vital_signs;
                v.heart_rate.is_some()
                    || v.respiratory_rate.is_some()
                    || v.systolic_blood_pressure.is_some()
                    || v.oxygen_saturation.is_some()
            },
        },
        // --- Step 7 — Recommendation ------------------------------------
        ValidationRule {
            id: "REC-01",
            section: "recommendation",
            description: "Requested action from the receiving provider is required.",
            mandatory: true,
            applies: |_| true,
            is_satisfied: |d| has_text(&d.recommendation.requested_action),
        },
        ValidationRule {
            id: "REC-02",
            section: "recommendation",
            description: "Expected outcomes / goals of transfer (recommended).",
            mandatory: false,
            applies: |_| true,
            is_satisfied: |d| has_text(&d.recommendation.expected_outcomes),
        },
        ValidationRule {
            id: "REC-03",
            section: "recommendation",
            description: "Ongoing care plan is required.",
            mandatory: true,
            applies: |_| true,
            is_satisfied: |d| has_text(&d.recommendation.ongoing_care_plan),
        },
        ValidationRule {
            id: "REC-04",
            section: "recommendation",
            description: "Pending results / follow-up (recommended).",
            mandatory: false,
            applies: |_| true,
            is_satisfied: |d| has_text(&d.recommendation.pending_results),
        },
        // --- Step 8 — Transfer Logistics --------------------------------
        ValidationRule {
            id: "LOG-01",
            section: "transferLogistics",
            description: "Transport mode is required.",
            mandatory: true,
            applies: |_| true,
            is_satisfied: |d| {
                matches!(
                    d.transfer_logistics.transport_mode.as_str(),
                    "self"
                        | "wheelchair"
                        | "stretcher"
                        | "ambulance"
                        | "critical-care-transport"
                )
            },
        },
        ValidationRule {
            id: "LOG-02",
            section: "transferLogistics",
            description: "Planned departure date/time is required.",
            mandatory: true,
            applies: |_| true,
            is_satisfied: |d| has_text(&d.transfer_logistics.departure_date_time),
        },
        ValidationRule {
            id: "LOG-03",
            section: "transferLogistics",
            description: "Estimated arrival date/time (recommended).",
            mandatory: false,
            applies: |_| true,
            is_satisfied: |d| has_text(&d.transfer_logistics.estimated_arrival_date_time),
        },
        ValidationRule {
            id: "LOG-04",
            section: "transferLogistics",
            description: "Escort details are required when an escort is requested.",
            mandatory: true,
            applies: |d| d.transfer_logistics.escort_required,
            is_satisfied: |d| has_text(&d.transfer_logistics.escort_details),
        },
        ValidationRule {
            id: "LOG-05",
            section: "transferLogistics",
            description: "Infectious-precaution details are required when infectious precautions are flagged.",
            mandatory: true,
            applies: |d| d.transfer_logistics.infectious_precautions,
            is_satisfied: |d| has_text(&d.transfer_logistics.infectious_precautions_details),
        },
        // --- Step 9 — Sign-off & Acknowledgement ------------------------
        ValidationRule {
            id: "SGN-01",
            section: "signoffAcknowledgement",
            description: "Requesting provider signature (typed full name) is required.",
            mandatory: true,
            applies: |_| true,
            is_satisfied: |d| has_text(&d.signoff_acknowledgement.requesting_provider_signature),
        },
        ValidationRule {
            id: "SGN-02",
            section: "signoffAcknowledgement",
            description: "Requesting provider signature date is required.",
            mandatory: true,
            applies: |_| true,
            is_satisfied: |d| {
                has_text(&d.signoff_acknowledgement.requesting_provider_signature_date)
            },
        },
        ValidationRule {
            id: "SGN-03",
            section: "signoffAcknowledgement",
            description: "Receiving provider name is required once acknowledgement has been started.",
            mandatory: true,
            applies: acknowledgement_started,
            is_satisfied: |d| has_text(&d.signoff_acknowledgement.receiving_provider_name),
        },
        ValidationRule {
            id: "SGN-04",
            section: "signoffAcknowledgement",
            description: "Receiving provider signature is required once acknowledgement has been started.",
            mandatory: true,
            applies: acknowledgement_started,
            is_satisfied: |d| has_text(&d.signoff_acknowledgement.receiving_provider_signature),
        },
        ValidationRule {
            id: "SGN-05",
            section: "signoffAcknowledgement",
            description: "Receiving provider signature date is required once acknowledgement has been started.",
            mandatory: true,
            applies: acknowledgement_started,
            is_satisfied: |d| {
                has_text(&d.signoff_acknowledgement.receiving_provider_signature_date)
            },
        },
        ValidationRule {
            id: "SGN-06",
            section: "signoffAcknowledgement",
            description: "Receiving provider acknowledgement checkbox must be ticked to confirm acceptance.",
            mandatory: true,
            applies: acknowledgement_started,
            is_satisfied: |d| d.signoff_acknowledgement.acknowledgement_received,
        },
    ]
}
