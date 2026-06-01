use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps (Candidate/Examiner/Scenario, Scene Size-Up,
/// Primary Survey, History & Secondary, Reassessment, Critical Criteria).
pub const TOTAL_STEPS: u32 = 6;

/// Build a Tera context for rendering the single-page wizard.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("candidate_examiner_scenario", &data.candidate_examiner_scenario);
    context.insert("scene_size_up", &data.scene_size_up);
    context.insert("primary_survey", &data.primary_survey);
    context.insert("history_secondary_assessment", &data.history_secondary_assessment);
    context.insert("reassessment", &data.reassessment);
    context.insert("critical_criteria_review", &data.critical_criteria_review);
    context
}
