#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::patient_medications::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub patient_id: Uuid,
    pub medication_id: Uuid,
    pub dose: String,
    pub frequency: String,
    pub route: String,
    pub indication: String,
    pub started_on: Option<Date>,
    pub prescribed_by: String,
    pub adherence: String,
    pub hold_required: bool,
    pub hold_start_before_days: Option<i32>,
    pub restart_after_days: Option<i32>,
    pub hold_plan_agreed: bool,
    pub hold_plan_agreed_by: String,
    pub hold_plan_agreed_on: Option<Date>,
    pub notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO patient_medications (deleted_at, patient_id, medication_id, dose, \
            frequency, route, indication, started_on, prescribed_by, adherence, \
            hold_required, hold_start_before_days, restart_after_days, hold_plan_agreed, \
            hold_plan_agreed_by, hold_plan_agreed_on, notes) VALUES ($1, $2, $3, $4, $5, $6, \
            $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.patient_id)
        .bind(self.medication_id)
        .bind(&self.dose)
        .bind(&self.frequency)
        .bind(&self.route)
        .bind(&self.indication)
        .bind(self.started_on)
        .bind(&self.prescribed_by)
        .bind(&self.adherence)
        .bind(self.hold_required)
        .bind(self.hold_start_before_days)
        .bind(self.restart_after_days)
        .bind(self.hold_plan_agreed)
        .bind(&self.hold_plan_agreed_by)
        .bind(self.hold_plan_agreed_on)
        .bind(&self.notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE patient_medications SET deleted_at = $2, patient_id = $3, medication_id = \
            $4, dose = $5, frequency = $6, route = $7, indication = $8, started_on = $9, \
            prescribed_by = $10, adherence = $11, hold_required = $12, hold_start_before_days \
            = $13, restart_after_days = $14, hold_plan_agreed = $15, hold_plan_agreed_by = \
            $16, hold_plan_agreed_on = $17, notes = $18, updated_at = now() WHERE id = $1 \
            RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(self.patient_id)
        .bind(self.medication_id)
        .bind(&self.dose)
        .bind(&self.frequency)
        .bind(&self.route)
        .bind(&self.indication)
        .bind(self.started_on)
        .bind(&self.prescribed_by)
        .bind(&self.adherence)
        .bind(self.hold_required)
        .bind(self.hold_start_before_days)
        .bind(self.restart_after_days)
        .bind(self.hold_plan_agreed)
        .bind(&self.hold_plan_agreed_by)
        .bind(self.hold_plan_agreed_on)
        .bind(&self.notes)
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
        .prefix("api/patient_medications/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
