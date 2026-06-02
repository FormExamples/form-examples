use international_patient_summary_loco_crate::engine::ips_validator::{
    classify_completeness, completeness_level_label, validate,
};
use international_patient_summary_loco_crate::engine::types::*;
use international_patient_summary_loco_crate::engine::validation_rules::all_rules;

/// Build a fully populated IPS — all eight mandatory sections plus both
/// optional sections.
fn fully_populated_ips() -> AssessmentData {
    AssessmentData {
        patient_demographics: PatientDemographics {
            given_name: "Jane".to_string(),
            family_name: "Doe".to_string(),
            date_of_birth: "1972-04-11".to_string(),
            sex: "female".to_string(),
            national_identifier: "943 476 5919".to_string(),
            address_line: "1 High Street".to_string(),
            city: "Leeds".to_string(),
            postal_code: "LS1 1AA".to_string(),
            country: "GB".to_string(),
            preferred_language: "en-GB".to_string(),
            contact_phone: "+44 20 0000 0000".to_string(),
        },
        problem_list: vec![Problem {
            description: "Type 2 diabetes".to_string(),
            icd10_code: "E11.9".to_string(),
            onset_date: "2015-01-01".to_string(),
            status: "active".to_string(),
        }],
        medication_summary: vec![Medication {
            name: "Metformin".to_string(),
            atc_code: "A10BA02".to_string(),
            dose: "500 mg".to_string(),
            frequency: "BD".to_string(),
            route: "PO".to_string(),
        }],
        allergies_intolerances: vec![Allergy {
            substance: "Penicillin".to_string(),
            reaction: "Rash".to_string(),
            severity: "moderate".to_string(),
            criticality: "low".to_string(),
        }],
        immunisations: vec![Immunisation {
            vaccine: "Influenza".to_string(),
            date: "2025-10-01".to_string(),
            lot_number: "LOT-001".to_string(),
        }],
        procedures: vec![Procedure {
            description: "Cholecystectomy".to_string(),
            date: "2020-03-12".to_string(),
            performer: "St James's Hospital".to_string(),
        }],
        results_investigations: vec![ResultEntry {
            test_name: "HbA1c".to_string(),
            value: "58".to_string(),
            unit: "mmol/mol".to_string(),
            interpretation: "high".to_string(),
            date: "2026-04-01".to_string(),
        }],
        medical_devices: vec![Device {
            description: "Cardiac pacemaker".to_string(),
            udi: "UDI-001".to_string(),
            implant_date: "2018-06-01".to_string(),
        }],
        advance_directives: AdvanceDirective {
            dnr_in_place: "no".to_string(),
            living_will_in_place: "no".to_string(),
            consent_to_share_eu: "yes".to_string(),
            directive_notes: String::new(),
        },
        authoring_clinician: AuthoringClinician {
            clinician_name: "Dr Alex Smith".to_string(),
            clinician_role: "General Practitioner".to_string(),
            organisation: "Leeds GP Practice".to_string(),
            country: "GB".to_string(),
            email: "alex.smith@example.com".to_string(),
            phone: "+44 113 000 0000".to_string(),
            signoff_date: "2026-06-01".to_string(),
            authoring_status: "final".to_string(),
        },
    }
}

#[test]
fn empty_ips_is_incomplete() {
    let data = AssessmentData::default();
    let result = validate(&data);
    assert_eq!(result.completeness_level, "incomplete");
    assert_eq!(result.mandatory_populated, 0);
    assert_eq!(result.mandatory_total, 8);
    assert_eq!(result.optional_populated, 0);
    assert_eq!(result.optional_total, 2);
}

#[test]
fn fully_populated_ips_is_complete() {
    let data = fully_populated_ips();
    let result = validate(&data);
    assert_eq!(result.completeness_level, "complete");
    assert_eq!(result.mandatory_populated, 8);
    assert_eq!(result.mandatory_total, 8);
    assert_eq!(result.optional_populated, 2);
    assert_eq!(result.optional_total, 2);
}

#[test]
fn all_mandatory_but_no_optional_is_partial() {
    let mut data = fully_populated_ips();
    data.medical_devices.clear();
    data.advance_directives = AdvanceDirective::default();
    let result = validate(&data);
    assert_eq!(result.completeness_level, "partial");
    assert_eq!(result.mandatory_populated, 8);
    assert_eq!(result.optional_populated, 0);
}

#[test]
fn missing_problem_list_is_incomplete() {
    let mut data = fully_populated_ips();
    data.problem_list.clear();
    let result = validate(&data);
    assert_eq!(result.completeness_level, "incomplete");
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
fn rule_ids_match_spec() {
    let rules = all_rules();
    let ids: Vec<&str> = rules.iter().map(|r| r.id).collect();
    assert_eq!(
        ids,
        vec![
            "IPS-001", "IPS-002", "IPS-003", "IPS-004", "IPS-005",
            "IPS-006", "IPS-007", "IPS-008", "IPS-009", "IPS-010"
        ]
    );
}

#[test]
fn optional_rules_surface_as_optional_when_empty() {
    let data = AssessmentData::default();
    let result = validate(&data);
    let optional = result
        .fired_rules
        .iter()
        .filter(|r| !r.mandatory)
        .collect::<Vec<_>>();
    assert!(!optional.is_empty());
    for r in optional {
        assert_eq!(r.status, "optional");
    }
}

#[test]
fn classify_completeness_helper_branches() {
    assert_eq!(classify_completeness(0, 8, 0, 2), "incomplete");
    assert_eq!(classify_completeness(8, 8, 0, 2), "partial");
    assert_eq!(classify_completeness(8, 8, 2, 2), "complete");
}

#[test]
fn label_helper_returns_capitalised_word() {
    assert_eq!(completeness_level_label("complete"), "Complete");
    assert_eq!(completeness_level_label("partial"), "Partial");
    assert_eq!(completeness_level_label("incomplete"), "Incomplete");
    assert_eq!(completeness_level_label("garbage"), "");
}
