use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps (10 NG201 sections).
pub const TOTAL_STEPS: u32 = 10;

/// Build a Tera context for rendering the single-page assessment wizard.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("maternal_demographics", &data.maternal_demographics);
    context.insert("obstetric_history", &data.obstetric_history);
    context.insert("medical_history", &data.medical_history);
    context.insert("current_pregnancy", &data.current_pregnancy);
    context.insert("lifestyle_social_factors", &data.lifestyle_social_factors);
    context.insert("screening_results", &data.screening_results);
    context.insert("mental_health_assessment", &data.mental_health_assessment);
    context.insert("fetal_assessment", &data.fetal_assessment);
    context.insert("birth_preferences", &data.birth_preferences);
    context.insert("care_plan_followup", &data.care_plan_followup);
    context
}
