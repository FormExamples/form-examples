//! UK NHS England FP92A eligibility validator.
//!
//! Pure function: evaluates the application against the closed list of 10
//! qualifying conditions and returns a `GradeResult` with outcome, fired
//! rules, advisory flags, and the certificate validity window.

use crate::engine::flagged_issues::detect_additional_flags;
use crate::engine::fp92a_rules::fp92a_rules;
use crate::engine::types::{ApplicationData, FiredRule, GradeResult, RuleCategory};

pub fn validate_fp92a(data: &ApplicationData) -> GradeResult {
    let mut fired: Vec<FiredRule> = Vec::new();

    for rule in fp92a_rules() {
        if (rule.evaluate)(data) {
            fired.push(FiredRule {
                id: rule.id.to_string(),
                category: rule.category,
                priority: rule.priority,
                description: rule.description.to_string(),
                message: rule.message.to_string(),
                contributing_condition_code: rule.contributing_condition_code.to_string(),
            });
        }
    }

    fired.sort_by_key(|r| r.priority.order());

    let additional_flags = detect_additional_flags(data);

    // Eligibility codes derived from the eligible-condition rules that fired.
    let eligible_condition_codes: Vec<String> = fired
        .iter()
        .filter(|r| matches!(r.category, RuleCategory::EligibleCondition))
        .map(|r| r.contributing_condition_code.clone())
        .collect();

    let has_disqualifying = fired
        .iter()
        .any(|r| matches!(r.category, RuleCategory::Disqualifying));

    let redirect_rule = fired
        .iter()
        .find(|r| matches!(r.category, RuleCategory::Redirect));

    let redirect_to = match redirect_rule {
        Some(r) if r.id == "FP92A-RD-PREGNANCY" => "FW8".to_string(),
        Some(r) if r.id == "FP92A-RD-AGE-EXEMPTION" => "age-exemption".to_string(),
        _ => "".to_string(),
    };

    // Awaiting-histology cancer or disability without home-care attestation
    // → requires-clarification.
    let cancer_pending_histology = data
        .conditions
        .iter()
        .any(|c| c.selected == "yes" && c.code == "cancer-or-effects" && c.histology_confirmed == "pending");
    let disability_without_attestation = data.conditions.iter().any(|c| {
        c.selected == "yes"
            && c.code == "continuing-physical-disability"
            && c.cannot_leave_home_unaided == ""
    });

    let outcome = if !redirect_to.is_empty() {
        "ineligible".to_string()
    } else if cancer_pending_histology || disability_without_attestation {
        "requires-clarification".to_string()
    } else if !eligible_condition_codes.is_empty() && !has_disqualifying {
        "eligible".to_string()
    } else if !eligible_condition_codes.is_empty() && has_disqualifying {
        // At least one valid condition plus a disqualifying flag — usually
        // still ineligible until the disqualifier is resolved.
        "requires-clarification".to_string()
    } else {
        "ineligible".to_string()
    };

    let result_category = match outcome.as_str() {
        "eligible" => "Eligible for FP92A medical exemption certificate.".to_string(),
        "requires-clarification" => "Eligibility requires clarification.".to_string(),
        _ => "Not eligible for FP92A medical exemption certificate.".to_string(),
    };

    let result_score = if outcome == "eligible" { 1.0_f32 } else { 0.0_f32 };

    let result_notes = if eligible_condition_codes.is_empty() {
        "No qualifying condition met the FP92A criteria.".to_string()
    } else {
        format!(
            "Qualifying conditions met: {}.",
            eligible_condition_codes.join(", ")
        )
    };

    // 5-year validity window starting on completed_date / today.
    let validity_years: u8 = 5;
    let (valid_from, valid_until) = compute_validity(data, validity_years);

    GradeResult {
        outcome,
        redirect_to,
        result_category,
        result_score,
        result_notes,
        eligible_condition_codes,
        fired_rules: fired,
        additional_flags,
        valid_from,
        valid_until,
        validity_years,
        timestamp: chrono::Utc::now().to_rfc3339(),
    }
}

fn compute_validity(data: &ApplicationData, years: u8) -> (String, String) {
    use chrono::Datelike;
    let start = chrono::NaiveDate::parse_from_str(
        data.practitioner.completed_date.trim(),
        "%Y-%m-%d",
    )
    .unwrap_or_else(|_| chrono::Utc::now().date_naive());

    let end = chrono::NaiveDate::from_ymd_opt(
        start.year() + years as i32,
        start.month(),
        start.day(),
    )
    .unwrap_or(start);

    (start.to_string(), end.to_string())
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::engine::types::*;

    fn empty() -> ApplicationData {
        ApplicationData::default()
    }

    fn fully_populated_eligible() -> ApplicationData {
        let mut d = empty();
        d.patient.surname = "Smith".into();
        d.patient.forenames = "Jane".into();
        d.patient.birth_date = "1980-04-01".into();
        d.patient.united_kingdom_nhs_number = "9434765919".into();
        d.patient.postal_address_as_full_text = "1 High St, Newcastle".into();
        d.patient.pregnancy_status = "not-pregnant".into();
        d.practitioner.name = "Dr Alex Doctor".into();
        d.practitioner.registration_body = "GMC".into();
        d.practitioner.registration_number = "1234567".into();
        d.practitioner.practice_name = "High St Surgery".into();
        d.practitioner.completed_date = "2026-05-18".into();
        d.declaration.signature_present = "yes".into();
        d.declaration.access_to_medical_records = "yes".into();
        d.conditions.push(QualifyingCondition {
            code: "epilepsy-on-anticonvulsant".into(),
            selected: "yes".into(),
            continuous_anticonvulsant_therapy: "yes".into(),
            anticonvulsant: "Levetiracetam 500mg BD".into(),
            ..Default::default()
        });
        d
    }

    #[test]
    fn empty_application_is_ineligible() {
        let r = validate_fp92a(&empty());
        assert_eq!(r.outcome, "ineligible");
        assert!(r.fired_rules.iter().any(|r| r.id == "FP92A-CP-NO-CONDITION-SELECTED"));
    }

    #[test]
    fn pregnancy_redirects_to_fw8() {
        let mut d = fully_populated_eligible();
        d.patient.pregnancy_status = "pregnant".into();
        let r = validate_fp92a(&d);
        assert_eq!(r.redirect_to, "FW8");
        assert_eq!(r.outcome, "ineligible");
    }

    #[test]
    fn diet_only_diabetes_is_disqualifying() {
        let mut d = fully_populated_eligible();
        d.conditions.clear();
        d.conditions.push(QualifyingCondition {
            code: "diabetes-mellitus-not-diet-only".into(),
            selected: "yes".into(),
            diabetes_treatment_mode: "diet-only".into(),
            ..Default::default()
        });
        let r = validate_fp92a(&d);
        assert!(r
            .fired_rules
            .iter()
            .any(|x| x.id == "FP92A-DQ-DIET-ONLY-DIABETES"));
        assert_ne!(r.outcome, "eligible");
    }

    #[test]
    fn eligible_when_epilepsy_attested_and_all_fields_complete() {
        let d = fully_populated_eligible();
        let r = validate_fp92a(&d);
        assert_eq!(r.outcome, "eligible", "fired: {:?}", r.fired_rules);
        assert!(r
            .eligible_condition_codes
            .contains(&"epilepsy-on-anticonvulsant".to_string()));
    }
}
