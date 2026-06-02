//! Core types for the WHO Emergency Unit (Trauma) Form data-collection engine.
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
    pub date_of_birth: String,
    pub age: Option<f64>,
    /// "" | "infant" | "child" | "adult"
    pub age_category: String,
    /// "" | "male" | "female" | "other"
    pub sex: String,
    pub racial_and_ethnic_identity: String,
    pub racial_and_ethnic_identity_unknown: bool,
    /// "" | "yes" | "no"
    pub interpreter_required: String,
    pub occupation: String,
    pub contact_person: String,
    pub contact_phone: String,
    pub contact_relation: String,
    pub date_of_arrival: String,
    pub time_of_arrival: String,
    /// "" | "ambulance" | "car-private" | "car-taxi" | "motor-2-3-private"
    /// | "motor-2-3-taxi" | "public-transport" | "walk" | "other"
    pub arrival_mode: String,
    pub patient_residence: String,
    pub patient_residence_unknown: bool,
    pub injury_location: String,
    pub injury_location_unknown: bool,
    pub prior_facilities_count: Option<f64>,
    pub referred_from: String,
    /// "" | "yes" | "no"
    pub safe_at_home: String,
    pub weight_kg: Option<f64>,
    /// "" | "unknown" | "no" | "yes"
    pub vaccinations_status: String,
    pub vaccinations_date: String,
    /// "" | "yes" | "no"
    pub pregnant: String,
    pub pregnancy_reported: bool,
    pub pregnancy_testing_done: bool,
    pub last_menstrual_cycle: String,
    pub gravida: Option<f64>,
    pub para: Option<f64>,
    pub lmp_unknown: bool,
    pub tobacco_use: bool,
    pub alcohol_use: bool,
    pub drug_use: bool,
    pub iv_drug_use: bool,
    pub substance_use_unknown: bool,
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
    pub allergies: String,
    pub allergies_unknown: bool,
    pub initial_vitals: InitialVitals,
    pub dead_on_arrival: bool,
    pub time_of_death: String,
}

// ──────────────────────────────────────────────
// Step 3 — High Risk Signs (Red Signs + Trauma Indicators)
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HighRiskSigns {
    // A/B
    pub red_stridor: bool,
    pub red_cyanosis: bool,
    pub red_respiratory_distress: bool,
    // C
    pub red_poor_perfusion: bool,
    pub red_weak_fast_pulse: bool,
    pub red_cap_refill_over3: bool,
    pub red_heavy_bleeding: bool,
    pub red_adult_hr_abnormal: bool,
    pub red_child_lethargy: bool,
    pub red_child_sunken_eyes: bool,
    pub red_child_slow_skin_pinch: bool,
    pub red_child_poor_drinking: bool,
    // D
    pub red_unresponsive: bool,
    pub red_acute_convulsions: bool,
    pub red_hypoglycaemia: bool,
    pub red_acute_focal_neuro_deficit: bool,
    pub red_altered_mental_status_with_fever_etc: bool,
    // Other
    pub red_threatened_limb: bool,
    pub red_snake_bite: bool,
    pub red_poisoning_chemical_exposure: bool,
    pub red_violent_or_aggressive: bool,
    pub red_acute_testicular_pain_or_priapism: bool,
    pub red_adult_severe_chest_or_abdo_pain: bool,
    pub red_pregnant_with_high_risk_findings: bool,
    pub red_infant_under_8_days: bool,
    pub red_infant_under_2_months_abnormal_temp: bool,
    // General trauma
    pub trauma_fall_twice_height: bool,
    pub trauma_all_penetrating: bool,
    pub trauma_penetrating_distal_uncontrolled_bleeding: bool,
    pub trauma_crush_injury: bool,
    pub trauma_polytrauma: bool,
    pub trauma_bleeding_disorder_or_anticoag: bool,
    pub trauma_pregnant: bool,
    // Road traffic
    pub rt_high_speed_crash: bool,
    pub rt_pedestrian_or_cyclist_hit: bool,
    pub rt_other_in_vehicle_died: bool,
    pub rt_no_seatbelt: bool,
    pub rt_trapped_or_thrown: bool,
    pub rt_dead_on_arrival: bool,
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
    pub provider_assessment_date: String,
    pub provider_assessment_time: String,
}

// ──────────────────────────────────────────────
// Step 5 — Airway (A)
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Airway {
    pub normal: bool,
    pub swelling: bool,
    pub stridor: bool,
    pub voice_changes: bool,
    pub burns: bool,
    pub obstructed_by_tongue: bool,
    pub obstructed_by_blood: bool,
    pub obstructed_by_secretion: bool,
    pub obstructed_by_vomit: bool,
    pub obstructed_by_foreign_body: bool,
    pub intervention_repositioning: bool,
    pub intervention_suction: bool,
    pub intervention_opa: bool,
    pub intervention_npa: bool,
    pub intervention_lma: bool,
    pub intervention_bvm: bool,
    pub intervention_ett: bool,
    /// "" | "before-arrival" | "in-eu" | "not-needed"
    pub spine_stabilized: String,
    pub notes: String,
}

// ──────────────────────────────────────────────
// Step 6 — Breathing (B)
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
    pub cyanosis: bool,
    pub oxygen_litres: Option<f64>,
    pub oxygen_nasal_cannula: bool,
    pub oxygen_mask: bool,
    pub oxygen_non_rebreather: bool,
    pub oxygen_bvm: bool,
    pub oxygen_cpap_bipap: bool,
    pub oxygen_ventilator: bool,
    pub chest_tube_left_size: String,
    pub chest_tube_left_depth: String,
    pub chest_tube_right_size: String,
    pub chest_tube_right_depth: String,
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
    pub skin_cool: bool,
    pub skin_moist: bool,
    pub skin_pale: bool,
    pub capillary_refill_under3: bool,
    pub capillary_refill_seconds: Option<f64>,
    pub pulses_weak: bool,
    pub pulses_asymmetric: bool,
    /// "" | "yes" | "no"
    pub jvd: String,
    /// "" | "yes" | "no"
    pub unstable_pelvis: String,
    pub bleeding_control_direct_pressure: bool,
    pub bleeding_control_bandage: bool,
    pub bleeding_control_tourniquet: bool,
    pub access_iv_location: String,
    pub access_iv_size: String,
    pub access_central_location: String,
    pub access_central_size: String,
    pub access_io_location: String,
    pub access_io_size: String,
    pub access_line2_location: String,
    pub access_line2_size: String,
    pub ivf_mls: Option<f64>,
    pub ivf_ns: bool,
    pub ivf_lr: bool,
    pub ivf_other: String,
    pub blood_ordered: bool,
    pub blood_given: bool,
    pub blood_type_amount: String,
    /// "" | "yes" | "not-indicated"
    pub pelvis_stabilized: String,
    pub notes: String,
}

// ──────────────────────────────────────────────
// Step 8 — Disability (D)
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Disability {
    pub normal: bool,
    /// "" | "A" | "V" | "P" | "U"
    pub avpu: String,
    pub gcs_total: Option<f64>,
    pub gcs_eye: Option<f64>,
    pub gcs_verbal: Option<f64>,
    pub gcs_motor: Option<f64>,
    pub gcs_qualified: bool,
    pub moves_rue: bool,
    pub moves_lue: bool,
    pub moves_rle: bool,
    pub moves_lle: bool,
    pub pupil_size_left: Option<f64>,
    pub pupil_size_right: Option<f64>,
    pub pupil_reactivity_left: String,
    pub pupil_reactivity_right: String,
    pub blood_glucose: Option<f64>,
    pub intervention_glucose: bool,
    pub intervention_antidote: bool,
    pub intervention_antiepileptic: bool,
    pub intervention_raise_head_of_bed: bool,
    pub intervention_other: String,
    pub notes: String,
}

// ──────────────────────────────────────────────
// Step 9 — Exposure (E) & FAST (F)
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ExposureAndFast {
    pub exposed_completely: bool,
    pub exposure_notes: String,
    pub fast_normal: bool,
    pub fast_not_indicated: bool,
    pub fast_not_available: bool,
    /// "" | "negative" | "indeterminate" | "free-fluid"
    pub fast_peritoneum: String,
    /// "" | "negative" | "indeterminate" | "pneumothorax" | "pleural-fluid" | "pericardial-effusion"
    pub fast_chest: String,
    /// "" | "left" | "right" | "bilateral"
    pub fast_chest_pneumothorax_side: String,
    /// "" | "left" | "right" | "bilateral"
    pub fast_chest_pleural_fluid_side: String,
    pub fast_notes: String,
}

// ──────────────────────────────────────────────
// Step 10 — Injury History
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InjuryHistory {
    pub place_of_injury: String,
    pub place_of_injury_unknown: bool,
    pub activity_at_time_of_injury: String,
    pub activity_at_time_of_injury_unknown: bool,
    pub mech_road_traffic_incident: bool,
    /// "" | "driver" | "passenger" | "pedestrian"
    pub mech_road_role: String,
    pub mech_patient_vehicle: String,
    pub mech_impacted_with: String,
    pub mech_airbag: bool,
    pub mech_seatbelt: bool,
    pub mech_helmet: bool,
    pub mech_extricated: bool,
    pub mech_ejected: bool,
    pub mech_fall_from: String,
    pub mech_hit_by_falling_object: bool,
    pub mech_stab_cut: bool,
    pub mech_gunshot: bool,
    pub mech_sexual_assault: bool,
    pub mech_other_blunt_force: bool,
    pub mech_suffocation_choking_hanging: bool,
    pub mech_drowning: bool,
    /// "" | "yes" | "no"
    pub mech_drowning_life_vest: String,
    pub mech_burn_caused_by: String,
    pub mech_poisoning_toxic_exposure: bool,
    pub mech_unknown: bool,
    pub first_care_sought: String,
    /// "" | "none" | "layperson" | "healthcare-professional"
    pub prehospital_care_provider: String,
    pub prehospital_care_given: String,
    pub date_of_injury: String,
    pub time_of_injury: String,
    /// "" | "under-5min" | "5-29min" | "30min-24hr" | "none"
    pub loss_of_consciousness_duration: String,
    pub head_trauma: bool,
    pub neck_trauma: bool,
    pub other_trauma_details: String,
    /// "" | "unintentional" | "intentional-self-harm" | "intentional-assault"
    /// | "legal-political-war" | "unknown"
    pub intent: String,
    pub assaulted_by: String,
    pub hours_since_last_meal: Option<f64>,
    pub hours_since_last_meal_unknown: bool,
    /// "" | "unknown" | "none" | "reported" | "evidence"
    pub substance_use_status: String,
    pub substance_alcohol: bool,
    pub substance_other: String,
}

// ──────────────────────────────────────────────
// Step 11 — Past Histories
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PastHistories {
    pub pmh_none: bool,
    pub pmh_unknown: bool,
    pub pmh_htn: bool,
    pub pmh_dm: bool,
    pub pmh_copd: bool,
    pub pmh_psych: bool,
    pub pmh_renal_disease: bool,
    pub pmh_other: String,
    pub medications_none: bool,
    pub medications_unknown: bool,
    pub medications: String,
    pub past_surgeries_none: bool,
    pub past_surgeries_unknown: bool,
    pub past_surgeries: String,
    pub family_history_none: bool,
    pub family_history_unknown: bool,
    pub family_history: String,
}

// ──────────────────────────────────────────────
// Step 12 — Physical Exam (11 systems)
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
    pub pelvis: PeEntry,
    pub gu_rectal: PeEntry,
    pub musculoskeletal: PeEntry,
    pub skin: PeEntry,
    pub area_of_injury_detail: String,
}

// ──────────────────────────────────────────────
// Step 13 — Assessment & Plan
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentAndPlan {
    pub narrative: String,
}

// ──────────────────────────────────────────────
// Step 14 — Diagnostics (labs + imaging)
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LabEntry {
    pub ordered: bool,
    pub result: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ImagingEntry {
    pub ordered: bool,
    pub result: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Diagnostics {
    pub lab_hgb: LabEntry,
    pub lab_blood_type: LabEntry,
    pub lab_chemistry: LabEntry,
    pub lab_hepatic: LabEntry,
    pub lab_upt: LabEntry,
    pub lab_other: LabEntry,
    pub img_chest_radiograph: ImagingEntry,
    pub img_pelvic_radiograph: ImagingEntry,
    pub img_head_ct: ImagingEntry,
    pub img_cspine: ImagingEntry,
    pub img_chest_abdomen_ct: ImagingEntry,
    pub img_extremity_radiograph: ImagingEntry,
    pub img_other: ImagingEntry,
}

// ──────────────────────────────────────────────
// Step 15 — Medications & Procedures
// ──────────────────────────────────────────────

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicationEntry {
    pub medication_and_dose: String,
    pub time_given: String,
    pub initials: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProcedureEntry {
    pub procedure: String,
    pub time_given: String,
    pub initials: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicationsAndProcedures {
    pub ivf_mls: Option<f64>,
    pub ivf_type: String,
    pub blood_units: String,
    pub analgesia: String,
    pub antimicrobials: String,
    pub tetanus: String,
    pub medications: Vec<MedicationEntry>,
    pub proc_intubation: bool,
    pub proc_thoracostomy: bool,
    pub proc_splinting_reduction: bool,
    pub proc_laceration_repair: bool,
    pub proc_other: String,
    pub procedures: Vec<ProcedureEntry>,
}

// ──────────────────────────────────────────────
// Step 16 — Reassessment
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
// Step 17 — Disposition
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
    pub final_vitals: FinalVitals,
    pub diagnoses_impressions: String,
    /// "" | "admit" | "transfer" | "discharge" | "died"
    pub disposition: String,
    /// "" | "ward" | "icu" | "ot"
    pub admit_ward: String,
    pub transfer_to: String,
    /// "" | "yes" | "no"
    pub discharge_plan_discussed: String,
    pub left_without_being_seen: bool,
    pub died_cause: String,
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
    pub triage: Triage,
    pub airway: Airway,
    pub breathing: Breathing,
    pub circulation: Circulation,
    pub disability: Disability,
    pub exposure_and_fast: ExposureAndFast,
    pub injury_history: InjuryHistory,
    pub past_histories: PastHistories,
    pub physical_exam: PhysicalExam,
    pub assessment_and_plan: AssessmentAndPlan,
    pub diagnostics: Diagnostics,
    pub medications_and_procedures: MedicationsAndProcedures,
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
