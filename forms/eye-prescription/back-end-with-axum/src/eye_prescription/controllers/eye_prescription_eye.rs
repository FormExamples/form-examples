//! Eye prescription eye module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::eye_prescription_eyes::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Eye prescription id.
    pub eye_prescription_id: Uuid,
    /// Eye.
    pub eye: String,
    /// Sphere diopters.
    pub sphere_diopters: Option<f64>,
    /// Cylinder diopters.
    pub cylinder_diopters: Option<f64>,
    /// Axis degrees.
    pub axis_degrees: Option<i32>,
    /// Addition diopters.
    pub addition_diopters: Option<f64>,
    /// Intermediate addition diopters.
    pub intermediate_addition_diopters: Option<f64>,
    /// Prism horizontal diopters.
    pub prism_horizontal_diopters: f64,
    /// Base horizontal.
    pub base_horizontal: String,
    /// Prism vertical diopters.
    pub prism_vertical_diopters: f64,
    /// Base vertical.
    pub base_vertical: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO eye_prescription_eyes (eye_prescription_id, eye, \
            sphere_diopters, cylinder_diopters, axis_degrees, addition_diopters, \
            intermediate_addition_diopters, prism_horizontal_diopters, base_horizontal, \
            prism_vertical_diopters, base_vertical) VALUES ($1, $2, $3, $4, $5, $6, $7, \
            $8, $9, $10, $11) RETURNING *",
        )
        .bind(self.eye_prescription_id)
        .bind(&self.eye)
        .bind(self.sphere_diopters)
        .bind(self.cylinder_diopters)
        .bind(self.axis_degrees)
        .bind(self.addition_diopters)
        .bind(self.intermediate_addition_diopters)
        .bind(self.prism_horizontal_diopters)
        .bind(&self.base_horizontal)
        .bind(self.prism_vertical_diopters)
        .bind(&self.base_vertical)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE eye_prescription_eyes SET eye_prescription_id = $2, eye = $3, \
            sphere_diopters = $4, cylinder_diopters = $5, axis_degrees = $6, \
            addition_diopters = $7, intermediate_addition_diopters = $8, \
            prism_horizontal_diopters = $9, base_horizontal = $10, \
            prism_vertical_diopters = $11, base_vertical = $12, updated_at = now() WHERE \
            id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.eye_prescription_id)
        .bind(&self.eye)
        .bind(self.sphere_diopters)
        .bind(self.cylinder_diopters)
        .bind(self.axis_degrees)
        .bind(self.addition_diopters)
        .bind(self.intermediate_addition_diopters)
        .bind(self.prism_horizontal_diopters)
        .bind(&self.base_horizontal)
        .bind(self.prism_vertical_diopters)
        .bind(&self.base_vertical)
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
        .prefix("api/eye_prescription_eyes/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
