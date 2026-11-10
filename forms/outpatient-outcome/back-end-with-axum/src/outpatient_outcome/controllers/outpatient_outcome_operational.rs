#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::outpatient_outcome_operationals::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub outpatient_outcome_id: Uuid,
    pub referral_date: Option<Date>,
    pub appointment_date: Option<Date>,
    pub wait_time_days: Option<i32>,
    pub service_target_days: Option<i32>,
    pub nhs_attendance_outcome: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO outpatient_outcome_operationals (outpatient_outcome_id, \
            referral_date, appointment_date, wait_time_days, service_target_days, \
            nhs_attendance_outcome) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        )
        .bind(self.outpatient_outcome_id)
        .bind(self.referral_date)
        .bind(self.appointment_date)
        .bind(self.wait_time_days)
        .bind(self.service_target_days)
        .bind(&self.nhs_attendance_outcome)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE outpatient_outcome_operationals SET outpatient_outcome_id = $2, \
            referral_date = $3, appointment_date = $4, wait_time_days = $5, \
            service_target_days = $6, nhs_attendance_outcome = $7, updated_at = now() \
            WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.outpatient_outcome_id)
        .bind(self.referral_date)
        .bind(self.appointment_date)
        .bind(self.wait_time_days)
        .bind(self.service_target_days)
        .bind(&self.nhs_attendance_outcome)
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
    OriginalUri(uri): OriginalUri,
) -> Result<Response> {
    let page = cursor_page(&ctx, &uri)?;
    let rows = Model::page(&db(&ctx), &page).await?;
    Ok(page.respond(rows))
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
        .prefix("api/outpatient_outcome_operationals/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
