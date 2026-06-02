//! Core types for the WHO Emergency Unit (General) Form data-collection engine.
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
// Step 1 — Patient Registration
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PatientRegistration {
    pub hospital_registration_number: String,
    pub surname: String,
    pub first_name: String,
    /// "" | "male" | "female" | "other"
    pub sex: String,
    pub date_of_birth: String,
    pub age: Option<f64>,
    /// "" | "infant" | "child" | "adult"
    pub age_category: String,
    pub weight_kg: Option<f64>,
    pub date_of_arrival: String,
    pub time_of_arrival: String,
    /// "" | "ambulance" | "car-private" | "car-taxi" | "motor-2-3-private"
    /// | "motor-2-3-taxi" | "public-transport" | "walk" | "other"
    pub arrival_mode: String,
    /// "" | "basic" | "advanced"
    pub ambulance_level: String,
    pub emergency_system_activation_date: String,
    pub emergency_system_activation_time: String,
    pub emergency_system_dispatch_date: String,
    pub emergency_system_dispatch_time: String,
    pub emergency_personnel_arrival_date: String,
    pub emergency_personnel_arrival_time: String,
    pub occupation: String,
    pub patient_residence: String,
    pub patient_residence_unknown: bool,
    pub racial_and_ethnic_identity: String,
    pub racial_and_ethnic_identity_unknown: bool,
    /// "" | "yes" | "no"
    pub interpreter_required: String,
    pub contact_person: String,
    pub contact_phone: String,
    pub contact_relation: String,
    pub prior_facilities_count: Option<f64>,
    pub referred_from: String,
    pub ambulatory: bool,
    pub non_ambulatory: bool,
    pub acute: bool,
    pub chronic: bool,
    /// "" | "yes" | "no"
    pub daily_activities_limited: String,
}

// ──────────────────────────────────────────────
// Step 2 — Chief Complaint & Vitals
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InitialVitals {
    pub time: String,
    pub temp_c: Option<f64>,
    pub bp_systolic: Option<f64>,
    pub bp_diastolic: Option<f64>,
    pub pulse: Option<f64>,
    pub respiratory_rate: Option<f64>,
    pub spo2: Option<f64>,
    pub spo2_on_oxygen: String,
    pub pain_score: Option<f64>,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ChiefComplaintAndVitals {
    pub chief_complaint: String,
    /// "" | "red" | "orange" | "yellow" | "green"
    pub triage_category: String,
    pub initial_vitals: InitialVitals,
    pub provider_assessment_date: String,
    pub provider_assessment_time: String,
    pub dead_on_arrival: bool,
}

// ──────────────────────────────────────────────
// Step 3 — High Risk Signs
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HighRiskSigns {
    pub abnormal_avpu: bool,
    pub abnormal_heart_rate: bool,
    pub stridor_or_voice_change: bool,
    pub poor_perfusion: bool,
    pub abnormal_temperature: bool,
    pub low_spo2: bool,
    pub respiratory_distress: bool,
    pub vomits_everything_or_cannot_feed: bool,
}

// ──────────────────────────────────────────────
// Step 4 — Airway (A)
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Airway {
    pub normal: bool,
    pub angioedema: bool,
    pub stridor: bool,
    pub voice_changes: bool,
    pub oral_airway_burns: bool,
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
    pub notes: String,
}

// ──────────────────────────────────────────────
// Step 5 — Breathing (B)
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Breathing {
    pub normal: bool,
    pub spontaneous_respiratory_rate: Option<f64>,
    pub chest_rise_shallow: bool,
    pub chest_rise_retractions: bool,
    pub chest_rise_paradoxical: bool,
    pub trachea_midline: bool,
    pub trachea_deviated_left: bool,
    pub trachea_deviated_right: bool,
    pub breath_sounds_left: String,
    pub breath_sounds_right: String,
    pub oxygen_litres: Option<f64>,
    pub oxygen_nasal_cannula: bool,
    pub oxygen_mask: bool,
    pub oxygen_non_rebreather: bool,
    pub oxygen_bvm: bool,
    pub oxygen_cpap_bipap: bool,
    pub oxygen_ventilator: bool,
    pub bronchodilator: bool,
    pub chest_needle_left_size: String,
    pub chest_needle_left_depth: String,
    pub chest_needle_right_size: String,
    pub chest_needle_right_depth: String,
    pub notes: String,
}

// ──────────────────────────────────────────────
// Step 6 — Circulation (C)
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
    pub capillary_refill_seconds: Option<f64>,
    pub pulses_weak: bool,
    pub pulses_asymmetric: bool,
    /// "" | "yes" | "no"
    pub jvd: String,
    pub access_iv_location: String,
    pub access_iv_size: String,
    pub access_cvl_location: String,
    pub access_cvl_size: String,
    pub access_io_location: String,
    pub access_io_size: String,
    pub ivf_mls: Option<f64>,
    pub ivf_ns: bool,
    pub ivf_lr: bool,
    pub ivf_other: String,
    pub blood_ordered: bool,
    pub epinephrine_given: bool,
    pub notes: String,
}

// ──────────────────────────────────────────────
// Step 7 — Disability (D)
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Disability {
    pub normal: bool,
    /// "" | "A" | "V" | "P" | "U"
    pub avpu: String,
    pub moves_all_extremities: bool,
    pub deficit: bool,
    pub deficit_description: String,
    pub pupil_size_left: Option<f64>,
    pub pupil_size_right: Option<f64>,
    pub pupil_reactivity_left: String,
    pub pupil_reactivity_right: String,
    pub blood_glucose_mmol: Option<f64>,
    pub intervention_glucose: bool,
    pub intervention_antiepileptic: bool,
    pub intervention_naloxone: bool,
    pub intervention_others: String,
    pub notes: String,
}

// ──────────────────────────────────────────────
// Step 8 — History of Present Illness
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HistoryOfPresentIllness {
    pub narrative: String,
}

// ──────────────────────────────────────────────
// Step 9 — Review of Systems
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RosEntry {
    pub normal: bool,
    pub notes: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReviewOfSystems {
    pub general: RosEntry,
    pub heent: RosEntry,
    pub respiratory: RosEntry,
    pub cardiovascular: RosEntry,
    pub gastrointestinal: RosEntry,
    pub pelvis_gu_rectal: RosEntry,
    pub female_reproductive: RosEntry,
    pub male_reproductive: RosEntry,
    pub skin: RosEntry,
    pub musculoskeletal: RosEntry,
    pub hematologic: RosEntry,
    pub neurological: RosEntry,
    pub psychiatric: RosEntry,
    pub pediatric_specific: RosEntry,
}

// ──────────────────────────────────────────────
// Step 10 — Past Medical History
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PastMedicalHistory {
    pub history_obtained_from: String,
    pub medications: String,
    pub medications_unknown: bool,
    pub allergies: String,
    pub allergies_unknown: bool,
    pub last_menstrual_cycle: String,
    pub gravida: Option<f64>,
    pub para: Option<f64>,
    pub lmp_unknown: bool,
    /// "" | "yes" | "no"
    pub pregnant: String,
    pub pregnancy_reported: bool,
    pub pregnancy_testing_done: bool,
    /// "" | "unknown" | "no" | "yes"
    pub vaccinations_status: String,
    pub vaccinations_date: String,
    pub tobacco_use: bool,
    pub alcohol_use: bool,
    pub drug_use: bool,
    pub iv_drug_use: bool,
    pub substance_use_unknown: bool,
    pub pmh_htn: bool,
    pub pmh_dm: bool,
    pub pmh_copd: bool,
    pub pmh_psych: bool,
    pub pmh_renal_disease: bool,
    pub pmh_unknown: bool,
    pub pmh_other: String,
    pub family_history: String,
    pub family_history_unknown: bool,
    pub past_surgeries: String,
    pub past_surgeries_unknown: bool,
    pub safe_at_home: String,
}

// ──────────────────────────────────────────────
// Step 11 — Physical Exam
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
    pub neuro_psych: PeEntry,
    pub heent: PeEntry,
    pub neck: PeEntry,
    pub respiratory: PeEntry,
    pub cardiac: PeEntry,
    pub abdominal: PeEntry,
    pub pelvis_gu_rectal: PeEntry,
    pub lymph: PeEntry,
    pub musculoskeletal: PeEntry,
    pub skin: PeEntry,
}

// ──────────────────────────────────────────────
// Step 12 — Diagnostics
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Cbc {
    pub wbc: Option<f64>,
    pub hgb: Option<f64>,
    pub plt: Option<f64>,
    pub hct: Option<f64>,
    pub pending: bool,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Lytes {
    pub na: Option<f64>,
    pub cl: Option<f64>,
    pub bun: Option<f64>,
    pub k: Option<f64>,
    pub hco3: Option<f64>,
    pub cr: Option<f64>,
    pub glucose: Option<f64>,
    pub pending: bool,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UrineDip {
    pub glucose: bool,
    pub nitrites: bool,
    pub ketones: bool,
    pub leukocytes: bool,
    pub blood: bool,
    pub protein: bool,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Ecg {
    pub rate: Option<f64>,
    /// "" | "yes" | "no"
    pub sinus_rhythm: String,
    /// "" | "yes" | "no"
    pub ischemia: String,
    pub interpretation: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Diagnostics {
    pub cbc: Cbc,
    pub lytes: Lytes,
    /// "" | "pos" | "neg" | "pending"
    pub upt: String,
    /// "" | "pos" | "neg" | "pending"
    pub malaria: String,
    /// "" | "pos" | "neg" | "pending"
    pub hiv_rapid: String,
    pub blood_type: String,
    pub urine_dip: UrineDip,
    pub other_labs_imaging: String,
    pub ecg: Ecg,
}

// ──────────────────────────────────────────────
// Step 13 — Additional Interventions
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicationGiven {
    pub time: String,
    pub ivf_mls: Option<f64>,
    pub ivf_type: String,
    pub blood_products_units: String,
    pub opioid_analgesia: String,
    pub other_analgesia: String,
    pub sedation_paralytics: String,
    pub antimicrobials: String,
    pub tetanus: String,
    pub other: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProcedureEntry {
    pub intubation_time: String,
    pub intubation_outcome: String,
    pub chest_tube_time: String,
    pub chest_tube_outcome: String,
    pub lumbar_puncture_time: String,
    pub lumbar_puncture_outcome: String,
    pub laceration_repair_time: String,
    pub laceration_repair_outcome: String,
    pub other: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalInterventions {
    pub medications: MedicationGiven,
    pub procedures: ProcedureEntry,
}

// ──────────────────────────────────────────────
// Step 14 — Assessment & Plan
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentAndPlan {
    pub narrative: String,
}

// ──────────────────────────────────────────────
// Step 15 — Reassessment
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Reassessment {
    pub time: String,
    pub temp_c: Option<f64>,
    pub pulse: Option<f64>,
    pub bp_systolic: Option<f64>,
    pub bp_diastolic: Option<f64>,
    pub respiratory_rate: Option<f64>,
    pub spo2: Option<f64>,
    pub spo2_on_oxygen: String,
    pub condition_same: bool,
    pub condition_changes: String,
}

// ──────────────────────────────────────────────
// Step 16 — Disposition
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FinalVitals {
    pub temp_c: Option<f64>,
    pub pulse: Option<f64>,
    pub bp_systolic: Option<f64>,
    pub bp_diastolic: Option<f64>,
    pub respiratory_rate: Option<f64>,
    pub spo2: Option<f64>,
    pub spo2_on_oxygen: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DispositionData {
    /// "" | "yes" | "no"
    pub checklist_completed: String,
    pub ed_departure_date: String,
    pub ed_departure_time: String,
    pub diagnoses_impressions: String,
    /// "" | "admit" | "transfer" | "discharge" | "died"
    pub disposition: String,
    /// "" | "ward" | "icu" | "ot"
    pub admit_ward: String,
    /// "" | "yes" | "no"
    pub discharge_plan_discussed: String,
    pub transfer_to: String,
    pub left_without_being_seen: bool,
    pub died_cause: String,
    pub final_vitals: FinalVitals,
    pub accepting_provider: String,
    pub emergency_unit_provider: String,
    pub signature: String,
    pub signature_date: String,
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub patient_registration: PatientRegistration,
    pub chief_complaint_and_vitals: ChiefComplaintAndVitals,
    pub high_risk_signs: HighRiskSigns,
    pub airway: Airway,
    pub breathing: Breathing,
    pub circulation: Circulation,
    pub disability: Disability,
    pub history_of_present_illness: HistoryOfPresentIllness,
    pub review_of_systems: ReviewOfSystems,
    pub past_medical_history: PastMedicalHistory,
    pub physical_exam: PhysicalExam,
    pub diagnostics: Diagnostics,
    pub additional_interventions: AdditionalInterventions,
    pub assessment_and_plan: AssessmentAndPlan,
    pub reassessment: Reassessment,
    pub disposition: DispositionData,
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

/// Overall encounter status string.
/// "not-started" | "in-progress" | "complete" | "complete-with-concerns" | "abandoned"
pub type EncounterStatus = String;

/// Grading output for an encounter.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub encounter_status: EncounterStatus,
    pub complete: bool,
    pub total_required: u32,
    pub total_satisfied: u32,
    pub overall_percent: u32,
    pub sections: Vec<SectionCompleteness>,
    pub fired_rules: Vec<FiredRule>,
    pub flagged_issues: Vec<FlaggedIssue>,
    pub timestamp: String,
}
