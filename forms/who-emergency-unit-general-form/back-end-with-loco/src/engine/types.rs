//! Core types for the WHO Emergency Unit (General) Form data-collection engine.
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
// Step 1 — Patient Registration
// ──────────────────────────────────────────────

/// Patient registration.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PatientRegistration {
    /// Hospital registration number.
    pub hospital_registration_number: String,
    /// Surname.
    pub surname: String,
    /// First name.
    pub first_name: String,
    /// "" | "male" | "female" | "other"
    pub sex: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Age.
    pub age: Option<f64>,
    /// "" | "infant" | "child" | "adult"
    pub age_category: String,
    /// Weight kg.
    pub weight_kg: Option<f64>,
    /// Date of arrival.
    pub date_of_arrival: String,
    /// Time of arrival.
    pub time_of_arrival: String,
    /// "" | "ambulance" | "car-private" | "car-taxi" | "motor-2-3-private"
    /// | "motor-2-3-taxi" | "public-transport" | "walk" | "other"
    pub arrival_mode: String,
    /// "" | "basic" | "advanced"
    pub ambulance_level: String,
    /// Emergency system activation date.
    pub emergency_system_activation_date: String,
    /// Emergency system activation time.
    pub emergency_system_activation_time: String,
    /// Emergency system dispatch date.
    pub emergency_system_dispatch_date: String,
    /// Emergency system dispatch time.
    pub emergency_system_dispatch_time: String,
    /// Emergency personnel arrival date.
    pub emergency_personnel_arrival_date: String,
    /// Emergency personnel arrival time.
    pub emergency_personnel_arrival_time: String,
    /// Occupation.
    pub occupation: String,
    /// Patient residence.
    pub patient_residence: String,
    /// Patient residence unknown.
    pub patient_residence_unknown: bool,
    /// Racial and ethnic identity.
    pub racial_and_ethnic_identity: String,
    /// Racial and ethnic identity unknown.
    pub racial_and_ethnic_identity_unknown: bool,
    /// "" | "yes" | "no"
    pub interpreter_required: String,
    /// Contact person.
    pub contact_person: String,
    /// Contact phone.
    pub contact_phone: String,
    /// Contact relation.
    pub contact_relation: String,
    /// Prior facilities count.
    pub prior_facilities_count: Option<f64>,
    /// Referred from.
    pub referred_from: String,
    /// Ambulatory.
    pub ambulatory: bool,
    /// Non ambulatory.
    pub non_ambulatory: bool,
    /// Acute.
    pub acute: bool,
    /// Chronic.
    pub chronic: bool,
    /// "" | "yes" | "no"
    pub daily_activities_limited: String,
}

// ──────────────────────────────────────────────
// Step 2 — Chief Complaint & Vitals
// ──────────────────────────────────────────────

/// Initial vitals.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InitialVitals {
    /// Time.
    pub time: String,
    /// Temp c.
    pub temp_c: Option<f64>,
    /// BP systolic.
    pub bp_systolic: Option<f64>,
    /// BP diastolic.
    pub bp_diastolic: Option<f64>,
    /// Pulse.
    pub pulse: Option<f64>,
    /// Respiratory rate.
    pub respiratory_rate: Option<f64>,
    /// SpO2.
    pub spo2: Option<f64>,
    /// SpO2 on oxygen.
    pub spo2_on_oxygen: String,
    /// Pain score.
    pub pain_score: Option<f64>,
}

/// Chief complaint and vitals.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ChiefComplaintAndVitals {
    /// Chief complaint.
    pub chief_complaint: String,
    /// "" | "red" | "orange" | "yellow" | "green"
    pub triage_category: String,
    /// Initial vitals.
    pub initial_vitals: InitialVitals,
    /// Provider assessment date.
    pub provider_assessment_date: String,
    /// Provider assessment time.
    pub provider_assessment_time: String,
    /// Dead on arrival.
    pub dead_on_arrival: bool,
}

// ──────────────────────────────────────────────
// Step 3 — High Risk Signs
// ──────────────────────────────────────────────

/// High risk signs.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HighRiskSigns {
    /// Abnormal avpu.
    pub abnormal_avpu: bool,
    /// Abnormal heart rate.
    pub abnormal_heart_rate: bool,
    /// Stridor or voice change.
    pub stridor_or_voice_change: bool,
    /// Poor perfusion.
    pub poor_perfusion: bool,
    /// Abnormal temperature.
    pub abnormal_temperature: bool,
    /// Low SpO2.
    pub low_spo2: bool,
    /// Respiratory distress.
    pub respiratory_distress: bool,
    /// Vomits everything or cannot feed.
    pub vomits_everything_or_cannot_feed: bool,
}

// ──────────────────────────────────────────────
// Step 4 — Airway (A)
// ──────────────────────────────────────────────

/// Airway.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Airway {
    /// Normal.
    pub normal: bool,
    /// Angioedema.
    pub angioedema: bool,
    /// Stridor.
    pub stridor: bool,
    /// Voice changes.
    pub voice_changes: bool,
    /// Oral airway burns.
    pub oral_airway_burns: bool,
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
    /// Notes.
    pub notes: String,
}

// ──────────────────────────────────────────────
// Step 5 — Breathing (B)
// ──────────────────────────────────────────────

/// Breathing.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Breathing {
    /// Normal.
    pub normal: bool,
    /// Spontaneous respiratory rate.
    pub spontaneous_respiratory_rate: Option<f64>,
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
    /// Breath sounds left.
    pub breath_sounds_left: String,
    /// Breath sounds right.
    pub breath_sounds_right: String,
    /// Oxygen litres.
    pub oxygen_litres: Option<f64>,
    /// Oxygen nasal cannula.
    pub oxygen_nasal_cannula: bool,
    /// Oxygen mask.
    pub oxygen_mask: bool,
    /// Oxygen non rebreather.
    pub oxygen_non_rebreather: bool,
    /// Oxygen bvm.
    pub oxygen_bvm: bool,
    /// Oxygen cpap bipap.
    pub oxygen_cpap_bipap: bool,
    /// Oxygen ventilator.
    pub oxygen_ventilator: bool,
    /// Bronchodilator.
    pub bronchodilator: bool,
    /// Chest needle left size.
    pub chest_needle_left_size: String,
    /// Chest needle left depth.
    pub chest_needle_left_depth: String,
    /// Chest needle right size.
    pub chest_needle_right_size: String,
    /// Chest needle right depth.
    pub chest_needle_right_depth: String,
    /// Notes.
    pub notes: String,
}

// ──────────────────────────────────────────────
// Step 6 — Circulation (C)
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
    /// Capillary refill seconds.
    pub capillary_refill_seconds: Option<f64>,
    /// Pulses weak.
    pub pulses_weak: bool,
    /// Pulses asymmetric.
    pub pulses_asymmetric: bool,
    /// "" | "yes" | "no"
    pub jvd: String,
    /// Access IV location.
    pub access_iv_location: String,
    /// Access IV size.
    pub access_iv_size: String,
    /// Access cvl location.
    pub access_cvl_location: String,
    /// Access cvl size.
    pub access_cvl_size: String,
    /// Access io location.
    pub access_io_location: String,
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
    /// Blood ordered.
    pub blood_ordered: bool,
    /// Epinephrine given.
    pub epinephrine_given: bool,
    /// Notes.
    pub notes: String,
}

// ──────────────────────────────────────────────
// Step 7 — Disability (D)
// ──────────────────────────────────────────────

/// Disability.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Disability {
    /// Normal.
    pub normal: bool,
    /// "" | "A" | "V" | "P" | "U"
    pub avpu: String,
    /// Moves all extremities.
    pub moves_all_extremities: bool,
    /// Deficit.
    pub deficit: bool,
    /// Deficit description.
    pub deficit_description: String,
    /// Pupil size left.
    pub pupil_size_left: Option<f64>,
    /// Pupil size right.
    pub pupil_size_right: Option<f64>,
    /// Pupil reactivity left.
    pub pupil_reactivity_left: String,
    /// Pupil reactivity right.
    pub pupil_reactivity_right: String,
    /// Blood glucose mmol.
    pub blood_glucose_mmol: Option<f64>,
    /// Intervention glucose.
    pub intervention_glucose: bool,
    /// Intervention antiepileptic.
    pub intervention_antiepileptic: bool,
    /// Intervention naloxone.
    pub intervention_naloxone: bool,
    /// Intervention others.
    pub intervention_others: String,
    /// Notes.
    pub notes: String,
}

// ──────────────────────────────────────────────
// Step 8 — History of Present Illness
// ──────────────────────────────────────────────

/// History of present illness.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HistoryOfPresentIllness {
    /// Narrative.
    pub narrative: String,
}

// ──────────────────────────────────────────────
// Step 9 — Review of Systems
// ──────────────────────────────────────────────

/// Ros entry.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RosEntry {
    /// Normal.
    pub normal: bool,
    /// Notes.
    pub notes: String,
}

/// Review of systems.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReviewOfSystems {
    /// General.
    pub general: RosEntry,
    /// Heent.
    pub heent: RosEntry,
    /// Respiratory.
    pub respiratory: RosEntry,
    /// Cardiovascular.
    pub cardiovascular: RosEntry,
    /// Gastrointestinal.
    pub gastrointestinal: RosEntry,
    /// Pelvis gu rectal.
    pub pelvis_gu_rectal: RosEntry,
    /// Female reproductive.
    pub female_reproductive: RosEntry,
    /// Male reproductive.
    pub male_reproductive: RosEntry,
    /// Skin.
    pub skin: RosEntry,
    /// Musculoskeletal.
    pub musculoskeletal: RosEntry,
    /// Hematologic.
    pub hematologic: RosEntry,
    /// Neurological.
    pub neurological: RosEntry,
    /// Psychiatric.
    pub psychiatric: RosEntry,
    /// Pediatric specific.
    pub pediatric_specific: RosEntry,
}

// ──────────────────────────────────────────────
// Step 10 — Past Medical History
// ──────────────────────────────────────────────

/// Past medical history.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PastMedicalHistory {
    /// History obtained from.
    pub history_obtained_from: String,
    /// Medications.
    pub medications: String,
    /// Medications unknown.
    pub medications_unknown: bool,
    /// Allergies.
    pub allergies: String,
    /// Allergies unknown.
    pub allergies_unknown: bool,
    /// Last menstrual cycle.
    pub last_menstrual_cycle: String,
    /// Gravida.
    pub gravida: Option<f64>,
    /// Para.
    pub para: Option<f64>,
    /// Lmp unknown.
    pub lmp_unknown: bool,
    /// "" | "yes" | "no"
    pub pregnant: String,
    /// Pregnancy reported.
    pub pregnancy_reported: bool,
    /// Pregnancy testing done.
    pub pregnancy_testing_done: bool,
    /// "" | "unknown" | "no" | "yes"
    pub vaccinations_status: String,
    /// Vaccinations date.
    pub vaccinations_date: String,
    /// Tobacco use.
    pub tobacco_use: bool,
    /// Alcohol use.
    pub alcohol_use: bool,
    /// Drug use.
    pub drug_use: bool,
    /// IV drug use.
    pub iv_drug_use: bool,
    /// Substance use unknown.
    pub substance_use_unknown: bool,
    /// Pmh htn.
    pub pmh_htn: bool,
    /// Pmh dm.
    pub pmh_dm: bool,
    /// Pmh copd.
    pub pmh_copd: bool,
    /// Pmh psych.
    pub pmh_psych: bool,
    /// Pmh renal disease.
    pub pmh_renal_disease: bool,
    /// Pmh unknown.
    pub pmh_unknown: bool,
    /// Pmh other.
    pub pmh_other: String,
    /// Family history.
    pub family_history: String,
    /// Family history unknown.
    pub family_history_unknown: bool,
    /// Past surgeries.
    pub past_surgeries: String,
    /// Past surgeries unknown.
    pub past_surgeries_unknown: bool,
    /// Safe at home.
    pub safe_at_home: String,
}

// ──────────────────────────────────────────────
// Step 11 — Physical Exam
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
    /// Neuro psych.
    pub neuro_psych: PeEntry,
    /// Heent.
    pub heent: PeEntry,
    /// Neck.
    pub neck: PeEntry,
    /// Respiratory.
    pub respiratory: PeEntry,
    /// Cardiac.
    pub cardiac: PeEntry,
    /// Abdominal.
    pub abdominal: PeEntry,
    /// Pelvis gu rectal.
    pub pelvis_gu_rectal: PeEntry,
    /// Lymph.
    pub lymph: PeEntry,
    /// Musculoskeletal.
    pub musculoskeletal: PeEntry,
    /// Skin.
    pub skin: PeEntry,
}

// ──────────────────────────────────────────────
// Step 12 — Diagnostics
// ──────────────────────────────────────────────

/// Cbc.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Cbc {
    /// Wbc.
    pub wbc: Option<f64>,
    /// Hgb.
    pub hgb: Option<f64>,
    /// Plt.
    pub plt: Option<f64>,
    /// Hct.
    pub hct: Option<f64>,
    /// Pending.
    pub pending: bool,
}

/// Lytes.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Lytes {
    /// Na.
    pub na: Option<f64>,
    /// Cl.
    pub cl: Option<f64>,
    /// Bun.
    pub bun: Option<f64>,
    /// K.
    pub k: Option<f64>,
    /// Hco3.
    pub hco3: Option<f64>,
    /// Cr.
    pub cr: Option<f64>,
    /// Glucose.
    pub glucose: Option<f64>,
    /// Pending.
    pub pending: bool,
}

/// Urine dip.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UrineDip {
    /// Glucose.
    pub glucose: bool,
    /// Nitrites.
    pub nitrites: bool,
    /// Ketones.
    pub ketones: bool,
    /// Leukocytes.
    pub leukocytes: bool,
    /// Blood.
    pub blood: bool,
    /// Protein.
    pub protein: bool,
}

/// ECG.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Ecg {
    /// Rate.
    pub rate: Option<f64>,
    /// "" | "yes" | "no"
    pub sinus_rhythm: String,
    /// "" | "yes" | "no"
    pub ischemia: String,
    /// Interpretation.
    pub interpretation: String,
}

/// Diagnostics.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Diagnostics {
    /// Cbc.
    pub cbc: Cbc,
    /// Lytes.
    pub lytes: Lytes,
    /// "" | "pos" | "neg" | "pending"
    pub upt: String,
    /// "" | "pos" | "neg" | "pending"
    pub malaria: String,
    /// "" | "pos" | "neg" | "pending"
    pub hiv_rapid: String,
    /// Blood type.
    pub blood_type: String,
    /// Urine dip.
    pub urine_dip: UrineDip,
    /// Other labs imaging.
    pub other_labs_imaging: String,
    /// ECG.
    pub ecg: Ecg,
}

// ──────────────────────────────────────────────
// Step 13 — Additional Interventions
// ──────────────────────────────────────────────

/// Medication given.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicationGiven {
    /// Time.
    pub time: String,
    /// Ivf mls.
    pub ivf_mls: Option<f64>,
    /// Ivf type.
    pub ivf_type: String,
    /// Blood products units.
    pub blood_products_units: String,
    /// Opioid analgesia.
    pub opioid_analgesia: String,
    /// Other analgesia.
    pub other_analgesia: String,
    /// Sedation paralytics.
    pub sedation_paralytics: String,
    /// Antimicrobials.
    pub antimicrobials: String,
    /// Tetanus.
    pub tetanus: String,
    /// Other.
    pub other: String,
}

/// Procedure entry.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProcedureEntry {
    /// Intubation time.
    pub intubation_time: String,
    /// Intubation outcome.
    pub intubation_outcome: String,
    /// Chest tube time.
    pub chest_tube_time: String,
    /// Chest tube outcome.
    pub chest_tube_outcome: String,
    /// Lumbar puncture time.
    pub lumbar_puncture_time: String,
    /// Lumbar puncture outcome.
    pub lumbar_puncture_outcome: String,
    /// Laceration repair time.
    pub laceration_repair_time: String,
    /// Laceration repair outcome.
    pub laceration_repair_outcome: String,
    /// Other.
    pub other: String,
}

/// Additional interventions.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalInterventions {
    /// Medications.
    pub medications: MedicationGiven,
    /// Procedures.
    pub procedures: ProcedureEntry,
}

// ──────────────────────────────────────────────
// Step 14 — Assessment & Plan
// ──────────────────────────────────────────────

/// Assessment and plan.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentAndPlan {
    /// Narrative.
    pub narrative: String,
}

// ──────────────────────────────────────────────
// Step 15 — Reassessment
// ──────────────────────────────────────────────

/// Reassessment.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Reassessment {
    /// Time.
    pub time: String,
    /// Temp c.
    pub temp_c: Option<f64>,
    /// Pulse.
    pub pulse: Option<f64>,
    /// BP systolic.
    pub bp_systolic: Option<f64>,
    /// BP diastolic.
    pub bp_diastolic: Option<f64>,
    /// Respiratory rate.
    pub respiratory_rate: Option<f64>,
    /// SpO2.
    pub spo2: Option<f64>,
    /// SpO2 on oxygen.
    pub spo2_on_oxygen: String,
    /// Condition same.
    pub condition_same: bool,
    /// Condition changes.
    pub condition_changes: String,
}

// ──────────────────────────────────────────────
// Step 16 — Disposition
// ──────────────────────────────────────────────

/// Final vitals.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FinalVitals {
    /// Temp c.
    pub temp_c: Option<f64>,
    /// Pulse.
    pub pulse: Option<f64>,
    /// BP systolic.
    pub bp_systolic: Option<f64>,
    /// BP diastolic.
    pub bp_diastolic: Option<f64>,
    /// Respiratory rate.
    pub respiratory_rate: Option<f64>,
    /// SpO2.
    pub spo2: Option<f64>,
    /// SpO2 on oxygen.
    pub spo2_on_oxygen: String,
}

/// Disposition data.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DispositionData {
    /// "" | "yes" | "no"
    pub checklist_completed: String,
    /// Ed departure date.
    pub ed_departure_date: String,
    /// Ed departure time.
    pub ed_departure_time: String,
    /// Diagnoses impressions.
    pub diagnoses_impressions: String,
    /// "" | "admit" | "transfer" | "discharge" | "died"
    pub disposition: String,
    /// "" | "ward" | "icu" | "ot"
    pub admit_ward: String,
    /// "" | "yes" | "no"
    pub discharge_plan_discussed: String,
    /// Transfer to.
    pub transfer_to: String,
    /// Left without being seen.
    pub left_without_being_seen: bool,
    /// Died cause.
    pub died_cause: String,
    /// Final vitals.
    pub final_vitals: FinalVitals,
    /// Accepting provider.
    pub accepting_provider: String,
    /// Emergency unit provider.
    pub emergency_unit_provider: String,
    /// Signature.
    pub signature: String,
    /// Signature date.
    pub signature_date: String,
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

/// Assessment data.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient registration.
    pub patient_registration: PatientRegistration,
    /// Chief complaint and vitals.
    pub chief_complaint_and_vitals: ChiefComplaintAndVitals,
    /// High risk signs.
    pub high_risk_signs: HighRiskSigns,
    /// Airway.
    pub airway: Airway,
    /// Breathing.
    pub breathing: Breathing,
    /// Circulation.
    pub circulation: Circulation,
    /// Disability.
    pub disability: Disability,
    /// History of present illness.
    pub history_of_present_illness: HistoryOfPresentIllness,
    /// Review of systems.
    pub review_of_systems: ReviewOfSystems,
    /// Past medical history.
    pub past_medical_history: PastMedicalHistory,
    /// Physical exam.
    pub physical_exam: PhysicalExam,
    /// Diagnostics.
    pub diagnostics: Diagnostics,
    /// Additional interventions.
    pub additional_interventions: AdditionalInterventions,
    /// Assessment and plan.
    pub assessment_and_plan: AssessmentAndPlan,
    /// Reassessment.
    pub reassessment: Reassessment,
    /// Disposition.
    pub disposition: DispositionData,
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

/// Overall encounter status string.
/// "not-started" | "in-progress" | "complete" | "complete-with-concerns" | "abandoned"
pub type EncounterStatus = String;

/// Grading output for an encounter.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Encounter status.
    pub encounter_status: EncounterStatus,
    /// Complete.
    pub complete: bool,
    /// Total required.
    pub total_required: u32,
    /// Total satisfied.
    pub total_satisfied: u32,
    /// Overall percent.
    pub overall_percent: u32,
    /// Sections.
    pub sections: Vec<SectionCompleteness>,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Flagged issues.
    pub flagged_issues: Vec<FlaggedIssue>,
    /// Timestamp.
    pub timestamp: String,
}
