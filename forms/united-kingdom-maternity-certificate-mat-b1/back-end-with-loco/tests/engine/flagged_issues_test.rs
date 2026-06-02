use united_kingdom_maternity_certificate_mat_b1_loco_crate::engine::flagged_issues::detect_additional_flags;
use united_kingdom_maternity_certificate_mat_b1_loco_crate::engine::types::*;

#[test]
fn empty_assessment_yields_urgent_certificate_flag() {
    let flags = detect_additional_flags(&AssessmentData::default());
    assert!(flags.iter().any(|f| f.id == "FLAG-CERT-NUMBER-URGENT-001"
        && f.priority == RulePriority::Urgent));
}

#[test]
fn issued_more_than_20_weeks_before_ewc_high_flag() {
    let mut d = AssessmentData::default();
    d.certificate_type = "pre".into();
    d.pre_confinement.examination_date = "2025-01-01".into();
    // 30 weeks before EWC
    d.pre_confinement.expected_date_of_confinement = "2025-07-30".into();
    d.issuer.certificate_number = "MB1-1".into();
    let flags = detect_additional_flags(&d);
    assert!(flags.iter().any(|f| f.id == "FLAG-EWC-WINDOW-HIGH-001"
        && f.priority == RulePriority::High));
}

#[test]
fn both_parts_started_medium_flag() {
    let mut d = AssessmentData::default();
    d.pre_confinement.expected_date_of_confinement = "2025-04-01".into();
    d.post_confinement.actual_date_of_birth = "2025-04-02".into();
    d.issuer.certificate_number = "MB1-1".into();
    let flags = detect_additional_flags(&d);
    assert!(flags.iter().any(|f| f.id == "FLAG-PARTS-CONFLICT-MED-001"
        && f.priority == RulePriority::Medium));
}

#[test]
fn duplicate_without_marker_medium_flag() {
    let mut d = AssessmentData::default();
    d.issuer.certificate_number = "MB1-1".into();
    d.issuer.is_duplicate = "yes".into();
    d.issuer.duplicate_marker_applied = "no".into();
    let flags = detect_additional_flags(&d);
    assert!(flags.iter().any(|f| f.id == "FLAG-DUPLICATE-MED-001"
        && f.priority == RulePriority::Medium));
}
