//! Medical operation note drain controller.
#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::medical_operation_note_drains::Model;

/// Parameters accepted when creating or updating a medical operation note drain record.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Device type.
    pub device_type: String,
    /// Name.
    pub name: String,
    /// Site.
    pub site: String,
    /// Size or gauge.
    pub size_or_gauge: String,
    /// Output target.
    pub output_target: String,
    /// Removal plan.
    pub removal_plan: String,
    /// Removal by date.
    pub removal_by_date: Option<Date>,
    /// Quantity.
    pub quantity: i32,
    /// Notes.
    pub notes: String,
    /// Medical operation note ID.
    pub medical_operation_note_id: Uuid,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO medical_operation_note_drains (device_type, name, site, \
            size_or_gauge, output_target, removal_plan, removal_by_date, quantity, notes, \
            medical_operation_note_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) \
            RETURNING *",
        )
        .bind(&self.device_type)
        .bind(&self.name)
        .bind(&self.site)
        .bind(&self.size_or_gauge)
        .bind(&self.output_target)
        .bind(&self.removal_plan)
        .bind(self.removal_by_date)
        .bind(self.quantity)
        .bind(&self.notes)
        .bind(self.medical_operation_note_id)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE medical_operation_note_drains SET device_type = $2, name = $3, site = \
            $4, size_or_gauge = $5, output_target = $6, removal_plan = $7, \
            removal_by_date = $8, quantity = $9, notes = $10, medical_operation_note_id \
            = $11, updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(&self.device_type)
        .bind(&self.name)
        .bind(&self.site)
        .bind(&self.size_or_gauge)
        .bind(&self.output_target)
        .bind(&self.removal_plan)
        .bind(self.removal_by_date)
        .bind(self.quantity)
        .bind(&self.notes)
        .bind(self.medical_operation_note_id)
        .fetch_optional(db)
        .await
    }
}

async fn load_item(ctx: &AppContext, id: Uuid) -> Result<Model> {
    let item = Model::find_by_id(&db(ctx), id).await?;
    item.ok_or_else(|| Error::NotFound)
}

/// List every medical operation note drain record.
#[debug_handler]
pub async fn list(
    State(ctx): State<AppContext>,
    Query(params): Query<PageParams>,
) -> Result<Response> {
    let page = params.resolve(PAGE_LIMITS)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    Ok(page.respond(total, rows))
}

/// Create a new medical operation note drain record.
#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

/// Update the medical operation note drain record identified by `id`.
#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = params.update(&db(&ctx), id).await?.ok_or(Error::NotFound)?;
    format::json(item)
}

/// Remove the medical operation note drain record identified by `id`.
#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?;
    Model::delete(&db(&ctx), id).await?;
    format::empty()
}

/// Fetch the single medical operation note drain record identified by `id`.
#[debug_handler]
pub async fn get_one(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(load_item(&ctx, id).await?)
}

/// Build the routes for the medical operation note drains resource.
pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/medical_operation_note_drains/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
