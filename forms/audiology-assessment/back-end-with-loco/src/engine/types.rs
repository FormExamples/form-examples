//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Hearing level.
pub type HearingLevel = String;

// ─── Patient Information (Step 1) ───────────────────────────

/// Patient information.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PatientInformation {
    /// Patient name.
    pub patient_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Patient sex.
    pub patient_sex: String,
    /// Referral source.
    pub referral_source: String,
    /// Referral reason.
    pub referral_reason: String,
    /// Assessment date.
    pub assessment_date: String,
    /// Audiologist name.
    pub audiologist_name: String,
    /// Clinic location.
    pub clinic_location: String,
}

// ─── Hearing History (Step 2) ───────────────────────────────

/// Hearing history.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct HearingHistory {
    /// Onset type.
    pub onset_type: String,
    /// Onset duration.
    pub onset_duration: String,
    /// Affected ear.
    pub affected_ear: String,
    /// Family history.
    pub family_history: String,
    /// Noise exposure history.
    pub noise_exposure_history: String,
    /// Noise exposure type.
    pub noise_exposure_type: String,
    /// Hearing protection use.
    pub hearing_protection_use: String,
    /// Previous hearing test.
    pub previous_hearing_test: String,
    /// Previous hearing aid.
    pub previous_hearing_aid: String,
    /// Ototoxic medication.
    pub ototoxic_medication: String,
    /// Ototoxic medication name.
    pub ototoxic_medication_name: String,
}

// ─── Symptoms Assessment (Step 3) ───────────────────────────

/// Symptoms assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SymptomsAssessment {
    /// Hearing difficulty quiet.
    pub hearing_difficulty_quiet: Option<u8>,
    /// Hearing difficulty noise.
    pub hearing_difficulty_noise: Option<u8>,
    /// Hearing difficulty phone.
    pub hearing_difficulty_phone: Option<u8>,
    /// Hearing difficulty group.
    pub hearing_difficulty_group: Option<u8>,
    /// Hearing difficulty tv.
    pub hearing_difficulty_tv: Option<u8>,
    /// Ear pain.
    pub ear_pain: String,
    /// Ear discharge.
    pub ear_discharge: String,
    /// Ear fullness.
    pub ear_fullness: String,
    /// Autophony.
    pub autophony: String,
}

// ─── Otoscopic Examination (Step 4) ─────────────────────────

/// Otoscopic examination.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct OtoscopicExamination {
    /// Right canal.
    pub right_canal: String,
    /// Right tympanic membrane.
    pub right_tympanic_membrane: String,
    /// Right cerumen.
    pub right_cerumen: String,
    /// Right abnormalities.
    pub right_abnormalities: String,
    /// Left canal.
    pub left_canal: String,
    /// Left tympanic membrane.
    pub left_tympanic_membrane: String,
    /// Left cerumen.
    pub left_cerumen: String,
    /// Left abnormalities.
    pub left_abnormalities: String,
    /// Active infection.
    pub active_infection: String,
}

// ─── Audiometric Results (Step 5) ───────────────────────────

/// Audiometric results.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AudiometricResults {
    // Air conduction thresholds (dB HL) - Right ear
    /// Right ac 250.
    pub right_ac_250: Option<u8>,
    /// Right ac 500.
    pub right_ac_500: Option<u8>,
    /// Right ac 1000.
    pub right_ac_1000: Option<u8>,
    /// Right ac 2000.
    pub right_ac_2000: Option<u8>,
    /// Right ac 4000.
    pub right_ac_4000: Option<u8>,
    /// Right ac 8000.
    pub right_ac_8000: Option<u8>,
    // Air conduction thresholds (dB HL) - Left ear
    /// Left ac 250.
    pub left_ac_250: Option<u8>,
    /// Left ac 500.
    pub left_ac_500: Option<u8>,
    /// Left ac 1000.
    pub left_ac_1000: Option<u8>,
    /// Left ac 2000.
    pub left_ac_2000: Option<u8>,
    /// Left ac 4000.
    pub left_ac_4000: Option<u8>,
    /// Left ac 8000.
    pub left_ac_8000: Option<u8>,
    // Bone conduction thresholds (dB HL) - Right ear
    /// Right bc 500.
    pub right_bc_500: Option<u8>,
    /// Right bc 1000.
    pub right_bc_1000: Option<u8>,
    /// Right bc 2000.
    pub right_bc_2000: Option<u8>,
    /// Right bc 4000.
    pub right_bc_4000: Option<u8>,
    // Bone conduction thresholds (dB HL) - Left ear
    /// Left bc 500.
    pub left_bc_500: Option<u8>,
    /// Left bc 1000.
    pub left_bc_1000: Option<u8>,
    /// Left bc 2000.
    pub left_bc_2000: Option<u8>,
    /// Left bc 4000.
    pub left_bc_4000: Option<u8>,
    // Speech audiometry
    /// Right srt.
    pub right_srt: Option<u8>,
    /// Right wrs.
    pub right_wrs: Option<u8>,
    /// Left srt.
    pub left_srt: Option<u8>,
    /// Left wrs.
    pub left_wrs: Option<u8>,
    // Tympanometry
    /// Right tympanogram type.
    pub right_tympanogram_type: String,
    /// Left tympanogram type.
    pub left_tympanogram_type: String,
    /// Right compliance.
    pub right_compliance: String,
    /// Left compliance.
    pub left_compliance: String,
}

// ─── Tinnitus (Step 6) ──────────────────────────────────────

/// Tinnitus.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct Tinnitus {
    /// Tinnitus present.
    pub tinnitus_present: String,
    /// Tinnitus ear.
    pub tinnitus_ear: String,
    /// Tinnitus type.
    pub tinnitus_type: String,
    /// Tinnitus onset.
    pub tinnitus_onset: String,
    /// Tinnitus severity.
    pub tinnitus_severity: Option<u8>,
    /// Tinnitus sleep impact.
    pub tinnitus_sleep_impact: Option<u8>,
    /// Tinnitus concentration impact.
    pub tinnitus_concentration_impact: Option<u8>,
    /// Tinnitus emotional impact.
    pub tinnitus_emotional_impact: Option<u8>,
    /// Tinnitus daily activity impact.
    pub tinnitus_daily_activity_impact: Option<u8>,
}

// ─── Balance Assessment (Step 7) ────────────────────────────

/// Balance assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct BalanceAssessment {
    /// Dizziness present.
    pub dizziness_present: String,
    /// Dizziness type.
    pub dizziness_type: String,
    /// Dizziness frequency.
    pub dizziness_frequency: String,
    /// Dizziness duration.
    pub dizziness_duration: String,
    /// Dizziness triggers.
    pub dizziness_triggers: String,
    /// Falls history.
    pub falls_history: String,
    /// Falls frequency.
    pub falls_frequency: String,
    /// Nausea with dizziness.
    pub nausea_with_dizziness: String,
    /// Dizziness severity.
    pub dizziness_severity: Option<u8>,
    /// Dizziness daily impact.
    pub dizziness_daily_impact: Option<u8>,
}

// ─── Communication Impact (Step 8) ──────────────────────────

/// Communication impact.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CommunicationImpact {
    /// Difficulty understanding speech.
    pub difficulty_understanding_speech: Option<u8>,
    /// Social withdrawal.
    pub social_withdrawal: Option<u8>,
    /// Frustration level.
    pub frustration_level: Option<u8>,
    /// Asking to repeat.
    pub asking_to_repeat: Option<u8>,
    /// Avoiding situations.
    pub avoiding_situations: Option<u8>,
    /// Impact on work.
    pub impact_on_work: Option<u8>,
    /// Impact on relationships.
    pub impact_on_relationships: Option<u8>,
    /// Communication strategies used.
    pub communication_strategies_used: String,
    /// Additional concerns.
    pub additional_concerns: String,
}

// ─── Hearing Aid Assessment (Step 9) ────────────────────────

/// Hearing aid assessment.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct HearingAidAssessment {
    /// Current hearing aid.
    pub current_hearing_aid: String,
    /// Hearing aid type.
    pub hearing_aid_type: String,
    /// Hearing aid age.
    pub hearing_aid_age: String,
    /// Hearing aid satisfaction.
    pub hearing_aid_satisfaction: Option<u8>,
    /// Hearing aid hours per day.
    pub hearing_aid_hours_per_day: String,
    /// Hearing aid difficulties.
    pub hearing_aid_difficulties: String,
    /// Interest in hearing aid.
    pub interest_in_hearing_aid: String,
    /// Hearing aid concerns.
    pub hearing_aid_concerns: String,
    /// Assistive device use.
    pub assistive_device_use: String,
}

// ─── Clinical Review (Step 10) ──────────────────────────────

/// Clinical review.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalReview {
    /// Loss type right.
    pub loss_type_right: String,
    /// Loss type left.
    pub loss_type_left: String,
    /// Recommended action.
    pub recommended_action: String,
    /// Ent referral needed.
    pub ent_referral_needed: String,
    /// Follow up interval.
    pub follow_up_interval: String,
    /// Clinician notes.
    pub clinician_notes: String,
    /// Patient goals.
    pub patient_goals: String,
    /// Consent for treatment.
    pub consent_for_treatment: String,
}

// ─── Assessment Data (all sections) ─────────────────────────

/// Assessment data.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient information.
    pub patient_information: PatientInformation,
    /// Hearing history.
    pub hearing_history: HearingHistory,
    /// Symptoms assessment.
    pub symptoms_assessment: SymptomsAssessment,
    /// Otoscopic examination.
    pub otoscopic_examination: OtoscopicExamination,
    /// Audiometric results.
    pub audiometric_results: AudiometricResults,
    /// Tinnitus.
    pub tinnitus: Tinnitus,
    /// Balance assessment.
    pub balance_assessment: BalanceAssessment,
    /// Communication impact.
    pub communication_impact: CommunicationImpact,
    /// Hearing aid assessment.
    pub hearing_aid_assessment: HearingAidAssessment,
    /// Clinical review.
    pub clinical_review: ClinicalReview,
}

// ─── Grading types ──────────────────────────────────────────

/// Fired rule.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Description.
    pub description: String,
    /// Concern level.
    pub concern_level: String,
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
    /// Hearing level.
    pub hearing_level: HearingLevel,
    /// Pure tone average.
    pub pure_tone_average: f64,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
