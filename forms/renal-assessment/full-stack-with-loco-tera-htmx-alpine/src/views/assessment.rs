use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps (9 KDIGO sections).
pub const TOTAL_STEPS: u32 = 9;

/// Build a Tera context for rendering the single-page renal-assessment wizard.
/// All section partials share the same context.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("demographics", &data.demographics);
    context.insert("presenting_symptoms", &data.presenting_symptoms);
    context.insert("ckd_risk_factors", &data.ckd_risk_factors);
    context.insert("physical_examination", &data.physical_examination);
    context.insert("blood_tests", &data.blood_tests);
    context.insert("urine_tests", &data.urine_tests);
    context.insert("imaging_biopsy", &data.imaging_biopsy);
    context.insert("medication_review", &data.medication_review);
    context.insert("clinical_impression", &data.clinical_impression);
    context
}
