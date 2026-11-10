#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::rockall_score_for_upper_gastrointestinal_bleedings::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub clinician_name: String,
    pub clinician_role: String,
    pub assessed_at: Option<DateTimeWithTimeZone>,
    pub care_setting: String,
    pub presenting_complaint: String,
    pub patient_identifier: String,
    pub age_years: Option<i32>,
    pub sex: String,
    pub systolic_blood_pressure_mmhg: Option<i32>,
    pub heart_rate_bpm: Option<i32>,
    pub comorbidity: String,
    pub endoscopy_performed: String,
    pub diagnosis: String,
    pub stigmata_recent_haemorrhage: String,
    pub clinical_note: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO rockall_score_for_upper_gastrointestinal_bleedings (patient_id, \
            clinician_id, clinician_name, clinician_role, assessed_at, care_setting, \
            presenting_complaint, patient_identifier, age_years, sex, \
            systolic_blood_pressure_mmhg, heart_rate_bpm, comorbidity, \
            endoscopy_performed, diagnosis, stigmata_recent_haemorrhage, clinical_note) \
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, \
            $16, $17) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(self.assessed_at)
        .bind(&self.care_setting)
        .bind(&self.presenting_complaint)
        .bind(&self.patient_identifier)
        .bind(self.age_years)
        .bind(&self.sex)
        .bind(self.systolic_blood_pressure_mmhg)
        .bind(self.heart_rate_bpm)
        .bind(&self.comorbidity)
        .bind(&self.endoscopy_performed)
        .bind(&self.diagnosis)
        .bind(&self.stigmata_recent_haemorrhage)
        .bind(&self.clinical_note)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE rockall_score_for_upper_gastrointestinal_bleedings SET patient_id = \
            $2, clinician_id = $3, clinician_name = $4, clinician_role = $5, assessed_at \
            = $6, care_setting = $7, presenting_complaint = $8, patient_identifier = $9, \
            age_years = $10, sex = $11, systolic_blood_pressure_mmhg = $12, \
            heart_rate_bpm = $13, comorbidity = $14, endoscopy_performed = $15, \
            diagnosis = $16, stigmata_recent_haemorrhage = $17, clinical_note = $18, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(self.assessed_at)
        .bind(&self.care_setting)
        .bind(&self.presenting_complaint)
        .bind(&self.patient_identifier)
        .bind(self.age_years)
        .bind(&self.sex)
        .bind(self.systolic_blood_pressure_mmhg)
        .bind(self.heart_rate_bpm)
        .bind(&self.comorbidity)
        .bind(&self.endoscopy_performed)
        .bind(&self.diagnosis)
        .bind(&self.stigmata_recent_haemorrhage)
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
        .prefix("api/rockall_score_for_upper_gastrointestinal_bleedings/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
