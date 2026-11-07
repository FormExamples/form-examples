//! Meeting grade module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::meeting_grades::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Meeting id.
    pub meeting_id: Uuid,
    /// Duration minutes.
    pub duration_minutes: Option<i32>,
    /// Agenda item count.
    pub agenda_item_count: i32,
    /// Participant count.
    pub participant_count: i32,
    /// Accepted count.
    pub accepted_count: i32,
    /// Declined count.
    pub declined_count: i32,
    /// Attended count.
    pub attended_count: i32,
    /// Action item count.
    pub action_item_count: i32,
    /// Output count.
    pub output_count: i32,
    /// Outcome count.
    pub outcome_count: i32,
    /// Completion status.
    pub completion_status: String,
    /// Overall health.
    pub overall_health: String,
    /// Override reason.
    pub override_reason: String,
    /// Notes.
    pub notes: String,
    /// Signed by.
    pub signed_by: String,
    /// Signed at.
    pub signed_at: Option<DateTimeWithTimeZone>,
    /// Graded at.
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO meeting_grades (meeting_id, duration_minutes, agenda_item_count, \
            participant_count, accepted_count, declined_count, attended_count, \
            action_item_count, output_count, outcome_count, completion_status, \
            overall_health, override_reason, notes, signed_by, signed_at, graded_at) \
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, \
            $16, $17) RETURNING *",
        )
        .bind(self.meeting_id)
        .bind(self.duration_minutes)
        .bind(self.agenda_item_count)
        .bind(self.participant_count)
        .bind(self.accepted_count)
        .bind(self.declined_count)
        .bind(self.attended_count)
        .bind(self.action_item_count)
        .bind(self.output_count)
        .bind(self.outcome_count)
        .bind(&self.completion_status)
        .bind(&self.overall_health)
        .bind(&self.override_reason)
        .bind(&self.notes)
        .bind(&self.signed_by)
        .bind(self.signed_at)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE meeting_grades SET meeting_id = $2, duration_minutes = $3, \
            agenda_item_count = $4, participant_count = $5, accepted_count = $6, \
            declined_count = $7, attended_count = $8, action_item_count = $9, \
            output_count = $10, outcome_count = $11, completion_status = $12, \
            overall_health = $13, override_reason = $14, notes = $15, signed_by = $16, \
            signed_at = $17, graded_at = $18, updated_at = now() WHERE id = $1 AND \
            deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.meeting_id)
        .bind(self.duration_minutes)
        .bind(self.agenda_item_count)
        .bind(self.participant_count)
        .bind(self.accepted_count)
        .bind(self.declined_count)
        .bind(self.attended_count)
        .bind(self.action_item_count)
        .bind(self.output_count)
        .bind(self.outcome_count)
        .bind(&self.completion_status)
        .bind(&self.overall_health)
        .bind(&self.override_reason)
        .bind(&self.notes)
        .bind(&self.signed_by)
        .bind(self.signed_at)
        .bind(self.graded_at)
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
        .prefix("api/meeting_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
