use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total IPS sections (Demographics, Problems, Medications, Allergies,
/// Immunisations, Procedures, Results, Devices, Directives, Signoff).
pub const TOTAL_STEPS: u32 = 10;

/// Build a Tera context for rendering the single-page IPS wizard.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("patient_demographics", &data.patient_demographics);
    context.insert("problem_list", &data.problem_list);
    context.insert("medication_summary", &data.medication_summary);
    context.insert("allergies_intolerances", &data.allergies_intolerances);
    context.insert("immunisations", &data.immunisations);
    context.insert("procedures", &data.procedures);
    context.insert("results_investigations", &data.results_investigations);
    context.insert("medical_devices", &data.medical_devices);
    context.insert("advance_directives", &data.advance_directives);
    context.insert("authoring_clinician", &data.authoring_clinician);
    context
}
