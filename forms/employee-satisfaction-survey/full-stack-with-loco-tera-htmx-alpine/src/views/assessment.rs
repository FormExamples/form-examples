use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps (10 steps: demographics through overall experience).
pub const TOTAL_STEPS: u32 = 10;

/// Build a Tera context for rendering the single-page survey wizard.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("demographics", &data.demographics);
    context.insert("role_tenure", &data.role_tenure);
    context.insert("workload", &data.workload);
    context.insert("management", &data.management);
    context.insert("growth", &data.growth);
    context.insert("compensation", &data.compensation);
    context.insert("culture", &data.culture);
    context.insert("environment", &data.environment);
    context.insert("recognition", &data.recognition);
    context.insert("overall", &data.overall);
    context
}
