use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps for the lifeguard certification checklist.
pub const TOTAL_STEPS: u32 = 10;

/// Build a Tera context for rendering the single-page certification wizard.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("candidate_details", &data.candidate_details);
    context.insert("physical_fitness_swim", &data.physical_fitness_swim);
    context.insert(
        "supervision_scanning_zoning",
        &data.supervision_scanning_zoning,
    );
    context.insert("rescue_conscious", &data.rescue_conscious);
    context.insert("rescue_unconscious", &data.rescue_unconscious);
    context.insert("spinal_injury_management", &data.spinal_injury_management);
    context.insert("cpr_aed", &data.cpr_aed);
    context.insert("first_aid_oxygen", &data.first_aid_oxygen);
    context.insert(
        "legal_regulatory_incident",
        &data.legal_regulatory_incident,
    );
    context.insert("overall_result_signoff", &data.overall_result_signoff);
    context
}
