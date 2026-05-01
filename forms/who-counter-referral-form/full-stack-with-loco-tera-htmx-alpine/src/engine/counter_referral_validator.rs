//! WHO Counter-Referral Form completeness validator.
//!
//! Pure function: validates the WHO Counter-Referral Form data for
//! completeness. Each rule in `counter_referral_rules` is checked first against
//! `applies()` to honour the conditional logic of the form (e.g. "patient/
//! family informed Yes → explanation required"). When a rule applies, it must
//! also be `is_satisfied()` for the form to be complete; otherwise the rule is
//! recorded as a missing field.

use std::collections::BTreeMap;

use crate::engine::counter_referral_rules::{counter_referral_rules, section_label};
use crate::engine::types::{
    AssessmentData, FiredRule, SectionCompleteness, ValidationResult,
};

pub fn validate_counter_referral(data: &AssessmentData) -> ValidationResult {
    let mut section_map: BTreeMap<String, SectionCompleteness> = BTreeMap::new();
    let mut missing: Vec<FiredRule> = Vec::new();
    let mut total_required: u32 = 0;
    let mut total_satisfied: u32 = 0;

    // Preserve insertion order of first occurrence per section.
    let mut section_order: Vec<String> = Vec::new();

    for rule in counter_referral_rules() {
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
        let r = validate_counter_referral(&data);
        assert!(!r.complete);
        // Empty form has 0 satisfied; total_required equals number of
        // unconditional rules (every rule with `applies = |_| true`).
        assert!(r.total_required > 0);
        assert_eq!(r.total_satisfied, 0);
        assert_eq!(r.missing.len() as u32, r.total_required);
        // PID-01 must be in the missing list.
        assert!(r.missing.iter().any(|m| m.id == "PID-01"));
        // ASS-04 (informed explanation) must NOT apply on an empty form
        // (patient_family_informed not "yes").
        assert!(!r.missing.iter().any(|m| m.id == "ASS-04"));
    }

    #[test]
    fn ass04_fires_only_when_patient_family_informed_yes() {
        // Initially, ASS-04 should NOT fire.
        let mut data = empty();
        data.assessment.patient_family_informed = "no".into();
        let r = validate_counter_referral(&data);
        assert!(!r.missing.iter().any(|m| m.id == "ASS-04"));

        // Switch to "yes" without an explanation: ASS-04 must fire.
        data.assessment.patient_family_informed = "yes".into();
        let r = validate_counter_referral(&data);
        assert!(r.missing.iter().any(|m| m.id == "ASS-04"));

        // Provide the explanation: ASS-04 must be satisfied (not in missing).
        data.assessment.informed_explanation = "Discussed with patient and spouse.".into();
        let r = validate_counter_referral(&data);
        assert!(!r.missing.iter().any(|m| m.id == "ASS-04"));
    }

    #[test]
    fn urgent_followup_timeframe_fires_urgent_flag() {
        let mut data = empty();
        data.facility_details.follow_up_timeframe = "urgent-within-24-hours".into();
        let flags = detect_flagged_issues(&data);
        assert!(flags
            .iter()
            .any(|f| f.id == "FLAG-FU-001" && f.priority == FlagPriority::Urgent));

        // FAC-11 should be satisfied (the timeframe is set), but other
        // unconditional rules are still missing.
        let r = validate_counter_referral(&data);
        assert!(!r.missing.iter().any(|m| m.id == "FAC-11"));
    }

    #[test]
    fn fac11_not_satisfied_when_timeframe_blank() {
        let data = empty();
        let r = validate_counter_referral(&data);
        assert!(r.missing.iter().any(|m| m.id == "FAC-11"));
    }
}
