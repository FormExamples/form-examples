#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::meetings::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub organizer_id: Uuid,
    pub status: String,
    pub title: String,
    pub purpose: String,
    pub long_description: String,
    pub category: String,
    pub visibility: String,
    pub scheduled_start_at: Option<DateTimeWithTimeZone>,
    pub scheduled_end_at: Option<DateTimeWithTimeZone>,
    pub timezone: String,
    pub location: String,
    pub video_url: String,
    pub phone_number: String,
    pub dial_in_code: String,
    pub joining_instructions: String,
    pub calendar_uid: String,
    pub summary: String,
    pub actual_start_at: Option<DateTimeWithTimeZone>,
    pub actual_end_at: Option<DateTimeWithTimeZone>,
    pub overall_result: String,
    pub additional_notes: String,
    pub signed_by_name: String,
    pub signed_at: Option<DateTimeWithTimeZone>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO meetings (organizer_id, status, title, purpose, \
            long_description, category, visibility, scheduled_start_at, \
            scheduled_end_at, timezone, location, video_url, phone_number, dial_in_code, \
            joining_instructions, calendar_uid, summary, actual_start_at, actual_end_at, \
            overall_result, additional_notes, signed_by_name, signed_at) VALUES ($1, $2, \
            $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, \
            $19, $20, $21, $22, $23) RETURNING *",
        )
        .bind(self.organizer_id)
        .bind(&self.status)
        .bind(&self.title)
        .bind(&self.purpose)
        .bind(&self.long_description)
        .bind(&self.category)
        .bind(&self.visibility)
        .bind(self.scheduled_start_at)
        .bind(self.scheduled_end_at)
        .bind(&self.timezone)
        .bind(&self.location)
        .bind(&self.video_url)
        .bind(&self.phone_number)
        .bind(&self.dial_in_code)
        .bind(&self.joining_instructions)
        .bind(&self.calendar_uid)
        .bind(&self.summary)
        .bind(self.actual_start_at)
        .bind(self.actual_end_at)
        .bind(&self.overall_result)
        .bind(&self.additional_notes)
        .bind(&self.signed_by_name)
        .bind(self.signed_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE meetings SET organizer_id = $2, status = $3, title = $4, purpose = \
            $5, long_description = $6, category = $7, visibility = $8, \
            scheduled_start_at = $9, scheduled_end_at = $10, timezone = $11, location = \
            $12, video_url = $13, phone_number = $14, dial_in_code = $15, \
            joining_instructions = $16, calendar_uid = $17, summary = $18, \
            actual_start_at = $19, actual_end_at = $20, overall_result = $21, \
            additional_notes = $22, signed_by_name = $23, signed_at = $24, updated_at = \
            now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.organizer_id)
        .bind(&self.status)
        .bind(&self.title)
        .bind(&self.purpose)
        .bind(&self.long_description)
        .bind(&self.category)
        .bind(&self.visibility)
        .bind(self.scheduled_start_at)
        .bind(self.scheduled_end_at)
        .bind(&self.timezone)
        .bind(&self.location)
        .bind(&self.video_url)
        .bind(&self.phone_number)
        .bind(&self.dial_in_code)
        .bind(&self.joining_instructions)
        .bind(&self.calendar_uid)
        .bind(&self.summary)
        .bind(self.actual_start_at)
        .bind(self.actual_end_at)
        .bind(&self.overall_result)
        .bind(&self.additional_notes)
        .bind(&self.signed_by_name)
        .bind(self.signed_at)
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
        .prefix("api/meetings/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
