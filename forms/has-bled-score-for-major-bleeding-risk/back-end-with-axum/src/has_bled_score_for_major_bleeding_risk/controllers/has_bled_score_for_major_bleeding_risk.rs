#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::has_bled_score_for_major_bleeding_risks::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub clinician_name: String,
    pub clinician_role: String,
    pub assessed_at: Option<DateTimeWithTimeZone>,
    pub care_setting: String,
    pub anticoagulation_status: String,
    pub cha_ds_vasc_score: Option<i32>,
    pub patient_identifier: String,
    pub age_years: Option<i32>,
    pub sex: String,
    pub hypertension_uncontrolled: String,
    pub abnormal_renal_function: String,
    pub abnormal_liver_function: String,
    pub stroke_history: String,
    pub bleeding_history: String,
    pub labile_inr: String,
    pub antiplatelet_or_nsaid: String,
    pub alcohol_units_per_week: Option<f64>,
    pub clinical_note: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO has_bled_score_for_major_bleeding_risks (patient_id, clinician_id, \
            clinician_name, clinician_role, assessed_at, care_setting, \
            anticoagulation_status, cha_ds_vasc_score, patient_identifier, age_years, sex, \
            hypertension_uncontrolled, abnormal_renal_function, abnormal_liver_function, \
            stroke_history, bleeding_history, labile_inr, antiplatelet_or_nsaid, \
            alcohol_units_per_week, clinical_note) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, \
            $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(self.assessed_at)
        .bind(&self.care_setting)
        .bind(&self.anticoagulation_status)
        .bind(self.cha_ds_vasc_score)
        .bind(&self.patient_identifier)
        .bind(self.age_years)
        .bind(&self.sex)
        .bind(&self.hypertension_uncontrolled)
        .bind(&self.abnormal_renal_function)
        .bind(&self.abnormal_liver_function)
        .bind(&self.stroke_history)
        .bind(&self.bleeding_history)
        .bind(&self.labile_inr)
        .bind(&self.antiplatelet_or_nsaid)
        .bind(self.alcohol_units_per_week)
        .bind(&self.clinical_note)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE has_bled_score_for_major_bleeding_risks SET patient_id = $2, \
            clinician_id = $3, clinician_name = $4, clinician_role = $5, assessed_at = \
            $6, care_setting = $7, anticoagulation_status = $8, cha_ds_vasc_score = $9, \
            patient_identifier = $10, age_years = $11, sex = $12, \
            hypertension_uncontrolled = $13, abnormal_renal_function = $14, \
            abnormal_liver_function = $15, stroke_history = $16, bleeding_history = $17, \
            labile_inr = $18, antiplatelet_or_nsaid = $19, alcohol_units_per_week = $20, \
            clinical_note = $21, updated_at = now() WHERE id = $1 AND deleted_at IS NULL \
            RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(self.assessed_at)
        .bind(&self.care_setting)
        .bind(&self.anticoagulation_status)
        .bind(self.cha_ds_vasc_score)
        .bind(&self.patient_identifier)
        .bind(self.age_years)
        .bind(&self.sex)
        .bind(&self.hypertension_uncontrolled)
        .bind(&self.abnormal_renal_function)
        .bind(&self.abnormal_liver_function)
        .bind(&self.stroke_history)
        .bind(&self.bleeding_history)
        .bind(&self.labile_inr)
        .bind(&self.antiplatelet_or_nsaid)
        .bind(self.alcohol_units_per_week)
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
        .prefix("api/has_bled_score_for_major_bleeding_risks/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
