//! Assessment rom measurement module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::assessment_rom_measurements::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Movement.
    pub movement: String,
    /// Active degrees.
    pub active_degrees: Option<i32>,
    /// Passive degrees.
    pub passive_degrees: Option<i32>,
    /// Normal degrees.
    pub normal_degrees: Option<i32>,
    /// End feel.
    pub end_feel: String,
    /// Pain on movement.
    pub pain_on_movement: String,
    /// Sort order.
    pub sort_order: i32,
    /// Assessment range of motion id.
    pub assessment_range_of_motion_id: Uuid,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO assessment_rom_measurements (movement, active_degrees, \
            passive_degrees, normal_degrees, end_feel, pain_on_movement, sort_order, \
            assessment_range_of_motion_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) \
            RETURNING *",
        )
        .bind(&self.movement)
        .bind(self.active_degrees)
        .bind(self.passive_degrees)
        .bind(self.normal_degrees)
        .bind(&self.end_feel)
        .bind(&self.pain_on_movement)
        .bind(self.sort_order)
        .bind(self.assessment_range_of_motion_id)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE assessment_rom_measurements SET movement = $2, active_degrees = $3, \
            passive_degrees = $4, normal_degrees = $5, end_feel = $6, pain_on_movement = \
            $7, sort_order = $8, assessment_range_of_motion_id = $9, updated_at = now() \
            WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(&self.movement)
        .bind(self.active_degrees)
        .bind(self.passive_degrees)
        .bind(self.normal_degrees)
        .bind(&self.end_feel)
        .bind(&self.pain_on_movement)
        .bind(self.sort_order)
        .bind(self.assessment_range_of_motion_id)
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
        .prefix("api/assessment_rom_measurements/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
