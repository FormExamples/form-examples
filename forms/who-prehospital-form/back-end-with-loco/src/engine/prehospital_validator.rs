//! WHO Prehospital Form (SCF Prehospital) completeness validator.
//!
//! Pure function: validates the form data for completeness. Each rule in
//! `prehospital_rules` is checked first against `applies()` to honour the
//! conditional logic of the form (RED triage requires GCS / IV access, the
//! injury flag requires intent and mechanism, etc.). When a rule applies, it
//! must also be `is_satisfied()` for the run sheet to be complete; otherwise
//! the rule is recorded as a missing field.

use std::collections::BTreeMap;

use crate::engine::prehospital_rules::{prehospital_rules, section_label};
use crate::engine::types::{AssessmentData, FiredRule, SectionCompleteness, ValidationResult};

pub fn validate_prehospital(data: &AssessmentData) -> ValidationResult {
    let mut section_map: BTreeMap<String, SectionCompleteness> = BTreeMap::new();
    let mut missing: Vec<FiredRule> = Vec::new();
    let mut total_required: u32 = 0;
    let mut total_satisfied: u32 = 0;

    // Preserve insertion order of first occurrence per section.
    let mut section_order: Vec<String> = Vec::new();

    for rule in prehospital_rules() {
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

    // Reassessments rule: validator accepts any length up to 3.
    // (Captured here so that submissions with > 3 reassessments are flagged.)
    if data.reassessments.len() > 3 {
        let key = "reassessments".to_string();
        if !section_map.contains_key(&key) {
            section_order.push(key.clone());
            section_map.insert(
                key.clone(),
                SectionCompleteness {
                    section: key.clone(),
                    section_label: section_label("reassessments").to_string(),
                    required: 0,
                    satisfied: 0,
                    missing: Vec::new(),
                },
            );
        }
        let bucket = section_map.get_mut(&key).unwrap();
        let fired = FiredRule {
            id: "RA-01".into(),
            section: "reassessments".into(),
            description: "At most three reassessment vital sets are allowed.".into(),
        };
        bucket.required += 1;
        total_required += 1;
        missing.push(fired.clone());
        bucket.missing.push(fired);
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
        let r = validate_prehospital(&data);
        assert!(!r.complete);
        assert!(r.total_required > 0);
        assert_eq!(r.total_satisfied, 0);

        // Conditional rules must NOT fire on an empty form.
        // RED-triage gated rules:
        assert!(!r.missing.iter().any(|m| m.id == "A-02"));
        assert!(!r.missing.iter().any(|m| m.id == "C-03"));
        assert!(!r.missing.iter().any(|m| m.id == "D-02"));
        // Injury-gated rules:
        assert!(!r.missing.iter().any(|m| m.id == "INJ-01"));
        assert!(!r.missing.iter().any(|m| m.id == "INJ-02"));
        // Active bleeding gated:
        assert!(!r.missing.iter().any(|m| m.id == "C-02"));

        // Always-on rules must be in missing list.
        assert!(r.missing.iter().any(|m| m.id == "CS-01"));
        assert!(r.missing.iter().any(|m| m.id == "CV-01"));
        assert!(r.missing.iter().any(|m| m.id == "T-01"));
        assert!(r.missing.iter().any(|m| m.id == "DISP-01"));

        // Empty reassessments vec must NOT trigger the count rule.
        assert!(!r.missing.iter().any(|m| m.id == "RA-01"));
    }

    #[test]
    fn triage_red_ratchets_up_required_fields() {
        // Baseline (no triage) — count required.
        let baseline = empty();
        let baseline_r = validate_prehospital(&baseline);

        // Now mark RED triage with an abnormal airway finding so A-02 applies.
        let mut data = empty();
        data.triage.category = "red".into();
        data.airway.stridor = true; // makes airway not Normal AND satisfies A-01
        let r = validate_prehospital(&data);

        // RED-triage gated rules must now apply.
        assert!(r.missing.iter().any(|m| m.id == "A-02"));
        assert!(r.missing.iter().any(|m| m.id == "C-03"));
        assert!(r.missing.iter().any(|m| m.id == "D-02"));

        // total_required must increase by exactly 3 (the three RED-only rules
        // that newly applied) compared to the baseline.
        assert_eq!(r.total_required, baseline_r.total_required + 3);

        // After supplying an airway intervention, A-02 must clear.
        data.airway.intervention_bvm = true;
        let r2 = validate_prehospital(&data);
        assert!(!r2.missing.iter().any(|m| m.id == "A-02"));
        // C-03 and D-02 still missing.
        assert!(r2.missing.iter().any(|m| m.id == "C-03"));
        assert!(r2.missing.iter().any(|m| m.id == "D-02"));
    }

    #[test]
    fn gcs_under_8_without_airway_intervention_flags_urgent() {
        let mut data = empty();
        data.disability.gcs_eye = Some(1.0);
        data.disability.gcs_verbal = Some(1.0);
        data.disability.gcs_motor = Some(4.0); // total = 6 (< 8)
        let flags = detect_flagged_issues(&data);

        // The combined GCS < 8 + no airway intervention flag.
        assert!(flags
            .iter()
            .any(|f| f.id == "FLAG-GCS-AIRWAY" && f.priority == FlagPriority::Urgent));

        // After recording an airway intervention, FLAG-GCS-AIRWAY must clear
        // and the lower-priority FLAG-GCS-LOW (still GCS<8) must fire.
        data.airway.intervention_bvm = true;
        let flags2 = detect_flagged_issues(&data);
        assert!(!flags2.iter().any(|f| f.id == "FLAG-GCS-AIRWAY"));
        assert!(flags2
            .iter()
            .any(|f| f.id == "FLAG-GCS-LOW" && f.priority == FlagPriority::Urgent));
    }

    #[test]
    fn injury_flag_gates_intent_and_mechanism() {
        let mut data = empty();
        // Injury is off — INJ-01 / INJ-02 must NOT apply.
        let r = validate_prehospital(&data);
        assert!(!r.missing.iter().any(|m| m.id == "INJ-01"));
        assert!(!r.missing.iter().any(|m| m.id == "INJ-02"));

        // Turn injury on — both rules now apply and are missing.
        data.chief_complaint_and_vitals.injury = true;
        let r = validate_prehospital(&data);
        assert!(r.missing.iter().any(|m| m.id == "INJ-01"));
        assert!(r.missing.iter().any(|m| m.id == "INJ-02"));

        // Provide intent + mechanism; both should clear.
        data.injury_details.intent = "unintentional".into();
        data.injury_details.mechanism_fall = true;
        let r = validate_prehospital(&data);
        assert!(!r.missing.iter().any(|m| m.id == "INJ-01"));
        assert!(!r.missing.iter().any(|m| m.id == "INJ-02"));
    }

    #[test]
    fn reassessments_zero_to_three_accepted_four_rejected() {
        let mut data = empty();

        // 0 entries — no RA-01 fired.
        let r0 = validate_prehospital(&data);
        assert!(!r0.missing.iter().any(|m| m.id == "RA-01"));

        // 3 entries — still accepted.
        data.reassessments = vec![
            Reassessment::default(),
            Reassessment::default(),
            Reassessment::default(),
        ];
        let r3 = validate_prehospital(&data);
        assert!(!r3.missing.iter().any(|m| m.id == "RA-01"));

        // 4 entries — RA-01 fires.
        data.reassessments.push(Reassessment::default());
        let r4 = validate_prehospital(&data);
        assert!(r4.missing.iter().any(|m| m.id == "RA-01"));
    }
}
