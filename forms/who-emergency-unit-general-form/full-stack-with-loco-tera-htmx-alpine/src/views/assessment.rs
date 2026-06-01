use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps (1-indexed). 16 steps per `index.md`.
pub const TOTAL_STEPS: u32 = 16;

/// Build a Tera context for rendering the single-page WHO Emergency Unit
/// (General) wizard. All section partials share the same context.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("patient_registration", &data.patient_registration);
    context.insert("chief_complaint_and_vitals", &data.chief_complaint_and_vitals);
    context.insert("high_risk_signs", &data.high_risk_signs);
    context.insert("airway", &data.airway);
    context.insert("breathing", &data.breathing);
    context.insert("circulation", &data.circulation);
    context.insert("disability", &data.disability);
    context.insert("history_of_present_illness", &data.history_of_present_illness);
    context.insert("review_of_systems", &data.review_of_systems);
    context.insert("past_medical_history", &data.past_medical_history);
    context.insert("physical_exam", &data.physical_exam);
    context.insert("diagnostics", &data.diagnostics);
    context.insert("additional_interventions", &data.additional_interventions);
    context.insert("assessment_and_plan", &data.assessment_and_plan);
    context.insert("reassessment", &data.reassessment);
    context.insert("disposition", &data.disposition);
    context
}
