use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps:
/// 1. Personal Details
/// 2. Healthcare Professionals
/// 3. Diagnosis Confirmation
/// 4. Mental Health Conditions
/// 5. Recent Contact
/// 6. Authorisation
pub const TOTAL_STEPS: u32 = 6;

/// Build a Tera context for rendering the single-page DVLA M1 wizard.
/// All section partials share the same context.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("personal_details", &data.personal_details);
    context.insert("healthcare_professionals", &data.healthcare_professionals);
    context.insert("gp", &data.healthcare_professionals.gp);
    context.insert("consultant", &data.healthcare_professionals.consultant);
    context.insert("diagnosis_confirmation", &data.diagnosis_confirmation);
    context.insert("mental_health_conditions", &data.mental_health_conditions);
    context.insert("recent_contact", &data.recent_contact);
    context.insert("authorisation", &data.authorisation);
    context
}
