use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps (10 audit sections).
pub const TOTAL_STEPS: u32 = 10;

/// Build a Tera context for rendering the single-page audit wizard.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("site_details", &data.site_details);
    context.insert("ppe_hazard_controls", &data.ppe_hazard_controls);
    context.insert(
        "chemical_biological_hazards",
        &data.chemical_biological_hazards,
    );
    context.insert("electrical_safety", &data.electrical_safety);
    context.insert("fire_safety", &data.fire_safety);
    context.insert(
        "ergonomics_manual_handling",
        &data.ergonomics_manual_handling,
    );
    context.insert("emergency_procedures", &data.emergency_procedures);
    context.insert("training_competence", &data.training_competence);
    context.insert("incident_reporting", &data.incident_reporting);
    context.insert("signoff_action_plan", &data.signoff_action_plan);
    context
}
