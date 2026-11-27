//! Hsct hla typing request grade module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::hsct_hla_typing_request_grades::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Request id.
    pub request_id: Uuid,
    /// Appropriateness score.
    pub appropriateness_score: Option<i32>,
    /// Appropriateness band.
    pub appropriateness_band: String,
    /// Identity safety band.
    pub identity_safety_band: String,
    /// Completeness percent.
    pub completeness_percent: Option<i32>,
    /// Triage tier.
    pub triage_tier: String,
    /// Target timeframe.
    pub target_timeframe: String,
    /// Required samples summary.
    pub required_samples_summary: String,
    /// Recommendation.
    pub recommendation: String,
    /// Clinician notes.
    pub clinician_notes: String,
    /// Signed at.
    pub signed_at: Option<DateTimeWithTimeZone>,
    /// Graded at.
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO hsct_hla_typing_request_grades (request_id, \
            appropriateness_score, appropriateness_band, identity_safety_band, \
            completeness_percent, triage_tier, target_timeframe, \
            required_samples_summary, recommendation, clinician_notes, signed_at, \
            graded_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) \
            RETURNING *",
        )
        .bind(self.request_id)
        .bind(self.appropriateness_score)
        .bind(&self.appropriateness_band)
        .bind(&self.identity_safety_band)
        .bind(self.completeness_percent)
        .bind(&self.triage_tier)
        .bind(&self.target_timeframe)
        .bind(&self.required_samples_summary)
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
            "UPDATE hsct_hla_typing_request_grades SET request_id = $2, \
            appropriateness_score = $3, appropriateness_band = $4, identity_safety_band \
            = $5, completeness_percent = $6, triage_tier = $7, target_timeframe = $8, \
            required_samples_summary = $9, recommendation = $10, clinician_notes = $11, \
            signed_at = $12, graded_at = $13, updated_at = now() WHERE id = $1 AND \
            deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.request_id)
        .bind(self.appropriateness_score)
        .bind(&self.appropriateness_band)
        .bind(&self.identity_safety_band)
        .bind(self.completeness_percent)
        .bind(&self.triage_tier)
        .bind(&self.target_timeframe)
        .bind(&self.required_samples_summary)
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

/// List.
#[debug_handler]
pub async fn list(
    State(ctx): State<AppContext>,
    OriginalUri(uri): OriginalUri,
) -> Result<Response> {
    let page = cursor_page(&ctx, &uri)?;
    let rows = Model::page(&db(&ctx), &page).await?;
    Ok(page.respond(rows))
}

/// Add.
#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

/// Update.
#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = params.update(&db(&ctx), id).await?.ok_or(Error::NotFound)?;
    format::json(item)
}

/// Remove.
#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?;
    Model::delete(&db(&ctx), id).await?;
    format::empty()
}

/// Get one.
#[debug_handler]
pub async fn get_one(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(load_item(&ctx, id).await?)
}

/// Routes.
pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/medical-haematopoietic-stem-cell-transplant-patients-donors-hla-typing-request/hsct_hla_typing_request_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
