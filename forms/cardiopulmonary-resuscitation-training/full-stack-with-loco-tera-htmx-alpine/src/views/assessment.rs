use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps (Trainee, Scene Safety, Responsiveness, Activate ER,
/// Compressions, Airway, AED, Team Dynamics).
pub const TOTAL_STEPS: u32 = 8;

/// Build a Tera context for rendering the single-page BLS wizard.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("trainee_details", &data.trainee_details);
    context.insert("scene_safety", &data.scene_safety);
    context.insert("responsiveness_breathing", &data.responsiveness_breathing);
    context.insert("activate_emergency_response", &data.activate_emergency_response);
    context.insert("chest_compressions", &data.chest_compressions);
    context.insert("airway_rescue_breaths", &data.airway_rescue_breaths);
    context.insert("aed_shock_delivery", &data.aed_shock_delivery);
    context.insert("team_dynamics_handoff", &data.team_dynamics_handoff);
    context
}
