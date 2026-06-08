//! Detection of additional flagged issues.

use super::types::{AdditionalFlag, AssessmentData};

/// Push a flag for a numeric standardised score that falls below a
/// dyslexia-band threshold.
fn push_score_flag(
    flags: &mut Vec<AdditionalFlag>,
    id: &str,
    category: &str,
    domain_name: &str,
    score: Option<i32>,
) {
    let Some(s) = score else {
        return;
    };
    if s < 55 {
        flags.push(AdditionalFlag {
            id: id.to_string(),
            category: category.to_string(),
            message: format!("{domain_name} score {s} — significantly below average (severe)."),
            priority: "high".to_string(),
        });
    } else if s < 70 {
        flags.push(AdditionalFlag {
            id: id.to_string(),
            category: category.to_string(),
            message: format!("{domain_name} score {s} — well below average (moderate)."),
            priority: "high".to_string(),
        });
    } else if s < 85 {
        flags.push(AdditionalFlag {
            id: id.to_string(),
            category: category.to_string(),
            message: format!("{domain_name} score {s} — below average (mild)."),
            priority: "medium".to_string(),
        });
    }
}

/// Detect clinician-facing flags for severe domain scores, sensory concerns,
/// developmental red flags, family history, ESL learners, emotional /
/// behavioural impact, mental-health concerns, and missing supports.
///
/// Priority ordering: urgent > high > medium > low.
pub fn detect_additional_flags(data: &AssessmentData) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    // ── Domain score alerts ───────────────────────────────────
    push_score_flag(
        &mut flags,
        "FLAG-READ-001",
        "Reading",
        "Reading fluency",
        data.reading_assessment.reading_fluency_score,
    );
    push_score_flag(
        &mut flags,
        "FLAG-READ-002",
        "Reading",
        "Reading comprehension",
        data.reading_assessment.reading_comprehension_score,
    );
    push_score_flag(
        &mut flags,
        "FLAG-WRIT-001",
        "Writing & Spelling",
        "Spelling accuracy",
        data.writing_spelling.spelling_accuracy_score,
    );
    push_score_flag(
        &mut flags,
        "FLAG-WRIT-002",
        "Writing & Spelling",
        "Written expression",
        data.writing_spelling.written_expression_score,
    );
    push_score_flag(
        &mut flags,
        "FLAG-PHON-001",
        "Phonological Processing",
        "Phonological awareness",
        data.phonological_processing.phonological_awareness_score,
    );
    push_score_flag(
        &mut flags,
        "FLAG-PHON-002",
        "Phonological Processing",
        "Phonological memory",
        data.phonological_processing.phonological_memory_score,
    );
    push_score_flag(
        &mut flags,
        "FLAG-PHON-003",
        "Phonological Processing",
        "Rapid naming",
        data.phonological_processing.rapid_naming_score,
    );
    push_score_flag(
        &mut flags,
        "FLAG-WMPS-001",
        "Working Memory & Processing Speed",
        "Working memory",
        data.working_memory_processing_speed.working_memory_score,
    );
    push_score_flag(
        &mut flags,
        "FLAG-WMPS-002",
        "Working Memory & Processing Speed",
        "Processing speed",
        data.working_memory_processing_speed.processing_speed_score,
    );

    // ── Sensory concerns: rule out before diagnosing dyslexia ─
    if data.developmental_history.hearing_problems == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-DEV-001".to_string(),
            category: "Developmental History".to_string(),
            message: "Reported hearing problems — audiology assessment recommended to exclude hearing loss as a contributor.".to_string(),
            priority: "high".to_string(),
        });
    }
    if data.developmental_history.vision_problems == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-DEV-002".to_string(),
            category: "Developmental History".to_string(),
            message: "Reported vision problems — vision assessment recommended to exclude visual contribution.".to_string(),
            priority: "high".to_string(),
        });
    }

    // ── Developmental delay markers ──────────────────────────
    if data.developmental_history.speech_delay == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-DEV-003".to_string(),
            category: "Developmental History".to_string(),
            message: "History of speech delay — common precursor to literacy difficulties."
                .to_string(),
            priority: "medium".to_string(),
        });
    }
    if data.developmental_history.language_delay == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-DEV-004".to_string(),
            category: "Developmental History".to_string(),
            message: "History of language delay — assess for developmental language disorder."
                .to_string(),
            priority: "medium".to_string(),
        });
    }

    // ── Family history ───────────────────────────────────────
    if data.developmental_history.family_history_dyslexia == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-DEV-005".to_string(),
            category: "Developmental History".to_string(),
            message: "Family history of dyslexia — significant heritability (40-60%).".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ── ESL learner: differentiate from EAL-only difficulty ──
    if data.educational_background.esl_learner == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-EDU-001".to_string(),
            category: "Educational Background".to_string(),
            message: "English as a second language — interpret literacy scores in context; consider first-language assessment.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ── Attendance / school changes ──────────────────────────
    if data.educational_background.attendance_issues == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-EDU-002".to_string(),
            category: "Educational Background".to_string(),
            message: "Attendance issues reported — may contribute to learning gaps.".to_string(),
            priority: "low".to_string(),
        });
    }
    if let Some(count) = data.educational_background.school_change_count {
        if count >= 3 {
            flags.push(AdditionalFlag {
                id: "FLAG-EDU-003".to_string(),
                category: "Educational Background".to_string(),
                message: format!(
                    "{count} school changes — disruption may affect literacy progress."
                ),
                priority: "low".to_string(),
            });
        }
    }

    // ── Reversal & decoding markers ──────────────────────────
    if data.reading_assessment.difficulty_decoding == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-READ-003".to_string(),
            category: "Reading".to_string(),
            message: "Difficulty decoding words — hallmark of dyslexia.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if data.writing_spelling.reverses_letters_or_numbers == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-WRIT-003".to_string(),
            category: "Writing & Spelling".to_string(),
            message: "Reverses letters or numbers — classic dyslexia indicator.".to_string(),
            priority: "low".to_string(),
        });
    }

    // ── Emotional / behavioural impact ───────────────────────
    if data.emotional_behavioural.low_self_esteem == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-EMOT-001".to_string(),
            category: "Emotional & Behavioural".to_string(),
            message: "Low self-esteem — common secondary effect; consider emotional support."
                .to_string(),
            priority: "medium".to_string(),
        });
    }
    if data.emotional_behavioural.anxiety_about_school == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-EMOT-002".to_string(),
            category: "Emotional & Behavioural".to_string(),
            message: "School-related anxiety — assess and support.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if data.emotional_behavioural.avoidance_behaviour == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-EMOT-003".to_string(),
            category: "Emotional & Behavioural".to_string(),
            message: "Avoidance behaviours — may indicate distress with literacy demands."
                .to_string(),
            priority: "medium".to_string(),
        });
    }
    if data.emotional_behavioural.mental_health_concerns == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-EMOT-004".to_string(),
            category: "Emotional & Behavioural".to_string(),
            message: "Mental health concerns — referral to mental-health services recommended."
                .to_string(),
            priority: "high".to_string(),
        });
    }

    // ── Existing supports ────────────────────────────────────
    if data.previous_support.previous_intervention == "no"
        && data.educational_background.previous_assessments == "no"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-SUPP-001".to_string(),
            category: "Previous Support".to_string(),
            message: "No previous intervention or assessment — this may be the first formal review."
                .to_string(),
            priority: "low".to_string(),
        });
    }

    // Sort: urgent > high > medium > low
    flags.sort_by_key(|f| match f.priority.as_str() {
        "urgent" => 0,
        "high" => 1,
        "medium" => 2,
        "low" => 3,
        _ => 4,
    });

    flags
}
