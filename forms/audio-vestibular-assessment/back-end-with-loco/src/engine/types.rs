//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Demographics section (Step 1).
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
    /// Assessment date.
    pub assessment_date: String,
}

/// Presenting symptoms (Step 2).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PresentingSymptoms {
    /// Hearing loss.
    pub hearing_loss: String,
    /// Hearing loss side.
    pub hearing_loss_side: String,
    /// Hearing loss onset.
    pub hearing_loss_onset: String,
    /// Hearing loss duration months.
    pub hearing_loss_duration_months: Option<i32>,
    /// Tinnitus.
    pub tinnitus: String,
    /// Tinnitus side.
    pub tinnitus_side: String,
    /// Otalgia.
    pub otalgia: String,
    /// Otorrhea.
    pub otorrhea: String,
    /// Aural fullness.
    pub aural_fullness: String,
    /// Vertigo.
    pub vertigo: String,
    /// Vertigo character.
    pub vertigo_character: String,
    /// Vertigo episode duration seconds.
    pub vertigo_episode_duration_seconds: Option<i32>,
    /// Vertigo frequency per week.
    pub vertigo_frequency_per_week: Option<i32>,
    /// Imbalance.
    pub imbalance: String,
    /// Falls.
    pub falls: String,
    /// Falls last year count.
    pub falls_last_year_count: Option<i32>,
    /// Headache migraine.
    pub headache_migraine: String,
    /// Neurological symptoms.
    pub neurological_symptoms: String,
    /// Other symptoms.
    pub other_symptoms: String,
}

/// Per-ear otoscopic finding.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OtoscopicEar {
    /// Canal status.
    pub canal_status: String,
    /// Tympanic membrane.
    pub tympanic_membrane: String,
}

/// Otoscopic examination (Step 3).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OtoscopicExamination {
    /// Right ear.
    pub right_ear: OtoscopicEar,
    /// Left ear.
    pub left_ear: OtoscopicEar,
    /// Notes.
    pub notes: String,
}

/// Per-ear pure-tone thresholds at the 4-frequency PTA frequencies.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EarThresholds {
    /// Hz500.
    pub hz500: Option<f64>,
    /// Hz1000.
    pub hz1000: Option<f64>,
    /// Hz2000.
    pub hz2000: Option<f64>,
    /// Hz4000.
    pub hz4000: Option<f64>,
}

/// Per-ear pure-tone audiometry data (air + bone conduction).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PtaEar {
    /// Air conduction.
    pub air_conduction: EarThresholds,
    /// Bone conduction.
    pub bone_conduction: EarThresholds,
    /// Pure tone average.
    pub pure_tone_average: Option<f64>,
}

/// Pure-tone audiometry (Step 4).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PureToneAudiometry {
    /// Right ear.
    pub right_ear: PtaEar,
    /// Left ear.
    pub left_ear: PtaEar,
    /// Better ear pure tone average.
    pub better_ear_pure_tone_average: Option<f64>,
    /// Asymmetry db.
    pub asymmetry_db: Option<f64>,
    /// Audiometry notes.
    pub audiometry_notes: String,
}

/// Speech audiometry (Step 5).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SpeechAudiometry {
    /// Right srt db.
    pub right_srt_db: Option<f64>,
    /// Left srt db.
    pub left_srt_db: Option<f64>,
    /// Right word recognition percent.
    pub right_word_recognition_percent: Option<f64>,
    /// Left word recognition percent.
    pub left_word_recognition_percent: Option<f64>,
    /// Speech audiometry notes.
    pub speech_audiometry_notes: String,
}

/// Tympanometry & acoustic reflexes (Step 6).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TympanometryAcousticReflexes {
    /// Right tympanogram.
    pub right_tympanogram: String,
    /// Left tympanogram.
    pub left_tympanogram: String,
    /// Right acoustic reflexes.
    pub right_acoustic_reflexes: String,
    /// Left acoustic reflexes.
    pub left_acoustic_reflexes: String,
    /// Notes.
    pub notes: String,
}

/// Vestibular screening (Step 7).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VestibularScreening {
    /// Head impulse test.
    pub head_impulse_test: String,
    /// Dix hallpike.
    pub dix_hallpike: String,
    /// Romberg test.
    pub romberg_test: String,
    /// Tandem gait.
    pub tandem_gait: String,
    /// Nystagmus.
    pub nystagmus: String,
    /// Fukuda stepping test.
    pub fukuda_stepping_test: String,
    /// Notes.
    pub notes: String,
}

/// DHI raw answers (Step 8). Stored as a sparse map of q1..q25 → 'yes' | 'sometimes' | 'no' | ''.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DizzinessHandicapInventory {
    /// Q1.
    #[serde(default)]
    pub q1: String,
    /// Q2.
    #[serde(default)]
    pub q2: String,
    /// Q3.
    #[serde(default)]
    pub q3: String,
    /// Q4.
    #[serde(default)]
    pub q4: String,
    /// Q5.
    #[serde(default)]
    pub q5: String,
    /// Q6.
    #[serde(default)]
    pub q6: String,
    /// Q7.
    #[serde(default)]
    pub q7: String,
    /// Q8.
    #[serde(default)]
    pub q8: String,
    /// Q9.
    #[serde(default)]
    pub q9: String,
    /// Q10.
    #[serde(default)]
    pub q10: String,
    /// Q11.
    #[serde(default)]
    pub q11: String,
    /// Q12.
    #[serde(default)]
    pub q12: String,
    /// Q13.
    #[serde(default)]
    pub q13: String,
    /// Q14.
    #[serde(default)]
    pub q14: String,
    /// Q15.
    #[serde(default)]
    pub q15: String,
    /// Q16.
    #[serde(default)]
    pub q16: String,
    /// Q17.
    #[serde(default)]
    pub q17: String,
    /// Q18.
    #[serde(default)]
    pub q18: String,
    /// Q19.
    #[serde(default)]
    pub q19: String,
    /// Q20.
    #[serde(default)]
    pub q20: String,
    /// Q21.
    #[serde(default)]
    pub q21: String,
    /// Q22.
    #[serde(default)]
    pub q22: String,
    /// Q23.
    #[serde(default)]
    pub q23: String,
    /// Q24.
    #[serde(default)]
    pub q24: String,
    /// Q25.
    #[serde(default)]
    pub q25: String,
}

impl DizzinessHandicapInventory {
    /// Answer.
    pub fn answer(&self, num: u8) -> &str {
        match num {
            1 => &self.q1,
            2 => &self.q2,
            3 => &self.q3,
            4 => &self.q4,
            5 => &self.q5,
            6 => &self.q6,
            7 => &self.q7,
            8 => &self.q8,
            9 => &self.q9,
            10 => &self.q10,
            11 => &self.q11,
            12 => &self.q12,
            13 => &self.q13,
            14 => &self.q14,
            15 => &self.q15,
            16 => &self.q16,
            17 => &self.q17,
            18 => &self.q18,
            19 => &self.q19,
            20 => &self.q20,
            21 => &self.q21,
            22 => &self.q22,
            23 => &self.q23,
            24 => &self.q24,
            25 => &self.q25,
            _ => "",
        }
    }
}

/// Clinical impression & referral (Step 9).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalImpressionReferral {
    /// Provisional diagnosis.
    pub provisional_diagnosis: String,
    /// Hearing aid candidate.
    pub hearing_aid_candidate: String,
    /// Vestibular rehab indicated.
    pub vestibular_rehab_indicated: String,
    /// Ent referral.
    pub ent_referral: String,
    /// Neurology referral.
    pub neurology_referral: String,
    /// Imaging requested.
    pub imaging_requested: String,
    /// Follow up weeks.
    pub follow_up_weeks: Option<i32>,
    /// Additional notes.
    pub additional_notes: String,
}

/// Full audio-vestibular assessment record (9 sections).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Demographics.
    pub demographics: Demographics,
    /// Presenting symptoms.
    pub presenting_symptoms: PresentingSymptoms,
    /// Otoscopic examination.
    pub otoscopic_examination: OtoscopicExamination,
    /// Pure tone audiometry.
    pub pure_tone_audiometry: PureToneAudiometry,
    /// Speech audiometry.
    pub speech_audiometry: SpeechAudiometry,
    /// Tympanometry acoustic reflexes.
    pub tympanometry_acoustic_reflexes: TympanometryAcousticReflexes,
    /// Vestibular screening.
    pub vestibular_screening: VestibularScreening,
    /// Dizziness handicap inventory.
    pub dizziness_handicap_inventory: DizzinessHandicapInventory,
    /// Clinical impression referral.
    pub clinical_impression_referral: ClinicalImpressionReferral,
}

/// A single DHI item result (scored).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DhiFiredItem {
    /// ID.
    pub id: String,
    /// Num.
    pub num: u8,
    /// Subscale.
    pub subscale: String,
    /// Text.
    pub text: String,
    /// Answer.
    pub answer: String,
    /// Score.
    pub score: u32,
}

/// A flagged clinical issue (red flag, retrocochlear concern, fall risk, etc.).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Message.
    pub message: String,
    /// Priority: urgent > high > medium > low.
    pub priority: String,
}

/// Output of the audio-vestibular grading pipeline.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    // ─── Pure-Tone Audiometry ───
    /// Right pta.
    pub right_pta: Option<f64>,
    /// Left pta.
    pub left_pta: Option<f64>,
    /// Better ear pta.
    pub better_ear_pta: Option<f64>,
    /// Asymmetry.
    pub asymmetry: Option<f64>,
    /// Hearing loss grade.
    pub hearing_loss_grade: String,
    /// Right hearing loss grade.
    pub right_hearing_loss_grade: String,
    /// Left hearing loss grade.
    pub left_hearing_loss_grade: String,

    // ─── Dizziness Handicap Inventory ───
    /// Dhi total.
    pub dhi_total: u32,
    /// Dhi answered count.
    pub dhi_answered_count: u32,
    /// Dhi functional.
    pub dhi_functional: u32,
    /// Dhi emotional.
    pub dhi_emotional: u32,
    /// Dhi physical.
    pub dhi_physical: u32,
    /// Dhi handicap level.
    pub dhi_handicap_level: String,
    /// Dhi fired items.
    pub dhi_fired_items: Vec<DhiFiredItem>,

    // ─── Flagged Issues ───
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,

    /// Timestamp.
    pub timestamp: String,
}
