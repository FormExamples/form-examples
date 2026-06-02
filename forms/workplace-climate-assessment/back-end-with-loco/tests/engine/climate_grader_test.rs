use workplace_climate_assessment_loco_crate::engine::climate_grader::grade;
use workplace_climate_assessment_loco_crate::engine::types::*;

/// Build an assessment with every Likert item set to `score`.
fn uniform_case(score: i32) -> AssessmentData {
    AssessmentData {
        leadership: Leadership {
            ld1: Some(score), ld2: Some(score), ld3: Some(score),
            ld4: Some(score), ld5: Some(score),
        },
        psych_safety: PsychSafety {
            ps1: Some(score), ps2: Some(score), ps3: Some(score),
            ps4: Some(score), ps5: Some(score),
        },
        inclusion: Inclusion {
            in1: Some(score), in2: Some(score), in3: Some(score),
            in4: Some(score), in5: Some(score),
        },
        communication: Communication {
            co1: Some(score), co2: Some(score), co3: Some(score), co4: Some(score),
        },
        collaboration: Collaboration {
            cl1: Some(score), cl2: Some(score), cl3: Some(score), cl4: Some(score),
        },
        recognition: Recognition {
            re1: Some(score), re2: Some(score), re3: Some(score), re4: Some(score),
        },
        wellbeing: Wellbeing {
            we1: Some(score), we2: Some(score), we3: Some(score),
            we4: Some(score), we5: Some(score),
        },
        career: Career {
            ca1: Some(score), ca2: Some(score), ca3: Some(score), ca4: Some(score),
        },
        ..AssessmentData::default()
    }
}

#[test]
fn empty_assessment_has_no_score() {
    let data = AssessmentData::default();
    let result = grade(&data);
    assert!(result.composite_score.is_none());
    assert_eq!(result.category, "");
    assert_eq!(result.answered_count, 0);
}

#[test]
fn all_fives_is_thriving_100() {
    let data = uniform_case(5);
    let result = grade(&data);
    assert_eq!(result.composite_score, Some(100.0));
    assert_eq!(result.category, "thriving");
    assert_eq!(result.domain_scores.leadership.mean, Some(5.0));
    assert_eq!(result.domain_scores.leadership.score, Some(100.0));
    assert_eq!(result.domain_scores.leadership.category, "thriving");
}

#[test]
fn all_threes_is_developing_60() {
    let data = uniform_case(3);
    let result = grade(&data);
    assert_eq!(result.composite_score, Some(60.0));
    assert_eq!(result.category, "developing");
}

#[test]
fn all_ones_is_critical_20() {
    let data = uniform_case(1);
    let result = grade(&data);
    assert_eq!(result.composite_score, Some(20.0));
    assert_eq!(result.category, "critical");
}

#[test]
fn answered_count_matches_total() {
    let data = uniform_case(4);
    let result = grade(&data);
    // 5+5+5+4+4+4+5+4 = 36 graded items
    assert_eq!(result.answered_count, 36);
    assert_eq!(result.total_count, 36);
}

#[test]
fn overall_section_is_not_in_composite() {
    let mut data = AssessmentData::default();
    // Fill ONLY the overall section.
    data.overall.oc1 = Some(5);
    data.overall.oc2 = Some(5);
    data.overall.oc3 = Some(5);
    let result = grade(&data);
    // No graded domain answered → composite is None.
    assert!(result.composite_score.is_none());
    assert_eq!(result.answered_count, 0);
}

#[test]
fn fired_rules_include_raw_values() {
    let mut data = AssessmentData::default();
    data.leadership.ld1 = Some(4);
    let result = grade(&data);
    let ld1 = result.fired_rules.iter().find(|r| r.id == "ld1").expect("ld1 fired");
    assert_eq!(ld1.raw_value, 4);
    assert_eq!(ld1.domain, "leadership");
}
