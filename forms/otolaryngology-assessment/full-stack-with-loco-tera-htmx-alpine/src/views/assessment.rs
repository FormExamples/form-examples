use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps (10 sections per the otolaryngology assessment design).
pub const TOTAL_STEPS: u32 = 10;

/// Build a Tera context for rendering the single-page assessment wizard.
/// All section partials share the same context.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("demographics", &data.demographics);
    context.insert("presenting_complaint", &data.presenting_complaint);
    context.insert(
        "history_of_present_illness",
        &data.history_of_present_illness,
    );
    context.insert("past_ent_history", &data.past_ent_history);
    context.insert("snot22", &data.snot22);
    context.insert("external_examination", &data.external_examination);
    context.insert("otoscopy", &data.otoscopy);
    context.insert("anterior_rhinoscopy", &data.anterior_rhinoscopy);
    context.insert(
        "oropharyngeal_neck_examination",
        &data.oropharyngeal_neck_examination,
    );
    context.insert(
        "clinical_impression_plan",
        &data.clinical_impression_plan,
    );
    context
}
