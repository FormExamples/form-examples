use super::types::AssessmentData;

/// A domain rule projects one of the standardised score fields (mean 100,
/// SD 15) from `AssessmentData` out as a `DomainScore`.
///
/// Domain IDs follow `DYS-NNN`:
///   DYS-001 Reading fluency
///   DYS-002 Reading comprehension
///   DYS-003 Spelling accuracy
///   DYS-004 Written expression
///   DYS-005 Phonological awareness
///   DYS-006 Phonological memory
///   DYS-007 Rapid naming
///   DYS-008 Working memory
///   DYS-009 Processing speed
pub struct DyslexiaRule {
    pub id: &'static str,
    pub category: &'static str,
    pub description: &'static str,
    pub evaluate: fn(&AssessmentData) -> Option<i32>,
}

pub fn all_rules() -> Vec<DyslexiaRule> {
    vec![
        DyslexiaRule {
            id: "DYS-001",
            category: "Reading",
            description: "Reading fluency standardised score",
            evaluate: |d| d.reading_assessment.reading_fluency_score,
        },
        DyslexiaRule {
            id: "DYS-002",
            category: "Reading",
            description: "Reading comprehension standardised score",
            evaluate: |d| d.reading_assessment.reading_comprehension_score,
        },
        DyslexiaRule {
            id: "DYS-003",
            category: "Writing & Spelling",
            description: "Spelling accuracy standardised score",
            evaluate: |d| d.writing_spelling.spelling_accuracy_score,
        },
        DyslexiaRule {
            id: "DYS-004",
            category: "Writing & Spelling",
            description: "Written expression standardised score",
            evaluate: |d| d.writing_spelling.written_expression_score,
        },
        DyslexiaRule {
            id: "DYS-005",
            category: "Phonological Processing",
            description: "Phonological awareness standardised score",
            evaluate: |d| d.phonological_processing.phonological_awareness_score,
        },
        DyslexiaRule {
            id: "DYS-006",
            category: "Phonological Processing",
            description: "Phonological memory standardised score",
            evaluate: |d| d.phonological_processing.phonological_memory_score,
        },
        DyslexiaRule {
            id: "DYS-007",
            category: "Phonological Processing",
            description: "Rapid naming standardised score",
            evaluate: |d| d.phonological_processing.rapid_naming_score,
        },
        DyslexiaRule {
            id: "DYS-008",
            category: "Working Memory & Processing Speed",
            description: "Working memory standardised score",
            evaluate: |d| d.working_memory_processing_speed.working_memory_score,
        },
        DyslexiaRule {
            id: "DYS-009",
            category: "Working Memory & Processing Speed",
            description: "Processing speed standardised score",
            evaluate: |d| d.working_memory_processing_speed.processing_speed_score,
        },
    ]
}
