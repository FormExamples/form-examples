//! WHO Emergency First Aid Form — completeness rules for Community First Aid
//! Responders (CFAR).
//!
//! The form is a structured *data-collection* form, not a scoring instrument.
//! Each rule below identifies a single field that must be answered for the
//! encounter record to be acceptable. Conditional follow-ups (tourniquet time,
//! "Other" precaution details) are gated by the `applies` predicate so the
//! validator only counts a rule if the conditional branch is active.
//!
//! Rule IDs follow the pattern <SECTION>-<NN>; the prefix groups fired rules
//! by section in the report.

use crate::engine::types::{
    Airway, AssessmentData, Breathing, Circulation, Disability, Exposure, MajorBleeding,
};

/// True if a string is non-empty after trimming.
pub fn has_text(s: &str) -> bool {
    !s.trim().is_empty()
}

/// For a CABCDE category, the assessment is "answered" when either the Normal
/// checkbox is ticked or the free-text findings have been filled in.
pub fn major_bleeding_assessment_answered(s: &MajorBleeding) -> bool {
    s.assessment_normal || has_text(&s.assessment_findings)
}

pub fn airway_assessment_answered(s: &Airway) -> bool {
    s.assessment_normal || has_text(&s.assessment_findings)
}

pub fn breathing_assessment_answered(s: &Breathing) -> bool {
    s.assessment_normal || has_text(&s.assessment_findings)
}

pub fn circulation_assessment_answered(s: &Circulation) -> bool {
    s.assessment_normal || has_text(&s.assessment_findings)
}

pub fn disability_assessment_answered(s: &Disability) -> bool {
    s.assessment_normal || has_text(&s.assessment_findings)
}

pub fn exposure_assessment_answered(s: &Exposure) -> bool {
    s.assessment_normal || has_text(&s.assessment_findings)
}

/// True if any intervention checkbox in a Major Bleeding block is selected.
pub fn has_any_major_bleeding_intervention(s: &MajorBleeding) -> bool {
    let i = &s.interventions;
    i.direct_pressure || i.deep_wound_packing || i.tourniquet || i.uterine_massage || i.none
}

/// True if any intervention checkbox in an Airway block is selected.
pub fn has_any_airway_intervention(s: &Airway) -> bool {
    let i = &s.interventions;
    i.neck_immobilization || i.head_tilt_chin_lift || i.jaw_thrust || i.choking_care || i.none
}

/// True if any intervention checkbox in a Breathing block is selected.
pub fn has_any_breathing_intervention(s: &Breathing) -> bool {
    let i = &s.interventions;
    i.maintained_position_of_comfort || i.none
}

/// True if any intervention checkbox in a Circulation block is selected.
pub fn has_any_circulation_intervention(s: &Circulation) -> bool {
    let i = &s.interventions;
    i.pelvic_binder
        || i.control_minor_bleeding
        || i.fracture_care
        || i.oral_hydration
        || i.left_lateral_position
        || i.none
}

/// True if any intervention checkbox in a Disability block is selected.
pub fn has_any_disability_intervention(s: &Disability) -> bool {
    let i = &s.interventions;
    i.spinal_immobilisation
        || i.glucose_given
        || i.seizure_care
        || i.high_temperature_care
        || i.low_temperature_care
        || i.none
}

/// True if any intervention checkbox in an Exposure block is selected.
pub fn has_any_exposure_intervention(s: &Exposure) -> bool {
    let i = &s.interventions;
    i.recovery_position
        || i.burn_care
        || i.wound_care
        || i.drowning_care
        || i.snakebite_care
        || i.none
}

/// True if a (non-tourniquet) life-saving intervention has been performed for
/// major bleeding — used to detect "tourniquet without other control" flag.
pub fn has_non_tourniquet_bleeding_intervention(s: &MajorBleeding) -> bool {
    let i = &s.interventions;
    i.direct_pressure || i.deep_wound_packing || i.uterine_massage
}

/// Active medication-narrative branch on the Exposure step.
pub fn medication_taken_answered(d: &AssessmentData) -> bool {
    d.exposure.medication_taken_none || has_text(&d.exposure.medication_taken_details)
}

/// Human-readable label for a section key.
pub fn section_label(section: &str) -> &'static str {
    match section {
        "patientIdentification" => "Patient Identification",
        "referralTransport" => "Referral & Transport",
        "situation" => "Situation",
        "background" => "Background",
        "majorBleeding" => "Major Bleeding (C)",
        "airway" => "Airway (A)",
        "breathing" => "Breathing (B)",
        "circulation" => "Circulation (C)",
        "disability" => "Disability (D)",
        "exposure" => "Exposure / Other (E)",
        "recommendations" => "Recommendations",
        "responderDetails" => "Responder Details",
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

pub fn cfar_rules() -> &'static [ValidationRule] {
    &[
        // ─── Step 1 — Patient Identification ─────────────────
        ValidationRule {
            id: "PI-01",
            section: "patientIdentification",
            description: "Patient name (LAST, First) is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.patient_identification.patient_name),
        },
        ValidationRule {
            id: "PI-02",
            section: "patientIdentification",
            description: "Patient sex (Male / Female / Unknown) is required.",
            applies: |_| true,
            is_satisfied: |d| {
                let s = d.patient_identification.sex.as_str();
                s == "male" || s == "female" || s == "unknown"
            },
        },
        // ─── Step 2 — Referral & Transport ───────────────────
        ValidationRule {
            id: "RT-01",
            section: "referralTransport",
            description: "Referral facility name is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.referral_transport.referral_facility.name),
        },
        ValidationRule {
            id: "RT-02",
            section: "referralTransport",
            description: "Date and time of event is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.referral_transport.event_date_time),
        },
        ValidationRule {
            id: "RT-03",
            section: "referralTransport",
            description: "Date and time of departure from scene is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.referral_transport.departure_date_time),
        },
        // ─── Step 3 — Situation ──────────────────────────────
        ValidationRule {
            id: "ST-01",
            section: "situation",
            description: "Problem type (Medical and/or Trauma) must be selected.",
            applies: |_| true,
            is_satisfied: |d| d.situation.medical || d.situation.trauma,
        },
        ValidationRule {
            id: "ST-02",
            section: "situation",
            description: "Pregnancy status (Yes / No / Unknown) is required.",
            applies: |_| true,
            is_satisfied: |d| {
                let p = d.situation.pregnant.as_str();
                p == "yes" || p == "no" || p == "unknown"
            },
        },
        ValidationRule {
            id: "ST-03",
            section: "situation",
            description: "A description of what happened to the patient is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.situation.what_happened),
        },
        // ─── Step 4 — Background ─────────────────────────────
        ValidationRule {
            id: "BG-01",
            section: "background",
            description:
                "Past medical and surgical history is required (write \"None\" if there is no relevant history).",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.background.past_medical_and_surgical_history),
        },
        ValidationRule {
            id: "BG-02",
            section: "background",
            description:
                "Current medications or allergies are required (write \"None\" if there are none).",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.background.current_medications_or_allergies),
        },
        // ─── Step 5 — Major Bleeding (C) ─────────────────────
        ValidationRule {
            id: "MB-01",
            section: "majorBleeding",
            description: "Major bleeding assessment: tick \"Normal\" or describe findings.",
            applies: |_| true,
            is_satisfied: |d| major_bleeding_assessment_answered(&d.major_bleeding),
        },
        ValidationRule {
            id: "MB-02",
            section: "majorBleeding",
            description:
                "Major bleeding intervention: tick at least one intervention or \"None\".",
            applies: |_| true,
            is_satisfied: |d| has_any_major_bleeding_intervention(&d.major_bleeding),
        },
        ValidationRule {
            id: "MB-03",
            section: "majorBleeding",
            description: "Tourniquet application time is required when a tourniquet was applied.",
            applies: |d| d.major_bleeding.interventions.tourniquet,
            is_satisfied: |d| has_text(&d.major_bleeding.interventions.tourniquet_application_time),
        },
        // ─── Step 6 — Airway (A) ─────────────────────────────
        ValidationRule {
            id: "AW-01",
            section: "airway",
            description: "Airway assessment: tick \"Normal\" or describe findings.",
            applies: |_| true,
            is_satisfied: |d| airway_assessment_answered(&d.airway),
        },
        ValidationRule {
            id: "AW-02",
            section: "airway",
            description: "Airway intervention: tick at least one intervention or \"None\".",
            applies: |_| true,
            is_satisfied: |d| has_any_airway_intervention(&d.airway),
        },
        // ─── Step 7 — Breathing (B) ──────────────────────────
        ValidationRule {
            id: "BR-01",
            section: "breathing",
            description: "Breathing assessment: tick \"Normal\" or describe findings.",
            applies: |_| true,
            is_satisfied: |d| breathing_assessment_answered(&d.breathing),
        },
        ValidationRule {
            id: "BR-02",
            section: "breathing",
            description: "Breathing intervention: tick at least one intervention or \"None\".",
            applies: |_| true,
            is_satisfied: |d| has_any_breathing_intervention(&d.breathing),
        },
        // ─── Step 8 — Circulation (C) ────────────────────────
        ValidationRule {
            id: "CR-01",
            section: "circulation",
            description: "Circulation assessment: tick \"Normal\" or describe findings.",
            applies: |_| true,
            is_satisfied: |d| circulation_assessment_answered(&d.circulation),
        },
        ValidationRule {
            id: "CR-02",
            section: "circulation",
            description: "Circulation intervention: tick at least one intervention or \"None\".",
            applies: |_| true,
            is_satisfied: |d| has_any_circulation_intervention(&d.circulation),
        },
        // ─── Step 9 — Disability (D) ─────────────────────────
        ValidationRule {
            id: "DS-01",
            section: "disability",
            description: "Disability assessment: tick \"Normal\" or describe findings.",
            applies: |_| true,
            is_satisfied: |d| disability_assessment_answered(&d.disability),
        },
        ValidationRule {
            id: "DS-02",
            section: "disability",
            description: "Disability intervention: tick at least one intervention or \"None\".",
            applies: |_| true,
            is_satisfied: |d| has_any_disability_intervention(&d.disability),
        },
        // ─── Step 10 — Exposure / Other (E) ──────────────────
        ValidationRule {
            id: "EX-01",
            section: "exposure",
            description: "Exposure assessment: tick \"Normal\" or describe findings.",
            applies: |_| true,
            is_satisfied: |d| exposure_assessment_answered(&d.exposure),
        },
        ValidationRule {
            id: "EX-02",
            section: "exposure",
            description: "Exposure intervention: tick at least one intervention or \"None\".",
            applies: |_| true,
            is_satisfied: |d| has_any_exposure_intervention(&d.exposure),
        },
        ValidationRule {
            id: "EX-03",
            section: "exposure",
            description: "Any medication taken: tick \"None\" or describe medications taken.",
            applies: |_| true,
            is_satisfied: medication_taken_answered,
        },
        // ─── Step 11 — Recommendations ───────────────────────
        ValidationRule {
            id: "RC-01",
            section: "recommendations",
            description: "Next steps in the transport plan are required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.recommendations.transport_plan),
        },
        ValidationRule {
            id: "RC-02",
            section: "recommendations",
            description: "Details of \"Other\" precaution are required when \"Other\" is ticked.",
            applies: |d| d.recommendations.precautions.other,
            is_satisfied: |d| has_text(&d.recommendations.precautions.other_details),
        },
        // ─── Step 12 — Responder Details (CFAR) ──────────────
        ValidationRule {
            id: "RD-01",
            section: "responderDetails",
            description: "CFAR responder name is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.responder_details.name),
        },
        ValidationRule {
            id: "RD-02",
            section: "responderDetails",
            description: "CFAR responder signature is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.responder_details.signature),
        },
        ValidationRule {
            id: "RD-03",
            section: "responderDetails",
            description: "CFAR responder contact information is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.responder_details.contact_information),
        },
        ValidationRule {
            id: "RD-04",
            section: "responderDetails",
            description: "CFAR organization is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.responder_details.cfar_organization),
        },
    ]
}
