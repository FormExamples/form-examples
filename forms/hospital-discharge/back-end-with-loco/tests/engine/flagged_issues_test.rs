use hospital_discharge_loco_crate::engine::flagged_issues::detect_additional_flags;
use hospital_discharge_loco_crate::engine::types::*;

/// Baseline: a clean discharge summary that should produce no flags.
fn baseline() -> AssessmentData {
    AssessmentData {
        patient_details: PatientDetails {
            first_name: "Jane".to_string(),
            last_name: "Doe".to_string(),
            ..PatientDetails::default()
        },
        admission_summary: AdmissionSummary {
            admission_date: "2026-05-25".to_string(),
            discharge_date: "2026-05-30".to_string(),
            ..AdmissionSummary::default()
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
                provider: "Respiratory".to_string(),
                date: "2026-06-15".to_string(),
                location: "".to_string(),
                purpose: "".to_string(),
            }],
            gp_followup_required: "yes".to_string(),
            gp_followup_timeframe: String::new(),
            outpatient_followup_required: "yes".to_string(),
            investigations_pending: "no".to_string(),
            pending_investigation_details: String::new(),
            results_to_be_chased_by_gp: "no".to_string(),
        },
        community_care_instructions: CommunityCareInstructions {
            discharge_destination: "home".to_string(),
            care_responsibility: "self".to_string(),
            ..CommunityCareInstructions::default()
        },
        warning_signs: WarningSigns {
            when_to_seek_help: "Return to ED if breathless.".to_string(),
            safety_neting_provided: "yes".to_string(),
            written_info_given: "yes".to_string(),
            ..WarningSigns::default()
        },
        clinician_signoff: ClinicianSignoff {
            clinician_name: "Dr B Jones".to_string(),
            clinician_role: "Registrar".to_string(),
            signoff_date: "2026-05-30".to_string(),
            responsible_consultant_informed: "yes".to_string(),
            ..ClinicianSignoff::default()
        },
        patient_acknowledgement: PatientAcknowledgement {
            patient_understands_plan: "yes".to_string(),
            carer_informed: "yes".to_string(),
            medications_explained: "yes".to_string(),
            written_summary_provided: "yes".to_string(),
            questions_answered: "yes".to_string(),
            ..PatientAcknowledgement::default()
        },
    }
}

#[test]
fn baseline_has_no_flags() {
    let flags = detect_additional_flags(&baseline());
    assert!(flags.is_empty(), "baseline should not produce flags: {flags:?}");
}

#[test]
fn missing_reconciliation_emits_urgent_flag() {
    let mut data = baseline();
    data.discharge_medications.reconciliation_completed = "no".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-MEDS-001" && f.priority == "urgent")
    );
}

#[test]
fn missing_allergy_review_emits_urgent_flag() {
    let mut data = baseline();
    data.discharge_medications.allergies_reviewed = "no".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-MEDS-002" && f.priority == "urgent")
    );
}

#[test]
fn pending_investigations_without_chase_plan_flags() {
    let mut data = baseline();
    data.followup_arrangements.investigations_pending = "yes".to_string();
    data.followup_arrangements.results_to_be_chased_by_gp = "no".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-FU-001"));
}

#[test]
fn no_follow_up_emits_flag() {
    let mut data = baseline();
    data.followup_arrangements.gp_followup_required = "no".to_string();
    data.followup_arrangements.outpatient_followup_required = "no".to_string();
    data.followup_arrangements.appointments.clear();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-FU-002"));
}

#[test]
fn no_primary_diagnosis_emits_flag() {
    let mut data = baseline();
    data.diagnoses.diagnoses.clear();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-DX-001"));
}

#[test]
fn care_home_without_carer_informed_emits_flag() {
    let mut data = baseline();
    data.community_care_instructions.discharge_destination = "care-home".to_string();
    data.patient_acknowledgement.carer_informed = "no".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-DEST-001"));
}

#[test]
fn discharge_before_admission_flag() {
    let mut data = baseline();
    data.admission_summary.admission_date = "2026-05-30".to_string();
    data.admission_summary.discharge_date = "2026-05-25".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-DATE-001" && f.priority == "urgent")
    );
}

#[test]
fn prolonged_stay_flag() {
    let mut data = baseline();
    data.admission_summary.admission_date = "2026-04-01".to_string();
    data.admission_summary.discharge_date = "2026-04-30".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-DATE-002"));
}

#[test]
fn patient_misunderstanding_emits_urgent_flag() {
    let mut data = baseline();
    data.patient_acknowledgement.patient_understands_plan = "no".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-ACK-001" && f.priority == "urgent")
    );
}

#[test]
fn missing_safety_netting_emits_high_flag() {
    let mut data = baseline();
    data.warning_signs.safety_neting_provided = "no".to_string();
    let flags = detect_additional_flags(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-SAFE-001" && f.priority == "high")
    );
}

#[test]
fn flags_sorted_urgent_first() {
    let mut data = baseline();
    data.discharge_medications.reconciliation_completed = "no".to_string(); // urgent
    data.warning_signs.safety_neting_provided = "no".to_string(); // high
    data.patient_acknowledgement.questions_answered = "no".to_string(); // medium
    data.warning_signs.written_info_given = "no".to_string(); // low
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
