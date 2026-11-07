//! Assessment current management module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::assessment_current_managements::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Assessment id.
    pub assessment_id: Uuid,
    /// Antihistamines.
    pub antihistamines: String,
    /// Antihistamine details.
    pub antihistamine_details: String,
    /// Nasal steroids.
    pub nasal_steroids: String,
    /// Adrenaline auto injector.
    pub adrenaline_auto_injector: String,
    /// Immunotherapy.
    pub immunotherapy: String,
    /// Immunotherapy details.
    pub immunotherapy_details: String,
    /// Biologics.
    pub biologics: String,
    /// Biologic details.
    pub biologic_details: String,
    /// Allergen avoidance strategies.
    pub allergen_avoidance_strategies: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO assessment_current_managements (assessment_id, antihistamines, \
            antihistamine_details, nasal_steroids, adrenaline_auto_injector, \
            immunotherapy, immunotherapy_details, biologics, biologic_details, \
            allergen_avoidance_strategies) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, \
            $10) RETURNING *",
        )
        .bind(self.assessment_id)
        .bind(&self.antihistamines)
        .bind(&self.antihistamine_details)
        .bind(&self.nasal_steroids)
        .bind(&self.adrenaline_auto_injector)
        .bind(&self.immunotherapy)
        .bind(&self.immunotherapy_details)
        .bind(&self.biologics)
        .bind(&self.biologic_details)
        .bind(&self.allergen_avoidance_strategies)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE assessment_current_managements SET assessment_id = $2, antihistamines \
            = $3, antihistamine_details = $4, nasal_steroids = $5, \
            adrenaline_auto_injector = $6, immunotherapy = $7, immunotherapy_details = \
            $8, biologics = $9, biologic_details = $10, allergen_avoidance_strategies = \
            $11, updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.assessment_id)
        .bind(&self.antihistamines)
        .bind(&self.antihistamine_details)
        .bind(&self.nasal_steroids)
        .bind(&self.adrenaline_auto_injector)
        .bind(&self.immunotherapy)
        .bind(&self.immunotherapy_details)
        .bind(&self.biologics)
        .bind(&self.biologic_details)
        .bind(&self.allergen_avoidance_strategies)
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
        .prefix("api/assessment_current_managements/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
