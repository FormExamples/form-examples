use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps:
///   1 Demographics
///   2 Reason for Assessment
///   3 DASS-21 Depression
///   4 DASS-21 Anxiety
///   5 DASS-21 Stress
///   6 Functional Impact
///   7 Risk Screen
///   8 Support and History
pub const TOTAL_STEPS: u32 = 8;

/// Build a Tera context for rendering the single-page assessment wizard.
/// All section partials share the same context.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("demographics", &data.demographics);
    context.insert("reason_for_assessment", &data.reason_for_assessment);
    context.insert("dass_depression", &data.dass_depression);
    context.insert("dass_anxiety", &data.dass_anxiety);
    context.insert("dass_stress", &data.dass_stress);
    context.insert("functional_impact", &data.functional_impact);
    context.insert("risk_screen", &data.risk_screen);
    context.insert("support_and_history", &data.support_and_history);
    context
}
