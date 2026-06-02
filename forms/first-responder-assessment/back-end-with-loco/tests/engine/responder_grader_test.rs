use first_responder_assessment_loco_crate::engine::responder_grader::{
    calculate_responder_grade, run_rules,
};
use first_responder_assessment_loco_crate::engine::responder_rules::all_rules;
use first_responder_assessment_loco_crate::engine::types::*;

/// Build a competent responder where every key competency is "competent".
fn competent_responder() -> AssessmentData {
    let mut d = AssessmentData::default();
    d.demographics.first_name = "Jane".to_string();
    d.demographics.last_name = "Doe".to_string();
    d.role_qualifications.role_type = "paramedic".to_string();
    d.role_qualifications.employer_organisation = "South West Ambulance Service".to_string();
    d.physical_fitness.cardiovascular_fitness = "competent".to_string();
    d.physical_fitness.muscular_strength = "competent".to_string();
    d.physical_fitness.manual_handling_competency = "competent".to_string();
    d.physical_fitness.patient_carry_ability = "yes".to_string();
    d.physical_fitness.flexibility_mobility = "competent".to_string();
    d.physical_fitness.balance_coordination = "competent".to_string();
    d.clinical_skills.basic_life_support = "competent".to_string();
    d.clinical_skills.advanced_life_support = "competent".to_string();
    d.clinical_skills.airway_management = "competent".to_string();
    d.clinical_skills.patient_assessment = "competent".to_string();
    d.clinical_skills.trauma_assessment = "competent".to_string();
    d.clinical_skills.triage_competency = "competent".to_string();
    d.clinical_skills.drug_administration = "competent".to_string();
    d.equipment_vehicle.defibrillator_competency = "competent".to_string();
    d.equipment_vehicle.monitor_competency = "competent".to_string();
    d.equipment_vehicle.stretcher_competency = "competent".to_string();
    d.equipment_vehicle.ambulance_driving = "competent".to_string();
    d.equipment_vehicle.emergency_driving = "competent".to_string();
    d.equipment_vehicle.equipment_check_competency = "competent".to_string();
    d.equipment_vehicle.vehicle_daily_inspection = "yes".to_string();
    d.communication_skills.patient_communication = "competent".to_string();
    d.communication_skills.handover_competency = "competent".to_string();
    d.communication_skills.documentation_competency = "competent".to_string();
    d.communication_skills.safeguarding_awareness = "competent".to_string();
    d.psychological_readiness.stress_management = "competent".to_string();
    d.psychological_readiness.decision_making_under_pressure = "competent".to_string();
    d.psychological_readiness.emotional_regulation = "competent".to_string();
    d.psychological_readiness.ptsd_screening = "no".to_string();
    d.psychological_readiness.burnout_risk = "low".to_string();
    d.occupational_health.vision_test = "pass".to_string();
    d.occupational_health.hearing_test = "pass".to_string();
    d.occupational_health.immunisation_status = "up-to-date".to_string();
    d.occupational_health.substance_misuse_screen = "negative".to_string();
    d.occupational_health.musculoskeletal_issues = "no".to_string();
    d.cpd_training.mandatory_training_complete = "yes".to_string();
    d.fitness_decision.assessment_date = "2026-06-01".to_string();
    d
}

#[test]
fn fully_competent_responder_is_fit_for_duty() {
    let d = competent_responder();
    let g = calculate_responder_grade(&d);
    assert_eq!(g.overall_competency, "competent");
    assert_eq!(g.overall_fitness, "fit-for-duty");
    assert_eq!(g.overall_risk, "low");
    assert!(g.fired_rules.is_empty(), "rules: {:?}", g.fired_rules);
    assert!(g.additional_flags.is_empty(), "flags: {:?}", g.additional_flags);
}

#[test]
fn bls_not_competent_fires_cs_001_and_flag_bls() {
    let mut d = competent_responder();
    d.clinical_skills.basic_life_support = "not-competent".to_string();
    let g = calculate_responder_grade(&d);
    assert!(g.fired_rules.iter().any(|r| r.id == "CS-001" && r.grade == 4));
    assert!(g.additional_flags.iter().any(|f| f.id == "FLAG-BLS-001" && f.priority == "high"));
    assert_eq!(g.overall_fitness, "permanently-unfit");
    assert_eq!(g.overall_risk, "critical");
}

#[test]
fn ptsd_positive_fires_ps_001_and_flag() {
    let mut d = competent_responder();
    d.psychological_readiness.ptsd_screening = "yes".to_string();
    d.psychological_readiness.ptsd_screening_result = "positive".to_string();
    let g = calculate_responder_grade(&d);
    assert!(g.fired_rules.iter().any(|r| r.id == "PS-001" && r.grade == 4));
    assert!(g.additional_flags.iter().any(|f| f.id == "FLAG-PTSD-001" && f.priority == "high"));
}

#[test]
fn unable_to_carry_fires_pf_003_and_flag() {
    let mut d = competent_responder();
    d.physical_fitness.patient_carry_ability = "no".to_string();
    let g = calculate_responder_grade(&d);
    assert!(g.fired_rules.iter().any(|r| r.id == "PF-003" && r.grade == 4));
    assert!(g.additional_flags.iter().any(|f| f.id == "FLAG-CARRY-001"));
}

#[test]
fn assessor_override_takes_precedence() {
    let mut d = competent_responder();
    // Even with no bad rules, assessor records "temporarily-unfit".
    d.fitness_decision.overall_fitness = "temporarily-unfit".to_string();
    let g = calculate_responder_grade(&d);
    assert_eq!(g.overall_fitness, "temporarily-unfit");
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
fn vo2_max_low_fires_pf_005_only() {
    let mut d = competent_responder();
    d.physical_fitness.vo2_max = Some(30.0);
    let fired = run_rules(&d);
    assert!(fired.iter().any(|r| r.id == "PF-005"));
    assert!(!fired.iter().any(|r| r.id == "PF-006"));
}

#[test]
fn vo2_max_very_low_fires_both() {
    let mut d = competent_responder();
    d.physical_fitness.vo2_max = Some(20.0);
    let fired = run_rules(&d);
    assert!(fired.iter().any(|r| r.id == "PF-005"));
    assert!(fired.iter().any(|r| r.id == "PF-006"));
}

#[test]
fn developing_only_yields_fit_with_restrictions() {
    let mut d = competent_responder();
    d.physical_fitness.cardiovascular_fitness = "developing".to_string();
    let g = calculate_responder_grade(&d);
    // Rule PF-002 (grade 2) should fire; domain becomes developing.
    assert!(g.fired_rules.iter().any(|r| r.id == "PF-002"));
    assert_eq!(g.overall_fitness, "fit-with-restrictions");
}
