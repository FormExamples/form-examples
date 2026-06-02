use workplace_safety_assessment_loco_crate::engine::flagged_issues::detect_additional_flags;
use workplace_safety_assessment_loco_crate::engine::types::*;

fn baseline_audit() -> AssessmentData {
    AssessmentData {
        ppe_hazard_controls: PPEHazardControls {
            ppe_available: "yes".to_string(),
            ppe_correctly_used: "yes".to_string(),
            ppe_stock_maintained: "yes".to_string(),
            hazard_signage_visible: "yes".to_string(),
            signage_legible: "yes".to_string(),
            housekeeping_satisfactory: "yes".to_string(),
            slip_trip_hazards_controlled: "yes".to_string(),
            observations: String::new(),
        },
        chemical_biological_hazards: ChemicalBiologicalHazards {
            coshh_register_present: "yes".to_string(),
            sds_available: "yes".to_string(),
            chemicals_labelled_correctly: "yes".to_string(),
            chemicals_stored_securely: "yes".to_string(),
            spill_kits_available: "yes".to_string(),
            untreated_spills_observed: "no".to_string(),
            sharps_containers_in_date: "yes".to_string(),
            clinical_waste_segregated: "yes".to_string(),
            biological_risk_assessment_current: "yes".to_string(),
            observations: String::new(),
        },
        electrical_safety: ElectricalSafety {
            pat_testing_in_date: "yes".to_string(),
            fixed_wiring_test_in_date: "yes".to_string(),
            damaged_equipment_observed: "no".to_string(),
            overloaded_sockets_observed: "no".to_string(),
            extension_leads_managed_safely: "yes".to_string(),
            consumer_unit_accessible: "yes".to_string(),
            observations: String::new(),
        },
        fire_safety: FireSafety {
            fire_risk_assessment_current: "yes".to_string(),
            fire_extinguishers_serviced: "yes".to_string(),
            fire_extinguishers_accessible: "yes".to_string(),
            fire_alarm_tested_weekly: "yes".to_string(),
            emergency_egress_clear: "yes".to_string(),
            emergency_lighting_functional: "yes".to_string(),
            fire_doors_held_open_illegally: "no".to_string(),
            assembly_point_signposted: "yes".to_string(),
            observations: String::new(),
        },
        ergonomics_manual_handling: ErgonomicsManualHandling {
            manual_handling_assessment_current: "yes".to_string(),
            ..ErgonomicsManualHandling::default()
        },
        training_competence: TrainingCompetence {
            mandatory_training_up_to_date: "yes".to_string(),
            infection_control_training_current: "yes".to_string(),
            ..TrainingCompetence::default()
        },
        incident_reporting: IncidentReporting {
            riddor_reportable_incidents_reported: "yes".to_string(),
            near_miss_reporting_active: "yes".to_string(),
            incidents_last12_months: Some(0),
            near_misses_last12_months: Some(0),
            ..IncidentReporting::default()
        },
        ..AssessmentData::default()
    }
}

#[test]
fn baseline_has_no_flags() {
    let flags = detect_additional_flags(&baseline_audit());
    assert!(flags.is_empty(), "baseline should not produce flags: {flags:?}");
}

#[test]
fn fire_extinguishers_not_serviced_emits_high_flag() {
    let mut data = baseline_audit();
    data.fire_safety.fire_extinguishers_serviced = "no".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-FIRE-001" && f.priority == "high"));
}

#[test]
fn blocked_egress_emits_high_flag() {
    let mut data = baseline_audit();
    data.fire_safety.emergency_egress_clear = "no".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-FIRE-002" && f.priority == "high"));
}

#[test]
fn damaged_electrical_emits_high_flag() {
    let mut data = baseline_audit();
    data.electrical_safety.damaged_equipment_observed = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-ELEC-001" && f.priority == "high"));
}

#[test]
fn untreated_spills_emits_high_flag() {
    let mut data = baseline_audit();
    data.chemical_biological_hazards.untreated_spills_observed = "yes".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-CHEM-001" && f.priority == "high"));
}

#[test]
fn coshh_missing_emits_high_flag() {
    let mut data = baseline_audit();
    data.chemical_biological_hazards.coshh_register_present = "no".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-CHEM-002" && f.priority == "high"));
}

#[test]
fn riddor_unreported_emits_high_flag() {
    let mut data = baseline_audit();
    data.incident_reporting.riddor_reportable_incidents_reported = "no".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-INC-001" && f.priority == "high"));
}

#[test]
fn under_reported_near_misses_emits_medium_flag() {
    let mut data = baseline_audit();
    data.incident_reporting.incidents_last12_months = Some(5);
    data.incident_reporting.near_misses_last12_months = Some(1);
    let flags = detect_additional_flags(&data);
    let flag = flags
        .iter()
        .find(|f| f.id == "FLAG-INC-003")
        .expect("under-reporting flag should fire");
    assert_eq!(flag.priority, "medium");
    assert!(flag.message.contains("(1)"));
    assert!(flag.message.contains("(5)"));
}

#[test]
fn signage_no_emits_low_flag() {
    let mut data = baseline_audit();
    data.ppe_hazard_controls.signage_legible = "no".to_string();
    let flags = detect_additional_flags(&data);
    assert!(flags.iter().any(|f| f.id == "FLAG-SIG-001" && f.priority == "low"));
}

#[test]
fn flags_sorted_by_priority() {
    let mut data = baseline_audit();
    // One high, one medium, one low.
    data.fire_safety.fire_extinguishers_serviced = "no".to_string(); // high
    data.ppe_hazard_controls.ppe_available = "no".to_string(); // medium
    data.ppe_hazard_controls.signage_legible = "no".to_string(); // low
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
