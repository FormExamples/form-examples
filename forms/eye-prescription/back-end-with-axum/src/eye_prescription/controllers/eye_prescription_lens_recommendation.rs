//! Eye prescription lens recommendation module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::eye_prescription_lens_recommendations::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Eye prescription id.
    pub eye_prescription_id: Uuid,
    /// Lens type.
    pub lens_type: String,
    /// Material.
    pub material: String,
    /// Refractive index.
    pub refractive_index: Option<f64>,
    /// Aspheric.
    pub aspheric: bool,
    /// Coating anti reflective.
    pub coating_anti_reflective: bool,
    /// Coating scratch resistant.
    pub coating_scratch_resistant: bool,
    /// Coating hydrophobic.
    pub coating_hydrophobic: bool,
    /// Coating blue light.
    pub coating_blue_light: bool,
    /// Coating photochromic.
    pub coating_photochromic: bool,
    /// Coating polarised.
    pub coating_polarised: bool,
    /// Coating uv 400.
    pub coating_uv_400: bool,
    /// Tint description.
    pub tint_description: String,
    /// Tint percent.
    pub tint_percent: Option<i32>,
    /// Dispenser notes.
    pub dispenser_notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO eye_prescription_lens_recommendations (eye_prescription_id, \
            lens_type, material, refractive_index, aspheric, coating_anti_reflective, \
            coating_scratch_resistant, coating_hydrophobic, coating_blue_light, \
            coating_photochromic, coating_polarised, coating_uv_400, tint_description, \
            tint_percent, dispenser_notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, \
            $10, $11, $12, $13, $14, $15) RETURNING *",
        )
        .bind(self.eye_prescription_id)
        .bind(&self.lens_type)
        .bind(&self.material)
        .bind(self.refractive_index)
        .bind(self.aspheric)
        .bind(self.coating_anti_reflective)
        .bind(self.coating_scratch_resistant)
        .bind(self.coating_hydrophobic)
        .bind(self.coating_blue_light)
        .bind(self.coating_photochromic)
        .bind(self.coating_polarised)
        .bind(self.coating_uv_400)
        .bind(&self.tint_description)
        .bind(self.tint_percent)
        .bind(&self.dispenser_notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE eye_prescription_lens_recommendations SET eye_prescription_id = $2, \
            lens_type = $3, material = $4, refractive_index = $5, aspheric = $6, \
            coating_anti_reflective = $7, coating_scratch_resistant = $8, \
            coating_hydrophobic = $9, coating_blue_light = $10, coating_photochromic = \
            $11, coating_polarised = $12, coating_uv_400 = $13, tint_description = $14, \
            tint_percent = $15, dispenser_notes = $16, updated_at = now() WHERE id = $1 \
            AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.eye_prescription_id)
        .bind(&self.lens_type)
        .bind(&self.material)
        .bind(self.refractive_index)
        .bind(self.aspheric)
        .bind(self.coating_anti_reflective)
        .bind(self.coating_scratch_resistant)
        .bind(self.coating_hydrophobic)
        .bind(self.coating_blue_light)
        .bind(self.coating_photochromic)
        .bind(self.coating_polarised)
        .bind(self.coating_uv_400)
        .bind(&self.tint_description)
        .bind(self.tint_percent)
        .bind(&self.dispenser_notes)
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
        .prefix("api/eye_prescription_lens_recommendations/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
