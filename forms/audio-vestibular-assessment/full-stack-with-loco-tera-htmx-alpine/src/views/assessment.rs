use tera::Context;
use uuid::Uuid;

use crate::engine::audio_vestibular_rules::dhi_items;
use crate::engine::types::AssessmentData;

/// Total wizard steps (Demographics, Symptoms, Otoscopy, PTA, Speech,
/// Tympanometry, Vestibular, DHI, Clinical Impression).
pub const TOTAL_STEPS: u32 = 9;

/// DHI item metadata exposed to templates as `{num, subscale, text}`.
#[derive(Debug, serde::Serialize)]
pub struct DhiItemView {
    pub num: u8,
    pub subscale: String,
    pub text: String,
    pub key: String,
}

/// Build a Tera context for rendering the single-page assessment wizard.
pub fn build_assessment_context(data: &AssessmentData, id: Uuid) -> Context {
    let mut context = Context::new();
    context.insert("id", &id.to_string());
    context.insert("total_steps", &TOTAL_STEPS);
    context.insert("data", data);
    context.insert("demographics", &data.demographics);
    context.insert("presenting_symptoms", &data.presenting_symptoms);
    context.insert("otoscopic_examination", &data.otoscopic_examination);
    context.insert("pure_tone_audiometry", &data.pure_tone_audiometry);
    context.insert("speech_audiometry", &data.speech_audiometry);
    context.insert(
        "tympanometry_acoustic_reflexes",
        &data.tympanometry_acoustic_reflexes,
    );
    context.insert("vestibular_screening", &data.vestibular_screening);
    context.insert(
        "dizziness_handicap_inventory",
        &data.dizziness_handicap_inventory,
    );
    context.insert(
        "clinical_impression_referral",
        &data.clinical_impression_referral,
    );

    // Build DHI item metadata + current answer for template iteration.
    let dhi = &data.dizziness_handicap_inventory;
    let items: Vec<DhiItemView> = dhi_items()
        .into_iter()
        .map(|i| DhiItemView {
            num: i.num,
            subscale: i.subscale.to_string(),
            text: i.text.to_string(),
            key: dhi.answer(i.num).to_string(),
        })
        .collect();
    context.insert("dhi_items", &items);

    context
}
