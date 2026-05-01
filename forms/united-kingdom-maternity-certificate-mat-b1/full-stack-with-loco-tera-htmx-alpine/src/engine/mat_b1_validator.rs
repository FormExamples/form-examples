//! UK MAT B1 completeness validator.
//!
//! Pure function: validates the MAT B1 form data. Each rule from
//! `mat_b1_rules` is evaluated; rules that fire are recorded as `FiredRule`s.
//!
//! Branching:
//!   - certificateType = ''  → Part A / Part B detail rules are skipped
//!     (MATB1-CERT-001 covers the missing selection).
//!   - issuerType = ''       → doctor / midwife rules are skipped
//!     (MATB1-ISS-001 covers the missing selection).

use crate::engine::flagged_issues::detect_additional_flags;
use crate::engine::mat_b1_rules::{mat_b1_rules, weeks_between};
use crate::engine::types::{
    AssessmentData, FiredRule, RuleCategory, ValidationResult,
};

pub fn validate_mat_b1(data: &AssessmentData) -> ValidationResult {
    let mut fired: Vec<FiredRule> = Vec::new();

    for rule in mat_b1_rules() {
        // Skip Part A / Part B rules when no certificate type is selected.
        if data.certificate_type.is_empty()
            && (rule.id.starts_with("MATB1-A-") || rule.id.starts_with("MATB1-B-"))
        {
            continue;
        }
        // Skip doctor / midwife rules when no issuer type is selected.
        if data.issuer.issuer_type.is_empty()
            && (rule.id.starts_with("MATB1-DR-") || rule.id.starts_with("MATB1-MW-"))
        {
            continue;
        }

        if (rule.evaluate)(data) {
            fired.push(FiredRule {
                id: rule.id.to_string(),
                category: rule.category,
                priority: rule.priority,
                description: rule.description.to_string(),
                message: rule.message.to_string(),
            });
        }
    }

    fired.sort_by_key(|r| r.priority.order());

    let additional_flags = detect_additional_flags(data);

    let complete = !fired
        .iter()
        .any(|r| matches!(r.category, RuleCategory::Completeness));

    let weeks_before_ewc = if data.certificate_type == "pre" {
        weeks_between(
            &data.pre_confinement.examination_date,
            &data.pre_confinement.expected_date_of_confinement,
        )
    } else {
        None
    };

    ValidationResult {
        complete,
        certificate_type: data.certificate_type.clone(),
        issuer_type: data.issuer.issuer_type.clone(),
        fired_rules: fired,
        additional_flags,
        weeks_before_ewc,
        timestamp: chrono::Utc::now().to_rfc3339(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::engine::types::*;

    fn empty() -> AssessmentData {
        AssessmentData::default()
    }

    /// Helper: a fully-populated valid pre-confinement / midwife form (used as
    /// a baseline that should be `complete = true`).
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
        // certificateType = 'pre' → Part B rules must NOT fire even though
        // post_confinement.* fields are blank.
        let mut d = valid_pre_midwife();
        d.post_confinement.actual_date_of_birth = "".into();
        d.post_confinement.expected_date_of_confinement = "".into();
        let r = validate_mat_b1(&d);
        assert!(!r.fired_rules.iter().any(|r| r.id == "MATB1-B-001"));
        assert!(!r.fired_rules.iter().any(|r| r.id == "MATB1-B-002"));
        // Pre-confinement / midwife branch fully populated → complete.
        assert!(r.complete, "fired: {:?}", r.fired_rules);
        // Switching to 'post' with empty Part B fields → MATB1-B-001 fires.
        d.certificate_type = "post".into();
        let r2 = validate_mat_b1(&d);
        assert!(r2.fired_rules.iter().any(|r| r.id == "MATB1-B-001"));
        assert!(r2.fired_rules.iter().any(|r| r.id == "MATB1-B-002"));
        // And Part A timing/consistency rules now must NOT apply.
        assert!(!r2.fired_rules.iter().any(|r| r.id == "MATB1-A-001"));
    }

    #[test]
    fn issuer_type_branch_selects_doctor_or_midwife_rules() {
        // Empty issuerType → only MATB1-ISS-001 fires for issuer; no doctor
        // or midwife rules.
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

        // Set issuerType = 'doctor' with no doctor data → DR rules fire.
        d.issuer.issuer_type = "doctor".into();
        let r2 = validate_mat_b1(&d);
        assert!(r2.fired_rules.iter().any(|r| r.id == "MATB1-DR-001"));
        assert!(r2.fired_rules.iter().any(|r| r.id == "MATB1-DR-004"));
        // Midwife rules must still be skipped.
        assert!(!r2.fired_rules.iter().any(|r| r.id.starts_with("MATB1-MW-")));

        // Switch to midwife with no midwife data → MW rules fire.
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
        // Expiry on 2024-12-31, issued 2025-01-01 → expired before issue.
        d.issuer.midwife.nmc_expiry_date = "2024-12-31".into();
        d.issuer.issue_date = "2025-01-01".into();
        let r = validate_mat_b1(&d);
        // MATB1-MW-004 must fire.
        assert!(
            r.fired_rules.iter().any(|f| f.id == "MATB1-MW-004"),
            "fired: {:?}",
            r.fired_rules
        );
        // Additional flag FLAG-NMC-EXPIRY-HIGH-001 must also be raised.
        assert!(r
            .additional_flags
            .iter()
            .any(|f| f.id == "FLAG-NMC-EXPIRY-HIGH-001" && f.priority == RulePriority::High));
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
}
