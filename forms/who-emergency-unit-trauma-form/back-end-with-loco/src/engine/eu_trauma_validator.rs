//! WHO Emergency Unit (Trauma) Form completeness validator.
//!
//! Pure function: validates the form data for completeness. Each rule in
//! `eu_trauma_rules` is checked first against `applies()` to honour the
//! conditional logic of the form (e.g. cause of death only when disposition
//! is died, time of death only when patient is dead-on-arrival, GCS recording
//! and spine stabilisation only when triage is RED — the "RED ratchet").
//! When a rule applies, it must also be `is_satisfied()` for the form to be
//! complete; otherwise the rule is recorded as a missing field.

use std::collections::BTreeMap;

use crate::engine::eu_trauma_rules::{eu_trauma_rules, section_label};
use crate::engine::types::{AssessmentData, FiredRule, SectionCompleteness, ValidationResult};

pub fn validate_eu_trauma(data: &AssessmentData) -> ValidationResult {
    let mut section_map: BTreeMap<String, SectionCompleteness> = BTreeMap::new();
    let mut missing: Vec<FiredRule> = Vec::new();
    let mut total_required: u32 = 0;
    let mut total_satisfied: u32 = 0;

    // Preserve insertion order of first occurrence per section.
    let mut section_order: Vec<String> = Vec::new();

    for rule in eu_trauma_rules() {
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
        let r = validate_eu_trauma(&data);
        assert!(!r.complete);
        // Empty form has 0 satisfied; total_required equals number of
        // unconditional rules (every rule with `applies = |_| true`).
        assert!(r.total_required > 0);
        assert_eq!(r.total_satisfied, 0);
        // Conditional rules must not fire on an empty form (no triage,
        // no DOA, no admit/transfer/died, etc.).
        assert!(!r.missing.iter().any(|m| m.id == "A-02")); // RED spine stabilization
        assert!(!r.missing.iter().any(|m| m.id == "D-02")); // RED GCS
        assert!(!r.missing.iter().any(|m| m.id == "CV-08")); // DOA time of death
        assert!(!r.missing.iter().any(|m| m.id == "DISP-05")); // admit ward
        assert!(!r.missing.iter().any(|m| m.id == "DISP-06")); // transfer to
        assert!(!r.missing.iter().any(|m| m.id == "DISP-07")); // died cause
        // Vital signs rules should be required when not DOA.
        assert!(r.missing.iter().any(|m| m.id == "CV-04"));
        // PR-01 (surname) must be in the missing list.
        assert!(r.missing.iter().any(|m| m.id == "PR-01"));
    }

    #[test]
    fn red_triage_ratchet_requires_spine_stabilization_and_gcs() {
        let mut data = empty();
        data.triage.category = "red".into();
        let r = validate_eu_trauma(&data);
        // Both A-02 (spine) and D-02 (GCS) must now apply and be missing.
        assert!(r.missing.iter().any(|m| m.id == "A-02"));
        assert!(r.missing.iter().any(|m| m.id == "D-02"));

        // Satisfy spine stabilization.
        data.airway.spine_stabilized = "in-eu".into();
        let r2 = validate_eu_trauma(&data);
        assert!(!r2.missing.iter().any(|m| m.id == "A-02"));
        // GCS still missing.
        assert!(r2.missing.iter().any(|m| m.id == "D-02"));

        // Satisfy GCS via Qualified flag (sedated/intubated).
        data.disability.gcs_qualified = true;
        let r3 = validate_eu_trauma(&data);
        assert!(!r3.missing.iter().any(|m| m.id == "D-02"));

        // Switching back to YELLOW makes both rules inapplicable again.
        data.triage.category = "yellow".into();
        data.airway.spine_stabilized = "".into();
        data.disability.gcs_qualified = false;
        let r4 = validate_eu_trauma(&data);
        assert!(!r4.missing.iter().any(|m| m.id == "A-02"));
        assert!(!r4.missing.iter().any(|m| m.id == "D-02"));

        // RED triage flag should also trigger the FLAG-AVPU urgent flow
        // when AVPU is unresponsive.
        data.triage.category = "red".into();
        data.disability.avpu = "U".into();
        let flags = detect_flagged_issues(&data);
        assert!(flags
            .iter()
            .any(|f| f.id == "FLAG-AVPU-U" && f.priority == FlagPriority::Urgent));
    }

    #[test]
    fn dead_on_arrival_waives_vitals_but_requires_time_of_death() {
        let mut data = empty();
        data.chief_complaint_and_vitals.dead_on_arrival = true;
        let r = validate_eu_trauma(&data);
        // CV-04 .. CV-07 (vital signs) are waived.
        assert!(!r.missing.iter().any(|m| m.id == "CV-04"));
        assert!(!r.missing.iter().any(|m| m.id == "CV-05"));
        assert!(!r.missing.iter().any(|m| m.id == "CV-06"));
        assert!(!r.missing.iter().any(|m| m.id == "CV-07"));
        // CV-08 (time of death) is now required.
        assert!(r.missing.iter().any(|m| m.id == "CV-08"));

        // Set time of death — CV-08 clears.
        data.chief_complaint_and_vitals.time_of_death = "14:32".into();
        let r2 = validate_eu_trauma(&data);
        assert!(!r2.missing.iter().any(|m| m.id == "CV-08"));

        // DOA also raises the FLAG-DOA urgent flag.
        let flags = detect_flagged_issues(&data);
        assert!(flags
            .iter()
            .any(|f| f.id == "FLAG-DOA" && f.priority == FlagPriority::Urgent));
    }

    #[test]
    fn died_disposition_requires_died_cause_and_flags_mortality() {
        let mut data = empty();
        data.disposition.disposition = "died".into();
        let r = validate_eu_trauma(&data);
        assert!(r.missing.iter().any(|m| m.id == "DISP-07"));

        data.disposition.died_cause = "Massive haemorrhage".into();
        let r2 = validate_eu_trauma(&data);
        assert!(!r2.missing.iter().any(|m| m.id == "DISP-07"));

        let flags = detect_flagged_issues(&data);
        assert!(flags
            .iter()
            .any(|f| f.id == "FLAG-DISPO-DIED" && f.priority == FlagPriority::Urgent));
    }
}
