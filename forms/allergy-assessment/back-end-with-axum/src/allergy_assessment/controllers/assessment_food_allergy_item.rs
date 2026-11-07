//! Assessment food allergy item module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::assessment_food_allergy_items::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Food allergies id.
    pub food_allergies_id: Uuid,
    /// Allergen.
    pub allergen: String,
    /// Reaction type.
    pub reaction_type: String,
    /// Severity.
    pub severity: String,
    /// Timing.
    pub timing: String,
    /// Alternatives tolerated.
    pub alternatives_tolerated: String,
    /// Sort order.
    pub sort_order: i32,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO assessment_food_allergy_items (food_allergies_id, allergen, \
            reaction_type, severity, timing, alternatives_tolerated, sort_order) VALUES \
            ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        )
        .bind(self.food_allergies_id)
        .bind(&self.allergen)
        .bind(&self.reaction_type)
        .bind(&self.severity)
        .bind(&self.timing)
        .bind(&self.alternatives_tolerated)
        .bind(self.sort_order)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE assessment_food_allergy_items SET food_allergies_id = $2, allergen = \
            $3, reaction_type = $4, severity = $5, timing = $6, alternatives_tolerated = \
            $7, sort_order = $8, updated_at = now() WHERE id = $1 AND deleted_at IS NULL \
            RETURNING *",
        )
        .bind(id)
        .bind(self.food_allergies_id)
        .bind(&self.allergen)
        .bind(&self.reaction_type)
        .bind(&self.severity)
        .bind(&self.timing)
        .bind(&self.alternatives_tolerated)
        .bind(self.sort_order)
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
    let page = paging::resolve(&params)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    paging::respond(page, total, rows)
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
        .prefix("api/assessment_food_allergy_items/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
