//! Arc42 documentation grade module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::arc42_documentation_grades::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Arc42 documentation id.
    pub arc42_documentation_id: Uuid,
    /// Computed maturity.
    pub computed_maturity: String,
    /// Final maturity.
    pub final_maturity: String,
    /// Override reason.
    pub override_reason: String,
    /// Completeness section 1.
    pub completeness_section_1: String,
    /// Completeness section 2.
    pub completeness_section_2: String,
    /// Completeness section 3.
    pub completeness_section_3: String,
    /// Completeness section 4.
    pub completeness_section_4: String,
    /// Completeness section 5.
    pub completeness_section_5: String,
    /// Completeness section 6.
    pub completeness_section_6: String,
    /// Completeness section 7.
    pub completeness_section_7: String,
    /// Completeness section 8.
    pub completeness_section_8: String,
    /// Completeness section 9.
    pub completeness_section_9: String,
    /// Completeness section 10.
    pub completeness_section_10: String,
    /// Completeness section 11.
    pub completeness_section_11: String,
    /// Completeness section 12.
    pub completeness_section_12: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO arc42_documentation_grades (arc42_documentation_id, \
            computed_maturity, final_maturity, override_reason, completeness_section_1, \
            completeness_section_2, completeness_section_3, completeness_section_4, \
            completeness_section_5, completeness_section_6, completeness_section_7, \
            completeness_section_8, completeness_section_9, completeness_section_10, \
            completeness_section_11, completeness_section_12) VALUES ($1, $2, $3, $4, \
            $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *",
        )
        .bind(self.arc42_documentation_id)
        .bind(&self.computed_maturity)
        .bind(&self.final_maturity)
        .bind(&self.override_reason)
        .bind(&self.completeness_section_1)
        .bind(&self.completeness_section_2)
        .bind(&self.completeness_section_3)
        .bind(&self.completeness_section_4)
        .bind(&self.completeness_section_5)
        .bind(&self.completeness_section_6)
        .bind(&self.completeness_section_7)
        .bind(&self.completeness_section_8)
        .bind(&self.completeness_section_9)
        .bind(&self.completeness_section_10)
        .bind(&self.completeness_section_11)
        .bind(&self.completeness_section_12)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE arc42_documentation_grades SET arc42_documentation_id = $2, \
            computed_maturity = $3, final_maturity = $4, override_reason = $5, \
            completeness_section_1 = $6, completeness_section_2 = $7, \
            completeness_section_3 = $8, completeness_section_4 = $9, \
            completeness_section_5 = $10, completeness_section_6 = $11, \
            completeness_section_7 = $12, completeness_section_8 = $13, \
            completeness_section_9 = $14, completeness_section_10 = $15, \
            completeness_section_11 = $16, completeness_section_12 = $17, updated_at = \
            now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.arc42_documentation_id)
        .bind(&self.computed_maturity)
        .bind(&self.final_maturity)
        .bind(&self.override_reason)
        .bind(&self.completeness_section_1)
        .bind(&self.completeness_section_2)
        .bind(&self.completeness_section_3)
        .bind(&self.completeness_section_4)
        .bind(&self.completeness_section_5)
        .bind(&self.completeness_section_6)
        .bind(&self.completeness_section_7)
        .bind(&self.completeness_section_8)
        .bind(&self.completeness_section_9)
        .bind(&self.completeness_section_10)
        .bind(&self.completeness_section_11)
        .bind(&self.completeness_section_12)
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
        .prefix("api/arc42_documentation_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
