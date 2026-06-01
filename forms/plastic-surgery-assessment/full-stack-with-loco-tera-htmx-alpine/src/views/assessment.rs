use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps.
pub const TOTAL_STEPS: u32 = 10;

/// Build a Tera context for rendering the single-page plastic-surgery wizard.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("demographics", &data.demographics);
    context.insert("reason_for_referral", &data.reason_for_referral);
    context.insert("medical_surgical_history", &data.medical_surgical_history);
    context.insert("current_condition", &data.current_condition);
    context.insert("wound_tissue_assessment", &data.wound_tissue_assessment);
    context.insert("psychological_assessment", &data.psychological_assessment);
    context.insert("anaesthetic_risk", &data.anaesthetic_risk);
    context.insert(
        "photography_documentation",
        &data.photography_documentation,
    );
    context.insert("medications_allergies", &data.medications_allergies);
    context.insert(
        "procedure_planning_consent",
        &data.procedure_planning_consent,
    );
    context
}
