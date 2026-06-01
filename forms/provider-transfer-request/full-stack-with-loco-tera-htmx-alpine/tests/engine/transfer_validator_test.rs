use provider_transfer_request_tera_crate::engine::transfer_validator::validate_transfer;
use provider_transfer_request_tera_crate::engine::types::*;
use provider_transfer_request_tera_crate::engine::validation_rules::all_rules;

/// A fully populated, mandatory-complete transfer (acknowledgement not yet
/// started — that's intentional, to keep the acknowledgement rules outside
/// the applicable set in the baseline).
fn fully_completed() -> AssessmentData {
    AssessmentData {
        requesting_provider: ProviderDetails {
            clinician_name: "Dr Alice Hart".to_string(),
            clinician_role: "Registrar".to_string(),
            organisation: "St James's Hospital".to_string(),
            ward: "AMU".to_string(),
            phone: "0113 123 4567".to_string(),
            email: "alice.hart@example.org".to_string(),
            registration_body: "GMC".to_string(),
            registration_number: "GMC 1234567".to_string(),
        },
        receiving_provider: ProviderDetails {
            clinician_name: "Dr Bilal Khan".to_string(),
            clinician_role: "Consultant".to_string(),
            organisation: "Leeds General Infirmary".to_string(),
            ward: "HDU".to_string(),
            phone: "0113 765 4321".to_string(),
            email: String::new(),
            registration_body: String::new(),
            registration_number: String::new(),
        },
        patient_demographics: PatientDemographics {
            first_name: "Jane".to_string(),
            last_name: "Doe".to_string(),
            date_of_birth: "1972-04-11".to_string(),
            sex: "female".to_string(),
            nhs_number: "943 476 5919".to_string(),
            hospital_number: String::new(),
            address_line: "1 High Street".to_string(),
            postcode: "LS1 1AA".to_string(),
            next_of_kin_name: "John Doe".to_string(),
            next_of_kin_phone: "07700 900000".to_string(),
        },
        situation: Situation {
            reason_for_transfer: "Requires HDU monitoring.".to_string(),
            primary_diagnosis: "Acute pancreatitis".to_string(),
            urgency: "urgent".to_string(),
            transfer_type: "inter-hospital".to_string(),
            requested_date_time: "2026-06-01T10:00".to_string(),
        },
        background: Background {
            presenting_complaint: "Severe epigastric pain.".to_string(),
            relevant_history: "Admitted 24h ago.".to_string(),
            past_medical_history: "Cholelithiasis.".to_string(),
            current_medications: "Paracetamol 1g QDS.".to_string(),
            allergies: "NKDA".to_string(),
            recent_investigations: "Amylase 1200; CT pancreas pending.".to_string(),
            infection_status: "No known colonisation.".to_string(),
        },
        assessment: Assessment {
            current_clinical_status: "Comfortable on opioid analgesia.".to_string(),
            conscious_level: "awake".to_string(),
            vital_signs: VitalSigns {
                heart_rate: Some(82.0),
                respiratory_rate: Some(16.0),
                systolic_blood_pressure: Some(118.0),
                diastolic_blood_pressure: Some(76.0),
                temperature_celsius: Some(37.0),
                oxygen_saturation: Some(98.0),
                news_score: Some(1.0),
            },
            clinically_stable: "yes".to_string(),
            stability_notes: String::new(),
        },
        recommendation: Recommendation {
            requested_action: "Accept for HDU monitoring.".to_string(),
            expected_outcomes: "Resolution of pancreatitis.".to_string(),
            ongoing_care_plan: "Hourly observations; IV fluids; analgesia.".to_string(),
            pending_results: "CT pancreas; LFTs at 24h.".to_string(),
        },
        transfer_logistics: TransferLogistics {
            transport_mode: "ambulance".to_string(),
            departure_date_time: "2026-06-01T10:30".to_string(),
            estimated_arrival_date_time: "2026-06-01T11:15".to_string(),
            escort_required: false,
            escort_details: String::new(),
            oxygen_required: false,
            cardiac_monitoring_required: false,
            infectious_precautions: false,
            infectious_precautions_details: String::new(),
            falls_risk: false,
            mental_capacity_concerns: false,
            equipment_required: "Peripheral IV (right ACF).".to_string(),
        },
        signoff_acknowledgement: SignoffAcknowledgement {
            requesting_provider_signature: "Dr Alice Hart".to_string(),
            requesting_provider_signature_date: "2026-06-01".to_string(),
            ..Default::default()
        },
    }
}

#[test]
fn empty_assessment_is_incomplete() {
    let data = AssessmentData::default();
    let result = validate_transfer(&data);
    assert_eq!(result.completeness, "incomplete");
    assert_eq!(result.total_satisfied, 0);
    assert!(result.mandatory_required > 0);
}

#[test]
fn fully_completed_is_complete() {
    let data = fully_completed();
    let result = validate_transfer(&data);
    assert_eq!(result.completeness, "complete");
    assert_eq!(result.total_satisfied, result.total_required);
    assert_eq!(result.mandatory_satisfied, result.mandatory_required);
}

#[test]
fn missing_optional_is_partial() {
    let mut data = fully_completed();
    // Drop a single optional field.
    data.background.past_medical_history = String::new();
    data.recommendation.expected_outcomes = String::new();
    let result = validate_transfer(&data);
    assert_eq!(result.completeness, "partial");
    assert_eq!(result.mandatory_satisfied, result.mandatory_required);
    assert!(result.total_satisfied < result.total_required);
}

#[test]
fn missing_mandatory_is_incomplete() {
    let mut data = fully_completed();
    data.recommendation.requested_action = String::new();
    let result = validate_transfer(&data);
    assert_eq!(result.completeness, "incomplete");
    assert!(result.missing.iter().any(|m| m.id == "REC-01"));
}

#[test]
fn unstable_requires_stability_notes() {
    let mut data = fully_completed();
    data.assessment.clinically_stable = "no".to_string();
    data.assessment.stability_notes = String::new();
    let result = validate_transfer(&data);
    assert!(result.missing.iter().any(|m| m.id == "ASS-04"));
}

#[test]
fn escort_required_requires_escort_details() {
    let mut data = fully_completed();
    data.transfer_logistics.escort_required = true;
    data.transfer_logistics.escort_details = String::new();
    let result = validate_transfer(&data);
    assert!(result.missing.iter().any(|m| m.id == "LOG-04"));
}

#[test]
fn acknowledgement_gating_only_fires_once_touched() {
    let baseline = fully_completed();
    let baseline_result = validate_transfer(&baseline);
    assert!(!baseline_result.missing.iter().any(|m| m.id == "SGN-03"));

    let mut started = baseline.clone();
    started.signoff_acknowledgement.receiving_provider_name = "Dr Bilal Khan".to_string();
    let started_result = validate_transfer(&started);
    // Once the name is filled in, signature / signature date / checkbox fire.
    assert!(started_result.missing.iter().any(|m| m.id == "SGN-04"));
    assert!(started_result.missing.iter().any(|m| m.id == "SGN-05"));
    assert!(started_result.missing.iter().any(|m| m.id == "SGN-06"));
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
