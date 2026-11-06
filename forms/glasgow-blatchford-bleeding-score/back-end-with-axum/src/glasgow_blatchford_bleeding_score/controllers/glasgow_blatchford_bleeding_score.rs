#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::glasgow_blatchford_bleeding_scores::Model;

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
    pub presenting_complaint: String,
    pub patient_identifier: String,
    pub age_band: String,
    pub sex: String,
    pub blood_urea_mmol_l: Option<f64>,
    pub haemoglobin_g_l: Option<f64>,
    pub systolic_blood_pressure_mmhg: Option<i32>,
    pub pulse_beats_per_min: Option<i32>,
    pub melaena_present: String,
    pub syncope: String,
    pub hepatic_disease: String,
    pub cardiac_failure: String,
    pub clinical_note: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO glasgow_blatchford_bleeding_scores (deleted_at, patient_id, \
            clinician_id, clinician_name, clinician_role, assessed_at, care_setting, \
            presenting_complaint, patient_identifier, age_band, sex, blood_urea_mmol_l, \
            haemoglobin_g_l, systolic_blood_pressure_mmhg, pulse_beats_per_min, \
            melaena_present, syncope, hepatic_disease, cardiac_failure, clinical_note) VALUES \
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, \
            $19, $20) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(self.assessed_at)
        .bind(&self.care_setting)
        .bind(&self.presenting_complaint)
        .bind(&self.patient_identifier)
        .bind(&self.age_band)
        .bind(&self.sex)
        .bind(self.blood_urea_mmol_l)
        .bind(self.haemoglobin_g_l)
        .bind(self.systolic_blood_pressure_mmhg)
        .bind(self.pulse_beats_per_min)
        .bind(&self.melaena_present)
        .bind(&self.syncope)
        .bind(&self.hepatic_disease)
        .bind(&self.cardiac_failure)
        .bind(&self.clinical_note)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE glasgow_blatchford_bleeding_scores SET deleted_at = $2, patient_id = $3, \
            clinician_id = $4, clinician_name = $5, clinician_role = $6, assessed_at = $7, \
            care_setting = $8, presenting_complaint = $9, patient_identifier = $10, age_band \
            = $11, sex = $12, blood_urea_mmol_l = $13, haemoglobin_g_l = $14, \
            systolic_blood_pressure_mmhg = $15, pulse_beats_per_min = $16, melaena_present = \
            $17, syncope = $18, hepatic_disease = $19, cardiac_failure = $20, clinical_note = \
            $21, updated_at = now() WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(self.assessed_at)
        .bind(&self.care_setting)
        .bind(&self.presenting_complaint)
        .bind(&self.patient_identifier)
        .bind(&self.age_band)
        .bind(&self.sex)
        .bind(self.blood_urea_mmol_l)
        .bind(self.haemoglobin_g_l)
        .bind(self.systolic_blood_pressure_mmhg)
        .bind(self.pulse_beats_per_min)
        .bind(&self.melaena_present)
        .bind(&self.syncope)
        .bind(&self.hepatic_disease)
        .bind(&self.cardiac_failure)
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
        .prefix("api/glasgow_blatchford_bleeding_scores/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
