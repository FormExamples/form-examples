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
use crate::engine::types::{AssessmentData, FiredRule, RuleCategory, ValidationResult};

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
