#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::paediatric_early_warning_score_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub paediatric_early_warning_score_id: Uuid,
    pub aggregate_score: Option<i32>,
    pub max_parameter_score: Option<i32>,
    pub respiratory_rate_score: Option<i32>,
    pub respiratory_effort_score: Option<i32>,
    pub oxygen_saturation_score: Option<i32>,
    pub supplemental_oxygen_score: Option<i32>,
    pub heart_rate_score: Option<i32>,
    pub capillary_refill_score: Option<i32>,
    pub consciousness_score: Option<i32>,
    pub risk_band: String,
    pub single_parameter_trigger: String,
    pub concern_trigger: String,
    pub monitoring_frequency: String,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO paediatric_early_warning_score_grades \
            (paediatric_early_warning_score_id, aggregate_score, max_parameter_score, \
            respiratory_rate_score, respiratory_effort_score, oxygen_saturation_score, \
            supplemental_oxygen_score, heart_rate_score, capillary_refill_score, \
            consciousness_score, risk_band, single_parameter_trigger, concern_trigger, \
            monitoring_frequency, graded_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, \
            $11, $12, $13, $14, $15) RETURNING *",
        )
        .bind(self.paediatric_early_warning_score_id)
        .bind(self.aggregate_score)
        .bind(self.max_parameter_score)
        .bind(self.respiratory_rate_score)
        .bind(self.respiratory_effort_score)
        .bind(self.oxygen_saturation_score)
        .bind(self.supplemental_oxygen_score)
        .bind(self.heart_rate_score)
        .bind(self.capillary_refill_score)
        .bind(self.consciousness_score)
        .bind(&self.risk_band)
        .bind(&self.single_parameter_trigger)
        .bind(&self.concern_trigger)
        .bind(&self.monitoring_frequency)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE paediatric_early_warning_score_grades SET \
            paediatric_early_warning_score_id = $2, aggregate_score = $3, \
            max_parameter_score = $4, respiratory_rate_score = $5, \
            respiratory_effort_score = $6, oxygen_saturation_score = $7, \
            supplemental_oxygen_score = $8, heart_rate_score = $9, \
            capillary_refill_score = $10, consciousness_score = $11, risk_band = $12, \
            single_parameter_trigger = $13, concern_trigger = $14, monitoring_frequency \
            = $15, graded_at = $16, updated_at = now() WHERE id = $1 AND deleted_at IS \
            NULL RETURNING *",
        )
        .bind(id)
        .bind(self.paediatric_early_warning_score_id)
        .bind(self.aggregate_score)
        .bind(self.max_parameter_score)
        .bind(self.respiratory_rate_score)
        .bind(self.respiratory_effort_score)
        .bind(self.oxygen_saturation_score)
        .bind(self.supplemental_oxygen_score)
        .bind(self.heart_rate_score)
        .bind(self.capillary_refill_score)
        .bind(self.consciousness_score)
        .bind(&self.risk_band)
        .bind(&self.single_parameter_trigger)
        .bind(&self.concern_trigger)
        .bind(&self.monitoring_frequency)
        .bind(self.graded_at)
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
        .prefix("api/paediatric_early_warning_score_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
