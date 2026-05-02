//! WHO Emergency First Aid Form completeness validator.
//!
//! Pure function: validates the WHO emergency first aid form data for
//! completeness. Each rule in `cfar_rules` is checked first against `applies()`
//! to honour conditional logic (e.g. tourniquet → time required, "Other"
//! precaution → details required). When a rule applies, it must also be
//! `is_satisfied()` for the form to be complete; otherwise the rule is
//! recorded as a missing field.

use std::collections::BTreeMap;

use crate::engine::cfar_rules::{cfar_rules, section_label};
use crate::engine::types::{AssessmentData, FiredRule, SectionCompleteness, ValidationResult};

pub fn validate_cfar(data: &AssessmentData) -> ValidationResult {
    let mut section_map: BTreeMap<String, SectionCompleteness> = BTreeMap::new();
    let mut missing: Vec<FiredRule> = Vec::new();
    let mut total_required: u32 = 0;
    let mut total_satisfied: u32 = 0;

    // Preserve insertion order of first occurrence per section.
    let mut section_order: Vec<String> = Vec::new();

    for rule in cfar_rules() {
        if !(rule.applies)(data) {
            continue;
        }
        total_required += 1;
        let satisfied = (rule.is_satisfied)(data);

        let key = rule.section.to_string();
        if !section_map.contains_key(&key) {
            section_order.push(key.clone());
            section_map.insert(
                key.clone(),
                SectionCompleteness {
                    section: rule.section.to_string(),
                    section_label: section_label(rule.section).to_string(),
                    required: 0,
                    satisfied: 0,
                    missing: Vec::new(),
                },
            );
        }
        let bucket = section_map.get_mut(&key).unwrap();
        bucket.required += 1;

        if satisfied {
            total_satisfied += 1;
            bucket.satisfied += 1;
        } else {
            let fired = FiredRule {
                id: rule.id.to_string(),
                section: rule.section.to_string(),
                description: rule.description.to_string(),
            };
            missing.push(fired.clone());
            bucket.missing.push(fired);
        }
    }

    let sections: Vec<SectionCompleteness> = section_order
        .into_iter()
        .filter_map(|k| section_map.remove(&k))
        .collect();

    ValidationResult {
        complete: missing.is_empty(),
        total_required,
        total_satisfied,
        sections,
        missing,
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::engine::flagged_issues::detect_flagged_issues;
    use crate::engine::types::*;

    fn empty() -> AssessmentData {
        AssessmentData::default()
    }

    #[test]
    fn empty_form_is_incomplete_and_skips_conditional_rules() {
        let data = empty();
        let r = validate_cfar(&data);
        assert!(!r.complete);
        // Empty form: 0 satisfied, total_required equals number of unconditional
        // rules (every rule with `applies = |_| true`).
        assert!(r.total_required > 0);
        assert_eq!(r.total_satisfied, 0);
        assert_eq!(r.missing.len() as u32, r.total_required);
        // PI-01 must be in the missing list.
        assert!(r.missing.iter().any(|m| m.id == "PI-01"));
        // Conditional rules must NOT apply on an empty form.
        assert!(!r.missing.iter().any(|m| m.id == "MB-03")); // tourniquet time
        assert!(!r.missing.iter().any(|m| m.id == "RC-02")); // other precaution details
    }

    #[test]
    fn assessment_normal_or_finding_text_satisfies_assessment_rule() {
        // Variant 1: Normal checkbox alone satisfies MB-01 / AW-01.
        let mut data = empty();
        data.major_bleeding.assessment_normal = true;
        data.airway.assessment_normal = true;
        let r1 = validate_cfar(&data);
        assert!(!r1.missing.iter().any(|m| m.id == "MB-01"));
        assert!(!r1.missing.iter().any(|m| m.id == "AW-01"));

        // Variant 2: free-text findings alone (without Normal) also satisfy.
        let mut data2 = empty();
        data2.major_bleeding.assessment_findings = "Bright red bleeding, left thigh".into();
        data2.airway.assessment_findings = "Audible stridor".into();
        let r2 = validate_cfar(&data2);
        assert!(!r2.missing.iter().any(|m| m.id == "MB-01"));
        assert!(!r2.missing.iter().any(|m| m.id == "AW-01"));

        // Intervention rule has the same Normal/None pattern: ticking the
        // intervention "None" alone satisfies MB-02.
        let mut data3 = empty();
        data3.major_bleeding.interventions.none = true;
        let r3 = validate_cfar(&data3);
        assert!(!r3.missing.iter().any(|m| m.id == "MB-02"));
    }

    #[test]
    fn tourniquet_without_time_raises_urgent_flag_and_validation_error() {
        let mut data = empty();
        data.major_bleeding.assessment_findings = "Massive bleeding, right arm".into();
        data.major_bleeding.interventions.tourniquet = true;
        // tourniquet_application_time intentionally left blank.

        // Validator: MB-03 must fire because tourniquet=true with no time.
        let r = validate_cfar(&data);
        assert!(r.missing.iter().any(|m| m.id == "MB-03"));

        // Flagged issues: FLAG-MB-002 (urgent) for tourniquet without time.
        let flags = detect_flagged_issues(&data);
        assert!(flags
            .iter()
            .any(|f| f.id == "FLAG-MB-002" && f.priority == FlagPriority::Urgent));

        // FLAG-MB-003 (high) also fires: tourniquet without other bleeding control.
        assert!(flags
            .iter()
            .any(|f| f.id == "FLAG-MB-003" && f.priority == FlagPriority::High));

        // Sort order: urgent flags must come before high flags in the list.
        let first_high = flags.iter().position(|f| f.priority == FlagPriority::High);
        let last_urgent = flags
            .iter()
            .rposition(|f| f.priority == FlagPriority::Urgent);
        if let (Some(fh), Some(lu)) = (first_high, last_urgent) {
            assert!(lu < fh, "urgent must come before high");
        }
    }
}
