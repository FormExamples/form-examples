#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::national_early_warning_score_2_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub national_early_warning_score_2_id: Uuid,
    pub aggregate_score: Option<i32>,
    pub respiratory_rate_score: Option<i32>,
    pub spo2_score: Option<i32>,
    pub oxygen_score: Option<i32>,
    pub blood_pressure_score: Option<i32>,
    pub pulse_score: Option<i32>,
    pub consciousness_score: Option<i32>,
    pub temperature_score: Option<i32>,
    pub any_single_parameter_three: String,
    pub risk_band: String,
    pub monitoring_frequency: String,
    pub recommendation: String,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO national_early_warning_score_2_grades \
            (national_early_warning_score_2_id, aggregate_score, respiratory_rate_score, \
            spo2_score, oxygen_score, blood_pressure_score, pulse_score, consciousness_score, \
            temperature_score, any_single_parameter_three, risk_band, monitoring_frequency, \
            recommendation, graded_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, \
            $12, $13, $14) RETURNING *",
        )
        .bind(self.national_early_warning_score_2_id)
        .bind(self.aggregate_score)
        .bind(self.respiratory_rate_score)
        .bind(self.spo2_score)
        .bind(self.oxygen_score)
        .bind(self.blood_pressure_score)
        .bind(self.pulse_score)
        .bind(self.consciousness_score)
        .bind(self.temperature_score)
        .bind(&self.any_single_parameter_three)
        .bind(&self.risk_band)
        .bind(&self.monitoring_frequency)
        .bind(&self.recommendation)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE national_early_warning_score_2_grades SET \
            national_early_warning_score_2_id = $2, aggregate_score = $3, \
            respiratory_rate_score = $4, spo2_score = $5, oxygen_score = $6, \
            blood_pressure_score = $7, pulse_score = $8, consciousness_score = $9, \
            temperature_score = $10, any_single_parameter_three = $11, risk_band = $12, \
            monitoring_frequency = $13, recommendation = $14, graded_at = $15, updated_at = \
            now() WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.national_early_warning_score_2_id)
        .bind(self.aggregate_score)
        .bind(self.respiratory_rate_score)
        .bind(self.spo2_score)
        .bind(self.oxygen_score)
        .bind(self.blood_pressure_score)
        .bind(self.pulse_score)
        .bind(self.consciousness_score)
        .bind(self.temperature_score)
        .bind(&self.any_single_parameter_three)
        .bind(&self.risk_band)
        .bind(&self.monitoring_frequency)
        .bind(&self.recommendation)
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
    let page = paging::resolve(&params)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    paging::respond(page, total, rows)
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
        .prefix("api/national_early_warning_score_2_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
