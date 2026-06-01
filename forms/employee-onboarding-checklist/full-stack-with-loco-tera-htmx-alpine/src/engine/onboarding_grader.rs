use super::flagged_issues::detect_additional_flags;
use super::onboarding_rules::all_rules;
use super::types::{AssessmentData, FiredRule, GradingResult};
use super::utils::derive_completion_status;

/// Pure function: grade an employee onboarding checklist.
///
/// Returns a [`GradingResult`] containing the completion percentage,
/// status, overall risk level, items completed / total counts, fired
/// rules, and the safety flags raised independently of completion.
pub fn grade(data: &AssessmentData) -> GradingResult {
    let timestamp = chrono::Utc::now().to_rfc3339();
    let fired_rules = run_rules(data);
    let additional_flags = detect_additional_flags(data);

    let (completed, total) = count_completed_items(data);
    let completion_percentage = if total > 0 {
        ((completed as f64 / total as f64) * 1000.0).round() / 10.0
    } else {
        0.0
    };

    let completion_status = derive_completion_status(completion_percentage);
    let overall_risk = derive_overall_risk(&fired_rules, completion_percentage);

    GradingResult {
        completion_percentage,
        completion_status,
        overall_risk,
        items_completed: completed,
        items_total: total,
        fired_rules,
        additional_flags,
        timestamp,
    }
}

/// Evaluate every rule against the data, returning fired rules.
pub fn run_rules(data: &AssessmentData) -> Vec<FiredRule> {
    let mut out = Vec::new();
    for rule in all_rules() {
        if (rule.evaluate)(data) {
            out.push(FiredRule {
                id: rule.id.to_string(),
                category: rule.category.to_string(),
                description: rule.description.to_string(),
                grade: rule.grade,
            });
        }
    }
    out
}

/// Count completed checklist items across all sections.
/// Mirrors `countCompletedItems` from onboarding-grader.js.
pub fn count_completed_items(data: &AssessmentData) -> (u32, u32) {
    let mut completed: u32 = 0;
    let mut total: u32 = 0;

    let mut track = |done: bool| {
        total += 1;
        if done {
            completed += 1;
        }
    };

    // Pre-Employment (4)
    track(data.pre_employment_checks.dbs_check_status == "cleared");
    track(data.pre_employment_checks.right_to_work_verified == "yes");
    track(data.pre_employment_checks.references_satisfactory == "yes");
    track(data.pre_employment_checks.identity_verified == "yes");

    // Occupational Health (3)
    track(data.occupational_health.oh_clearance_received == "yes");
    track(data.occupational_health.fit_to_work == "yes");
    track(data.occupational_health.immunisation_status == "complete");

    // Mandatory Training (9)
    track(data.mandatory_training.fire_safety_completed == "yes");
    track(data.mandatory_training.manual_handling_completed == "yes");
    track(data.mandatory_training.infection_control_completed == "yes");
    track(data.mandatory_training.safeguarding_adults_completed == "yes");
    track(data.mandatory_training.safeguarding_children_completed == "yes");
    track(data.mandatory_training.information_governance_completed == "yes");
    track(data.mandatory_training.basic_life_support_completed == "yes");
    track(data.mandatory_training.equality_diversity_completed == "yes");
    track(data.mandatory_training.health_safety_completed == "yes");

    // Professional Registration (1, only counted if required)
    if data.professional_registration.registration_required == "yes" {
        track(data.professional_registration.registration_verified == "yes");
    }

    // IT Systems (3)
    track(data.it_systems_access.email_account_created == "yes");
    track(data.it_systems_access.network_login_created == "yes");
    track(data.it_systems_access.clinical_system_access == "yes");

    // Uniform & ID (2)
    track(data.uniform_id_badge.id_badge_issued == "yes");
    track(data.uniform_id_badge.access_card_issued == "yes");

    // Induction (2)
    track(data.induction_programme.corporate_induction_completed == "yes");
    track(data.induction_programme.local_induction_completed == "yes");

    // Probation (1)
    track(data.probation_supervision.objectives_set == "yes");

    // Sign-off (3)
    track(data.sign_off_compliance.confidentiality_agreement_signed == "yes");
    track(data.sign_off_compliance.gdpr_training_completed == "yes");
    track(data.sign_off_compliance.manager_signed_off == "yes");

    (completed, total)
}

/// Derive overall risk from fired rules and completion percentage.
pub fn derive_overall_risk(fired_rules: &[FiredRule], completion_percentage: f64) -> String {
    let max_grade = fired_rules.iter().map(|r| r.grade).max().unwrap_or(0);

    if max_grade >= 4 || completion_percentage < 10.0 {
        return "critical".to_string();
    }
    if max_grade >= 3 || completion_percentage < 30.0 {
        return "high".to_string();
    }
    if max_grade >= 2 || completion_percentage < 70.0 {
        return "moderate".to_string();
    }
    "low".to_string()
}
