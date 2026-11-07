#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::neurology_waiting_list_card_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub neurology_waiting_list_card_id: Uuid,
    pub waiting_time_status: String,
    pub clinical_priority: String,
    pub target_wait_weeks: Option<f64>,
    pub days_waited: Option<i32>,
    pub weeks_waited: Option<f64>,
    pub days_to_target: Option<i32>,
    pub days_to_breach: Option<i32>,
    pub days_to_appointment: Option<i32>,
    pub grader_notes: String,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO neurology_waiting_list_card_grades \
            (neurology_waiting_list_card_id, waiting_time_status, clinical_priority, \
            target_wait_weeks, days_waited, weeks_waited, days_to_target, \
            days_to_breach, days_to_appointment, grader_notes, graded_at) VALUES ($1, \
            $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
        )
        .bind(self.neurology_waiting_list_card_id)
        .bind(&self.waiting_time_status)
        .bind(&self.clinical_priority)
        .bind(self.target_wait_weeks)
        .bind(self.days_waited)
        .bind(self.weeks_waited)
        .bind(self.days_to_target)
        .bind(self.days_to_breach)
        .bind(self.days_to_appointment)
        .bind(&self.grader_notes)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE neurology_waiting_list_card_grades SET neurology_waiting_list_card_id \
            = $2, waiting_time_status = $3, clinical_priority = $4, target_wait_weeks = \
            $5, days_waited = $6, weeks_waited = $7, days_to_target = $8, days_to_breach \
            = $9, days_to_appointment = $10, grader_notes = $11, graded_at = $12, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.neurology_waiting_list_card_id)
        .bind(&self.waiting_time_status)
        .bind(&self.clinical_priority)
        .bind(self.target_wait_weeks)
        .bind(self.days_waited)
        .bind(self.weeks_waited)
        .bind(self.days_to_target)
        .bind(self.days_to_breach)
        .bind(self.days_to_appointment)
        .bind(&self.grader_notes)
        .bind(self.graded_at)
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
        .prefix("api/neurology_waiting_list_card_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
