use workplace_climate_assessment_loco_crate::engine::climate_grader::grade;
use workplace_climate_assessment_loco_crate::engine::types::*;

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
fn thriving_case_has_no_flags() {
    let data = uniform_case(5);
    let result = grade(&data);
    assert!(
        result.additional_flags.is_empty(),
        "thriving case should not flag: {:?}",
        result.additional_flags
    );
}

#[test]
fn critical_composite_emits_high_priority_flag() {
    let data = uniform_case(1);
    let result = grade(&data);
    assert!(
        result
            .additional_flags
            .iter()
            .any(|f| f.id == "FLAG-COMPOSITE-CRITICAL" && f.priority == "high")
    );
}

#[test]
fn strained_composite_emits_medium_priority_flag() {
    let data = uniform_case(2);
    let result = grade(&data);
    assert!(
        result
            .additional_flags
            .iter()
            .any(|f| f.id == "FLAG-COMPOSITE-STRAINED" && f.priority == "medium")
    );
}

#[test]
fn psych_safety_strongly_disagree_emits_high_priority_flag() {
    let mut data = uniform_case(4);
    data.psych_safety.ps1 = Some(1);
    let result = grade(&data);
    assert!(
        result
            .additional_flags
            .iter()
            .any(|f| f.id == "FLAG-PSYCH-SAFETY-STRONG-DISAGREE" && f.priority == "high")
    );
}

#[test]
fn inclusion_strongly_disagree_emits_high_priority_flag() {
    let mut data = uniform_case(4);
    data.inclusion.in1 = Some(1);
    let result = grade(&data);
    assert!(
        result
            .additional_flags
            .iter()
            .any(|f| f.id == "FLAG-INCLUSION-STRONG-DISAGREE" && f.priority == "high")
    );
}

#[test]
fn would_not_recommend_emits_medium_retention_flag() {
    let mut data = uniform_case(4);
    data.overall.recommend_as_place_to_work = "definitely-not".to_string();
    let result = grade(&data);
    assert!(
        result
            .additional_flags
            .iter()
            .any(|f| f.id == "FLAG-RECOMMEND-RISK" && f.priority == "medium")
    );
}

#[test]
fn suggestion_text_emits_low_priority_flag() {
    let mut data = uniform_case(4);
    data.overall.biggest_improvement = "More cross-team standups please.".to_string();
    let result = grade(&data);
    assert!(
        result
            .additional_flags
            .iter()
            .any(|f| f.id == "FLAG-TEXT-SUGGESTION" && f.priority == "low")
    );
}

#[test]
fn flags_are_sorted_high_medium_low() {
    let mut data = uniform_case(1); // composite critical → high
    data.overall.recommend_as_place_to_work = "probably-not".to_string(); // medium
    data.overall.biggest_improvement = "Better tooling.".to_string(); // low (suggestion)
    let result = grade(&data);
    let priorities: Vec<&str> = result
        .additional_flags
        .iter()
        .map(|f| f.priority.as_str())
        .collect();
    let mut sorted = priorities.clone();
    sorted.sort_by_key(|p| match *p {
        "high" => 0,
        "medium" => 1,
        "low" => 2,
        _ => 3,
    });
    assert_eq!(priorities, sorted);
}
