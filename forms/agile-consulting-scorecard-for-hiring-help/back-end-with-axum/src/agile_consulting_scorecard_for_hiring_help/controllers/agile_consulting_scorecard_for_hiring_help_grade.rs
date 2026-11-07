//! Agile consulting scorecard for hiring help grade module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::agile_consulting_scorecard_for_hiring_help_grades::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Score total.
    pub score_total: Option<i32>,
    /// Manifesto subtotal.
    pub manifesto_subtotal: Option<i32>,
    /// Principles subtotal.
    pub principles_subtotal: Option<i32>,
    /// Computed band.
    pub computed_band: String,
    /// Final band.
    pub final_band: String,
    /// Override reason.
    pub override_reason: String,
    /// Recommendation.
    pub recommendation: String,
    /// Recommended focus areas.
    pub recommended_focus_areas: String,
    /// Review notes.
    pub review_notes: String,
    /// Signed by.
    pub signed_by: String,
    /// Signed at.
    pub signed_at: Option<DateTimeWithTimeZone>,
    /// Graded at.
    pub graded_at: DateTimeWithTimeZone,
    /// Agile consulting scorecard for hiring help id.
    pub agile_consulting_scorecard_for_hiring_help_id: Uuid,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO agile_consulting_scorecard_for_hiring_help_grades (score_total, \
            manifesto_subtotal, principles_subtotal, computed_band, final_band, \
            override_reason, recommendation, recommended_focus_areas, review_notes, \
            signed_by, signed_at, graded_at, \
            agile_consulting_scorecard_for_hiring_help_id) VALUES ($1, $2, $3, $4, $5, \
            $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *",
        )
        .bind(self.score_total)
        .bind(self.manifesto_subtotal)
        .bind(self.principles_subtotal)
        .bind(&self.computed_band)
        .bind(&self.final_band)
        .bind(&self.override_reason)
        .bind(&self.recommendation)
        .bind(&self.recommended_focus_areas)
        .bind(&self.review_notes)
        .bind(&self.signed_by)
        .bind(self.signed_at)
        .bind(self.graded_at)
        .bind(self.agile_consulting_scorecard_for_hiring_help_id)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE agile_consulting_scorecard_for_hiring_help_grades SET score_total = \
            $2, manifesto_subtotal = $3, principles_subtotal = $4, computed_band = $5, \
            final_band = $6, override_reason = $7, recommendation = $8, \
            recommended_focus_areas = $9, review_notes = $10, signed_by = $11, signed_at \
            = $12, graded_at = $13, agile_consulting_scorecard_for_hiring_help_id = $14, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.score_total)
        .bind(self.manifesto_subtotal)
        .bind(self.principles_subtotal)
        .bind(&self.computed_band)
        .bind(&self.final_band)
        .bind(&self.override_reason)
        .bind(&self.recommendation)
        .bind(&self.recommended_focus_areas)
        .bind(&self.review_notes)
        .bind(&self.signed_by)
        .bind(self.signed_at)
        .bind(self.graded_at)
        .bind(self.agile_consulting_scorecard_for_hiring_help_id)
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
    let page = params.resolve(PAGE_LIMITS)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    Ok(page.respond(total, rows))
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
        .prefix("api/agile_consulting_scorecard_for_hiring_help_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
