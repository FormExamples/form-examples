//! Core types for the WHO Prehospital Form (SCF Prehospital) data-collection engine.
//!
//! `serde(rename_all = "camelCase")` is applied to all structs that may be
//! shared with the front-end (the canonical wire format is camelCase).

use serde::{Deserialize, Serialize};

/// Priority for a clinician-facing flag.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum FlagPriority {
    /// Urgent.
    Urgent,
    /// High.
    High,
    /// Medium.
    Medium,
    /// Low.
    Low,
}

impl FlagPriority {
    /// Label.
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

/// Caller and scene.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CallerAndScene {
    /// Mass casualty.
    pub mass_casualty: bool,
    /// Caller name.
    pub caller_name: String,
    /// Caller phone.
    pub caller_phone: String,
    /// Patient name.
    pub patient_name: String,
    /// Date of birth or age.
    pub date_of_birth_or_age: String,
    /// "" | "male" | "female"
    pub sex: String,
    /// Patient address.
    pub patient_address: String,
    /// Occupation.
    pub occupation: String,
    /// Date.
    pub date: String,
    /// "" | "scene" | "inter-facility-transfer"
    pub scene_call_type: String,
    /// Run number.
    pub run_number: String,
    /// "" | "residence" | "school" | "public-building" | "health-facility" | "street" | "other"
    pub scene_location_type: String,
    /// Scene location other.
    pub scene_location_other: String,
    /// Time call received.
    pub time_call_received: String,
    /// Time en route to scene.
    pub time_en_route_to_scene: String,
    /// Time arrived at scene.
    pub time_arrived_at_scene: String,
    /// Time transporting.
    pub time_transporting: String,
    /// Time at facility.
    pub time_at_facility: String,
    /// Time in service.
    pub time_in_service: String,
}

// ──────────────────────────────────────────────
// Step 2 — Chief Complaint & Initial Vitals
// ──────────────────────────────────────────────

/// Initial vitals.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InitialVitals {
    /// Time.
    pub time: String,
    /// HR.
    pub hr: Option<f64>,
    /// RR.
    pub rr: Option<f64>,
    /// BP.
    pub bp: String,
    /// Temp c.
    pub temp_c: Option<f64>,
    /// Rbs.
    pub rbs: Option<f64>,
    /// SpO2.
    pub spo2: Option<f64>,
    /// SpO2 on oxygen.
    pub spo2_on_oxygen: String,
}

/// Chief complaint and vitals.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ChiefComplaintAndVitals {
    /// Chief complaint.
    pub chief_complaint: String,
    /// Injury.
    pub injury: bool,
    /// Initial vitals.
    pub initial_vitals: InitialVitals,
    /// Care in progress on arrival.
    pub care_in_progress_on_arrival: String,
    /// "" | "yes" | "no" | "unknown"
    pub pregnant: String,
    /// Pain score.
    pub pain_score: Option<f64>,
}

// ──────────────────────────────────────────────
// Step 3 — High Risk Signs
// ──────────────────────────────────────────────

/// High risk signs.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HighRiskSigns {
    // A/B
    /// Stridor.
    pub stridor: bool,
    /// Cyanosis.
    pub cyanosis: bool,
    /// Respiratory distress.
    pub respiratory_distress: bool,
    // C
    /// Poor perfusion.
    pub poor_perfusion: bool,
    /// Weak fast pulse.
    pub weak_fast_pulse: bool,
    /// Capillary refill over3s.
    pub capillary_refill_over3s: bool,
    /// Heavy bleeding.
    pub heavy_bleeding: bool,
    /// Child lethargy.
    pub child_lethargy: bool,
    /// Child sunken eyes.
    pub child_sunken_eyes: bool,
    /// Child slow skin pinch.
    pub child_slow_skin_pinch: bool,
    /// Child poor drinking.
    pub child_poor_drinking: bool,
    /// Adult HR under50 or over150.
    pub adult_hr_under50_or_over150: bool,
    // D
    /// Unresponsive.
    pub unresponsive: bool,
    /// Acute convulsions.
    pub acute_convulsions: bool,
    /// Hypoglycaemia.
    pub hypoglycaemia: bool,
    /// Acute focal neurologic deficit.
    pub acute_focal_neurologic_deficit: bool,
    /// Altered mental status with fever hypothermia stiff neck headache.
    pub altered_mental_status_with_fever_hypothermia_stiff_neck_headache: bool,
    // Other
    /// High risk trauma.
    pub high_risk_trauma: bool,
    /// Threatened limb.
    pub threatened_limb: bool,
    /// Snake bite.
    pub snake_bite: bool,
    /// Poisoning ingestion chemical exposure.
    pub poisoning_ingestion_chemical_exposure: bool,
    /// Violent or aggressive.
    pub violent_or_aggressive: bool,
    /// Temp over39 or under36.
    pub temp_over39_or_under36: bool,
    /// Acute testicular pain or priapism.
    pub acute_testicular_pain_or_priapism: bool,
    /// Pregnant with high risk findings.
    pub pregnant_with_high_risk_findings: bool,
    /// Adult severe chest or abdominal pain or ECG ischaemia.
    pub adult_severe_chest_or_abdominal_pain_or_ecg_ischaemia: bool,
    /// Infant under8 days.
    pub infant_under8_days: bool,
    /// Infant under2 months with temp over39 or under36.
    pub infant_under2_months_with_temp_over39_or_under36: bool,
}

// ──────────────────────────────────────────────
// Step 4 — Triage
// ──────────────────────────────────────────────

/// Triage.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Triage {
    /// "" | "red" | "yellow" | "green"
    pub category: String,
    /// Triaged for.
    pub triaged_for: String,
}

// ──────────────────────────────────────────────
// Step 5 — Airway (A)
// ──────────────────────────────────────────────

/// Airway.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Airway {
    /// Normal.
    pub normal: bool,
    /// Voice changes.
    pub voice_changes: bool,
    /// Stridor.
    pub stridor: bool,
    /// Oral airway burns.
    pub oral_airway_burns: bool,
    /// Angioedema.
    pub angioedema: bool,
    /// Obstructed by tongue.
    pub obstructed_by_tongue: bool,
    /// Obstructed by blood.
    pub obstructed_by_blood: bool,
    /// Obstructed by secretions.
    pub obstructed_by_secretions: bool,
    /// Obstructed by vomit.
    pub obstructed_by_vomit: bool,
    /// Obstructed by foreign body.
    pub obstructed_by_foreign_body: bool,
    /// Intervention repositioning.
    pub intervention_repositioning: bool,
    /// Intervention suction.
    pub intervention_suction: bool,
    /// Intervention opa.
    pub intervention_opa: bool,
    /// Intervention npa.
    pub intervention_npa: bool,
    /// Intervention lma.
    pub intervention_lma: bool,
    /// Intervention bvm.
    pub intervention_bvm: bool,
    /// Intervention ett.
    pub intervention_ett: bool,
    /// C spine not needed.
    pub c_spine_not_needed: bool,
    /// C spine done.
    pub c_spine_done: bool,
    /// Notes.
    pub notes: String,
}

// ──────────────────────────────────────────────
// Step 6 — Breathing (B)
// ──────────────────────────────────────────────

/// Breathing.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Breathing {
    /// Normal.
    pub normal: bool,
    /// "" | "yes" | "no"
    pub spontaneous_respiration: String,
    /// Chest rise shallow.
    pub chest_rise_shallow: bool,
    /// Chest rise retractions.
    pub chest_rise_retractions: bool,
    /// Chest rise paradoxical.
    pub chest_rise_paradoxical: bool,
    /// Trachea midline.
    pub trachea_midline: bool,
    /// Trachea deviated left.
    pub trachea_deviated_left: bool,
    /// Trachea deviated right.
    pub trachea_deviated_right: bool,
    /// Breath sounds normal.
    pub breath_sounds_normal: bool,
    /// Breath sounds notes.
    pub breath_sounds_notes: String,
    /// Oxygen litres.
    pub oxygen_litres: Option<f64>,
    /// Oxygen nasal cannula.
    pub oxygen_nasal_cannula: bool,
    /// Oxygen face mask.
    pub oxygen_face_mask: bool,
    /// Oxygen non rebreather.
    pub oxygen_non_rebreather: bool,
    /// Oxygen bvm.
    pub oxygen_bvm: bool,
    /// Oxygen bipap cpap.
    pub oxygen_bipap_cpap: bool,
    /// Oxygen other.
    pub oxygen_other: String,
    /// Notes.
    pub notes: String,
}

// ──────────────────────────────────────────────
// Step 7 — Circulation (C)
// ──────────────────────────────────────────────

/// Circulation.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Circulation {
    /// Normal.
    pub normal: bool,
    /// Skin warm.
    pub skin_warm: bool,
    /// Skin dry.
    pub skin_dry: bool,
    /// Skin pale.
    pub skin_pale: bool,
    /// Skin cyanotic.
    pub skin_cyanotic: bool,
    /// Skin moist.
    pub skin_moist: bool,
    /// Skin cool.
    pub skin_cool: bool,
    /// Capillary refill under3.
    pub capillary_refill_under3: bool,
    /// Capillary refill3 or more.
    pub capillary_refill3_or_more: bool,
    /// Pulses weak.
    pub pulses_weak: bool,
    /// Pulses asymmetric.
    pub pulses_asymmetric: bool,
    /// "" | "yes" | "no"
    pub jvd: String,
    /// Active bleeding site.
    pub active_bleeding_site: String,
    /// Bleeding controlled bandage.
    pub bleeding_controlled_bandage: bool,
    /// Bleeding controlled tourniquet.
    pub bleeding_controlled_tourniquet: bool,
    /// Bleeding controlled direct pressure.
    pub bleeding_controlled_direct_pressure: bool,
    /// Bleeding control time.
    pub bleeding_control_time: String,
    /// Access IV site.
    pub access_iv_site: String,
    /// Access IV size.
    pub access_iv_size: String,
    /// Access io site.
    pub access_io_site: String,
    /// Access io size.
    pub access_io_size: String,
    /// Ivf mls.
    pub ivf_mls: Option<f64>,
    /// Ivf ns.
    pub ivf_ns: bool,
    /// Ivf lr.
    pub ivf_lr: bool,
    /// Ivf other.
    pub ivf_other: String,
    /// Pelvis stabilized.
    pub pelvis_stabilized: bool,
    /// Femur fracture stabilized.
    pub femur_fracture_stabilized: bool,
    /// Notes.
    pub notes: String,
}

// ──────────────────────────────────────────────
// Step 8 — Disability (D)
// ──────────────────────────────────────────────

/// Disability.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Disability {
    /// Normal.
    pub normal: bool,
    /// Blood glucose.
    pub blood_glucose: Option<f64>,
    /// "" | "A" | "V" | "P" | "U"
    pub avpu: String,
    /// GCS eye.
    pub gcs_eye: Option<f64>,
    /// GCS verbal.
    pub gcs_verbal: Option<f64>,
    /// GCS motor.
    pub gcs_motor: Option<f64>,
    /// Moves left arm.
    pub moves_left_arm: bool,
    /// Moves right arm.
    pub moves_right_arm: bool,
    /// Moves left leg.
    pub moves_left_leg: bool,
    /// Moves right leg.
    pub moves_right_leg: bool,
    /// Pupil size left.
    pub pupil_size_left: Option<f64>,
    /// Pupil size right.
    pub pupil_size_right: Option<f64>,
    /// Pupil reactivity left.
    pub pupil_reactivity_left: String,
    /// Pupil reactivity right.
    pub pupil_reactivity_right: String,
    /// Intervention glucose checked.
    pub intervention_glucose_checked: bool,
    /// Intervention glucose given.
    pub intervention_glucose_given: bool,
    /// Intervention naloxone given.
    pub intervention_naloxone_given: bool,
    /// Notes.
    pub notes: String,
}

// ──────────────────────────────────────────────
// Step 9 — Exposure (E)
// ──────────────────────────────────────────────

/// Exposure.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Exposure {
    /// Normal.
    pub normal: bool,
    /// Exposed completely.
    pub exposed_completely: bool,
    /// Notes.
    pub notes: String,
}

// ──────────────────────────────────────────────
// Step 10 — SAMPLE History
// ──────────────────────────────────────────────

/// Sample history.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SampleHistory {
    /// Signs symptoms.
    pub signs_symptoms: String,
    /// Signs symptoms unknown.
    pub signs_symptoms_unknown: bool,
    /// Allergies.
    pub allergies: String,
    /// Allergies unknown.
    pub allergies_unknown: bool,
    /// Medications.
    pub medications: String,
    /// Medications unknown.
    pub medications_unknown: bool,
    /// Past medical.
    pub past_medical: String,
    /// Past medical unknown.
    pub past_medical_unknown: bool,
    /// Past surgeries.
    pub past_surgeries: String,
    /// Past surgeries unknown.
    pub past_surgeries_unknown: bool,
    /// Last ate hours.
    pub last_ate_hours: Option<f64>,
    /// Last ate unknown.
    pub last_ate_unknown: bool,
    /// Events.
    pub events: String,
    /// Events unknown.
    pub events_unknown: bool,
}

// ──────────────────────────────────────────────
// Step 11 — Injury Details
// ──────────────────────────────────────────────

/// Injury details.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InjuryDetails {
    /// "" | "intentional" | "unintentional" | "self-inflicted"
    pub intent: String,
    /// Mechanism fall.
    pub mechanism_fall: bool,
    /// Mechanism hit by falling object.
    pub mechanism_hit_by_falling_object: bool,
    /// Mechanism stab cut.
    pub mechanism_stab_cut: bool,
    /// Mechanism gunshot.
    pub mechanism_gunshot: bool,
    /// Mechanism sexual assault.
    pub mechanism_sexual_assault: bool,
    /// Mechanism other blunt force.
    pub mechanism_other_blunt_force: bool,
    /// Mechanism suffocation choking hanging.
    pub mechanism_suffocation_choking_hanging: bool,
    /// Mechanism drowning.
    pub mechanism_drowning: bool,
    /// "" | "yes" | "no"
    pub mechanism_drowning_life_vest: String,
    /// Mechanism burn caused by.
    pub mechanism_burn_caused_by: String,
    /// Mechanism poisoning toxic exposure.
    pub mechanism_poisoning_toxic_exposure: bool,
    /// Mechanism unknown.
    pub mechanism_unknown: bool,
    /// Mechanism other.
    pub mechanism_other: String,
    /// Road traffic driver.
    pub road_traffic_driver: bool,
    /// Road traffic passenger.
    pub road_traffic_passenger: bool,
    /// Road traffic pedestrian.
    pub road_traffic_pedestrian: bool,
    /// Road traffic ejected.
    pub road_traffic_ejected: bool,
    /// Road traffic extricated.
    pub road_traffic_extricated: bool,
    /// "" | "car" | "bike" | "motorbike" | "other"
    pub vehicle_type: String,
    /// Vehicle other.
    pub vehicle_other: String,
    /// Safety airbag.
    pub safety_airbag: bool,
    /// Safety seatbelt.
    pub safety_seatbelt: bool,
    /// Safety helmet.
    pub safety_helmet: bool,
    /// Safety other restraint.
    pub safety_other_restraint: String,
}

// ──────────────────────────────────────────────
// Step 12 — Physical Exam
// ──────────────────────────────────────────────

/// Pe entry.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PeEntry {
    /// Normal.
    pub normal: bool,
    /// Notes.
    pub notes: String,
}

/// Physical exam.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PhysicalExam {
    /// General.
    pub general: PeEntry,
    /// Heent.
    pub heent: PeEntry,
    /// Respiratory.
    pub respiratory: PeEntry,
    /// Cardiac.
    pub cardiac: PeEntry,
    /// Abdominal.
    pub abdominal: PeEntry,
    /// Pelvis gu.
    pub pelvis_gu: PeEntry,
    /// Neurologic.
    pub neurologic: PeEntry,
    /// Psychiatric.
    pub psychiatric: PeEntry,
    /// Musculoskeletal.
    pub musculoskeletal: PeEntry,
    /// Skin.
    pub skin: PeEntry,
}

// ──────────────────────────────────────────────
// Step 13 — Additional Interventions
// ──────────────────────────────────────────────

/// Additional interventions.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalInterventions {
    /// Meds bronchodilators.
    pub meds_bronchodilators: bool,
    /// Meds epinephrine.
    pub meds_epinephrine: bool,
    /// Meds aspirin.
    pub meds_aspirin: bool,
    /// Meds seizure medication.
    pub meds_seizure_medication: bool,
    /// Meds analgesia.
    pub meds_analgesia: bool,
    /// Meds IV fluid infusion.
    pub meds_iv_fluid_infusion: bool,
    /// Meds other.
    pub meds_other: String,
    /// Proc wound bandaging.
    pub proc_wound_bandaging: bool,
    /// Proc burn dressing.
    pub proc_burn_dressing: bool,
    /// Proc splinting reduction.
    pub proc_splinting_reduction: bool,
    /// Proc pelvic stabilization.
    pub proc_pelvic_stabilization: bool,
    /// Proc ECG.
    pub proc_ecg: bool,
    /// Proc other.
    pub proc_other: String,
}

// ──────────────────────────────────────────────
// Step 14 — Assessment & Plan
// ──────────────────────────────────────────────

/// Assessment and plan.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentAndPlan {
    /// Summary.
    pub summary: String,
    /// Differential.
    pub differential: String,
    /// Presumptive diagnoses.
    pub presumptive_diagnoses: String,
}

// ──────────────────────────────────────────────
// Step 15 — Reassessment (up to 3 sets)
// ──────────────────────────────────────────────

/// Reassessment.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Reassessment {
    /// Time.
    pub time: String,
    /// HR.
    pub hr: Option<f64>,
    /// RR.
    pub rr: Option<f64>,
    /// Temp c.
    pub temp_c: Option<f64>,
    /// SpO2.
    pub spo2: Option<f64>,
    /// SpO2 on oxygen.
    pub spo2_on_oxygen: String,
    /// Rbs.
    pub rbs: Option<f64>,
    /// Pain.
    pub pain: Option<f64>,
    /// Unchanged.
    pub unchanged: bool,
}

// ──────────────────────────────────────────────
// Step 16 — Disposition
// ──────────────────────────────────────────────

/// Final vitals.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FinalVitals {
    /// Time.
    pub time: String,
    /// HR.
    pub hr: Option<f64>,
    /// RR.
    pub rr: Option<f64>,
    /// Temp c.
    pub temp_c: Option<f64>,
    /// BP.
    pub bp: String,
    /// SpO2.
    pub spo2: Option<f64>,
    /// SpO2 on oxygen.
    pub spo2_on_oxygen: String,
}

/// Disposition.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Disposition {
    /// Disposition.
    pub disposition: String,
    /// Handover time.
    pub handover_time: String,
    /// Handover to name.
    pub handover_to_name: String,
    /// Handover to cadre.
    pub handover_to_cadre: String,
    /// Handover to signature.
    pub handover_to_signature: String,
    /// Final vitals.
    pub final_vitals: FinalVitals,
    /// "" | "yes" | "no"
    pub plan_discussed_with_patient: String,
    /// Provider name.
    pub provider_name: String,
    /// Provider signature.
    pub provider_signature: String,
    /// Provider signature date.
    pub provider_signature_date: String,
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

/// Assessment data.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Caller and scene.
    pub caller_and_scene: CallerAndScene,
    /// Chief complaint and vitals.
    pub chief_complaint_and_vitals: ChiefComplaintAndVitals,
    /// High risk signs.
    pub high_risk_signs: HighRiskSigns,
    /// Triage.
    pub triage: Triage,
    /// Airway.
    pub airway: Airway,
    /// Breathing.
    pub breathing: Breathing,
    /// Circulation.
    pub circulation: Circulation,
    /// Disability.
    pub disability: Disability,
    /// Exposure.
    pub exposure: Exposure,
    /// Sample history.
    pub sample_history: SampleHistory,
    /// Injury details.
    pub injury_details: InjuryDetails,
    /// Physical exam.
    pub physical_exam: PhysicalExam,
    /// Additional interventions.
    pub additional_interventions: AdditionalInterventions,
    /// Assessment and plan.
    pub assessment_and_plan: AssessmentAndPlan,
    /// Reassessments.
    pub reassessments: Vec<Reassessment>,
    /// Disposition.
    pub disposition: Disposition,
}

// ──────────────────────────────────────────────
// Validation engine types
// ──────────────────────────────────────────────

/// A fired rule: a required field that has not been satisfied.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Section.
    pub section: String,
    /// Description.
    pub description: String,
}

/// Per-section completeness summary.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SectionCompleteness {
    /// Section.
    pub section: String,
    /// Section label.
    pub section_label: String,
    /// Required.
    pub required: u32,
    /// Satisfied.
    pub satisfied: u32,
    /// Missing.
    pub missing: Vec<FiredRule>,
}

/// Validation result.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ValidationResult {
    /// Complete.
    pub complete: bool,
    /// Total required.
    pub total_required: u32,
    /// Total satisfied.
    pub total_satisfied: u32,
    /// Sections.
    pub sections: Vec<SectionCompleteness>,
    /// Missing.
    pub missing: Vec<FiredRule>,
}

/// Flagged issue.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FlaggedIssue {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Message.
    pub message: String,
    /// Priority.
    pub priority: FlagPriority,
}
