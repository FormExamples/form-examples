#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::hypertension_reviews::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub clinician_role: String,
    pub reviewed_at: Option<Date>,
    pub practice_site: String,
    pub patient_identifier: String,
    pub age_band: String,
    pub sex: String,
    pub ethnicity: String,
    pub diagnosis_date: Option<Date>,
    pub type2_diabetes: String,
    pub chronic_kidney_disease: String,
    pub established_cvd: String,
    pub atrial_fibrillation: String,
    pub clinic_systolic: Option<i32>,
    pub clinic_diastolic: Option<i32>,
    pub home_systolic: Option<i32>,
    pub home_diastolic: Option<i32>,
    pub monitoring_method: String,
    pub postural_drop: String,
    pub antihypertensive_agents: Option<i32>,
    pub adherence: String,
    pub side_effects: String,
    pub qrisk_percent: Option<f64>,
    pub smoking_status: String,
    pub statin_therapy: String,
    pub bmi: Option<f64>,
    pub lifestyle_advice: String,
    pub serum_creatinine: Option<f64>,
    pub egfr: Option<f64>,
    pub serum_potassium: Option<f64>,
    pub hba1c: Option<f64>,
    pub total_cholesterol: Option<f64>,
    pub hdl_cholesterol: Option<f64>,
    pub urine_acr: Option<f64>,
    pub complications: String,
    pub review_context: String,
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO hypertension_reviews (clinician_role, reviewed_at, practice_site, \
            patient_identifier, age_band, sex, ethnicity, diagnosis_date, type2_diabetes, \
            chronic_kidney_disease, established_cvd, atrial_fibrillation, clinic_systolic, \
            clinic_diastolic, home_systolic, home_diastolic, monitoring_method, \
            postural_drop, antihypertensive_agents, adherence, side_effects, qrisk_percent, \
            smoking_status, statin_therapy, bmi, lifestyle_advice, serum_creatinine, egfr, \
            serum_potassium, hba1c, total_cholesterol, hdl_cholesterol, urine_acr, \
            complications, review_context, patient_id, clinician_id) VALUES ($1, $2, $3, $4, \
            $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, \
            $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37) \
            RETURNING *",
        )
        .bind(&self.clinician_role)
        .bind(self.reviewed_at)
        .bind(&self.practice_site)
        .bind(&self.patient_identifier)
        .bind(&self.age_band)
        .bind(&self.sex)
        .bind(&self.ethnicity)
        .bind(self.diagnosis_date)
        .bind(&self.type2_diabetes)
        .bind(&self.chronic_kidney_disease)
        .bind(&self.established_cvd)
        .bind(&self.atrial_fibrillation)
        .bind(self.clinic_systolic)
        .bind(self.clinic_diastolic)
        .bind(self.home_systolic)
        .bind(self.home_diastolic)
        .bind(&self.monitoring_method)
        .bind(&self.postural_drop)
        .bind(self.antihypertensive_agents)
        .bind(&self.adherence)
        .bind(&self.side_effects)
        .bind(self.qrisk_percent)
        .bind(&self.smoking_status)
        .bind(&self.statin_therapy)
        .bind(self.bmi)
        .bind(&self.lifestyle_advice)
        .bind(self.serum_creatinine)
        .bind(self.egfr)
        .bind(self.serum_potassium)
        .bind(self.hba1c)
        .bind(self.total_cholesterol)
        .bind(self.hdl_cholesterol)
        .bind(self.urine_acr)
        .bind(&self.complications)
        .bind(&self.review_context)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE hypertension_reviews SET clinician_role = $2, reviewed_at = $3, \
            practice_site = $4, patient_identifier = $5, age_band = $6, sex = $7, \
            ethnicity = $8, diagnosis_date = $9, type2_diabetes = $10, \
            chronic_kidney_disease = $11, established_cvd = $12, atrial_fibrillation = \
            $13, clinic_systolic = $14, clinic_diastolic = $15, home_systolic = $16, \
            home_diastolic = $17, monitoring_method = $18, postural_drop = $19, \
            antihypertensive_agents = $20, adherence = $21, side_effects = $22, \
            qrisk_percent = $23, smoking_status = $24, statin_therapy = $25, bmi = $26, \
            lifestyle_advice = $27, serum_creatinine = $28, egfr = $29, serum_potassium \
            = $30, hba1c = $31, total_cholesterol = $32, hdl_cholesterol = $33, \
            urine_acr = $34, complications = $35, review_context = $36, patient_id = \
            $37, clinician_id = $38, updated_at = now() WHERE id = $1 AND deleted_at IS \
            NULL RETURNING *",
        )
        .bind(id)
        .bind(&self.clinician_role)
        .bind(self.reviewed_at)
        .bind(&self.practice_site)
        .bind(&self.patient_identifier)
        .bind(&self.age_band)
        .bind(&self.sex)
        .bind(&self.ethnicity)
        .bind(self.diagnosis_date)
        .bind(&self.type2_diabetes)
        .bind(&self.chronic_kidney_disease)
        .bind(&self.established_cvd)
        .bind(&self.atrial_fibrillation)
        .bind(self.clinic_systolic)
        .bind(self.clinic_diastolic)
        .bind(self.home_systolic)
        .bind(self.home_diastolic)
        .bind(&self.monitoring_method)
        .bind(&self.postural_drop)
        .bind(self.antihypertensive_agents)
        .bind(&self.adherence)
        .bind(&self.side_effects)
        .bind(self.qrisk_percent)
        .bind(&self.smoking_status)
        .bind(&self.statin_therapy)
        .bind(self.bmi)
        .bind(&self.lifestyle_advice)
        .bind(self.serum_creatinine)
        .bind(self.egfr)
        .bind(self.serum_potassium)
        .bind(self.hba1c)
        .bind(self.total_cholesterol)
        .bind(self.hdl_cholesterol)
        .bind(self.urine_acr)
        .bind(&self.complications)
        .bind(&self.review_context)
        .bind(self.patient_id)
        .bind(self.clinician_id)
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
    let page = params.resolve(PAGE_LIMITS)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    Ok(page.respond(total, rows))
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
        .prefix("api/hypertension_reviews/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
