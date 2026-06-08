//! Serde data types for the assessment payload and grading result.

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
    /// First name.
    pub first_name: String,
    /// Last name.
    pub last_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Sex.
    pub sex: Sex,
    /// Occupation.
    pub occupation: String,
}

/// Step 2 — Presenting complaint (ear / nose / throat / neck).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PresentingComplaint {
    /// Ear symptoms.
    pub ear_symptoms: YesNo,
    /// Nose symptoms.
    pub nose_symptoms: YesNo,
    /// Throat symptoms.
    pub throat_symptoms: YesNo,
    /// Neck symptoms.
    pub neck_symptoms: YesNo,
    /// Chief complaint.
    pub chief_complaint: String,
}

/// Step 3 — History of present illness.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HistoryOfPresentIllness {
    /// Onset date.
    pub onset_date: String,
    /// Onset type.
    pub onset_type: String,
    /// Progression.
    pub progression: String,
    /// Laterality.
    pub laterality: Laterality,
    /// Previous episodes.
    pub previous_episodes: YesNo,
    /// Aggravating factors.
    pub aggravating_factors: String,
    /// Relieving factors.
    pub relieving_factors: String,
    /// Associated symptoms.
    pub associated_symptoms: String,
}

/// Step 4 — Past ENT history & surgery.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PastEntHistory {
    /// Prior ent surgery.
    pub prior_ent_surgery: YesNo,
    /// Prior ent surgery details.
    pub prior_ent_surgery_details: String,
    /// Chronic sinusitis.
    pub chronic_sinusitis: YesNo,
    /// Allergic rhinitis.
    pub allergic_rhinitis: YesNo,
    /// Hearing loss.
    pub hearing_loss: YesNo,
    /// Tinnitus.
    pub tinnitus: YesNo,
    /// Vertigo.
    pub vertigo: YesNo,
    /// Hearing aids.
    pub hearing_aids: YesNo,
    /// Head neck cancer.
    pub head_neck_cancer: YesNo,
    /// Head neck radiotherapy.
    pub head_neck_radiotherapy: YesNo,
    /// Smoking.
    pub smoking: YesNo,
    /// Alcohol.
    pub alcohol: YesNo,
}

/// Step 5 — SNOT-22 questionnaire (22 items, 0-5 each, total 0-110).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Snot22Questionnaire {
    /// Need to blow nose.
    pub need_to_blow_nose: Option<i32>,
    /// Sneezing.
    pub sneezing: Option<i32>,
    /// Runny nose.
    pub runny_nose: Option<i32>,
    /// Nasal blockage.
    pub nasal_blockage: Option<i32>,
    /// Loss of smell taste.
    pub loss_of_smell_taste: Option<i32>,
    /// Coughing.
    pub coughing: Option<i32>,
    /// Post nasal discharge.
    pub post_nasal_discharge: Option<i32>,
    /// Thick nasal discharge.
    pub thick_nasal_discharge: Option<i32>,
    /// Ear fullness.
    pub ear_fullness: Option<i32>,
    /// Dizziness.
    pub dizziness: Option<i32>,
    /// Ear pain.
    pub ear_pain: Option<i32>,
    /// Facial pain pressure.
    pub facial_pain_pressure: Option<i32>,
    /// Difficulty falling asleep.
    pub difficulty_falling_asleep: Option<i32>,
    /// Waking up at night.
    pub waking_up_at_night: Option<i32>,
    /// Lack of good nights sleep.
    pub lack_of_good_nights_sleep: Option<i32>,
    /// Waking up tired.
    pub waking_up_tired: Option<i32>,
    /// Fatigue.
    pub fatigue: Option<i32>,
    /// Reduced productivity.
    pub reduced_productivity: Option<i32>,
    /// Reduced concentration.
    pub reduced_concentration: Option<i32>,
    /// Frustrated restless irritable.
    pub frustrated_restless_irritable: Option<i32>,
    /// Sad.
    pub sad: Option<i32>,
    /// Embarrassed.
    pub embarrassed: Option<i32>,
}

/// Step 6 — External examination.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ExternalExamination {
    /// Facial asymmetry.
    pub facial_asymmetry: YesNo,
    /// Facial swelling.
    pub facial_swelling: YesNo,
    /// Skin lesions.
    pub skin_lesions: YesNo,
    /// External ear findings.
    pub external_ear_findings: String,
    /// External nose findings.
    pub external_nose_findings: String,
    /// Examination notes.
    pub examination_notes: String,
}

/// Step 7 — per-side otoscopy findings.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OtoscopySide {
    /// Tympanic membrane.
    pub tympanic_membrane: String,
    /// Canal.
    pub canal: String,
    /// Mobility.
    pub mobility: YesNo,
}

/// Step 7 — Otoscopy.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Otoscopy {
    /// Right.
    pub right: OtoscopySide,
    /// Left.
    pub left: OtoscopySide,
    /// Otoscopy notes.
    pub otoscopy_notes: String,
}

/// Step 8 — per-side anterior rhinoscopy findings.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AnteriorRhinoscopySide {
    /// Septum.
    pub septum: String,
    /// Mucosa.
    pub mucosa: String,
    /// Polyps.
    pub polyps: String,
    /// Discharge.
    pub discharge: String,
    /// Turbinate hypertrophy.
    pub turbinate_hypertrophy: String,
}

/// Step 8 — Anterior rhinoscopy.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AnteriorRhinoscopy {
    /// Right.
    pub right: AnteriorRhinoscopySide,
    /// Left.
    pub left: AnteriorRhinoscopySide,
    /// Rhinoscopy notes.
    pub rhinoscopy_notes: String,
}

/// Step 9 — Oropharyngeal & neck examination.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OropharyngealNeckExamination {
    /// Oral mucosa.
    pub oral_mucosa: String,
    /// Tonsils.
    pub tonsils: String,
    /// Pharynx.
    pub pharynx: String,
    /// Palate movement.
    pub palate_movement: String,
    /// Cervical lymphadenopathy.
    pub cervical_lymphadenopathy: YesNo,
    /// Cervical lymphadenopathy details.
    pub cervical_lymphadenopathy_details: String,
    /// Thyroid enlarged.
    pub thyroid_enlarged: YesNo,
    /// Neck mass.
    pub neck_mass: YesNo,
    /// Neck mass details.
    pub neck_mass_details: String,
    /// Examination notes.
    pub examination_notes: String,
}

/// Step 10 — Clinical impression & management plan.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalImpressionPlan {
    /// Working diagnosis.
    pub working_diagnosis: String,
    /// Differential diagnosis.
    pub differential_diagnosis: String,
    /// Investigations required.
    pub investigations_required: YesNo,
    /// Investigations details.
    pub investigations_details: String,
    /// Medication prescribed.
    pub medication_prescribed: YesNo,
    /// Medication details.
    pub medication_details: String,
    /// Referral required.
    pub referral_required: YesNo,
    /// Referral details.
    pub referral_details: String,
    /// Surgery considered.
    pub surgery_considered: YesNo,
    /// Surgery details.
    pub surgery_details: String,
    /// Follow up plan.
    pub follow_up_plan: String,
    /// Patient education.
    pub patient_education: String,
}

/// Full Otolaryngology Assessment record.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Demographics.
    pub demographics: Demographics,
    /// Presenting complaint.
    pub presenting_complaint: PresentingComplaint,
    /// History of present illness.
    pub history_of_present_illness: HistoryOfPresentIllness,
    /// Past ent history.
    pub past_ent_history: PastEntHistory,
    /// Snot22.
    pub snot22: Snot22Questionnaire,
    /// External examination.
    pub external_examination: ExternalExamination,
    /// Otoscopy.
    pub otoscopy: Otoscopy,
    /// Anterior rhinoscopy.
    pub anterior_rhinoscopy: AnteriorRhinoscopy,
    /// Oropharyngeal neck examination.
    pub oropharyngeal_neck_examination: OropharyngealNeckExamination,
    /// Clinical impression plan.
    pub clinical_impression_plan: ClinicalImpressionPlan,
}

/// A SNOT-22 rule that fired (i.e. patient answered that item, contributing
/// `score` points to the total).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Description.
    pub description: String,
    /// Score.
    pub score: i32,
}

/// A clinical flag computed independently of the SNOT-22 total.
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

/// Grading output for an otolaryngology assessment case.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Total score.
    pub total_score: i32,
    /// Severity level.
    pub severity_level: SeverityLevel,
    /// Answered count.
    pub answered_count: i32,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
