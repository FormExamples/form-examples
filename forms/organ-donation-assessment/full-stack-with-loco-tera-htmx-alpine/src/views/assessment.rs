use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps for the Organ Donation Assessment.
pub const TOTAL_STEPS: u32 = 10;

/// Build a Tera context for rendering the single-page assessment wizard.
/// All step partials share the same context.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("demographics", &data.demographics);
    context.insert("donor_type_registration", &data.donor_type_registration);
    context.insert("medical_history", &data.medical_history);
    context.insert("organ_function", &data.organ_function);
    context.insert(
        "infectious_disease_screening",
        &data.infectious_disease_screening,
    );
    context.insert(
        "immunological_assessment",
        &data.immunological_assessment,
    );
    context.insert("surgical_assessment", &data.surgical_assessment);
    context.insert("psychological_assessment", &data.psychological_assessment);
    context.insert(
        "ethical_legal_requirements",
        &data.ethical_legal_requirements,
    );
    context.insert("eligibility_allocation", &data.eligibility_allocation);
    context
}
