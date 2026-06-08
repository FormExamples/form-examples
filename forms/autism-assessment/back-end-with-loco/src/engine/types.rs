//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

/// Likelihood level.
pub type LikelihoodLevel = String;

// ─── Patient Information (Step 1) ───────────────────────────

/// Patient information.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct PatientInformation {
    /// Patient name.
    pub patient_name: String,
    /// Date of birth.
    pub date_of_birth: String,
    /// Patient age.
    pub patient_age: String,
    /// Patient sex.
    pub patient_sex: String,
    /// Referral source.
    pub referral_source: String,
    /// Assessment date.
    pub assessment_date: String,
    /// Clinician name.
    pub clinician_name: String,
    /// Clinician role.
    pub clinician_role: String,
}

// ─── Developmental History (Step 2) ─────────────────────────

/// Developmental history.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct DevelopmentalHistory {
    /// Speech delay.
    pub speech_delay: String,
    /// Motor delay.
    pub motor_delay: String,
    /// Social play differences.
    pub social_play_differences: String,
    /// Early repetitive behaviours.
    pub early_repetitive_behaviours: String,
    /// Age first concerns.
    pub age_first_concerns: String,
    /// Previous assessments.
    pub previous_assessments: String,
    /// Developmental notes.
    pub developmental_notes: String,
}

// ─── Social Communication (Step 3) ──────────────────────────

/// Social communication.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SocialCommunication {
    /// Eye contact.
    pub eye_contact: Option<u8>,
    /// Conversational reciprocity.
    pub conversational_reciprocity: Option<u8>,
    /// Nonverbal communication.
    pub nonverbal_communication: Option<u8>,
    /// Understanding social cues.
    pub understanding_social_cues: Option<u8>,
    /// Friendship maintenance.
    pub friendship_maintenance: Option<u8>,
    /// Communication preference.
    pub communication_preference: String,
}

// ─── Restricted Repetitive Behaviours (Step 4) ──────────────

/// Restricted repetitive behaviours.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct RestrictedRepetitiveBehaviours {
    /// Intense interests.
    pub intense_interests: Option<u8>,
    /// Routines rituals.
    pub routines_rituals: Option<u8>,
    /// Resistance to change.
    pub resistance_to_change: Option<u8>,
    /// Repetitive movements.
    pub repetitive_movements: Option<u8>,
    /// Need for sameness.
    pub need_for_sameness: Option<u8>,
    /// Special interest description.
    pub special_interest_description: String,
}

// ─── Sensory Processing (Step 5) ────────────────────────────

/// Sensory processing.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SensoryProcessing {
    /// Auditory sensitivity.
    pub auditory_sensitivity: Option<u8>,
    /// Visual sensitivity.
    pub visual_sensitivity: Option<u8>,
    /// Tactile sensitivity.
    pub tactile_sensitivity: Option<u8>,
    /// Olfactory sensitivity.
    pub olfactory_sensitivity: Option<u8>,
    /// Sensory seeking.
    pub sensory_seeking: Option<u8>,
    /// Sensory overload frequency.
    pub sensory_overload_frequency: String,
    /// Sensory coping strategies.
    pub sensory_coping_strategies: String,
}

// ─── AQ-10 Screening (Step 6) ───────────────────────────────
// Each item: 0 = definitely disagree, 1 = slightly disagree,
//            2 = slightly agree, 3 = definitely agree

/// Aq10 screening.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct Aq10Screening {
    /// Q1: I often notice small sounds when others do not
    pub q1_notice_sounds: Option<u8>,
    /// Q2: I usually concentrate more on the whole picture rather than small details
    pub q2_whole_picture: Option<u8>,
    /// Q3: I find it easy to do more than one thing at once
    pub q3_multitask: Option<u8>,
    /// Q4: If there is an interruption, I can switch back very quickly
    pub q4_switch_back: Option<u8>,
    /// Q5: I find it easy to read between the lines when someone is talking to me
    pub q5_read_between_lines: Option<u8>,
    /// Q6: I know how to tell if someone listening to me is getting bored
    pub q6_detect_boredom: Option<u8>,
    /// Q7: When I'm reading a story, I find it difficult to work out the characters' intentions
    pub q7_character_intentions: Option<u8>,
    /// Q8: I like to collect information about categories of things
    pub q8_collect_info: Option<u8>,
    /// Q9: I find it easy to work out what someone is thinking or feeling just by looking at their face
    pub q9_read_faces: Option<u8>,
    /// Q10: I find it difficult to work out people's intentions
    pub q10_work_out_intentions: Option<u8>,
}

// ─── Daily Living Skills (Step 7) ───────────────────────────

/// Daily living skills.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct DailyLivingSkills {
    /// Personal care.
    pub personal_care: Option<u8>,
    /// Meal preparation.
    pub meal_preparation: Option<u8>,
    /// Time management.
    pub time_management: Option<u8>,
    /// Financial management.
    pub financial_management: Option<u8>,
    /// Travel independence.
    pub travel_independence: Option<u8>,
    /// Executive function difficulties.
    pub executive_function_difficulties: String,
}

// ─── Mental Health Comorbidities (Step 8) ────────────────────

/// Mental health comorbidities.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct MentalHealthComorbidities {
    /// Anxiety level.
    pub anxiety_level: Option<u8>,
    /// Depression level.
    pub depression_level: Option<u8>,
    /// Sleep difficulties.
    pub sleep_difficulties: Option<u8>,
    /// Self harm risk.
    pub self_harm_risk: String,
    /// Current medications.
    pub current_medications: String,
    /// Previous mental health diagnoses.
    pub previous_mental_health_diagnoses: String,
    /// Safeguarding concerns.
    pub safeguarding_concerns: String,
}

// ─── Support Needs (Step 9) ─────────────────────────────────

/// Support needs.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SupportNeeds {
    /// Employment support.
    pub employment_support: String,
    /// Education support.
    pub education_support: String,
    /// Relationship support.
    pub relationship_support: String,
    /// Housing support.
    pub housing_support: String,
    /// Benefits support.
    pub benefits_support: String,
    /// Current support services.
    pub current_support_services: String,
    /// Support level needed.
    pub support_level_needed: String,
}

// ─── Clinical Review (Step 10) ──────────────────────────────

/// Clinical review.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ClinicalReview {
    /// Clinical observations.
    pub clinical_observations: String,
    /// Informant history.
    pub informant_history: String,
    /// Recommended referrals.
    pub recommended_referrals: String,
    /// Follow up plan.
    pub follow_up_plan: String,
    /// Additional notes.
    pub additional_notes: String,
}

// ─── Assessment Data (all sections) ─────────────────────────

/// Assessment data.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Patient information.
    pub patient_information: PatientInformation,
    /// Developmental history.
    pub developmental_history: DevelopmentalHistory,
    /// Social communication.
    pub social_communication: SocialCommunication,
    /// Restricted repetitive behaviours.
    pub restricted_repetitive_behaviours: RestrictedRepetitiveBehaviours,
    /// Sensory processing.
    pub sensory_processing: SensoryProcessing,
    /// Aq10 screening.
    pub aq10_screening: Aq10Screening,
    /// Daily living skills.
    pub daily_living_skills: DailyLivingSkills,
    /// Mental health comorbidities.
    pub mental_health_comorbidities: MentalHealthComorbidities,
    /// Support needs.
    pub support_needs: SupportNeeds,
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
    /// Likelihood level.
    pub likelihood_level: LikelihoodLevel,
    /// Aq10 score.
    pub aq10_score: u8,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
