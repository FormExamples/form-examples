#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::medical_certificate_of_cause_of_deaths::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub certifying_doctor_name: String,
    pub certifying_doctor_grade: String,
    pub gmc_reference: String,
    pub place_of_certification: String,
    pub certification_date: Option<Date>,
    pub attended_deceased: String,
    pub last_seen_alive_date: Option<Date>,
    pub deceased_name: String,
    pub sex: String,
    pub date_of_birth: Option<Date>,
    pub age_years: Option<i32>,
    pub patient_identifier: String,
    pub date_of_death: Option<Date>,
    pub time_of_death: Option<String>,
    pub place_of_death: String,
    pub seen_after_death_by: String,
    pub cause_ia_condition: String,
    pub cause_ia_interval: String,
    pub cause_ib_condition: String,
    pub cause_ib_interval: String,
    pub cause_ic_condition: String,
    pub cause_ic_interval: String,
    pub part_ii_conditions: String,
    pub part_ii_interval: String,
    pub referred_to_coroner: String,
    pub coroner_reason: String,
    pub medical_examiner_status: String,
    pub certifier_note: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO medical_certificate_of_cause_of_deaths (patient_id, clinician_id, \
            certifying_doctor_name, certifying_doctor_grade, gmc_reference, \
            place_of_certification, certification_date, attended_deceased, \
            last_seen_alive_date, deceased_name, sex, date_of_birth, age_years, \
            patient_identifier, date_of_death, time_of_death, place_of_death, \
            seen_after_death_by, cause_ia_condition, cause_ia_interval, cause_ib_condition, \
            cause_ib_interval, cause_ic_condition, cause_ic_interval, part_ii_conditions, \
            part_ii_interval, referred_to_coroner, coroner_reason, medical_examiner_status, \
            certifier_note) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, \
            $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, \
            $30) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.certifying_doctor_name)
        .bind(&self.certifying_doctor_grade)
        .bind(&self.gmc_reference)
        .bind(&self.place_of_certification)
        .bind(self.certification_date)
        .bind(&self.attended_deceased)
        .bind(self.last_seen_alive_date)
        .bind(&self.deceased_name)
        .bind(&self.sex)
        .bind(self.date_of_birth)
        .bind(self.age_years)
        .bind(&self.patient_identifier)
        .bind(self.date_of_death)
        .bind(&self.time_of_death)
        .bind(&self.place_of_death)
        .bind(&self.seen_after_death_by)
        .bind(&self.cause_ia_condition)
        .bind(&self.cause_ia_interval)
        .bind(&self.cause_ib_condition)
        .bind(&self.cause_ib_interval)
        .bind(&self.cause_ic_condition)
        .bind(&self.cause_ic_interval)
        .bind(&self.part_ii_conditions)
        .bind(&self.part_ii_interval)
        .bind(&self.referred_to_coroner)
        .bind(&self.coroner_reason)
        .bind(&self.medical_examiner_status)
        .bind(&self.certifier_note)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE medical_certificate_of_cause_of_deaths SET patient_id = $2, \
            clinician_id = $3, certifying_doctor_name = $4, certifying_doctor_grade = \
            $5, gmc_reference = $6, place_of_certification = $7, certification_date = \
            $8, attended_deceased = $9, last_seen_alive_date = $10, deceased_name = $11, \
            sex = $12, date_of_birth = $13, age_years = $14, patient_identifier = $15, \
            date_of_death = $16, time_of_death = $17, place_of_death = $18, \
            seen_after_death_by = $19, cause_ia_condition = $20, cause_ia_interval = \
            $21, cause_ib_condition = $22, cause_ib_interval = $23, cause_ic_condition = \
            $24, cause_ic_interval = $25, part_ii_conditions = $26, part_ii_interval = \
            $27, referred_to_coroner = $28, coroner_reason = $29, \
            medical_examiner_status = $30, certifier_note = $31, updated_at = now() \
            WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.certifying_doctor_name)
        .bind(&self.certifying_doctor_grade)
        .bind(&self.gmc_reference)
        .bind(&self.place_of_certification)
        .bind(self.certification_date)
        .bind(&self.attended_deceased)
        .bind(self.last_seen_alive_date)
        .bind(&self.deceased_name)
        .bind(&self.sex)
        .bind(self.date_of_birth)
        .bind(self.age_years)
        .bind(&self.patient_identifier)
        .bind(self.date_of_death)
        .bind(&self.time_of_death)
        .bind(&self.place_of_death)
        .bind(&self.seen_after_death_by)
        .bind(&self.cause_ia_condition)
        .bind(&self.cause_ia_interval)
        .bind(&self.cause_ib_condition)
        .bind(&self.cause_ib_interval)
        .bind(&self.cause_ic_condition)
        .bind(&self.cause_ic_interval)
        .bind(&self.part_ii_conditions)
        .bind(&self.part_ii_interval)
        .bind(&self.referred_to_coroner)
        .bind(&self.coroner_reason)
        .bind(&self.medical_examiner_status)
        .bind(&self.certifier_note)
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
        .prefix("api/medical_certificate_of_cause_of_deaths/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
