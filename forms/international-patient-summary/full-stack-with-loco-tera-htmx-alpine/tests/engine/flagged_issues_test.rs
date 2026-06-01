use international_patient_summary_tera_crate::engine::flagged_issues::detect_additional_flags;
use international_patient_summary_tera_crate::engine::types::*;

fn baseline_ips() -> AssessmentData {
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
            ..Default::default()
        }],
        medication_summary: vec![Medication {
            name: "Metformin".to_string(),
            dose: "500 mg".to_string(),
            ..Default::default()
        }],
        allergies_intolerances: vec![Allergy {
            substance: "no-known-allergies".to_string(),
            severity: "mild".to_string(),
            criticality: "low".to_string(),
            ..Default::default()
        }],
        immunisations: vec![Immunisation {
            vaccine: "Influenza".to_string(),
            ..Default::default()
        }],
        procedures: vec![Procedure {
            description: "Cholecystectomy".to_string(),
            ..Default::default()
        }],
        results_investigations: vec![ResultEntry {
            test_name: "HbA1c".to_string(),
            ..Default::default()
        }],
        advance_directives: AdvanceDirective {
            consent_to_share_eu: "yes".to_string(),
            ..Default::default()
        },
        authoring_clinician: AuthoringClinician {
            clinician_name: "Dr Alex Smith".to_string(),
            clinician_role: "GP".to_string(),
            organisation: "Leeds GP Practice".to_string(),
            country: "GB".to_string(),
            signoff_date: "2026-06-01".to_string(),
            authoring_status: "final".to_string(),
            ..Default::default()
        },
        ..AssessmentData::default()
    }
}

#[test]
fn baseline_has_no_high_or_urgent_flags() {
    let flags = detect_additional_flags(&baseline_ips());
    let critical = flags
        .iter()
        .filter(|f| f.priority == "urgent" || f.priority == "high")
        .count();
    assert_eq!(
        critical, 0,
        "baseline should not produce urgent / high flags: {flags:?}"
    );
}

#[test]
fn severe_allergy_emits_urgent_flag() {
    let mut data = baseline_ips();
    data.allergies_intolerances = vec![Allergy {
        substance: "Penicillin".to_string(),
        reaction: "Anaphylaxis".to_string(),
        severity: "severe".to_string(),
        criticality: "high".to_string(),
    }];
    let flags = detect_additional_flags(&data);
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-ALLERGY-HIGH-0")
        .expect("severe allergy flag");
    assert_eq!(flag.priority, "urgent");
    assert!(flag.message.contains("Penicillin"));
}

#[test]
fn missing_name_emits_high_flag() {
    let mut data = baseline_ips();
    data.patient_demographics.given_name = String::new();
    data.patient_demographics.family_name = String::new();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-PT-001" && f.priority == "high")
    );
}

#[test]
fn missing_dob_emits_high_flag() {
    let mut data = baseline_ips();
    data.patient_demographics.date_of_birth = String::new();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-PT-002" && f.priority == "high")
    );
}

#[test]
fn draft_authoring_status_emits_medium_flag() {
    let mut data = baseline_ips();
    data.authoring_clinician.authoring_status = "draft".to_string();
    let flags = detect_additional_flags(&data);
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-AUTH-001")
        .expect("draft signoff flag");
    assert_eq!(flag.priority, "medium");
}

#[test]
fn no_consent_emits_urgent_flag() {
    let mut data = baseline_ips();
    data.advance_directives.consent_to_share_eu = "no".to_string();
    let flags = detect_additional_flags(&data);
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-CONSENT-001")
        .expect("no-consent flag");
    assert_eq!(flag.priority, "urgent");
}

#[test]
fn dnr_in_place_emits_high_flag() {
    let mut data = baseline_ips();
    data.advance_directives.dnr_in_place = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-AD-001" && f.priority == "high")
    );
}

#[test]
fn missing_problem_list_emits_high_flag() {
    let mut data = baseline_ips();
    data.problem_list.clear();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-CLIN-001" && f.priority == "high")
    );
}

#[test]
fn medication_without_dose_emits_low_flag() {
    let mut data = baseline_ips();
    data.medication_summary = vec![Medication {
        name: "Metformin".to_string(),
        dose: String::new(),
        ..Default::default()
    }];
    let flags = detect_additional_flags(&data);
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-DQ-MED-0")
        .expect("missing-dose flag");
    assert_eq!(flag.priority, "low");
}

#[test]
fn flags_are_sorted_by_priority() {
    let mut data = baseline_ips();
    data.allergies_intolerances = vec![Allergy {
        substance: "Latex".to_string(),
        severity: "severe".to_string(),
        criticality: "high".to_string(),
        ..Default::default()
    }];
    data.advance_directives.dnr_in_place = "yes".to_string();
    data.patient_demographics.preferred_language = String::new();
    let flags = detect_additional_flags(&data);
    let priorities: Vec<&str> = flags.iter().map(|f| f.priority.as_str()).collect();
    let mut sorted = priorities.clone();
    sorted.sort_by_key(|p| match *p {
        "urgent" => 0,
        "high" => 1,
        "medium" => 2,
        "low" => 3,
        _ => 4,
    });
    assert_eq!(priorities, sorted);
}
