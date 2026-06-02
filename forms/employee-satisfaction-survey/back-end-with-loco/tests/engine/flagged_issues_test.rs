use employee_satisfaction_survey_loco_crate::engine::survey_grader::grade;
use employee_satisfaction_survey_loco_crate::engine::types::*;

fn baseline_neutral() -> AssessmentData {
    AssessmentData {
        workload: Workload { wl1: Some(3), wl2: Some(3), wl3: Some(3), wl4: Some(3), wl5: Some(3) },
        management: Management { mg1: Some(3), mg2: Some(3), mg3: Some(3), mg4: Some(3), mg5: Some(3) },
        growth: Growth { gr1: Some(3), gr2: Some(3), gr3: Some(3), gr4: Some(3) },
        compensation: Compensation { cb1: Some(3), cb2: Some(3), cb3: Some(3), cb4: Some(3) },
        culture: Culture { cu1: Some(3), cu2: Some(3), cu3: Some(3), cu4: Some(3), cu5: Some(3) },
        environment: Environment { en1: Some(3), en2: Some(3), en3: Some(3), en4: Some(3) },
        recognition: Recognition { rc1: Some(3), rc2: Some(3), rc3: Some(3), rc4: Some(3) },
        overall: OverallExperience {
            ov1: Some(3), ov2: Some(3), ov3: Some(3), ov4: Some(3),
            recommend_score: Some(8),
            retention_intent: "probably-stay".to_string(),
            ..OverallExperience::default()
        },
        ..AssessmentData::default()
    }
}

#[test]
fn neutral_response_yields_no_high_flags() {
    let data = baseline_neutral();
    let grade = grade(&data);
    assert!(
        !grade.additional_flags.iter().any(|f| f.priority == "high"),
        "neutral response should have no high-priority flags: {:?}",
        grade.additional_flags
    );
}

#[test]
fn very_poor_composite_emits_high_flag() {
    let mut data = baseline_neutral();
    for d in [&mut data.workload.wl1, &mut data.workload.wl2, &mut data.workload.wl3,
              &mut data.workload.wl4, &mut data.workload.wl5,
              &mut data.management.mg1, &mut data.management.mg2,
              &mut data.management.mg3, &mut data.management.mg4, &mut data.management.mg5,
              &mut data.growth.gr1, &mut data.growth.gr2, &mut data.growth.gr3, &mut data.growth.gr4,
              &mut data.compensation.cb1, &mut data.compensation.cb2,
              &mut data.compensation.cb3, &mut data.compensation.cb4,
              &mut data.culture.cu1, &mut data.culture.cu2, &mut data.culture.cu3,
              &mut data.culture.cu4, &mut data.culture.cu5,
              &mut data.environment.en1, &mut data.environment.en2,
              &mut data.environment.en3, &mut data.environment.en4,
              &mut data.recognition.rc1, &mut data.recognition.rc2,
              &mut data.recognition.rc3, &mut data.recognition.rc4,
              &mut data.overall.ov1, &mut data.overall.ov2,
              &mut data.overall.ov3, &mut data.overall.ov4] {
        *d = Some(1);
    }
    let result = grade(&data);
    assert_eq!(result.category, "very-poor");
    assert!(result.additional_flags.iter().any(|f| f.id == "FLAG-COMPOSITE-VP" && f.priority == "high"));
}

#[test]
fn retention_leaving_emits_high_flag() {
    let mut data = baseline_neutral();
    data.overall.retention_intent = "leaving-within-6-months".to_string();
    let result = grade(&data);
    assert!(result.additional_flags.iter().any(|f| f.id == "FLAG-RETENTION-LEAVING" && f.priority == "high"));
}

#[test]
fn retention_probably_leave_emits_medium_flag() {
    let mut data = baseline_neutral();
    data.overall.retention_intent = "probably-leave-12-months".to_string();
    let result = grade(&data);
    assert!(result.additional_flags.iter().any(|f| f.id == "FLAG-RETENTION-PROBABLY-LEAVE" && f.priority == "medium"));
}

#[test]
fn enps_detractor_emits_high_flag() {
    let mut data = baseline_neutral();
    data.overall.recommend_score = Some(3);
    let result = grade(&data);
    assert!(result.additional_flags.iter().any(|f| f.id == "FLAG-ENPS-DETRACTOR" && f.priority == "high"));
}

#[test]
fn management_strong_disagree_emits_medium_flag() {
    // Keep the management domain category out of poor/very-poor so the
    // strong-disagreement flag fires instead of being suppressed.
    let mut data = baseline_neutral();
    data.management.mg1 = Some(1); // strong disagree
    data.management.mg2 = Some(5);
    data.management.mg3 = Some(5);
    data.management.mg4 = Some(5);
    data.management.mg5 = Some(5);
    let result = grade(&data);
    assert!(
        result.additional_flags.iter().any(|f| f.id == "FLAG-MGMT-STRONG-DISAGREE" && f.priority == "medium"),
        "expected FLAG-MGMT-STRONG-DISAGREE; got {:?}",
        result.additional_flags
    );
}

#[test]
fn suggestion_text_emits_low_flag() {
    let mut data = baseline_neutral();
    data.overall.suggestions_for_improvement = "Improve the coffee machine in the kitchen.".to_string();
    let result = grade(&data);
    assert!(result.additional_flags.iter().any(|f| f.id == "FLAG-TEXT-SUGGESTION" && f.priority == "low"));
}

#[test]
fn pii_in_comment_emits_low_flag() {
    let mut data = baseline_neutral();
    data.overall.other_comments = "Please contact me at jane.doe@example.com about this.".to_string();
    let result = grade(&data);
    assert!(
        result.additional_flags.iter().any(|f| f.id == "FLAG-TEXT-PII"),
        "expected PII flag; got {:?}",
        result.additional_flags
    );
}

#[test]
fn flags_sorted_high_first() {
    let mut data = baseline_neutral();
    data.overall.retention_intent = "leaving-within-6-months".to_string();
    data.overall.suggestions_for_improvement = "Better tools.".to_string();
    let result = grade(&data);
    let priorities: Vec<&str> = result.additional_flags.iter().map(|f| f.priority.as_str()).collect();
    let mut sorted = priorities.clone();
    sorted.sort_by_key(|p| match *p {
        "high" => 0, "medium" => 1, "low" => 2, _ => 3,
    });
    assert_eq!(priorities, sorted);
}
