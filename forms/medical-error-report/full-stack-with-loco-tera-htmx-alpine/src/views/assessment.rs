use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps (Demographics, Incident, Patient, Classification,
/// Contributing, Immediate, Outcome, RCA, Corrective, Reporting).
pub const TOTAL_STEPS: u32 = 10;

/// Build a Tera context for rendering the single-page wizard. All section
/// partials share the same context.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("demographics", &data.demographics);
    context.insert("incident_details", &data.incident_details);
    context.insert("patient_involvement", &data.patient_involvement);
    context.insert("error_classification", &data.error_classification);
    context.insert("contributing_factors", &data.contributing_factors);
    context.insert("immediate_actions", &data.immediate_actions);
    context.insert("patient_outcome", &data.patient_outcome);
    context.insert("root_cause_analysis", &data.root_cause_analysis);
    context.insert("corrective_actions", &data.corrective_actions);
    context.insert("reporting_followup", &data.reporting_followup);
    context
}
