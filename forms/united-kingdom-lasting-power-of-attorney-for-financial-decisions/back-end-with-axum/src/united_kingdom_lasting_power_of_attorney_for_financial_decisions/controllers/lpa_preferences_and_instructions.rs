//! Lpa preferences and instructions module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::lpa_preferences_and_instructions::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Lpa id.
    pub lpa_id: Uuid,
    /// Preferences overflow text.
    pub preferences_overflow_text: String,
    /// Instructions overflow text.
    pub instructions_overflow_text: String,
    /// Decisions jointly overflow text.
    pub decisions_jointly_overflow_text: String,
    /// Replacement step in overflow text.
    pub replacement_step_in_overflow_text: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO lpa_preferences_and_instructions (lpa_id, \
            preferences_overflow_text, instructions_overflow_text, \
            decisions_jointly_overflow_text, replacement_step_in_overflow_text) VALUES \
            ($1, $2, $3, $4, $5) RETURNING *",
        )
        .bind(self.lpa_id)
        .bind(&self.preferences_overflow_text)
        .bind(&self.instructions_overflow_text)
        .bind(&self.decisions_jointly_overflow_text)
        .bind(&self.replacement_step_in_overflow_text)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE lpa_preferences_and_instructions SET lpa_id = $2, \
            preferences_overflow_text = $3, instructions_overflow_text = $4, \
            decisions_jointly_overflow_text = $5, replacement_step_in_overflow_text = \
            $6, updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.lpa_id)
        .bind(&self.preferences_overflow_text)
        .bind(&self.instructions_overflow_text)
        .bind(&self.decisions_jointly_overflow_text)
        .bind(&self.replacement_step_in_overflow_text)
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
        .prefix("api/lpa_preferences_and_instructions/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
