//! Hospital daily monitoring checklist module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::hospital_daily_monitoring_checklists::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Hospital name.
    pub hospital_name: String,
    /// Department or site.
    pub department_or_site: String,
    /// Inspection date.
    pub inspection_date: Option<Date>,
    /// Inspecting officer name.
    pub inspecting_officer_name: String,
    /// Inspecting officer designation.
    pub inspecting_officer_designation: String,
    /// Overall notes.
    pub overall_notes: String,
    /// Action plan.
    pub action_plan: String,
    /// Status.
    pub status: String,
    /// Signed at.
    pub signed_at: Option<DateTimeWithTimeZone>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO hospital_daily_monitoring_checklists (hospital_name, \
            department_or_site, inspection_date, inspecting_officer_name, \
            inspecting_officer_designation, overall_notes, action_plan, status, \
            signed_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
        )
        .bind(&self.hospital_name)
        .bind(&self.department_or_site)
        .bind(self.inspection_date)
        .bind(&self.inspecting_officer_name)
        .bind(&self.inspecting_officer_designation)
        .bind(&self.overall_notes)
        .bind(&self.action_plan)
        .bind(&self.status)
        .bind(self.signed_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE hospital_daily_monitoring_checklists SET hospital_name = $2, \
            department_or_site = $3, inspection_date = $4, inspecting_officer_name = $5, \
            inspecting_officer_designation = $6, overall_notes = $7, action_plan = $8, \
            status = $9, signed_at = $10, updated_at = now() WHERE id = $1 AND \
            deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(&self.hospital_name)
        .bind(&self.department_or_site)
        .bind(self.inspection_date)
        .bind(&self.inspecting_officer_name)
        .bind(&self.inspecting_officer_designation)
        .bind(&self.overall_notes)
        .bind(&self.action_plan)
        .bind(&self.status)
        .bind(self.signed_at)
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
        .prefix("api/hospital_daily_monitoring_checklists/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
