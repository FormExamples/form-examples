use serde::{Deserialize, Serialize};

// Type aliases mirroring the JS / Svelte engine union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<i32>` / `Option<f64>` with None indicates an unanswered numeric field.
pub type YesNo = String;
pub type RiskLevel = String;

/// Step 1 — Patient demographics.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demographics {
    pub first_name: String,
    pub last_name: String,
    pub date_of_birth: String,
    pub sex: String,
    pub nhs_number: String,
    pub address_line1: String,
    pub address_line2: String,
    pub city: String,
    pub postcode: String,
    pub phone: String,
    pub email: String,
    pub emergency_name: String,
    pub emergency_phone: String,
    pub emergency_relationship: String,
    pub gp_name: String,
    pub gp_practice: String,
    pub gp_phone: String,
}

/// Step 2 — Planned surgery and proposed anaesthesia.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PlannedSurgery {
    pub procedure_name: String,
    pub surgeon_name: String,
    pub surgery_date: String,
    /// `minor` | `intermediate` | `major` | `complex` | `''`
    pub surgery_grade: String,
    /// `general` | `regional` | `sedation` | `local` | `combined` | `''`
    pub proposed_anaesthesia: String,
}

/// Step 3 — Medical history (system-by-system).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MedicalHistory {
    // Cardiovascular
    pub hypertension: YesNo,
    pub ischaemic_heart_disease: YesNo,
    pub heart_failure: YesNo,
    pub valvular_disease: YesNo,
    pub arrhythmia: YesNo,
    pub peripheral_vascular_disease: YesNo,
    pub dvt_pe: YesNo,
    // Respiratory
    pub asthma: YesNo,
    pub copd: YesNo,
    pub sleep_apnea: YesNo,
    pub recent_urti: YesNo,
    // Neurological
    pub epilepsy: YesNo,
    pub stroke_tia: YesNo,
    pub neuromuscular_disease: YesNo,
    // Endocrine
    pub diabetes_type1: YesNo,
    pub diabetes_type2: YesNo,
    pub thyroid_disease: YesNo,
    pub adrenal_insufficiency: YesNo,
    // Renal
    pub chronic_kidney_disease: YesNo,
    pub dialysis: YesNo,
    // Hepatic
    pub liver_disease: YesNo,
    pub jaundice: YesNo,
    pub cirrhosis: YesNo,
    // Haematologic
    pub anaemia: YesNo,
    pub bleeding_disorder: YesNo,
    pub clotting_disorder: YesNo,
    // Gastrointestinal
    pub gord: YesNo,
    pub peptic_ulcer: YesNo,
    // Musculoskeletal
    pub rheumatoid_arthritis: YesNo,
    pub limited_mobility: YesNo,
    // Psychiatric
    pub anxiety: YesNo,
    pub depression: YesNo,
    pub other_psychiatric: YesNo,
    pub other_details: String,
}

/// A single medication line item.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Medication {
    pub name: String,
    pub dose: String,
    /// `oral` | `iv` | `sc` | `im` | `inhaled` | `topical` | `other` | `''`
    pub route: String,
    pub frequency: String,
    pub indication: String,
}

/// Step 4 — Medications and key drug-class flags.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Medications {
    pub list: Vec<Medication>,
    pub on_anticoagulants: YesNo,
    pub on_antiplatelets: YesNo,
    pub on_insulin: YesNo,
    pub on_steroids: YesNo,
    pub on_maois: YesNo,
}

/// A single allergy line item.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Allergy {
    pub allergen: String,
    /// `drug` | `latex` | `food` | `environmental` | `''`
    pub allergy_type: String,
    pub reaction: String,
    /// `mild` | `moderate` | `severe` | `anaphylaxis` | `''`
    pub severity: String,
}

/// Step 5 — Allergies and adverse reactions.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Allergies {
    pub list: Vec<Allergy>,
    pub latex_allergy: YesNo,
}

/// A previous anaesthetic / operation history entry.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PreviousOperation {
    pub year: String,
    pub procedure: String,
    /// `general` | `regional` | `sedation` | `local` | `unknown` | `''`
    pub anaesthesia_type: String,
    pub complications: String,
}

/// Step 6 — Previous anaesthesia and surgery history.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PreviousAnaesthesia {
    pub operations: Vec<PreviousOperation>,
    pub difficult_intubation: bool,
    pub ponv: bool,
    pub awareness: bool,
    pub slow_recovery: bool,
    pub allergic_reaction: bool,
    pub other_complication: bool,
    pub other_complication_details: String,
    pub malignant_hyperthermia: YesNo,
    pub family_anaesthetic_complications: YesNo,
    pub family_anaesthetic_details: String,
}

/// Social history (smoking, alcohol, exercise tolerance, pregnancy, STOP-BANG).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SocialHistory {
    /// `current` | `ex` | `never` | `''`
    pub smoking: String,
    pub pack_years: Option<f64>,
    pub alcohol_units_per_week: Option<f64>,
    pub recreational_drug_use: YesNo,
    pub recreational_drug_details: String,
    pub can_climb_two_flights: YesNo,
    /// `gt-4-mets` | `le-4-mets` | `unknown` | `''`
    pub exercise_tolerance: String,
    pub occupation: String,
    /// `not-pregnant` | `pregnant` | `not-applicable` | `''`
    pub pregnancy_status: String,
    // STOP-BANG subjective items
    pub snores_loudly: YesNo,
    pub tired_during_day: YesNo,
    pub observed_apnea: YesNo,
}

/// Step 8 — Vital signs and anthropometric measurements.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VitalSigns {
    pub systolic_bp: Option<i32>,
    pub diastolic_bp: Option<i32>,
    pub heart_rate: Option<i32>,
    pub respiratory_rate: Option<i32>,
    pub spo2: Option<i32>,
    pub temperature: Option<f64>,
    pub height: Option<f64>,
    pub weight: Option<f64>,
    pub bmi: Option<f64>,
    pub neck_circumference: Option<f64>,
}

/// Step 7 — Airway and physical examination.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PhysicalExam {
    /// `i` | `ii` | `iii` | `iv` | `''`
    pub mallampati_class: String,
    pub mouth_opening: Option<f64>,
    pub thyromental_distance: Option<f64>,
    /// `full` | `limited` | `fixed` | `''`
    pub neck_mobility: String,
    pub dentition_intact: bool,
    pub dentition_dentures: bool,
    pub dentition_loose_teeth: bool,
    pub dentition_crowns: bool,
    pub dentition_prominent_incisors: bool,
    /// `normal` | `limited` | `''`
    pub jaw_protrusion: String,
    /// `normal` | `murmur` | `irregular` | `added-sounds` | `''`
    pub heart_sounds: String,
    /// `none` | `mild` | `moderate` | `severe` | `''`
    pub peripheral_edema: String,
    /// `normal` | `raised` | `''`
    pub jvp: String,
    /// `normal` | `wheeze` | `crackles` | `reduced` | `''`
    pub breath_sounds: String,
    pub accessory_muscle_use: YesNo,
}

/// Step 9 + Step 10 — Investigations, ASA classification, anaesthetic plan.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InvestigationsAndPlan {
    // Lab and imaging investigations (status + notes per panel).
    pub fbc_status: String,
    pub fbc_notes: String,
    pub ue_status: String,
    pub ue_notes: String,
    pub lfts_status: String,
    pub lfts_notes: String,
    pub coag_status: String,
    pub coag_notes: String,
    pub hba1c_status: String,
    pub hba1c_notes: String,
    pub ecg_status: String,
    pub ecg_notes: String,
    pub cxr_status: String,
    pub cxr_notes: String,
    pub echo_status: String,
    pub echo_notes: String,
    pub other_investigation: String,
    pub other_investigation_status: String,
    // RCRI clinician confirmations (criteria 2, 3, 4, 6).
    pub rcri_ischaemic_heart_disease: YesNo,
    pub rcri_congestive_heart_failure: YesNo,
    pub rcri_cerebrovascular_disease: YesNo,
    pub rcri_high_creatinine: YesNo,
    /// `i` | `ii` | `iii` | `iv` | `v` | `vi` | `''`
    pub asa_class: String,
    pub emergency_case: YesNo,
    // Anaesthetic plan.
    pub proposed_technique: String,
    /// `facemask` | `lma` | `ett` | `awake-fibreoptic` | `other` | `''`
    pub airway_plan: String,
    /// `ward` | `hdu` | `icu` | `''`
    pub post_op_destination: String,
    pub special_requirements: String,
}

/// Full anesthesiology assessment data.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub demographics: Demographics,
    pub planned_surgery: PlannedSurgery,
    pub medical_history: MedicalHistory,
    pub medications: Medications,
    pub allergies: Allergies,
    pub previous_anaesthesia: PreviousAnaesthesia,
    pub social_history: SocialHistory,
    pub vital_signs: VitalSigns,
    pub physical_exam: PhysicalExam,
    pub investigations_and_plan: InvestigationsAndPlan,
}

/// An individual fired rule entry in the audit trail.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub category: String,
    pub description: String,
    /// `low` | `medium` | `high` | `critical`
    pub risk_level: RiskLevel,
}

/// Per-instrument ASA result.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AsaResult {
    pub class: String,
    pub emergency: bool,
    pub risk_level: RiskLevel,
    pub fired_rules: Vec<FiredRule>,
}

/// Per-instrument Mallampati / airway result.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AirwayResult {
    pub mallampati_class: String,
    pub medium_factors: u32,
    pub risk_level: RiskLevel,
    pub fired_rules: Vec<FiredRule>,
}

/// Per-instrument RCRI (Revised Cardiac Risk Index) result.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RcriResult {
    pub score: u32,
    pub mace_percent: f64,
    pub risk_level: RiskLevel,
    pub fired_rules: Vec<FiredRule>,
}

/// Per-instrument STOP-BANG OSA result.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct StopbangResult {
    pub score: u32,
    pub risk_level: RiskLevel,
    pub fired_rules: Vec<FiredRule>,
}

/// Flagged safety / clinical issue detected independently of scoring.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    /// `urgent` | `high` | `medium` | `low`
    pub priority: String,
}

/// Composite grading result for the assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub asa: AsaResult,
    pub airway: AirwayResult,
    pub rcri: RcriResult,
    pub stopbang: StopbangResult,
    pub overall_risk: RiskLevel,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub timestamp: String,
}
