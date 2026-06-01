use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps (Case details, Sign In, Time Out, Sign Out, Summary).
pub const TOTAL_STEPS: u32 = 5;

/// Build a Tera context for rendering the single-page checklist wizard.
/// All section partials share the same context.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("case_details", &data.case_details);
    context.insert("sign_in", &data.sign_in);
    context.insert("time_out", &data.time_out);
    context.insert("sign_out", &data.sign_out);
    context.insert("team_members", &data.team_members);
    context
}
