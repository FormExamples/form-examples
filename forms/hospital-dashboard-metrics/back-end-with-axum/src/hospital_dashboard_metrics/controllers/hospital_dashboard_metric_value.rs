//! Hospital dashboard metric value module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::hospital_dashboard_metric_values::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Hospital dashboard metrics ID.
    pub hospital_dashboard_metrics_id: Uuid,
    /// Metric code.
    pub metric_code: String,
    /// Category number.
    pub category_number: i32,
    /// Category title.
    pub category_title: String,
    /// Metric text.
    pub metric_text: String,
    /// Metric value.
    pub metric_value: Option<f64>,
    /// Notes.
    pub notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO hospital_dashboard_metric_values (hospital_dashboard_metrics_id, \
            metric_code, category_number, category_title, metric_text, metric_value, \
            notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        )
        .bind(self.hospital_dashboard_metrics_id)
        .bind(&self.metric_code)
        .bind(self.category_number)
        .bind(&self.category_title)
        .bind(&self.metric_text)
        .bind(self.metric_value)
        .bind(&self.notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE hospital_dashboard_metric_values SET hospital_dashboard_metrics_id = \
            $2, metric_code = $3, category_number = $4, category_title = $5, metric_text \
            = $6, metric_value = $7, notes = $8, updated_at = now() WHERE id = $1 AND \
            deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.hospital_dashboard_metrics_id)
        .bind(&self.metric_code)
        .bind(self.category_number)
        .bind(&self.category_title)
        .bind(&self.metric_text)
        .bind(self.metric_value)
        .bind(&self.notes)
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
    let page = params.resolve(PAGE_LIMITS)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    Ok(page.respond(total, rows))
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
        .prefix("api/hospital_dashboard_metric_values/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
