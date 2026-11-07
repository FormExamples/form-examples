//! Okr key result module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::okr_key_results::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Okr objective id.
    pub okr_objective_id: Uuid,
    /// Position.
    pub position: i32,
    /// Title.
    pub title: String,
    /// Kr type.
    pub kr_type: String,
    /// Unit.
    pub unit: String,
    /// Start value.
    pub start_value: Option<f64>,
    /// Current value.
    pub current_value: Option<f64>,
    /// Target value.
    pub target_value: Option<f64>,
    /// Milestones json.
    pub milestones_json: Option<serde_json::Value>,
    /// Binary done.
    pub binary_done: Option<bool>,
    /// Owner name.
    pub owner_name: String,
    /// Due date.
    pub due_date: Option<Date>,
    /// Progress fraction.
    pub progress_fraction: Option<f64>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO okr_key_results (okr_objective_id, position, title, kr_type, \
            unit, start_value, current_value, target_value, milestones_json, \
            binary_done, owner_name, due_date, progress_fraction) VALUES ($1, $2, $3, \
            $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *",
        )
        .bind(self.okr_objective_id)
        .bind(self.position)
        .bind(&self.title)
        .bind(&self.kr_type)
        .bind(&self.unit)
        .bind(self.start_value)
        .bind(self.current_value)
        .bind(self.target_value)
        .bind(&self.milestones_json)
        .bind(self.binary_done)
        .bind(&self.owner_name)
        .bind(self.due_date)
        .bind(self.progress_fraction)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE okr_key_results SET okr_objective_id = $2, position = $3, title = $4, \
            kr_type = $5, unit = $6, start_value = $7, current_value = $8, target_value \
            = $9, milestones_json = $10, binary_done = $11, owner_name = $12, due_date = \
            $13, progress_fraction = $14, updated_at = now() WHERE id = $1 AND \
            deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.okr_objective_id)
        .bind(self.position)
        .bind(&self.title)
        .bind(&self.kr_type)
        .bind(&self.unit)
        .bind(self.start_value)
        .bind(self.current_value)
        .bind(self.target_value)
        .bind(&self.milestones_json)
        .bind(self.binary_done)
        .bind(&self.owner_name)
        .bind(self.due_date)
        .bind(self.progress_fraction)
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
        .prefix("api/okr_key_results/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
