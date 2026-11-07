//! Medical operation note complication controller.
#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::medical_operation_note_complications::Model;

/// Parameters accepted when creating or updating a medical operation note complication record.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Category.
    pub category: String,
    /// Description.
    pub description: String,
    /// Clavien dindo grade.
    pub clavien_dindo_grade: String,
    /// Onset at.
    pub onset_at: Option<DateTimeWithTimeZone>,
    /// Action taken.
    pub action_taken: String,
    /// Resolved in theatre.
    pub resolved_in_theatre: String,
    /// Reported to governance.
    pub reported_to_governance: String,
    /// Medical operation note ID.
    pub medical_operation_note_id: Uuid,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO medical_operation_note_complications (category, description, \
            clavien_dindo_grade, onset_at, action_taken, resolved_in_theatre, \
            reported_to_governance, medical_operation_note_id) VALUES ($1, $2, $3, $4, $5, \
            $6, $7, $8) RETURNING *",
        )
        .bind(&self.category)
        .bind(&self.description)
        .bind(&self.clavien_dindo_grade)
        .bind(self.onset_at)
        .bind(&self.action_taken)
        .bind(&self.resolved_in_theatre)
        .bind(&self.reported_to_governance)
        .bind(self.medical_operation_note_id)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE medical_operation_note_complications SET category = $2, description = \
            $3, clavien_dindo_grade = $4, onset_at = $5, action_taken = $6, \
            resolved_in_theatre = $7, reported_to_governance = $8, \
            medical_operation_note_id = $9, updated_at = now() WHERE id = $1 AND \
            deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(&self.category)
        .bind(&self.description)
        .bind(&self.clavien_dindo_grade)
        .bind(self.onset_at)
        .bind(&self.action_taken)
        .bind(&self.resolved_in_theatre)
        .bind(&self.reported_to_governance)
        .bind(self.medical_operation_note_id)
        .fetch_optional(db)
        .await
    }
}

async fn load_item(ctx: &AppContext, id: Uuid) -> Result<Model> {
    let item = Model::find_by_id(&db(ctx), id).await?;
    item.ok_or_else(|| Error::NotFound)
}

/// List every medical operation note complication record.
#[debug_handler]
pub async fn list(
    State(ctx): State<AppContext>,
    Query(params): Query<PageParams>,
) -> Result<Response> {
    let page = params.resolve(PAGE_LIMITS)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    Ok(page.respond(total, rows))
}

/// Create a new medical operation note complication record.
#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

/// Update the medical operation note complication record identified by `id`.
#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = params.update(&db(&ctx), id).await?.ok_or(Error::NotFound)?;
    format::json(item)
}

/// Remove the medical operation note complication record identified by `id`.
#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?;
    Model::delete(&db(&ctx), id).await?;
    format::empty()
}

/// Fetch the single medical operation note complication record identified by `id`.
#[debug_handler]
pub async fn get_one(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(load_item(&ctx, id).await?)
}

/// Build the routes for the medical operation note complications resource.
pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/medical_operation_note_complications/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
