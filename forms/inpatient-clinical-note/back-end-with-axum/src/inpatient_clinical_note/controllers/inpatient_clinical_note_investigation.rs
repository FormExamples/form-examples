//! Inpatient clinical note investigation controller.
#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::inpatient_clinical_note_investigations::Model;

/// Parameters accepted when creating or updating a inpatient clinical note investigation record.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Deleted at.
    pub deleted_at: Option<DateTimeWithTimeZone>,
    /// Sort order.
    pub sort_order: i32,
    /// Test name.
    pub test_name: String,
    /// Category.
    pub category: String,
    /// Requested date.
    pub requested_date: Option<Date>,
    /// Result date.
    pub result_date: Option<Date>,
    /// Result summary.
    pub result_summary: String,
    /// Abnormal.
    pub abnormal: String,
    /// Actioned.
    pub actioned: String,
    /// Action taken.
    pub action_taken: String,
    /// Inpatient clinical note ID.
    pub inpatient_clinical_note_id: Uuid,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO inpatient_clinical_note_investigations (deleted_at, sort_order, \
            test_name, category, requested_date, result_date, result_summary, abnormal, \
            actioned, action_taken, inpatient_clinical_note_id) VALUES ($1, $2, $3, $4, $5, \
            $6, $7, $8, $9, $10, $11) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.sort_order)
        .bind(&self.test_name)
        .bind(&self.category)
        .bind(self.requested_date)
        .bind(self.result_date)
        .bind(&self.result_summary)
        .bind(&self.abnormal)
        .bind(&self.actioned)
        .bind(&self.action_taken)
        .bind(self.inpatient_clinical_note_id)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE inpatient_clinical_note_investigations SET deleted_at = $2, sort_order = \
            $3, test_name = $4, category = $5, requested_date = $6, result_date = $7, \
            result_summary = $8, abnormal = $9, actioned = $10, action_taken = $11, \
            inpatient_clinical_note_id = $12, updated_at = now() WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(self.sort_order)
        .bind(&self.test_name)
        .bind(&self.category)
        .bind(self.requested_date)
        .bind(self.result_date)
        .bind(&self.result_summary)
        .bind(&self.abnormal)
        .bind(&self.actioned)
        .bind(&self.action_taken)
        .bind(self.inpatient_clinical_note_id)
        .fetch_optional(db)
        .await
    }
}

async fn load_item(ctx: &AppContext, id: Uuid) -> Result<Model> {
    let item = Model::find_by_id(&db(ctx), id).await?;
    item.ok_or_else(|| Error::NotFound)
}

/// List every inpatient clinical note investigation record.
#[debug_handler]
pub async fn list(
    State(ctx): State<AppContext>,
    Query(params): Query<PageParams>,
) -> Result<Response> {
    let page = paging::resolve(&params)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    paging::respond(page, total, rows)
}

/// Create a new inpatient clinical note investigation record.
#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

/// Update the inpatient clinical note investigation record identified by `id`.
#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = params.update(&db(&ctx), id).await?.ok_or(Error::NotFound)?;
    format::json(item)
}

/// Remove the inpatient clinical note investigation record identified by `id`.
#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?;
    Model::delete(&db(&ctx), id).await?;
    format::empty()
}

/// Fetch the single inpatient clinical note investigation record identified by `id`.
#[debug_handler]
pub async fn get_one(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(load_item(&ctx, id).await?)
}

/// Build the routes for the inpatient clinical note investigations resource.
pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/inpatient_clinical_note_investigations/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
