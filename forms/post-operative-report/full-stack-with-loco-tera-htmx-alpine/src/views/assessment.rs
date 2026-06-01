use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps (matches the 10 steps in `index.md`).
pub const TOTAL_STEPS: u32 = 10;

/// Build a Tera context for rendering the single-page post-operative report wizard.
/// All section partials share the same context.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("patient_details", &data.patient_details);
    context.insert("procedure_details", &data.procedure_details);
    context.insert("surgical_team", &data.surgical_team);
    context.insert("intraoperative_findings", &data.intraoperative_findings);
    context.insert("anaesthesia_summary", &data.anaesthesia_summary);
    context.insert("blood_loss_fluid_balance", &data.blood_loss_fluid_balance);
    context.insert("specimens_implants", &data.specimens_implants);
    context.insert("immediate_postop_status", &data.immediate_postop_status);
    context.insert("complications_assessment", &data.complications_assessment);
    context.insert("postop_plan_instructions", &data.postop_plan_instructions);
    context
}
