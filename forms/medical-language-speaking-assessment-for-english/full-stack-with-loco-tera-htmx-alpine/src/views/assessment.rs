use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps (Candidate, Role-play 1, Role-play 2, Linguistic
/// Criteria, Clinical Indicators / Overall Grade).
pub const TOTAL_STEPS: u32 = 5;

/// Build a Tera context for rendering the single-page assessment wizard.
/// All section partials share the same context.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("candidate", &data.candidate);
    context.insert("role_play1", &data.role_play1);
    context.insert("role_play2", &data.role_play2);
    context.insert("linguistic_role_play1", &data.linguistic_role_play1);
    context.insert("linguistic_role_play2", &data.linguistic_role_play2);
    context.insert("clinical_indicators", &data.clinical_indicators);
    context
}
