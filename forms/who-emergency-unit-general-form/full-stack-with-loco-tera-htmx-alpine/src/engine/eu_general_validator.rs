//! WHO Emergency Unit (General) Form completeness validator.
//!
//! Pure function: validates the form data for completeness. Each rule in
//! `eu_general_rules` is checked first against `applies()` to honour the
//! conditional logic of the form (e.g. ambulance level only when arrival
//! mode is ambulance, admit ward only when disposition is admit, deficit
//! description only when deficit is checked). When a rule applies, it must
//! also be `is_satisfied()` for the form to be complete; otherwise the rule
//! is recorded as a missing field.

use std::collections::BTreeMap;

use crate::engine::eu_general_rules::{eu_general_rules, section_label};
use crate::engine::types::{AssessmentData, FiredRule, SectionCompleteness, ValidationResult};

pub fn validate_eu_general(data: &AssessmentData) -> ValidationResult {
    let mut section_map: BTreeMap<String, SectionCompleteness> = BTreeMap::new();
    let mut missing: Vec<FiredRule> = Vec::new();
    let mut total_required: u32 = 0;
    let mut total_satisfied: u32 = 0;

    // Preserve insertion order of first occurrence per section.
    let mut section_order: Vec<String> = Vec::new();

    for rule in eu_general_rules() {
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
        let r = validate_eu_general(&data);
        assert!(!r.complete);
        // Empty form has 0 satisfied; total_required equals number of
        // unconditional rules (every rule with `applies = |_| true`).
        assert!(r.total_required > 0);
        assert_eq!(r.total_satisfied, 0);
        // Conditional rules must not fire on an empty form.
        assert!(!r.missing.iter().any(|m| m.id == "PR-08")); // ambulance level
        assert!(!r.missing.iter().any(|m| m.id == "D-02")); // deficit description
        assert!(!r.missing.iter().any(|m| m.id == "DISP-05")); // admit ward
        assert!(!r.missing.iter().any(|m| m.id == "DISP-06")); // transfer to
        assert!(!r.missing.iter().any(|m| m.id == "DISP-07")); // died cause
        // PR-01 (surname) must be in the missing list.
        assert!(r.missing.iter().any(|m| m.id == "PR-01"));
    }

    #[test]
    fn avpu_unresponsive_without_airway_intervention_flags_urgent() {
        let mut data = empty();
        data.disability.avpu = "U".into();
        // No airway interventions recorded — both AVPU=U and
        // AVPU + no airway intervention flags should fire urgent.
        let flags = detect_flagged_issues(&data);
        assert!(flags
            .iter()
            .any(|f| f.id == "FLAG-AVPU-U" && f.priority == FlagPriority::Urgent));
        assert!(flags
            .iter()
            .any(|f| f.id == "FLAG-AVPU-AIRWAY" && f.priority == FlagPriority::Urgent));

        // Now record an airway intervention; the AVPU-AIRWAY flag must clear.
        data.airway.intervention_bvm = true;
        let flags2 = detect_flagged_issues(&data);
        assert!(!flags2.iter().any(|f| f.id == "FLAG-AVPU-AIRWAY"));
        // AVPU-U flag still fires regardless of intervention.
        assert!(flags2.iter().any(|f| f.id == "FLAG-AVPU-U"));
    }

    #[test]
    fn admit_disposition_requires_admit_ward() {
        let mut data = empty();
        data.disposition.disposition = "admit".into();
        let r = validate_eu_general(&data);
        // DISP-05 (admit ward) must now apply and be missing.
        assert!(r.missing.iter().any(|m| m.id == "DISP-05"));

        // Set a valid admit ward; DISP-05 must clear.
        data.disposition.admit_ward = "icu".into();
        let r2 = validate_eu_general(&data);
        assert!(!r2.missing.iter().any(|m| m.id == "DISP-05"));
    }

    #[test]
    fn critical_vitals_flag_urgent_issues_and_sort_order_holds() {
        let mut data = empty();
        // SpO2 < 90 → urgent (and < 92 with no intervention → high)
        data.chief_complaint_and_vitals.initial_vitals.spo2 = Some(85.0);
        // SBP < 90 → high (hypotension)
        data.chief_complaint_and_vitals.initial_vitals.bp_systolic = Some(80.0);

        let flags = detect_flagged_issues(&data);
        assert!(flags
            .iter()
            .any(|f| f.id == "FLAG-SPO2-CRIT" && f.priority == FlagPriority::Urgent));
        assert!(flags
            .iter()
            .any(|f| f.id == "FLAG-VIT-SBP-LOW" && f.priority == FlagPriority::High));

        // Sort: urgent flags must come before high flags.
        let last_urgent = flags
            .iter()
            .rposition(|f| f.priority == FlagPriority::Urgent)
            .unwrap();
        let first_high = flags
            .iter()
            .position(|f| f.priority == FlagPriority::High)
            .unwrap();
        assert!(last_urgent < first_high);
    }
}
