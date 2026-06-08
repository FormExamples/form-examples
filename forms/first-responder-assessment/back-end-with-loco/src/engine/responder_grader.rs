//! Responder grader module.

use super::flagged_issues::detect_additional_flags;
use super::responder_rules::all_rules;
use super::types::{
    AssessmentData, CompetencyLevel, DomainLevels, FiredRule, FitnessDecision, GradingResult,
    RiskLevel,
};
use super::utils::aggregate_competency;

/// Pure function: evaluates all first responder rules against assessment
/// data. Returns domain competency levels, overall fitness decision, and all
/// fired rules. Mirrors the front-end `calculateResponderGrade` function.
pub fn calculate_responder_grade(data: &AssessmentData) -> GradingResult {
    let fired_rules = run_rules(data);
    let domain_levels = derive_domain_levels(data);
    let overall_competency = derive_overall_competency(&domain_levels);
    let overall_fitness = derive_overall_fitness(data, &fired_rules, &overall_competency);
    let overall_risk = derive_overall_risk(&fired_rules, &overall_competency);
    let additional_flags = detect_additional_flags(data);

    GradingResult {
        overall_competency,
        overall_fitness,
        overall_risk,
        domain_levels,
        fired_rules,
        additional_flags,
        timestamp: chrono::Utc::now().to_rfc3339(),
    }
}

/// Evaluate every rule against the data, returning the rules that fired.
pub fn run_rules(data: &AssessmentData) -> Vec<FiredRule> {
    let mut out = Vec::new();
    for rule in all_rules() {
        if (rule.evaluate)(data) {
            out.push(FiredRule {
                id: rule.id.to_string(),
                domain: rule.domain.to_string(),
                description: rule.description.to_string(),
                grade: rule.grade,
            });
        }
    }
    out
}

/// Derive domain competency levels from raw assessment data.
pub fn derive_domain_levels(d: &AssessmentData) -> DomainLevels {
    DomainLevels {
        physical_fitness: aggregate_competency(&[
            d.physical_fitness.cardiovascular_fitness.as_str(),
            d.physical_fitness.muscular_strength.as_str(),
            d.physical_fitness.manual_handling_competency.as_str(),
            d.physical_fitness.flexibility_mobility.as_str(),
            d.physical_fitness.balance_coordination.as_str(),
        ]),
        clinical_skills: aggregate_competency(&[
            d.clinical_skills.basic_life_support.as_str(),
            d.clinical_skills.advanced_life_support.as_str(),
            d.clinical_skills.airway_management.as_str(),
            d.clinical_skills.patient_assessment.as_str(),
            d.clinical_skills.trauma_assessment.as_str(),
            d.clinical_skills.triage_competency.as_str(),
            d.clinical_skills.drug_administration.as_str(),
        ]),
        equipment_vehicle: aggregate_competency(&[
            d.equipment_vehicle.defibrillator_competency.as_str(),
            d.equipment_vehicle.monitor_competency.as_str(),
            d.equipment_vehicle.stretcher_competency.as_str(),
            d.equipment_vehicle.ambulance_driving.as_str(),
            d.equipment_vehicle.equipment_check_competency.as_str(),
        ]),
        communication: aggregate_competency(&[
            d.communication_skills.patient_communication.as_str(),
            d.communication_skills.handover_competency.as_str(),
            d.communication_skills.documentation_competency.as_str(),
            d.communication_skills.safeguarding_awareness.as_str(),
        ]),
        psychological: aggregate_competency(&[
            d.psychological_readiness.stress_management.as_str(),
            d.psychological_readiness
                .decision_making_under_pressure
                .as_str(),
            d.psychological_readiness.emotional_regulation.as_str(),
        ]),
    }
}

/// Derive overall competency from the worst domain level.
fn derive_overall_competency(levels: &DomainLevels) -> CompetencyLevel {
    aggregate_competency(&[
        levels.physical_fitness.as_str(),
        levels.clinical_skills.as_str(),
        levels.equipment_vehicle.as_str(),
        levels.communication.as_str(),
        levels.psychological.as_str(),
    ])
}

/// Derive overall fitness decision. If the assessor has already set a
/// decision in `fitness_decision.overallFitness` use it directly; otherwise
/// auto-derive from the fired rules and overall competency.
fn derive_overall_fitness(
    data: &AssessmentData,
    fired_rules: &[FiredRule],
    overall_competency: &str,
) -> FitnessDecision {
    if !data.fitness_decision.overall_fitness.is_empty() {
        return data.fitness_decision.overall_fitness.clone();
    }

    let max_grade = fired_rules.iter().map(|r| r.grade).max().unwrap_or(0);

    if max_grade >= 4 {
        return "permanently-unfit".to_string();
    }
    if max_grade >= 3 || overall_competency == "not-competent" {
        return "temporarily-unfit".to_string();
    }
    if max_grade >= 2 || overall_competency == "developing" {
        return "fit-with-restrictions".to_string();
    }
    "fit-for-duty".to_string()
}

/// Derive overall risk from fired rules and overall competency.
fn derive_overall_risk(fired_rules: &[FiredRule], overall_competency: &str) -> RiskLevel {
    let max_grade = fired_rules.iter().map(|r| r.grade).max().unwrap_or(0);

    if max_grade >= 4 || overall_competency == "not-competent" {
        return "critical".to_string();
    }
    if max_grade >= 3 {
        return "high".to_string();
    }
    if max_grade >= 2 || overall_competency == "developing" {
        return "moderate".to_string();
    }
    "low".to_string()
}
