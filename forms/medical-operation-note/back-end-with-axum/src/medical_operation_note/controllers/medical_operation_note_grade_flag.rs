//! Medical operation note grade flag controller.
#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::medical_operation_note_grade_flags::Model;

/// Parameters accepted when creating or updating a medical operation note grade flag record.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Flag ID.
    pub flag_id: String,
    /// Category.
    pub category: String,
    /// Priority.
    pub priority: String,
    /// Description.
    pub description: String,
    /// Suggested action.
    pub suggested_action: String,
    /// Medical operation note grade ID.
    pub medical_operation_note_grade_id: Uuid,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO medical_operation_note_grade_flags (flag_id, category, priority, \
            description, suggested_action, medical_operation_note_grade_id) VALUES ($1, $2, \
            $3, $4, $5, $6) RETURNING *",
        )
        .bind(&self.flag_id)
        .bind(&self.category)
        .bind(&self.priority)
        .bind(&self.description)
        .bind(&self.suggested_action)
        .bind(self.medical_operation_note_grade_id)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE medical_operation_note_grade_flags SET flag_id = $2, category = $3, \
            priority = $4, description = $5, suggested_action = $6, \
            medical_operation_note_grade_id = $7, updated_at = now() WHERE id = $1 RETURNING \
            *",
        )
        .bind(id)
        .bind(&self.flag_id)
        .bind(&self.category)
        .bind(&self.priority)
        .bind(&self.description)
        .bind(&self.suggested_action)
        .bind(self.medical_operation_note_grade_id)
        .fetch_optional(db)
        .await
    }
}

async fn load_item(ctx: &AppContext, id: Uuid) -> Result<Model> {
    let item = Model::find_by_id(&db(ctx), id).await?;
    item.ok_or_else(|| Error::NotFound)
}

/// List every medical operation note grade flag record.
#[debug_handler]
pub async fn list(
    State(ctx): State<AppContext>,
    Query(params): Query<PageParams>,
) -> Result<Response> {
    let page = paging::resolve(&params)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    paging::respond(page, total, rows)
}

/// Create a new medical operation note grade flag record.
#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

/// Update the medical operation note grade flag record identified by `id`.
#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = params.update(&db(&ctx), id).await?.ok_or(Error::NotFound)?;
    format::json(item)
}

/// Remove the medical operation note grade flag record identified by `id`.
#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?;
    Model::delete(&db(&ctx), id).await?;
    format::empty()
}

/// Fetch the single medical operation note grade flag record identified by `id`.
#[debug_handler]
pub async fn get_one(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(load_item(&ctx, id).await?)
}

/// Build the routes for the medical operation note grade flags resource.
pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/medical_operation_note_grade_flags/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
