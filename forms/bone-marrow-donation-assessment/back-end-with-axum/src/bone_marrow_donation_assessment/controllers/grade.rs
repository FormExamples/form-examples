//! Grade module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::grades::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Eligibility.
    pub eligibility: String,
    /// Overall risk level.
    pub overall_risk_level: String,
    /// Hla match level.
    pub hla_match_level: String,
    /// Collection method.
    pub collection_method: String,
    /// Graded at.
    pub graded_at: DateTimeWithTimeZone,
    /// Bone marrow donation assessment id.
    pub assessment_id: Uuid,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO grades (eligibility, overall_risk_level, hla_match_level, \
            collection_method, graded_at, assessment_id) VALUES \
            ($1, $2, $3, $4, $5, $6) RETURNING *",
        )
        .bind(&self.eligibility)
        .bind(&self.overall_risk_level)
        .bind(&self.hla_match_level)
        .bind(&self.collection_method)
        .bind(self.graded_at)
        .bind(self.assessment_id)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE grades SET eligibility = $2, overall_risk_level = $3, hla_match_level \
            = $4, collection_method = $5, graded_at = $6, \
            assessment_id = $7, updated_at = now() WHERE id = $1 \
            AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(&self.eligibility)
        .bind(&self.overall_risk_level)
        .bind(&self.hla_match_level)
        .bind(&self.collection_method)
        .bind(self.graded_at)
        .bind(self.assessment_id)
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
        .prefix("api/grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
