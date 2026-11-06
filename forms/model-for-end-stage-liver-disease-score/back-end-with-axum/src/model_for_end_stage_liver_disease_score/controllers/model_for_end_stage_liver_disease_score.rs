#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::model_for_end_stage_liver_disease_scores::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub clinician_name: String,
    pub clinician_role: String,
    pub assessed_at: Option<DateTimeWithTimeZone>,
    pub care_setting: String,
    pub meld_variant: String,
    pub patient_identifier: String,
    pub age_band: String,
    pub sex: String,
    pub bilirubin: Option<f64>,
    pub bilirubin_unit: String,
    pub inr: Option<f64>,
    pub creatinine: Option<f64>,
    pub creatinine_unit: String,
    pub dialysis_sessions_past_week: Option<i32>,
    pub cvvhd_24h: String,
    pub sodium: Option<f64>,
    pub albumin: Option<f64>,
    pub clinical_note: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO model_for_end_stage_liver_disease_scores (deleted_at, patient_id, \
            clinician_id, clinician_name, clinician_role, assessed_at, care_setting, \
            meld_variant, patient_identifier, age_band, sex, bilirubin, bilirubin_unit, inr, \
            creatinine, creatinine_unit, dialysis_sessions_past_week, cvvhd_24h, sodium, \
            albumin, clinical_note) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, \
            $12, $13, $14, $15, $16, $17, $18, $19, $20, $21) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(self.assessed_at)
        .bind(&self.care_setting)
        .bind(&self.meld_variant)
        .bind(&self.patient_identifier)
        .bind(&self.age_band)
        .bind(&self.sex)
        .bind(self.bilirubin)
        .bind(&self.bilirubin_unit)
        .bind(self.inr)
        .bind(self.creatinine)
        .bind(&self.creatinine_unit)
        .bind(self.dialysis_sessions_past_week)
        .bind(&self.cvvhd_24h)
        .bind(self.sodium)
        .bind(self.albumin)
        .bind(&self.clinical_note)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE model_for_end_stage_liver_disease_scores SET deleted_at = $2, patient_id = \
            $3, clinician_id = $4, clinician_name = $5, clinician_role = $6, assessed_at = \
            $7, care_setting = $8, meld_variant = $9, patient_identifier = $10, age_band = \
            $11, sex = $12, bilirubin = $13, bilirubin_unit = $14, inr = $15, creatinine = \
            $16, creatinine_unit = $17, dialysis_sessions_past_week = $18, cvvhd_24h = $19, \
            sodium = $20, albumin = $21, clinical_note = $22, updated_at = now() WHERE id = \
            $1 RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(self.assessed_at)
        .bind(&self.care_setting)
        .bind(&self.meld_variant)
        .bind(&self.patient_identifier)
        .bind(&self.age_band)
        .bind(&self.sex)
        .bind(self.bilirubin)
        .bind(&self.bilirubin_unit)
        .bind(self.inr)
        .bind(self.creatinine)
        .bind(&self.creatinine_unit)
        .bind(self.dialysis_sessions_past_week)
        .bind(&self.cvvhd_24h)
        .bind(self.sodium)
        .bind(self.albumin)
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
        .prefix("api/model_for_end_stage_liver_disease_scores/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
