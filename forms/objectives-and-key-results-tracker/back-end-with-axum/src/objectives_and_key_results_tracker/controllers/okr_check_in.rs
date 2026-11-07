//! Okr check in module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::okr_check_ins::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Okr objective id.
    pub okr_objective_id: Uuid,
    /// Checked in at.
    pub checked_in_at: DateTimeWithTimeZone,
    /// Narrative.
    pub narrative: String,
    /// Since last changes.
    pub since_last_changes: String,
    /// Blockers.
    pub blockers: String,
    /// Asks.
    pub asks: String,
    /// Confidence decile at check in.
    pub confidence_decile_at_check_in: Option<i32>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO okr_check_ins (okr_objective_id, checked_in_at, narrative, \
            since_last_changes, blockers, asks, confidence_decile_at_check_in) VALUES \
            ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        )
        .bind(self.okr_objective_id)
        .bind(self.checked_in_at)
        .bind(&self.narrative)
        .bind(&self.since_last_changes)
        .bind(&self.blockers)
        .bind(&self.asks)
        .bind(self.confidence_decile_at_check_in)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE okr_check_ins SET okr_objective_id = $2, checked_in_at = $3, \
            narrative = $4, since_last_changes = $5, blockers = $6, asks = $7, \
            confidence_decile_at_check_in = $8, updated_at = now() WHERE id = $1 AND \
            deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.okr_objective_id)
        .bind(self.checked_in_at)
        .bind(&self.narrative)
        .bind(&self.since_last_changes)
        .bind(&self.blockers)
        .bind(&self.asks)
        .bind(self.confidence_decile_at_check_in)
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
        .prefix("api/okr_check_ins/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
