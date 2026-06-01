use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps (Demographics through Consent & Eligibility).
pub const TOTAL_STEPS: u32 = 10;

/// Build a Tera context for rendering the single-page donor-assessment wizard.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("demographics", &data.demographics);
    context.insert(
        "donor_registration_hla_typing",
        &data.donor_registration_hla_typing,
    );
    context.insert("medical_history", &data.medical_history);
    context.insert("physical_examination", &data.physical_examination);
    context.insert(
        "haematological_assessment",
        &data.haematological_assessment,
    );
    context.insert(
        "infectious_disease_screening",
        &data.infectious_disease_screening,
    );
    context.insert("anaesthetic_assessment", &data.anaesthetic_assessment);
    context.insert(
        "collection_method_assessment",
        &data.collection_method_assessment,
    );
    context.insert("psychological_readiness", &data.psychological_readiness);
    context.insert("consent_eligibility", &data.consent_eligibility);
    context
}
