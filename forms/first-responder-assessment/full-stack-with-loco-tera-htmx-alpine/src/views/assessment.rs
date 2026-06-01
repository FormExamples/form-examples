use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps (10 step partials).
pub const TOTAL_STEPS: u32 = 10;

/// Build a Tera context for rendering the single-page assessment wizard.
/// All step partials share the same context.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("demographics", &data.demographics);
    context.insert("role_qualifications", &data.role_qualifications);
    context.insert("physical_fitness", &data.physical_fitness);
    context.insert("clinical_skills", &data.clinical_skills);
    context.insert("equipment_vehicle", &data.equipment_vehicle);
    context.insert("communication_skills", &data.communication_skills);
    context.insert("psychological_readiness", &data.psychological_readiness);
    context.insert("occupational_health", &data.occupational_health);
    context.insert("cpd_training", &data.cpd_training);
    context.insert("fitness_decision", &data.fitness_decision);
    context
}
