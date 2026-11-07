//! Hospital dashboard metrics module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::hospital_dashboard_metrics::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Hospital name.
    pub hospital_name: String,
    /// Period month.
    pub period_month: Option<i32>,
    /// Period year.
    pub period_year: Option<i32>,
    /// Prepared by name.
    pub prepared_by_name: String,
    /// Overall notes.
    pub overall_notes: String,
    /// Status.
    pub status: String,
    /// Signed at.
    pub signed_at: Option<DateTimeWithTimeZone>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO hospital_dashboard_metrics (hospital_name, period_month, \
            period_year, prepared_by_name, overall_notes, status, signed_at) VALUES ($1, \
            $2, $3, $4, $5, $6, $7) RETURNING *",
        )
        .bind(&self.hospital_name)
        .bind(self.period_month)
        .bind(self.period_year)
        .bind(&self.prepared_by_name)
        .bind(&self.overall_notes)
        .bind(&self.status)
        .bind(self.signed_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE hospital_dashboard_metrics SET hospital_name = $2, period_month = $3, \
            period_year = $4, prepared_by_name = $5, overall_notes = $6, status = $7, \
            signed_at = $8, updated_at = now() WHERE id = $1 AND deleted_at IS NULL \
            RETURNING *",
        )
        .bind(id)
        .bind(&self.hospital_name)
        .bind(self.period_month)
        .bind(self.period_year)
        .bind(&self.prepared_by_name)
        .bind(&self.overall_notes)
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
        .prefix("api/hospital_dashboard_metrics/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
