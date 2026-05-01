//! WHO Acute Referral Form completeness validator.
//!
//! Pure function: validates the WHO acute referral form data for completeness.
//! Each rule in `referral_rules` is checked first against `applies()` to honour
//! the conditional logic of the form (e.g. "Other precaution" details only
//! required when the "Other" box is ticked, receiving-provider details only
//! required once any receipt-side field has been touched). When a rule
//! applies, it must also be `is_satisfied()` for the form to be complete;
//! otherwise the rule is recorded as a missing field.

use std::collections::BTreeMap;

use crate::engine::referral_rules::{referral_rules, section_label};
use crate::engine::types::{AssessmentData, FiredRule, SectionCompleteness, ValidationResult};

pub fn validate_referral(data: &AssessmentData) -> ValidationResult {
    let mut section_map: BTreeMap<String, SectionCompleteness> = BTreeMap::new();
    let mut missing: Vec<FiredRule> = Vec::new();
    let mut total_required: u32 = 0;
    let mut total_satisfied: u32 = 0;

    // Preserve insertion order of first occurrence per section.
    let mut section_order: Vec<String> = Vec::new();

    for rule in referral_rules() {
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
    fn empty_form_is_incomplete_and_skips_receipt_side_rules() {
        let data = empty();
        let r = validate_referral(&data);
        assert!(!r.complete);
        // Empty form has 0 satisfied; total_required equals number of
        // unconditional rules (every rule with `applies = |_| true`).
        assert!(r.total_required > 0);
        assert_eq!(r.total_satisfied, 0);
        assert_eq!(r.missing.len() as u32, r.total_required);
        // PID-01 must be in the missing list.
        assert!(r.missing.iter().any(|m| m.id == "PID-01"));
        // Receipt-side rules must NOT apply on an empty form.
        assert!(!r.missing.iter().any(|m| m.id == "RFR-01"));
        assert!(!r.missing.iter().any(|m| m.id == "RFR-02"));
        assert!(!r.missing.iter().any(|m| m.id == "RFR-03"));
        // REC-02 (Other-precaution details) must NOT apply when not ticked.
        assert!(!r.missing.iter().any(|m| m.id == "REC-02"));
    }

    #[test]
    fn receipt_side_gate_fires_when_arrival_recorded() {
        let mut data = empty();
        data.referral_facility_receipt.patient_arrival_date_time = "2026-04-30T10:00".into();
        let r = validate_referral(&data);
        // Now RFR-01 (receiving provider name) and RFR-02 (signature) must be
        // missing because arrival time has been recorded.
        assert!(r.missing.iter().any(|m| m.id == "RFR-01"));
        assert!(r.missing.iter().any(|m| m.id == "RFR-02"));
        // RFR-03 (arrival time) must NOT be missing — only the other receipt
        // fields are blank, but arrival itself is filled.
        assert!(!r.missing.iter().any(|m| m.id == "RFR-03"));
    }

    #[test]
    fn critical_vital_signs_flag_urgent_issues() {
        let mut data = empty();
        // SpO2 < 90 → urgent flag.
        data.assessment.vital_signs.oxygen_saturation = Some(85.0);
        // GCS ≤ 8 → urgent flag.
        data.assessment.vital_signs.glasgow_coma_scale = Some(7.0);
        // SBP < 90 → high (hypotension) flag.
        data.assessment.vital_signs.systolic_blood_pressure = Some(80.0);

        let flags = detect_flagged_issues(&data);
        assert!(flags
            .iter()
            .any(|f| f.id == "FLAG-VIT-SPO2" && f.priority == FlagPriority::Urgent));
        assert!(flags
            .iter()
            .any(|f| f.id == "FLAG-VIT-GCS" && f.priority == FlagPriority::Urgent));
        assert!(flags
            .iter()
            .any(|f| f.id == "FLAG-VIT-SBP-LOW" && f.priority == FlagPriority::High));
        // Sort order: urgent flags must come before high flags.
        let first_high = flags
            .iter()
            .position(|f| f.priority == FlagPriority::High)
            .unwrap();
        let last_urgent = flags
            .iter()
            .rposition(|f| f.priority == FlagPriority::Urgent)
            .unwrap();
        assert!(last_urgent < first_high);
    }
}
