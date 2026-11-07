//! Assessment drug allergy item module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::assessment_drug_allergy_items::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
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
    /// Assessment drug allergy id.
    pub assessment_drug_allergy_id: Uuid,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO assessment_drug_allergy_items (allergen, reaction_type, \
            severity, timing, alternatives_tolerated, sort_order, \
            assessment_drug_allergy_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        )
        .bind(&self.allergen)
        .bind(&self.reaction_type)
        .bind(&self.severity)
        .bind(&self.timing)
        .bind(&self.alternatives_tolerated)
        .bind(self.sort_order)
        .bind(self.assessment_drug_allergy_id)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE assessment_drug_allergy_items SET allergen = $2, reaction_type = $3, \
            severity = $4, timing = $5, alternatives_tolerated = $6, sort_order = $7, \
            assessment_drug_allergy_id = $8, updated_at = now() WHERE id = $1 AND \
            deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(&self.allergen)
        .bind(&self.reaction_type)
        .bind(&self.severity)
        .bind(&self.timing)
        .bind(&self.alternatives_tolerated)
        .bind(self.sort_order)
        .bind(self.assessment_drug_allergy_id)
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
        .prefix("api/assessment_drug_allergy_items/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
