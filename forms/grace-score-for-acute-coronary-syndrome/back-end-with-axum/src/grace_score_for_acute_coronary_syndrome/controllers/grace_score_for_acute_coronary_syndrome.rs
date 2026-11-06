#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::grace_score_for_acute_coronary_syndromes::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub clinician_name: String,
    pub clinician_role: String,
    pub assessed_at: Option<DateTimeWithTimeZone>,
    pub care_setting: String,
    pub presentation_type: String,
    pub patient_identifier: String,
    pub age_years: Option<i32>,
    pub sex: String,
    pub heart_rate: Option<i32>,
    pub systolic_blood_pressure: Option<i32>,
    pub serum_creatinine: Option<f64>,
    pub serum_creatinine_unit: String,
    pub killip_class: String,
    pub cardiac_arrest_at_admission: String,
    pub st_segment_deviation: String,
    pub elevated_cardiac_enzymes: String,
    pub clinical_note: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO grace_score_for_acute_coronary_syndromes (patient_id, clinician_id, \
            clinician_name, clinician_role, assessed_at, care_setting, presentation_type, \
            patient_identifier, age_years, sex, heart_rate, systolic_blood_pressure, \
            serum_creatinine, serum_creatinine_unit, killip_class, \
            cardiac_arrest_at_admission, st_segment_deviation, elevated_cardiac_enzymes, \
            clinical_note) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, \
            $14, $15, $16, $17, $18, $19) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(self.assessed_at)
        .bind(&self.care_setting)
        .bind(&self.presentation_type)
        .bind(&self.patient_identifier)
        .bind(self.age_years)
        .bind(&self.sex)
        .bind(self.heart_rate)
        .bind(self.systolic_blood_pressure)
        .bind(self.serum_creatinine)
        .bind(&self.serum_creatinine_unit)
        .bind(&self.killip_class)
        .bind(&self.cardiac_arrest_at_admission)
        .bind(&self.st_segment_deviation)
        .bind(&self.elevated_cardiac_enzymes)
        .bind(&self.clinical_note)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE grace_score_for_acute_coronary_syndromes SET patient_id = $2, clinician_id \
            = $3, clinician_name = $4, clinician_role = $5, assessed_at = $6, care_setting = \
            $7, presentation_type = $8, patient_identifier = $9, age_years = $10, sex = $11, \
            heart_rate = $12, systolic_blood_pressure = $13, serum_creatinine = $14, \
            serum_creatinine_unit = $15, killip_class = $16, cardiac_arrest_at_admission = \
            $17, st_segment_deviation = $18, elevated_cardiac_enzymes = $19, clinical_note = \
            $20, updated_at = now() WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(self.assessed_at)
        .bind(&self.care_setting)
        .bind(&self.presentation_type)
        .bind(&self.patient_identifier)
        .bind(self.age_years)
        .bind(&self.sex)
        .bind(self.heart_rate)
        .bind(self.systolic_blood_pressure)
        .bind(self.serum_creatinine)
        .bind(&self.serum_creatinine_unit)
        .bind(&self.killip_class)
        .bind(&self.cardiac_arrest_at_admission)
        .bind(&self.st_segment_deviation)
        .bind(&self.elevated_cardiac_enzymes)
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
        .prefix("api/grace_score_for_acute_coronary_syndromes/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
