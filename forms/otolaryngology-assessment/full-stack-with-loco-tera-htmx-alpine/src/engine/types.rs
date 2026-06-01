use serde::{Deserialize, Serialize};

/// Sex enum (`male` / `female` / `other` / `''`).
pub type Sex = String;
/// Yes/No enum (`yes` / `no` / `''`).
pub type YesNo = String;
/// Laterality (`left` / `right` / `both` / `''`).
pub type Laterality = String;
/// Severity band returned by the SNOT-22 grader.
pub type SeverityLevel = String;

/// Step 1 — Demographics.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demographics {
    pub first_name: String,
    pub last_name: String,
    pub date_of_birth: String,
    pub sex: Sex,
    pub occupation: String,
}

/// Step 2 — Presenting complaint (ear / nose / throat / neck).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PresentingComplaint {
    pub ear_symptoms: YesNo,
    pub nose_symptoms: YesNo,
    pub throat_symptoms: YesNo,
    pub neck_symptoms: YesNo,
    pub chief_complaint: String,
}

/// Step 3 — History of present illness.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HistoryOfPresentIllness {
    pub onset_date: String,
    pub onset_type: String,
    pub progression: String,
    pub laterality: Laterality,
    pub previous_episodes: YesNo,
    pub aggravating_factors: String,
    pub relieving_factors: String,
    pub associated_symptoms: String,
}

/// Step 4 — Past ENT history & surgery.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PastEntHistory {
    pub prior_ent_surgery: YesNo,
    pub prior_ent_surgery_details: String,
    pub chronic_sinusitis: YesNo,
    pub allergic_rhinitis: YesNo,
    pub hearing_loss: YesNo,
    pub tinnitus: YesNo,
    pub vertigo: YesNo,
    pub hearing_aids: YesNo,
    pub head_neck_cancer: YesNo,
    pub head_neck_radiotherapy: YesNo,
    pub smoking: YesNo,
    pub alcohol: YesNo,
}

/// Step 5 — SNOT-22 questionnaire (22 items, 0-5 each, total 0-110).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Snot22Questionnaire {
    pub need_to_blow_nose: Option<i32>,
    pub sneezing: Option<i32>,
    pub runny_nose: Option<i32>,
    pub nasal_blockage: Option<i32>,
    pub loss_of_smell_taste: Option<i32>,
    pub coughing: Option<i32>,
    pub post_nasal_discharge: Option<i32>,
    pub thick_nasal_discharge: Option<i32>,
    pub ear_fullness: Option<i32>,
    pub dizziness: Option<i32>,
    pub ear_pain: Option<i32>,
    pub facial_pain_pressure: Option<i32>,
    pub difficulty_falling_asleep: Option<i32>,
    pub waking_up_at_night: Option<i32>,
    pub lack_of_good_nights_sleep: Option<i32>,
    pub waking_up_tired: Option<i32>,
    pub fatigue: Option<i32>,
    pub reduced_productivity: Option<i32>,
    pub reduced_concentration: Option<i32>,
    pub frustrated_restless_irritable: Option<i32>,
    pub sad: Option<i32>,
    pub embarrassed: Option<i32>,
}

/// Step 6 — External examination.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ExternalExamination {
    pub facial_asymmetry: YesNo,
    pub facial_swelling: YesNo,
    pub skin_lesions: YesNo,
    pub external_ear_findings: String,
    pub external_nose_findings: String,
    pub examination_notes: String,
}

/// Step 7 — per-side otoscopy findings.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OtoscopySide {
    pub tympanic_membrane: String,
    pub canal: String,
    pub mobility: YesNo,
}

/// Step 7 — Otoscopy.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Otoscopy {
    pub right: OtoscopySide,
    pub left: OtoscopySide,
    pub otoscopy_notes: String,
}

/// Step 8 — per-side anterior rhinoscopy findings.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AnteriorRhinoscopySide {
    pub septum: String,
    pub mucosa: String,
    pub polyps: String,
    pub discharge: String,
    pub turbinate_hypertrophy: String,
}

/// Step 8 — Anterior rhinoscopy.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AnteriorRhinoscopy {
    pub right: AnteriorRhinoscopySide,
    pub left: AnteriorRhinoscopySide,
    pub rhinoscopy_notes: String,
}

/// Step 9 — Oropharyngeal & neck examination.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OropharyngealNeckExamination {
    pub oral_mucosa: String,
    pub tonsils: String,
    pub pharynx: String,
    pub palate_movement: String,
    pub cervical_lymphadenopathy: YesNo,
    pub cervical_lymphadenopathy_details: String,
    pub thyroid_enlarged: YesNo,
    pub neck_mass: YesNo,
    pub neck_mass_details: String,
    pub examination_notes: String,
}

/// Step 10 — Clinical impression & management plan.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalImpressionPlan {
    pub working_diagnosis: String,
    pub differential_diagnosis: String,
    pub investigations_required: YesNo,
    pub investigations_details: String,
    pub medication_prescribed: YesNo,
    pub medication_details: String,
    pub referral_required: YesNo,
    pub referral_details: String,
    pub surgery_considered: YesNo,
    pub surgery_details: String,
    pub follow_up_plan: String,
    pub patient_education: String,
}

/// Full Otolaryngology Assessment record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub demographics: Demographics,
    pub presenting_complaint: PresentingComplaint,
    pub history_of_present_illness: HistoryOfPresentIllness,
    pub past_ent_history: PastEntHistory,
    pub snot22: Snot22Questionnaire,
    pub external_examination: ExternalExamination,
    pub otoscopy: Otoscopy,
    pub anterior_rhinoscopy: AnteriorRhinoscopy,
    pub oropharyngeal_neck_examination: OropharyngealNeckExamination,
    pub clinical_impression_plan: ClinicalImpressionPlan,
}

/// A SNOT-22 rule that fired (i.e. patient answered that item, contributing
/// `score` points to the total).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub id: String,
    pub category: String,
    pub description: String,
    pub score: i32,
}

/// A clinical flag computed independently of the SNOT-22 total.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: String,
}

/// Grading output for an otolaryngology assessment case.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub total_score: i32,
    pub severity_level: SeverityLevel,
    pub answered_count: i32,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub timestamp: String,
}
