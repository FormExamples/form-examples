//! DVLA V1 completeness validator.
//!
//! Pure function: validates the DVLA V1 form data for completeness. Each rule
//! in `v1_rules` is checked first against `applies()` to honour the conditional
//! logic of the form (Q2 No → monocular branch active; Q3 Yes → field-of-vision
//! sub-branch; Q4–Q10 No → skip; etc.). When a rule applies, it must also be
//! `is_satisfied()` for the form to be complete; otherwise the rule is recorded
//! as a missing field.

use std::collections::BTreeMap;

use crate::engine::types::{
    AssessmentData, FiredRule, SectionCompleteness, ValidationResult,
};
use crate::engine::v1_rules::{section_label, v1_rules};

pub fn validate_v1(data: &AssessmentData) -> ValidationResult {
    let mut section_map: BTreeMap<String, SectionCompleteness> = BTreeMap::new();
    let mut missing: Vec<FiredRule> = Vec::new();
    let mut total_required: u32 = 0;
    let mut total_satisfied: u32 = 0;

    // Preserve insertion order of first occurrence per section.
    let mut section_order: Vec<String> = Vec::new();

    for rule in v1_rules() {
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
                message: rule.message.to_string(),
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
        let r = validate_v1(&data);
        assert!(!r.complete);
        // Empty form has 0 satisfied; total_required equals number of
        // unconditional rules (every rule with `applies = |_| true`).
        assert!(r.total_required > 0);
        assert_eq!(r.total_satisfied, 0);
        assert_eq!(r.missing.len() as u32, r.total_required);
        // PD-001 must be in the missing list.
        assert!(r.missing.iter().any(|m| m.id == "V1-PD-001"));
        // Q2-002 (monocular which-eye) must NOT apply on an empty form
        // (Q2 not "no" yet).
        assert!(!r.missing.iter().any(|m| m.id == "V1-Q2-002"));
    }

    #[test]
    fn monocular_branch_activates_when_q2_is_no() {
        let mut data = empty();
        data.vision_in_both_eyes.has_vision_in_both_eyes = "no".into();
        let r = validate_v1(&data);
        // Now monocular sub-rules must fire.
        assert!(r.missing.iter().any(|m| m.id == "V1-Q2-002"));
        assert!(r.missing.iter().any(|m| m.id == "V1-Q2-003"));
        assert!(r.missing.iter().any(|m| m.id == "V1-Q2-004"));
        assert!(r.missing.iter().any(|m| m.id == "V1-Q2-005"));
    }

    #[test]
    fn eyesight_failure_raises_urgent_flag() {
        let mut data = empty();
        data.eyesight_standards.meets_standard = "no".into();
        let flags = detect_flagged_issues(&data);
        assert!(flags
            .iter()
            .any(|f| f.id == "V1-FLAG-EYE-001" && f.priority == FlagPriority::Urgent));
    }

    #[test]
    fn q4_no_skips_q4b() {
        let mut data = empty();
        data.glaucoma.has_condition = "no".into();
        let r = validate_v1(&data);
        assert!(!r.missing.iter().any(|m| m.id == "V1-Q4-002"));
    }
}
