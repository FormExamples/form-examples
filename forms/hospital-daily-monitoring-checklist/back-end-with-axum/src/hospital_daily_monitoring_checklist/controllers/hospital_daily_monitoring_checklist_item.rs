//! Hospital daily monitoring checklist item module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::hospital_daily_monitoring_checklist_items::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Hospital daily monitoring checklist ID.
    pub hospital_daily_monitoring_checklist_id: Uuid,
    /// Item code.
    pub item_code: String,
    /// Section number.
    pub section_number: i32,
    /// Section title.
    pub section_title: String,
    /// Item text.
    pub item_text: String,
    /// Status.
    pub status: String,
    /// Remarks.
    pub remarks: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO hospital_daily_monitoring_checklist_items \
            (hospital_daily_monitoring_checklist_id, item_code, section_number, \
            section_title, item_text, status, remarks) VALUES ($1, $2, $3, $4, $5, $6, \
            $7) RETURNING *",
        )
        .bind(self.hospital_daily_monitoring_checklist_id)
        .bind(&self.item_code)
        .bind(self.section_number)
        .bind(&self.section_title)
        .bind(&self.item_text)
        .bind(&self.status)
        .bind(&self.remarks)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE hospital_daily_monitoring_checklist_items SET \
            hospital_daily_monitoring_checklist_id = $2, item_code = $3, section_number \
            = $4, section_title = $5, item_text = $6, status = $7, remarks = $8, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.hospital_daily_monitoring_checklist_id)
        .bind(&self.item_code)
        .bind(self.section_number)
        .bind(&self.section_title)
        .bind(&self.item_text)
        .bind(&self.status)
        .bind(&self.remarks)
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
        .prefix("api/hospital_daily_monitoring_checklist_items/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
