//! WHO Prehospital Form (SCF Prehospital) — completeness rules.
//!
//! The form is a structured prehospital documentation instrument for emergency
//! medical services, not a scoring tool. Each rule below identifies a single
//! field that must be completed for the run sheet to be acceptable.
//!
//! Conditional rules are gated through `applies()` so the validator only
//! counts a rule when the relevant clinical branch is active. Notable
//! triage-driven gates:
//!   - RED triage: stricter requirements on airway, breathing, circulation,
//!     disability documentation and IV access.
//!   - Injury flag: requires intent and at least one mechanism.
//!   - Disposition: handover provider/signature/time always required.
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
        "callerAndScene" => "Caller & Scene",
        "chiefComplaintAndVitals" => "Chief Complaint & Vitals",
        "highRiskSigns" => "High Risk Signs",
        "triage" => "Triage",
        "airway" => "Airway (A)",
        "breathing" => "Breathing (B)",
        "circulation" => "Circulation (C)",
        "disability" => "Disability (D)",
        "exposure" => "Exposure (E)",
        "sampleHistory" => "SAMPLE History",
        "injuryDetails" => "Injury Details",
        "physicalExam" => "Physical Exam",
        "additionalInterventions" => "Additional Interventions",
        "assessmentAndPlan" => "Assessment & Plan",
        "reassessments" => "Reassessment",
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

pub fn prehospital_rules() -> &'static [ValidationRule] {
    &[
        // ─── Step 1 — Caller & Scene ──────────────────────────────
        ValidationRule {
            id: "CS-01",
            section: "callerAndScene",
            description: "Patient name is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.caller_and_scene.patient_name),
        },
        ValidationRule {
            id: "CS-02",
            section: "callerAndScene",
            description: "Patient sex (Male / Female) is required.",
            applies: |_| true,
            is_satisfied: |d| {
                let s = d.caller_and_scene.sex.as_str();
                s == "male" || s == "female"
            },
        },
        ValidationRule {
            id: "CS-03",
            section: "callerAndScene",
            description: "Date of birth or age is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.caller_and_scene.date_of_birth_or_age),
        },
        ValidationRule {
            id: "CS-04",
            section: "callerAndScene",
            description: "Run date is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.caller_and_scene.date),
        },
        ValidationRule {
            id: "CS-05",
            section: "callerAndScene",
            description: "Scene call type (Scene call / Inter-Facility Transfer) is required.",
            applies: |_| true,
            is_satisfied: |d| !d.caller_and_scene.scene_call_type.is_empty(),
        },
        ValidationRule {
            id: "CS-06",
            section: "callerAndScene",
            description: "Scene location & type is required.",
            applies: |_| true,
            is_satisfied: |d| !d.caller_and_scene.scene_location_type.is_empty(),
        },
        ValidationRule {
            id: "CS-07",
            section: "callerAndScene",
            description: "Time call received is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.caller_and_scene.time_call_received),
        },
        ValidationRule {
            id: "CS-08",
            section: "callerAndScene",
            description: "Time arrived at scene is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.caller_and_scene.time_arrived_at_scene),
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
            description: "Initial vital signs time is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.chief_complaint_and_vitals.initial_vitals.time),
        },
        ValidationRule {
            id: "CV-03",
            section: "chiefComplaintAndVitals",
            description: "Initial heart rate (HR) is required.",
            applies: |_| true,
            is_satisfied: |d| has_number(d.chief_complaint_and_vitals.initial_vitals.hr),
        },
        ValidationRule {
            id: "CV-04",
            section: "chiefComplaintAndVitals",
            description: "Initial respiratory rate (RR) is required.",
            applies: |_| true,
            is_satisfied: |d| has_number(d.chief_complaint_and_vitals.initial_vitals.rr),
        },
        ValidationRule {
            id: "CV-05",
            section: "chiefComplaintAndVitals",
            description: "Initial blood pressure (BP) is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.chief_complaint_and_vitals.initial_vitals.bp),
        },
        ValidationRule {
            id: "CV-06",
            section: "chiefComplaintAndVitals",
            description: "Initial SpO2 is required.",
            applies: |_| true,
            is_satisfied: |d| has_number(d.chief_complaint_and_vitals.initial_vitals.spo2),
        },
        // ─── Step 4 — Triage ──────────────────────────────────────
        ValidationRule {
            id: "T-01",
            section: "triage",
            description: "Triage category (RED / YELLOW / GREEN) is required.",
            applies: |_| true,
            is_satisfied: |d| {
                let v = d.triage.category.as_str();
                v == "red" || v == "yellow" || v == "green"
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
                    || a.voice_changes
                    || a.stridor
                    || a.oral_airway_burns
                    || a.angioedema
                    || a.obstructed_by_tongue
                    || a.obstructed_by_blood
                    || a.obstructed_by_secretions
                    || a.obstructed_by_vomit
                    || a.obstructed_by_foreign_body
                    || has_text(&a.notes)
            },
        },
        ValidationRule {
            id: "A-02",
            section: "airway",
            description:
                "Airway: an airway intervention is required when triage is RED and Airway is not Normal.",
            applies: |d| d.triage.category == "red" && !d.airway.normal,
            is_satisfied: |d| {
                let a = &d.airway;
                a.intervention_repositioning
                    || a.intervention_suction
                    || a.intervention_opa
                    || a.intervention_npa
                    || a.intervention_lma
                    || a.intervention_bvm
                    || a.intervention_ett
            },
        },
        // ─── Step 6 — Breathing ───────────────────────────────────
        ValidationRule {
            id: "B-01",
            section: "breathing",
            description:
                "Breathing: tick \"Normal\" or record spontaneous respiration / abnormal finding.",
            applies: |_| true,
            is_satisfied: |d| {
                let b = &d.breathing;
                b.normal
                    || is_yes_no_answered(&b.spontaneous_respiration)
                    || b.chest_rise_shallow
                    || b.chest_rise_retractions
                    || b.chest_rise_paradoxical
                    || b.trachea_deviated_left
                    || b.trachea_deviated_right
                    || b.breath_sounds_normal
                    || has_text(&b.breath_sounds_notes)
                    || has_text(&b.notes)
            },
        },
        // ─── Step 7 — Circulation ─────────────────────────────────
        ValidationRule {
            id: "C-01",
            section: "circulation",
            description:
                "Circulation: tick \"Normal\" or record skin / capillary refill / pulses / bleeding finding.",
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
                    || c.capillary_refill3_or_more
                    || c.pulses_weak
                    || c.pulses_asymmetric
                    || is_yes_no_answered(&c.jvd)
                    || has_text(&c.active_bleeding_site)
                    || has_text(&c.notes)
            },
        },
        ValidationRule {
            id: "C-02",
            section: "circulation",
            description:
                "Circulation: bleeding control method is required when an active bleeding site is recorded.",
            applies: |d| has_text(&d.circulation.active_bleeding_site),
            is_satisfied: |d| {
                let c = &d.circulation;
                c.bleeding_controlled_bandage
                    || c.bleeding_controlled_tourniquet
                    || c.bleeding_controlled_direct_pressure
            },
        },
        ValidationRule {
            id: "C-03",
            section: "circulation",
            description:
                "Circulation: IV / IO access or IV fluids are required when triage is RED.",
            applies: |d| d.triage.category == "red",
            is_satisfied: |d| {
                let c = &d.circulation;
                has_text(&c.access_iv_site)
                    || has_text(&c.access_io_site)
                    || has_number(c.ivf_mls)
                    || c.ivf_ns
                    || c.ivf_lr
                    || has_text(&c.ivf_other)
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
                "Disability: GCS components (Eye / Verbal / Motor) are required when triage is RED.",
            applies: |d| d.triage.category == "red",
            is_satisfied: |d| {
                has_number(d.disability.gcs_eye)
                    && has_number(d.disability.gcs_verbal)
                    && has_number(d.disability.gcs_motor)
            },
        },
        // ─── Step 10 — SAMPLE History ─────────────────────────────
        ValidationRule {
            id: "SH-01",
            section: "sampleHistory",
            description: "SAMPLE: Allergies — enter a value or tick \"Unknown\".",
            applies: |_| true,
            is_satisfied: |d| {
                d.sample_history.allergies_unknown || has_text(&d.sample_history.allergies)
            },
        },
        ValidationRule {
            id: "SH-02",
            section: "sampleHistory",
            description: "SAMPLE: Medications — enter a value or tick \"Unknown\".",
            applies: |_| true,
            is_satisfied: |d| {
                d.sample_history.medications_unknown || has_text(&d.sample_history.medications)
            },
        },
        ValidationRule {
            id: "SH-03",
            section: "sampleHistory",
            description: "SAMPLE: Past medical — enter a value or tick \"Unknown\".",
            applies: |_| true,
            is_satisfied: |d| {
                d.sample_history.past_medical_unknown || has_text(&d.sample_history.past_medical)
            },
        },
        ValidationRule {
            id: "SH-04",
            section: "sampleHistory",
            description: "SAMPLE: Events — enter a value or tick \"Unknown\".",
            applies: |_| true,
            is_satisfied: |d| {
                d.sample_history.events_unknown || has_text(&d.sample_history.events)
            },
        },
        // ─── Step 11 — Injury Details ─────────────────────────────
        ValidationRule {
            id: "INJ-01",
            section: "injuryDetails",
            description:
                "Injury intent (Intentional / Unintentional / Self-inflicted) is required when \"Injury\" is checked.",
            applies: |d| d.chief_complaint_and_vitals.injury,
            is_satisfied: |d| {
                let v = d.injury_details.intent.as_str();
                v == "intentional" || v == "unintentional" || v == "self-inflicted"
            },
        },
        ValidationRule {
            id: "INJ-02",
            section: "injuryDetails",
            description: "Injury mechanism is required when \"Injury\" is checked.",
            applies: |d| d.chief_complaint_and_vitals.injury,
            is_satisfied: |d| {
                let m = &d.injury_details;
                m.mechanism_fall
                    || m.mechanism_hit_by_falling_object
                    || m.mechanism_stab_cut
                    || m.mechanism_gunshot
                    || m.mechanism_sexual_assault
                    || m.mechanism_other_blunt_force
                    || m.mechanism_suffocation_choking_hanging
                    || m.mechanism_drowning
                    || has_text(&m.mechanism_burn_caused_by)
                    || m.mechanism_poisoning_toxic_exposure
                    || m.mechanism_unknown
                    || has_text(&m.mechanism_other)
            },
        },
        // ─── Step 14 — Assessment & Plan ──────────────────────────
        ValidationRule {
            id: "AP-01",
            section: "assessmentAndPlan",
            description: "Assessment & Plan summary is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.assessment_and_plan.summary),
        },
        ValidationRule {
            id: "AP-02",
            section: "assessmentAndPlan",
            description: "Presumptive diagnoses are required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.assessment_and_plan.presumptive_diagnoses),
        },
        // ─── Step 16 — Disposition ────────────────────────────────
        ValidationRule {
            id: "DISP-01",
            section: "disposition",
            description: "Disposition is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.disposition.disposition),
        },
        ValidationRule {
            id: "DISP-02",
            section: "disposition",
            description: "Handover time is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.disposition.handover_time),
        },
        ValidationRule {
            id: "DISP-03",
            section: "disposition",
            description: "Handover recipient name is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.disposition.handover_to_name),
        },
        ValidationRule {
            id: "DISP-04",
            section: "disposition",
            description: "Provider name is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.disposition.provider_name),
        },
        ValidationRule {
            id: "DISP-05",
            section: "disposition",
            description: "Provider signature is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.disposition.provider_signature),
        },
        ValidationRule {
            id: "DISP-06",
            section: "disposition",
            description: "Provider signature date is required.",
            applies: |_| true,
            is_satisfied: |d| has_text(&d.disposition.provider_signature_date),
        },
    ]
}
