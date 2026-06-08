//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

// Type aliases mirroring the JS / Svelte engine union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<i32>` / `Option<f64>` with None indicates an unanswered numeric field.
/// Yes no.
pub type YesNo = String;
/// Risk level.
pub type RiskLevel = String;

/// Step 1 — Patient demographics.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demographics {
    /// First name.
    pub first_name: String,
    /// Last name.
    pub last_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Sex.
    pub sex: String,
    /// NHS number.
    pub nhs_number: String,
    /// Address line1.
    pub address_line1: String,
    /// Address line2.
    pub address_line2: String,
    /// City.
    pub city: String,
    /// Postcode.
    pub postcode: String,
    /// Phone.
    pub phone: String,
    /// Email.
    pub email: String,
    /// Emergency name.
    pub emergency_name: String,
    /// Emergency phone.
    pub emergency_phone: String,
    /// Emergency relationship.
    pub emergency_relationship: String,
    /// GP name.
    pub gp_name: String,
    /// GP practice.
    pub gp_practice: String,
    /// GP phone.
    pub gp_phone: String,
}

/// Step 2 — Planned surgery and proposed anaesthesia.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PlannedSurgery {
    /// Procedure name.
    pub procedure_name: String,
    /// Surgeon name.
    pub surgeon_name: String,
    /// Surgery date.
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
    /// Hypertension.
    pub hypertension: YesNo,
    /// Ischaemic heart disease.
    pub ischaemic_heart_disease: YesNo,
    /// Heart failure.
    pub heart_failure: YesNo,
    /// Valvular disease.
    pub valvular_disease: YesNo,
    /// Arrhythmia.
    pub arrhythmia: YesNo,
    /// Peripheral vascular disease.
    pub peripheral_vascular_disease: YesNo,
    /// DVT pe.
    pub dvt_pe: YesNo,
    // Respiratory
    /// Asthma.
    pub asthma: YesNo,
    /// Copd.
    pub copd: YesNo,
    /// Sleep apnea.
    pub sleep_apnea: YesNo,
    /// Recent urti.
    pub recent_urti: YesNo,
    // Neurological
    /// Epilepsy.
    pub epilepsy: YesNo,
    /// Stroke tia.
    pub stroke_tia: YesNo,
    /// Neuromuscular disease.
    pub neuromuscular_disease: YesNo,
    // Endocrine
    /// Diabetes type1.
    pub diabetes_type1: YesNo,
    /// Diabetes type2.
    pub diabetes_type2: YesNo,
    /// Thyroid disease.
    pub thyroid_disease: YesNo,
    /// Adrenal insufficiency.
    pub adrenal_insufficiency: YesNo,
    // Renal
    /// Chronic kidney disease.
    pub chronic_kidney_disease: YesNo,
    /// Dialysis.
    pub dialysis: YesNo,
    // Hepatic
    /// Liver disease.
    pub liver_disease: YesNo,
    /// Jaundice.
    pub jaundice: YesNo,
    /// Cirrhosis.
    pub cirrhosis: YesNo,
    // Haematologic
    /// Anaemia.
    pub anaemia: YesNo,
    /// Bleeding disorder.
    pub bleeding_disorder: YesNo,
    /// Clotting disorder.
    pub clotting_disorder: YesNo,
    // Gastrointestinal
    /// Gord.
    pub gord: YesNo,
    /// Peptic ulcer.
    pub peptic_ulcer: YesNo,
    // Musculoskeletal
    /// Rheumatoid arthritis.
    pub rheumatoid_arthritis: YesNo,
    /// Limited mobility.
    pub limited_mobility: YesNo,
    // Psychiatric
    /// Anxiety.
    pub anxiety: YesNo,
    /// Depression.
    pub depression: YesNo,
    /// Other psychiatric.
    pub other_psychiatric: YesNo,
    /// Other details.
    pub other_details: String,
}

/// A single medication line item.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Medication {
    /// Name.
    pub name: String,
    /// Dose.
    pub dose: String,
    /// `oral` | `iv` | `sc` | `im` | `inhaled` | `topical` | `other` | `''`
    pub route: String,
    /// Frequency.
    pub frequency: String,
    /// Indication.
    pub indication: String,
}

/// Step 4 — Medications and key drug-class flags.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Medications {
    /// List.
    pub list: Vec<Medication>,
    /// On anticoagulants.
    pub on_anticoagulants: YesNo,
    /// On antiplatelets.
    pub on_antiplatelets: YesNo,
    /// On insulin.
    pub on_insulin: YesNo,
    /// On steroids.
    pub on_steroids: YesNo,
    /// On maois.
    pub on_maois: YesNo,
}

/// A single allergy line item.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Allergy {
    /// Allergen.
    pub allergen: String,
    /// `drug` | `latex` | `food` | `environmental` | `''`
    pub allergy_type: String,
    /// Reaction.
    pub reaction: String,
    /// `mild` | `moderate` | `severe` | `anaphylaxis` | `''`
    pub severity: String,
}

/// Step 5 — Allergies and adverse reactions.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Allergies {
    /// List.
    pub list: Vec<Allergy>,
    /// Latex allergy.
    pub latex_allergy: YesNo,
}

/// A previous anaesthetic / operation history entry.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PreviousOperation {
    /// Year.
    pub year: String,
    /// Procedure.
    pub procedure: String,
    /// `general` | `regional` | `sedation` | `local` | `unknown` | `''`
    pub anaesthesia_type: String,
    /// Complications.
    pub complications: String,
}

/// Step 6 — Previous anaesthesia and surgery history.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PreviousAnaesthesia {
    /// Operations.
    pub operations: Vec<PreviousOperation>,
    /// Difficult intubation.
    pub difficult_intubation: bool,
    /// Ponv.
    pub ponv: bool,
    /// Awareness.
    pub awareness: bool,
    /// Slow recovery.
    pub slow_recovery: bool,
    /// Allergic reaction.
    pub allergic_reaction: bool,
    /// Other complication.
    pub other_complication: bool,
    /// Other complication details.
    pub other_complication_details: String,
    /// Malignant hyperthermia.
    pub malignant_hyperthermia: YesNo,
    /// Family anaesthetic complications.
    pub family_anaesthetic_complications: YesNo,
    /// Family anaesthetic details.
    pub family_anaesthetic_details: String,
}

/// Social history (smoking, alcohol, exercise tolerance, pregnancy, STOP-BANG).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SocialHistory {
    /// `current` | `ex` | `never` | `''`
    pub smoking: String,
    /// Pack years.
    pub pack_years: Option<f64>,
    /// Alcohol units per week.
    pub alcohol_units_per_week: Option<f64>,
    /// Recreational drug use.
    pub recreational_drug_use: YesNo,
    /// Recreational drug details.
    pub recreational_drug_details: String,
    /// Can climb two flights.
    pub can_climb_two_flights: YesNo,
    /// `gt-4-mets` | `le-4-mets` | `unknown` | `''`
    pub exercise_tolerance: String,
    /// Occupation.
    pub occupation: String,
    /// `not-pregnant` | `pregnant` | `not-applicable` | `''`
    pub pregnancy_status: String,
    // STOP-BANG subjective items
    /// Snores loudly.
    pub snores_loudly: YesNo,
    /// Tired during day.
    pub tired_during_day: YesNo,
    /// Observed apnea.
    pub observed_apnea: YesNo,
}

/// Step 8 — Vital signs and anthropometric measurements.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VitalSigns {
    /// Systolic BP.
    pub systolic_bp: Option<i32>,
    /// Diastolic BP.
    pub diastolic_bp: Option<i32>,
    /// Heart rate.
    pub heart_rate: Option<i32>,
    /// Respiratory rate.
    pub respiratory_rate: Option<i32>,
    /// SpO2.
    pub spo2: Option<i32>,
    /// Temperature.
    pub temperature: Option<f64>,
    /// Height.
    pub height: Option<f64>,
    /// Weight.
    pub weight: Option<f64>,
    /// BMI.
    pub bmi: Option<f64>,
    /// Neck circumference.
    pub neck_circumference: Option<f64>,
}

/// Step 7 — Airway and physical examination.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PhysicalExam {
    /// `i` | `ii` | `iii` | `iv` | `''`
    pub mallampati_class: String,
    /// Mouth opening.
    pub mouth_opening: Option<f64>,
    /// Thyromental distance.
    pub thyromental_distance: Option<f64>,
    /// `full` | `limited` | `fixed` | `''`
    pub neck_mobility: String,
    /// Dentition intact.
    pub dentition_intact: bool,
    /// Dentition dentures.
    pub dentition_dentures: bool,
    /// Dentition loose teeth.
    pub dentition_loose_teeth: bool,
    /// Dentition crowns.
    pub dentition_crowns: bool,
    /// Dentition prominent incisors.
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
    /// Accessory muscle use.
    pub accessory_muscle_use: YesNo,
}

/// Step 9 + Step 10 — Investigations, ASA classification, anaesthetic plan.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InvestigationsAndPlan {
    // Lab and imaging investigations (status + notes per panel).
    /// Fbc status.
    pub fbc_status: String,
    /// Fbc notes.
    pub fbc_notes: String,
    /// Ue status.
    pub ue_status: String,
    /// Ue notes.
    pub ue_notes: String,
    /// Lfts status.
    pub lfts_status: String,
    /// Lfts notes.
    pub lfts_notes: String,
    /// Coag status.
    pub coag_status: String,
    /// Coag notes.
    pub coag_notes: String,
    /// Hba1c status.
    pub hba1c_status: String,
    /// Hba1c notes.
    pub hba1c_notes: String,
    /// ECG status.
    pub ecg_status: String,
    /// ECG notes.
    pub ecg_notes: String,
    /// Cxr status.
    pub cxr_status: String,
    /// Cxr notes.
    pub cxr_notes: String,
    /// Echo status.
    pub echo_status: String,
    /// Echo notes.
    pub echo_notes: String,
    /// Other investigation.
    pub other_investigation: String,
    /// Other investigation status.
    pub other_investigation_status: String,
    // RCRI clinician confirmations (criteria 2, 3, 4, 6).
    /// Rcri ischaemic heart disease.
    pub rcri_ischaemic_heart_disease: YesNo,
    /// Rcri congestive heart failure.
    pub rcri_congestive_heart_failure: YesNo,
    /// Rcri cerebrovascular disease.
    pub rcri_cerebrovascular_disease: YesNo,
    /// Rcri high creatinine.
    pub rcri_high_creatinine: YesNo,
    /// `i` | `ii` | `iii` | `iv` | `v` | `vi` | `''`
    pub asa_class: String,
    /// Emergency case.
    pub emergency_case: YesNo,
    // Anaesthetic plan.
    /// Proposed technique.
    pub proposed_technique: String,
    /// `facemask` | `lma` | `ett` | `awake-fibreoptic` | `other` | `''`
    pub airway_plan: String,
    /// `ward` | `hdu` | `icu` | `''`
    pub post_op_destination: String,
    /// Special requirements.
    pub special_requirements: String,
}

/// Full anesthesiology assessment data.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Demographics.
    pub demographics: Demographics,
    /// Planned surgery.
    pub planned_surgery: PlannedSurgery,
    /// Medical history.
    pub medical_history: MedicalHistory,
    /// Medications.
    pub medications: Medications,
    /// Allergies.
    pub allergies: Allergies,
    /// Previous anaesthesia.
    pub previous_anaesthesia: PreviousAnaesthesia,
    /// Social history.
    pub social_history: SocialHistory,
    /// Vital signs.
    pub vital_signs: VitalSigns,
    /// Physical exam.
    pub physical_exam: PhysicalExam,
    /// Investigations and plan.
    pub investigations_and_plan: InvestigationsAndPlan,
}

/// An individual fired rule entry in the audit trail.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Description.
    pub description: String,
    /// `low` | `medium` | `high` | `critical`
    pub risk_level: RiskLevel,
}

/// Per-instrument ASA result.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AsaResult {
    /// Class.
    pub class: String,
    /// Emergency.
    pub emergency: bool,
    /// Risk level.
    pub risk_level: RiskLevel,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
}

/// Per-instrument Mallampati / airway result.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AirwayResult {
    /// Mallampati class.
    pub mallampati_class: String,
    /// Medium factors.
    pub medium_factors: u32,
    /// Risk level.
    pub risk_level: RiskLevel,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
}

/// Per-instrument RCRI (Revised Cardiac Risk Index) result.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RcriResult {
    /// Score.
    pub score: u32,
    /// Mace percent.
    pub mace_percent: f64,
    /// Risk level.
    pub risk_level: RiskLevel,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
}

/// Per-instrument STOP-BANG OSA result.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct StopbangResult {
    /// Score.
    pub score: u32,
    /// Risk level.
    pub risk_level: RiskLevel,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
}

/// Flagged safety / clinical issue detected independently of scoring.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Message.
    pub message: String,
    /// `urgent` | `high` | `medium` | `low`
    pub priority: String,
}

/// Composite grading result for the assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Asa.
    pub asa: AsaResult,
    /// Airway.
    pub airway: AirwayResult,
    /// Rcri.
    pub rcri: RcriResult,
    /// Stopbang.
    pub stopbang: StopbangResult,
    /// Overall risk.
    pub overall_risk: RiskLevel,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
