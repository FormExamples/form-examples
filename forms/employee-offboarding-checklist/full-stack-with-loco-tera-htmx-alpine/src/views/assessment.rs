use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps for the employee offboarding checklist.
pub const TOTAL_STEPS: u32 = 10;

/// Build a Tera context for rendering the single-page offboarding wizard.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("employee_details", &data.employee_details);
    context.insert("exit_interview", &data.exit_interview);
    context.insert("knowledge_transfer", &data.knowledge_transfer);
    context.insert("equipment_return", &data.equipment_return);
    context.insert("access_revocation", &data.access_revocation);
    context.insert("final_payroll_benefits", &data.final_payroll_benefits);
    context.insert(
        "references_recommendations",
        &data.references_recommendations,
    );
    context.insert(
        "non_disclosure_post_employment",
        &data.non_disclosure_post_employment,
    );
    context.insert("forwarding_details", &data.forwarding_details);
    context.insert("signoff", &data.signoff);
    context
}
