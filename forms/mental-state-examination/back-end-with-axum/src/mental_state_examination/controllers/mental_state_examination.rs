#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::mental_state_examinations::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub clinician_name: String,
    pub clinician_role: String,
    pub assessed_at: Option<DateTimeWithTimeZone>,
    pub care_setting: String,
    pub assessment_reason: String,
    pub patient_identifier: String,
    pub age_band: String,
    pub sex: String,
    pub appearance_grooming: String,
    pub appearance_eye_contact: String,
    pub appearance_rapport: String,
    pub appearance_psychomotor: String,
    pub appearance_abnormal_movements: String,
    pub appearance_notes: String,
    pub speech_rate: String,
    pub speech_volume: String,
    pub speech_quantity: String,
    pub speech_fluency: String,
    pub speech_notes: String,
    pub mood_subjective: String,
    pub mood_descriptor: String,
    pub affect_range: String,
    pub affect_congruence: String,
    pub affect_reactivity: String,
    pub emotion_notes: String,
    pub hallucinations_present: String,
    pub command_hallucinations: String,
    pub illusions: String,
    pub depersonalisation: String,
    pub derealisation: String,
    pub perception_notes: String,
    pub thought_form: String,
    pub delusions: String,
    pub obsessions: String,
    pub suicidal_ideation: String,
    pub homicidal_ideation: String,
    pub self_harm_thoughts: String,
    pub thought_notes: String,
    pub insight_level: String,
    pub treatment_understanding: String,
    pub judgement: String,
    pub insight_notes: String,
    pub orientation: String,
    pub attention: String,
    pub memory: String,
    pub cognitive_impression: String,
    pub cognition_notes: String,
    pub clinical_formulation: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO mental_state_examinations (patient_id, clinician_id, clinician_name, \
            clinician_role, assessed_at, care_setting, assessment_reason, patient_identifier, \
            age_band, sex, appearance_grooming, appearance_eye_contact, appearance_rapport, \
            appearance_psychomotor, appearance_abnormal_movements, appearance_notes, \
            speech_rate, speech_volume, speech_quantity, speech_fluency, speech_notes, \
            mood_subjective, mood_descriptor, affect_range, affect_congruence, \
            affect_reactivity, emotion_notes, hallucinations_present, command_hallucinations, \
            illusions, depersonalisation, derealisation, perception_notes, thought_form, \
            delusions, obsessions, suicidal_ideation, homicidal_ideation, self_harm_thoughts, \
            thought_notes, insight_level, treatment_understanding, judgement, insight_notes, \
            orientation, attention, memory, cognitive_impression, cognition_notes, \
            clinical_formulation) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, \
            $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, \
            $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, \
            $45, $46, $47, $48, $49, $50) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(self.assessed_at)
        .bind(&self.care_setting)
        .bind(&self.assessment_reason)
        .bind(&self.patient_identifier)
        .bind(&self.age_band)
        .bind(&self.sex)
        .bind(&self.appearance_grooming)
        .bind(&self.appearance_eye_contact)
        .bind(&self.appearance_rapport)
        .bind(&self.appearance_psychomotor)
        .bind(&self.appearance_abnormal_movements)
        .bind(&self.appearance_notes)
        .bind(&self.speech_rate)
        .bind(&self.speech_volume)
        .bind(&self.speech_quantity)
        .bind(&self.speech_fluency)
        .bind(&self.speech_notes)
        .bind(&self.mood_subjective)
        .bind(&self.mood_descriptor)
        .bind(&self.affect_range)
        .bind(&self.affect_congruence)
        .bind(&self.affect_reactivity)
        .bind(&self.emotion_notes)
        .bind(&self.hallucinations_present)
        .bind(&self.command_hallucinations)
        .bind(&self.illusions)
        .bind(&self.depersonalisation)
        .bind(&self.derealisation)
        .bind(&self.perception_notes)
        .bind(&self.thought_form)
        .bind(&self.delusions)
        .bind(&self.obsessions)
        .bind(&self.suicidal_ideation)
        .bind(&self.homicidal_ideation)
        .bind(&self.self_harm_thoughts)
        .bind(&self.thought_notes)
        .bind(&self.insight_level)
        .bind(&self.treatment_understanding)
        .bind(&self.judgement)
        .bind(&self.insight_notes)
        .bind(&self.orientation)
        .bind(&self.attention)
        .bind(&self.memory)
        .bind(&self.cognitive_impression)
        .bind(&self.cognition_notes)
        .bind(&self.clinical_formulation)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE mental_state_examinations SET patient_id = $2, clinician_id = $3, \
            clinician_name = $4, clinician_role = $5, assessed_at = $6, care_setting = \
            $7, assessment_reason = $8, patient_identifier = $9, age_band = $10, sex = \
            $11, appearance_grooming = $12, appearance_eye_contact = $13, \
            appearance_rapport = $14, appearance_psychomotor = $15, \
            appearance_abnormal_movements = $16, appearance_notes = $17, speech_rate = \
            $18, speech_volume = $19, speech_quantity = $20, speech_fluency = $21, \
            speech_notes = $22, mood_subjective = $23, mood_descriptor = $24, \
            affect_range = $25, affect_congruence = $26, affect_reactivity = $27, \
            emotion_notes = $28, hallucinations_present = $29, command_hallucinations = \
            $30, illusions = $31, depersonalisation = $32, derealisation = $33, \
            perception_notes = $34, thought_form = $35, delusions = $36, obsessions = \
            $37, suicidal_ideation = $38, homicidal_ideation = $39, self_harm_thoughts = \
            $40, thought_notes = $41, insight_level = $42, treatment_understanding = \
            $43, judgement = $44, insight_notes = $45, orientation = $46, attention = \
            $47, memory = $48, cognitive_impression = $49, cognition_notes = $50, \
            clinical_formulation = $51, updated_at = now() WHERE id = $1 AND deleted_at \
            IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(self.assessed_at)
        .bind(&self.care_setting)
        .bind(&self.assessment_reason)
        .bind(&self.patient_identifier)
        .bind(&self.age_band)
        .bind(&self.sex)
        .bind(&self.appearance_grooming)
        .bind(&self.appearance_eye_contact)
        .bind(&self.appearance_rapport)
        .bind(&self.appearance_psychomotor)
        .bind(&self.appearance_abnormal_movements)
        .bind(&self.appearance_notes)
        .bind(&self.speech_rate)
        .bind(&self.speech_volume)
        .bind(&self.speech_quantity)
        .bind(&self.speech_fluency)
        .bind(&self.speech_notes)
        .bind(&self.mood_subjective)
        .bind(&self.mood_descriptor)
        .bind(&self.affect_range)
        .bind(&self.affect_congruence)
        .bind(&self.affect_reactivity)
        .bind(&self.emotion_notes)
        .bind(&self.hallucinations_present)
        .bind(&self.command_hallucinations)
        .bind(&self.illusions)
        .bind(&self.depersonalisation)
        .bind(&self.derealisation)
        .bind(&self.perception_notes)
        .bind(&self.thought_form)
        .bind(&self.delusions)
        .bind(&self.obsessions)
        .bind(&self.suicidal_ideation)
        .bind(&self.homicidal_ideation)
        .bind(&self.self_harm_thoughts)
        .bind(&self.thought_notes)
        .bind(&self.insight_level)
        .bind(&self.treatment_understanding)
        .bind(&self.judgement)
        .bind(&self.insight_notes)
        .bind(&self.orientation)
        .bind(&self.attention)
        .bind(&self.memory)
        .bind(&self.cognitive_impression)
        .bind(&self.cognition_notes)
        .bind(&self.clinical_formulation)
        .fetch_optional(db)
        .await
    }
}

async fn load_item(ctx: &AppContext, id: Uuid) -> Result<Model> {
    let item = Model::find_by_id(&db(ctx), id).await?;
    item.ok_or_else(|| Error::NotFound)
}

#[debug_handler]
pub async fn list(
    State(ctx): State<AppContext>,
    OriginalUri(uri): OriginalUri,
) -> Result<Response> {
    let page = cursor_page(&ctx, &uri)?;
    let rows = Model::page(&db(&ctx), &page).await?;
    Ok(page.respond(rows))
}

#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = params.update(&db(&ctx), id).await?.ok_or(Error::NotFound)?;
    format::json(item)
}

#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?;
    Model::delete(&db(&ctx), id).await?;
    format::empty()
}

#[debug_handler]
pub async fn get_one(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(load_item(&ctx, id).await?)
}

pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/mental_state_examinations/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
