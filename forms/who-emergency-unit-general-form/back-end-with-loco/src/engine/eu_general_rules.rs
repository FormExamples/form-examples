//! WHO Emergency Unit (General) Form — completeness rules.
//!
//! The form is a structured data-collection instrument for non-trauma
//! emergency unit visits, not a scoring tool. Each rule below identifies a
//! single field that must be completed for the encounter record to be
//! acceptable. Conditional rules (e.g. ambulance level only when arrival
//! mode = ambulance, admit ward only when disposition = admit, deficit
//! description only when deficit is checked) are gated with `applies()`
//! so the validator only counts a rule when its branch is active for the
//! patient's answers.
//!
//! Rule IDs follow the pattern <SECTION>-<NN>; the prefix lets the report
//! group fired rules by section.

use crate::engine::types::AssessmentData;

/// True if a string is non-empty after trimming.
pub fn has_text(s: &str) -> bool {
    !s.trim().is_empty()
}

/// True if a numeric field has a usable value.
pub fn has_number(n: Option<f64>) -> bool {
    matches!(n, Some(v) if !v.is_nan())
}

/// True if a Yes/No field has been answered (either yes or no).
pub fn is_yes_no_answered(value: &str) -> bool {
    value == "yes" || value == "no"
}

/// Human-readable label for a section key.
pub fn section_label(section: &str) -> &'static str {
    match section {
        "patientRegistration" => "Patient Registration",
        "chiefComplaintAndVitals" => "Chief Complaint & Vitals",
        "highRiskSigns" => "High Risk Signs",
        "airway" => "Airway (A)",
        "breathing" => "Breathing (B)",
        "circulation" => "Circulation (C)",
        "disability" => "Disability (D)",
        "historyOfPresentIllness" => "History of Present Illness",
        "reviewOfSystems" => "Review of Systems",
        "pastMedicalHistory" => "Past Medical History",
        "physicalExam" => "Physical Exam",
        "diagnostics" => "Diagnostics",
        "additionalInterventions" => "Additional Interventions",
        "assessmentAndPlan" => "Assessment & Plan",
        "reassessment" => "Reassessment",
        "disposition" => "Disposition",
        _ => "",
    }
}

/// Validation rule.
pub struct ValidationRule {
    /// ID.
    pub id: &'static str,
    /// Section.
    pub section: &'static str,
    /// Description.
    pub description: &'static str,
    /// Applies.
    pub applies: fn(&AssessmentData) -> bool,
    /// Is satisfied.
    pub is_satisfied: fn(&AssessmentData) -> bool,
}

/// Eu general rules.
pub fn eu_general_rules() -> &'static [ValidationRule] {
    &[
        // ─── Step 1 — Patient Registration ────────────────────────
        ValidationRule {
            id: "PR-01",
            section: "patientRegistration",
            description: "Patient surname (family name) is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.patient_registration.surname),
        },
        ValidationRule {
            id: "PR-02",
            section: "patientRegistration",
            description: "Patient first name (given name) is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.patient_registration.first_name),
        },
        ValidationRule {
            id: "PR-03",
            section: "patientRegistration",
            description: "Patient sex (Male / Female / Other) is required.",
            applies: |_| true,
            is_satisfied: |d| {
                let s = d.patient_registration.sex.as_str();
                s == "male" || s == "female" || s == "other"
            },
        },
        ValidationRule {
            id: "PR-04",
            section: "patientRegistration",
            description: "Patient date of birth is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.patient_registration.date_of_birth),
        },
        ValidationRule {
            id: "PR-05",
            section: "patientRegistration",
            description: "Date of arrival is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.patient_registration.date_of_arrival),
        },
        ValidationRule {
            id: "PR-06",
            section: "patientRegistration",
            description: "Time of arrival (24h) is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.patient_registration.time_of_arrival),
        },
        ValidationRule {
            id: "PR-07",
            section: "patientRegistration",
            description: "Arrival mode is required.",
            applies: |_| true,
            is_satisfied: |d| !d.patient_registration.arrival_mode.is_empty(),
        },
        ValidationRule {
            id: "PR-08",
            section: "patientRegistration",
            description:
                "Ambulance level (Basic / Advanced) is required when arrival mode is ambulance.",
            applies: |d| d.patient_registration.arrival_mode == "ambulance",
            is_satisfied: |d| {
                let lvl = d.patient_registration.ambulance_level.as_str();
                lvl == "basic" || lvl == "advanced"
            },
        },
        // ─── Step 2 — Chief Complaint & Vitals ────────────────────
        ValidationRule {
            id: "CV-01",
            section: "chiefComplaintAndVitals",
            description: "Chief complaint is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.chief_complaint_and_vitals.chief_complaint),
        },
        ValidationRule {
            id: "CV-02",
            section: "chiefComplaintAndVitals",
            description: "Triage category (red / orange / yellow / green) is required.",
            applies: |_| true,
            is_satisfied: |d| !d.chief_complaint_and_vitals.triage_category.is_empty(),
        },
        ValidationRule {
            id: "CV-03",
            section: "chiefComplaintAndVitals",
            description: "Initial vital signs time is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.chief_complaint_and_vitals.initial_vitals.time),
        },
        ValidationRule {
            id: "CV-04",
            section: "chiefComplaintAndVitals",
            description: "Initial pulse is required.",
            applies: |_| true,
            is_satisfied: |d| has_number(d.chief_complaint_and_vitals.initial_vitals.pulse),
        },
        ValidationRule {
            id: "CV-05",
            section: "chiefComplaintAndVitals",
            description: "Initial respiratory rate is required.",
            applies: |_| true,
            is_satisfied: |d| {
                has_number(d.chief_complaint_and_vitals.initial_vitals.respiratory_rate)
            },
        },
        ValidationRule {
            id: "CV-06",
            section: "chiefComplaintAndVitals",
            description: "Initial SpO2 is required.",
            applies: |_| true,
            is_satisfied: |d| has_number(d.chief_complaint_and_vitals.initial_vitals.spo2),
        },
        ValidationRule {
            id: "CV-07",
            section: "chiefComplaintAndVitals",
            description: "Initial systolic blood pressure is required.",
            applies: |_| true,
            is_satisfied: |d| has_number(d.chief_complaint_and_vitals.initial_vitals.bp_systolic),
        },
        // ─── Step 4 — Airway ──────────────────────────────────────
        ValidationRule {
            id: "A-01",
            section: "airway",
            description: "Airway: tick \"Normal\" or describe an abnormal finding.",
            applies: |_| true,
            is_satisfied: |d| {
                let a = &d.airway;
                a.normal
                    || a.angioedema
                    || a.stridor
                    || a.voice_changes
                    || a.oral_airway_burns
                    || a.obstructed_by_tongue
                    || a.obstructed_by_blood
                    || a.obstructed_by_secretions
                    || a.obstructed_by_vomit
                    || a.obstructed_by_foreign_body
                    || has_text(&a.notes)
            },
        },
        // ─── Step 5 — Breathing ───────────────────────────────────
        ValidationRule {
            id: "B-01",
            section: "breathing",
            description:
                "Breathing: tick \"Normal\" or record a respiratory rate / abnormal finding.",
            applies: |_| true,
            is_satisfied: |d| {
                let b = &d.breathing;
                b.normal
                    || has_number(b.spontaneous_respiratory_rate)
                    || b.chest_rise_shallow
                    || b.chest_rise_retractions
                    || b.chest_rise_paradoxical
                    || b.trachea_deviated_left
                    || b.trachea_deviated_right
                    || has_text(&b.breath_sounds_left)
                    || has_text(&b.breath_sounds_right)
                    || has_text(&b.notes)
            },
        },
        // ─── Step 6 — Circulation ─────────────────────────────────
        ValidationRule {
            id: "C-01",
            section: "circulation",
            description:
                "Circulation: tick \"Normal\" or record a skin / capillary-refill / pulse finding.",
            applies: |_| true,
            is_satisfied: |d| {
                let c = &d.circulation;
                c.normal
                    || c.skin_warm
                    || c.skin_dry
                    || c.skin_pale
                    || c.skin_cyanotic
                    || c.skin_moist
                    || c.skin_cool
                    || c.capillary_refill_under3
                    || has_number(c.capillary_refill_seconds)
                    || c.pulses_weak
                    || c.pulses_asymmetric
                    || is_yes_no_answered(&c.jvd)
                    || has_text(&c.notes)
            },
        },
        // ─── Step 7 — Disability ──────────────────────────────────
        ValidationRule {
            id: "D-01",
            section: "disability",
            description: "Disability: AVPU level (A / V / P / U) is required.",
            applies: |_| true,
            is_satisfied: |d| {
                let v = d.disability.avpu.as_str();
                v == "A" || v == "V" || v == "P" || v == "U"
            },
        },
        ValidationRule {
            id: "D-02",
            section: "disability",
            description:
                "Disability: deficit description is required when \"Deficit\" is checked.",
            applies: |d| d.disability.deficit,
            is_satisfied: |d| has_text(&d.disability.deficit_description),
        },
        // ─── Step 8 — History of Present Illness ──────────────────
        ValidationRule {
            id: "HPI-01",
            section: "historyOfPresentIllness",
            description: "History of present illness narrative is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.history_of_present_illness.narrative),
        },
        // ─── Step 10 — Past Medical History ───────────────────────
        ValidationRule {
            id: "PMH-01",
            section: "pastMedicalHistory",
            description: "History obtained from (source of history) is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.past_medical_history.history_obtained_from),
        },
        ValidationRule {
            id: "PMH-02",
            section: "pastMedicalHistory",
            description: "Medications: enter a list or tick \"Unknown\".",
            applies: |_| true,
            is_satisfied: |d| {
                d.past_medical_history.medications_unknown
                    || has_text(&d.past_medical_history.medications)
            },
        },
        ValidationRule {
            id: "PMH-03",
            section: "pastMedicalHistory",
            description: "Allergies: enter a list or tick \"Unknown\".",
            applies: |_| true,
            is_satisfied: |d| {
                d.past_medical_history.allergies_unknown
                    || has_text(&d.past_medical_history.allergies)
            },
        },
        // ─── Step 14 — Assessment & Plan ──────────────────────────
        ValidationRule {
            id: "AP-01",
            section: "assessmentAndPlan",
            description: "Assessment & Plan narrative is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.assessment_and_plan.narrative),
        },
        // ─── Step 16 — Disposition ────────────────────────────────
        ValidationRule {
            id: "DISP-01",
            section: "disposition",
            description: "ED departure date is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.disposition.ed_departure_date),
        },
        ValidationRule {
            id: "DISP-02",
            section: "disposition",
            description: "ED departure time (24h) is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.disposition.ed_departure_time),
        },
        ValidationRule {
            id: "DISP-03",
            section: "disposition",
            description: "Disposition (Admit / Transfer / Discharge / Died) is required.",
            applies: |_| true,
            is_satisfied: |d| {
                let v = d.disposition.disposition.as_str();
                v == "admit" || v == "transfer" || v == "discharge" || v == "died"
            },
        },
        ValidationRule {
            id: "DISP-04",
            section: "disposition",
            description: "Diagnoses / Impressions are required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.disposition.diagnoses_impressions),
        },
        ValidationRule {
            id: "DISP-05",
            section: "disposition",
            description:
                "Admit ward (Ward / ICU / OT) is required when disposition is \"Admit\".",
            applies: |d| d.disposition.disposition == "admit",
            is_satisfied: |d| {
                let v = d.disposition.admit_ward.as_str();
                v == "ward" || v == "icu" || v == "ot"
            },
        },
        ValidationRule {
            id: "DISP-06",
            section: "disposition",
            description: "Transfer destination is required when disposition is \"Transfer\".",
            applies: |d| d.disposition.disposition == "transfer",
            is_satisfied: |d| has_text(&d.disposition.transfer_to),
        },
        ValidationRule {
            id: "DISP-07",
            section: "disposition",
            description:
                "Cause of death is required when disposition is \"Died\" (NOT cardiopulmonary arrest).",
            applies: |d| d.disposition.disposition == "died",
            is_satisfied: |d| has_text(&d.disposition.died_cause),
        },
        ValidationRule {
            id: "DISP-08",
            section: "disposition",
            description: "Emergency unit provider name / title is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.disposition.emergency_unit_provider),
        },
        ValidationRule {
            id: "DISP-09",
            section: "disposition",
            description: "Provider signature is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.disposition.signature),
        },
        ValidationRule {
            id: "DISP-10",
            section: "disposition",
            description: "Provider signature date is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.disposition.signature_date),
        },
    ]
}
