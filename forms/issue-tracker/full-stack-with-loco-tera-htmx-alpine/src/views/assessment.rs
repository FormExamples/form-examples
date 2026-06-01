use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps. The issue tracker is a 10-step single-page wizard.
pub const TOTAL_STEPS: u32 = 10;

/// Build a Tera context for rendering the single-page issue-tracker wizard.
/// All section partials share the same context.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("reporter", &data.reporter);
    context.insert("cc", &data.cc);
    context.insert("pt", &data.pt);
    context.insert("sx", &data.sx);
    context.insert("fx", &data.fx);
    context.insert("hx", &data.hx);
    context.insert("ix", &data.ix);
    context.insert("dx", &data.dx);
    context.insert("txpx", &data.txpx);
    context.insert("scores", &data.scores);
    context
}
