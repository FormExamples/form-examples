#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::modified_early_warning_score_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub modified_early_warning_score_id: Uuid,
    pub aggregate_score: Option<i32>,
    pub systolic_blood_pressure_score: Option<i32>,
    pub heart_rate_score: Option<i32>,
    pub respiratory_rate_score: Option<i32>,
    pub temperature_score: Option<i32>,
    pub avpu_score: Option<i32>,
    pub single_parameter_trigger: String,
    pub risk_band: String,
    pub monitoring_frequency: String,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO modified_early_warning_score_grades (modified_early_warning_score_id, \
            aggregate_score, systolic_blood_pressure_score, heart_rate_score, \
            respiratory_rate_score, temperature_score, avpu_score, single_parameter_trigger, \
            risk_band, monitoring_frequency, graded_at) VALUES ($1, $2, $3, $4, $5, $6, $7, \
            $8, $9, $10, $11) RETURNING *",
        )
        .bind(self.modified_early_warning_score_id)
        .bind(self.aggregate_score)
        .bind(self.systolic_blood_pressure_score)
        .bind(self.heart_rate_score)
        .bind(self.respiratory_rate_score)
        .bind(self.temperature_score)
        .bind(self.avpu_score)
        .bind(&self.single_parameter_trigger)
        .bind(&self.risk_band)
        .bind(&self.monitoring_frequency)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE modified_early_warning_score_grades SET \
            modified_early_warning_score_id = $2, aggregate_score = $3, \
            systolic_blood_pressure_score = $4, heart_rate_score = $5, \
            respiratory_rate_score = $6, temperature_score = $7, avpu_score = $8, \
            single_parameter_trigger = $9, risk_band = $10, monitoring_frequency = $11, \
            graded_at = $12, updated_at = now() WHERE id = $1 AND deleted_at IS NULL \
            RETURNING *",
        )
        .bind(id)
        .bind(self.modified_early_warning_score_id)
        .bind(self.aggregate_score)
        .bind(self.systolic_blood_pressure_score)
        .bind(self.heart_rate_score)
        .bind(self.respiratory_rate_score)
        .bind(self.temperature_score)
        .bind(self.avpu_score)
        .bind(&self.single_parameter_trigger)
        .bind(&self.risk_band)
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
    Query(params): Query<PageParams>,
) -> Result<Response> {
    let page = params.resolve(PAGE_LIMITS)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    Ok(page.respond(total, rows))
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
        .prefix("api/modified_early_warning_score_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
