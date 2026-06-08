//! Core types for the WHO Emergency Unit (Trauma) Form data-collection engine.
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
    /// Date of birth.
    pub date_of_birth: String,
    /// Age.
    pub age: Option<f64>,
    /// "" | "infant" | "child" | "adult"
    pub age_category: String,
    /// "" | "male" | "female" | "other"
    pub sex: String,
    /// Racial and ethnic identity.
    pub racial_and_ethnic_identity: String,
    /// Racial and ethnic identity unknown.
    pub racial_and_ethnic_identity_unknown: bool,
    /// "" | "yes" | "no"
    pub interpreter_required: String,
    /// Occupation.
    pub occupation: String,
    /// Contact person.
    pub contact_person: String,
    /// Contact phone.
    pub contact_phone: String,
    /// Contact relation.
    pub contact_relation: String,
    /// Date of arrival.
    pub date_of_arrival: String,
    /// Time of arrival.
    pub time_of_arrival: String,
    /// "" | "ambulance" | "car-private" | "car-taxi" | "motor-2-3-private"
    /// | "motor-2-3-taxi" | "public-transport" | "walk" | "other"
    pub arrival_mode: String,
    /// Patient residence.
    pub patient_residence: String,
    /// Patient residence unknown.
    pub patient_residence_unknown: bool,
    /// Injury location.
    pub injury_location: String,
    /// Injury location unknown.
    pub injury_location_unknown: bool,
    /// Prior facilities count.
    pub prior_facilities_count: Option<f64>,
    /// Referred from.
    pub referred_from: String,
    /// "" | "yes" | "no"
    pub safe_at_home: String,
    /// Weight kg.
    pub weight_kg: Option<f64>,
    /// "" | "unknown" | "no" | "yes"
    pub vaccinations_status: String,
    /// Vaccinations date.
    pub vaccinations_date: String,
    /// "" | "yes" | "no"
    pub pregnant: String,
    /// Pregnancy reported.
    pub pregnancy_reported: bool,
    /// Pregnancy testing done.
    pub pregnancy_testing_done: bool,
    /// Last menstrual cycle.
    pub last_menstrual_cycle: String,
    /// Gravida.
    pub gravida: Option<f64>,
    /// Para.
    pub para: Option<f64>,
    /// Lmp unknown.
    pub lmp_unknown: bool,
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
    /// Allergies.
    pub allergies: String,
    /// Allergies unknown.
    pub allergies_unknown: bool,
    /// Initial vitals.
    pub initial_vitals: InitialVitals,
    /// Dead on arrival.
    pub dead_on_arrival: bool,
    /// Time of death.
    pub time_of_death: String,
}

// ──────────────────────────────────────────────
// Step 3 — High Risk Signs (Red Signs + Trauma Indicators)
// ──────────────────────────────────────────────

/// High risk signs.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HighRiskSigns {
    // A/B
    /// Red stridor.
    pub red_stridor: bool,
    /// Red cyanosis.
    pub red_cyanosis: bool,
    /// Red respiratory distress.
    pub red_respiratory_distress: bool,
    // C
    /// Red poor perfusion.
    pub red_poor_perfusion: bool,
    /// Red weak fast pulse.
    pub red_weak_fast_pulse: bool,
    /// Red cap refill over3.
    pub red_cap_refill_over3: bool,
    /// Red heavy bleeding.
    pub red_heavy_bleeding: bool,
    /// Red adult HR abnormal.
    pub red_adult_hr_abnormal: bool,
    /// Red child lethargy.
    pub red_child_lethargy: bool,
    /// Red child sunken eyes.
    pub red_child_sunken_eyes: bool,
    /// Red child slow skin pinch.
    pub red_child_slow_skin_pinch: bool,
    /// Red child poor drinking.
    pub red_child_poor_drinking: bool,
    // D
    /// Red unresponsive.
    pub red_unresponsive: bool,
    /// Red acute convulsions.
    pub red_acute_convulsions: bool,
    /// Red hypoglycaemia.
    pub red_hypoglycaemia: bool,
    /// Red acute focal neuro deficit.
    pub red_acute_focal_neuro_deficit: bool,
    /// Red altered mental status with fever etc.
    pub red_altered_mental_status_with_fever_etc: bool,
    // Other
    /// Red threatened limb.
    pub red_threatened_limb: bool,
    /// Red snake bite.
    pub red_snake_bite: bool,
    /// Red poisoning chemical exposure.
    pub red_poisoning_chemical_exposure: bool,
    /// Red violent or aggressive.
    pub red_violent_or_aggressive: bool,
    /// Red acute testicular pain or priapism.
    pub red_acute_testicular_pain_or_priapism: bool,
    /// Red adult severe chest or abdo pain.
    pub red_adult_severe_chest_or_abdo_pain: bool,
    /// Red pregnant with high risk findings.
    pub red_pregnant_with_high_risk_findings: bool,
    /// Red infant under 8 days.
    pub red_infant_under_8_days: bool,
    /// Red infant under 2 months abnormal temp.
    pub red_infant_under_2_months_abnormal_temp: bool,
    // General trauma
    /// Trauma fall twice height.
    pub trauma_fall_twice_height: bool,
    /// Trauma all penetrating.
    pub trauma_all_penetrating: bool,
    /// Trauma penetrating distal uncontrolled bleeding.
    pub trauma_penetrating_distal_uncontrolled_bleeding: bool,
    /// Trauma crush injury.
    pub trauma_crush_injury: bool,
    /// Trauma polytrauma.
    pub trauma_polytrauma: bool,
    /// Trauma bleeding disorder or anticoag.
    pub trauma_bleeding_disorder_or_anticoag: bool,
    /// Trauma pregnant.
    pub trauma_pregnant: bool,
    // Road traffic
    /// Rt high speed crash.
    pub rt_high_speed_crash: bool,
    /// Rt pedestrian or cyclist hit.
    pub rt_pedestrian_or_cyclist_hit: bool,
    /// Rt other in vehicle died.
    pub rt_other_in_vehicle_died: bool,
    /// Rt no seatbelt.
    pub rt_no_seatbelt: bool,
    /// Rt trapped or thrown.
    pub rt_trapped_or_thrown: bool,
    /// Rt dead on arrival.
    pub rt_dead_on_arrival: bool,
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
    /// Provider assessment date.
    pub provider_assessment_date: String,
    /// Provider assessment time.
    pub provider_assessment_time: String,
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
    /// Swelling.
    pub swelling: bool,
    /// Stridor.
    pub stridor: bool,
    /// Voice changes.
    pub voice_changes: bool,
    /// Burns.
    pub burns: bool,
    /// Obstructed by tongue.
    pub obstructed_by_tongue: bool,
    /// Obstructed by blood.
    pub obstructed_by_blood: bool,
    /// Obstructed by secretion.
    pub obstructed_by_secretion: bool,
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
    /// "" | "before-arrival" | "in-eu" | "not-needed"
    pub spine_stabilized: String,
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
    /// Cyanosis.
    pub cyanosis: bool,
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
    /// Chest tube left size.
    pub chest_tube_left_size: String,
    /// Chest tube left depth.
    pub chest_tube_left_depth: String,
    /// Chest tube right size.
    pub chest_tube_right_size: String,
    /// Chest tube right depth.
    pub chest_tube_right_depth: String,
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
    /// Skin cool.
    pub skin_cool: bool,
    /// Skin moist.
    pub skin_moist: bool,
    /// Skin pale.
    pub skin_pale: bool,
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
    /// "" | "yes" | "no"
    pub unstable_pelvis: String,
    /// Bleeding control direct pressure.
    pub bleeding_control_direct_pressure: bool,
    /// Bleeding control bandage.
    pub bleeding_control_bandage: bool,
    /// Bleeding control tourniquet.
    pub bleeding_control_tourniquet: bool,
    /// Access IV location.
    pub access_iv_location: String,
    /// Access IV size.
    pub access_iv_size: String,
    /// Access central location.
    pub access_central_location: String,
    /// Access central size.
    pub access_central_size: String,
    /// Access io location.
    pub access_io_location: String,
    /// Access io size.
    pub access_io_size: String,
    /// Access line2 location.
    pub access_line2_location: String,
    /// Access line2 size.
    pub access_line2_size: String,
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
    /// Blood given.
    pub blood_given: bool,
    /// Blood type amount.
    pub blood_type_amount: String,
    /// "" | "yes" | "not-indicated"
    pub pelvis_stabilized: String,
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
    /// "" | "A" | "V" | "P" | "U"
    pub avpu: String,
    /// GCS total.
    pub gcs_total: Option<f64>,
    /// GCS eye.
    pub gcs_eye: Option<f64>,
    /// GCS verbal.
    pub gcs_verbal: Option<f64>,
    /// GCS motor.
    pub gcs_motor: Option<f64>,
    /// GCS qualified.
    pub gcs_qualified: bool,
    /// Moves rue.
    pub moves_rue: bool,
    /// Moves lue.
    pub moves_lue: bool,
    /// Moves rle.
    pub moves_rle: bool,
    /// Moves lle.
    pub moves_lle: bool,
    /// Pupil size left.
    pub pupil_size_left: Option<f64>,
    /// Pupil size right.
    pub pupil_size_right: Option<f64>,
    /// Pupil reactivity left.
    pub pupil_reactivity_left: String,
    /// Pupil reactivity right.
    pub pupil_reactivity_right: String,
    /// Blood glucose.
    pub blood_glucose: Option<f64>,
    /// Intervention glucose.
    pub intervention_glucose: bool,
    /// Intervention antidote.
    pub intervention_antidote: bool,
    /// Intervention antiepileptic.
    pub intervention_antiepileptic: bool,
    /// Intervention raise head of bed.
    pub intervention_raise_head_of_bed: bool,
    /// Intervention other.
    pub intervention_other: String,
    /// Notes.
    pub notes: String,
}

// ──────────────────────────────────────────────
// Step 9 — Exposure (E) & FAST (F)
// ──────────────────────────────────────────────

/// Exposure and fast.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ExposureAndFast {
    /// Exposed completely.
    pub exposed_completely: bool,
    /// Exposure notes.
    pub exposure_notes: String,
    /// Fast normal.
    pub fast_normal: bool,
    /// Fast not indicated.
    pub fast_not_indicated: bool,
    /// Fast not available.
    pub fast_not_available: bool,
    /// "" | "negative" | "indeterminate" | "free-fluid"
    pub fast_peritoneum: String,
    /// "" | "negative" | "indeterminate" | "pneumothorax" | "pleural-fluid" | "pericardial-effusion"
    pub fast_chest: String,
    /// "" | "left" | "right" | "bilateral"
    pub fast_chest_pneumothorax_side: String,
    /// "" | "left" | "right" | "bilateral"
    pub fast_chest_pleural_fluid_side: String,
    /// Fast notes.
    pub fast_notes: String,
}

// ──────────────────────────────────────────────
// Step 10 — Injury History
// ──────────────────────────────────────────────

/// Injury history.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InjuryHistory {
    /// Place of injury.
    pub place_of_injury: String,
    /// Place of injury unknown.
    pub place_of_injury_unknown: bool,
    /// Activity at time of injury.
    pub activity_at_time_of_injury: String,
    /// Activity at time of injury unknown.
    pub activity_at_time_of_injury_unknown: bool,
    /// Mech road traffic incident.
    pub mech_road_traffic_incident: bool,
    /// "" | "driver" | "passenger" | "pedestrian"
    pub mech_road_role: String,
    /// Mech patient vehicle.
    pub mech_patient_vehicle: String,
    /// Mech impacted with.
    pub mech_impacted_with: String,
    /// Mech airbag.
    pub mech_airbag: bool,
    /// Mech seatbelt.
    pub mech_seatbelt: bool,
    /// Mech helmet.
    pub mech_helmet: bool,
    /// Mech extricated.
    pub mech_extricated: bool,
    /// Mech ejected.
    pub mech_ejected: bool,
    /// Mech fall from.
    pub mech_fall_from: String,
    /// Mech hit by falling object.
    pub mech_hit_by_falling_object: bool,
    /// Mech stab cut.
    pub mech_stab_cut: bool,
    /// Mech gunshot.
    pub mech_gunshot: bool,
    /// Mech sexual assault.
    pub mech_sexual_assault: bool,
    /// Mech other blunt force.
    pub mech_other_blunt_force: bool,
    /// Mech suffocation choking hanging.
    pub mech_suffocation_choking_hanging: bool,
    /// Mech drowning.
    pub mech_drowning: bool,
    /// "" | "yes" | "no"
    pub mech_drowning_life_vest: String,
    /// Mech burn caused by.
    pub mech_burn_caused_by: String,
    /// Mech poisoning toxic exposure.
    pub mech_poisoning_toxic_exposure: bool,
    /// Mech unknown.
    pub mech_unknown: bool,
    /// First care sought.
    pub first_care_sought: String,
    /// "" | "none" | "layperson" | "healthcare-professional"
    pub prehospital_care_provider: String,
    /// Prehospital care given.
    pub prehospital_care_given: String,
    /// Date of injury.
    pub date_of_injury: String,
    /// Time of injury.
    pub time_of_injury: String,
    /// "" | "under-5min" | "5-29min" | "30min-24hr" | "none"
    pub loss_of_consciousness_duration: String,
    /// Head trauma.
    pub head_trauma: bool,
    /// Neck trauma.
    pub neck_trauma: bool,
    /// Other trauma details.
    pub other_trauma_details: String,
    /// "" | "unintentional" | "intentional-self-harm" | "intentional-assault"
    /// | "legal-political-war" | "unknown"
    pub intent: String,
    /// Assaulted by.
    pub assaulted_by: String,
    /// Hours since last meal.
    pub hours_since_last_meal: Option<f64>,
    /// Hours since last meal unknown.
    pub hours_since_last_meal_unknown: bool,
    /// "" | "unknown" | "none" | "reported" | "evidence"
    pub substance_use_status: String,
    /// Substance alcohol.
    pub substance_alcohol: bool,
    /// Substance other.
    pub substance_other: String,
}

// ──────────────────────────────────────────────
// Step 11 — Past Histories
// ──────────────────────────────────────────────

/// Past histories.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PastHistories {
    /// Pmh none.
    pub pmh_none: bool,
    /// Pmh unknown.
    pub pmh_unknown: bool,
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
    /// Pmh other.
    pub pmh_other: String,
    /// Medications none.
    pub medications_none: bool,
    /// Medications unknown.
    pub medications_unknown: bool,
    /// Medications.
    pub medications: String,
    /// Past surgeries none.
    pub past_surgeries_none: bool,
    /// Past surgeries unknown.
    pub past_surgeries_unknown: bool,
    /// Past surgeries.
    pub past_surgeries: String,
    /// Family history none.
    pub family_history_none: bool,
    /// Family history unknown.
    pub family_history_unknown: bool,
    /// Family history.
    pub family_history: String,
}

// ──────────────────────────────────────────────
// Step 12 — Physical Exam (11 systems)
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
    /// Pelvis.
    pub pelvis: PeEntry,
    /// Gu rectal.
    pub gu_rectal: PeEntry,
    /// Musculoskeletal.
    pub musculoskeletal: PeEntry,
    /// Skin.
    pub skin: PeEntry,
    /// Area of injury detail.
    pub area_of_injury_detail: String,
}

// ──────────────────────────────────────────────
// Step 13 — Assessment & Plan
// ──────────────────────────────────────────────

/// Assessment and plan.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentAndPlan {
    /// Narrative.
    pub narrative: String,
}

// ──────────────────────────────────────────────
// Step 14 — Diagnostics (labs + imaging)
// ──────────────────────────────────────────────

/// Lab entry.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LabEntry {
    /// Ordered.
    pub ordered: bool,
    /// Result.
    pub result: String,
}

/// Imaging entry.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ImagingEntry {
    /// Ordered.
    pub ordered: bool,
    /// Result.
    pub result: String,
}

/// Diagnostics.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Diagnostics {
    /// Lab hgb.
    pub lab_hgb: LabEntry,
    /// Lab blood type.
    pub lab_blood_type: LabEntry,
    /// Lab chemistry.
    pub lab_chemistry: LabEntry,
    /// Lab hepatic.
    pub lab_hepatic: LabEntry,
    /// Lab upt.
    pub lab_upt: LabEntry,
    /// Lab other.
    pub lab_other: LabEntry,
    /// Img chest radiograph.
    pub img_chest_radiograph: ImagingEntry,
    /// Img pelvic radiograph.
    pub img_pelvic_radiograph: ImagingEntry,
    /// Img head CT.
    pub img_head_ct: ImagingEntry,
    /// Img cspine.
    pub img_cspine: ImagingEntry,
    /// Img chest abdomen CT.
    pub img_chest_abdomen_ct: ImagingEntry,
    /// Img extremity radiograph.
    pub img_extremity_radiograph: ImagingEntry,
    /// Img other.
    pub img_other: ImagingEntry,
}

// ──────────────────────────────────────────────
// Step 15 — Medications & Procedures
// ──────────────────────────────────────────────

/// Medication entry.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicationEntry {
    /// Medication and dose.
    pub medication_and_dose: String,
    /// Time given.
    pub time_given: String,
    /// Initials.
    pub initials: String,
}

/// Procedure entry.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProcedureEntry {
    /// Procedure.
    pub procedure: String,
    /// Time given.
    pub time_given: String,
    /// Initials.
    pub initials: String,
}

/// Medications and procedures.
#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicationsAndProcedures {
    /// Ivf mls.
    pub ivf_mls: Option<f64>,
    /// Ivf type.
    pub ivf_type: String,
    /// Blood units.
    pub blood_units: String,
    /// Analgesia.
    pub analgesia: String,
    /// Antimicrobials.
    pub antimicrobials: String,
    /// Tetanus.
    pub tetanus: String,
    /// Medications.
    pub medications: Vec<MedicationEntry>,
    /// Proc intubation.
    pub proc_intubation: bool,
    /// Proc thoracostomy.
    pub proc_thoracostomy: bool,
    /// Proc splinting reduction.
    pub proc_splinting_reduction: bool,
    /// Proc laceration repair.
    pub proc_laceration_repair: bool,
    /// Proc other.
    pub proc_other: String,
    /// Procedures.
    pub procedures: Vec<ProcedureEntry>,
}

// ──────────────────────────────────────────────
// Step 16 — Reassessment
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
// Step 17 — Disposition
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
    /// Final vitals.
    pub final_vitals: FinalVitals,
    /// Diagnoses impressions.
    pub diagnoses_impressions: String,
    /// "" | "admit" | "transfer" | "discharge" | "died"
    pub disposition: String,
    /// "" | "ward" | "icu" | "ot"
    pub admit_ward: String,
    /// Transfer to.
    pub transfer_to: String,
    /// "" | "yes" | "no"
    pub discharge_plan_discussed: String,
    /// Left without being seen.
    pub left_without_being_seen: bool,
    /// Died cause.
    pub died_cause: String,
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
    /// Exposure and fast.
    pub exposure_and_fast: ExposureAndFast,
    /// Injury history.
    pub injury_history: InjuryHistory,
    /// Past histories.
    pub past_histories: PastHistories,
    /// Physical exam.
    pub physical_exam: PhysicalExam,
    /// Assessment and plan.
    pub assessment_and_plan: AssessmentAndPlan,
    /// Diagnostics.
    pub diagnostics: Diagnostics,
    /// Medications and procedures.
    pub medications_and_procedures: MedicationsAndProcedures,
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
