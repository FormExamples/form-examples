//! DVLA B1 completeness validator.
//!
//! Pure function: validates the DVLA B1 form data for completeness. Each rule
//! in `b1_rules` is checked first against `applies()` to honour the conditional
//! logic of the form (Q4 No → skip Q5/Q6, Q10 No → skip Q10a/b, etc.). When a
//! rule applies, it must also be `is_satisfied()` for the form to be complete;
//! otherwise the rule is recorded as a missing field.

use std::collections::BTreeMap;

use crate::engine::b1_rules::{b1_rules, section_label};
use crate::engine::types::{
    AssessmentData, FiredRule, SectionCompleteness, ValidationResult,
};

/// Validate b1.
pub fn validate_b1(data: &AssessmentData) -> ValidationResult {
    let mut section_map: BTreeMap<String, SectionCompleteness> = BTreeMap::new();
    let mut missing: Vec<FiredRule> = Vec::new();
    let mut total_required: u32 = 0;
    let mut total_satisfied: u32 = 0;

    // Preserve insertion order of first occurrence per section.
    let mut section_order: Vec<String> = Vec::new();

    for rule in b1_rules() {
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
    fn empty_form_is_incomplete_and_has_unconditional_rules() {
        let data = empty();
        let r = validate_b1(&data);
        assert!(!r.complete);
        // Empty form has 0 satisfied; total_required equals number of
        // unconditional rules (every rule with `applies = |_| true`).
        assert!(r.total_required > 0);
        assert_eq!(r.total_satisfied, 0);
        assert_eq!(r.missing.len() as u32, r.total_required);
        // PD-01 must be in the missing list.
        assert!(r.missing.iter().any(|m| m.id == "PD-01"));
        // Q5-01 (first ever seizure date) must NOT apply on an empty form
        // (Q4 not "yes").
        assert!(!r.missing.iter().any(|m| m.id == "Q5-01"));
    }

    #[test]
    fn q4_no_skips_q5_and_q6() {
        let mut data = empty();
        data.seizures.had_seizures = "no".into();
        let r = validate_b1(&data);
        // Q4-01 satisfied (answered No); Q4-02, Q5-01, Q6a/g/h/i, EPI-* must
        // not be in the required count.
        assert!(!r.missing.iter().any(|m| m.id == "Q4-02"));
        assert!(!r.missing.iter().any(|m| m.id == "Q5-01"));
        assert!(!r.missing.iter().any(|m| m.id == "Q6a-01"));
        assert!(!r.missing.iter().any(|m| m.id == "Q6g-01"));
        assert!(!r.missing.iter().any(|m| m.id == "Q6h-01"));
        assert!(!r.missing.iter().any(|m| m.id == "Q6i-01"));
        assert!(!r.missing.iter().any(|m| m.id == "Q6-EPI-01"));
        assert!(!r.missing.iter().any(|m| m.id == "Q6-EPI-02"));
        assert!(!r.missing.iter().any(|m| m.id == "Q6-EPI-03"));
    }

    #[test]
    fn epilepsy_declaration_required_when_more_than_one_seizure() {
        let mut data = empty();
        data.seizures.had_seizures = "yes".into();
        data.seizures.diagnosis = "more-than-one-or-epilepsy".into();
        // Declaration unfilled → epilepsy declaration rules must fire.
        let r = validate_b1(&data);
        assert!(r.missing.iter().any(|m| m.id == "Q6-EPI-01"));
        assert!(r.missing.iter().any(|m| m.id == "Q6-EPI-02"));
        assert!(r.missing.iter().any(|m| m.id == "Q6-EPI-03"));
        // And the flagged-issues engine must escalate to URGENT.
        let flags = detect_flagged_issues(&data);
        assert!(flags.iter().any(|f| f.id == "FLAG-EPI-001" && f.priority == FlagPriority::Urgent));
    }
}
