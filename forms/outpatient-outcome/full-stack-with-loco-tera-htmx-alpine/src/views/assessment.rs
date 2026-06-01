use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps: Patient, Encounter, Operational, Clinical, EQ-5D-5L, GRC,
/// PROMIS, FFT, Follow-up, Sign-off, Review & Submit.
pub const TOTAL_STEPS: u32 = 11;

/// Build a Tera context for rendering the single-page outpatient outcome wizard.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("patient_details", &data.patient_details);
    context.insert("encounter_details", &data.encounter_details);
    context.insert("operational_efficiency", &data.operational_efficiency);
    context.insert("clinical_outcome", &data.clinical_outcome);
    context.insert("prom_eq5d5l", &data.prom_eq5d5l);
    context.insert("prom_grc", &data.prom_grc);
    context.insert("prom_promis", &data.prom_promis);
    context.insert("prem_fft", &data.prem_fft);
    context.insert("followup_plan", &data.followup_plan);
    context.insert("sign_off", &data.sign_off);
    context
}
