#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::mammography_test_request_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub mammography_test_request_id: Uuid,
    pub appropriateness_score: Option<i32>,
    pub appropriateness_band: String,
    pub triage_tier: String,
    pub target_timeframe: String,
    pub two_week_wait_eligible: bool,
    pub two_week_wait_rationale: String,
    pub completeness_percent: Option<i32>,
    pub priority_band: String,
    pub recommendation: String,
    pub clinician_notes: String,
    pub signed_at: Option<DateTimeWithTimeZone>,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO mammography_test_request_grades (deleted_at, \
            mammography_test_request_id, appropriateness_score, appropriateness_band, \
            triage_tier, target_timeframe, two_week_wait_eligible, two_week_wait_rationale, \
            completeness_percent, priority_band, recommendation, clinician_notes, signed_at, \
            graded_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) \
            RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.mammography_test_request_id)
        .bind(self.appropriateness_score)
        .bind(&self.appropriateness_band)
        .bind(&self.triage_tier)
        .bind(&self.target_timeframe)
        .bind(self.two_week_wait_eligible)
        .bind(&self.two_week_wait_rationale)
        .bind(self.completeness_percent)
        .bind(&self.priority_band)
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
            "UPDATE mammography_test_request_grades SET deleted_at = $2, \
            mammography_test_request_id = $3, appropriateness_score = $4, \
            appropriateness_band = $5, triage_tier = $6, target_timeframe = $7, \
            two_week_wait_eligible = $8, two_week_wait_rationale = $9, completeness_percent = \
            $10, priority_band = $11, recommendation = $12, clinician_notes = $13, signed_at \
            = $14, graded_at = $15, updated_at = now() WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(self.mammography_test_request_id)
        .bind(self.appropriateness_score)
        .bind(&self.appropriateness_band)
        .bind(&self.triage_tier)
        .bind(&self.target_timeframe)
        .bind(self.two_week_wait_eligible)
        .bind(&self.two_week_wait_rationale)
        .bind(self.completeness_percent)
        .bind(&self.priority_band)
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
        .prefix("api/mammography_test_request_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
