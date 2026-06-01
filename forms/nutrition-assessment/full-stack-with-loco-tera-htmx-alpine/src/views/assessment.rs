use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps (Demographics through Care Plan & Monitoring).
pub const TOTAL_STEPS: u32 = 10;

/// Build a Tera context for rendering the single-page nutrition-assessment
/// wizard. All section partials share the same context.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("demographics", &data.demographics);
    context.insert(
        "anthropometric_measurements",
        &data.anthropometric_measurements,
    );
    context.insert("dietary_history", &data.dietary_history);
    context.insert("nutritional_screening", &data.nutritional_screening);
    context.insert("swallowing_oral_health", &data.swallowing_oral_health);
    context.insert(
        "gastrointestinal_function",
        &data.gastrointestinal_function,
    );
    context.insert(
        "food_allergies_intolerances",
        &data.food_allergies_intolerances,
    );
    context.insert(
        "nutritional_requirements",
        &data.nutritional_requirements,
    );
    context.insert(
        "current_nutritional_support",
        &data.current_nutritional_support,
    );
    context.insert("care_plan_monitoring", &data.care_plan_monitoring);
    context
}
