//! Serde data types for the assessment payload and grading result.

use serde::{Deserialize, Serialize};

// Type aliases matching the frontend union types.
// Empty string `''` indicates an unanswered enum / text field.
// `Option<i32>` with None indicates an unanswered numeric field.
/// Sex.
pub type Sex = String;
/// Yes no.
pub type YesNo = String;
/// Yes no unsure.
pub type YesNoUnsure = String;
/// Severity.
pub type Severity = String;
/// Priority.
pub type Priority = String;

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
    /// Age years.
    pub age_years: Option<i32>,
    /// Preferred language.
    pub preferred_language: String,
    /// First language.
    pub first_language: String,
    /// Handedness.
    pub handedness: String,
    /// Referral source.
    pub referral_source: String,
    /// Referral reason.
    pub referral_reason: String,
}

/// Step 2 — Developmental History.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DevelopmentalHistory {
    /// Pregnancy complications.
    pub pregnancy_complications: YesNoUnsure,
    /// Pregnancy details.
    pub pregnancy_details: String,
    /// Birth complications.
    pub birth_complications: YesNoUnsure,
    /// Birth details.
    pub birth_details: String,
    /// Early milestones.
    pub early_milestones: String,
    /// Speech delay.
    pub speech_delay: YesNoUnsure,
    /// Language delay.
    pub language_delay: YesNoUnsure,
    /// Hearing problems.
    pub hearing_problems: YesNoUnsure,
    /// Vision problems.
    pub vision_problems: YesNoUnsure,
    /// Family history dyslexia.
    pub family_history_dyslexia: YesNoUnsure,
    /// Family history details.
    pub family_history_details: String,
    /// Other developmental notes.
    pub other_developmental_notes: String,
}

/// Step 3 — Educational Background.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EducationalBackground {
    /// School type.
    pub school_type: String,
    /// Current year group.
    pub current_year_group: String,
    /// School changes.
    pub school_changes: YesNoUnsure,
    /// School change count.
    pub school_change_count: Option<i32>,
    /// Attendance issues.
    pub attendance_issues: YesNoUnsure,
    /// Attendance details.
    pub attendance_details: String,
    /// Esl learner.
    pub esl_learner: YesNoUnsure,
    /// Academic strengths.
    pub academic_strengths: String,
    /// Academic weaknesses.
    pub academic_weaknesses: String,
    /// Previous assessments.
    pub previous_assessments: YesNoUnsure,
    /// Previous assessment details.
    pub previous_assessment_details: String,
}

/// Step 4 — Reading Assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReadingAssessment {
    /// Reading fluency score.
    pub reading_fluency_score: Option<i32>,
    /// Reading comprehension score.
    pub reading_comprehension_score: Option<i32>,
    /// Difficulty decoding.
    pub difficulty_decoding: YesNo,
    /// Difficulty comprehension.
    pub difficulty_comprehension: YesNo,
    /// Avoids reading.
    pub avoids_reading: YesNo,
    /// Slow reading speed.
    pub slow_reading_speed: YesNo,
    /// Loses place when reading.
    pub loses_place_when_reading: YesNo,
    /// Reading notes.
    pub reading_notes: String,
}

/// Step 5 — Writing & Spelling Assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WritingSpelling {
    /// Spelling accuracy score.
    pub spelling_accuracy_score: Option<i32>,
    /// Written expression score.
    pub written_expression_score: Option<i32>,
    /// Difficulty spelling.
    pub difficulty_spelling: YesNo,
    /// Difficulty handwriting.
    pub difficulty_handwriting: YesNo,
    /// Difficulty organising ideas.
    pub difficulty_organising_ideas: YesNo,
    /// Omits letters or words.
    pub omits_letters_or_words: YesNo,
    /// Reverses letters or numbers.
    pub reverses_letters_or_numbers: YesNo,
    /// Writing notes.
    pub writing_notes: String,
}

/// Step 6 — Phonological Processing.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PhonologicalProcessing {
    /// Phonological awareness score.
    pub phonological_awareness_score: Option<i32>,
    /// Phonological memory score.
    pub phonological_memory_score: Option<i32>,
    /// Rapid naming score.
    pub rapid_naming_score: Option<i32>,
    /// Difficulty rhyming.
    pub difficulty_rhyming: YesNo,
    /// Difficulty segmenting sounds.
    pub difficulty_segmenting_sounds: YesNo,
    /// Difficulty blending sounds.
    pub difficulty_blending_sounds: YesNo,
    /// Difficulty learning letter sounds.
    pub difficulty_learning_letter_sounds: YesNo,
    /// Phonological notes.
    pub phonological_notes: String,
}

/// Step 7 — Working Memory & Processing Speed.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WorkingMemoryProcessingSpeed {
    /// Working memory score.
    pub working_memory_score: Option<i32>,
    /// Processing speed score.
    pub processing_speed_score: Option<i32>,
    /// Difficulty following instructions.
    pub difficulty_following_instructions: YesNo,
    /// Difficulty remembering sequences.
    pub difficulty_remembering_sequences: YesNo,
    /// Slow to complete tasks.
    pub slow_to_complete_tasks: YesNo,
    /// Difficulty taking notes.
    pub difficulty_taking_notes: YesNo,
    /// Memory notes.
    pub memory_notes: String,
}

/// Step 8 — Emotional & Behavioural Impact.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EmotionalBehavioural {
    /// Low self esteem.
    pub low_self_esteem: YesNo,
    /// Anxiety about school.
    pub anxiety_about_school: YesNo,
    /// Avoidance behaviour.
    pub avoidance_behaviour: YesNo,
    /// Frustration with learning.
    pub frustration_with_learning: YesNo,
    /// Peer relationship difficulties.
    pub peer_relationship_difficulties: YesNo,
    /// Sleep disturbance.
    pub sleep_disturbance: YesNo,
    /// Mental health concerns.
    pub mental_health_concerns: YesNo,
    /// Mental health details.
    pub mental_health_details: String,
    /// Behavioural notes.
    pub behavioural_notes: String,
}

/// Step 9 — Previous Support & Interventions.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PreviousSupport {
    /// Previous intervention.
    pub previous_intervention: YesNo,
    /// Intervention types.
    pub intervention_types: String,
    /// Current ehcp or iep.
    pub current_ehcp_or_iep: YesNo,
    /// Ehcp details.
    pub ehcp_details: String,
    /// Access arrangements.
    pub access_arrangements: YesNo,
    /// Access arrangements list.
    pub access_arrangements_list: Vec<String>,
    /// Tutorial support.
    pub tutorial_support: YesNo,
    /// Assistive technology used.
    pub assistive_technology_used: YesNo,
    /// Assistive technology details.
    pub assistive_technology_details: String,
    /// Previous support notes.
    pub previous_support_notes: String,
}

/// Step 10 — Recommendations & Support Plan.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RecommendationsSupportPlan {
    /// Recommended supports.
    pub recommended_supports: Vec<String>,
    /// Structured literacy recommended.
    pub structured_literacy_recommended: YesNo,
    /// Assistive tech recommended.
    pub assistive_tech_recommended: YesNo,
    /// Extra time recommended.
    pub extra_time_recommended: YesNo,
    /// Specialist assessment recommended.
    pub specialist_assessment_recommended: YesNo,
    /// Parent training recommended.
    pub parent_training_recommended: YesNo,
    /// Key goals.
    pub key_goals: String,
    /// Review timeframe.
    pub review_timeframe: String,
    /// Additional recommendations.
    pub additional_recommendations: String,
}

/// Full Dyslexia Assessment data.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AssessmentData {
    /// Demographics.
    pub demographics: Demographics,
    /// Developmental history.
    pub developmental_history: DevelopmentalHistory,
    /// Educational background.
    pub educational_background: EducationalBackground,
    /// Reading assessment.
    pub reading_assessment: ReadingAssessment,
    /// Writing spelling.
    pub writing_spelling: WritingSpelling,
    /// Phonological processing.
    pub phonological_processing: PhonologicalProcessing,
    /// Working memory processing speed.
    pub working_memory_processing_speed: WorkingMemoryProcessingSpeed,
    /// Emotional behavioural.
    pub emotional_behavioural: EmotionalBehavioural,
    /// Previous support.
    pub previous_support: PreviousSupport,
    /// Recommendations support plan.
    pub recommendations_support_plan: RecommendationsSupportPlan,
}

/// A per-domain standardised score with severity classification.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DomainScore {
    /// ID.
    pub id: String,
    /// Category.
    pub category: String,
    /// Description.
    pub description: String,
    /// Score.
    pub score: Option<i32>,
    /// Severity.
    pub severity: Severity,
}

/// A safety / clinical flag computed independently of the grader.
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
    pub priority: Priority,
}

/// Grading output for a dyslexia assessment.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    /// Overall severity.
    pub overall_severity: Severity,
    /// Lowest score.
    pub lowest_score: Option<i32>,
    /// Answered count.
    pub answered_count: u32,
    /// Domain scores.
    pub domain_scores: Vec<DomainScore>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
    /// Timestamp.
    pub timestamp: String,
}
