use tera::Context;
use uuid::Uuid;

use crate::engine::items::{PRACTICES_ITEMS, STAKEHOLDERS_ITEMS, TEAMS_ITEMS, all_items};
use crate::engine::types::AssessmentData;

/// Total wizard steps (Respondent, Teams, Stakeholders, Practices, Summary).
pub const TOTAL_STEPS: u32 = 5;

/// Build a Tera context for rendering the single-page agile-checklist wizard.
/// All step partials share this context.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("respondent", &data.respondent);
    context.insert("answers", &data.answers);
    context.insert("action_plan", &data.action_plan);
    context.insert("teams_items", TEAMS_ITEMS);
    context.insert("stakeholders_items", STAKEHOLDERS_ITEMS);
    context.insert("practices_items", PRACTICES_ITEMS);
    context.insert("total_items", &all_items().len());
    context
}
