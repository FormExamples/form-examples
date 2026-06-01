use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps (Demographics, Presenting Concern, Skin Inspection,
/// Hair & Scalp, Nails, Wound, Braden, Photography, Impression & Plan).
pub const TOTAL_STEPS: u32 = 9;

/// Build a Tera context for rendering the single-page assessment wizard.
/// All section partials share the same context.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("demographics", &data.demographics);
    context.insert("presenting_skin_concern", &data.presenting_skin_concern);
    context.insert("skin_inspection", &data.skin_inspection);
    context.insert("hair_scalp_examination", &data.hair_scalp_examination);
    context.insert("nail_examination", &data.nail_examination);
    context.insert("wound_assessment", &data.wound_assessment);
    context.insert("braden_scale", &data.braden_scale);
    context.insert(
        "photography_documentation",
        &data.photography_documentation,
    );
    context.insert(
        "clinical_impression_care_plan",
        &data.clinical_impression_care_plan,
    );
    context
}
