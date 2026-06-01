use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps.
pub const TOTAL_STEPS: u32 = 10;

/// Build a Tera context for rendering the single-page onboarding wizard.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("demographics", &data.demographics);
    context.insert("pre_employment_checks", &data.pre_employment_checks);
    context.insert("occupational_health", &data.occupational_health);
    context.insert("mandatory_training", &data.mandatory_training);
    context.insert(
        "professional_registration",
        &data.professional_registration,
    );
    context.insert("it_systems_access", &data.it_systems_access);
    context.insert("uniform_id_badge", &data.uniform_id_badge);
    context.insert("induction_programme", &data.induction_programme);
    context.insert("probation_supervision", &data.probation_supervision);
    context.insert("sign_off_compliance", &data.sign_off_compliance);
    context
}
