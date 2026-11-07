#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::chronic_obstructive_pulmonary_disease_reviews::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub clinician_name: String,
    pub clinician_role: String,
    pub reviewed_at: Option<Date>,
    pub review_type: String,
    pub patient_identifier: String,
    pub age_band: String,
    pub sex: String,
    pub diagnosis_year: Option<i32>,
    pub spirometry_confirmed: String,
    pub exposure_notes: String,
    pub fev1_litres: Option<f64>,
    pub fev1_percent_predicted: Option<f64>,
    pub fvc_litres: Option<f64>,
    pub fev1_fvc_ratio: Option<f64>,
    pub spirometry_date: Option<Date>,
    pub mrc_grade: Option<i32>,
    pub mmrc_grade: Option<i32>,
    pub cat_score: Option<i32>,
    pub exacerbations_last_12m: Option<i32>,
    pub hospitalisations_last_12m: Option<i32>,
    pub last_exacerbation_date: Option<Date>,
    pub rescue_pack_courses: Option<i32>,
    pub smoking_status: String,
    pub pack_years: Option<f64>,
    pub cessation_support_offered: String,
    pub inhaled_therapy: String,
    pub device_type: String,
    pub inhaler_technique_checked: String,
    pub inhaler_technique_adequate: String,
    pub adherence: String,
    pub influenza_vaccine: String,
    pub pneumococcal_vaccine: String,
    pub covid_vaccine: String,
    pub pulmonary_rehab_status: String,
    pub oxygen_use: String,
    pub resting_spo2: Option<i32>,
    pub comorbidities: String,
    pub self_management_plan: String,
    pub rescue_pack_supplied: String,
    pub next_review_interval: String,
    pub clinician_note: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO chronic_obstructive_pulmonary_disease_reviews (patient_id, \
            clinician_id, clinician_name, clinician_role, reviewed_at, review_type, \
            patient_identifier, age_band, sex, diagnosis_year, spirometry_confirmed, \
            exposure_notes, fev1_litres, fev1_percent_predicted, fvc_litres, fev1_fvc_ratio, \
            spirometry_date, mrc_grade, mmrc_grade, cat_score, exacerbations_last_12m, \
            hospitalisations_last_12m, last_exacerbation_date, rescue_pack_courses, \
            smoking_status, pack_years, cessation_support_offered, inhaled_therapy, \
            device_type, inhaler_technique_checked, inhaler_technique_adequate, adherence, \
            influenza_vaccine, pneumococcal_vaccine, covid_vaccine, pulmonary_rehab_status, \
            oxygen_use, resting_spo2, comorbidities, self_management_plan, \
            rescue_pack_supplied, next_review_interval, clinician_note) VALUES ($1, $2, $3, \
            $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, \
            $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, \
            $37, $38, $39, $40, $41, $42, $43) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(self.reviewed_at)
        .bind(&self.review_type)
        .bind(&self.patient_identifier)
        .bind(&self.age_band)
        .bind(&self.sex)
        .bind(self.diagnosis_year)
        .bind(&self.spirometry_confirmed)
        .bind(&self.exposure_notes)
        .bind(self.fev1_litres)
        .bind(self.fev1_percent_predicted)
        .bind(self.fvc_litres)
        .bind(self.fev1_fvc_ratio)
        .bind(self.spirometry_date)
        .bind(self.mrc_grade)
        .bind(self.mmrc_grade)
        .bind(self.cat_score)
        .bind(self.exacerbations_last_12m)
        .bind(self.hospitalisations_last_12m)
        .bind(self.last_exacerbation_date)
        .bind(self.rescue_pack_courses)
        .bind(&self.smoking_status)
        .bind(self.pack_years)
        .bind(&self.cessation_support_offered)
        .bind(&self.inhaled_therapy)
        .bind(&self.device_type)
        .bind(&self.inhaler_technique_checked)
        .bind(&self.inhaler_technique_adequate)
        .bind(&self.adherence)
        .bind(&self.influenza_vaccine)
        .bind(&self.pneumococcal_vaccine)
        .bind(&self.covid_vaccine)
        .bind(&self.pulmonary_rehab_status)
        .bind(&self.oxygen_use)
        .bind(self.resting_spo2)
        .bind(&self.comorbidities)
        .bind(&self.self_management_plan)
        .bind(&self.rescue_pack_supplied)
        .bind(&self.next_review_interval)
        .bind(&self.clinician_note)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE chronic_obstructive_pulmonary_disease_reviews SET patient_id = $2, \
            clinician_id = $3, clinician_name = $4, clinician_role = $5, reviewed_at = \
            $6, review_type = $7, patient_identifier = $8, age_band = $9, sex = $10, \
            diagnosis_year = $11, spirometry_confirmed = $12, exposure_notes = $13, \
            fev1_litres = $14, fev1_percent_predicted = $15, fvc_litres = $16, \
            fev1_fvc_ratio = $17, spirometry_date = $18, mrc_grade = $19, mmrc_grade = \
            $20, cat_score = $21, exacerbations_last_12m = $22, \
            hospitalisations_last_12m = $23, last_exacerbation_date = $24, \
            rescue_pack_courses = $25, smoking_status = $26, pack_years = $27, \
            cessation_support_offered = $28, inhaled_therapy = $29, device_type = $30, \
            inhaler_technique_checked = $31, inhaler_technique_adequate = $32, adherence \
            = $33, influenza_vaccine = $34, pneumococcal_vaccine = $35, covid_vaccine = \
            $36, pulmonary_rehab_status = $37, oxygen_use = $38, resting_spo2 = $39, \
            comorbidities = $40, self_management_plan = $41, rescue_pack_supplied = $42, \
            next_review_interval = $43, clinician_note = $44, updated_at = now() WHERE \
            id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(self.reviewed_at)
        .bind(&self.review_type)
        .bind(&self.patient_identifier)
        .bind(&self.age_band)
        .bind(&self.sex)
        .bind(self.diagnosis_year)
        .bind(&self.spirometry_confirmed)
        .bind(&self.exposure_notes)
        .bind(self.fev1_litres)
        .bind(self.fev1_percent_predicted)
        .bind(self.fvc_litres)
        .bind(self.fev1_fvc_ratio)
        .bind(self.spirometry_date)
        .bind(self.mrc_grade)
        .bind(self.mmrc_grade)
        .bind(self.cat_score)
        .bind(self.exacerbations_last_12m)
        .bind(self.hospitalisations_last_12m)
        .bind(self.last_exacerbation_date)
        .bind(self.rescue_pack_courses)
        .bind(&self.smoking_status)
        .bind(self.pack_years)
        .bind(&self.cessation_support_offered)
        .bind(&self.inhaled_therapy)
        .bind(&self.device_type)
        .bind(&self.inhaler_technique_checked)
        .bind(&self.inhaler_technique_adequate)
        .bind(&self.adherence)
        .bind(&self.influenza_vaccine)
        .bind(&self.pneumococcal_vaccine)
        .bind(&self.covid_vaccine)
        .bind(&self.pulmonary_rehab_status)
        .bind(&self.oxygen_use)
        .bind(self.resting_spo2)
        .bind(&self.comorbidities)
        .bind(&self.self_management_plan)
        .bind(&self.rescue_pack_supplied)
        .bind(&self.next_review_interval)
        .bind(&self.clinician_note)
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
        .prefix("api/chronic_obstructive_pulmonary_disease_reviews/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
