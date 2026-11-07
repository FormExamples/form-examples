//! Okr grade module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::okr_grades::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Okr objective id.
    pub okr_objective_id: Uuid,
    /// Score by progress percent.
    pub score_by_progress_percent: Option<f64>,
    /// Score by confidence decile.
    pub score_by_confidence_decile: Option<i32>,
    /// Score by stretch tier.
    pub score_by_stretch_tier: Option<i32>,
    /// Score by alignment grade.
    pub score_by_alignment_grade: Option<i32>,
    /// Score by impact tier.
    pub score_by_impact_tier: Option<i32>,
    /// Score by smart quality.
    pub score_by_smart_quality: Option<i32>,
    /// Score by pace deviation percent.
    pub score_by_pace_deviation_percent: Option<f64>,
    /// Computed composite rag.
    pub computed_composite_rag: String,
    /// Final composite rag.
    pub final_composite_rag: String,
    /// Override reason.
    pub override_reason: String,
    /// Recommendation.
    pub recommendation: String,
    /// Triage notes.
    pub triage_notes: String,
    /// Signed by.
    pub signed_by: String,
    /// Signed at.
    pub signed_at: Option<DateTimeWithTimeZone>,
    /// Graded at.
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO okr_grades (okr_objective_id, score_by_progress_percent, \
            score_by_confidence_decile, score_by_stretch_tier, score_by_alignment_grade, \
            score_by_impact_tier, score_by_smart_quality, \
            score_by_pace_deviation_percent, computed_composite_rag, \
            final_composite_rag, override_reason, recommendation, triage_notes, \
            signed_by, signed_at, graded_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, \
            $10, $11, $12, $13, $14, $15, $16) RETURNING *",
        )
        .bind(self.okr_objective_id)
        .bind(self.score_by_progress_percent)
        .bind(self.score_by_confidence_decile)
        .bind(self.score_by_stretch_tier)
        .bind(self.score_by_alignment_grade)
        .bind(self.score_by_impact_tier)
        .bind(self.score_by_smart_quality)
        .bind(self.score_by_pace_deviation_percent)
        .bind(&self.computed_composite_rag)
        .bind(&self.final_composite_rag)
        .bind(&self.override_reason)
        .bind(&self.recommendation)
        .bind(&self.triage_notes)
        .bind(&self.signed_by)
        .bind(self.signed_at)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE okr_grades SET okr_objective_id = $2, score_by_progress_percent = $3, \
            score_by_confidence_decile = $4, score_by_stretch_tier = $5, \
            score_by_alignment_grade = $6, score_by_impact_tier = $7, \
            score_by_smart_quality = $8, score_by_pace_deviation_percent = $9, \
            computed_composite_rag = $10, final_composite_rag = $11, override_reason = \
            $12, recommendation = $13, triage_notes = $14, signed_by = $15, signed_at = \
            $16, graded_at = $17, updated_at = now() WHERE id = $1 AND deleted_at IS \
            NULL RETURNING *",
        )
        .bind(id)
        .bind(self.okr_objective_id)
        .bind(self.score_by_progress_percent)
        .bind(self.score_by_confidence_decile)
        .bind(self.score_by_stretch_tier)
        .bind(self.score_by_alignment_grade)
        .bind(self.score_by_impact_tier)
        .bind(self.score_by_smart_quality)
        .bind(self.score_by_pace_deviation_percent)
        .bind(&self.computed_composite_rag)
        .bind(&self.final_composite_rag)
        .bind(&self.override_reason)
        .bind(&self.recommendation)
        .bind(&self.triage_notes)
        .bind(&self.signed_by)
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
    Query(params): Query<PageParams>,
) -> Result<Response> {
    let page = paging::resolve(&params)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    paging::respond(page, total, rows)
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
        .prefix("api/okr_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
