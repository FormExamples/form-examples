use united_kingdom_maternity_certificate_mat_b1_loco_crate::engine::mat_b1_validator::validate_mat_b1;
use united_kingdom_maternity_certificate_mat_b1_loco_crate::engine::types::*;

fn empty() -> AssessmentData {
    AssessmentData::default()
}

/// Helper: a fully-populated valid pre-confinement / midwife form.
fn valid_pre_midwife() -> AssessmentData {
    let mut d = empty();
    d.patient_identification.patient_name = "Jane Smith".into();
    d.certificate_type = "pre".into();
    d.pre_confinement.examination_date = "2025-01-01".into();
    d.pre_confinement.expected_date_of_confinement = "2025-04-01".into();
    d.issuer.issuer_type = "midwife".into();
    d.issuer.midwife.midwife_name = "Mary Midwife".into();
    d.issuer.midwife.nmc_pin = "12A3456E".into();
    d.issuer.midwife.nmc_expiry_date = "2026-01-01".into();
    d.issuer.certificate_number = "MB1-000123".into();
    d.issuer.issue_date = "2025-01-01".into();
    d.issuer.completed_in_ink = "yes".into();
    d
}

#[test]
fn certificate_type_branch_skips_inactive_part_rules() {
    let mut d = valid_pre_midwife();
    d.post_confinement.actual_date_of_birth = "".into();
    d.post_confinement.expected_date_of_confinement = "".into();
    let r = validate_mat_b1(&d);
    assert!(!r.fired_rules.iter().any(|r| r.id == "MATB1-B-001"));
    assert!(!r.fired_rules.iter().any(|r| r.id == "MATB1-B-002"));
    assert!(r.complete, "fired: {:?}", r.fired_rules);

    // Switching to 'post' with empty Part B fields → MATB1-B-001 fires.
    d.certificate_type = "post".into();
    let r2 = validate_mat_b1(&d);
    assert!(r2.fired_rules.iter().any(|r| r.id == "MATB1-B-001"));
    assert!(r2.fired_rules.iter().any(|r| r.id == "MATB1-B-002"));
    assert!(!r2.fired_rules.iter().any(|r| r.id == "MATB1-A-001"));
}

#[test]
fn issuer_type_branch_selects_doctor_or_midwife_rules() {
    let mut d = empty();
    d.patient_identification.patient_name = "Patient".into();
    d.certificate_type = "pre".into();
    d.pre_confinement.examination_date = "2025-01-01".into();
    d.pre_confinement.expected_date_of_confinement = "2025-04-01".into();
    d.issuer.certificate_number = "MB1-1".into();
    d.issuer.issue_date = "2025-01-01".into();
    d.issuer.completed_in_ink = "yes".into();
    let r = validate_mat_b1(&d);
    assert!(r.fired_rules.iter().any(|r| r.id == "MATB1-ISS-001"));
    assert!(!r.fired_rules.iter().any(|r| r.id.starts_with("MATB1-DR-")));
    assert!(!r.fired_rules.iter().any(|r| r.id.starts_with("MATB1-MW-")));

    d.issuer.issuer_type = "doctor".into();
    let r2 = validate_mat_b1(&d);
    assert!(r2.fired_rules.iter().any(|r| r.id == "MATB1-DR-001"));
    assert!(r2.fired_rules.iter().any(|r| r.id == "MATB1-DR-004"));
    assert!(!r2.fired_rules.iter().any(|r| r.id.starts_with("MATB1-MW-")));

    d.issuer.issuer_type = "midwife".into();
    let r3 = validate_mat_b1(&d);
    assert!(r3.fired_rules.iter().any(|r| r.id == "MATB1-MW-001"));
    assert!(r3.fired_rules.iter().any(|r| r.id == "MATB1-MW-002"));
    assert!(r3.fired_rules.iter().any(|r| r.id == "MATB1-MW-003"));
    assert!(!r3.fired_rules.iter().any(|r| r.id.starts_with("MATB1-DR-")));
}

#[test]
fn expired_nmc_fires_rule_and_flag() {
    let mut d = valid_pre_midwife();
    d.issuer.midwife.nmc_expiry_date = "2024-12-31".into();
    d.issuer.issue_date = "2025-01-01".into();
    let r = validate_mat_b1(&d);
    assert!(
        r.fired_rules.iter().any(|f| f.id == "MATB1-MW-004"),
        "fired: {:?}",
        r.fired_rules
    );
    assert!(r.additional_flags.iter().any(|f| f.id
        == "FLAG-NMC-EXPIRY-HIGH-001"
        && f.priority == RulePriority::High));
}

#[test]
fn missing_certificate_number_is_urgent_flag() {
    let mut d = valid_pre_midwife();
    d.issuer.certificate_number = "".into();
    let r = validate_mat_b1(&d);
    assert!(r.fired_rules.iter().any(|f| f.id == "MATB1-DOC-001"
        && f.priority == RulePriority::Urgent));
    assert!(r.additional_flags.iter().any(|f| f.id
        == "FLAG-CERT-NUMBER-URGENT-001"
        && f.priority == RulePriority::Urgent));
}

#[test]
fn empty_assessment_is_incomplete() {
    let r = validate_mat_b1(&empty());
    assert!(!r.complete);
    assert!(r.fired_rules.iter().any(|f| f.id == "MATB1-PT-001"));
    assert!(r.fired_rules.iter().any(|f| f.id == "MATB1-CERT-001"));
    assert!(r.fired_rules.iter().any(|f| f.id == "MATB1-ISS-001"));
}
