use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps (10 per the JPAC DSG workflow).
pub const TOTAL_STEPS: u32 = 10;

/// Build a Tera context for rendering the single-page assessment wizard.
/// All section partials share the same context.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("donor_demographics", &data.donor_demographics);
    context.insert("general_health", &data.general_health);
    context.insert("medical_history", &data.medical_history);
    context.insert("recent_illness", &data.recent_illness);
    context.insert("travel_history", &data.travel_history);
    context.insert("lifestyle_risk", &data.lifestyle_risk);
    context.insert("pregnancy_transfusion", &data.pregnancy_transfusion);
    context.insert("vital_signs", &data.vital_signs);
    context.insert("informed_consent", &data.informed_consent);
    context.insert("donation_plan", &data.donation_plan);
    context
}
