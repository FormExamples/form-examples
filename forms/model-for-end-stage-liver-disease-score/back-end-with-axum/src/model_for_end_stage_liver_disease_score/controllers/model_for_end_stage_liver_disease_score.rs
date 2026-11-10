#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::model_for_end_stage_liver_disease_scores::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
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
            "INSERT INTO model_for_end_stage_liver_disease_scores (patient_id, \
            clinician_id, clinician_name, clinician_role, assessed_at, care_setting, \
            meld_variant, patient_identifier, age_band, sex, bilirubin, bilirubin_unit, \
            inr, creatinine, creatinine_unit, dialysis_sessions_past_week, cvvhd_24h, \
            sodium, albumin, clinical_note) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, \
            $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20) RETURNING *",
        )
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
            "UPDATE model_for_end_stage_liver_disease_scores SET patient_id = $2, \
            clinician_id = $3, clinician_name = $4, clinician_role = $5, assessed_at = \
            $6, care_setting = $7, meld_variant = $8, patient_identifier = $9, age_band \
            = $10, sex = $11, bilirubin = $12, bilirubin_unit = $13, inr = $14, \
            creatinine = $15, creatinine_unit = $16, dialysis_sessions_past_week = $17, \
            cvvhd_24h = $18, sodium = $19, albumin = $20, clinical_note = $21, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
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
        .prefix("api/model_for_end_stage_liver_disease_scores/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
