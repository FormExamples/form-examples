#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::edinburgh_postnatal_depression_scales::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub clinician_name: String,
    pub clinician_role: String,
    pub care_setting: String,
    pub assessed_at: Option<DateTimeWithTimeZone>,
    pub perinatal_stage: String,
    pub perinatal_week: Option<f64>,
    pub respondent_identifier: String,
    pub age_band: String,
    pub preferred_language: String,
    pub assistance_needed: String,
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
    pub clinical_note: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO edinburgh_postnatal_depression_scales (patient_id, clinician_id, \
            clinician_name, clinician_role, care_setting, assessed_at, perinatal_stage, \
            perinatal_week, respondent_identifier, age_band, preferred_language, \
            assistance_needed, item_1, item_2, item_3, item_4, item_5, item_6, item_7, \
            item_8, item_9, item_10, clinical_note) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, \
            $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23) \
            RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(&self.care_setting)
        .bind(self.assessed_at)
        .bind(&self.perinatal_stage)
        .bind(self.perinatal_week)
        .bind(&self.respondent_identifier)
        .bind(&self.age_band)
        .bind(&self.preferred_language)
        .bind(&self.assistance_needed)
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
        .bind(&self.clinical_note)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE edinburgh_postnatal_depression_scales SET patient_id = $2, \
            clinician_id = $3, clinician_name = $4, clinician_role = $5, care_setting = \
            $6, assessed_at = $7, perinatal_stage = $8, perinatal_week = $9, \
            respondent_identifier = $10, age_band = $11, preferred_language = $12, \
            assistance_needed = $13, item_1 = $14, item_2 = $15, item_3 = $16, item_4 = \
            $17, item_5 = $18, item_6 = $19, item_7 = $20, item_8 = $21, item_9 = $22, \
            item_10 = $23, clinical_note = $24, updated_at = now() WHERE id = $1 AND \
            deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(&self.care_setting)
        .bind(self.assessed_at)
        .bind(&self.perinatal_stage)
        .bind(self.perinatal_week)
        .bind(&self.respondent_identifier)
        .bind(&self.age_band)
        .bind(&self.preferred_language)
        .bind(&self.assistance_needed)
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
        .prefix("api/edinburgh_postnatal_depression_scales/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
