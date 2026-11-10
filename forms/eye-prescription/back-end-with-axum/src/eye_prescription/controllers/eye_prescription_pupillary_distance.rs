//! Eye prescription pupillary distance module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::eye_prescription_pupillary_distances::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Eye prescription id.
    pub eye_prescription_id: Uuid,
    /// Distance total mm.
    pub distance_total_mm: Option<f64>,
    /// Distance right mm.
    pub distance_right_mm: Option<f64>,
    /// Distance left mm.
    pub distance_left_mm: Option<f64>,
    /// Near total mm.
    pub near_total_mm: Option<f64>,
    /// Near right mm.
    pub near_right_mm: Option<f64>,
    /// Near left mm.
    pub near_left_mm: Option<f64>,
    /// Segment height right mm.
    pub segment_height_right_mm: Option<f64>,
    /// Segment height left mm.
    pub segment_height_left_mm: Option<f64>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO eye_prescription_pupillary_distances (eye_prescription_id, \
            distance_total_mm, distance_right_mm, distance_left_mm, near_total_mm, \
            near_right_mm, near_left_mm, segment_height_right_mm, \
            segment_height_left_mm) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) \
            RETURNING *",
        )
        .bind(self.eye_prescription_id)
        .bind(self.distance_total_mm)
        .bind(self.distance_right_mm)
        .bind(self.distance_left_mm)
        .bind(self.near_total_mm)
        .bind(self.near_right_mm)
        .bind(self.near_left_mm)
        .bind(self.segment_height_right_mm)
        .bind(self.segment_height_left_mm)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE eye_prescription_pupillary_distances SET eye_prescription_id = $2, \
            distance_total_mm = $3, distance_right_mm = $4, distance_left_mm = $5, \
            near_total_mm = $6, near_right_mm = $7, near_left_mm = $8, \
            segment_height_right_mm = $9, segment_height_left_mm = $10, updated_at = \
            now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.eye_prescription_id)
        .bind(self.distance_total_mm)
        .bind(self.distance_right_mm)
        .bind(self.distance_left_mm)
        .bind(self.near_total_mm)
        .bind(self.near_right_mm)
        .bind(self.near_left_mm)
        .bind(self.segment_height_right_mm)
        .bind(self.segment_height_left_mm)
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
        .prefix("api/eye_prescription_pupillary_distances/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
