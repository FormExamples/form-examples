use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps (Trainee, Scene Safety, Primary Survey, CPR & AED,
/// Choking, Bleeding, Burns, Fractures, Medical Emergencies, Handover).
pub const TOTAL_STEPS: u32 = 10;

/// Build a Tera context for rendering the single-page assessment wizard.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("trainee_details", &data.trainee_details);
    context.insert("scene_assessment_safety", &data.scene_assessment_safety);
    context.insert("primary_survey_drabc", &data.primary_survey_drabc);
    context.insert("cpr_aed", &data.cpr_aed);
    context.insert("choking_management", &data.choking_management);
    context.insert("bleeding_wound_care", &data.bleeding_wound_care);
    context.insert("burns_scalds", &data.burns_scalds);
    context.insert("fractures_sprains_spinal", &data.fractures_sprains_spinal);
    context.insert("medical_emergencies", &data.medical_emergencies);
    context.insert(
        "recording_reporting_handover",
        &data.recording_reporting_handover,
    );
    context
}
