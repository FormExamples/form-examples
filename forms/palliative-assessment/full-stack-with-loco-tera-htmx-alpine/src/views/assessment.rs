use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps (palliative form has 9 sections).
pub const TOTAL_STEPS: u32 = 9;

/// Build a Tera context for rendering the single-page palliative wizard.
/// All section partials share the same context.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("demographics", &data.demographics);
    context.insert(
        "primary_diagnosis_prognosis",
        &data.primary_diagnosis_prognosis,
    );
    context.insert("esasr_symptoms", &data.esasr_symptoms);
    context.insert("performance_status", &data.performance_status);
    context.insert("goals_of_care_acp", &data.goals_of_care_acp);
    context.insert(
        "medications_symptom_control",
        &data.medications_symptom_control,
    );
    context.insert(
        "psychosocial_spiritual_concerns",
        &data.psychosocial_spiritual_concerns,
    );
    context.insert("carer_family_support", &data.carer_family_support);
    context.insert("multidisciplinary_plan", &data.multidisciplinary_plan);
    context
}
