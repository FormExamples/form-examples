use tera::Context;
use uuid::Uuid;

use crate::engine::types::AssessmentData;

/// Total wizard steps for the Vaccinations Checklist (10 step partials).
pub const TOTAL_STEPS: u32 = 10;

/// Build a Tera context for rendering the single-page vaccinations wizard.
/// All section partials share the same context.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("demographics", &data.demographics);
    context.insert("vaccination_history", &data.vaccination_history);
    context.insert("childhood_immunisations", &data.childhood_immunisations);
    context.insert("occupational_vaccines", &data.occupational_vaccines);
    context.insert("travel_vaccines", &data.travel_vaccines);
    context.insert("covid19_vaccination", &data.covid19_vaccination);
    context.insert("influenza_vaccination", &data.influenza_vaccination);
    context.insert(
        "contraindications_allergies",
        &data.contraindications_allergies,
    );
    context.insert(
        "serology_immunity_testing",
        &data.serology_immunity_testing,
    );
    context.insert("schedule_compliance", &data.schedule_compliance);
    context
}
