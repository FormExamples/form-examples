//! Core types for the WHO Prehospital Form (SCF Prehospital) data-collection engine.
//!
//! `serde(rename_all = "camelCase")` is applied to all structs that may be
//! shared with the front-end (the canonical wire format is camelCase).

use serde::{Deserialize, Serialize};

/// Priority for a clinician-facing flag.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum FlagPriority {
    Urgent,
    High,
    Medium,
    Low,
}

impl FlagPriority {
    #[allow(dead_code)]
    pub fn label(self) -> &'static str {
        match self {
            FlagPriority::Urgent => "Urgent",
            FlagPriority::High => "High",
            FlagPriority::Medium => "Medium",
            FlagPriority::Low => "Low",
        }
    }
}

// ──────────────────────────────────────────────
// Step 1 — Caller & Scene
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CallerAndScene {
    pub mass_casualty: bool,
    pub caller_name: String,
    pub caller_phone: String,
    pub patient_name: String,
    pub date_of_birth_or_age: String,
    /// "" | "male" | "female"
    pub sex: String,
    pub patient_address: String,
    pub occupation: String,
    pub date: String,
    /// "" | "scene" | "inter-facility-transfer"
    pub scene_call_type: String,
    pub run_number: String,
    /// "" | "residence" | "school" | "public-building" | "health-facility" | "street" | "other"
    pub scene_location_type: String,
    pub scene_location_other: String,
    pub time_call_received: String,
    pub time_en_route_to_scene: String,
    pub time_arrived_at_scene: String,
    pub time_transporting: String,
    pub time_at_facility: String,
    pub time_in_service: String,
}

// ──────────────────────────────────────────────
// Step 2 — Chief Complaint & Initial Vitals
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InitialVitals {
    pub time: String,
    pub hr: Option<f64>,
    pub rr: Option<f64>,
    pub bp: String,
    pub temp_c: Option<f64>,
    pub rbs: Option<f64>,
    pub spo2: Option<f64>,
    pub spo2_on_oxygen: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ChiefComplaintAndVitals {
    pub chief_complaint: String,
    pub injury: bool,
    pub initial_vitals: InitialVitals,
    pub care_in_progress_on_arrival: String,
    /// "" | "yes" | "no" | "unknown"
    pub pregnant: String,
    pub pain_score: Option<f64>,
}

// ──────────────────────────────────────────────
// Step 3 — High Risk Signs
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HighRiskSigns {
    // A/B
    pub stridor: bool,
    pub cyanosis: bool,
    pub respiratory_distress: bool,
    // C
    pub poor_perfusion: bool,
    pub weak_fast_pulse: bool,
    pub capillary_refill_over3s: bool,
    pub heavy_bleeding: bool,
    pub child_lethargy: bool,
    pub child_sunken_eyes: bool,
    pub child_slow_skin_pinch: bool,
    pub child_poor_drinking: bool,
    pub adult_hr_under50_or_over150: bool,
    // D
    pub unresponsive: bool,
    pub acute_convulsions: bool,
    pub hypoglycaemia: bool,
    pub acute_focal_neurologic_deficit: bool,
    pub altered_mental_status_with_fever_hypothermia_stiff_neck_headache: bool,
    // Other
    pub high_risk_trauma: bool,
    pub threatened_limb: bool,
    pub snake_bite: bool,
    pub poisoning_ingestion_chemical_exposure: bool,
    pub violent_or_aggressive: bool,
    pub temp_over39_or_under36: bool,
    pub acute_testicular_pain_or_priapism: bool,
    pub pregnant_with_high_risk_findings: bool,
    pub adult_severe_chest_or_abdominal_pain_or_ecg_ischaemia: bool,
    pub infant_under8_days: bool,
    pub infant_under2_months_with_temp_over39_or_under36: bool,
}

// ──────────────────────────────────────────────
// Step 4 — Triage
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Triage {
    /// "" | "red" | "yellow" | "green"
    pub category: String,
    pub triaged_for: String,
}

// ──────────────────────────────────────────────
// Step 5 — Airway (A)
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Airway {
    pub normal: bool,
    pub voice_changes: bool,
    pub stridor: bool,
    pub oral_airway_burns: bool,
    pub angioedema: bool,
    pub obstructed_by_tongue: bool,
    pub obstructed_by_blood: bool,
    pub obstructed_by_secretions: bool,
    pub obstructed_by_vomit: bool,
    pub obstructed_by_foreign_body: bool,
    pub intervention_repositioning: bool,
    pub intervention_suction: bool,
    pub intervention_opa: bool,
    pub intervention_npa: bool,
    pub intervention_lma: bool,
    pub intervention_bvm: bool,
    pub intervention_ett: bool,
    pub c_spine_not_needed: bool,
    pub c_spine_done: bool,
    pub notes: String,
}

// ──────────────────────────────────────────────
// Step 6 — Breathing (B)
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Breathing {
    pub normal: bool,
    /// "" | "yes" | "no"
    pub spontaneous_respiration: String,
    pub chest_rise_shallow: bool,
    pub chest_rise_retractions: bool,
    pub chest_rise_paradoxical: bool,
    pub trachea_midline: bool,
    pub trachea_deviated_left: bool,
    pub trachea_deviated_right: bool,
    pub breath_sounds_normal: bool,
    pub breath_sounds_notes: String,
    pub oxygen_litres: Option<f64>,
    pub oxygen_nasal_cannula: bool,
    pub oxygen_face_mask: bool,
    pub oxygen_non_rebreather: bool,
    pub oxygen_bvm: bool,
    pub oxygen_bipap_cpap: bool,
    pub oxygen_other: String,
    pub notes: String,
}

// ──────────────────────────────────────────────
// Step 7 — Circulation (C)
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Circulation {
    pub normal: bool,
    pub skin_warm: bool,
    pub skin_dry: bool,
    pub skin_pale: bool,
    pub skin_cyanotic: bool,
    pub skin_moist: bool,
    pub skin_cool: bool,
    pub capillary_refill_under3: bool,
    pub capillary_refill3_or_more: bool,
    pub pulses_weak: bool,
    pub pulses_asymmetric: bool,
    /// "" | "yes" | "no"
    pub jvd: String,
    pub active_bleeding_site: String,
    pub bleeding_controlled_bandage: bool,
    pub bleeding_controlled_tourniquet: bool,
    pub bleeding_controlled_direct_pressure: bool,
    pub bleeding_control_time: String,
    pub access_iv_site: String,
    pub access_iv_size: String,
    pub access_io_site: String,
    pub access_io_size: String,
    pub ivf_mls: Option<f64>,
    pub ivf_ns: bool,
    pub ivf_lr: bool,
    pub ivf_other: String,
    pub pelvis_stabilized: bool,
    pub femur_fracture_stabilized: bool,
    pub notes: String,
}

// ──────────────────────────────────────────────
// Step 8 — Disability (D)
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Disability {
    pub normal: bool,
    pub blood_glucose: Option<f64>,
    /// "" | "A" | "V" | "P" | "U"
    pub avpu: String,
    pub gcs_eye: Option<f64>,
    pub gcs_verbal: Option<f64>,
    pub gcs_motor: Option<f64>,
    pub moves_left_arm: bool,
    pub moves_right_arm: bool,
    pub moves_left_leg: bool,
    pub moves_right_leg: bool,
    pub pupil_size_left: Option<f64>,
    pub pupil_size_right: Option<f64>,
    pub pupil_reactivity_left: String,
    pub pupil_reactivity_right: String,
    pub intervention_glucose_checked: bool,
    pub intervention_glucose_given: bool,
    pub intervention_naloxone_given: bool,
    pub notes: String,
}

// ──────────────────────────────────────────────
// Step 9 — Exposure (E)
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Exposure {
    pub normal: bool,
    pub exposed_completely: bool,
    pub notes: String,
}

// ──────────────────────────────────────────────
// Step 10 — SAMPLE History
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SampleHistory {
    pub signs_symptoms: String,
    pub signs_symptoms_unknown: bool,
    pub allergies: String,
    pub allergies_unknown: bool,
    pub medications: String,
    pub medications_unknown: bool,
    pub past_medical: String,
    pub past_medical_unknown: bool,
    pub past_surgeries: String,
    pub past_surgeries_unknown: bool,
    pub last_ate_hours: Option<f64>,
    pub last_ate_unknown: bool,
    pub events: String,
    pub events_unknown: bool,
}

// ──────────────────────────────────────────────
// Step 11 — Injury Details
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InjuryDetails {
    /// "" | "intentional" | "unintentional" | "self-inflicted"
    pub intent: String,
    pub mechanism_fall: bool,
    pub mechanism_hit_by_falling_object: bool,
    pub mechanism_stab_cut: bool,
    pub mechanism_gunshot: bool,
    pub mechanism_sexual_assault: bool,
    pub mechanism_other_blunt_force: bool,
    pub mechanism_suffocation_choking_hanging: bool,
    pub mechanism_drowning: bool,
    /// "" | "yes" | "no"
    pub mechanism_drowning_life_vest: String,
    pub mechanism_burn_caused_by: String,
    pub mechanism_poisoning_toxic_exposure: bool,
    pub mechanism_unknown: bool,
    pub mechanism_other: String,
    pub road_traffic_driver: bool,
    pub road_traffic_passenger: bool,
    pub road_traffic_pedestrian: bool,
    pub road_traffic_ejected: bool,
    pub road_traffic_extricated: bool,
    /// "" | "car" | "bike" | "motorbike" | "other"
    pub vehicle_type: String,
    pub vehicle_other: String,
    pub safety_airbag: bool,
    pub safety_seatbelt: bool,
    pub safety_helmet: bool,
    pub safety_other_restraint: String,
}

// ──────────────────────────────────────────────
// Step 12 — Physical Exam
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PeEntry {
    pub normal: bool,
    pub notes: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PhysicalExam {
    pub general: PeEntry,
    pub heent: PeEntry,
    pub respiratory: PeEntry,
    pub cardiac: PeEntry,
    pub abdominal: PeEntry,
    pub pelvis_gu: PeEntry,
    pub neurologic: PeEntry,
    pub psychiatric: PeEntry,
    pub musculoskeletal: PeEntry,
    pub skin: PeEntry,
}

// ──────────────────────────────────────────────
// Step 13 — Additional Interventions
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalInterventions {
    pub meds_bronchodilators: bool,
    pub meds_epinephrine: bool,
    pub meds_aspirin: bool,
    pub meds_seizure_medication: bool,
    pub meds_analgesia: bool,
    pub meds_iv_fluid_infusion: bool,
    pub meds_other: String,
    pub proc_wound_bandaging: bool,
    pub proc_burn_dressing: bool,
    pub proc_splinting_reduction: bool,
    pub proc_pelvic_stabilization: bool,
    pub proc_ecg: bool,
    pub proc_other: String,
}

// ──────────────────────────────────────────────
// Step 14 — Assessment & Plan
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentAndPlan {
    pub summary: String,
    pub differential: String,
    pub presumptive_diagnoses: String,
}

// ──────────────────────────────────────────────
// Step 15 — Reassessment (up to 3 sets)
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Reassessment {
    pub time: String,
    pub hr: Option<f64>,
    pub rr: Option<f64>,
    pub temp_c: Option<f64>,
    pub spo2: Option<f64>,
    pub spo2_on_oxygen: String,
    pub rbs: Option<f64>,
    pub pain: Option<f64>,
    pub unchanged: bool,
}

// ──────────────────────────────────────────────
// Step 16 — Disposition
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FinalVitals {
    pub time: String,
    pub hr: Option<f64>,
    pub rr: Option<f64>,
    pub temp_c: Option<f64>,
    pub bp: String,
    pub spo2: Option<f64>,
    pub spo2_on_oxygen: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Disposition {
    pub disposition: String,
    pub handover_time: String,
    pub handover_to_name: String,
    pub handover_to_cadre: String,
    pub handover_to_signature: String,
    pub final_vitals: FinalVitals,
    /// "" | "yes" | "no"
    pub plan_discussed_with_patient: String,
    pub provider_name: String,
    pub provider_signature: String,
    pub provider_signature_date: String,
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub caller_and_scene: CallerAndScene,
    pub chief_complaint_and_vitals: ChiefComplaintAndVitals,
    pub high_risk_signs: HighRiskSigns,
    pub triage: Triage,
    pub airway: Airway,
    pub breathing: Breathing,
    pub circulation: Circulation,
    pub disability: Disability,
    pub exposure: Exposure,
    pub sample_history: SampleHistory,
    pub injury_details: InjuryDetails,
    pub physical_exam: PhysicalExam,
    pub additional_interventions: AdditionalInterventions,
    pub assessment_and_plan: AssessmentAndPlan,
    pub reassessments: Vec<Reassessment>,
    pub disposition: Disposition,
}

// ──────────────────────────────────────────────
// Validation engine types
// ──────────────────────────────────────────────

/// A fired rule: a required field that has not been satisfied.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub section: String,
    pub description: String,
}

/// Per-section completeness summary.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SectionCompleteness {
    pub section: String,
    pub section_label: String,
    pub required: u32,
    pub satisfied: u32,
    pub missing: Vec<FiredRule>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ValidationResult {
    pub complete: bool,
    pub total_required: u32,
    pub total_satisfied: u32,
    pub sections: Vec<SectionCompleteness>,
    pub missing: Vec<FiredRule>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FlaggedIssue {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: FlagPriority,
}
