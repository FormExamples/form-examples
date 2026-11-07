#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::sequential_organ_failure_assessments::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub assessor_name: String,
    pub assessor_role: String,
    pub assessor_registration_number: String,
    pub assessed_at: Option<DateTimeWithTimeZone>,
    pub care_location: String,
    pub hours_since_admission: Option<i32>,
    pub patient_identifier: String,
    pub age_years: Option<i32>,
    pub sex: String,
    pub admission_diagnosis: String,
    pub suspected_infection: String,
    pub baseline_sofa_total: Option<i32>,
    pub pao2: Option<f64>,
    pub fio2: Option<f64>,
    pub pao2_fio2_ratio: Option<f64>,
    pub respiratory_support: String,
    pub platelets: Option<f64>,
    pub bilirubin: Option<f64>,
    pub map: Option<f64>,
    pub vasopressor: String,
    pub vasopressor_dose: Option<f64>,
    pub glasgow_coma_scale: Option<i32>,
    pub sedated: bool,
    pub creatinine: Option<f64>,
    pub urine_output: Option<i32>,
    pub clinical_note: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO sequential_organ_failure_assessments (patient_id, clinician_id, \
            assessor_name, assessor_role, assessor_registration_number, assessed_at, \
            care_location, hours_since_admission, patient_identifier, age_years, sex, \
            admission_diagnosis, suspected_infection, baseline_sofa_total, pao2, fio2, \
            pao2_fio2_ratio, respiratory_support, platelets, bilirubin, map, vasopressor, \
            vasopressor_dose, glasgow_coma_scale, sedated, creatinine, urine_output, \
            clinical_note) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, \
            $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28) \
            RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.assessor_name)
        .bind(&self.assessor_role)
        .bind(&self.assessor_registration_number)
        .bind(self.assessed_at)
        .bind(&self.care_location)
        .bind(self.hours_since_admission)
        .bind(&self.patient_identifier)
        .bind(self.age_years)
        .bind(&self.sex)
        .bind(&self.admission_diagnosis)
        .bind(&self.suspected_infection)
        .bind(self.baseline_sofa_total)
        .bind(self.pao2)
        .bind(self.fio2)
        .bind(self.pao2_fio2_ratio)
        .bind(&self.respiratory_support)
        .bind(self.platelets)
        .bind(self.bilirubin)
        .bind(self.map)
        .bind(&self.vasopressor)
        .bind(self.vasopressor_dose)
        .bind(self.glasgow_coma_scale)
        .bind(self.sedated)
        .bind(self.creatinine)
        .bind(self.urine_output)
        .bind(&self.clinical_note)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE sequential_organ_failure_assessments SET patient_id = $2, \
            clinician_id = $3, assessor_name = $4, assessor_role = $5, \
            assessor_registration_number = $6, assessed_at = $7, care_location = $8, \
            hours_since_admission = $9, patient_identifier = $10, age_years = $11, sex = \
            $12, admission_diagnosis = $13, suspected_infection = $14, \
            baseline_sofa_total = $15, pao2 = $16, fio2 = $17, pao2_fio2_ratio = $18, \
            respiratory_support = $19, platelets = $20, bilirubin = $21, map = $22, \
            vasopressor = $23, vasopressor_dose = $24, glasgow_coma_scale = $25, sedated \
            = $26, creatinine = $27, urine_output = $28, clinical_note = $29, updated_at \
            = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.assessor_name)
        .bind(&self.assessor_role)
        .bind(&self.assessor_registration_number)
        .bind(self.assessed_at)
        .bind(&self.care_location)
        .bind(self.hours_since_admission)
        .bind(&self.patient_identifier)
        .bind(self.age_years)
        .bind(&self.sex)
        .bind(&self.admission_diagnosis)
        .bind(&self.suspected_infection)
        .bind(self.baseline_sofa_total)
        .bind(self.pao2)
        .bind(self.fio2)
        .bind(self.pao2_fio2_ratio)
        .bind(&self.respiratory_support)
        .bind(self.platelets)
        .bind(self.bilirubin)
        .bind(self.map)
        .bind(&self.vasopressor)
        .bind(self.vasopressor_dose)
        .bind(self.glasgow_coma_scale)
        .bind(self.sedated)
        .bind(self.creatinine)
        .bind(self.urine_output)
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
        .prefix("api/sequential_organ_failure_assessments/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
