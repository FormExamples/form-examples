#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::ultrasound_test_request_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub ultrasound_test_request_id: Uuid,
    pub appropriateness_score: Option<i32>,
    pub appropriateness_band: String,
    pub suitability_band: String,
    pub prep_requirements: String,
    pub completeness_percent: Option<i32>,
    pub triage_tier: String,
    pub target_timeframe: String,
    pub recommendation: String,
    pub clinician_notes: String,
    pub signed_at: Option<DateTimeWithTimeZone>,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO ultrasound_test_request_grades (ultrasound_test_request_id, \
            appropriateness_score, appropriateness_band, suitability_band, \
            prep_requirements, completeness_percent, triage_tier, target_timeframe, \
            recommendation, clinician_notes, signed_at, graded_at) VALUES ($1, $2, $3, \
            $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *",
        )
        .bind(self.ultrasound_test_request_id)
        .bind(self.appropriateness_score)
        .bind(&self.appropriateness_band)
        .bind(&self.suitability_band)
        .bind(&self.prep_requirements)
        .bind(self.completeness_percent)
        .bind(&self.triage_tier)
        .bind(&self.target_timeframe)
        .bind(&self.recommendation)
        .bind(&self.clinician_notes)
        .bind(self.signed_at)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE ultrasound_test_request_grades SET ultrasound_test_request_id = $2, \
            appropriateness_score = $3, appropriateness_band = $4, suitability_band = \
            $5, prep_requirements = $6, completeness_percent = $7, triage_tier = $8, \
            target_timeframe = $9, recommendation = $10, clinician_notes = $11, \
            signed_at = $12, graded_at = $13, updated_at = now() WHERE id = $1 AND \
            deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.ultrasound_test_request_id)
        .bind(self.appropriateness_score)
        .bind(&self.appropriateness_band)
        .bind(&self.suitability_band)
        .bind(&self.prep_requirements)
        .bind(self.completeness_percent)
        .bind(&self.triage_tier)
        .bind(&self.target_timeframe)
        .bind(&self.recommendation)
        .bind(&self.clinician_notes)
        .bind(self.signed_at)
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
        .prefix("api/ultrasound_test_request_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
