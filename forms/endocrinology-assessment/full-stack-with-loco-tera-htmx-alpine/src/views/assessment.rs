use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps in the endocrinology assessment.
pub const TOTAL_STEPS: u32 = 10;

/// Build a Tera context for rendering the single-page assessment wizard.
/// All section partials share the same context.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("demographics", &data.demographics);
    context.insert("presenting_symptoms", &data.presenting_symptoms);
    context.insert("thyroid_axis", &data.thyroid_axis);
    context.insert("adrenal_axis", &data.adrenal_axis);
    context.insert("glucose_metabolism", &data.glucose_metabolism);
    context.insert("reproductive_axis", &data.reproductive_axis);
    context.insert("pituitary_function", &data.pituitary_function);
    context.insert("bone_calcium", &data.bone_calcium);
    context.insert("medications_lifestyle", &data.medications_lifestyle);
    context.insert("clinical_impression", &data.clinical_impression);
    context
}
