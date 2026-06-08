//! Responder rules module.

use super::types::AssessmentData;
use super::utils::competency_to_number;

/// A declarative grading rule. Each rule fires when its condition is met.
/// `grade` semantics: 1 = minor, 2 = moderate, 3 = significant, 4 = critical.
/// Rule IDs are preserved verbatim from the front-end JavaScript port.
pub struct ResponderRule {
    /// ID.
    pub id: &'static str,
    /// Domain.
    pub domain: &'static str,
    /// Description.
    pub description: &'static str,
    /// Grade.
    pub grade: u32,
    /// Evaluate.
    pub evaluate: fn(&AssessmentData) -> bool,
}

/// All First Responder rules (ported 1:1 from `responder-rules.js`).
pub fn all_rules() -> Vec<ResponderRule> {
    vec![
        // ─── PHYSICAL FITNESS ──────────────────────────────────────
        ResponderRule {
            id: "PF-001",
            domain: "Physical Fitness",
            description: "Cardiovascular fitness not competent",
            grade: 3,
            evaluate: |d| d.physical_fitness.cardiovascular_fitness == "not-competent",
        },
        ResponderRule {
            id: "PF-002",
            domain: "Physical Fitness",
            description: "Cardiovascular fitness developing",
            grade: 2,
            evaluate: |d| d.physical_fitness.cardiovascular_fitness == "developing",
        },
        ResponderRule {
            id: "PF-003",
            domain: "Physical Fitness",
            description: "Unable to carry patient on stretcher",
            grade: 4,
            evaluate: |d| d.physical_fitness.patient_carry_ability == "no",
        },
        ResponderRule {
            id: "PF-004",
            domain: "Physical Fitness",
            description: "Manual handling not competent",
            grade: 3,
            evaluate: |d| d.physical_fitness.manual_handling_competency == "not-competent",
        },
        ResponderRule {
            id: "PF-005",
            domain: "Physical Fitness",
            description: "Low VO2 max (<35 ml/kg/min)",
            grade: 2,
            evaluate: |d| matches!(d.physical_fitness.vo2_max, Some(v) if v < 35.0),
        },
        ResponderRule {
            id: "PF-006",
            domain: "Physical Fitness",
            description: "Very low VO2 max (<25 ml/kg/min)",
            grade: 3,
            evaluate: |d| matches!(d.physical_fitness.vo2_max, Some(v) if v < 25.0),
        },
        // ─── CLINICAL SKILLS ───────────────────────────────────────
        ResponderRule {
            id: "CS-001",
            domain: "Clinical Skills",
            description: "Basic life support not competent",
            grade: 4,
            evaluate: |d| d.clinical_skills.basic_life_support == "not-competent",
        },
        ResponderRule {
            id: "CS-002",
            domain: "Clinical Skills",
            description: "Advanced life support not competent",
            grade: 3,
            evaluate: |d| d.clinical_skills.advanced_life_support == "not-competent",
        },
        ResponderRule {
            id: "CS-003",
            domain: "Clinical Skills",
            description: "Airway management not competent",
            grade: 3,
            evaluate: |d| d.clinical_skills.airway_management == "not-competent",
        },
        ResponderRule {
            id: "CS-004",
            domain: "Clinical Skills",
            description: "Patient assessment not competent",
            grade: 4,
            evaluate: |d| d.clinical_skills.patient_assessment == "not-competent",
        },
        ResponderRule {
            id: "CS-005",
            domain: "Clinical Skills",
            description: "Trauma assessment not competent",
            grade: 3,
            evaluate: |d| d.clinical_skills.trauma_assessment == "not-competent",
        },
        ResponderRule {
            id: "CS-006",
            domain: "Clinical Skills",
            description: "Triage competency not competent",
            grade: 3,
            evaluate: |d| d.clinical_skills.triage_competency == "not-competent",
        },
        ResponderRule {
            id: "CS-007",
            domain: "Clinical Skills",
            description: "Drug administration not competent",
            grade: 3,
            evaluate: |d| d.clinical_skills.drug_administration == "not-competent",
        },
        ResponderRule {
            id: "CS-008",
            domain: "Clinical Skills",
            description: "Multiple clinical skills developing or below",
            grade: 2,
            evaluate: |d| {
                let skills = [
                    d.clinical_skills.basic_life_support.as_str(),
                    d.clinical_skills.advanced_life_support.as_str(),
                    d.clinical_skills.airway_management.as_str(),
                    d.clinical_skills.patient_assessment.as_str(),
                    d.clinical_skills.trauma_assessment.as_str(),
                ];
                let below_competent = skills
                    .iter()
                    .filter(|s| !s.is_empty() && competency_to_number(s) < 3)
                    .count();
                below_competent >= 3
            },
        },
        // ─── EQUIPMENT & VEHICLE ───────────────────────────────────
        ResponderRule {
            id: "EQ-001",
            domain: "Equipment",
            description: "Defibrillator competency not competent",
            grade: 4,
            evaluate: |d| d.equipment_vehicle.defibrillator_competency == "not-competent",
        },
        ResponderRule {
            id: "EQ-002",
            domain: "Equipment",
            description: "Emergency driving not competent",
            grade: 3,
            evaluate: |d| d.equipment_vehicle.emergency_driving == "not-competent",
        },
        ResponderRule {
            id: "EQ-003",
            domain: "Equipment",
            description: "Does not perform daily vehicle inspection",
            grade: 2,
            evaluate: |d| d.equipment_vehicle.vehicle_daily_inspection == "no",
        },
        ResponderRule {
            id: "EQ-004",
            domain: "Equipment",
            description: "Stretcher competency not competent",
            grade: 2,
            evaluate: |d| d.equipment_vehicle.stretcher_competency == "not-competent",
        },
        // ─── COMMUNICATION ─────────────────────────────────────────
        ResponderRule {
            id: "CM-001",
            domain: "Communication",
            description: "Handover competency not competent",
            grade: 3,
            evaluate: |d| d.communication_skills.handover_competency == "not-competent",
        },
        ResponderRule {
            id: "CM-002",
            domain: "Communication",
            description: "Documentation competency not competent",
            grade: 2,
            evaluate: |d| d.communication_skills.documentation_competency == "not-competent",
        },
        ResponderRule {
            id: "CM-003",
            domain: "Communication",
            description: "Safeguarding awareness not competent",
            grade: 3,
            evaluate: |d| d.communication_skills.safeguarding_awareness == "not-competent",
        },
        // ─── PSYCHOLOGICAL READINESS ───────────────────────────────
        ResponderRule {
            id: "PS-001",
            domain: "Psychological",
            description: "Positive PTSD screening result",
            grade: 4,
            evaluate: |d| {
                d.psychological_readiness.ptsd_screening == "yes"
                    && d.psychological_readiness.ptsd_screening_result == "positive"
            },
        },
        ResponderRule {
            id: "PS-002",
            domain: "Psychological",
            description: "High burnout risk",
            grade: 3,
            evaluate: |d| d.psychological_readiness.burnout_risk == "high",
        },
        ResponderRule {
            id: "PS-003",
            domain: "Psychological",
            description: "Poor sleep quality",
            grade: 2,
            evaluate: |d| d.psychological_readiness.sleep_quality == "poor",
        },
        ResponderRule {
            id: "PS-004",
            domain: "Psychological",
            description: "Decision making under pressure not competent",
            grade: 3,
            evaluate: |d| {
                d.psychological_readiness.decision_making_under_pressure == "not-competent"
            },
        },
        ResponderRule {
            id: "PS-005",
            domain: "Psychological",
            description: "Critical incident exposure without debriefing",
            grade: 2,
            evaluate: |d| {
                d.psychological_readiness.critical_incident_exposure == "yes"
                    && d.psychological_readiness.critical_incident_debriefed == "no"
            },
        },
        // ─── OCCUPATIONAL HEALTH ───────────────────────────────────
        ResponderRule {
            id: "OH-001",
            domain: "Occupational Health",
            description: "Failed vision test",
            grade: 3,
            evaluate: |d| d.occupational_health.vision_test == "fail",
        },
        ResponderRule {
            id: "OH-002",
            domain: "Occupational Health",
            description: "Failed hearing test",
            grade: 3,
            evaluate: |d| d.occupational_health.hearing_test == "fail",
        },
        ResponderRule {
            id: "OH-003",
            domain: "Occupational Health",
            description: "Positive substance misuse screen",
            grade: 4,
            evaluate: |d| d.occupational_health.substance_misuse_screen == "positive",
        },
        ResponderRule {
            id: "OH-004",
            domain: "Occupational Health",
            description: "Immunisations incomplete",
            grade: 2,
            evaluate: |d| d.occupational_health.immunisation_status == "incomplete",
        },
        ResponderRule {
            id: "OH-005",
            domain: "Occupational Health",
            description: "Musculoskeletal issues present",
            grade: 2,
            evaluate: |d| d.occupational_health.musculoskeletal_issues == "yes",
        },
        ResponderRule {
            id: "OH-006",
            domain: "Occupational Health",
            description: "Excessive sickness absence (>20 days)",
            grade: 2,
            evaluate: |d| matches!(d.occupational_health.sickness_absence_days, Some(n) if n > 20),
        },
        // ─── CPD & TRAINING ────────────────────────────────────────
        ResponderRule {
            id: "TR-001",
            domain: "Training",
            description: "Mandatory training incomplete",
            grade: 3,
            evaluate: |d| d.cpd_training.mandatory_training_complete == "no",
        },
        ResponderRule {
            id: "TR-002",
            domain: "Training",
            description: "CPD hours below requirement",
            grade: 2,
            evaluate: |d| match (d.cpd_training.cpd_hours_last_year, d.cpd_training.cpd_hours_required) {
                (Some(have), Some(need)) => have < need,
                _ => false,
            },
        },
    ]
}
