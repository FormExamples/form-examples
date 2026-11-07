#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::modified_early_warning_scores::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub status: String,
    pub observation_at: Option<DateTimeWithTimeZone>,
    pub care_setting: String,
    pub ward_or_location: String,
    pub systolic_blood_pressure: Option<i32>,
    pub heart_rate: Option<i32>,
    pub respiratory_rate: Option<i32>,
    pub temperature: Option<f64>,
    pub consciousness_avpu: String,
    pub previous_mews_score: Option<i32>,
    pub clinical_notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO modified_early_warning_scores (patient_id, clinician_id, status, \
            observation_at, care_setting, ward_or_location, systolic_blood_pressure, \
            heart_rate, respiratory_rate, temperature, consciousness_avpu, \
            previous_mews_score, clinical_notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, \
            $10, $11, $12, $13) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(self.observation_at)
        .bind(&self.care_setting)
        .bind(&self.ward_or_location)
        .bind(self.systolic_blood_pressure)
        .bind(self.heart_rate)
        .bind(self.respiratory_rate)
        .bind(self.temperature)
        .bind(&self.consciousness_avpu)
        .bind(self.previous_mews_score)
        .bind(&self.clinical_notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE modified_early_warning_scores SET patient_id = $2, clinician_id = $3, \
            status = $4, observation_at = $5, care_setting = $6, ward_or_location = $7, \
            systolic_blood_pressure = $8, heart_rate = $9, respiratory_rate = $10, \
            temperature = $11, consciousness_avpu = $12, previous_mews_score = $13, \
            clinical_notes = $14, updated_at = now() WHERE id = $1 AND deleted_at IS \
            NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(self.observation_at)
        .bind(&self.care_setting)
        .bind(&self.ward_or_location)
        .bind(self.systolic_blood_pressure)
        .bind(self.heart_rate)
        .bind(self.respiratory_rate)
        .bind(self.temperature)
        .bind(&self.consciousness_avpu)
        .bind(self.previous_mews_score)
        .bind(&self.clinical_notes)
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
        .prefix("api/modified_early_warning_scores/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
