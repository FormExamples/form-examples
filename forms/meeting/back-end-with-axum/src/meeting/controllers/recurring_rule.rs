#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::recurring_rules::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub meeting_id: Uuid,
    pub frequency: String,
    pub interval_count: i32,
    pub by_day_of_week: String,
    pub by_day_of_month: Option<i32>,
    pub by_set_position: Option<i32>,
    pub by_month_of_year: Option<i32>,
    pub series_count: Option<i32>,
    pub series_until: Option<DateTimeWithTimeZone>,
    pub timezone: String,
    pub rrule_text: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO recurring_rules (deleted_at, meeting_id, frequency, interval_count, \
            by_day_of_week, by_day_of_month, by_set_position, by_month_of_year, series_count, \
            series_until, timezone, rrule_text) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, \
            $10, $11, $12) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.meeting_id)
        .bind(&self.frequency)
        .bind(self.interval_count)
        .bind(&self.by_day_of_week)
        .bind(self.by_day_of_month)
        .bind(self.by_set_position)
        .bind(self.by_month_of_year)
        .bind(self.series_count)
        .bind(self.series_until)
        .bind(&self.timezone)
        .bind(&self.rrule_text)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE recurring_rules SET deleted_at = $2, meeting_id = $3, frequency = $4, \
            interval_count = $5, by_day_of_week = $6, by_day_of_month = $7, by_set_position = \
            $8, by_month_of_year = $9, series_count = $10, series_until = $11, timezone = \
            $12, rrule_text = $13, updated_at = now() WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(self.meeting_id)
        .bind(&self.frequency)
        .bind(self.interval_count)
        .bind(&self.by_day_of_week)
        .bind(self.by_day_of_month)
        .bind(self.by_set_position)
        .bind(self.by_month_of_year)
        .bind(self.series_count)
        .bind(self.series_until)
        .bind(&self.timezone)
        .bind(&self.rrule_text)
        .fetch_optional(db)
        .await
    }
}

async fn load_item(ctx: &AppContext, id: Uuid) -> Result<Model> {
    let item = Model::find_by_id(&db(ctx), id).await?;
    item.ok_or_else(|| Error::NotFound)
}

#[debug_handler]
pub async fn list(
    State(ctx): State<AppContext>,
    Query(params): Query<PageParams>,
) -> Result<Response> {
    let page = paging::resolve(&params)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    paging::respond(page, total, rows)
}

#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = params.update(&db(&ctx), id).await?.ok_or(Error::NotFound)?;
    format::json(item)
}

#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?;
    Model::delete(&db(&ctx), id).await?;
    format::empty()
}

#[debug_handler]
pub async fn get_one(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(load_item(&ctx, id).await?)
}

pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/recurring_rules/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
