#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::zarit_burden_interviews::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub practitioner_name: String,
    pub practitioner_role: String,
    pub assessed_at: Option<DateTimeWithTimeZone>,
    pub care_setting: String,
    pub instrument_form: String,
    pub carer_identifier: String,
    pub carer_relationship: String,
    pub carer_co_resident: String,
    pub care_hours_per_week: Option<f64>,
    pub recipient_identifier: String,
    pub recipient_condition: String,
    pub item_1: Option<i32>,
    pub item_2: Option<i32>,
    pub item_3: Option<i32>,
    pub item_4: Option<i32>,
    pub item_5: Option<i32>,
    pub item_6: Option<i32>,
    pub item_7: Option<i32>,
    pub item_8: Option<i32>,
    pub item_9: Option<i32>,
    pub item_10: Option<i32>,
    pub item_11: Option<i32>,
    pub item_12: Option<i32>,
    pub item_13: Option<i32>,
    pub item_14: Option<i32>,
    pub item_15: Option<i32>,
    pub item_16: Option<i32>,
    pub item_17: Option<i32>,
    pub item_18: Option<i32>,
    pub item_19: Option<i32>,
    pub item_20: Option<i32>,
    pub item_21: Option<i32>,
    pub item_22: Option<i32>,
    pub clinical_note: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO zarit_burden_interviews (patient_id, clinician_id, practitioner_name, \
            practitioner_role, assessed_at, care_setting, instrument_form, carer_identifier, \
            carer_relationship, carer_co_resident, care_hours_per_week, recipient_identifier, \
            recipient_condition, item_1, item_2, item_3, item_4, item_5, item_6, item_7, \
            item_8, item_9, item_10, item_11, item_12, item_13, item_14, item_15, item_16, \
            item_17, item_18, item_19, item_20, item_21, item_22, clinical_note) VALUES ($1, \
            $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, \
            $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, \
            $36) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.practitioner_name)
        .bind(&self.practitioner_role)
        .bind(self.assessed_at)
        .bind(&self.care_setting)
        .bind(&self.instrument_form)
        .bind(&self.carer_identifier)
        .bind(&self.carer_relationship)
        .bind(&self.carer_co_resident)
        .bind(self.care_hours_per_week)
        .bind(&self.recipient_identifier)
        .bind(&self.recipient_condition)
        .bind(self.item_1)
        .bind(self.item_2)
        .bind(self.item_3)
        .bind(self.item_4)
        .bind(self.item_5)
        .bind(self.item_6)
        .bind(self.item_7)
        .bind(self.item_8)
        .bind(self.item_9)
        .bind(self.item_10)
        .bind(self.item_11)
        .bind(self.item_12)
        .bind(self.item_13)
        .bind(self.item_14)
        .bind(self.item_15)
        .bind(self.item_16)
        .bind(self.item_17)
        .bind(self.item_18)
        .bind(self.item_19)
        .bind(self.item_20)
        .bind(self.item_21)
        .bind(self.item_22)
        .bind(&self.clinical_note)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE zarit_burden_interviews SET patient_id = $2, clinician_id = $3, \
            practitioner_name = $4, practitioner_role = $5, assessed_at = $6, care_setting = \
            $7, instrument_form = $8, carer_identifier = $9, carer_relationship = $10, \
            carer_co_resident = $11, care_hours_per_week = $12, recipient_identifier = $13, \
            recipient_condition = $14, item_1 = $15, item_2 = $16, item_3 = $17, item_4 = \
            $18, item_5 = $19, item_6 = $20, item_7 = $21, item_8 = $22, item_9 = $23, \
            item_10 = $24, item_11 = $25, item_12 = $26, item_13 = $27, item_14 = $28, \
            item_15 = $29, item_16 = $30, item_17 = $31, item_18 = $32, item_19 = $33, \
            item_20 = $34, item_21 = $35, item_22 = $36, clinical_note = $37, updated_at = \
            now() WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.practitioner_name)
        .bind(&self.practitioner_role)
        .bind(self.assessed_at)
        .bind(&self.care_setting)
        .bind(&self.instrument_form)
        .bind(&self.carer_identifier)
        .bind(&self.carer_relationship)
        .bind(&self.carer_co_resident)
        .bind(self.care_hours_per_week)
        .bind(&self.recipient_identifier)
        .bind(&self.recipient_condition)
        .bind(self.item_1)
        .bind(self.item_2)
        .bind(self.item_3)
        .bind(self.item_4)
        .bind(self.item_5)
        .bind(self.item_6)
        .bind(self.item_7)
        .bind(self.item_8)
        .bind(self.item_9)
        .bind(self.item_10)
        .bind(self.item_11)
        .bind(self.item_12)
        .bind(self.item_13)
        .bind(self.item_14)
        .bind(self.item_15)
        .bind(self.item_16)
        .bind(self.item_17)
        .bind(self.item_18)
        .bind(self.item_19)
        .bind(self.item_20)
        .bind(self.item_21)
        .bind(self.item_22)
        .bind(&self.clinical_note)
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
        .prefix("api/zarit_burden_interviews/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
