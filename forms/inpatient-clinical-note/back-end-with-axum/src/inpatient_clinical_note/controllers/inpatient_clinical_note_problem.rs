//! Inpatient clinical note problem controller.
#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::inpatient_clinical_note_problems::Model;

/// Parameters accepted when creating or updating a inpatient clinical note problem record.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Sort order.
    pub sort_order: i32,
    /// Problem.
    pub problem: String,
    /// Category.
    pub category: String,
    /// Status.
    pub status: String,
    /// Priority.
    pub priority: String,
    /// Onset date.
    pub onset_date: Option<Date>,
    /// Snomed code.
    pub snomed_code: String,
    /// Progress commentary.
    pub progress_commentary: String,
    /// Inpatient clinical note ID.
    pub inpatient_clinical_note_id: Uuid,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO inpatient_clinical_note_problems (sort_order, problem, category, \
            status, priority, onset_date, snomed_code, progress_commentary, \
            inpatient_clinical_note_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) \
            RETURNING *",
        )
        .bind(self.sort_order)
        .bind(&self.problem)
        .bind(&self.category)
        .bind(&self.status)
        .bind(&self.priority)
        .bind(self.onset_date)
        .bind(&self.snomed_code)
        .bind(&self.progress_commentary)
        .bind(self.inpatient_clinical_note_id)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE inpatient_clinical_note_problems SET sort_order = $2, problem = $3, \
            category = $4, status = $5, priority = $6, onset_date = $7, snomed_code = \
            $8, progress_commentary = $9, inpatient_clinical_note_id = $10, updated_at = \
            now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.sort_order)
        .bind(&self.problem)
        .bind(&self.category)
        .bind(&self.status)
        .bind(&self.priority)
        .bind(self.onset_date)
        .bind(&self.snomed_code)
        .bind(&self.progress_commentary)
        .bind(self.inpatient_clinical_note_id)
        .fetch_optional(db)
        .await
    }
}

async fn load_item(ctx: &AppContext, id: Uuid) -> Result<Model> {
    let item = Model::find_by_id(&db(ctx), id).await?;
    item.ok_or_else(|| Error::NotFound)
}

/// List every inpatient clinical note problem record.
#[debug_handler]
pub async fn list(
    State(ctx): State<AppContext>,
    Query(params): Query<PageParams>,
) -> Result<Response> {
    let page = params.resolve(PAGE_LIMITS)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    Ok(page.respond(total, rows))
}

/// Create a new inpatient clinical note problem record.
#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

/// Update the inpatient clinical note problem record identified by `id`.
#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = params.update(&db(&ctx), id).await?.ok_or(Error::NotFound)?;
    format::json(item)
}

/// Remove the inpatient clinical note problem record identified by `id`.
#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?;
    Model::delete(&db(&ctx), id).await?;
    format::empty()
}

/// Fetch the single inpatient clinical note problem record identified by `id`.
#[debug_handler]
pub async fn get_one(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(load_item(&ctx, id).await?)
}

/// Build the routes for the inpatient clinical note problems resource.
pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/inpatient_clinical_note_problems/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
