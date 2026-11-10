//! Eye prescription visual acuity module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::eye_prescription_visual_acuities::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Eye prescription id.
    pub eye_prescription_id: Uuid,
    /// Distance right unaided.
    pub distance_right_unaided: String,
    /// Distance left unaided.
    pub distance_left_unaided: String,
    /// Distance binocular unaided.
    pub distance_binocular_unaided: String,
    /// Distance right corrected.
    pub distance_right_corrected: String,
    /// Distance left corrected.
    pub distance_left_corrected: String,
    /// Distance binocular corrected.
    pub distance_binocular_corrected: String,
    /// Near right unaided.
    pub near_right_unaided: String,
    /// Near left unaided.
    pub near_left_unaided: String,
    /// Near binocular unaided.
    pub near_binocular_unaided: String,
    /// Near right corrected.
    pub near_right_corrected: String,
    /// Near left corrected.
    pub near_left_corrected: String,
    /// Near binocular corrected.
    pub near_binocular_corrected: String,
    /// Pinhole right.
    pub pinhole_right: String,
    /// Pinhole left.
    pub pinhole_left: String,
    /// Dominant eye.
    pub dominant_eye: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO eye_prescription_visual_acuities (eye_prescription_id, \
            distance_right_unaided, distance_left_unaided, distance_binocular_unaided, \
            distance_right_corrected, distance_left_corrected, \
            distance_binocular_corrected, near_right_unaided, near_left_unaided, \
            near_binocular_unaided, near_right_corrected, near_left_corrected, \
            near_binocular_corrected, pinhole_right, pinhole_left, dominant_eye) VALUES \
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) \
            RETURNING *",
        )
        .bind(self.eye_prescription_id)
        .bind(&self.distance_right_unaided)
        .bind(&self.distance_left_unaided)
        .bind(&self.distance_binocular_unaided)
        .bind(&self.distance_right_corrected)
        .bind(&self.distance_left_corrected)
        .bind(&self.distance_binocular_corrected)
        .bind(&self.near_right_unaided)
        .bind(&self.near_left_unaided)
        .bind(&self.near_binocular_unaided)
        .bind(&self.near_right_corrected)
        .bind(&self.near_left_corrected)
        .bind(&self.near_binocular_corrected)
        .bind(&self.pinhole_right)
        .bind(&self.pinhole_left)
        .bind(&self.dominant_eye)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE eye_prescription_visual_acuities SET eye_prescription_id = $2, \
            distance_right_unaided = $3, distance_left_unaided = $4, \
            distance_binocular_unaided = $5, distance_right_corrected = $6, \
            distance_left_corrected = $7, distance_binocular_corrected = $8, \
            near_right_unaided = $9, near_left_unaided = $10, near_binocular_unaided = \
            $11, near_right_corrected = $12, near_left_corrected = $13, \
            near_binocular_corrected = $14, pinhole_right = $15, pinhole_left = $16, \
            dominant_eye = $17, updated_at = now() WHERE id = $1 AND deleted_at IS NULL \
            RETURNING *",
        )
        .bind(id)
        .bind(self.eye_prescription_id)
        .bind(&self.distance_right_unaided)
        .bind(&self.distance_left_unaided)
        .bind(&self.distance_binocular_unaided)
        .bind(&self.distance_right_corrected)
        .bind(&self.distance_left_corrected)
        .bind(&self.distance_binocular_corrected)
        .bind(&self.near_right_unaided)
        .bind(&self.near_left_unaided)
        .bind(&self.near_binocular_unaided)
        .bind(&self.near_right_corrected)
        .bind(&self.near_left_corrected)
        .bind(&self.near_binocular_corrected)
        .bind(&self.pinhole_right)
        .bind(&self.pinhole_left)
        .bind(&self.dominant_eye)
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
        .prefix("api/eye_prescription_visual_acuities/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
