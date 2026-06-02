use prescription_request_loco_crate::engine::flagged_issues::detect_additional_flags;
use prescription_request_loco_crate::engine::types::*;

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
fn baseline_has_no_flags() {
    let flags = detect_additional_flags(&baseline_request());
    assert!(flags.is_empty(), "baseline should not produce flags: {flags:?}");
}

#[test]
fn emergency_with_missing_phone_emits_high_flag() {
    let mut data = baseline_request();
    data.request_type.is_emergency = "yes".to_string();
    data.patient_information.phone = String::new();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-EMERG-INCOMPLETE" && f.priority == "high")
    );
}

#[test]
fn all_substitutions_denied_emits_high_flag() {
    let mut data = baseline_request();
    data.substitution_options.allow_brand_substitution = "no".to_string();
    data.substitution_options.allow_generic_substitution = "no".to_string();
    data.substitution_options.allow_dosage_adjustment = "no".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-NOSUB-001" && f.priority == "high"));
}

#[test]
fn missing_medication_emits_high_flag() {
    let mut data = baseline_request();
    data.prescription_details.medication_name = String::new();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-MED-001" && f.priority == "high"));
}

#[test]
fn missing_dosage_emits_high_flag() {
    let mut data = baseline_request();
    data.prescription_details.dosage = String::new();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-DOSE-001" && f.priority == "high"));
}

#[test]
fn missing_clinician_id_emits_medium_flag() {
    let mut data = baseline_request();
    data.clinician_information.nhs_employee_number = String::new();
    let flags = detect_additional_flags(&data);
    let flag = flags.iter().find(|f| f.id == "FLAG-CLIN-001").expect("clinician flag");
    assert_eq!(flag.priority, "medium");
}

#[test]
fn missing_patient_nhs_emits_medium_flag() {
    let mut data = baseline_request();
    data.patient_information.nhs_number = String::new();
    let flags = detect_additional_flags(&data);
    let flag = flags.iter().find(|f| f.id == "FLAG-PAT-001").expect("patient flag");
    assert_eq!(flag.priority, "medium");
}

#[test]
fn missing_instructions_emits_low_flag() {
    let mut data = baseline_request();
    data.prescription_details.treatment_instructions = String::new();
    let flags = detect_additional_flags(&data);
    let flag = flags.iter().find(|f| f.id == "FLAG-INSTR-001").expect("instructions flag");
    assert_eq!(flag.priority, "low");
}

#[test]
fn refill_without_date_emits_medium_flag() {
    let mut data = baseline_request();
    data.request_type.is_new_prescription = "no".to_string();
    data.prescription_details.request_date = String::new();
    let flags = detect_additional_flags(&data);
    let flag = flags.iter().find(|f| f.id == "FLAG-REFILL-001").expect("refill flag");
    assert_eq!(flag.priority, "medium");
}

#[test]
fn flags_are_sorted_by_priority() {
    let mut data = baseline_request();
    // Trigger a high, a medium, and a low.
    data.prescription_details.medication_name = String::new(); // high
    data.clinician_information.nhs_employee_number = String::new(); // medium
    data.prescription_details.treatment_instructions = String::new(); // low
    let flags = detect_additional_flags(&data);
    let priorities: Vec<&str> = flags.iter().map(|f| f.priority.as_str()).collect();
    let mut sorted = priorities.clone();
    sorted.sort_by_key(|p| match *p {
        "high" => 0,
        "medium" => 1,
        "low" => 2,
        _ => 3,
    });
    assert_eq!(priorities, sorted);
}
