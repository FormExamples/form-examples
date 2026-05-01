//! Pure validator: turn an `AssessmentData` into a `ValidationResult`.
//!
//! Conditional logic:
//!   - Q1 = No  → form stops at Q1; downstream Q2/Q3 rules are skipped and
//!                the result is marked `stopped_at_q1: true`.
//!   - Q1 = Yes → all rules apply.

use crate::engine::flagged_issues::{count_yes, detect_additional_flags};
use crate::engine::m1_rules::m1_rules;
use crate::engine::types::{
    AssessmentData, FiredRule, RuleCategory, ValidationResult,
};

pub fn validate_m1(data: &AssessmentData) -> ValidationResult {
    let stopped_at_q1 =
        data.diagnosis_confirmation.has_mental_health_diagnosis == "no";

    let mut fired_rules: Vec<FiredRule> = Vec::new();
    for rule in m1_rules() {
        // When Q1 = No, skip Q2/Q3 rules entirely.
        if stopped_at_q1 && (rule.id.starts_with("M1-Q2") || rule.id.starts_with("M1-Q3")) {
            continue;
        }
        if (rule.evaluate)(data) {
            fired_rules.push(FiredRule {
                id: rule.id.to_string(),
                category: rule.category,
                priority: rule.priority,
                description: rule.description.to_string(),
                message: rule.message.to_string(),
            });
        }
    }

    fired_rules.sort_by_key(|r| r.priority.order());

    let additional_flags = detect_additional_flags(data);
    let condition_count = count_yes(data);

    let complete = fired_rules
        .iter()
        .filter(|r| r.category == RuleCategory::Completeness)
        .count()
        == 0;

    ValidationResult {
        complete,
        stopped_at_q1,
        fired_rules,
        additional_flags,
        condition_count,
        timestamp: chrono::Utc::now().to_rfc3339(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::engine::types::*;

    fn complete_data() -> AssessmentData {
        AssessmentData {
            personal_details: PersonalDetails {
                title: "Mr".into(),
                full_name: "Alex Driver".into(),
                date_of_birth: "1980-04-12".into(),
                address: "1 Road, Townsville".into(),
                postcode: "AB1 2CD".into(),
                email: "alex@example.com".into(),
                contact_number: "07700900000".into(),
                change_of_details: "no".into(),
            },
            healthcare_professionals: HealthcareProfessionals {
                gp: GpDetails {
                    gp_name: "Dr Smith".into(),
                    surgery_name: "Townsville Surgery".into(),
                    address: "Surgery Road".into(),
                    town: "Townsville".into(),
                    postcode: "AB1 2EF".into(),
                    contact_number: "01234567890".into(),
                    email: "smith@example.com".into(),
                    date_last_seen: "2025-01-15".into(),
                },
                consultant: ConsultantDetails::default(),
            },
            diagnosis_confirmation: DiagnosisConfirmation {
                has_mental_health_diagnosis: "yes".into(),
            },
            mental_health_conditions: MentalHealthConditions {
                anxiety_depression_without_impairment: "yes".into(),
                ..MentalHealthConditions::default()
            },
            recent_contact: RecentContact {
                had_recent_contact: "yes".into(),
                doctor_last_date: "2025-02-10".into(),
                ..RecentContact::default()
            },
            authorisation: Authorisation {
                declaration_confirmed: "yes".into(),
                signatory_name: "Alex Driver".into(),
                signature_text: "Alex Driver".into(),
                signature_date: "2025-04-30".into(),
                electronic_correspondence_consent: "yes".into(),
                dvla_contact_preference: "email".into(),
                healthcare_professional_contact_preference: "email".into(),
            },
        }
    }

    #[test]
    fn q1_no_stops_form_and_skips_q2_q3_rules() {
        let mut data = AssessmentData::default();
        data.diagnosis_confirmation.has_mental_health_diagnosis = "no".into();
        data.authorisation.declaration_confirmed = "yes".into();
        data.authorisation.signatory_name = "Alex".into();
        data.authorisation.signature_date = "2025-04-30".into();
        data.personal_details.full_name = "Alex".into();
        data.personal_details.date_of_birth = "1980-04-12".into();
        data.personal_details.address = "1 Road".into();
        data.personal_details.postcode = "AB1 2CD".into();
        data.personal_details.contact_number = "07700".into();

        let r = validate_m1(&data);
        assert!(r.stopped_at_q1, "Q1=No should set stopped_at_q1");
        // No Q2 or Q3 rules should be present in fired list.
        let q23 = r
            .fired_rules
            .iter()
            .any(|f| f.id.starts_with("M1-Q2") || f.id.starts_with("M1-Q3"));
        assert!(!q23, "Q1=No must skip all Q2/Q3 rules; got {:?}", r.fired_rules);
        // Should have a low informational flag for no diagnosis.
        assert!(
            r.additional_flags
                .iter()
                .any(|f| f.id == "FLAG-NO-DIAGNOSIS-LOW-001"),
            "Q1=No should add low diagnosis flag"
        );
    }

    #[test]
    fn suicidal_thoughts_variant_triggers_urgent_flag() {
        let mut data = complete_data();
        data.mental_health_conditions.anxiety_depression_with_impairment = "yes".into();
        let r = validate_m1(&data);
        let urgent = r
            .additional_flags
            .iter()
            .find(|f| f.id == "FLAG-MH-URGENT-001");
        assert!(urgent.is_some(), "expected urgent suicidal-thoughts flag");
        assert_eq!(urgent.unwrap().priority, RulePriority::Urgent);
        // The first flag (after sort) should be the urgent one.
        assert_eq!(r.additional_flags[0].priority, RulePriority::Urgent);
    }

    #[test]
    fn complete_form_passes_all_completeness_rules() {
        let data = complete_data();
        let r = validate_m1(&data);
        assert!(!r.stopped_at_q1);
        assert!(r.complete, "fired completeness rules: {:?}", r.fired_rules);
        // Condition count must reflect the one Yes answer.
        assert_eq!(r.condition_count, 1);
    }

    #[test]
    fn unanswered_q1_fires_high_priority_rule() {
        let data = AssessmentData::default();
        let r = validate_m1(&data);
        assert!(!r.stopped_at_q1);
        assert!(r.fired_rules.iter().any(|f| f.id == "M1-Q1-001"));
    }

    #[test]
    fn other_yes_without_details_fires_consistency_rule() {
        let mut data = complete_data();
        data.mental_health_conditions.other = "yes".into();
        data.mental_health_conditions.other_details = "".into();
        let r = validate_m1(&data);
        assert!(r.fired_rules.iter().any(|f| f.id == "M1-Q2-002"));
    }
}
