use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps for the Hospital Discharge form.
pub const TOTAL_STEPS: u32 = 10;

/// Build a Tera context for rendering the single-page discharge-summary wizard.
/// All section partials share the same context.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("patient_details", &data.patient_details);
    context.insert("admission_summary", &data.admission_summary);
    context.insert("diagnoses", &data.diagnoses);
    context.insert("procedures_performed", &data.procedures_performed);
    context.insert("discharge_medications", &data.discharge_medications);
    context.insert("followup_arrangements", &data.followup_arrangements);
    context.insert(
        "community_care_instructions",
        &data.community_care_instructions,
    );
    context.insert("warning_signs", &data.warning_signs);
    context.insert("clinician_signoff", &data.clinician_signoff);
    context.insert("patient_acknowledgement", &data.patient_acknowledgement);
    context
}
