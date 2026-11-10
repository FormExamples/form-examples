#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::assessment_current_medications::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub assessment_id: Uuid,
    pub inhaler_use: String,
    pub inhaler_technique_assessed: String,
    pub inhaler_technique_adequate: String,
    pub short_acting_bronchodilator: String,
    pub saba_frequency: String,
    pub long_acting_bronchodilator: String,
    pub inhaled_corticosteroid: String,
    pub combination_inhaler: String,
    pub long_term_oxygen_therapy: String,
    pub oxygen_flow_rate_lmin: Option<f64>,
    pub oxygen_hours_per_day: Option<i32>,
    pub nebuliser_use: String,
    pub oral_medications: String,
    pub medication_adherence: String,
    pub additional_notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO assessment_current_medications (assessment_id, inhaler_use, \
            inhaler_technique_assessed, inhaler_technique_adequate, \
            short_acting_bronchodilator, saba_frequency, long_acting_bronchodilator, \
            inhaled_corticosteroid, combination_inhaler, long_term_oxygen_therapy, \
            oxygen_flow_rate_lmin, oxygen_hours_per_day, nebuliser_use, \
            oral_medications, medication_adherence, additional_notes) VALUES ($1, $2, \
            $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *",
        )
        .bind(self.assessment_id)
        .bind(&self.inhaler_use)
        .bind(&self.inhaler_technique_assessed)
        .bind(&self.inhaler_technique_adequate)
        .bind(&self.short_acting_bronchodilator)
        .bind(&self.saba_frequency)
        .bind(&self.long_acting_bronchodilator)
        .bind(&self.inhaled_corticosteroid)
        .bind(&self.combination_inhaler)
        .bind(&self.long_term_oxygen_therapy)
        .bind(self.oxygen_flow_rate_lmin)
        .bind(self.oxygen_hours_per_day)
        .bind(&self.nebuliser_use)
        .bind(&self.oral_medications)
        .bind(&self.medication_adherence)
        .bind(&self.additional_notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE assessment_current_medications SET assessment_id = $2, inhaler_use = \
            $3, inhaler_technique_assessed = $4, inhaler_technique_adequate = $5, \
            short_acting_bronchodilator = $6, saba_frequency = $7, \
            long_acting_bronchodilator = $8, inhaled_corticosteroid = $9, \
            combination_inhaler = $10, long_term_oxygen_therapy = $11, \
            oxygen_flow_rate_lmin = $12, oxygen_hours_per_day = $13, nebuliser_use = \
            $14, oral_medications = $15, medication_adherence = $16, additional_notes = \
            $17, updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.assessment_id)
        .bind(&self.inhaler_use)
        .bind(&self.inhaler_technique_assessed)
        .bind(&self.inhaler_technique_adequate)
        .bind(&self.short_acting_bronchodilator)
        .bind(&self.saba_frequency)
        .bind(&self.long_acting_bronchodilator)
        .bind(&self.inhaled_corticosteroid)
        .bind(&self.combination_inhaler)
        .bind(&self.long_term_oxygen_therapy)
        .bind(self.oxygen_flow_rate_lmin)
        .bind(self.oxygen_hours_per_day)
        .bind(&self.nebuliser_use)
        .bind(&self.oral_medications)
        .bind(&self.medication_adherence)
        .bind(&self.additional_notes)
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
        .prefix("api/assessment_current_medications/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
