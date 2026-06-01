use dyslexia_assessment_tera_crate::engine::dyslexia_grader::grade;
use dyslexia_assessment_tera_crate::engine::dyslexia_rules::all_rules;
use dyslexia_assessment_tera_crate::engine::types::*;

/// Build an assessment with all nine domain scores at average (100).
fn average_case() -> AssessmentData {
    AssessmentData {
        reading_assessment: ReadingAssessment {
            reading_fluency_score: Some(100),
            reading_comprehension_score: Some(100),
            ..ReadingAssessment::default()
        },
        writing_spelling: WritingSpelling {
            spelling_accuracy_score: Some(100),
            written_expression_score: Some(100),
            ..WritingSpelling::default()
        },
        phonological_processing: PhonologicalProcessing {
            phonological_awareness_score: Some(100),
            phonological_memory_score: Some(100),
            rapid_naming_score: Some(100),
            ..PhonologicalProcessing::default()
        },
        working_memory_processing_speed: WorkingMemoryProcessingSpeed {
            working_memory_score: Some(100),
            processing_speed_score: Some(100),
            ..WorkingMemoryProcessingSpeed::default()
        },
        ..AssessmentData::default()
    }
}

#[test]
fn empty_assessment_is_none_severity() {
    let data = AssessmentData::default();
    let result = grade(&data);
    assert_eq!(result.overall_severity, "none");
    assert_eq!(result.answered_count, 0);
    assert!(result.lowest_score.is_none());
    assert_eq!(result.domain_scores.len(), 9);
}

#[test]
fn fully_average_case_is_none_severity() {
    let data = average_case();
    let result = grade(&data);
    assert_eq!(result.overall_severity, "none");
    assert_eq!(result.answered_count, 9);
    assert_eq!(result.lowest_score, Some(100));
}

#[test]
fn one_severe_score_drives_overall_severe() {
    let mut data = average_case();
    data.reading_assessment.reading_fluency_score = Some(50);
    let result = grade(&data);
    assert_eq!(result.overall_severity, "severe");
    assert_eq!(result.lowest_score, Some(50));
}

#[test]
fn moderate_score_drives_overall_moderate() {
    let mut data = average_case();
    data.phonological_processing.phonological_awareness_score = Some(60);
    let result = grade(&data);
    assert_eq!(result.overall_severity, "moderate");
    assert_eq!(result.lowest_score, Some(60));
}

#[test]
fn mild_score_drives_overall_mild() {
    let mut data = average_case();
    data.working_memory_processing_speed.processing_speed_score = Some(75);
    let result = grade(&data);
    assert_eq!(result.overall_severity, "mild");
    assert_eq!(result.lowest_score, Some(75));
}

#[test]
fn most_severe_band_wins() {
    let mut data = average_case();
    data.reading_assessment.reading_fluency_score = Some(75); // mild
    data.writing_spelling.spelling_accuracy_score = Some(60); // moderate
    data.phonological_processing.rapid_naming_score = Some(50); // severe
    let result = grade(&data);
    assert_eq!(result.overall_severity, "severe");
    assert_eq!(result.lowest_score, Some(50));
}

#[test]
fn rule_ids_are_unique_and_complete() {
    let rules = all_rules();
    assert_eq!(rules.len(), 9, "exactly 9 dyslexia rules expected");
    let mut ids: Vec<&str> = rules.iter().map(|r| r.id).collect();
    ids.sort();
    let len_before = ids.len();
    ids.dedup();
    assert_eq!(ids.len(), len_before, "rule IDs must be unique");
    for expected in [
        "DYS-001", "DYS-002", "DYS-003", "DYS-004", "DYS-005", "DYS-006", "DYS-007", "DYS-008",
        "DYS-009",
    ] {
        assert!(ids.contains(&expected), "missing rule ID {expected}");
    }
}

#[test]
fn domain_scores_include_all_rules() {
    let data = AssessmentData::default();
    let result = grade(&data);
    assert_eq!(result.domain_scores.len(), 9);
    for (i, ds) in result.domain_scores.iter().enumerate() {
        assert!(ds.id.starts_with("DYS-"), "domain {i} has bad id");
        assert_eq!(ds.severity, "none");
        assert!(ds.score.is_none());
    }
}
