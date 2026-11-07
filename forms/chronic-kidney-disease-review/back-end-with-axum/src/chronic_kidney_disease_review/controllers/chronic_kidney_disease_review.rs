#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::chronic_kidney_disease_reviews::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub clinician_name: String,
    pub clinician_role: String,
    pub reviewed_at: Option<Date>,
    pub care_setting: String,
    pub review_type: String,
    pub patient_identifier: String,
    pub age_band: String,
    pub sex: String,
    pub diabetes_status: String,
    pub primary_cause: String,
    pub months_since_diagnosis: Option<i32>,
    pub egfr: Option<f64>,
    pub egfr_sample_date: Option<Date>,
    pub previous_egfr: Option<f64>,
    pub previous_egfr_date: Option<Date>,
    pub acr: Option<f64>,
    pub acr_sample_date: Option<Date>,
    pub acr_measured: String,
    pub systolic_blood_pressure: Option<i32>,
    pub diastolic_blood_pressure: Option<i32>,
    pub acei_or_arb_prescribed: String,
    pub sglt2i_prescribed: String,
    pub statin_prescribed: String,
    pub nephrotoxic_drug_present: String,
    pub nephrotoxic_dose_adjusted: String,
    pub medication_review_completed: String,
    pub hba1c: Option<f64>,
    pub potassium: Option<f64>,
    pub bicarbonate: Option<f64>,
    pub calcium: Option<f64>,
    pub phosphate: Option<f64>,
    pub pth: Option<f64>,
    pub haemoglobin: Option<f64>,
    pub referral_decision: String,
    pub clinical_note: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO chronic_kidney_disease_reviews (patient_id, clinician_id, \
            clinician_name, clinician_role, reviewed_at, care_setting, review_type, \
            patient_identifier, age_band, sex, diabetes_status, primary_cause, \
            months_since_diagnosis, egfr, egfr_sample_date, previous_egfr, \
            previous_egfr_date, acr, acr_sample_date, acr_measured, systolic_blood_pressure, \
            diastolic_blood_pressure, acei_or_arb_prescribed, sglt2i_prescribed, \
            statin_prescribed, nephrotoxic_drug_present, nephrotoxic_dose_adjusted, \
            medication_review_completed, hba1c, potassium, bicarbonate, calcium, phosphate, \
            pth, haemoglobin, referral_decision, clinical_note) VALUES ($1, $2, $3, $4, $5, \
            $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, \
            $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37) \
            RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(self.reviewed_at)
        .bind(&self.care_setting)
        .bind(&self.review_type)
        .bind(&self.patient_identifier)
        .bind(&self.age_band)
        .bind(&self.sex)
        .bind(&self.diabetes_status)
        .bind(&self.primary_cause)
        .bind(self.months_since_diagnosis)
        .bind(self.egfr)
        .bind(self.egfr_sample_date)
        .bind(self.previous_egfr)
        .bind(self.previous_egfr_date)
        .bind(self.acr)
        .bind(self.acr_sample_date)
        .bind(&self.acr_measured)
        .bind(self.systolic_blood_pressure)
        .bind(self.diastolic_blood_pressure)
        .bind(&self.acei_or_arb_prescribed)
        .bind(&self.sglt2i_prescribed)
        .bind(&self.statin_prescribed)
        .bind(&self.nephrotoxic_drug_present)
        .bind(&self.nephrotoxic_dose_adjusted)
        .bind(&self.medication_review_completed)
        .bind(self.hba1c)
        .bind(self.potassium)
        .bind(self.bicarbonate)
        .bind(self.calcium)
        .bind(self.phosphate)
        .bind(self.pth)
        .bind(self.haemoglobin)
        .bind(&self.referral_decision)
        .bind(&self.clinical_note)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE chronic_kidney_disease_reviews SET patient_id = $2, clinician_id = \
            $3, clinician_name = $4, clinician_role = $5, reviewed_at = $6, care_setting \
            = $7, review_type = $8, patient_identifier = $9, age_band = $10, sex = $11, \
            diabetes_status = $12, primary_cause = $13, months_since_diagnosis = $14, \
            egfr = $15, egfr_sample_date = $16, previous_egfr = $17, previous_egfr_date \
            = $18, acr = $19, acr_sample_date = $20, acr_measured = $21, \
            systolic_blood_pressure = $22, diastolic_blood_pressure = $23, \
            acei_or_arb_prescribed = $24, sglt2i_prescribed = $25, statin_prescribed = \
            $26, nephrotoxic_drug_present = $27, nephrotoxic_dose_adjusted = $28, \
            medication_review_completed = $29, hba1c = $30, potassium = $31, bicarbonate \
            = $32, calcium = $33, phosphate = $34, pth = $35, haemoglobin = $36, \
            referral_decision = $37, clinical_note = $38, updated_at = now() WHERE id = \
            $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(self.reviewed_at)
        .bind(&self.care_setting)
        .bind(&self.review_type)
        .bind(&self.patient_identifier)
        .bind(&self.age_band)
        .bind(&self.sex)
        .bind(&self.diabetes_status)
        .bind(&self.primary_cause)
        .bind(self.months_since_diagnosis)
        .bind(self.egfr)
        .bind(self.egfr_sample_date)
        .bind(self.previous_egfr)
        .bind(self.previous_egfr_date)
        .bind(self.acr)
        .bind(self.acr_sample_date)
        .bind(&self.acr_measured)
        .bind(self.systolic_blood_pressure)
        .bind(self.diastolic_blood_pressure)
        .bind(&self.acei_or_arb_prescribed)
        .bind(&self.sglt2i_prescribed)
        .bind(&self.statin_prescribed)
        .bind(&self.nephrotoxic_drug_present)
        .bind(&self.nephrotoxic_dose_adjusted)
        .bind(&self.medication_review_completed)
        .bind(self.hba1c)
        .bind(self.potassium)
        .bind(self.bicarbonate)
        .bind(self.calcium)
        .bind(self.phosphate)
        .bind(self.pth)
        .bind(self.haemoglobin)
        .bind(&self.referral_decision)
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
        .prefix("api/chronic_kidney_disease_reviews/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
