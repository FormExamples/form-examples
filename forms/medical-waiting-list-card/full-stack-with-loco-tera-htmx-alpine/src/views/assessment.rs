use tera::Context;
use uuid::Uuid;

use crate::engine::types::Card;

/// Number of steps in the practitioner wizard.
pub const TOTAL_STEPS: u32 = 7;

/// Build a Tera context for rendering the single-page Medical Waiting
/// List Card. The same context is shared by every step partial.
pub fn build_assessment_context(card: &Card, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", card);
    context.insert("practitioner", &card.practitioner);
    context.insert("patient", &card.patient);
    context.insert("referral", &card.referral);
    context.insert("waiting_list", &card.waiting_list);
    context.insert("appointment", &card.appointment);
    context.insert("communication", &card.communication);
    context.insert("signoff", &card.signoff);
    context
}
