use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps:
/// 1. Demographics
/// 2. Trauma Event Identification
/// 3. Cluster B - Intrusion
/// 4. Cluster C - Avoidance
/// 5. Cluster D - Negative Alterations
/// 6. Cluster E - Arousal & Reactivity
pub const TOTAL_STEPS: u32 = 6;

/// Build a Tera context for rendering the single-page assessment wizard.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("demographics", &data.demographics);
    context.insert("trauma_event", &data.trauma_event);
    context.insert("cluster_b", &data.cluster_b_intrusion);
    context.insert("cluster_c", &data.cluster_c_avoidance);
    context.insert("cluster_d", &data.cluster_d_negative_alterations);
    context.insert("cluster_e", &data.cluster_e_arousal_reactivity);
    context
}
