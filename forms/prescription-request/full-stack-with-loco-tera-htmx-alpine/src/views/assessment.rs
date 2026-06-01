use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps (Patient, Clinician, Prescription, Substitution, Request Type).
pub const TOTAL_STEPS: u32 = 5;

/// Build a Tera context for rendering the single-page prescription request
/// wizard. All section partials share the same context.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("patient_information", &data.patient_information);
    context.insert("clinician_information", &data.clinician_information);
    context.insert("prescription_details", &data.prescription_details);
    context.insert("substitution_options", &data.substitution_options);
    context.insert("request_type", &data.request_type);
    context
}
