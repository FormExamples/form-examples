use hospital_discharge_tera_crate::engine::discharge_validator::{grade, validate_discharge};
use hospital_discharge_tera_crate::engine::types::*;
use hospital_discharge_tera_crate::engine::validation_rules::all_rules;

/// Build a complete discharge summary that satisfies every NICE NG27
/// mandatory and optional rule.
fn fully_completed_discharge() -> AssessmentData {
    AssessmentData {
        patient_details: PatientDetails {
            first_name: "Jane".to_string(),
            last_name: "Doe".to_string(),
            date_of_birth: "1972-04-11".to_string(),
            sex: "female".to_string(),
            nhs_number: "943 476 5919".to_string(),
            hospital_number: "MRN-001".to_string(),
            address: "1 Acacia Avenue".to_string(),
            postcode: "LS1 1AA".to_string(),
            phone: "01132000000".to_string(),
            gp_name: "Dr A Singh".to_string(),
            gp_practice: "Headingley Surgery".to_string(),
            next_of_kin_name: "John Doe".to_string(),
            next_of_kin_phone: "07700000000".to_string(),
        },
        admission_summary: AdmissionSummary {
            admission_date: "2026-05-25".to_string(),
            discharge_date: "2026-05-30".to_string(),
            ward: "Ward 12".to_string(),
            consultant: "Mr A Smith".to_string(),
            specialty: "General Medicine".to_string(),
            reason_for_admission: "Community-acquired pneumonia.".to_string(),
            presenting_complaint: "Cough and fever.".to_string(),
            clinical_narrative: "Treated with IV antibiotics; switched to oral.".to_string(),
        },
        diagnoses: Diagnoses {
            diagnoses: vec![Diagnosis {
                description: "Community-acquired pneumonia".to_string(),
                icd10: "J18.9".to_string(),
                kind: "primary".to_string(),
            }],
        },
        procedures_performed: ProceduresPerformed {
            procedures: vec![],
            no_procedures_performed: "yes".to_string(),
        },
        discharge_medications: DischargeMedications {
            medications: vec![Medication {
                name: "Amoxicillin".to_string(),
                dose: "500 mg".to_string(),
                route: "oral".to_string(),
                frequency: "tds".to_string(),
                duration: "5 days".to_string(),
                status: "new".to_string(),
                indication: "Pneumonia".to_string(),
            }],
            reconciliation_completed: "yes".to_string(),
            reconciliation_notes: String::new(),
            allergies_reviewed: "yes".to_string(),
            allergy_notes: "NKDA".to_string(),
        },
        followup_arrangements: FollowupArrangements {
            appointments: vec![FollowupAppointment {
                provider: "Respiratory Clinic".to_string(),
                date: "2026-06-15".to_string(),
                location: "St James's".to_string(),
                purpose: "Review chest x-ray".to_string(),
            }],
            gp_followup_required: "yes".to_string(),
            gp_followup_timeframe: "within 2 weeks".to_string(),
            outpatient_followup_required: "yes".to_string(),
            investigations_pending: "no".to_string(),
            pending_investigation_details: String::new(),
            results_to_be_chased_by_gp: "no".to_string(),
        },
        community_care_instructions: CommunityCareInstructions {
            discharge_destination: "home".to_string(),
            other_destination_details: String::new(),
            care_responsibility: "self".to_string(),
            transport_mode: "walking".to_string(),
            district_nurse_referral: "no".to_string(),
            social_services_referral: "no".to_string(),
            physiotherapy_referral: "no".to_string(),
            occupational_therapy_referral: "no".to_string(),
            package_of_care_in_place: "no".to_string(),
            mobility_status: "Independent".to_string(),
            dietary_requirements: String::new(),
            wound_care_instructions: String::new(),
            equipment_provided: String::new(),
        },
        warning_signs: WarningSigns {
            red_flag_symptoms: vec![],
            when_to_seek_help: "Return to ED if breathless or fever > 39 \u{00b0}C.".to_string(),
            emergency_contact_number: "111".to_string(),
            safety_neting_provided: "yes".to_string(),
            written_info_given: "yes".to_string(),
        },
        clinician_signoff: ClinicianSignoff {
            clinician_name: "Dr B Jones".to_string(),
            clinician_role: "Registrar".to_string(),
            gmc_number: "1234567".to_string(),
            signoff_date: "2026-05-30".to_string(),
            bleep_or_contact: "Bleep 1234".to_string(),
            responsible_consultant_informed: "yes".to_string(),
            additional_notes: String::new(),
        },
        patient_acknowledgement: PatientAcknowledgement {
            patient_understands_plan: "yes".to_string(),
            carer_informed: "yes".to_string(),
            carer_name: "John Doe".to_string(),
            medications_explained: "yes".to_string(),
            written_summary_provided: "yes".to_string(),
            questions_answered: "yes".to_string(),
            acknowledgement_date: "2026-05-30".to_string(),
            signed_by: "Jane Doe".to_string(),
        },
    }
}

#[test]
fn empty_assessment_is_incomplete() {
    let data = AssessmentData::default();
    let result = grade(&data);
    assert_eq!(result.completeness_level, "incomplete");
    assert!(result.mandatory_satisfied < result.mandatory_total);
}

#[test]
fn fully_completed_is_complete() {
    let data = fully_completed_discharge();
    let result = grade(&data);
    assert_eq!(result.completeness_level, "complete");
    assert_eq!(result.mandatory_satisfied, result.mandatory_total);
    assert_eq!(result.optional_satisfied, result.optional_total);
}

#[test]
fn missing_optional_only_yields_partial() {
    let mut data = fully_completed_discharge();
    // Drop optional NG27-O-002 (next of kin) and NG27-O-006 (written info).
    data.patient_details.next_of_kin_name = String::new();
    data.warning_signs.written_info_given = "no".to_string();
    let result = grade(&data);
    assert_eq!(result.completeness_level, "partial");
    assert_eq!(result.mandatory_satisfied, result.mandatory_total);
    assert!(result.optional_satisfied < result.optional_total);
}

#[test]
fn missing_mandatory_yields_incomplete() {
    let mut data = fully_completed_discharge();
    data.patient_details.nhs_number = String::new();
    let result = grade(&data);
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
fn ng27_m_001_fires_for_missing_first_name() {
    let mut data = fully_completed_discharge();
    data.patient_details.first_name = String::new();
    let (_, _, _, _, _, rules) = validate_discharge(&data);
    let r = rules.iter().find(|r| r.id == "NG27-M-001").unwrap();
    assert!(!r.satisfied);
    assert!(r.mandatory);
}

#[test]
fn ng27_m_011_satisfied_when_no_procedures_marked_yes() {
    let mut data = fully_completed_discharge();
    data.procedures_performed.procedures.clear();
    data.procedures_performed.no_procedures_performed = "yes".to_string();
    let (_, _, _, _, _, rules) = validate_discharge(&data);
    let r = rules.iter().find(|r| r.id == "NG27-M-011").unwrap();
    assert!(r.satisfied);
}
