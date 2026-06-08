//! Grader module.

use super::flagged_issues::detect_additional_flags;
use super::rules::all_rules;
use super::types::{AssessmentData, DomainScores, FiredRule, GradingResult};
use super::utils::{categorize_score, normalize_likert_scores};

/// Calculate normalized scores (0-100) for each satisfaction domain.
pub fn calculate_domain_scores(data: &AssessmentData) -> DomainScores {
    DomainScores {
        access: normalize_likert_scores(&[
            data.access_waiting_times.ease_of_booking,
            data.access_waiting_times.waiting_time_for_appointment,
            data.access_waiting_times.waiting_time_on_day,
            data.access_waiting_times.reception_service,
            data.access_waiting_times.signage_wayfinding,
            data.access_waiting_times.parking_transport,
        ]),
        communication: normalize_likert_scores(&[
            data.communication_information.explanation_of_condition,
            data.communication_information.explanation_of_treatment,
            data.communication_information.opportunity_to_ask_questions,
            data.communication_information.listened_to,
            data.communication_information.informed_about_medication,
            data.communication_information.written_information_quality,
        ]),
        clinical_care: normalize_likert_scores(&[
            data.clinical_care_quality.confidence_in_clinician,
            data.clinical_care_quality.thoroughness_of_examination,
            data.clinical_care_quality.pain_management,
            data.clinical_care_quality.involvement_in_decisions,
            data.clinical_care_quality.privacy_during_examination,
            data.clinical_care_quality.coordination_of_care,
        ]),
        staff: normalize_likert_scores(&[
            data.staff_attitude.doctor_courtesy,
            data.staff_attitude.nurse_courtesy,
            data.staff_attitude.reception_courtesy,
            data.staff_attitude.respect_for_dignity,
            data.staff_attitude.cultural_sensitivity,
            data.staff_attitude.emotional_support,
        ]),
        environment: normalize_likert_scores(&[
            data.environment_facilities.cleanliness,
            data.environment_facilities.comfort,
            data.environment_facilities.noise_levels,
            data.environment_facilities.food_quality,
            data.environment_facilities.toilet_facilities,
            data.environment_facilities.temperature_comfort,
        ]),
        discharge: normalize_likert_scores(&[
            data.discharge_follow_up.discharge_information,
            data.discharge_follow_up.medication_explanation,
            data.discharge_follow_up.follow_up_arrangements,
            data.discharge_follow_up.knew_who_to_contact,
            data.discharge_follow_up.recovery_information,
            data.discharge_follow_up.care_plan_clarity,
        ]),
        overall: normalize_likert_scores(&[
            data.overall_experience.overall_satisfaction,
            data.overall_experience.would_recommend,
            data.overall_experience.met_expectations,
            data.overall_experience.felt_safe,
            data.overall_experience.would_return,
        ]),
    }
}

/// Calculate the overall composite score as the mean of the per-domain
/// normalized scores. Domains with no answers are skipped. Returns 0 when
/// nothing has been answered.
pub fn calculate_overall_score(domains: &DomainScores) -> f64 {
    let scores: Vec<f64> = [
        domains.access,
        domains.communication,
        domains.clinical_care,
        domains.staff,
        domains.environment,
        domains.discharge,
        domains.overall,
    ]
    .into_iter()
    .flatten()
    .collect();

    if scores.is_empty() {
        return 0.0;
    }
    let mean: f64 = scores.iter().sum::<f64>() / scores.len() as f64;
    (mean * 10.0).round() / 10.0
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
                severity: rule.severity,
            });
        }
    }
    out
}

/// Pure function: grades a Patient Satisfaction Survey.
pub fn grade(data: &AssessmentData) -> GradingResult {
    let timestamp = chrono::Utc::now().to_rfc3339();
    let fired_rules = run_rules(data);
    let additional_flags = detect_additional_flags(data);
    let domain_scores = calculate_domain_scores(data);
    let normalized_score = calculate_overall_score(&domain_scores);
    let satisfaction_category = categorize_score(normalized_score);

    GradingResult {
        normalized_score,
        satisfaction_category,
        domain_scores,
        fired_rules,
        additional_flags,
        timestamp,
    }
}
