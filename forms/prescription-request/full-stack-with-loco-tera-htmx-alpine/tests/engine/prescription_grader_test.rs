use prescription_request_tera_crate::engine::prescription_grader::{
    calculate_priority_level, grade, run_rules,
};
use prescription_request_tera_crate::engine::prescription_rules::all_rules;
use prescription_request_tera_crate::engine::types::*;

/// Build a fully-populated, conservative baseline request: medication and
/// dosage filled in, both contact details supplied, substitutions allowed,
/// new prescription, not an emergency.
fn baseline_request() -> AssessmentData {
    AssessmentData {
        patient_information: PatientInformation {
            first_name: "Alice".to_string(),
            last_name: "Adams".to_string(),
            phone: "07123 456789".to_string(),
            email: "alice@example.org".to_string(),
            nhs_number: "943 476 5919".to_string(),
        },
        clinician_information: ClinicianInformation {
            first_name: "Bob".to_string(),
            last_name: "Brown".to_string(),
            phone: "020 7946 0000".to_string(),
            email: "bob.brown@example.org".to_string(),
            nhs_employee_number: "C1234567".to_string(),
        },
        prescription_details: PrescriptionDetails {
            request_date: "2026-06-01".to_string(),
            medication_name: "Amoxicillin".to_string(),
            dosage: "500mg".to_string(),
            frequency: "TDS".to_string(),
            route_of_administration: "oral".to_string(),
            treatment_instructions: "Take with food.".to_string(),
        },
        substitution_options: SubstitutionOptions {
            allow_brand_substitution: "yes".to_string(),
            allow_generic_substitution: "yes".to_string(),
            allow_dosage_adjustment: "yes".to_string(),
            substitution_notes: String::new(),
        },
        request_type: RequestType {
            is_new_prescription: "yes".to_string(),
            is_emergency: "no".to_string(),
            additional_notes: String::new(),
        },
    }
}

#[test]
fn empty_request_defaults_to_routine() {
    let data = AssessmentData::default();
    let (level, _fired) = calculate_priority_level(&data);
    assert_eq!(level, "routine");
}

#[test]
fn emergency_request_classifies_as_emergency() {
    let mut data = baseline_request();
    data.request_type.is_emergency = "yes".to_string();
    let result = grade(&data);
    assert_eq!(result.priority_level, "emergency");
    assert!(result.fired_rules.iter().any(|r| r.id == "RX-EM-001"));
}

#[test]
fn no_substitution_makes_it_urgent() {
    let mut data = baseline_request();
    data.substitution_options.allow_brand_substitution = "no".to_string();
    let result = grade(&data);
    assert_eq!(result.priority_level, "urgent");
    assert!(result.fired_rules.iter().any(|r| r.id == "RX-SUB-001"));
}

#[test]
fn baseline_new_prescription_is_routine() {
    let data = baseline_request();
    let result = grade(&data);
    assert_eq!(result.priority_level, "routine");
    assert!(result.fired_rules.iter().any(|r| r.id == "RX-NEW-001"));
}

#[test]
fn missing_medication_fires_completeness_rule() {
    let mut data = baseline_request();
    data.prescription_details.medication_name = String::new();
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "RX-CMP-003"));
}

#[test]
fn missing_dosage_fires_completeness_rule() {
    let mut data = baseline_request();
    data.prescription_details.dosage = String::new();
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "RX-CMP-004"));
}

#[test]
fn missing_contact_fires_completeness_rules() {
    let mut data = baseline_request();
    data.patient_information.phone = String::new();
    data.patient_information.email = String::new();
    data.clinician_information.phone = String::new();
    data.clinician_information.email = String::new();
    let fired = run_rules(&data);
    assert!(fired.iter().any(|r| r.id == "RX-CMP-001"));
    assert!(fired.iter().any(|r| r.id == "RX-CMP-002"));
}

#[test]
fn emergency_dominates_urgent() {
    let mut data = baseline_request();
    data.request_type.is_emergency = "yes".to_string();
    data.substitution_options.allow_brand_substitution = "no".to_string();
    let (level, _fired) = calculate_priority_level(&data);
    assert_eq!(level, "emergency");
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
