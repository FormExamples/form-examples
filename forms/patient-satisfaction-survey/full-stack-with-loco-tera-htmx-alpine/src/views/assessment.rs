use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps (1 Demographics .. 10 Comments & Suggestions).
pub const TOTAL_STEPS: u32 = 10;

/// Build a Tera context for rendering the single-page survey wizard.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("demographics", &data.demographics);
    context.insert("visit_details", &data.visit_details);
    context.insert("access_waiting_times", &data.access_waiting_times);
    context.insert("communication_information", &data.communication_information);
    context.insert("clinical_care_quality", &data.clinical_care_quality);
    context.insert("staff_attitude", &data.staff_attitude);
    context.insert("environment_facilities", &data.environment_facilities);
    context.insert("discharge_follow_up", &data.discharge_follow_up);
    context.insert("overall_experience", &data.overall_experience);
    context.insert("comments_suggestions", &data.comments_suggestions);
    context
}
