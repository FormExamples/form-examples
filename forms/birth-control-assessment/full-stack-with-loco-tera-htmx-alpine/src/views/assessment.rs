use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps (Demographics, Menstrual, Contraceptive, Medical,
/// Cardiovascular, Thromboembolism, Medications, Lifestyle, Preferences,
/// Recommendation).
pub const TOTAL_STEPS: u32 = 10;

/// Build a Tera context for rendering the single-page assessment wizard.
/// Every section partial shares this context.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("demographics", &data.demographics);
    context.insert("menstrual_history", &data.menstrual_history);
    context.insert("contraceptive_history", &data.contraceptive_history);
    context.insert("medical_history", &data.medical_history);
    context.insert("cardiovascular_risk", &data.cardiovascular_risk);
    context.insert("thromboembolism_risk", &data.thromboembolism_risk);
    context.insert("current_medications", &data.current_medications);
    context.insert("lifestyle_assessment", &data.lifestyle_assessment);
    context.insert("contraceptive_preferences", &data.contraceptive_preferences);
    context.insert("clinical_recommendation", &data.clinical_recommendation);
    context
}
