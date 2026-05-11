// Mirrors the Vitest suite in
// `front-end-form-with-svelte/src/lib/engine/composite-grader.test.ts`.

use issue_tracker::{
    grade_issue, FailureCondition, FlagCategory, IssueTrackerAssessment, RawScores,
};

fn blank(scores: RawScores) -> IssueTrackerAssessment {
    IssueTrackerAssessment {
        reporter: Default::default(),
        scores,
    }
}

#[test]
fn empty_assessment_grades_low_with_only_composite_rule() {
    let r = grade_issue(&blank(RawScores::default()));
    assert_eq!(r.composite_priority.as_str(), "low");
    assert_eq!(r.fired_rules.len(), 1);
    assert_eq!(r.fired_rules[0].instrument as u8, /* Composite */ 7);
    assert!(r.additional_flags.is_empty());
}

#[test]
fn priority_rank_1_drives_critical() {
    let r = grade_issue(&blank(RawScores {
        score_by_priority_rank: Some(1),
        ..Default::default()
    }));
    assert_eq!(r.composite_priority.as_str(), "critical");
}

#[test]
fn severity_5_drives_critical() {
    let r = grade_issue(&blank(RawScores {
        score_by_severity_of_impact: Some(5),
        ..Default::default()
    }));
    assert_eq!(r.composite_priority.as_str(), "critical");
}

#[test]
fn magnitude_10_drives_critical() {
    let r = grade_issue(&blank(RawScores {
        score_by_magnitude_of_damage: Some(10),
        ..Default::default()
    }));
    assert_eq!(r.composite_priority.as_str(), "critical");
}

#[test]
fn harm_4_drives_critical() {
    let r = grade_issue(&blank(RawScores {
        score_by_harm_grade: Some(4),
        ..Default::default()
    }));
    assert_eq!(r.composite_priority.as_str(), "critical");
}

#[test]
fn failure_a_drives_critical() {
    let r = grade_issue(&blank(RawScores {
        score_by_failure_condition: FailureCondition::A,
        ..Default::default()
    }));
    assert_eq!(r.composite_priority.as_str(), "critical");
}

#[test]
fn moscow_1_drives_high_not_critical() {
    let r = grade_issue(&blank(RawScores {
        score_by_moscow_requirement: Some(1),
        ..Default::default()
    }));
    assert_eq!(r.composite_priority.as_str(), "high");
}

#[test]
fn frequency_100_drives_critical() {
    let r = grade_issue(&blank(RawScores {
        score_by_frequency_percent: Some(100.0),
        ..Default::default()
    }));
    assert_eq!(r.composite_priority.as_str(), "critical");
}

#[test]
fn low_signals_stay_low() {
    let r = grade_issue(&blank(RawScores {
        score_by_failure_condition: FailureCondition::D,
        score_by_severity_of_impact: Some(1),
        score_by_frequency_percent: Some(1.0),
        ..Default::default()
    }));
    assert_eq!(r.composite_priority.as_str(), "low");
}

#[test]
fn harm_4_fires_harm_fatal_flag() {
    let r = grade_issue(&blank(RawScores {
        score_by_harm_grade: Some(4),
        ..Default::default()
    }));
    assert!(r
        .additional_flags
        .iter()
        .any(|f| f.category == FlagCategory::HarmFatal));
}

#[test]
fn failure_a_fires_failure_catastrophic_flag() {
    let r = grade_issue(&blank(RawScores {
        score_by_failure_condition: FailureCondition::A,
        ..Default::default()
    }));
    assert!(r
        .additional_flags
        .iter()
        .any(|f| f.category == FlagCategory::FailureCatastrophic));
}

#[test]
fn severity_5_fires_severity_catastrophic_flag() {
    let r = grade_issue(&blank(RawScores {
        score_by_severity_of_impact: Some(5),
        ..Default::default()
    }));
    assert!(r
        .additional_flags
        .iter()
        .any(|f| f.category == FlagCategory::SeverityCatastrophic));
}

#[test]
fn magnitude_10_fires_total_destruction_flag() {
    let r = grade_issue(&blank(RawScores {
        score_by_magnitude_of_damage: Some(10),
        ..Default::default()
    }));
    assert!(r
        .additional_flags
        .iter()
        .any(|f| f.category == FlagCategory::MagnitudeTotalDestruction));
}

#[test]
fn frequency_99_fires_universal_flag() {
    let r = grade_issue(&blank(RawScores {
        score_by_frequency_percent: Some(99.0),
        ..Default::default()
    }));
    assert!(r
        .additional_flags
        .iter()
        .any(|f| f.category == FlagCategory::FrequencyUniversal));
}

#[test]
fn clinical_safety_plus_harm_2_fires_regulatory_flag() {
    let mut data = blank(RawScores {
        score_by_harm_grade: Some(2),
        ..Default::default()
    });
    data.reporter.issue_category = "clinical-safety".into();
    let r = grade_issue(&data);
    assert!(r
        .additional_flags
        .iter()
        .any(|f| f.category == FlagCategory::Regulatory));
}

#[test]
fn moscow_1_fires_requirement_mandatory_flag() {
    let r = grade_issue(&blank(RawScores {
        score_by_moscow_requirement: Some(1),
        ..Default::default()
    }));
    assert!(r
        .additional_flags
        .iter()
        .any(|f| f.category == FlagCategory::RequirementMandatory));
}

#[test]
fn fired_rules_count_matches_seven_dimensions_plus_composite() {
    let r = grade_issue(&blank(RawScores {
        score_by_priority_rank: Some(2),
        score_by_severity_of_impact: Some(3),
        score_by_magnitude_of_damage: Some(5),
        score_by_harm_grade: Some(1),
        score_by_failure_condition: FailureCondition::C,
        score_by_moscow_requirement: Some(2),
        score_by_frequency_percent: Some(25.0),
    }));
    assert_eq!(r.fired_rules.len(), 8);
}
