use outpatient_outcome_tera_crate::engine::flagged_issues::detect_flagged_issues;
use outpatient_outcome_tera_crate::engine::types::*;

fn baseline() -> AssessmentData {
    AssessmentData {
        operational_efficiency: OperationalEfficiency {
            nhs_attendance_outcome: "attended_discharged".to_string(),
            wait_time_days: Some(20),
            service_target_days: Some(42),
            ..OperationalEfficiency::default()
        },
        prem_fft: PremFft {
            fft_response: "likely".to_string(),
            fft_comment: String::new(),
        },
        prom_grc: PromGrc {
            global_rating_of_change: Some(1),
            self_rated_health: "good".to_string(),
        },
        ..AssessmentData::default()
    }
}

#[test]
fn baseline_emits_no_critical_flags() {
    let flags = detect_flagged_issues(&baseline(), &"B".to_string(), &"B".to_string());
    assert!(!flags.iter().any(|f| f.priority == "critical"));
}

#[test]
fn dna_emits_critical_flag() {
    let mut data = baseline();
    data.operational_efficiency.nhs_attendance_outcome = "patient_dna".to_string();
    let flags = detect_flagged_issues(&data, &"".to_string(), &"".to_string());
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-OPS-001" && f.priority == "critical")
    );
}

#[test]
fn wait_time_above_1_5x_emits_medium_flag() {
    let mut data = baseline();
    data.operational_efficiency.wait_time_days = Some(100);
    data.operational_efficiency.service_target_days = Some(42);
    let flags = detect_flagged_issues(&data, &"".to_string(), &"".to_string());
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-OPS-003" && f.priority == "medium")
    );
}

#[test]
fn wait_time_above_target_emits_low_flag() {
    let mut data = baseline();
    data.operational_efficiency.wait_time_days = Some(50);
    data.operational_efficiency.service_target_days = Some(42);
    let flags = detect_flagged_issues(&data, &"".to_string(), &"".to_string());
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-OPS-004" && f.priority == "low")
    );
}

#[test]
fn clinical_worsened_emits_high_flag() {
    let data = baseline();
    let flags = detect_flagged_issues(&data, &"D".to_string(), &"".to_string());
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-CLIN-001" && f.priority == "high")
    );
}

#[test]
fn missing_eq5d_after_emits_data_quality_flag() {
    let data = baseline();
    let flags = detect_flagged_issues(&data, &"".to_string(), &"".to_string());
    assert!(flags.iter().any(|f| f.id == "FLAG-DQ-001"));
}

#[test]
fn flags_sorted_critical_first() {
    let mut data = baseline();
    data.operational_efficiency.nhs_attendance_outcome = "patient_dna".to_string();
    let flags = detect_flagged_issues(&data, &"D".to_string(), &"D".to_string());
    let priorities: Vec<&str> = flags.iter().map(|f| f.priority.as_str()).collect();
    let mut sorted = priorities.clone();
    sorted.sort_by_key(|p| match *p {
        "critical" => 0,
        "high" => 1,
        "medium" => 2,
        "low" => 3,
        _ => 4,
    });
    assert_eq!(priorities, sorted);
}
