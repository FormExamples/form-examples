use provider_transfer_request_tera_crate::engine::flagged_issues::detect_flagged_issues;
use provider_transfer_request_tera_crate::engine::types::*;

fn baseline() -> AssessmentData {
    AssessmentData {
        situation: Situation {
            urgency: "routine".to_string(),
            ..Default::default()
        },
        assessment: Assessment {
            conscious_level: "awake".to_string(),
            clinically_stable: "yes".to_string(),
            vital_signs: VitalSigns {
                heart_rate: Some(72.0),
                respiratory_rate: Some(14.0),
                systolic_blood_pressure: Some(120.0),
                diastolic_blood_pressure: Some(78.0),
                temperature_celsius: Some(36.8),
                oxygen_saturation: Some(98.0),
                news_score: Some(0.0),
            },
            ..Default::default()
        },
        ..Default::default()
    }
}

#[test]
fn baseline_has_no_flags() {
    let flags = detect_flagged_issues(&baseline());
    assert!(flags.is_empty(), "baseline should produce no flags: {flags:?}");
}

#[test]
fn emergent_urgency_emits_urgent_flag() {
    let mut data = baseline();
    data.situation.urgency = "emergent".to_string();
    let flags = detect_flagged_issues(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-URG-EMERG" && f.priority == "urgent")
    );
}

#[test]
fn not_stable_emits_urgent_flag() {
    let mut data = baseline();
    data.assessment.clinically_stable = "no".to_string();
    let flags = detect_flagged_issues(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-STAB-NO" && f.priority == "urgent")
    );
}

#[test]
fn unresponsive_emits_urgent_flag() {
    let mut data = baseline();
    data.assessment.conscious_level = "unresponsive".to_string();
    let flags = detect_flagged_issues(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-LOC-UNRESP" && f.priority == "urgent")
    );
}

#[test]
fn low_spo2_emits_urgent_flag() {
    let mut data = baseline();
    data.assessment.vital_signs.oxygen_saturation = Some(85.0);
    let flags = detect_flagged_issues(&data);
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-VIT-SPO2")
        .expect("oxygen saturation flag");
    assert_eq!(flag.priority, "urgent");
    assert!(flag.message.contains("85%"));
}

#[test]
fn news2_high_emits_urgent_flag() {
    let mut data = baseline();
    data.assessment.vital_signs.news_score = Some(8.0);
    let flags = detect_flagged_issues(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-VIT-NEWS-HIGH" && f.priority == "urgent")
    );
}

#[test]
fn news2_medium_emits_high_flag() {
    let mut data = baseline();
    data.assessment.vital_signs.news_score = Some(5.0);
    let flags = detect_flagged_issues(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-VIT-NEWS-MED" && f.priority == "high")
    );
}

#[test]
fn infectious_precautions_emits_high_flag() {
    let mut data = baseline();
    data.transfer_logistics.infectious_precautions = true;
    data.transfer_logistics.infectious_precautions_details =
        "Contact precautions for C. difficile.".to_string();
    let flags = detect_flagged_issues(&data);
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-INF-PRC")
        .expect("infection flag");
    assert_eq!(flag.priority, "high");
    assert!(flag.message.contains("C. difficile"));
}

#[test]
fn escort_required_emits_medium_flag() {
    let mut data = baseline();
    data.transfer_logistics.escort_required = true;
    data.transfer_logistics.escort_details = "Anaesthetic registrar".to_string();
    let flags = detect_flagged_issues(&data);
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-LOG-ESCORT")
        .expect("escort flag");
    assert_eq!(flag.priority, "medium");
}

#[test]
fn flags_are_sorted_by_priority() {
    let mut data = baseline();
    // urgent + high + medium + low expected.
    data.situation.urgency = "emergent".to_string(); // urgent
    data.assessment.vital_signs.systolic_blood_pressure = Some(80.0); // high
    data.transfer_logistics.oxygen_required = true; // medium
    data.signoff_acknowledgement.requesting_provider_signature =
        "Dr Hart".to_string(); // low (acknowledgement-pending)
    let flags = detect_flagged_issues(&data);

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

#[test]
fn acknowledgement_pending_emits_low_flag_only_when_signed() {
    let mut data = baseline();
    // Without signature -> no acknowledgement-pending flag.
    let flags = detect_flagged_issues(&data);
    assert!(!flags.iter().any(|f| f.id == "FLAG-ACK-PENDING"));

    // With signature but no acknowledgement -> flag fires.
    data.signoff_acknowledgement.requesting_provider_signature =
        "Dr Hart".to_string();
    let flags = detect_flagged_issues(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-ACK-PENDING" && f.priority == "low")
    );
}
