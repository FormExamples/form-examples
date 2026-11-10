//! Assessment testing results module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::assessment_testing_results::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Assessment id.
    pub assessment_id: Uuid,
    /// Skin prick tests done.
    pub skin_prick_tests_done: String,
    /// Specific ige done.
    pub specific_ige_done: String,
    /// Component resolved diagnostics done.
    pub component_resolved_diagnostics_done: String,
    /// Challenge tests done.
    pub challenge_tests_done: String,
    /// Patch tests done.
    pub patch_tests_done: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO assessment_testing_results (assessment_id, \
            skin_prick_tests_done, specific_ige_done, \
            component_resolved_diagnostics_done, challenge_tests_done, patch_tests_done) \
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        )
        .bind(self.assessment_id)
        .bind(&self.skin_prick_tests_done)
        .bind(&self.specific_ige_done)
        .bind(&self.component_resolved_diagnostics_done)
        .bind(&self.challenge_tests_done)
        .bind(&self.patch_tests_done)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE assessment_testing_results SET assessment_id = $2, \
            skin_prick_tests_done = $3, specific_ige_done = $4, \
            component_resolved_diagnostics_done = $5, challenge_tests_done = $6, \
            patch_tests_done = $7, updated_at = now() WHERE id = $1 AND deleted_at IS \
            NULL RETURNING *",
        )
        .bind(id)
        .bind(self.assessment_id)
        .bind(&self.skin_prick_tests_done)
        .bind(&self.specific_ige_done)
        .bind(&self.component_resolved_diagnostics_done)
        .bind(&self.challenge_tests_done)
        .bind(&self.patch_tests_done)
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
        .prefix("api/assessment_testing_results/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
