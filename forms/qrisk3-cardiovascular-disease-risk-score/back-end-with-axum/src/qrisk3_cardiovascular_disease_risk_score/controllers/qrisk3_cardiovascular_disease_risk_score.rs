#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::qrisk3_cardiovascular_disease_risk_scores::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub clinician_name: String,
    pub clinician_role: String,
    pub assessed_at: Option<DateTimeWithTimeZone>,
    pub care_setting: String,
    pub patient_identifier: String,
    pub age: Option<f64>,
    pub sex: String,
    pub ethnicity: String,
    pub townsend_score: Option<f64>,
    pub postcode: String,
    pub smoking_status: String,
    pub body_mass_index: Option<f64>,
    pub diabetes_status: String,
    pub cholesterol_hdl_ratio: Option<f64>,
    pub systolic_blood_pressure: Option<f64>,
    pub systolic_blood_pressure_sd: Option<f64>,
    pub on_blood_pressure_treatment: String,
    pub family_history_chd: String,
    pub atrial_fibrillation: String,
    pub chronic_kidney_disease_stage: String,
    pub migraine: String,
    pub rheumatoid_arthritis: String,
    pub systemic_lupus_erythematosus: String,
    pub severe_mental_illness: String,
    pub erectile_dysfunction: String,
    pub on_atypical_antipsychotics: String,
    pub on_corticosteroids: String,
    pub has_established_cvd: String,
    pub has_familial_hypercholesterolaemia: String,
    pub clinical_note: String,
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO qrisk3_cardiovascular_disease_risk_scores (clinician_name, \
            clinician_role, assessed_at, care_setting, patient_identifier, age, sex, \
            ethnicity, townsend_score, postcode, smoking_status, body_mass_index, \
            diabetes_status, cholesterol_hdl_ratio, systolic_blood_pressure, \
            systolic_blood_pressure_sd, on_blood_pressure_treatment, family_history_chd, \
            atrial_fibrillation, chronic_kidney_disease_stage, migraine, \
            rheumatoid_arthritis, systemic_lupus_erythematosus, severe_mental_illness, \
            erectile_dysfunction, on_atypical_antipsychotics, on_corticosteroids, \
            has_established_cvd, has_familial_hypercholesterolaemia, clinical_note, \
            patient_id, clinician_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, \
            $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, \
            $28, $29, $30, $31, $32) RETURNING *",
        )
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(self.assessed_at)
        .bind(&self.care_setting)
        .bind(&self.patient_identifier)
        .bind(self.age)
        .bind(&self.sex)
        .bind(&self.ethnicity)
        .bind(self.townsend_score)
        .bind(&self.postcode)
        .bind(&self.smoking_status)
        .bind(self.body_mass_index)
        .bind(&self.diabetes_status)
        .bind(self.cholesterol_hdl_ratio)
        .bind(self.systolic_blood_pressure)
        .bind(self.systolic_blood_pressure_sd)
        .bind(&self.on_blood_pressure_treatment)
        .bind(&self.family_history_chd)
        .bind(&self.atrial_fibrillation)
        .bind(&self.chronic_kidney_disease_stage)
        .bind(&self.migraine)
        .bind(&self.rheumatoid_arthritis)
        .bind(&self.systemic_lupus_erythematosus)
        .bind(&self.severe_mental_illness)
        .bind(&self.erectile_dysfunction)
        .bind(&self.on_atypical_antipsychotics)
        .bind(&self.on_corticosteroids)
        .bind(&self.has_established_cvd)
        .bind(&self.has_familial_hypercholesterolaemia)
        .bind(&self.clinical_note)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE qrisk3_cardiovascular_disease_risk_scores SET clinician_name = $2, \
            clinician_role = $3, assessed_at = $4, care_setting = $5, patient_identifier = \
            $6, age = $7, sex = $8, ethnicity = $9, townsend_score = $10, postcode = $11, \
            smoking_status = $12, body_mass_index = $13, diabetes_status = $14, \
            cholesterol_hdl_ratio = $15, systolic_blood_pressure = $16, \
            systolic_blood_pressure_sd = $17, on_blood_pressure_treatment = $18, \
            family_history_chd = $19, atrial_fibrillation = $20, chronic_kidney_disease_stage \
            = $21, migraine = $22, rheumatoid_arthritis = $23, systemic_lupus_erythematosus = \
            $24, severe_mental_illness = $25, erectile_dysfunction = $26, \
            on_atypical_antipsychotics = $27, on_corticosteroids = $28, has_established_cvd = \
            $29, has_familial_hypercholesterolaemia = $30, clinical_note = $31, patient_id = \
            $32, clinician_id = $33, updated_at = now() WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(self.assessed_at)
        .bind(&self.care_setting)
        .bind(&self.patient_identifier)
        .bind(self.age)
        .bind(&self.sex)
        .bind(&self.ethnicity)
        .bind(self.townsend_score)
        .bind(&self.postcode)
        .bind(&self.smoking_status)
        .bind(self.body_mass_index)
        .bind(&self.diabetes_status)
        .bind(self.cholesterol_hdl_ratio)
        .bind(self.systolic_blood_pressure)
        .bind(self.systolic_blood_pressure_sd)
        .bind(&self.on_blood_pressure_treatment)
        .bind(&self.family_history_chd)
        .bind(&self.atrial_fibrillation)
        .bind(&self.chronic_kidney_disease_stage)
        .bind(&self.migraine)
        .bind(&self.rheumatoid_arthritis)
        .bind(&self.systemic_lupus_erythematosus)
        .bind(&self.severe_mental_illness)
        .bind(&self.erectile_dysfunction)
        .bind(&self.on_atypical_antipsychotics)
        .bind(&self.on_corticosteroids)
        .bind(&self.has_established_cvd)
        .bind(&self.has_familial_hypercholesterolaemia)
        .bind(&self.clinical_note)
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
        .prefix("api/qrisk3_cardiovascular_disease_risk_scores/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
