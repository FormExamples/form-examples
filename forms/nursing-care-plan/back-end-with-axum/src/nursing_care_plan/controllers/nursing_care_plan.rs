#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::nursing_care_plans::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub nurse_name: String,
    pub nurse_role: String,
    pub nmc_number: String,
    pub authored_at: Option<DateTimeWithTimeZone>,
    pub care_setting: String,
    pub plan_type: String,
    pub model_used: String,
    pub patient_identifier: String,
    pub patient_name: String,
    pub date_of_birth: Option<Date>,
    pub sex: String,
    pub ward_location: String,
    pub handover_note: String,
    pub review_date: Option<Date>,
    pub falls_risk_done: String,
    pub falls_risk_level: String,
    pub falls_risk_assessed_on: Option<Date>,
    pub falls_risk_actioned: String,
    pub pressure_ulcer_risk_done: String,
    pub pressure_ulcer_risk_level: String,
    pub pressure_ulcer_risk_assessed_on: Option<Date>,
    pub pressure_ulcer_risk_actioned: String,
    pub vte_risk_done: String,
    pub vte_risk_level: String,
    pub vte_risk_assessed_on: Option<Date>,
    pub vte_risk_actioned: String,
    pub nutrition_risk_done: String,
    pub nutrition_risk_level: String,
    pub nutrition_risk_assessed_on: Option<Date>,
    pub nutrition_risk_actioned: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO nursing_care_plans (patient_id, clinician_id, nurse_name, \
            nurse_role, nmc_number, authored_at, care_setting, plan_type, model_used, \
            patient_identifier, patient_name, date_of_birth, sex, ward_location, \
            handover_note, review_date, falls_risk_done, falls_risk_level, \
            falls_risk_assessed_on, falls_risk_actioned, pressure_ulcer_risk_done, \
            pressure_ulcer_risk_level, pressure_ulcer_risk_assessed_on, \
            pressure_ulcer_risk_actioned, vte_risk_done, vte_risk_level, \
            vte_risk_assessed_on, vte_risk_actioned, nutrition_risk_done, \
            nutrition_risk_level, nutrition_risk_assessed_on, nutrition_risk_actioned) \
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, \
            $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, \
            $31, $32) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.nurse_name)
        .bind(&self.nurse_role)
        .bind(&self.nmc_number)
        .bind(self.authored_at)
        .bind(&self.care_setting)
        .bind(&self.plan_type)
        .bind(&self.model_used)
        .bind(&self.patient_identifier)
        .bind(&self.patient_name)
        .bind(self.date_of_birth)
        .bind(&self.sex)
        .bind(&self.ward_location)
        .bind(&self.handover_note)
        .bind(self.review_date)
        .bind(&self.falls_risk_done)
        .bind(&self.falls_risk_level)
        .bind(self.falls_risk_assessed_on)
        .bind(&self.falls_risk_actioned)
        .bind(&self.pressure_ulcer_risk_done)
        .bind(&self.pressure_ulcer_risk_level)
        .bind(self.pressure_ulcer_risk_assessed_on)
        .bind(&self.pressure_ulcer_risk_actioned)
        .bind(&self.vte_risk_done)
        .bind(&self.vte_risk_level)
        .bind(self.vte_risk_assessed_on)
        .bind(&self.vte_risk_actioned)
        .bind(&self.nutrition_risk_done)
        .bind(&self.nutrition_risk_level)
        .bind(self.nutrition_risk_assessed_on)
        .bind(&self.nutrition_risk_actioned)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE nursing_care_plans SET patient_id = $2, clinician_id = $3, nurse_name \
            = $4, nurse_role = $5, nmc_number = $6, authored_at = $7, care_setting = $8, \
            plan_type = $9, model_used = $10, patient_identifier = $11, patient_name = \
            $12, date_of_birth = $13, sex = $14, ward_location = $15, handover_note = \
            $16, review_date = $17, falls_risk_done = $18, falls_risk_level = $19, \
            falls_risk_assessed_on = $20, falls_risk_actioned = $21, \
            pressure_ulcer_risk_done = $22, pressure_ulcer_risk_level = $23, \
            pressure_ulcer_risk_assessed_on = $24, pressure_ulcer_risk_actioned = $25, \
            vte_risk_done = $26, vte_risk_level = $27, vte_risk_assessed_on = $28, \
            vte_risk_actioned = $29, nutrition_risk_done = $30, nutrition_risk_level = \
            $31, nutrition_risk_assessed_on = $32, nutrition_risk_actioned = $33, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.nurse_name)
        .bind(&self.nurse_role)
        .bind(&self.nmc_number)
        .bind(self.authored_at)
        .bind(&self.care_setting)
        .bind(&self.plan_type)
        .bind(&self.model_used)
        .bind(&self.patient_identifier)
        .bind(&self.patient_name)
        .bind(self.date_of_birth)
        .bind(&self.sex)
        .bind(&self.ward_location)
        .bind(&self.handover_note)
        .bind(self.review_date)
        .bind(&self.falls_risk_done)
        .bind(&self.falls_risk_level)
        .bind(self.falls_risk_assessed_on)
        .bind(&self.falls_risk_actioned)
        .bind(&self.pressure_ulcer_risk_done)
        .bind(&self.pressure_ulcer_risk_level)
        .bind(self.pressure_ulcer_risk_assessed_on)
        .bind(&self.pressure_ulcer_risk_actioned)
        .bind(&self.vte_risk_done)
        .bind(&self.vte_risk_level)
        .bind(self.vte_risk_assessed_on)
        .bind(&self.vte_risk_actioned)
        .bind(&self.nutrition_risk_done)
        .bind(&self.nutrition_risk_level)
        .bind(self.nutrition_risk_assessed_on)
        .bind(&self.nutrition_risk_actioned)
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
        .prefix("api/nursing_care_plans/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
