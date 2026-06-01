use united_kingdom_driver_and_vehicle_licensing_agency_v1_form_tera_crate::engine::types::*;
use united_kingdom_driver_and_vehicle_licensing_agency_v1_form_tera_crate::engine::v1_grader::{
    grade, run_rules,
};
use united_kingdom_driver_and_vehicle_licensing_agency_v1_form_tera_crate::engine::v1_rules::all_rules;

/// Build a fully completed DVLA V1 assessment whose every rule is satisfied.
fn fully_completed_case() -> AssessmentData {
    AssessmentData {
        personal_details: PersonalDetails {
            title: "Mr".to_string(),
            full_name: "Alex Driver".to_string(),
            date_of_birth: "1975-04-11".to_string(),
            address: "10 Downing Street\nLondon".to_string(),
            postcode: "SW1A 2AA".to_string(),
            email: "alex@example.com".to_string(),
            contact_number: "020 7946 0000".to_string(),
            change_of_details: String::new(),
        },
        healthcare_professionals: HealthcareProfessionals {
            gp: GpDetails {
                name: "Dr Jane Smith".to_string(),
                surgery_name: "Acme Surgery".to_string(),
                address: "1 High Street".to_string(),
                town: "Anytown".to_string(),
                postcode: "AB1 2CD".to_string(),
                contact_number: "01234 567890".to_string(),
                email: "surgery@example.com".to_string(),
                date_last_seen: "2026-05-01".to_string(),
            },
            consultant: ConsultantDetails::default(),
        },
        eyesight_standards: EyesightStandards {
            meets_standard: "yes-with-correction".to_string(),
        },
        vision_in_both_eyes: VisionInBothEyes {
            has_vision_in_both_eyes: "yes".to_string(),
            ..VisionInBothEyes::default()
        },
        field_of_vision: FieldOfVision {
            has_problem: "no".to_string(),
            ..FieldOfVision::default()
        },
        glaucoma: Glaucoma {
            has_condition: "no".to_string(),
            ..Glaucoma::default()
        },
        retinitis_pigmentosa: RetinitisPigmentosa {
            has_condition: "no".to_string(),
            ..RetinitisPigmentosa::default()
        },
        laser_treatment: LaserTreatment {
            has_had_treatment: "no".to_string(),
            ..LaserTreatment::default()
        },
        blepharospasm: Blepharospasm {
            has_condition: "no".to_string(),
            ..Blepharospasm::default()
        },
        night_blindness: NightBlindness {
            has_condition: "no".to_string(),
            ..NightBlindness::default()
        },
        double_vision: DoubleVision {
            has_condition: "no".to_string(),
            ..DoubleVision::default()
        },
        other_vision_conditions: OtherVisionConditions {
            has_other: "no".to_string(),
            ..OtherVisionConditions::default()
        },
        recent_contact: RecentContact {
            had_contact: "yes".to_string(),
            date_of_contact: "2026-05-01".to_string(),
        },
        authorisation: Authorisation {
            declaration_confirmed: true,
            name: "Alex Driver".to_string(),
            signature: "Alex Driver".to_string(),
            date: "2026-06-01".to_string(),
            authorise_electronic_correspondence: "yes".to_string(),
            contact_preference_from_healthcare_professional: "email".to_string(),
            contact_preference_from_dvla: "email".to_string(),
        },
    }
}

#[test]
fn empty_case_is_incomplete() {
    let data = AssessmentData::default();
    let result = grade(&data);
    assert!(!result.complete);
    assert!(result.total_required > 0);
    assert_eq!(result.total_satisfied, 0);
    assert_eq!(result.overall_percent, 0);
}

#[test]
fn fully_completed_case_is_complete() {
    let data = fully_completed_case();
    let result = grade(&data);
    assert!(result.complete, "missing rules: {:?}", result.missing);
    assert_eq!(result.total_satisfied, result.total_required);
    assert_eq!(result.overall_percent, 100);
}

#[test]
fn monocular_branch_requires_followups() {
    let mut data = fully_completed_case();
    data.vision_in_both_eyes.has_vision_in_both_eyes = "no".to_string();
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "V1-Q2-002"));
    assert!(fired.iter().any(|r| r.id == "V1-Q2-003"));
    assert!(fired.iter().any(|r| r.id == "V1-Q2-004"));
    assert!(fired.iter().any(|r| r.id == "V1-Q2-005"));
}

#[test]
fn visual_field_other_cause_requires_details() {
    let mut data = fully_completed_case();
    data.field_of_vision.has_problem = "yes".to_string();
    data.field_of_vision.caused_solely_by_eye_condition = "no".to_string();
    data.field_of_vision.cause = "other".to_string();
    data.field_of_vision.cause_other_details = String::new();
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "V1-Q3-004"));
}

#[test]
fn double_vision_uncontrolled_requires_six_months_answer() {
    let mut data = fully_completed_case();
    data.double_vision.has_condition = "yes".to_string();
    data.double_vision.controlled = "no".to_string();
    data.double_vision.same_for_six_months_or_more = String::new();
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "V1-Q9-003"));
}

#[test]
fn rule_ids_are_unique() {
    let rules = all_rules();
    let mut ids: Vec<&str> = rules.iter().map(|r| r.id).collect();
    ids.sort();
    let len_before = ids.len();
    ids.dedup();
    assert_eq!(ids.len(), len_before, "rule IDs must be unique");
}

#[test]
fn rule_ids_match_javascript_source() {
    // Spot-check a handful of canonical rule IDs from the JS source.
    let ids: Vec<&str> = all_rules().iter().map(|r| r.id).collect();
    for expected in [
        "V1-PD-001",
        "V1-PD-002",
        "V1-PD-003",
        "V1-PD-004",
        "V1-HCP-001",
        "V1-HCP-002",
        "V1-Q1-001",
        "V1-Q2-005",
        "V1-Q3-004",
        "V1-Q9-006",
        "V1-AUTH-005",
    ] {
        assert!(ids.contains(&expected), "missing rule {expected}");
    }
}
