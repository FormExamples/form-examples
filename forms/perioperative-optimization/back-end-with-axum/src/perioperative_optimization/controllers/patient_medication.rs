#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::patient_medications::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
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
            "INSERT INTO patient_medications (patient_id, medication_id, dose, frequency, \
            route, indication, started_on, prescribed_by, adherence, hold_required, \
            hold_start_before_days, restart_after_days, hold_plan_agreed, \
            hold_plan_agreed_by, hold_plan_agreed_on, notes) VALUES ($1, $2, $3, $4, $5, \
            $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *",
        )
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
            "UPDATE patient_medications SET patient_id = $2, medication_id = $3, dose = \
            $4, frequency = $5, route = $6, indication = $7, started_on = $8, \
            prescribed_by = $9, adherence = $10, hold_required = $11, \
            hold_start_before_days = $12, restart_after_days = $13, hold_plan_agreed = \
            $14, hold_plan_agreed_by = $15, hold_plan_agreed_on = $16, notes = $17, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
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
        .prefix("api/patient_medications/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
