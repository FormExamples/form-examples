use workplace_safety_assessment_tera_crate::engine::rules::all_rules;
use workplace_safety_assessment_tera_crate::engine::safety_grader::{grade, highest_outcome};
use workplace_safety_assessment_tera_crate::engine::types::*;

/// Build a workplace-safety audit with every "no-is-bad" answered yes and
/// every "yes-is-bad" answered no — a fully compliant site.
fn fully_compliant_audit() -> AssessmentData {
    AssessmentData {
        site_details: SiteDetails {
            auditor_name: "Pat Jones".to_string(),
            auditor_role: "Safety Officer".to_string(),
            audit_date: "2026-06-01".to_string(),
            site_name: "St James's Hospital".to_string(),
            site_address: "Beckett St, Leeds".to_string(),
            department_area: "Ward 4".to_string(),
            site_manager: "Lee Park".to_string(),
            previous_audit_date: "2025-12-01".to_string(),
            previous_findings_closed: "yes".to_string(),
        },
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
            lifting_aids_available: "yes".to_string(),
            dse_assessments_completed: "yes".to_string(),
            workstations_adjustable: "yes".to_string(),
            repetitive_strain_concerns: "no".to_string(),
            patient_handling_plans_in_place: "yes".to_string(),
            observations: String::new(),
        },
        emergency_procedures: EmergencyProcedures {
            evacuation_procedure_posted: "yes".to_string(),
            first_aid_kits_stocked: "yes".to_string(),
            first_aider_roster_current: "yes".to_string(),
            aed_available: "yes".to_string(),
            aed_service_in_date: "yes".to_string(),
            emergency_contacts_displayed: "yes".to_string(),
            drill_conducted_last12_months: "yes".to_string(),
            observations: String::new(),
        },
        training_competence: TrainingCompetence {
            mandatory_training_up_to_date: "yes".to_string(),
            fire_marshals_trained: "yes".to_string(),
            manual_handling_training_current: "yes".to_string(),
            infection_control_training_current: "yes".to_string(),
            training_records_accessible: "yes".to_string(),
            induction_for_new_starters_completed: "yes".to_string(),
            observations: String::new(),
        },
        incident_reporting: IncidentReporting {
            incident_reporting_system_used: "yes".to_string(),
            riddor_reportable_incidents_reported: "yes".to_string(),
            near_miss_reporting_active: "yes".to_string(),
            incidents_last12_months: Some(2),
            near_misses_last12_months: Some(15),
            lessons_learned_shared: "yes".to_string(),
            actions_from_incidents_tracked: "yes".to_string(),
            observations: String::new(),
        },
        signoff_action_plan: SignoffActionPlan {
            action_items: vec![],
            overall_summary: "Site fully compliant.".to_string(),
            auditor_signature: "Pat Jones".to_string(),
            signoff_date: "2026-06-01".to_string(),
            debrief_delivered: "yes".to_string(),
        },
    }
}

#[test]
fn empty_audit_is_compliant_and_zero_answered() {
    let data = AssessmentData::default();
    let result = grade(&data);
    assert_eq!(result.outcome, "compliant");
    assert_eq!(result.answered_count, 0);
    assert!(result.fired_rules.is_empty());
}

#[test]
fn fully_compliant_audit_grades_compliant() {
    let data = fully_compliant_audit();
    let result = grade(&data);
    assert_eq!(result.outcome, "compliant");
    // Every rule in all_rules() should be answered.
    assert_eq!(result.answered_count as usize, all_rules().len());
}

#[test]
fn coshh_missing_yields_critical_outcome() {
    let mut data = fully_compliant_audit();
    data.chemical_biological_hazards.coshh_register_present = "no".to_string();
    let result = grade(&data);
    assert_eq!(result.outcome, "critical");
    assert!(result.fired_rules.iter().any(|r| r.id == "WS-009" && r.grade == 4));
}

#[test]
fn damaged_electrical_yields_critical_outcome() {
    let mut data = fully_compliant_audit();
    data.electrical_safety.damaged_equipment_observed = "yes".to_string();
    let result = grade(&data);
    assert_eq!(result.outcome, "critical");
    assert!(result.fired_rules.iter().any(|r| r.id == "WS-020" && r.grade == 4));
}

#[test]
fn signage_no_yields_minor_outcome() {
    let mut data = fully_compliant_audit();
    data.ppe_hazard_controls.signage_legible = "no".to_string();
    let result = grade(&data);
    assert_eq!(result.outcome, "minor");
    assert!(result.fired_rules.iter().any(|r| r.id == "WS-006" && r.grade == 2));
}

#[test]
fn slip_trip_no_yields_major_outcome() {
    let mut data = fully_compliant_audit();
    data.ppe_hazard_controls.slip_trip_hazards_controlled = "no".to_string();
    let result = grade(&data);
    assert_eq!(result.outcome, "major");
    assert!(result.fired_rules.iter().any(|r| r.id == "WS-008" && r.grade == 3));
}

#[test]
fn unanswered_items_do_not_fire() {
    let mut data = fully_compliant_audit();
    data.ppe_hazard_controls.ppe_available = String::new();
    let result = grade(&data);
    // No rule fires for the unanswered item; outcome remains compliant.
    assert!(result.fired_rules.iter().all(|r| r.id != "WS-002"));
    assert_eq!(result.outcome, "compliant");
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
fn highest_outcome_picks_worst() {
    let fired = vec![
        FiredRule {
            id: "X".to_string(),
            category: "X".to_string(),
            description: "X".to_string(),
            grade: 2,
        },
        FiredRule {
            id: "Y".to_string(),
            category: "Y".to_string(),
            description: "Y".to_string(),
            grade: 4,
        },
    ];
    assert_eq!(highest_outcome(&fired), "critical");
}
