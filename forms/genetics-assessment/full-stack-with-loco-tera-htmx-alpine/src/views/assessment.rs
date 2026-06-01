use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps (1..9 — single continuous page).
pub const TOTAL_STEPS: u32 = 9;

/// Build a Tera context for rendering the single-page genetics-assessment wizard.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("proband_demographics", &data.proband_demographics);
    context.insert("presenting_concern", &data.presenting_concern);
    context.insert("personal_medical_history", &data.personal_medical_history);
    context.insert("family_pedigree", &data.family_pedigree);
    context.insert("consanguinity_ancestry", &data.consanguinity_ancestry);
    context.insert("targeted_risk_scoring", &data.targeted_risk_scoring);
    context.insert("prior_genetic_testing", &data.prior_genetic_testing);
    context.insert(
        "patient_understanding_concerns",
        &data.patient_understanding_concerns,
    );
    context.insert(
        "recommendation_referral_plan",
        &data.recommendation_referral_plan,
    );
    context
}
