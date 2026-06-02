use united_kingdom_driver_and_vehicle_licensing_agency_m1_form_loco_crate::engine::m1_rules::all_rules;
use united_kingdom_driver_and_vehicle_licensing_agency_m1_form_loco_crate::engine::m1_validator::validate_m1;
use united_kingdom_driver_and_vehicle_licensing_agency_m1_form_loco_crate::engine::types::*;

/// Build a fully completed assessment with Q1=yes, one condition, recent contact,
/// and declaration confirmed.
fn fully_completed() -> AssessmentData {
    AssessmentData {
        personal_details: PersonalDetails {
            title: "Mr".to_string(),
            full_name: "Alex Driver".to_string(),
            date_of_birth: "1980-05-12".to_string(),
            address: "10 Test Lane".to_string(),
            postcode: "SW1A 1AA".to_string(),
            email: "alex@example.com".to_string(),
            contact_number: "07700 900000".to_string(),
            change_of_details: String::new(),
        },
        healthcare_professionals: HealthcareProfessionals {
            gp: GpDetails {
                gp_name: "Dr Jones".to_string(),
                surgery_name: "City Surgery".to_string(),
                date_last_seen: "2026-04-01".to_string(),
                ..GpDetails::default()
            },
            consultant: ConsultantDetails::default(),
        },
        diagnosis_confirmation: DiagnosisConfirmation {
            has_mental_health_diagnosis: "yes".to_string(),
        },
        mental_health_conditions: MentalHealthConditions {
            anxiety_depression_without_impairment: "yes".to_string(),
            ..MentalHealthConditions::default()
        },
        recent_contact: RecentContact {
            had_recent_contact: "yes".to_string(),
            doctor_last_date: "2026-04-01".to_string(),
            ..RecentContact::default()
        },
        authorisation: Authorisation {
            declaration_confirmed: "yes".to_string(),
            signatory_name: "Alex Driver".to_string(),
            signature_text: "Alex Driver".to_string(),
            signature_date: "2026-06-01".to_string(),
            ..Authorisation::default()
        },
    }
}

#[test]
fn empty_assessment_fires_q1_rule() {
    let data = AssessmentData::default();
    let result = validate_m1(&data);
    assert!(result.fired_rules.iter().any(|r| r.id == "M1-Q1-001"));
    assert!(!result.complete);
}

#[test]
fn q1_no_stops_at_q1() {
    let mut data = AssessmentData::default();
    data.diagnosis_confirmation.has_mental_health_diagnosis = "no".to_string();
    data.authorisation.declaration_confirmed = "yes".to_string();
    let result = validate_m1(&data);
    assert!(result.stopped_at_q1);
    // No Q2 or Q3 rules should appear when stopped at Q1.
    assert!(
        !result
            .fired_rules
            .iter()
            .any(|r| r.id.starts_with("M1-Q2") || r.id.starts_with("M1-Q3"))
    );
}

#[test]
fn fully_completed_is_complete_and_no_q1_rule() {
    let data = fully_completed();
    let result = validate_m1(&data);
    assert!(result.complete, "should be complete: {:?}", result.fired_rules);
    assert!(!result.fired_rules.iter().any(|r| r.id == "M1-Q1-001"));
}

#[test]
fn other_yes_without_details_fires_consistency_rule() {
    let mut data = fully_completed();
    data.mental_health_conditions.other = "yes".to_string();
    data.mental_health_conditions.other_details = String::new();
    let result = validate_m1(&data);
    assert!(result.fired_rules.iter().any(|r| r.id == "M1-Q2-002"));
}

#[test]
fn q3_yes_without_any_date_fires_consistency_rule() {
    let mut data = fully_completed();
    data.recent_contact.had_recent_contact = "yes".to_string();
    data.recent_contact.doctor_last_date = String::new();
    data.recent_contact.consultant_last_date = String::new();
    data.recent_contact.community_psychiatric_nurse_last_date = String::new();
    let result = validate_m1(&data);
    assert!(result.fired_rules.iter().any(|r| r.id == "M1-Q3-002"));
}

#[test]
fn declaration_not_confirmed_fires_auth_rule() {
    let mut data = fully_completed();
    data.authorisation.declaration_confirmed = "no".to_string();
    let result = validate_m1(&data);
    assert!(result.fired_rules.iter().any(|r| r.id == "M1-AUTH-001"));
}

#[test]
fn rule_ids_are_unique() {
    let rules = all_rules();
    let mut ids: Vec<&str> = rules.iter().map(|r| r.id).collect();
    ids.sort();
    let before = ids.len();
    ids.dedup();
    assert_eq!(ids.len(), before, "rule IDs must be unique");
}

#[test]
fn rules_sorted_by_priority() {
    let mut data = AssessmentData::default();
    data.diagnosis_confirmation.has_mental_health_diagnosis = "yes".to_string();
    let result = validate_m1(&data);
    // Verify ordering: urgent < high < medium < low.
    let order: Vec<u32> = result
        .fired_rules
        .iter()
        .map(|r| match r.priority.as_str() {
            "urgent" => 0,
            "high" => 1,
            "medium" => 2,
            "low" => 3,
            _ => 99,
        })
        .collect();
    let mut sorted = order.clone();
    sorted.sort();
    assert_eq!(order, sorted);
}
