use employee_satisfaction_survey_tera_crate::engine::survey_grader::grade;
use employee_satisfaction_survey_tera_crate::engine::types::*;

/// All Likert items answered "5" (strongly agree) → composite = 100.
fn fully_excellent_response() -> AssessmentData {
    AssessmentData {
        demographics: Demographics {
            department: "engineering".to_string(),
            tenure_band: "3-to-5-years".to_string(),
            hours_band: "full-time-35-to-44".to_string(),
        },
        role_tenure: RoleTenure {
            role_level: "individual-contributor".to_string(),
            work_location: "hybrid".to_string(),
            rt1: Some(5),
            rt2: Some(5),
        },
        workload: Workload {
            wl1: Some(5), wl2: Some(5), wl3: Some(5), wl4: Some(5), wl5: Some(5),
        },
        management: Management {
            mg1: Some(5), mg2: Some(5), mg3: Some(5), mg4: Some(5), mg5: Some(5),
        },
        growth: Growth { gr1: Some(5), gr2: Some(5), gr3: Some(5), gr4: Some(5) },
        compensation: Compensation { cb1: Some(5), cb2: Some(5), cb3: Some(5), cb4: Some(5) },
        culture: Culture { cu1: Some(5), cu2: Some(5), cu3: Some(5), cu4: Some(5), cu5: Some(5) },
        environment: Environment { en1: Some(5), en2: Some(5), en3: Some(5), en4: Some(5) },
        recognition: Recognition { rc1: Some(5), rc2: Some(5), rc3: Some(5), rc4: Some(5) },
        overall: OverallExperience {
            ov1: Some(5), ov2: Some(5), ov3: Some(5), ov4: Some(5),
            recommend_score: Some(10),
            retention_intent: "definitely-stay".to_string(),
            suggestions_for_improvement: String::new(),
            other_comments: String::new(),
        },
    }
}

#[test]
fn empty_response_yields_no_composite() {
    let data = AssessmentData::default();
    let result = grade(&data);
    assert_eq!(result.composite_score, None);
    assert_eq!(result.category, "");
    assert_eq!(result.answered_count, 0);
}

#[test]
fn fully_excellent_response_yields_excellent() {
    let data = fully_excellent_response();
    let result = grade(&data);
    assert_eq!(result.composite_score, Some(100.0));
    assert_eq!(result.category, "excellent");
    assert_eq!(result.enps.classification, "promoter");
}

#[test]
fn all_ones_yields_very_poor() {
    let mut data = fully_excellent_response();
    data.workload = Workload { wl1: Some(1), wl2: Some(1), wl3: Some(1), wl4: Some(1), wl5: Some(1) };
    data.management = Management { mg1: Some(1), mg2: Some(1), mg3: Some(1), mg4: Some(1), mg5: Some(1) };
    data.growth = Growth { gr1: Some(1), gr2: Some(1), gr3: Some(1), gr4: Some(1) };
    data.compensation = Compensation { cb1: Some(1), cb2: Some(1), cb3: Some(1), cb4: Some(1) };
    data.culture = Culture { cu1: Some(1), cu2: Some(1), cu3: Some(1), cu4: Some(1), cu5: Some(1) };
    data.environment = Environment { en1: Some(1), en2: Some(1), en3: Some(1), en4: Some(1) };
    data.recognition = Recognition { rc1: Some(1), rc2: Some(1), rc3: Some(1), rc4: Some(1) };
    data.overall.ov1 = Some(1);
    data.overall.ov2 = Some(1);
    data.overall.ov3 = Some(1);
    data.overall.ov4 = Some(1);
    data.overall.recommend_score = Some(0);

    let result = grade(&data);
    assert_eq!(result.composite_score, Some(20.0));
    assert_eq!(result.category, "very-poor");
    assert_eq!(result.enps.classification, "detractor");
}

#[test]
fn out_of_range_likert_is_ignored() {
    let mut data = AssessmentData::default();
    data.workload.wl1 = Some(7); // out of 1..=5 range
    let result = grade(&data);
    assert_eq!(result.composite_score, None, "value 7 should not contribute");
    assert_eq!(result.answered_count, 0);
}

#[test]
fn mean_score_band_classification() {
    let mut data = AssessmentData::default();
    data.workload.wl1 = Some(4);
    data.workload.wl2 = Some(4);
    let result = grade(&data);
    assert_eq!(result.composite_score, Some(80.0));
    assert_eq!(result.category, "good");
}

#[test]
fn fired_rules_record_every_answered_item() {
    let data = fully_excellent_response();
    let result = grade(&data);
    // 36 Likert items × all answered.
    assert_eq!(result.fired_rules.len(), 36);
    assert!(result.fired_rules.iter().all(|r| r.raw_value == 5));
}

#[test]
fn enps_passive_classification() {
    let mut data = AssessmentData::default();
    data.overall.recommend_score = Some(7);
    let result = grade(&data);
    assert_eq!(result.enps.score, Some(7));
    assert_eq!(result.enps.classification, "passive");
}
