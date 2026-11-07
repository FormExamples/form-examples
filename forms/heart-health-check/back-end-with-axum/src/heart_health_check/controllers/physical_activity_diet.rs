//! Physical activity diet module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::physical_activity_diets::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Assessment id.
    pub assessment_id: Uuid,
    /// Physical activity minutes per week.
    pub physical_activity_minutes_per_week: Option<i32>,
    /// Activity intensity.
    pub activity_intensity: String,
    /// Fruit veg portions per day.
    pub fruit_veg_portions_per_day: Option<i32>,
    /// Diet quality.
    pub diet_quality: String,
    /// Salt intake.
    pub salt_intake: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO physical_activity_diets (assessment_id, \
            physical_activity_minutes_per_week, activity_intensity, \
            fruit_veg_portions_per_day, diet_quality, salt_intake) VALUES ($1, $2, $3, \
            $4, $5, $6) RETURNING *",
        )
        .bind(self.assessment_id)
        .bind(self.physical_activity_minutes_per_week)
        .bind(&self.activity_intensity)
        .bind(self.fruit_veg_portions_per_day)
        .bind(&self.diet_quality)
        .bind(&self.salt_intake)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE physical_activity_diets SET assessment_id = $2, \
            physical_activity_minutes_per_week = $3, activity_intensity = $4, \
            fruit_veg_portions_per_day = $5, diet_quality = $6, salt_intake = $7, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.assessment_id)
        .bind(self.physical_activity_minutes_per_week)
        .bind(&self.activity_intensity)
        .bind(self.fruit_veg_portions_per_day)
        .bind(&self.diet_quality)
        .bind(&self.salt_intake)
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
        .prefix("api/physical_activity_diets/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
