//! Inpatient clinical note job controller.
#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::inpatient_clinical_note_jobs::Model;

/// Parameters accepted when creating or updating a inpatient clinical note job record.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Sort order.
    pub sort_order: i32,
    /// Job.
    pub job: String,
    /// Category.
    pub category: String,
    /// Owner.
    pub owner: String,
    /// Priority.
    pub priority: String,
    /// Due at.
    pub due_at: Option<DateTimeWithTimeZone>,
    /// Status.
    pub status: String,
    /// Completed at.
    pub completed_at: Option<DateTimeWithTimeZone>,
    /// Notes.
    pub notes: String,
    /// Inpatient clinical note ID.
    pub inpatient_clinical_note_id: Uuid,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO inpatient_clinical_note_jobs (sort_order, job, category, owner, \
            priority, due_at, status, completed_at, notes, inpatient_clinical_note_id) \
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
        )
        .bind(self.sort_order)
        .bind(&self.job)
        .bind(&self.category)
        .bind(&self.owner)
        .bind(&self.priority)
        .bind(self.due_at)
        .bind(&self.status)
        .bind(self.completed_at)
        .bind(&self.notes)
        .bind(self.inpatient_clinical_note_id)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE inpatient_clinical_note_jobs SET sort_order = $2, job = $3, category \
            = $4, owner = $5, priority = $6, due_at = $7, status = $8, completed_at = \
            $9, notes = $10, inpatient_clinical_note_id = $11, updated_at = now() WHERE \
            id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.sort_order)
        .bind(&self.job)
        .bind(&self.category)
        .bind(&self.owner)
        .bind(&self.priority)
        .bind(self.due_at)
        .bind(&self.status)
        .bind(self.completed_at)
        .bind(&self.notes)
        .bind(self.inpatient_clinical_note_id)
        .fetch_optional(db)
        .await
    }
}

async fn load_item(ctx: &AppContext, id: Uuid) -> Result<Model> {
    let item = Model::find_by_id(&db(ctx), id).await?;
    item.ok_or_else(|| Error::NotFound)
}

/// List every inpatient clinical note job record.
#[debug_handler]
pub async fn list(
    State(ctx): State<AppContext>,
    OriginalUri(uri): OriginalUri,
) -> Result<Response> {
    let page = cursor_page(&ctx, &uri)?;
    let rows = Model::page(&db(&ctx), &page).await?;
    Ok(page.respond(rows))
}

/// Create a new inpatient clinical note job record.
#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

/// Update the inpatient clinical note job record identified by `id`.
#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = params.update(&db(&ctx), id).await?.ok_or(Error::NotFound)?;
    format::json(item)
}

/// Remove the inpatient clinical note job record identified by `id`.
#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?;
    Model::delete(&db(&ctx), id).await?;
    format::empty()
}

/// Fetch the single inpatient clinical note job record identified by `id`.
#[debug_handler]
pub async fn get_one(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(load_item(&ctx, id).await?)
}

/// Build the routes for the inpatient clinical note jobs resource.
pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/inpatient_clinical_note_jobs/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
