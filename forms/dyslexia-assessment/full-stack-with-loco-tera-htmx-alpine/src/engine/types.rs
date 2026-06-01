use serde::{Deserialize, Serialize};

// Type aliases matching the frontend union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<i32>` with None indicates an unanswered numeric field.
pub type Sex = String;
pub type YesNo = String;
pub type YesNoUnsure = String;
pub type Severity = String;
pub type Priority = String;

/// Step 1 — Demographics.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Demographics {
    pub first_name: String,
    pub last_name: String,
    pub date_of_birth: String,
    pub sex: Sex,
    pub age_years: Option<i32>,
    pub preferred_language: String,
    pub first_language: String,
    pub handedness: String,
    pub referral_source: String,
    pub referral_reason: String,
}

/// Step 2 — Developmental History.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DevelopmentalHistory {
    pub pregnancy_complications: YesNoUnsure,
    pub pregnancy_details: String,
    pub birth_complications: YesNoUnsure,
    pub birth_details: String,
    pub early_milestones: String,
    pub speech_delay: YesNoUnsure,
    pub language_delay: YesNoUnsure,
    pub hearing_problems: YesNoUnsure,
    pub vision_problems: YesNoUnsure,
    pub family_history_dyslexia: YesNoUnsure,
    pub family_history_details: String,
    pub other_developmental_notes: String,
}

/// Step 3 — Educational Background.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EducationalBackground {
    pub school_type: String,
    pub current_year_group: String,
    pub school_changes: YesNoUnsure,
    pub school_change_count: Option<i32>,
    pub attendance_issues: YesNoUnsure,
    pub attendance_details: String,
    pub esl_learner: YesNoUnsure,
    pub academic_strengths: String,
    pub academic_weaknesses: String,
    pub previous_assessments: YesNoUnsure,
    pub previous_assessment_details: String,
}

/// Step 4 — Reading Assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReadingAssessment {
    pub reading_fluency_score: Option<i32>,
    pub reading_comprehension_score: Option<i32>,
    pub difficulty_decoding: YesNo,
    pub difficulty_comprehension: YesNo,
    pub avoids_reading: YesNo,
    pub slow_reading_speed: YesNo,
    pub loses_place_when_reading: YesNo,
    pub reading_notes: String,
}

/// Step 5 — Writing & Spelling Assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WritingSpelling {
    pub spelling_accuracy_score: Option<i32>,
    pub written_expression_score: Option<i32>,
    pub difficulty_spelling: YesNo,
    pub difficulty_handwriting: YesNo,
    pub difficulty_organising_ideas: YesNo,
    pub omits_letters_or_words: YesNo,
    pub reverses_letters_or_numbers: YesNo,
    pub writing_notes: String,
}

/// Step 6 — Phonological Processing.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PhonologicalProcessing {
    pub phonological_awareness_score: Option<i32>,
    pub phonological_memory_score: Option<i32>,
    pub rapid_naming_score: Option<i32>,
    pub difficulty_rhyming: YesNo,
    pub difficulty_segmenting_sounds: YesNo,
    pub difficulty_blending_sounds: YesNo,
    pub difficulty_learning_letter_sounds: YesNo,
    pub phonological_notes: String,
}

/// Step 7 — Working Memory & Processing Speed.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WorkingMemoryProcessingSpeed {
    pub working_memory_score: Option<i32>,
    pub processing_speed_score: Option<i32>,
    pub difficulty_following_instructions: YesNo,
    pub difficulty_remembering_sequences: YesNo,
    pub slow_to_complete_tasks: YesNo,
    pub difficulty_taking_notes: YesNo,
    pub memory_notes: String,
}

/// Step 8 — Emotional & Behavioural Impact.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EmotionalBehavioural {
    pub low_self_esteem: YesNo,
    pub anxiety_about_school: YesNo,
    pub avoidance_behaviour: YesNo,
    pub frustration_with_learning: YesNo,
    pub peer_relationship_difficulties: YesNo,
    pub sleep_disturbance: YesNo,
    pub mental_health_concerns: YesNo,
    pub mental_health_details: String,
    pub behavioural_notes: String,
}

/// Step 9 — Previous Support & Interventions.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PreviousSupport {
    pub previous_intervention: YesNo,
    pub intervention_types: String,
    pub current_ehcp_or_iep: YesNo,
    pub ehcp_details: String,
    pub access_arrangements: YesNo,
    pub access_arrangements_list: Vec<String>,
    pub tutorial_support: YesNo,
    pub assistive_technology_used: YesNo,
    pub assistive_technology_details: String,
    pub previous_support_notes: String,
}

/// Step 10 — Recommendations & Support Plan.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RecommendationsSupportPlan {
    pub recommended_supports: Vec<String>,
    pub structured_literacy_recommended: YesNo,
    pub assistive_tech_recommended: YesNo,
    pub extra_time_recommended: YesNo,
    pub specialist_assessment_recommended: YesNo,
    pub parent_training_recommended: YesNo,
    pub key_goals: String,
    pub review_timeframe: String,
    pub additional_recommendations: String,
}

/// Full Dyslexia Assessment data.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    pub demographics: Demographics,
    pub developmental_history: DevelopmentalHistory,
    pub educational_background: EducationalBackground,
    pub reading_assessment: ReadingAssessment,
    pub writing_spelling: WritingSpelling,
    pub phonological_processing: PhonologicalProcessing,
    pub working_memory_processing_speed: WorkingMemoryProcessingSpeed,
    pub emotional_behavioural: EmotionalBehavioural,
    pub previous_support: PreviousSupport,
    pub recommendations_support_plan: RecommendationsSupportPlan,
}

/// A per-domain standardised score with severity classification.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DomainScore {
    pub id: String,
    pub category: String,
    pub description: String,
    pub score: Option<i32>,
    pub severity: Severity,
}

/// A safety / clinical flag computed independently of the grader.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub id: String,
    pub category: String,
    pub message: String,
    pub priority: Priority,
}

/// Grading output for a dyslexia assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub overall_severity: Severity,
    pub lowest_score: Option<i32>,
    pub answered_count: u32,
    pub domain_scores: Vec<DomainScore>,
    pub additional_flags: Vec<AdditionalFlag>,
    pub timestamp: String,
}
