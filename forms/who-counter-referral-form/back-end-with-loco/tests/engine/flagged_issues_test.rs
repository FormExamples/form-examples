use who_counter_referral_form_loco_crate::engine::flagged_issues::detect_flagged_issues;
use who_counter_referral_form_loco_crate::engine::types::*;

fn baseline_case() -> AssessmentData {
    AssessmentData {
        facility_details: FacilityDetails {
            communication: FacilityCommunication {
                discussed_with_primary_care_provider: true,
                discussed_with_initiating_facility: true,
            },
            follow_up_timeframe: "1-to-2-weeks".to_string(),
            ..FacilityDetails::default()
        },
        recommendations: Recommendations {
            deterioration_instructions:
                "If fever or worsening pain, attend A&E immediately.".to_string(),
            ..Recommendations::default()
        },
        ..AssessmentData::default()
    }
}

#[test]
fn baseline_has_no_flags() {
    let flags = detect_flagged_issues(&baseline_case());
    assert!(flags.is_empty(), "baseline should not produce flags: {flags:?}");
}

#[test]
fn urgent_follow_up_emits_urgent_flag() {
    let mut data = baseline_case();
    data.facility_details.follow_up_timeframe = "urgent-within-24-hours".to_string();
    let flags = detect_flagged_issues(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-FU-001" && f.priority == FlagPriority::Urgent)
    );
}

#[test]
fn missing_deterioration_instructions_emits_urgent_flag() {
    let mut data = baseline_case();
    data.recommendations.deterioration_instructions = String::new();
    let flags = detect_flagged_issues(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-DET-001" && f.priority == FlagPriority::Urgent)
    );
}

#[test]
fn communication_breakdown_emits_high_flag() {
    let mut data = baseline_case();
    data.facility_details
        .communication
        .discussed_with_primary_care_provider = false;
    data.facility_details
        .communication
        .discussed_with_initiating_facility = false;
    let flags = detect_flagged_issues(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-COM-001" && f.priority == FlagPriority::High)
    );
}

#[test]
fn palliative_care_emits_high_flag() {
    let mut data = baseline_case();
    data.recommendations.status_flags.palliative_care = true;
    let flags = detect_flagged_issues(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-PAL-001" && f.priority == FlagPriority::High)
    );
}

#[test]
fn patient_family_not_informed_emits_high_flag() {
    let mut data = baseline_case();
    data.assessment.patient_family_informed = "no".to_string();
    let flags = detect_flagged_issues(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-INF-001" && f.priority == FlagPriority::High)
    );
}

#[test]
fn icu_stay_emits_medium_flag() {
    let mut data = baseline_case();
    data.situation.icu_stay = true;
    let flags = detect_flagged_issues(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-ICU-001" && f.priority == FlagPriority::Medium)
    );
}

#[test]
fn pending_investigations_emits_low_flag() {
    let mut data = baseline_case();
    data.recommendations.pending_investigations = "MRI report awaited.".to_string();
    let flags = detect_flagged_issues(&data);
    assert!(
        flags
            .iter()
            .any(|f| f.id == "FLAG-INV-001" && f.priority == FlagPriority::Low)
    );
}

#[test]
fn flags_are_sorted_by_priority() {
    let mut data = baseline_case();
    // Trigger urgent, high, medium, low.
    data.facility_details.follow_up_timeframe = "urgent-within-24-hours".to_string();
    data.assessment.patient_family_informed = "no".to_string();
    data.situation.icu_stay = true;
    data.recommendations.pending_investigations = "Pending histology.".to_string();
    let flags = detect_flagged_issues(&data);

    fn order(p: FlagPriority) -> u8 {
        match p {
            FlagPriority::Urgent => 0,
            FlagPriority::High => 1,
            FlagPriority::Medium => 2,
            FlagPriority::Low => 3,
        }
    }
    let priorities: Vec<u8> = flags.iter().map(|f| order(f.priority)).collect();
    let mut sorted = priorities.clone();
    sorted.sort();
    assert_eq!(priorities, sorted);
}
