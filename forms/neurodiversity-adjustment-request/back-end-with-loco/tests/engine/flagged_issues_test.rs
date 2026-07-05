//! Flag-detection tests (via the full grader, which threads the eligibility and
//! impact bands into flag detection).

use neurodiversity_adjustment_request_loco_crate::engine::grader::calculate_grade;

use super::fixtures::{
    create_absence_risk_request, create_covered_request, create_minimal_request,
};

#[test]
fn flags_disability_duty_on_a_covered_request() {
    let flags = calculate_grade(&create_covered_request()).flags;
    assert!(flags.iter().any(|f| f.flag_id == "F-DISABILITY-DUTY-001"));
    assert!(flags
        .iter()
        .any(|f| f.category == "disability-duty-engaged" && f.priority == "high"));
}

#[test]
fn flags_burnout_and_occupational_health_on_absence_risk() {
    let flags = calculate_grade(&create_absence_risk_request()).flags;
    assert!(flags.iter().any(|f| f.flag_id == "F-BURNOUT-RISK-001"));
    assert!(flags.iter().any(|f| f.flag_id == "F-OCC-HEALTH-001"));
}

#[test]
fn flags_missing_sections_on_a_minimal_request() {
    let flags = calculate_grade(&create_minimal_request()).flags;
    assert!(flags.iter().any(|f| f.flag_id == "F-NO-CONSENT-001"));
    assert!(flags.iter().any(|f| f.flag_id == "F-MISSING-ADJUSTMENTS-001"));
    assert!(flags.iter().any(|f| f.flag_id == "F-MISSING-DIFFICULTIES-001"));
}

#[test]
fn flags_access_to_work_when_equipment_requested() {
    let mut r = create_covered_request();
    r.adjustment_equipment_technology = true;
    r.access_to_work_involved = false;
    let g = calculate_grade(&r);
    assert!(g.flags.iter().any(|f| f.flag_id == "F-ACCESS-TO-WORK-001"));
    assert_eq!(g.recommendation, "signpost-access-to-work");
}

#[test]
fn sorts_flags_high_before_medium() {
    let flags = calculate_grade(&create_absence_risk_request()).flags;
    let rank = |p: &str| match p {
        "high" => 0,
        "medium" => 1,
        _ => 2,
    };
    let ranks: Vec<i32> = flags.iter().map(|f| rank(&f.priority)).collect();
    let mut sorted = ranks.clone();
    sorted.sort();
    assert_eq!(ranks, sorted, "flags must be ordered high -> medium -> low");
}
