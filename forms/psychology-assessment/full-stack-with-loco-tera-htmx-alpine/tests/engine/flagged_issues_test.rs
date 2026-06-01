use psychology_assessment_tera_crate::engine::dass21_grader::grade;
use psychology_assessment_tera_crate::engine::flagged_issues::detect_additional_flags;
use psychology_assessment_tera_crate::engine::types::*;

fn baseline_normal_case() -> AssessmentData {
    AssessmentData {
        risk_screen: RiskScreen {
            suicidal_ideation: "no".to_string(),
            suicidal_ideation_details: String::new(),
            self_harm: "no".to_string(),
            harm_to_others: "no".to_string(),
            psychiatric_emergency_history: "no".to_string(),
            has_safety_plan: "yes".to_string(),
        },
        functional_impact: FunctionalImpact {
            work_impact: "none".to_string(),
            relationship_impact: "none".to_string(),
            daily_activities_impact: "none".to_string(),
            sleep_impact: "none".to_string(),
            notes: String::new(),
        },
        support_and_history: SupportAndHistory {
            social_support: "strong".to_string(),
            substance_use_concern: "no".to_string(),
            family_mental_health_history: "no".to_string(),
            ..SupportAndHistory::default()
        },
        ..AssessmentData::default()
    }
}

fn empty_scores() -> (SubscaleScore, SubscaleScore, SubscaleScore) {
    let normal = SubscaleScore {
        raw: 0,
        scaled: 0,
        severity: "normal".to_string(),
        answered: 7,
    };
    (normal.clone(), normal.clone(), normal)
}

#[test]
fn baseline_has_no_flags() {
    let data = baseline_normal_case();
    let (d, a, s) = empty_scores();
    let flags = detect_additional_flags(&data, &d, &a, &s);
    assert!(flags.is_empty(), "baseline should not produce flags: {flags:?}");
}

#[test]
fn suicidal_ideation_emits_urgent_flag() {
    let mut data = baseline_normal_case();
    data.risk_screen.suicidal_ideation = "yes".to_string();
    let (d, a, s) = empty_scores();
    let flags = detect_additional_flags(&data, &d, &a, &s);
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-RISK-001")
        .expect("suicidal-ideation flag");
    assert_eq!(flag.priority, "urgent");
}

#[test]
fn harm_to_others_emits_urgent_flag() {
    let mut data = baseline_normal_case();
    data.risk_screen.harm_to_others = "yes".to_string();
    let (d, a, s) = empty_scores();
    let flags = detect_additional_flags(&data, &d, &a, &s);
    assert!(flags.iter().any(|f| f.id == "FLAG-RISK-002" && f.priority == "urgent"));
}

#[test]
fn self_harm_emits_high_flag() {
    let mut data = baseline_normal_case();
    data.risk_screen.self_harm = "yes".to_string();
    let (d, a, s) = empty_scores();
    let flags = detect_additional_flags(&data, &d, &a, &s);
    assert!(flags.iter().any(|f| f.id == "FLAG-RISK-003" && f.priority == "high"));
}

#[test]
fn psychiatric_emergency_history_emits_high_flag() {
    let mut data = baseline_normal_case();
    data.risk_screen.psychiatric_emergency_history = "yes".to_string();
    let (d, a, s) = empty_scores();
    let flags = detect_additional_flags(&data, &d, &a, &s);
    assert!(flags.iter().any(|f| f.id == "FLAG-RISK-004" && f.priority == "high"));
}

#[test]
fn no_safety_plan_emits_medium_flag() {
    let mut data = baseline_normal_case();
    data.risk_screen.has_safety_plan = "no".to_string();
    let (d, a, s) = empty_scores();
    let flags = detect_additional_flags(&data, &d, &a, &s);
    assert!(flags.iter().any(|f| f.id == "FLAG-RISK-005" && f.priority == "medium"));
}

#[test]
fn extremely_severe_depression_emits_high_flag() {
    let data = baseline_normal_case();
    let d_extreme = SubscaleScore {
        raw: 21,
        scaled: 42,
        severity: "extremely-severe".to_string(),
        answered: 7,
    };
    let normal = SubscaleScore {
        raw: 0,
        scaled: 0,
        severity: "normal".to_string(),
        answered: 7,
    };
    let flags = detect_additional_flags(&data, &d_extreme, &normal, &normal);
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-DASS-D-001")
        .expect("depression-extreme flag");
    assert_eq!(flag.priority, "high");
    assert!(flag.message.contains("42"));
}

#[test]
fn severe_anxiety_emits_medium_flag() {
    let data = baseline_normal_case();
    let normal = SubscaleScore {
        raw: 0,
        scaled: 0,
        severity: "normal".to_string(),
        answered: 7,
    };
    let a_severe = SubscaleScore {
        raw: 9,
        scaled: 18,
        severity: "severe".to_string(),
        answered: 7,
    };
    let flags = detect_additional_flags(&data, &normal, &a_severe, &normal);
    assert!(flags.iter().any(|f| f.id == "FLAG-DASS-A-002" && f.priority == "medium"));
}

#[test]
fn two_severe_impacts_emits_high_func_flag() {
    let mut data = baseline_normal_case();
    data.functional_impact.work_impact = "severe".to_string();
    data.functional_impact.sleep_impact = "severe".to_string();
    let (d, a, s) = empty_scores();
    let flags = detect_additional_flags(&data, &d, &a, &s);
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-FUNC-001")
        .expect("func-001 flag");
    assert_eq!(flag.priority, "high");
}

#[test]
fn one_severe_impact_emits_medium_func_flag() {
    let mut data = baseline_normal_case();
    data.functional_impact.relationship_impact = "severe".to_string();
    let (d, a, s) = empty_scores();
    let flags = detect_additional_flags(&data, &d, &a, &s);
    assert!(flags.iter().any(|f| f.id == "FLAG-FUNC-002" && f.priority == "medium"));
}

#[test]
fn social_isolation_emits_medium_flag() {
    let mut data = baseline_normal_case();
    data.support_and_history.social_support = "isolated".to_string();
    let (d, a, s) = empty_scores();
    let flags = detect_additional_flags(&data, &d, &a, &s);
    assert!(flags.iter().any(|f| f.id == "FLAG-SUPP-001" && f.priority == "medium"));
}

#[test]
fn substance_use_concern_emits_medium_flag() {
    let mut data = baseline_normal_case();
    data.support_and_history.substance_use_concern = "yes".to_string();
    let (d, a, s) = empty_scores();
    let flags = detect_additional_flags(&data, &d, &a, &s);
    assert!(flags.iter().any(|f| f.id == "FLAG-SUPP-002" && f.priority == "medium"));
}

#[test]
fn family_history_with_severe_emits_low_flag() {
    let mut data = baseline_normal_case();
    data.support_and_history.family_mental_health_history = "yes".to_string();
    let normal = SubscaleScore {
        raw: 0,
        scaled: 0,
        severity: "normal".to_string(),
        answered: 7,
    };
    let d_severe = SubscaleScore {
        raw: 12,
        scaled: 24,
        severity: "severe".to_string(),
        answered: 7,
    };
    let flags = detect_additional_flags(&data, &d_severe, &normal, &normal);
    assert!(flags.iter().any(|f| f.id == "FLAG-SUPP-003" && f.priority == "low"));
}

#[test]
fn flags_are_sorted_by_priority_urgent_first() {
    let mut data = baseline_normal_case();
    data.risk_screen.suicidal_ideation = "yes".to_string();
    data.risk_screen.has_safety_plan = "no".to_string();
    data.support_and_history.social_support = "isolated".to_string();
    let (d, a, s) = empty_scores();
    let flags = detect_additional_flags(&data, &d, &a, &s);
    let priorities: Vec<&str> = flags.iter().map(|f| f.priority.as_str()).collect();
    let mut sorted = priorities.clone();
    sorted.sort_by_key(|p| match *p {
        "urgent" => 0,
        "high" => 1,
        "medium" => 2,
        "low" => 3,
        _ => 4,
    });
    assert_eq!(priorities, sorted);
    assert_eq!(priorities.first(), Some(&"urgent"));
}

#[test]
fn full_grade_with_risk_includes_urgent_flag() {
    let mut data = baseline_normal_case();
    data.risk_screen.suicidal_ideation = "yes".to_string();
    let result = grade(&data);
    assert!(
        result
            .additional_flags
            .iter()
            .any(|f| f.id == "FLAG-RISK-001" && f.priority == "urgent")
    );
}
