use serde::{Deserialize, Serialize};

/// Demographics section (Step 1).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demographics {
    pub first_name: String,
    pub last_name: String,
    pub date_of_birth: String,
    pub sex: String,
    pub assessment_date: String,
}

/// Presenting symptoms (Step 2).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PresentingSymptoms {
    pub hearing_loss: String,
    pub hearing_loss_side: String,
    pub hearing_loss_onset: String,
    pub hearing_loss_duration_months: Option<i32>,
    pub tinnitus: String,
    pub tinnitus_side: String,
    pub otalgia: String,
    pub otorrhea: String,
    pub aural_fullness: String,
    pub vertigo: String,
    pub vertigo_character: String,
    pub vertigo_episode_duration_seconds: Option<i32>,
    pub vertigo_frequency_per_week: Option<i32>,
    pub imbalance: String,
    pub falls: String,
    pub falls_last_year_count: Option<i32>,
    pub headache_migraine: String,
    pub neurological_symptoms: String,
    pub other_symptoms: String,
}

/// Per-ear otoscopic finding.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OtoscopicEar {
    pub canal_status: String,
    pub tympanic_membrane: String,
}

/// Otoscopic examination (Step 3).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OtoscopicExamination {
    pub right_ear: OtoscopicEar,
    pub left_ear: OtoscopicEar,
    pub notes: String,
}

/// Per-ear pure-tone thresholds at the 4-frequency PTA frequencies.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EarThresholds {
    pub hz500: Option<f64>,
    pub hz1000: Option<f64>,
    pub hz2000: Option<f64>,
    pub hz4000: Option<f64>,
}

/// Per-ear pure-tone audiometry data (air + bone conduction).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PtaEar {
    pub air_conduction: EarThresholds,
    pub bone_conduction: EarThresholds,
    pub pure_tone_average: Option<f64>,
}

/// Pure-tone audiometry (Step 4).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PureToneAudiometry {
    pub right_ear: PtaEar,
    pub left_ear: PtaEar,
    pub better_ear_pure_tone_average: Option<f64>,
    pub asymmetry_db: Option<f64>,
    pub audiometry_notes: String,
}

/// Speech audiometry (Step 5).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SpeechAudiometry {
    pub right_srt_db: Option<f64>,
    pub left_srt_db: Option<f64>,
    pub right_word_recognition_percent: Option<f64>,
    pub left_word_recognition_percent: Option<f64>,
    pub speech_audiometry_notes: String,
}

/// Tympanometry & acoustic reflexes (Step 6).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TympanometryAcousticReflexes {
    pub right_tympanogram: String,
    pub left_tympanogram: String,
    pub right_acoustic_reflexes: String,
    pub left_acoustic_reflexes: String,
    pub notes: String,
}

/// Vestibular screening (Step 7).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VestibularScreening {
    pub head_impulse_test: String,
    pub dix_hallpike: String,
    pub romberg_test: String,
    pub tandem_gait: String,
    pub nystagmus: String,
    pub fukuda_stepping_test: String,
    pub notes: String,
}

/// DHI raw answers (Step 8). Stored as a sparse map of q1..q25 → 'yes' | 'sometimes' | 'no' | ''.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DizzinessHandicapInventory {
    #[serde(default)]
    pub q1: String,
    #[serde(default)]
    pub q2: String,
    #[serde(default)]
    pub q3: String,
    #[serde(default)]
    pub q4: String,
    #[serde(default)]
    pub q5: String,
    #[serde(default)]
    pub q6: String,
    #[serde(default)]
    pub q7: String,
    #[serde(default)]
    pub q8: String,
    #[serde(default)]
    pub q9: String,
    #[serde(default)]
    pub q10: String,
    #[serde(default)]
    pub q11: String,
    #[serde(default)]
    pub q12: String,
    #[serde(default)]
    pub q13: String,
    #[serde(default)]
    pub q14: String,
    #[serde(default)]
    pub q15: String,
    #[serde(default)]
    pub q16: String,
    #[serde(default)]
    pub q17: String,
    #[serde(default)]
    pub q18: String,
    #[serde(default)]
    pub q19: String,
    #[serde(default)]
    pub q20: String,
    #[serde(default)]
    pub q21: String,
    #[serde(default)]
    pub q22: String,
    #[serde(default)]
    pub q23: String,
    #[serde(default)]
    pub q24: String,
    #[serde(default)]
    pub q25: String,
}

impl DizzinessHandicapInventory {
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
    pub provisional_diagnosis: String,
    pub hearing_aid_candidate: String,
    pub vestibular_rehab_indicated: String,
    pub ent_referral: String,
    pub neurology_referral: String,
    pub imaging_requested: String,
    pub follow_up_weeks: Option<i32>,
    pub additional_notes: String,
}

/// Full audio-vestibular assessment record (9 sections).
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub demographics: Demographics,
    pub presenting_symptoms: PresentingSymptoms,
    pub otoscopic_examination: OtoscopicExamination,
    pub pure_tone_audiometry: PureToneAudiometry,
    pub speech_audiometry: SpeechAudiometry,
    pub tympanometry_acoustic_reflexes: TympanometryAcousticReflexes,
    pub vestibular_screening: VestibularScreening,
    pub dizziness_handicap_inventory: DizzinessHandicapInventory,
    pub clinical_impression_referral: ClinicalImpressionReferral,
}

/// A single DHI item result (scored).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DhiFiredItem {
    pub id: String,
    pub num: u8,
    pub subscale: String,
    pub text: String,
    pub answer: String,
    pub score: u32,
}

/// A flagged clinical issue (red flag, retrocochlear concern, fall risk, etc.).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    /// Priority: urgent > high > medium > low.
    pub priority: String,
}

/// Output of the audio-vestibular grading pipeline.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    // ─── Pure-Tone Audiometry ───
    pub right_pta: Option<f64>,
    pub left_pta: Option<f64>,
    pub better_ear_pta: Option<f64>,
    pub asymmetry: Option<f64>,
    pub hearing_loss_grade: String,
    pub right_hearing_loss_grade: String,
    pub left_hearing_loss_grade: String,

    // ─── Dizziness Handicap Inventory ───
    pub dhi_total: u32,
    pub dhi_answered_count: u32,
    pub dhi_functional: u32,
    pub dhi_emotional: u32,
    pub dhi_physical: u32,
    pub dhi_handicap_level: String,
    pub dhi_fired_items: Vec<DhiFiredItem>,

    // ─── Flagged Issues ───
    pub additional_flags: Vec<AdditionalFlag>,

    pub timestamp: String,
}
