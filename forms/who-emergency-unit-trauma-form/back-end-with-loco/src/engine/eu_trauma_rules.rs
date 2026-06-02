//! WHO Emergency Unit Form: Trauma — completeness rules.
//!
//! The form is a structured data-collection instrument for emergency unit
//! trauma encounters, not a scoring tool. Each rule below identifies a
//! single field that must be completed for the encounter record to be
//! acceptable. Conditional rules (e.g. cause of death only when disposition
//! = died, time of death only when dead-on-arrival, ambulance level when
//! arrival mode = ambulance, etc.) are gated with `applies()` so the
//! validator only counts a rule when its branch is active for the
//! patient's answers.
//!
//! Triage-driven required fields ratchet the bar up for RED triage
//! patients: they must have spine stabilisation status recorded in airway
//! and a recorded GCS (or "qualified" when sedated/intubated).
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
        "triage" => "Triage",
        "airway" => "Airway (A)",
        "breathing" => "Breathing (B)",
        "circulation" => "Circulation (C)",
        "disability" => "Disability (D)",
        "exposureAndFast" => "Exposure (E) & FAST (F)",
        "injuryHistory" => "Injury History",
        "pastHistories" => "Past Histories",
        "physicalExam" => "Physical Exam",
        "assessmentAndPlan" => "Assessment & Plan",
        "diagnostics" => "Diagnostics",
        "medicationsAndProcedures" => "Medications & Procedures",
        "reassessment" => "Reassessment",
        "disposition" => "Disposition",
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

pub fn eu_trauma_rules() -> &'static [ValidationRule] {
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
            description: "Injury location (or \"Unknown\") is required.",
            applies: |_| true,
            is_satisfied: |d| {
                d.patient_registration.injury_location_unknown
                    || has_text(&d.patient_registration.injury_location)
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
            description: "Allergies: enter a list or tick \"Unknown\".",
            applies: |_| true,
            is_satisfied: |d| {
                d.chief_complaint_and_vitals.allergies_unknown
                    || has_text(&d.chief_complaint_and_vitals.allergies)
            },
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
            applies: |d| !d.chief_complaint_and_vitals.dead_on_arrival,
            is_satisfied: |d| has_number(d.chief_complaint_and_vitals.initial_vitals.pulse),
        },
        ValidationRule {
            id: "CV-05",
            section: "chiefComplaintAndVitals",
            description: "Initial respiratory rate is required.",
            applies: |d| !d.chief_complaint_and_vitals.dead_on_arrival,
            is_satisfied: |d| {
                has_number(d.chief_complaint_and_vitals.initial_vitals.respiratory_rate)
            },
        },
        ValidationRule {
            id: "CV-06",
            section: "chiefComplaintAndVitals",
            description: "Initial SpO2 is required.",
            applies: |d| !d.chief_complaint_and_vitals.dead_on_arrival,
            is_satisfied: |d| has_number(d.chief_complaint_and_vitals.initial_vitals.spo2),
        },
        ValidationRule {
            id: "CV-07",
            section: "chiefComplaintAndVitals",
            description: "Initial systolic blood pressure is required.",
            applies: |d| !d.chief_complaint_and_vitals.dead_on_arrival,
            is_satisfied: |d| has_number(d.chief_complaint_and_vitals.initial_vitals.bp_systolic),
        },
        ValidationRule {
            id: "CV-08",
            section: "chiefComplaintAndVitals",
            description: "Time of death is required when patient is marked Dead on arrival.",
            applies: |d| d.chief_complaint_and_vitals.dead_on_arrival,
            is_satisfied: |d| has_text(&d.chief_complaint_and_vitals.time_of_death),
        },
        // ─── Step 4 — Triage ──────────────────────────────────────
        ValidationRule {
            id: "T-01",
            section: "triage",
            description: "Triage category (RED / YELLOW / GREEN) is required.",
            applies: |_| true,
            is_satisfied: |d| {
                let c = d.triage.category.as_str();
                c == "red" || c == "yellow" || c == "green"
            },
        },
        // ─── Step 5 — Airway ──────────────────────────────────────
        ValidationRule {
            id: "A-01",
            section: "airway",
            description: "Airway: tick \"Normal\" or describe an abnormal finding.",
            applies: |_| true,
            is_satisfied: |d| {
                let a = &d.airway;
                a.normal
                    || a.swelling
                    || a.stridor
                    || a.voice_changes
                    || a.burns
                    || a.obstructed_by_tongue
                    || a.obstructed_by_blood
                    || a.obstructed_by_secretion
                    || a.obstructed_by_vomit
                    || a.obstructed_by_foreign_body
                    || has_text(&a.notes)
            },
        },
        ValidationRule {
            id: "A-02",
            section: "airway",
            description: "Spine stabilization status is required for RED triage.",
            applies: |d| d.triage.category == "red",
            is_satisfied: |d| {
                let s = d.airway.spine_stabilized.as_str();
                s == "before-arrival" || s == "in-eu" || s == "not-needed"
            },
        },
        // ─── Step 6 — Breathing ───────────────────────────────────
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
                    || b.cyanosis
                    || has_text(&b.breath_sounds_left)
                    || has_text(&b.breath_sounds_right)
                    || has_text(&b.notes)
            },
        },
        // ─── Step 7 — Circulation ─────────────────────────────────
        ValidationRule {
            id: "C-01",
            section: "circulation",
            description:
                "Circulation: tick \"Normal\" or record a skin / capillary-refill / pulse / bleeding finding.",
            applies: |_| true,
            is_satisfied: |d| {
                let c = &d.circulation;
                c.normal
                    || c.skin_warm
                    || c.skin_dry
                    || c.skin_cool
                    || c.skin_moist
                    || c.skin_pale
                    || c.capillary_refill_under3
                    || has_number(c.capillary_refill_seconds)
                    || c.pulses_weak
                    || c.pulses_asymmetric
                    || is_yes_no_answered(&c.jvd)
                    || is_yes_no_answered(&c.unstable_pelvis)
                    || c.bleeding_control_direct_pressure
                    || c.bleeding_control_bandage
                    || c.bleeding_control_tourniquet
                    || has_text(&c.notes)
            },
        },
        // ─── Step 8 — Disability ──────────────────────────────────
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
                "Disability: GCS total is required (or tick \"Qualified\" if patient is sedated/intubated).",
            applies: |d| d.triage.category == "red",
            is_satisfied: |d| d.disability.gcs_qualified || has_number(d.disability.gcs_total),
        },
        // ─── Step 10 — Injury History ─────────────────────────────
        ValidationRule {
            id: "IH-01",
            section: "injuryHistory",
            description: "Date of injury is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.injury_history.date_of_injury),
        },
        ValidationRule {
            id: "IH-02",
            section: "injuryHistory",
            description: "Time of injury (24h) is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.injury_history.time_of_injury),
        },
        ValidationRule {
            id: "IH-03",
            section: "injuryHistory",
            description: "Intent of injury is required.",
            applies: |_| true,
            is_satisfied: |d| !d.injury_history.intent.is_empty(),
        },
        ValidationRule {
            id: "IH-04",
            section: "injuryHistory",
            description:
                "Prehospital care provider (None / Layperson / Healthcare professional) is required.",
            applies: |_| true,
            is_satisfied: |d| {
                let p = d.injury_history.prehospital_care_provider.as_str();
                p == "none" || p == "layperson" || p == "healthcare-professional"
            },
        },
        ValidationRule {
            id: "IH-05",
            section: "injuryHistory",
            description: "Mechanism of injury must be recorded (tick at least one or \"Unknown\").",
            applies: |_| true,
            is_satisfied: |d| {
                let i = &d.injury_history;
                i.mech_road_traffic_incident
                    || has_text(&i.mech_fall_from)
                    || i.mech_hit_by_falling_object
                    || i.mech_stab_cut
                    || i.mech_gunshot
                    || i.mech_sexual_assault
                    || i.mech_other_blunt_force
                    || i.mech_suffocation_choking_hanging
                    || i.mech_drowning
                    || has_text(&i.mech_burn_caused_by)
                    || i.mech_poisoning_toxic_exposure
                    || i.mech_unknown
            },
        },
        // ─── Step 11 — Past Histories ─────────────────────────────
        ValidationRule {
            id: "PH-01",
            section: "pastHistories",
            description: "Past medical: tick None / Unknown or record a condition.",
            applies: |_| true,
            is_satisfied: |d| {
                let p = &d.past_histories;
                p.pmh_none
                    || p.pmh_unknown
                    || p.pmh_htn
                    || p.pmh_dm
                    || p.pmh_copd
                    || p.pmh_psych
                    || p.pmh_renal_disease
                    || has_text(&p.pmh_other)
            },
        },
        ValidationRule {
            id: "PH-02",
            section: "pastHistories",
            description: "Medications: list or tick None / Unknown.",
            applies: |_| true,
            is_satisfied: |d| {
                d.past_histories.medications_none
                    || d.past_histories.medications_unknown
                    || has_text(&d.past_histories.medications)
            },
        },
        // ─── Step 13 — Assessment & Plan ──────────────────────────
        ValidationRule {
            id: "AP-01",
            section: "assessmentAndPlan",
            description: "Assessment & Plan narrative is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.assessment_and_plan.narrative),
        },
        // ─── Step 17 — Disposition ────────────────────────────────
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
            description: "Admit ward (Ward / ICU / OT) is required when disposition is \"Admit\".",
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
