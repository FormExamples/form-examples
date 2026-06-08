//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

// Type aliases matching frontend union types.
// Empty string means unanswered.
/// Yes no.
pub type YesNo = String;
/// Severity.
pub type Severity = String;
/// Smoking status.
pub type SmokingStatus = String;
/// Diabetes type.
pub type DiabetesType = String;
/// Diabetes control.
pub type DiabetesControl = String;
/// Alcohol frequency.
pub type AlcoholFrequency = String;
/// Sex.
pub type Sex = String;
/// Allergy severity.
pub type AllergySeverity = String;

/// Demographics.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demographics {
    /// NHS number.
    pub nhs_number: String,
    /// First name.
    pub first_name: String,
    /// Last name.
    pub last_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Sex.
    pub sex: Sex,
    /// Weight.
    pub weight: Option<f64>,
    /// Height.
    pub height: Option<f64>,
    /// BMI.
    pub bmi: Option<f64>,
    /// Planned procedure.
    pub planned_procedure: String,
    /// Procedure urgency.
    pub procedure_urgency: String,
}

/// Cardiovascular.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Cardiovascular {
    /// Hypertension.
    pub hypertension: YesNo,
    /// Hypertension controlled.
    pub hypertension_controlled: YesNo,
    /// Ischemic heart disease.
    pub ischemic_heart_disease: YesNo,
    /// Ihd details.
    pub ihd_details: String,
    /// Heart failure.
    pub heart_failure: YesNo,
    /// Heart failure nyha.
    #[serde(rename = "heartFailureNYHA")]
    pub heart_failure_nyha: String,
    /// Valvular disease.
    pub valvular_disease: YesNo,
    /// Valvular details.
    pub valvular_details: String,
    /// Arrhythmia.
    pub arrhythmia: YesNo,
    /// Arrhythmia type.
    pub arrhythmia_type: String,
    /// Pacemaker.
    pub pacemaker: YesNo,
    /// Recent mi.
    #[serde(rename = "recentMI")]
    pub recent_mi: YesNo,
    /// Recent mi weeks.
    #[serde(rename = "recentMIWeeks")]
    pub recent_mi_weeks: Option<f64>,
}

/// Respiratory.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Respiratory {
    /// Asthma.
    pub asthma: YesNo,
    /// Asthma frequency.
    pub asthma_frequency: String,
    /// Copd.
    pub copd: YesNo,
    /// Copd severity.
    pub copd_severity: Severity,
    /// Osa.
    pub osa: YesNo,
    /// Osa cpap.
    #[serde(rename = "osaCPAP")]
    pub osa_cpap: YesNo,
    /// Smoking.
    pub smoking: SmokingStatus,
    /// Smoking pack years.
    pub smoking_pack_years: Option<f64>,
    /// Recent urti.
    #[serde(rename = "recentURTI")]
    pub recent_urti: YesNo,
}

/// Renal.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Renal {
    /// Ckd.
    pub ckd: YesNo,
    /// Ckd stage.
    pub ckd_stage: String,
    /// Dialysis.
    pub dialysis: YesNo,
    /// Dialysis type.
    pub dialysis_type: String,
}

/// Hepatic.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Hepatic {
    /// Liver disease.
    pub liver_disease: YesNo,
    /// Cirrhosis.
    pub cirrhosis: YesNo,
    /// Child pugh score.
    pub child_pugh_score: String,
    /// Hepatitis.
    pub hepatitis: YesNo,
    /// Hepatitis type.
    pub hepatitis_type: String,
}

/// Endocrine.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Endocrine {
    /// Diabetes.
    pub diabetes: DiabetesType,
    /// Diabetes control.
    pub diabetes_control: DiabetesControl,
    /// Diabetes on insulin.
    pub diabetes_on_insulin: YesNo,
    /// Thyroid disease.
    pub thyroid_disease: YesNo,
    /// Thyroid type.
    pub thyroid_type: String,
    /// Adrenal insufficiency.
    pub adrenal_insufficiency: YesNo,
}

/// Neurological.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Neurological {
    /// Stroke or tia.
    #[serde(rename = "strokeOrTIA")]
    pub stroke_or_tia: YesNo,
    /// Stroke details.
    pub stroke_details: String,
    /// Epilepsy.
    pub epilepsy: YesNo,
    /// Epilepsy controlled.
    pub epilepsy_controlled: YesNo,
    /// Neuromuscular disease.
    pub neuromuscular_disease: YesNo,
    /// Neuromuscular details.
    pub neuromuscular_details: String,
    /// Raised icp.
    #[serde(rename = "raisedICP")]
    pub raised_icp: YesNo,
}

/// Haematological.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Haematological {
    /// Bleeding disorder.
    pub bleeding_disorder: YesNo,
    /// Bleeding details.
    pub bleeding_details: String,
    /// On anticoagulants.
    pub on_anticoagulants: YesNo,
    /// Anticoagulant type.
    pub anticoagulant_type: String,
    /// Sickle cell disease.
    pub sickle_cell_disease: YesNo,
    /// Sickle cell trait.
    pub sickle_cell_trait: YesNo,
    /// Anaemia.
    pub anaemia: YesNo,
}

/// Musculoskeletal airway.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MusculoskeletalAirway {
    /// Rheumatoid arthritis.
    pub rheumatoid_arthritis: YesNo,
    /// Cervical spine issues.
    pub cervical_spine_issues: YesNo,
    /// Limited neck movement.
    pub limited_neck_movement: YesNo,
    /// Limited mouth opening.
    pub limited_mouth_opening: YesNo,
    /// Dental issues.
    pub dental_issues: YesNo,
    /// Dental details.
    pub dental_details: String,
    /// Previous difficult airway.
    pub previous_difficult_airway: YesNo,
    /// Mallampati score.
    pub mallampati_score: String,
}

/// Gastrointestinal.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Gastrointestinal {
    /// Gord.
    pub gord: YesNo,
    /// Hiatus hernia.
    pub hiatus_hernia: YesNo,
    /// Nausea.
    pub nausea: YesNo,
}

/// Medication.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Medication {
    /// Name.
    pub name: String,
    /// Dose.
    pub dose: String,
    /// Frequency.
    pub frequency: String,
}

/// Allergy.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Allergy {
    /// Allergen.
    pub allergen: String,
    /// Reaction.
    pub reaction: String,
    /// Severity.
    pub severity: AllergySeverity,
}

/// Previous anaesthesia.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PreviousAnaesthesia {
    /// Previous anaesthesia.
    pub previous_anaesthesia: YesNo,
    /// Anaesthesia problems.
    pub anaesthesia_problems: YesNo,
    /// Anaesthesia problem details.
    pub anaesthesia_problem_details: String,
    /// Family mh history.
    #[serde(rename = "familyMHHistory")]
    pub family_mh_history: YesNo,
    /// Family mh details.
    #[serde(rename = "familyMHDetails")]
    pub family_mh_details: String,
    /// Ponv.
    pub ponv: YesNo,
}

/// Social history.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SocialHistory {
    /// Alcohol.
    pub alcohol: AlcoholFrequency,
    /// Alcohol units per week.
    pub alcohol_units_per_week: Option<f64>,
    /// Recreational drugs.
    pub recreational_drugs: YesNo,
    /// Drug details.
    pub drug_details: String,
}

/// Functional capacity.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FunctionalCapacity {
    /// Exercise tolerance.
    pub exercise_tolerance: String,
    /// Estimated mets.
    #[serde(rename = "estimatedMETs")]
    pub estimated_mets: Option<f64>,
    /// Mobility aids.
    pub mobility_aids: YesNo,
    /// Recent decline.
    pub recent_decline: YesNo,
}

/// Pregnancy.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Pregnancy {
    /// Possibly pregnant.
    pub possibly_pregnant: YesNo,
    /// Pregnancy confirmed.
    pub pregnancy_confirmed: YesNo,
    /// Gestation weeks.
    pub gestation_weeks: Option<f64>,
}

/// Assessment data.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Demographics.
    pub demographics: Demographics,
    /// Cardiovascular.
    pub cardiovascular: Cardiovascular,
    /// Respiratory.
    pub respiratory: Respiratory,
    /// Renal.
    pub renal: Renal,
    /// Hepatic.
    pub hepatic: Hepatic,
    /// Endocrine.
    pub endocrine: Endocrine,
    /// Neurological.
    pub neurological: Neurological,
    /// Haematological.
    pub haematological: Haematological,
    /// Musculoskeletal airway.
    pub musculoskeletal_airway: MusculoskeletalAirway,
    /// Gastrointestinal.
    pub gastrointestinal: Gastrointestinal,
    /// Medications.
    pub medications: Vec<Medication>,
    /// Allergies.
    pub allergies: Vec<Allergy>,
    /// Previous anaesthesia.
    pub previous_anaesthesia: PreviousAnaesthesia,
    /// Social history.
    pub social_history: SocialHistory,
    /// Functional capacity.
    pub functional_capacity: FunctionalCapacity,
    /// Pregnancy.
    pub pregnancy: Pregnancy,
}

/// Asa grade.
pub type AsaGrade = u8;

/// Fired rule.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// System.
    pub system: String,
    /// Description.
    pub description: String,
    /// Grade.
    pub grade: AsaGrade,
}

/// Additional flag.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Message.
    pub message: String,
    /// Priority.
    pub priority: String,
}

/// Grading result.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Asa grade.
    pub asa_grade: AsaGrade,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
