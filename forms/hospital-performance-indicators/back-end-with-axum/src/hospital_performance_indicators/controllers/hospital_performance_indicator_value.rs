//! Hospital performance indicator value module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::hospital_performance_indicator_values::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Deleted at.
    pub deleted_at: Option<DateTimeWithTimeZone>,
    /// Hospital performance indicators ID.
    pub hospital_performance_indicators_id: Uuid,
    /// Indicator code.
    pub indicator_code: String,
    /// Category number.
    pub category_number: i32,
    /// Category title.
    pub category_title: String,
    /// Indicator text.
    pub indicator_text: String,
    /// Indicator value.
    pub indicator_value: Option<f64>,
    /// Notes.
    pub notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO hospital_performance_indicator_values (deleted_at, \
            hospital_performance_indicators_id, indicator_code, category_number, \
            category_title, indicator_text, indicator_value, notes) VALUES ($1, $2, $3, $4, \
            $5, $6, $7, $8) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.hospital_performance_indicators_id)
        .bind(&self.indicator_code)
        .bind(self.category_number)
        .bind(&self.category_title)
        .bind(&self.indicator_text)
        .bind(self.indicator_value)
        .bind(&self.notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE hospital_performance_indicator_values SET deleted_at = $2, \
            hospital_performance_indicators_id = $3, indicator_code = $4, category_number = \
            $5, category_title = $6, indicator_text = $7, indicator_value = $8, notes = $9, \
            updated_at = now() WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(self.hospital_performance_indicators_id)
        .bind(&self.indicator_code)
        .bind(self.category_number)
        .bind(&self.category_title)
        .bind(&self.indicator_text)
        .bind(self.indicator_value)
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
        .prefix("api/hospital_performance_indicator_values/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
